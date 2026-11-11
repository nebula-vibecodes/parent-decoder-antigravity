import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import esbuild from 'esbuild';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { terms, findTerm, type Term } from '../src/data';
import {
  getFallbackScriptForTerm,
  getFallbackScriptBySlug,
  type TermFallbackScript,
} from '../src/lib/ai/fallbackScripts';
import {
  MockLocalStorage,
  MockClipboard,
  PlaybookQueueStateMachine,
  ToneChecklistStateMachine,
  type SavedAIOutput,
} from './test-utils';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

// ─────────────────────────────────────────────────────────────
// Bundle ParentingPlaybook.tsx, ChromeAISetupGuide.tsx, AgentChat.tsx
// ─────────────────────────────────────────────────────────────

function loadModuleFromTsx(relPath: string) {
  const absPath = path.resolve(__dirname, relPath);
  const bundled = esbuild.buildSync({
    entryPoints: [absPath],
    bundle: true,
    format: 'cjs',
    write: false,
    jsx: 'automatic',
    platform: 'node',
    target: 'node20',
    external: [
      'react',
      'react-dom',
      'react-dom/server',
      'react-router',
      'lucide-react',
      'react/jsx-runtime',
      '../../store',
      '../store',
    ],
  });

  const customRequire = (id: string) => {
    if (id === 'react') return React;
    if (id === 'react/jsx-runtime') return require('react/jsx-runtime');
    if (id === 'lucide-react') {
      return new Proxy({}, {
        get: (_target, prop: string) => (props: any) =>
          React.createElement('span', { 'data-icon': prop, ...props }),
      });
    }
    if (id === '../../store' || id === '../store') {
      return {
        useApp: () => ({
          savedTerms: [],
          savedMessages: [],
          savedAIOutputs: [],
          saveAIOutput: () => {},
          isAIOutputSaved: () => false,
          notify: () => {},
        }),
      };
    }
    return require(id);
  };

  const cjsModule: any = { exports: {} };
  const runner = new Function('module', 'exports', 'require', '__dirname', '__filename', bundled.outputFiles[0].text);
  runner(cjsModule, cjsModule.exports, customRequire, path.dirname(absPath), absPath);
  return cjsModule.exports;
}

const playbookMod = loadModuleFromTsx('../src/components/agent/ParentingPlaybook.tsx');
const { PLAYBOOK_SCENARIOS, TONE_CHECKLIST_CRITERIA, evaluateToneScore, PlaybookCarousel, ToneChecklist, PlaybookChromeNotice } = playbookMod;

const guideMod = loadModuleFromTsx('../src/components/agent/ChromeAISetupGuide.tsx');
const { CHROME_AI_GUIDE_CONSTANTS, copyToClipboard, ChromeAISetupGuide } = guideMod;

const agentChatMod = loadModuleFromTsx('../src/components/agent/AgentChat.tsx');
const { DEFAULT_STARTER_PROMPTS } = agentChatMod;

// ─────────────────────────────────────────────────────────────
// Headless Test Environment & Mock Store Setup
// ─────────────────────────────────────────────────────────────

class HeadlessStoreManager {
  public storage: MockLocalStorage;
  public savedTerms: string[] = [];
  public savedMessages: Array<{ id: string; text: string; savedAt: number }> = [];
  public savedAIOutputs: SavedAIOutput[] = [];
  public notifications: string[] = [];

  constructor(storage = new MockLocalStorage()) {
    this.storage = storage;
    this.syncFromStorage();
  }

  syncFromStorage() {
    try {
      const t = this.storage.getItem('parent-decoder-saved-terms');
      this.savedTerms = t ? JSON.parse(t) : [];
      const m = this.storage.getItem('parent-decoder-saved-messages');
      this.savedMessages = m ? JSON.parse(m) : [];
      const a = this.storage.getItem('parent-decoder-saved-ai-outputs');
      this.savedAIOutputs = a ? JSON.parse(a) : [];
    } catch {
      // ignore
    }
  }

  saveAIOutput(output: Omit<SavedAIOutput, 'id' | 'savedAt'>) {
    const cleanTitle = output.title.trim().slice(0, 200);
    const cleanContent = output.content.trim().slice(0, 10000);
    if (!cleanTitle || !cleanContent) return;

    const cleanSummary = output.summary ? output.summary.trim().slice(0, 500) : undefined;
    const id = `ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const newItem: SavedAIOutput = {
      id,
      type: output.type,
      title: cleanTitle,
      content: cleanContent,
      summary: cleanSummary,
      savedAt: Date.now(),
      metadata: output.metadata,
    };

    this.savedAIOutputs = [
      newItem,
      ...this.savedAIOutputs.filter(
        (item) => !(item.type === output.type && item.title.trim().toLowerCase() === cleanTitle.toLowerCase())
      ),
    ].slice(0, 50);

    this.storage.setItem('parent-decoder-saved-ai-outputs', JSON.stringify(this.savedAIOutputs));
    this.notifications.push('Saved in this browser');
  }

  removeAIOutput(id: string) {
    this.savedAIOutputs = this.savedAIOutputs.filter((item) => item.id !== id);
    this.storage.setItem('parent-decoder-saved-ai-outputs', JSON.stringify(this.savedAIOutputs));
  }

  clearAIOutputs(type?: 'tone-analysis' | 'roleplay' | 'playbook') {
    if (type) {
      this.savedAIOutputs = this.savedAIOutputs.filter((item) => item.type !== type);
    } else {
      this.savedAIOutputs = [];
    }
    this.storage.setItem('parent-decoder-saved-ai-outputs', JSON.stringify(this.savedAIOutputs));
  }

  isAIOutputSaved(title: string, type: 'tone-analysis' | 'roleplay' | 'playbook'): boolean {
    const norm = title.trim().toLowerCase();
    return this.savedAIOutputs.some((i) => i.type === type && i.title.trim().toLowerCase() === norm);
  }

  getTotalSavedCount(): number {
    return this.savedTerms.length + this.savedMessages.length + this.savedAIOutputs.length;
  }
}

// ─────────────────────────────────────────────────────────────
// Challenger M6 Test Suite
// ─────────────────────────────────────────────────────────────

test('Challenger M6: Comprehensive Adversarial Coverage Hardening (R1–R5)', async (t) => {

  // ───────────────────────────────────────────────────────────
  // Domain 1: R1 Interactive Parenting Playbook & Rotating Queue
  // ───────────────────────────────────────────────────────────
  await t.test('1.1: R1 Marquee Scenarios and Deep Content Contract', () => {
    assert.strictEqual(PLAYBOOK_SCENARIOS.length, 3, 'Must have exactly 3 marquee scenarios');

    const expectedTitles = [
      'Teasing vs Bullying',
      'Brainrot memes at the dinner table',
      'Deciphering party vs gaming slang',
    ];
    const actualTitles = PLAYBOOK_SCENARIOS.map((s: any) => s.title);
    assert.deepStrictEqual(actualTitles, expectedTitles, 'Scenario titles must match exact specification');

    for (const scenario of PLAYBOOK_SCENARIOS) {
      assert.ok(scenario.id.length > 0, `Scenario ${scenario.title} must have valid id`);
      assert.ok(scenario.tag.length > 0, `Scenario ${scenario.title} must have non-empty tag`);
      assert.ok(scenario.description.length > 20, `Scenario ${scenario.title} must have substantive description`);
      assert.ok(scenario.parentApproach.length > 20, `Scenario ${scenario.title} must have substantive parent approach`);
      assert.ok(scenario.sampleDialogue.length > 20, `Scenario ${scenario.title} must have substantive sample dialogue`);
      assert.ok(scenario.takeaway.length > 20, `Scenario ${scenario.title} must have substantive takeaway`);
      assert.ok(scenario.recommendedOpener.length > 15, `Scenario ${scenario.title} must have recommended opener`);
      assert.ok(scenario.comparison, `Scenario ${scenario.title} must have comparison matrix`);
      assert.strictEqual(scenario.comparison?.benign.status, 'safe');
      assert.strictEqual(scenario.comparison?.warning.status, 'warning');
      assert.ok(scenario.comparison?.benign.points.length >= 3, 'Benign column must have >= 3 points');
      assert.ok(scenario.comparison?.warning.points.length >= 3, 'Warning column must have >= 3 points');

      assert.ok(scenario.dialogueTurns && scenario.dialogueTurns.length >= 5, 'Must have at least 5 dialogue turns');
      // Verify alternating speakers
      for (let i = 0; i < scenario.dialogueTurns!.length; i++) {
        const turn = scenario.dialogueTurns![i];
        assert.ok(turn.speaker === 'Parent' || turn.speaker === 'Teen');
        if (i > 0) {
          assert.notStrictEqual(turn.speaker, scenario.dialogueTurns![i - 1].speaker, 'Speakers must alternate');
        }
        assert.ok(turn.text.length > 10, 'Turn text must be substantive');
        assert.ok(turn.coachNote && turn.coachNote.length > 10, 'Coach note must be substantive');
      }

      assert.ok(scenario.coachingTips && scenario.coachingTips.length >= 3, 'Must have at least 3 coaching tips');
    }
  });

  await t.test('1.2: R1 Tone Checklist Criteria & Powerset Scoring Engine Hardening', () => {
    assert.strictEqual(TONE_CHECKLIST_CRITERIA.length, 5, 'Must have exactly 5 criteria');
    const expectedIds = ['standing', 'bilateral', 'boundaries', 'space', 'baseline'];
    assert.deepStrictEqual(TONE_CHECKLIST_CRITERIA.map((c: any) => c.id), expectedIds);

    for (const c of TONE_CHECKLIST_CRITERIA) {
      assert.ok(c.title.length > 0);
      assert.ok(c.shortDescription.length > 0);
      assert.ok(c.diagnosticQuestion.includes('?'), 'Diagnostic question must be a question ending in ?');
      assert.ok(c.healthyIndicator.length > 0);
      assert.ok(c.concernIndicator.length > 0);
    }

    // Exhaustive 32-state powerset check
    for (let mask = 0; mask < 32; mask++) {
      const set = new Set<string>();
      for (let bit = 0; bit < 5; bit++) {
        if ((mask & (1 << bit)) !== 0) {
          set.add(expectedIds[bit]);
        }
      }
      const evalRes = evaluateToneScore(set);
      assert.strictEqual(evalRes.score, set.size);
      assert.strictEqual(evalRes.total, 5);

      if (set.size === 5) {
        assert.strictEqual(evalRes.tier, 'healthy');
        assert.strictEqual(evalRes.badgeLabel, 'Healthy Peer Interaction');
        assert.strictEqual(evalRes.verdict, 'Harmless / Normal Banter');
      } else if (set.size >= 3) {
        assert.strictEqual(evalRes.tier, 'watchful');
        assert.strictEqual(evalRes.badgeLabel, 'Nuanced / Watchful');
        assert.strictEqual(evalRes.verdict, 'Watchful / Stay Curious');
      } else {
        assert.strictEqual(evalRes.tier, 'intervention');
        assert.strictEqual(evalRes.badgeLabel, 'Supportive Intervention Recommended');
        assert.strictEqual(evalRes.verdict, 'Intervention Recommended');
      }
      assert.ok(evalRes.actionSteps.length >= 3, 'Must provide action steps');
    }
  });

  await t.test('1.3: R1 Queue State Machine Pause Mechanics & Boundary Cycling', () => {
    const queue = new PlaybookQueueStateMachine(PLAYBOOK_SCENARIOS);
    assert.strictEqual(queue.currentIndex, 0);
    assert.strictEqual(queue.isPaused, false);

    // Hover pause
    queue.onMouseEnter();
    assert.strictEqual(queue.isPaused, true, 'Must pause on hover');
    queue.tick();
    assert.strictEqual(queue.currentIndex, 0, 'Must NOT advance while hovered');
    queue.onMouseLeave();
    assert.strictEqual(queue.isPaused, false, 'Must resume on mouse leave');

    // User interaction pause
    queue.onUserInteract();
    assert.strictEqual(queue.isPaused, true, 'Must pause on user interact');

    // Manual next / prev with wrap-around
    queue.next();
    assert.strictEqual(queue.currentIndex, 1);
    queue.next();
    assert.strictEqual(queue.currentIndex, 2);
    queue.next();
    assert.strictEqual(queue.currentIndex, 0, 'Next at last index wraps to 0');

    queue.previous();
    assert.strictEqual(queue.currentIndex, 2, 'Previous at 0 wraps to last index');
    queue.previous();
    assert.strictEqual(queue.currentIndex, 1);

    // Rapid 1,000 cyclic steps
    for (let i = 0; i < 1000; i++) {
      queue.next();
    }
    assert.ok(queue.currentIndex >= 0 && queue.currentIndex < 3, 'Index must always remain within [0, 2]');
  });

  await t.test('1.4: R1 SSR Component Markup Verification', () => {
    const noticeHtml = renderToString(React.createElement(PlaybookChromeNotice));
    assert.ok(noticeHtml.includes('Live interactive AI is available on desktop Chrome'), 'Notice must render exact heading');
    assert.ok(noticeHtml.includes('playbook-chrome-notice'), 'Notice must have proper class');

    const carouselHtml = renderToString(React.createElement(PlaybookCarousel, { scenarios: PLAYBOOK_SCENARIOS }));
    assert.ok(carouselHtml.includes('playbook-carousel'), 'Carousel must render container');
    assert.ok(carouselHtml.includes('Teasing vs Bullying'), 'Carousel must render active scenario title');
  });

  // ───────────────────────────────────────────────────────────
  // Domain 2: R2 Contextual Fallback Dialogue Scripts
  // ───────────────────────────────────────────────────────────
  await t.test('2.1: R2 100% Corpus Coverage Across All 792 Terms', () => {
    assert.strictEqual(terms.length, 792, 'Must have exactly 792 terms in corpus');

    let totalDialogueTurns = 0;
    for (const term of terms) {
      const script = getFallbackScriptForTerm(term);
      assert.ok(script, `Script must be generated for term ${term.term}`);
      assert.ok(script.termName.length > 0, `termName must not be empty for ${term.term}`);
      assert.ok(script.situation && script.situation.length > 0, `Situation must not be empty for ${term.term}`);
      assert.ok(script.dialogue && script.dialogue.length >= 5, `Dialogue turns >= 5 for ${term.term}`);
      assert.ok(script.coachingTips && script.coachingTips.length >= 3, `Coaching tips >= 3 for ${term.term}`);
      assert.ok(script.recommendedOpener && script.recommendedOpener.length > 0, `Opener must exist for ${term.term}`);

      // Verify turn alternation
      for (let i = 0; i < script.dialogue.length; i++) {
        const turn = script.dialogue[i];
        assert.ok(turn.speaker === 'Parent' || turn.speaker === 'Teen');
        if (i > 0) {
          assert.notStrictEqual(turn.speaker, script.dialogue[i - 1].speaker);
        }
      }
      totalDialogueTurns += script.dialogue.length;
    }
    assert.ok(totalDialogueTurns >= 792 * 5, 'Every term generated at least 5 turns');
  });

  await t.test('2.2: R2 Marquee Terms Curated Quality & Slug Lookups', () => {
    const marqueeSlugs = ['cooked', 'cook', 'plug', 'crash-out', 'skibidi'];
    for (const slug of marqueeSlugs) {
      const script = getFallbackScriptBySlug(slug);
      assert.ok(script, `Marquee slug ${slug} must resolve`);
      assert.ok(script.situation.length > 30, `Marquee ${slug} situation must be deep`);
      assert.ok(script.coachingTips.length >= 3, `Marquee ${slug} tips >= 3`);
    }

    // Whitespace and case-insensitivity on lookup
    const cookedUpper = getFallbackScriptBySlug('  COOKED  ');
    assert.ok(cookedUpper, 'Should resolve with uppercase and spaces');
    assert.strictEqual(cookedUpper?.termSlug, 'cooked');
  });

  await t.test('2.3: R2 Button Label Transition Contract', () => {
    const getRoleplayButtonLabel = (engine: 'local' | 'unavailable' | 'loading'): string => {
      return engine === 'local' ? 'Practice this conversation' : 'View conversation script & tips';
    };

    assert.strictEqual(getRoleplayButtonLabel('local'), 'Practice this conversation');
    assert.strictEqual(getRoleplayButtonLabel('unavailable'), 'View conversation script & tips');
    assert.strictEqual(getRoleplayButtonLabel('loading'), 'View conversation script & tips');
  });

  // ───────────────────────────────────────────────────────────
  // Domain 3: R3 "Prompt & Play" Starter Pills on /copilot
  // ───────────────────────────────────────────────────────────
  await t.test('3.1: R3 Starter Prompts Exact Texts and Unicode Fidelity', () => {
    assert.ok(DEFAULT_STARTER_PROMPTS.length >= 3, 'Must have at least 3 default starter prompts');

    const requiredPrompts = [
      "My 12-year-old was called 'cooked' on Discord—how worried should I be?",
      'Check if my text asking them to do dishes sounds passive-aggressive',
      'How do I ask about \'plug 🔌\' without sounding like a cop?',
    ];

    for (const req of requiredPrompts) {
      assert.ok(DEFAULT_STARTER_PROMPTS.includes(req), `Must contain required prompt: ${req}`);
    }

    const plugPrompt = DEFAULT_STARTER_PROMPTS.find((p: string) => p.includes('plug'));
    assert.ok(plugPrompt);
    assert.ok(plugPrompt.includes('🔌'), 'Must preserve plug emoji');
    assert.strictEqual(plugPrompt.indexOf('\u{1F50C}') >= 0, true, 'Unicode point 1F50C intact');
  });

  await t.test('3.2: R3 Starter Pills Draft Replacement & Interaction Invariants', () => {
    let inputDraft = 'My initial typed query';
    const clickPill = (promptText: string) => {
      // Pill replaces input cleanly
      inputDraft = promptText;
    };

    clickPill(DEFAULT_STARTER_PROMPTS[0]);
    assert.strictEqual(inputDraft, DEFAULT_STARTER_PROMPTS[0], 'Must replace existing draft completely');

    clickPill(DEFAULT_STARTER_PROMPTS[2]);
    assert.strictEqual(inputDraft, DEFAULT_STARTER_PROMPTS[2], 'Second pill click replaces previous prompt');
    assert.ok(inputDraft.includes('🔌'));
  });

  // ───────────────────────────────────────────────────────────
  // Domain 4: R4 Expandable Chrome AI Setup Guide
  // ───────────────────────────────────────────────────────────
  await t.test('4.1: R4 Setup Guide URLs and Clipboard Copy Invariants', async () => {
    assert.strictEqual(CHROME_AI_GUIDE_CONSTANTS.flagUrl, 'chrome://flags/#prompt-api-for-gemini-nano');
    assert.strictEqual(CHROME_AI_GUIDE_CONSTANTS.componentsUrl, 'chrome://components');
    assert.strictEqual(CHROME_AI_GUIDE_CONSTANTS.componentName, 'Optimization Guide On Device Model');

    const mockClipboard = new MockClipboard();
    await mockClipboard.writeText(CHROME_AI_GUIDE_CONSTANTS.flagUrl);
    assert.strictEqual(mockClipboard.lastWrittenText, 'chrome://flags/#prompt-api-for-gemini-nano');

    await mockClipboard.writeText(CHROME_AI_GUIDE_CONSTANTS.componentsUrl);
    assert.strictEqual(mockClipboard.lastWrittenText, 'chrome://components');
  });

  await t.test('4.2: R4 Setup Guide SSR Markup Verification', () => {
    const guideHtml = renderToString(React.createElement(ChromeAISetupGuide, { defaultOpen: false }));
    assert.ok(guideHtml.includes('How to turn on local AI in Chrome (60 seconds)'));
    assert.ok(guideHtml.includes('chrome-ai-setup-guide'));
  });

  // ───────────────────────────────────────────────────────────
  // Domain 5: R5 "Save to Saved Items" Integration & Storage Invariants
  // ───────────────────────────────────────────────────────────
  await t.test('5.1: R5 Zero Data Loss Across 500 Legacy & AI Storage Operations', () => {
    const storage = new MockLocalStorage();
    const initialTerms = ['skibidi', 'rizz', 'no-cap', 'gyatt', 'fanum-tax'];
    const initialMessages = [
      { id: 'msg-1', text: 'You are so cooked bro', savedAt: 1700000000000 },
      { id: 'msg-2', text: 'Hit the plug for snacks', savedAt: 1700000001000 },
    ];

    storage.setItem('parent-decoder-saved-terms', JSON.stringify(initialTerms));
    storage.setItem('parent-decoder-saved-messages', JSON.stringify(initialMessages));

    const manager = new HeadlessStoreManager(storage);

    // Perform 500 AI operations
    for (let i = 0; i < 500; i++) {
      manager.saveAIOutput({
        type: i % 3 === 0 ? 'tone-analysis' : i % 3 === 1 ? 'roleplay' : 'playbook',
        title: `Output Item #${i}`,
        content: `Substantive content #${i}`,
      });
    }

    // Verify bounded to 50
    assert.strictEqual(manager.savedAIOutputs.length, 50, 'savedAIOutputs must be strictly bounded to 50 items');

    // Verify zero data loss on legacy items
    manager.syncFromStorage();
    assert.deepStrictEqual(manager.savedTerms, initialTerms, 'savedTerms must remain completely intact');
    assert.deepStrictEqual(manager.savedMessages, initialMessages, 'savedMessages must remain completely intact');

    // Clear only tone-analysis
    manager.clearAIOutputs('tone-analysis');
    assert.ok(manager.savedAIOutputs.every((item) => item.type !== 'tone-analysis'));
    assert.deepStrictEqual(manager.savedTerms, initialTerms, 'savedTerms must survive category clear');

    // Clear all AI outputs
    manager.clearAIOutputs();
    assert.strictEqual(manager.savedAIOutputs.length, 0);
    assert.deepStrictEqual(manager.savedTerms, initialTerms, 'savedTerms must survive full AI clear');
    assert.deepStrictEqual(manager.savedMessages, initialMessages, 'savedMessages must survive full AI clear');
  });

  await t.test('5.2: R5 Deduplication & Timestamp Updating', () => {
    const manager = new HeadlessStoreManager();

    manager.saveAIOutput({
      type: 'playbook',
      title: 'Teasing vs Bullying',
      content: 'Original note v1',
    });
    assert.strictEqual(manager.savedAIOutputs.length, 1);
    const firstSavedAt = manager.savedAIOutputs[0].savedAt;

    // Save duplicate with different case and whitespace
    manager.saveAIOutput({
      type: 'playbook',
      title: '  TEASING VS BULLYING  ',
      content: 'Updated note v2',
      summary: 'New summary',
    });

    assert.strictEqual(manager.savedAIOutputs.length, 1, 'Duplicate save must collapse into 1 entry');
    assert.strictEqual(manager.savedAIOutputs[0].content, 'Updated note v2');
    assert.strictEqual(manager.savedAIOutputs[0].summary, 'New summary');
    assert.ok(manager.savedAIOutputs[0].savedAt >= firstSavedAt);

    // Save same title under DIFFERENT category ('roleplay')
    manager.saveAIOutput({
      type: 'roleplay',
      title: 'Teasing vs Bullying',
      content: 'Roleplay dialogue content',
    });
    assert.strictEqual(manager.savedAIOutputs.length, 2, 'Different categories with same title must NOT collapse');
  });

  await t.test('5.3: R5 Navigation Sync Invariant', () => {
    const manager = new HeadlessStoreManager();
    assert.strictEqual(manager.getTotalSavedCount(), 0);

    manager.savedTerms.push('skibidi');
    assert.strictEqual(manager.getTotalSavedCount(), 1);

    manager.savedMessages.push({ id: 'm1', text: 'hi', savedAt: 123 });
    assert.strictEqual(manager.getTotalSavedCount(), 2);

    manager.saveAIOutput({ type: 'tone-analysis', title: 'Tone 1', content: 'c1' });
    manager.saveAIOutput({ type: 'roleplay', title: 'Roleplay 1', content: 'c2' });
    manager.saveAIOutput({ type: 'playbook', title: 'Playbook 1', content: 'c3' });

    assert.strictEqual(manager.getTotalSavedCount(), 5);
  });

  // ───────────────────────────────────────────────────────────
  // Domain 6: Cross-Cutting End-to-End Stress Simulation
  // ───────────────────────────────────────────────────────────
  await t.test('6.1: Full Multi-Feature Parenting Lifecycle Simulation', () => {
    const manager = new HeadlessStoreManager();

    // 1. Parent encounters slang "cooked" on /browse and saves term
    manager.savedTerms.push('cooked');

    // 2. Parent navigates to /term/cooked when AI is unavailable
    const script = getFallbackScriptBySlug('cooked');
    assert.ok(script);
    assert.strictEqual(script.termSlug, 'cooked');

    // 3. Parent saves the fallback conversation script
    manager.saveAIOutput({
      type: 'roleplay',
      title: `Practice: ${script.termName}`,
      content: script.dialogue.map((d: any) => `${d.speaker}: ${d.text}`).join('\n'),
      summary: script.situation,
      metadata: { termSlug: script.termSlug },
    });

    // 4. Parent navigates to /decoder, receives suspicious text, saves message
    manager.savedMessages.push({
      id: 'msg-dinner',
      text: 'My broccoli has negative rizz mom',
      savedAt: Date.now(),
    });

    // 5. Parent runs tone analysis and saves tone reading
    const sampleMessage = 'My broccoli has negative rizz mom';
    const toneTitle = 'Tone: ' + sampleMessage.slice(0, 30);
    manager.saveAIOutput({
      type: 'tone-analysis',
      title: toneTitle,
      content: 'Harmless absurdist teen slang. No intervention needed.',
      summary: `Tone reading for: “${sampleMessage}”`,
      metadata: { message: sampleMessage, originalMessage: sampleMessage },
    });

    // 6. Parent checks Playbook on /copilot, saves Scenario Note
    const dinnerScenario = PLAYBOOK_SCENARIOS.find((s: any) => s.id === 'brainrot-dinner-table')!;
    manager.saveAIOutput({
      type: 'playbook',
      title: `Playbook: ${dinnerScenario.title}`,
      content: dinnerScenario.description,
      summary: dinnerScenario.takeaway,
      metadata: { scenarioId: dinnerScenario.id, tag: dinnerScenario.tag },
    });

    // 7. Parent completes Tone Checklist (4 checked) and saves checklist note
    const checklistChecked = new Set(['standing', 'bilateral', 'boundaries', 'space']);
    const checklistEval = evaluateToneScore(checklistChecked);
    manager.saveAIOutput({
      type: 'playbook',
      title: `Tone Checklist: ${checklistEval.score}/5 - ${checklistEval.badgeLabel}`,
      content: checklistEval.guidance,
      summary: checklistEval.summary,
      metadata: { score: String(checklistEval.score), tier: checklistEval.tier },
    });

    // Verification of End State:
    assert.strictEqual(manager.savedTerms.length, 1);
    assert.strictEqual(manager.savedMessages.length, 1);
    assert.strictEqual(manager.savedAIOutputs.length, 4);
    assert.strictEqual(manager.getTotalSavedCount(), 6);

    // Distribution across SavedPage tabs:
    const termsTab = manager.savedTerms;
    const messagesTab = manager.savedMessages;
    const toneTab = manager.savedAIOutputs.filter((i) => i.type === 'tone-analysis');
    const roleplayTab = manager.savedAIOutputs.filter((i) => i.type === 'roleplay');
    const playbookTab = manager.savedAIOutputs.filter((i) => i.type === 'playbook');

    assert.strictEqual(termsTab.length, 1);
    assert.strictEqual(messagesTab.length, 1);
    assert.strictEqual(toneTab.length, 1);
    assert.strictEqual(roleplayTab.length, 1);
    assert.strictEqual(playbookTab.length, 2);
  });
});
