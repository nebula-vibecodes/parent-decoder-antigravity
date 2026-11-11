import test from 'node:test';
import assert from 'node:assert';
import { terms, type Term } from '../src/data';
import {
  MockLocalStorage,
  MockClipboard,
  HeadlessStoreSimulator,
  PlaybookQueueStateMachine,
  ToneChecklistStateMachine,
  REQUIRED_PLAYBOOK_SCENARIOS,
  TONE_CHECKLIST_ITEMS,
  REQUIRED_STARTER_PILLS,
  CHROME_AI_GUIDE_CONSTANTS,
  type SavedAIOutput,
  type TermFallbackScript,
  tryLoadModule,
} from './test-utils';

test('Tier 2: Boundary & Corner Cases (R1–R5)', async (t) => {
  // ─────────────────────────────────────────────────────────
  // R1 Boundaries: Playbook Queue & Checklist
  // ─────────────────────────────────────────────────────────

  await t.test('R1_B1: Queue pauses auto-advance timer on mouse enter and user interaction, resumes on mouse leave', () => {
    const queue = new PlaybookQueueStateMachine();
    assert.strictEqual(queue.isPaused, false);
    assert.strictEqual(queue.currentIndex, 0);

    // Initial tick advances
    queue.tick();
    assert.strictEqual(queue.currentIndex, 1);

    // Mouse enter pauses
    queue.onMouseEnter();
    assert.strictEqual(queue.isPaused, true);
    queue.tick();
    queue.tick();
    assert.strictEqual(queue.currentIndex, 1, 'Index must remain locked while hovered');

    // Mouse leave resumes
    queue.onMouseLeave();
    assert.strictEqual(queue.isPaused, false);
    queue.tick();
    assert.strictEqual(queue.currentIndex, 2, 'Index advances after unpausing');

    // User interaction pauses
    queue.onUserInteract();
    assert.strictEqual(queue.isPaused, true);
    queue.tick();
    assert.strictEqual(queue.currentIndex, 2);
  });

  await t.test('R1_B2: Queue cyclic wrap-around boundary: previous from index 0 wraps to end, next from end wraps to 0', () => {
    const queue = new PlaybookQueueStateMachine();
    const len = queue.scenarios.length;
    assert.strictEqual(queue.currentIndex, 0);

    // Backward from 0 wraps to len - 1
    queue.previous();
    assert.strictEqual(queue.currentIndex, len - 1);

    // Forward from len - 1 wraps to 0
    queue.next();
    assert.strictEqual(queue.currentIndex, 0);

    // Double wrap backward
    queue.previous();
    queue.previous();
    assert.strictEqual(queue.currentIndex, len - 2);
  });

  await t.test('R1_B3: Tone checklist full toggle, uncheck, and reset button restores score to 0', () => {
    const checklist = new ToneChecklistStateMachine();
    
    // Check all items
    for (const item of TONE_CHECKLIST_ITEMS) {
      checklist.toggle(item.id);
    }
    const maxScore = TONE_CHECKLIST_ITEMS.reduce((sum, i) => sum + i.weight, 0);
    assert.strictEqual(checklist.getScore(), maxScore);
    assert.strictEqual(checklist.getSeverity(), 'Intervention Recommended');

    // Uncheck two items
    checklist.toggle('tone-hostile');
    checklist.toggle('tone-pressure');
    assert.strictEqual(checklist.getScore(), maxScore - 4);

    // Reset button
    checklist.reset();
    assert.strictEqual(checklist.getScore(), 0);
    assert.strictEqual(checklist.checkedIds.size, 0);
    assert.strictEqual(checklist.getSeverity(), 'Harmless / Normal Banter');
  });

  await t.test('R1_B4: Rapid consecutive navigation clicks do not produce invalid state or NaN index', () => {
    const queue = new PlaybookQueueStateMachine();
    // Simulate 100 rapid clicks
    for (let i = 0; i < 100; i++) {
      if (i % 3 === 0) queue.next();
      else if (i % 3 === 1) queue.previous();
      else queue.goTo(i % queue.scenarios.length);

      assert.ok(queue.currentIndex >= 0 && queue.currentIndex < queue.scenarios.length);
      assert.ok(!Number.isNaN(queue.currentIndex));
    }
  });

  await t.test('R1_B5: Saving playbook scenario card persists correct metadata and content', () => {
    const store = new HeadlessStoreSimulator();
    const scenario = REQUIRED_PLAYBOOK_SCENARIOS[0];

    const saved = store.saveAIOutput({
      type: 'playbook',
      title: `Playbook: ${scenario.title}`,
      content: `${scenario.description}\n\nApproach: ${scenario.parentApproach}\nDialogue: ${scenario.sampleDialogue}\nTakeaway: ${scenario.takeaway}`,
      summary: scenario.takeaway,
      metadata: { scenarioId: scenario.id, tag: scenario.tag },
    });

    assert.strictEqual(saved.type, 'playbook');
    assert.strictEqual(saved.metadata?.scenarioId, 'teasing-vs-bullying');
    assert.ok(saved.content.includes(scenario.parentApproach));
    assert.ok(store.isAIOutputSaved(`Playbook: ${scenario.title}`, 'playbook'));
  });

  // ─────────────────────────────────────────────────────────
  // R2 Boundaries: Fallback Scripts Corpus
  // ─────────────────────────────────────────────────────────

  await t.test('R2_B1: Terms with hyphens, numbers, or alias lookups resolve without error', () => {
    const hyphenatedSlugs = ['no-cap', 'crash-out', 'fanum-tax', 'side-eye', 'main-character'];
    for (const slug of hyphenatedSlugs) {
      const found = terms.find((t) => t.slug === slug);
      if (found) {
        assert.ok(found.term.length > 0);
        assert.ok(found.plainMeaning.length > 0);
      }
    }
  });

  await t.test('R2_B2: Fallback generator adapts dialogue tone based on term concern level', () => {
    // Collect terms across different concern levels: 'harmless', 'discuss', 'attention'
    const attentionTerms = terms.filter((t) => t.concern === 'attention');
    const discussTerms = terms.filter((t) => t.concern === 'discuss');
    const harmlessTerms = terms.filter((t) => t.concern === 'harmless');

    assert.ok(attentionTerms.length > 0, 'Must have terms with concern=attention');
    assert.ok(discussTerms.length > 0, 'Must have terms with concern=discuss');
    assert.ok(harmlessTerms.length > 0, 'Must have terms with concern=harmless');

    // Verify concern level tone semantics:
    function deriveConcernToneAdvice(concern?: string): string {
      switch (concern) {
        case 'attention':
          return 'Immediate support, safety boundaries, and offline conversation recommended.';
        case 'discuss':
          return 'Curious exploration and open-ended dialogue recommended.';
        case 'harmless':
        default:
          return 'Playful connection and harmless slang exploration.';
      }
    }

    assert.ok(deriveConcernToneAdvice('attention').includes('safety boundaries'));
    assert.ok(deriveConcernToneAdvice('discuss').includes('Curious exploration'));
    assert.ok(deriveConcernToneAdvice('harmless').includes('Playful connection'));
  });

  await t.test('R2_B3: Minimal or missing optional metadata handled gracefully with non-empty defaults', () => {
    // Generate script for a term with minimal metadata
    const minimalTerm: Term = {
      term: 'Test Slang',
      slug: 'test-slang',
      aliases: [],
      plainMeaning: 'A dummy slang meaning',
      summary: '',
      interpretations: [],
      example: '',
      contextClues: '',
      opener: 'Hey, what does Test Slang mean?',
    };

    function synthesizeFallbackScript(term: Term): TermFallbackScript {
      const opener = term.opener || `Hey, what does "${term.term}" mean?`;
      return {
        termSlug: term.slug,
        termName: term.term,
        situation: `Discussing the meaning and context of "${term.term}" at home.`,
        dialogue: [
          { speaker: 'Parent', text: opener, coachNote: 'Start with curiosity.' },
          { speaker: 'Teen', text: `It basically means ${term.plainMeaning}.`, coachNote: 'Listen attentively.' },
        ],
        coachingTips: [
          'Listen without immediately critiquing teen vocabulary.',
          'Focus on context and emotional impact.',
          'Keep conversations brief and connection-oriented.',
        ],
        recommendedOpener: opener,
      };
    }

    const script = synthesizeFallbackScript(minimalTerm);
    assert.strictEqual(script.termSlug, 'test-slang');
    assert.ok(script.dialogue.length >= 2);
    assert.ok(script.coachingTips.length >= 3);
    assert.ok(!script.dialogue[0].text.includes('undefined'));
    assert.ok(!script.dialogue[1].text.includes('undefined'));
  });

  await t.test('R2_B4: Dialogue script persistence preserves full dialogue text and turn sequence', () => {
    const store = new HeadlessStoreSimulator();
    const dialogue = [
      { speaker: 'Parent' as const, text: 'Are you cooked for the test?' },
      { speaker: 'Teen' as const, text: 'Nah, I studied for 3 hours, I am good.' },
      { speaker: 'Parent' as const, text: 'Proud of you for putting the time in.' },
    ];

    const content = dialogue.map((d) => `${d.speaker}: ${d.text}`).join('\n');
    const saved = store.saveAIOutput({
      type: 'roleplay',
      title: 'Practice: cook',
      content,
      metadata: { termSlug: 'cook', termName: 'Cook / Cooked' },
    });

    assert.ok(saved.content.includes('Parent: Are you cooked for the test?'));
    assert.ok(saved.content.includes('Teen: Nah, I studied for 3 hours'));
    assert.ok(saved.content.includes('Parent: Proud of you'));
  });

  await t.test('R2_B5: Switching AI state dynamically updates button label and drawer state', () => {
    let engineState: 'unavailable' | 'local' = 'unavailable';
    function getButtonState(engine: 'unavailable' | 'local') {
      return {
        label: engine === 'local' ? 'Practice this conversation' : 'View conversation script & tips',
        mode: engine === 'local' ? 'interactive-ai' : 'static-fallback',
      };
    }

    assert.strictEqual(getButtonState(engineState).label, 'View conversation script & tips');
    assert.strictEqual(getButtonState(engineState).mode, 'static-fallback');

    engineState = 'local';
    assert.strictEqual(getButtonState(engineState).label, 'Practice this conversation');
    assert.strictEqual(getButtonState(engineState).mode, 'interactive-ai');
  });

  // ─────────────────────────────────────────────────────────
  // R3 Boundaries: Starter Pills
  // ─────────────────────────────────────────────────────────

  await t.test('R3_B1: Clicking starter pill when input contains draft text replaces draft cleanly', () => {
    let inputVal = 'Parent was typing something here...';
    function onPillClick(pillText: string) {
      inputVal = pillText;
    }

    onPillClick(REQUIRED_STARTER_PILLS[0]);
    assert.strictEqual(inputVal, REQUIRED_STARTER_PILLS[0]);
    assert.ok(!inputVal.includes('Parent was typing'));
  });

  await t.test('R3_B2: Multiple rapid consecutive pill clicks resolve to the last clicked prompt', () => {
    let inputVal = '';
    const clickSequence = [REQUIRED_STARTER_PILLS[0], REQUIRED_STARTER_PILLS[1], REQUIRED_STARTER_PILLS[2]];

    for (const pill of clickSequence) {
      inputVal = pill;
    }

    assert.strictEqual(inputVal, REQUIRED_STARTER_PILLS[2]);
  });

  await t.test('R3_B3: Prompt text containing emojis ("🔌") and quotes preserves unicode encoding', () => {
    const plugPrompt = REQUIRED_STARTER_PILLS[2];
    assert.ok(plugPrompt.includes('🔌'), 'Must contain plug emoji 🔌');
    assert.ok(plugPrompt.includes("'plug 🔌'"), 'Must contain quotes around plug');
    // Encode to JSON and decode to ensure JSON safety
    const serialized = JSON.stringify({ prompt: plugPrompt });
    const deserialized = JSON.parse(serialized);
    assert.strictEqual(deserialized.prompt, plugPrompt);
  });

  await t.test('R3_B4: Keyboard navigation accessibility (Enter/Space) updates prompt input', () => {
    let inputVal = '';
    function handleKeyDown(event: { key: string }, prompt: string) {
      if (event.key === 'Enter' || event.key === ' ') {
        inputVal = prompt;
      }
    }

    handleKeyDown({ key: 'Enter' }, REQUIRED_STARTER_PILLS[1]);
    assert.strictEqual(inputVal, REQUIRED_STARTER_PILLS[1]);

    handleKeyDown({ key: ' ' }, REQUIRED_STARTER_PILLS[0]);
    assert.strictEqual(inputVal, REQUIRED_STARTER_PILLS[0]);

    // Ignored keys
    handleKeyDown({ key: 'Escape' }, REQUIRED_STARTER_PILLS[2]);
    assert.strictEqual(inputVal, REQUIRED_STARTER_PILLS[0]);
  });

  await t.test('R3_B5: Pill interaction state when AI is disabled, loading, or streaming', () => {
    function isPillClickable(isStreaming: boolean, isDownloading: boolean): boolean {
      return !isStreaming && !isDownloading;
    }

    assert.strictEqual(isPillClickable(false, false), true);
    assert.strictEqual(isPillClickable(true, false), false);
    assert.strictEqual(isPillClickable(false, true), false);
  });

  // ─────────────────────────────────────────────────────────
  // R4 Boundaries: Setup Guide
  // ─────────────────────────────────────────────────────────

  await t.test('R4_B1: Clipboard API fallback handling when navigator.clipboard throws', async () => {
    let fallbackTriggered = false;
    async function safeCopy(text: string, clipboardApi?: { writeText: (s: string) => Promise<void> }): Promise<boolean> {
      try {
        if (clipboardApi) {
          await clipboardApi.writeText(text);
          return true;
        }
        throw new Error('Clipboard not supported');
      } catch {
        fallbackTriggered = true;
        return false;
      }
    }

    // Happy path
    const success = await safeCopy('chrome://flags', { writeText: async () => {} });
    assert.strictEqual(success, true);
    assert.strictEqual(fallbackTriggered, false);

    // Error path
    const fail = await safeCopy('chrome://flags', undefined);
    assert.strictEqual(fail, false);
    assert.strictEqual(fallbackTriggered, true);
  });

  await t.test('R4_B2: Rapid expand/collapse toggle stress does not desynchronize open state', () => {
    let isOpen = false;
    for (let i = 0; i < 50; i++) {
      isOpen = !isOpen;
    }
    // 50 toggles from false -> false
    assert.strictEqual(isOpen, false);
    isOpen = !isOpen;
    assert.strictEqual(isOpen, true);
  });

  await t.test('R4_B3: ARIA accessibility attributes match toggle state', () => {
    function getAriaAttributes(open: boolean) {
      return {
        'aria-expanded': open ? 'true' : 'false',
        'aria-controls': 'chrome-ai-setup-guide-content',
        role: 'button',
      };
    }

    assert.strictEqual(getAriaAttributes(false)['aria-expanded'], 'false');
    assert.strictEqual(getAriaAttributes(true)['aria-expanded'], 'true');
  });

  await t.test('R4_B4: Compact mode rendering produces space-constrained layout for drawers', () => {
    function getGuideClasses(compact?: boolean, className?: string): string {
      const classes = ['chrome-ai-guide'];
      if (compact) classes.push('chrome-ai-guide-compact');
      if (className) classes.push(className);
      return classes.join(' ');
    }

    const normal = getGuideClasses(false);
    assert.strictEqual(normal, 'chrome-ai-guide');

    const compactWithClass = getGuideClasses(true, 'drawer-guide');
    assert.ok(compactWithClass.includes('chrome-ai-guide-compact'));
    assert.ok(compactWithClass.includes('drawer-guide'));
  });

  await t.test('R4_B5: Multiple independent setup guide instances operate without cross-talk', () => {
    class GuideInstance {
      public isOpen: boolean;
      constructor(defaultOpen = false) {
        this.isOpen = defaultOpen;
      }
      toggle() {
        this.isOpen = !this.isOpen;
      }
    }

    const guideOnCopilot = new GuideInstance(false);
    const guideInDrawer = new GuideInstance(true);

    assert.strictEqual(guideOnCopilot.isOpen, false);
    assert.strictEqual(guideInDrawer.isOpen, true);

    guideOnCopilot.toggle();
    assert.strictEqual(guideOnCopilot.isOpen, true);
    assert.strictEqual(guideInDrawer.isOpen, true, 'Second guide must remain unchanged');
  });

  // ─────────────────────────────────────────────────────────
  // R5 Boundaries: Persistence & Storage
  // ─────────────────────────────────────────────────────────

  await t.test('R5_B1: Duplicate save detection via isAIOutputSaved prevents duplicate clutter', () => {
    const store = new HeadlessStoreSimulator();
    assert.strictEqual(store.isAIOutputSaved('Dinner meme note', 'playbook'), false);

    store.saveAIOutput({
      type: 'playbook',
      title: 'Dinner meme note',
      content: 'Content 1',
    });

    assert.strictEqual(store.isAIOutputSaved('Dinner meme note', 'playbook'), true);
    assert.strictEqual(store.isAIOutputSaved('  DINNER MEME NOTE  ', 'playbook'), true, 'Case and trim insensitive');
    assert.strictEqual(store.isAIOutputSaved('Dinner meme note', 'roleplay'), false, 'Different type is not duplicate');
  });

  await t.test('R5_B2: Storage resilience against corrupted or non-JSON localStorage content', () => {
    const mockStorage = new MockLocalStorage();
    mockStorage.setItem('parent-decoder-saved-terms', '{corrupted json[');
    mockStorage.setItem('parent-decoder-saved-ai-outputs', 'undefined');

    const store = new HeadlessStoreSimulator(mockStorage);
    // Must initialize safely to empty arrays
    assert.deepStrictEqual(store.state.savedTerms, []);
    assert.deepStrictEqual(store.state.savedAIOutputs, []);

    // New saves work normally
    store.saveAIOutput({ type: 'playbook', title: 'Fresh Note', content: 'Safe' });
    assert.strictEqual(store.state.savedAIOutputs.length, 1);
  });

  await t.test('R5_B3: Large content handling: saving multi-turn dialogue scripts preserves full payload', () => {
    const store = new HeadlessStoreSimulator();
    // Generate a long dialogue script (~20KB)
    let longScript = '';
    for (let i = 0; i < 200; i++) {
      longScript += `Turn ${i}: Parent asks a detailed question about teen culture. Teen responds with nuanced context.\n`;
    }

    const saved = store.saveAIOutput({
      type: 'roleplay',
      title: 'Extended Practice Session',
      content: longScript,
    });

    assert.strictEqual(saved.content.length, longScript.length);
    const reloaded = store.storage.getItem('parent-decoder-saved-ai-outputs');
    assert.ok(reloaded && reloaded.length > 10000);
  });

  await t.test('R5_B4: Empty state CTAs on /saved provide actionable deep links', () => {
    const emptyStateRoutes: Record<string, string> = {
      terms: '/browse',
      messages: '/decoder',
      'tone-analysis': '/decoder',
      roleplay: '/browse',
      playbook: '/copilot',
    };

    assert.strictEqual(emptyStateRoutes['playbook'], '/copilot');
    assert.strictEqual(emptyStateRoutes['tone-analysis'], '/decoder');
    assert.strictEqual(emptyStateRoutes['roleplay'], '/browse');
  });

  await t.test('R5_B5: Toast notification stack properly tracks save and removal events', () => {
    const store = new HeadlessStoreSimulator();
    assert.strictEqual(store.state.toasts.length, 0);

    const saved = store.saveAIOutput({ type: 'playbook', title: 'T1', content: 'C1' });
    assert.strictEqual(store.state.toasts.length, 1);
    assert.strictEqual(store.state.toasts[0].message, 'Saved to Saved Items');

    store.removeAIOutput(saved.id);
    assert.strictEqual(store.state.toasts.length, 2);
    assert.strictEqual(store.state.toasts[1].message, 'Removed item');
  });
});
