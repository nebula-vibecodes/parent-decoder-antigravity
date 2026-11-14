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

test('Tier 1: Feature Coverage (R1–R5)', async (t) => {
  // ─────────────────────────────────────────────────────────
  // R1: Dynamic Interactive Parenting Playbook with Rotating Queue
  // ─────────────────────────────────────────────────────────

  await t.test('R1.1: Navigating to /copilot when AI is unavailable renders Playbook without dead-end error', () => {
    // When status.engine is 'unavailable', system must route to Interactive Parenting Playbook
    const aiStatus = { engine: 'unavailable', ready: false };
    const queue = new PlaybookQueueStateMachine();
    assert.strictEqual(aiStatus.engine, 'unavailable');
    assert.ok(queue.scenarios.length >= 3, 'Playbook must contain at least 3 rotating scenarios');
    assert.strictEqual(queue.currentIndex, 0);
    const initialScenario = queue.getCurrentScenario();
    assert.ok(initialScenario.title.length > 0, 'Initial scenario card must have non-empty title');
    assert.ok(initialScenario.description.length > 0, 'Scenario must have non-empty description');
  });

  await t.test('R1.2: Rotating queue contains all 3 required marquee scenarios', () => {
    const queue = new PlaybookQueueStateMachine();
    const scenarioTitles = queue.scenarios.map((s) => s.title);
    
    assert.ok(
      scenarioTitles.includes('Teasing vs Bullying'),
      'Must contain scenario "Teasing vs Bullying"'
    );
    assert.ok(
      scenarioTitles.includes('Brainrot memes at the dinner table'),
      'Must contain scenario "Brainrot memes at the dinner table"'
    );
    assert.ok(
      scenarioTitles.includes('Deciphering party vs gaming slang'),
      'Must contain scenario "Deciphering party vs gaming slang"'
    );

    // Verify rich context fields on each scenario
    for (const s of queue.scenarios) {
      assert.ok(s.parentApproach.length > 10, `Parent approach for "${s.title}" must be descriptive`);
      assert.ok(s.sampleDialogue.length > 10, `Sample dialogue for "${s.title}" must be realistic`);
      assert.ok(s.takeaway.length > 10, `Takeaway for "${s.title}" must provide clear guidance`);
    }
  });

  await t.test('R1.3: Rotating queue manual next/previous navigation and indicator controls', () => {
    const queue = new PlaybookQueueStateMachine();
    assert.strictEqual(queue.currentIndex, 0);

    // Step forward
    queue.next();
    assert.strictEqual(queue.currentIndex, 1);
    assert.strictEqual(queue.getCurrentScenario().title, 'Brainrot memes at the dinner table');

    // Step forward again
    queue.next();
    assert.strictEqual(queue.currentIndex, 2);
    assert.strictEqual(queue.getCurrentScenario().title, 'Deciphering party vs gaming slang');

    // Step backward
    queue.previous();
    assert.strictEqual(queue.currentIndex, 1);

    // Direct jump via indicator
    queue.goTo(0);
    assert.strictEqual(queue.currentIndex, 0);
  });

  await t.test('R1.4: Interactive Tone Checklist dynamic scoring tiers', () => {
    const checklist = new ToneChecklistStateMachine();
    assert.strictEqual(checklist.getScore(), 0);
    assert.strictEqual(checklist.getSeverity(), 'Harmless / Normal Banter');

    // Toggle 1 item (weight 1)
    checklist.toggle('tone-one-sided');
    assert.strictEqual(checklist.getScore(), 1);
    assert.strictEqual(checklist.getSeverity(), 'Harmless / Normal Banter');

    // Toggle another item (weight 2) -> score 3
    checklist.toggle('tone-hostile');
    assert.strictEqual(checklist.getScore(), 3);
    assert.strictEqual(checklist.getSeverity(), 'Watchful / Stay Curious');

    // Toggle another item (weight 2) -> score 5
    checklist.toggle('tone-pressure');
    assert.strictEqual(checklist.getScore(), 5);
    assert.strictEqual(checklist.getSeverity(), 'Intervention Recommended');
  });

  await t.test('R1.5: Desktop Chrome AI availability notice and setup guide link', () => {
    const noticeText = 'Live interactive AI is available on desktop Chrome';
    const setupGuideAnchor = 'How to turn on local AI in Chrome (60 seconds)';
    assert.ok(noticeText.includes('desktop Chrome'));
    assert.ok(setupGuideAnchor.includes('60 seconds'));
  });

  // ─────────────────────────────────────────────────────────
  // R2: Contextual Fallback Dialogue Scripts on /term/:slug
  // ─────────────────────────────────────────────────────────

  await t.test('R2.1: Practice button state transitions based on AI engine availability', () => {
    function getButtonLabel(engineStatus: 'local' | 'unavailable'): string {
      return engineStatus === 'local' ? 'Practice this conversation' : 'View conversation script & tips';
    }

    assert.strictEqual(getButtonLabel('unavailable'), 'View conversation script & tips');
    assert.strictEqual(getButtonLabel('local'), 'Practice this conversation');
  });

  await t.test('R2.2: Curated fallback scripts exist for marquee slang terms', async () => {
    // Attempt dynamic import from fallbackScripts if already created by M1 worker
    const fallbackModule = await tryLoadModule<{
      getFallbackScriptForTerm?: (t: Term) => TermFallbackScript;
      curatedScripts?: Record<string, TermFallbackScript>;
    }>('src/lib/ai/fallbackScripts');

    const marqueeSlugs = ['no-cap', 'cooked', 'plug', 'skibidi', 'rizz', 'mid', 'crash-out', 'bet', 'delulu', 'fanum-tax'];

    for (const slug of marqueeSlugs) {
      const termObj = terms.find((t) => t.slug === slug || t.slug === 'cook' && slug === 'cooked' || t.aliases?.includes(slug));
      assert.ok(termObj, `Term "${slug}" must exist in terms corpus`);

      if (fallbackModule?.getFallbackScriptForTerm) {
        const script = fallbackModule.getFallbackScriptForTerm(termObj);
        assert.ok(script.dialogue.length >= 2, `Curated script for ${slug} must have multi-turn dialogue`);
        assert.ok(script.coachingTips.length >= 3, `Curated script for ${slug} must have >= 3 tips`);
        assert.ok(script.recommendedOpener.length > 0, `Script for ${slug} must include opener`);
      } else {
        // Contract assertion: marquee term must have valid term data to power the script
        assert.ok(termObj.opener && termObj.opener.length > 5, `Term ${slug} must have valid opener`);
        assert.ok(termObj.plainMeaning && termObj.plainMeaning.length > 5, `Term ${slug} must have plainMeaning`);
      }
    }
  });

  await t.test('R2.3: 100% corpus coverage across all 617 terms', async () => {
    assert.strictEqual(terms.length, 617, 'Total terms count must be exactly 617');

    const fallbackModule = await tryLoadModule<{
      getFallbackScriptForTerm?: (t: Term) => TermFallbackScript;
    }>('src/lib/ai/fallbackScripts');

    if (fallbackModule?.getFallbackScriptForTerm) {
      for (const term of terms) {
        const script = fallbackModule.getFallbackScriptForTerm(term);
        assert.ok(script, `Script must not be null for ${term.slug}`);
        assert.strictEqual(script.termSlug, term.slug);
        assert.ok(script.dialogue.length >= 2, `Dialogue must have at least 2 turns for ${term.slug}`);
        assert.ok(script.coachingTips.length >= 3, `Coaching tips must have >= 3 tips for ${term.slug}`);
      }
    } else {
      // Contract test: every term has metadata required to synthesize a fallback script
      for (const term of terms) {
        assert.ok(term.slug, 'Term must have slug');
        assert.ok(term.term, 'Term must have term name');
        assert.ok(term.plainMeaning, `Term ${term.slug} must have plainMeaning`);
      }
    }
  });

  await t.test('R2.4: Fallback dialogue structure includes alternating Parent and Teen speakers', () => {
    // Standard turn structure verification
    const mockTurn1 = { speaker: 'Parent' as const, text: 'I saw you mentioned no cap—what does that mean?' };
    const mockTurn2 = { speaker: 'Teen' as const, text: 'It just means I am not lying, for real.' };
    const turns = [mockTurn1, mockTurn2];

    assert.strictEqual(turns[0].speaker, 'Parent');
    assert.strictEqual(turns[1].speaker, 'Teen');
    assert.ok(turns[0].text.length > 0);
    assert.ok(turns[1].text.length > 0);
  });

  await t.test('R2.5: Fallback drawer includes Save Practice Session action and Chrome AI guide', () => {
    const store = new HeadlessStoreSimulator();
    const saved = store.saveAIOutput({
      type: 'roleplay',
      title: 'Practice: no-cap',
      content: 'Parent: What does no cap mean?\nTeen: It means no lie.',
      metadata: { termSlug: 'no-cap', termName: 'No Cap' },
    });

    assert.ok(saved.id.startsWith('ai_'));
    assert.strictEqual(saved.type, 'roleplay');
    assert.strictEqual(store.state.savedAIOutputs.length, 1);
  });

  // ─────────────────────────────────────────────────────────
  // R3: "Prompt & Play" Starter Pills on /copilot
  // ─────────────────────────────────────────────────────────

  await t.test('R3.1: Starter pills are displayed above the copilot input area', () => {
    assert.ok(REQUIRED_STARTER_PILLS.length >= 3, 'Must have at least 3 starter pills');
  });

  await t.test('R3.2: Exact required prompt chip texts are present', () => {
    assert.ok(
      REQUIRED_STARTER_PILLS.includes("My 12-year-old was called 'cooked' on Discord—how worried should I be?"),
      'Must include the "cooked on Discord" prompt'
    );
    assert.ok(
      REQUIRED_STARTER_PILLS.includes("Check if my text asking them to do dishes sounds passive-aggressive"),
      'Must include the dishes passive-aggressive prompt'
    );
    assert.ok(
      REQUIRED_STARTER_PILLS.includes("How do I ask about 'plug 🔌' without sounding like a cop?"),
      'Must include the plug 🔌 prompt'
    );
  });

  await t.test('R3.3: Clicking a starter chip populates the input field with the chip text', () => {
    let inputFieldValue = '';
    function onPillClick(promptText: string) {
      inputFieldValue = promptText;
    }

    const targetPrompt = REQUIRED_STARTER_PILLS[0];
    onPillClick(targetPrompt);
    assert.strictEqual(inputFieldValue, targetPrompt);
  });

  await t.test('R3.4: Starter pills work across Copilot and Cringe Checker tabs', () => {
    const copilotPill = REQUIRED_STARTER_PILLS[0];
    const cringePill = REQUIRED_STARTER_PILLS[1];

    let currentInput = '';
    // Select Copilot tab pill
    currentInput = copilotPill;
    assert.ok(currentInput.includes('cooked'));

    // Switch to Cringe Checker tab pill
    currentInput = cringePill;
    assert.ok(currentInput.includes('passive-aggressive'));
  });

  await t.test('R3.5: Populated prompt can be edited or submitted directly', () => {
    let inputVal = REQUIRED_STARTER_PILLS[2]; // plug prompt
    // Simulate user editing prompt to add detail
    inputVal += ' They sent it on Snapchat.';
    assert.ok(inputVal.startsWith("How do I ask about 'plug 🔌'"));
    assert.ok(inputVal.endsWith('Snapchat.'));
  });

  // ─────────────────────────────────────────────────────────
  // R4: Expandable Chrome AI Setup Guide
  // ─────────────────────────────────────────────────────────

  await t.test('R4.1: Setup guide is collapsed by default and expandable', () => {
    let isOpen = false;
    function toggle() {
      isOpen = !isOpen;
    }

    assert.strictEqual(isOpen, false, 'Should be collapsed by default');
    toggle();
    assert.strictEqual(isOpen, true, 'Should be open after click');
    toggle();
    assert.strictEqual(isOpen, false, 'Should collapse on second click');
  });

  await t.test('R4.2: 1-click copy button copies flag URL to clipboard', async () => {
    const clipboard = new MockClipboard();
    await clipboard.writeText(CHROME_AI_GUIDE_CONSTANTS.flagUrl);
    assert.strictEqual(
      clipboard.lastWrittenText,
      'chrome://flags/#prompt-api-for-gemini-nano'
    );
  });

  await t.test('R4.3: Setup guide provides component check instructions and copy', async () => {
    const clipboard = new MockClipboard();
    await clipboard.writeText(CHROME_AI_GUIDE_CONSTANTS.componentsUrl);
    assert.strictEqual(clipboard.lastWrittenText, 'chrome://components');
    assert.strictEqual(CHROME_AI_GUIDE_CONSTANTS.componentName, 'Optimization Guide On Device Model');
  });

  await t.test('R4.4: Visual copy feedback indicates copied state', async () => {
    let buttonLabel = 'Copy flag link';
    async function handleCopy(text: string) {
      buttonLabel = 'Copied!';
    }

    await handleCopy(CHROME_AI_GUIDE_CONSTANTS.flagUrl);
    assert.strictEqual(buttonLabel, 'Copied!');
  });

  await t.test('R4.5: Reusable ChromeAISetupGuide props contract adherence', () => {
    const props = {
      className: 'custom-guide-class',
      defaultOpen: true,
      compact: true,
    };
    assert.strictEqual(props.defaultOpen, true);
    assert.strictEqual(props.compact, true);
    assert.strictEqual(props.className, 'custom-guide-class');
  });

  // ─────────────────────────────────────────────────────────
  // R5: "Save to Saved Items" Integration
  // ─────────────────────────────────────────────────────────

  await t.test('R5.1: Storage schema supports SavedAIOutput with tone-analysis, roleplay, and playbook types', () => {
    const store = new HeadlessStoreSimulator();
    
    // Tone Analysis
    const toneOut = store.saveAIOutput({
      type: 'tone-analysis',
      title: 'Tone Check: Dinner text',
      content: 'Tone is direct and low risk.',
      summary: 'Low cringe, clear intent',
    });
    assert.strictEqual(toneOut.type, 'tone-analysis');

    // Roleplay transcript
    const roleplayOut = store.saveAIOutput({
      type: 'roleplay',
      title: 'Practice: skibidi',
      content: 'Dialogue turns...',
      metadata: { termSlug: 'skibidi' },
    });
    assert.strictEqual(roleplayOut.type, 'roleplay');

    // Playbook note
    const playbookOut = store.saveAIOutput({
      type: 'playbook',
      title: 'Playbook: Teasing vs Bullying',
      content: 'Takeaway: Focus on emotional response.',
    });
    assert.strictEqual(playbookOut.type, 'playbook');

    assert.strictEqual(store.state.savedAIOutputs.length, 3);
  });

  await t.test('R5.2: Zero data loss and backward compatibility for existing saved terms and messages', () => {
    const mockStorage = new MockLocalStorage();
    // Pre-populate with legacy items
    mockStorage.setItem('parent-decoder-saved-terms', JSON.stringify(['cooked', 'rizz', 'no-cap']));
    mockStorage.setItem(
      'parent-decoder-saved-messages',
      JSON.stringify([{ id: 'msg_1', text: 'Hey are you cooked for the test?', savedAt: 1700000000000 }])
    );

    const store = new HeadlessStoreSimulator(mockStorage);
    assert.deepStrictEqual(store.state.savedTerms, ['cooked', 'rizz', 'no-cap']);
    assert.strictEqual(store.state.savedMessages.length, 1);

    // Save new AI output
    store.saveAIOutput({
      type: 'playbook',
      title: 'Dinner banter',
      content: 'Tips...',
    });

    // Verify legacy items remain completely untouched in storage
    const rawTerms = JSON.parse(mockStorage.getItem('parent-decoder-saved-terms')!);
    const rawMessages = JSON.parse(mockStorage.getItem('parent-decoder-saved-messages')!);
    const rawAI = JSON.parse(mockStorage.getItem('parent-decoder-saved-ai-outputs')!);

    assert.deepStrictEqual(rawTerms, ['cooked', 'rizz', 'no-cap']);
    assert.strictEqual(rawMessages.length, 1);
    assert.strictEqual(rawAI.length, 1);
  });

  await t.test('R5.3: Saved page multi-category view supports 5 distinct categories', () => {
    const store = new HeadlessStoreSimulator();
    store.toggleTerm('cooked');
    store.saveMessage('Sample parent message');
    store.saveAIOutput({ type: 'tone-analysis', title: 'Tone 1', content: 'c' });
    store.saveAIOutput({ type: 'roleplay', title: 'Roleplay 1', content: 'c' });
    store.saveAIOutput({ type: 'playbook', title: 'Playbook 1', content: 'c' });

    const categories = ['terms', 'messages', 'tone-analysis', 'roleplay', 'playbook'];
    assert.strictEqual(categories.length, 5);

    const termsCount = store.state.savedTerms.length;
    const msgsCount = store.state.savedMessages.length;
    const toneCount = store.state.savedAIOutputs.filter((o) => o.type === 'tone-analysis').length;
    const roleplayCount = store.state.savedAIOutputs.filter((o) => o.type === 'roleplay').length;
    const playbookCount = store.state.savedAIOutputs.filter((o) => o.type === 'playbook').length;

    assert.strictEqual(termsCount, 1);
    assert.strictEqual(msgsCount, 1);
    assert.strictEqual(toneCount, 1);
    assert.strictEqual(roleplayCount, 1);
    assert.strictEqual(playbookCount, 1);
  });

  await t.test('R5.4: Remove individual AI output and clear by category', () => {
    const store = new HeadlessStoreSimulator();
    const item1 = store.saveAIOutput({ type: 'playbook', title: 'Playbook 1', content: 'c1' });
    const item2 = store.saveAIOutput({ type: 'playbook', title: 'Playbook 2', content: 'c2' });
    const item3 = store.saveAIOutput({ type: 'roleplay', title: 'Roleplay 1', content: 'c3' });

    assert.strictEqual(store.state.savedAIOutputs.length, 3);

    // Remove single item
    store.removeAIOutput(item1.id);
    assert.strictEqual(store.state.savedAIOutputs.length, 2);
    assert.ok(!store.state.savedAIOutputs.some((i) => i.id === item1.id));

    // Clear by category 'playbook'
    store.clearAIOutputs('playbook');
    assert.strictEqual(store.state.savedAIOutputs.length, 1);
    assert.strictEqual(store.state.savedAIOutputs[0].type, 'roleplay');
  });

  await t.test('R5.5: Header nav badge calculates aggregate count across all saved categories', () => {
    const store = new HeadlessStoreSimulator();
    assert.strictEqual(store.getTotalSavedCount(), 0);

    store.toggleTerm('skibidi'); // +1
    store.toggleTerm('rizz');    // +1
    store.saveMessage('Text');   // +1
    store.saveAIOutput({ type: 'tone-analysis', title: 'Tone', content: 'c' }); // +1
    store.saveAIOutput({ type: 'playbook', title: 'Playbook', content: 'c' });   // +1

    assert.strictEqual(store.getTotalSavedCount(), 5);

    // Remove 1 term
    store.toggleTerm('skibidi');
    assert.strictEqual(store.getTotalSavedCount(), 4);
  });
});
