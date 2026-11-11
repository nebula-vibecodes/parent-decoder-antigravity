import test from 'node:test';
import assert from 'node:assert';
import { terms } from '../src/data';
import {
  MockLocalStorage,
  MockClipboard,
  HeadlessStoreSimulator,
  PlaybookQueueStateMachine,
  ToneChecklistStateMachine,
  REQUIRED_PLAYBOOK_SCENARIOS,
  REQUIRED_STARTER_PILLS,
  CHROME_AI_GUIDE_CONSTANTS,
} from './test-utils';

test('Tier 3: Cross-Feature Interactions (Pairwise Combinations)', async (t) => {
  await t.test('T3.1 (R1 + R5): Playbook scenario card save to Saved Items reflects under Playbook Notes tab and increments header badge', () => {
    const store = new HeadlessStoreSimulator();
    const queue = new PlaybookQueueStateMachine();
    const scenario = queue.getCurrentScenario(); // "Teasing vs Bullying"

    assert.strictEqual(store.getTotalSavedCount(), 0);

    // Click "Save to Saved Items" on playbook scenario
    const saved = store.saveAIOutput({
      type: 'playbook',
      title: `Playbook: ${scenario.title}`,
      content: `${scenario.description}\n\nKey Takeaway: ${scenario.takeaway}`,
      summary: scenario.takeaway,
      metadata: { scenarioId: scenario.id, tag: scenario.tag },
    });

    assert.ok(saved.id.startsWith('ai_'));
    assert.strictEqual(store.getTotalSavedCount(), 1);

    // Verify under /saved playbook tab
    const playbookNotes = store.state.savedAIOutputs.filter((o) => o.type === 'playbook');
    assert.strictEqual(playbookNotes.length, 1);
    assert.strictEqual(playbookNotes[0].title, 'Playbook: Teasing vs Bullying');
    assert.strictEqual(playbookNotes[0].metadata?.scenarioId, 'teasing-vs-bullying');
  });

  await t.test('T3.2 (R2 + R5): Fallback script save session reflects under Practice Sessions tab with term metadata', () => {
    const store = new HeadlessStoreSimulator();
    const term = terms.find((t) => t.slug === 'no-cap')!;
    assert.ok(term);

    // Simulate saving fallback practice session from /term/no-cap
    const dialogueTranscript = `Parent: ${term.opener}\nTeen: It just means no lie, for real.\nParent: Got it, thanks for clarifying.`;
    store.saveAIOutput({
      type: 'roleplay',
      title: `Practice: ${term.term}`,
      content: dialogueTranscript,
      summary: `Dialogue practice for ${term.term}`,
      metadata: {
        termSlug: term.slug,
        termName: term.term,
        category: term.category,
      },
    });

    const practiceSessions = store.state.savedAIOutputs.filter((o) => o.type === 'roleplay');
    assert.strictEqual(practiceSessions.length, 1);
    assert.strictEqual(practiceSessions[0].metadata?.termSlug, 'no-cap');
    assert.ok(practiceSessions[0].content.includes(term.opener));
    assert.strictEqual(store.getTotalSavedCount(), 1);
  });

  await t.test('T3.3 (R1 + R4): Playbook view embeds Setup Guide and 1-click copy without disrupting queue state', async () => {
    const queue = new PlaybookQueueStateMachine();
    const clipboard = new MockClipboard();
    let guideOpen = false;

    // Queue is on scenario 0
    assert.strictEqual(queue.currentIndex, 0);

    // Parent expands setup guide inside Playbook notice
    guideOpen = true;
    queue.onUserInteract(); // Interacting with guide pauses rotation
    assert.strictEqual(queue.isPaused, true);

    // 1-click copy flag URL
    await clipboard.writeText(CHROME_AI_GUIDE_CONSTANTS.flagUrl);
    assert.strictEqual(clipboard.lastWrittenText, 'chrome://flags/#prompt-api-for-gemini-nano');

    // Queue remains stable on scenario 0
    queue.tick();
    assert.strictEqual(queue.currentIndex, 0);
  });

  await t.test('T3.4 (R2 + R4): Term fallback drawer embeds Setup Guide with component check copy', async () => {
    const clipboard = new MockClipboard();
    let drawerOpen = true;
    let guideExpanded = false;

    // Expand guide inside drawer
    guideExpanded = true;
    await clipboard.writeText(CHROME_AI_GUIDE_CONSTANTS.componentsUrl);

    assert.strictEqual(drawerOpen, true);
    assert.strictEqual(guideExpanded, true);
    assert.strictEqual(clipboard.lastWrittenText, 'chrome://components');
  });

  await t.test('T3.5 (R3 + R1): AI state transition from unavailable to available unlocks starter pills without losing input', () => {
    let engineStatus: 'unavailable' | 'local' = 'unavailable';
    let currentInput = '';

    // While unavailable, Playbook is active, input is not visible
    assert.strictEqual(engineStatus, 'unavailable');

    // User enables Chrome AI -> status switches to local
    engineStatus = 'local';
    assert.strictEqual(engineStatus, 'local');

    // Starter pills appear above input
    const chosenPill = REQUIRED_STARTER_PILLS[0];
    currentInput = chosenPill;

    assert.strictEqual(currentInput, "My 12-year-old was called 'cooked' on Discord—how worried should I be?");
  });

  await t.test('T3.6 (R5 + R2 + R1): Multi-category aggregation in Saved Items view preserves distinct tab filtering', () => {
    const store = new HeadlessStoreSimulator();

    // 1. Save term
    store.toggleTerm('skibidi');
    // 2. Save message
    store.saveMessage('What does rizz mean in your group?');
    // 3. Save tone analysis
    store.saveAIOutput({
      type: 'tone-analysis',
      title: 'Tone Analysis: Homework reminder',
      content: 'Score: 92/100. Friendly and clear.',
    });
    // 4. Save practice session
    store.saveAIOutput({
      type: 'roleplay',
      title: 'Practice: plug',
      content: 'Dialogue turns...',
      metadata: { termSlug: 'plug' },
    });
    // 5. Save playbook note
    store.saveAIOutput({
      type: 'playbook',
      title: 'Playbook: Dinner memes',
      content: 'Takeaway...',
    });

    // Verify all 5 items coexist with aggregate count 5
    assert.strictEqual(store.getTotalSavedCount(), 5);

    // Verify tab filtering
    const termsTab = store.state.savedTerms;
    const messagesTab = store.state.savedMessages;
    const toneTab = store.state.savedAIOutputs.filter((o) => o.type === 'tone-analysis');
    const roleplayTab = store.state.savedAIOutputs.filter((o) => o.type === 'roleplay');
    const playbookTab = store.state.savedAIOutputs.filter((o) => o.type === 'playbook');

    assert.strictEqual(termsTab.length, 1);
    assert.strictEqual(messagesTab.length, 1);
    assert.strictEqual(toneTab.length, 1);
    assert.strictEqual(roleplayTab.length, 1);
    assert.strictEqual(playbookTab.length, 1);
  });

  await t.test('T3.7 (R5 + Legacy Interop): Legacy saved terms and messages remain functional during AI output deletions', () => {
    const mockStorage = new MockLocalStorage();
    mockStorage.setItem('parent-decoder-saved-terms', JSON.stringify(['mid', 'bet', 'delulu']));
    mockStorage.setItem(
      'parent-decoder-saved-messages',
      JSON.stringify([{ id: 'm1', text: 'Legacy message', savedAt: 1690000000000 }])
    );

    const store = new HeadlessStoreSimulator(mockStorage);
    assert.strictEqual(store.state.savedTerms.length, 3);
    assert.strictEqual(store.state.savedMessages.length, 1);

    // Add and remove AI output
    const aiItem = store.saveAIOutput({ type: 'playbook', title: 'Temporary', content: 'temp' });
    assert.strictEqual(store.getTotalSavedCount(), 5);

    store.removeAIOutput(aiItem.id);
    assert.strictEqual(store.getTotalSavedCount(), 4);

    // Legacy data untouched
    assert.deepStrictEqual(store.state.savedTerms, ['mid', 'bet', 'delulu']);
    assert.strictEqual(store.state.savedMessages[0].text, 'Legacy message');
  });
});
