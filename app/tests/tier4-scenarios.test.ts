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

test('Tier 4: Real-World Workload Scenarios (End-to-End Parent Workflows)', async (t) => {
  await t.test('T4.1: Workflow - Dinner Table Brainrot Crisis (End-to-End)', async () => {
    // Stage 1: Setup storage with clean state
    const storage = new MockLocalStorage();
    const store = new HeadlessStoreSimulator(storage);
    const clipboard = new MockClipboard();

    // Stage 2: Parent arrives at /copilot on browser without local AI
    const aiStatus = { engine: 'unavailable' as const, ready: false };
    assert.strictEqual(aiStatus.engine, 'unavailable');

    // Playbook renders with rotating queue
    const queue = new PlaybookQueueStateMachine();
    assert.strictEqual(queue.scenarios.length, 3);

    // Parent navigates to "Brainrot memes at the dinner table" scenario
    queue.goTo(1);
    const scenario = queue.getCurrentScenario();
    assert.strictEqual(scenario.title, 'Brainrot memes at the dinner table');
    assert.ok(scenario.sampleDialogue.includes('salad') || scenario.description.includes('meals'));

    // Stage 3: Parent uses Tone Checklist
    const checklist = new ToneChecklistStateMachine();
    checklist.toggle('tone-one-sided');
    assert.strictEqual(checklist.getSeverity(), 'Harmless / Normal Banter');

    // Stage 4: Parent saves Playbook Note to Saved Items
    const savedNote = store.saveAIOutput({
      type: 'playbook',
      title: `Playbook: ${scenario.title}`,
      content: `${scenario.description}\n\nApproach: ${scenario.parentApproach}\nTakeaway: ${scenario.takeaway}`,
      summary: scenario.takeaway,
      metadata: { scenarioId: scenario.id, score: String(checklist.getScore()) },
    });
    assert.ok(savedNote.id);
    assert.strictEqual(store.getTotalSavedCount(), 1);

    // Stage 5: Parent navigates to /term/skibidi
    const skibidiTerm = terms.find((t) => t.slug === 'skibidi')!;
    assert.ok(skibidiTerm);

    // Button reads "View conversation script & tips"
    const buttonLabel = aiStatus.engine === 'local' ? 'Practice this conversation' : 'View conversation script & tips';
    assert.strictEqual(buttonLabel, 'View conversation script & tips');

    // Drawer opens with realistic dialogue script
    const sampleDialogue = `Parent: ${skibidiTerm.opener}\nTeen: It's just a funny meme series, everyone watches it.\nParent: Help me understand why it caught on so fast.`;
    const savedScript = store.saveAIOutput({
      type: 'roleplay',
      title: `Practice: ${skibidiTerm.term}`,
      content: sampleDialogue,
      summary: `Dialogue script for ${skibidiTerm.term}`,
      metadata: { termSlug: skibidiTerm.slug, termName: skibidiTerm.term },
    });
    assert.strictEqual(store.getTotalSavedCount(), 2);

    // Stage 6: Parent visits /saved
    const reloadedStore = new HeadlessStoreSimulator(storage);
    assert.strictEqual(reloadedStore.getTotalSavedCount(), 2);

    const savedPlaybooks = reloadedStore.state.savedAIOutputs.filter((o) => o.type === 'playbook');
    const savedRoleplays = reloadedStore.state.savedAIOutputs.filter((o) => o.type === 'roleplay');

    assert.strictEqual(savedPlaybooks.length, 1);
    assert.strictEqual(savedPlaybooks[0].title, 'Playbook: Brainrot memes at the dinner table');

    assert.strictEqual(savedRoleplays.length, 1);
    assert.strictEqual(savedRoleplays[0].title, 'Practice: skibidi');
    assert.ok(savedRoleplays[0].content.includes(skibidiTerm.opener));
  });

  await t.test('T4.2: Workflow - Gaming vs Party Slang Discord Alert (End-to-End)', async () => {
    const storage = new MockLocalStorage();
    const store = new HeadlessStoreSimulator(storage);
    const clipboard = new MockClipboard();

    // Stage 1: Parent arrives on /copilot with local AI available
    const plugPrompt = REQUIRED_STARTER_PILLS[2];
    assert.ok(plugPrompt.includes('plug 🔌'));

    // Click starter pill populates input
    let copilotInput = plugPrompt;
    assert.strictEqual(copilotInput, "How do I ask about 'plug 🔌' without sounding like a cop?");

    // Stage 2: Parent views Chrome AI Setup Guide
    await clipboard.writeText(CHROME_AI_GUIDE_CONSTANTS.flagUrl);
    assert.strictEqual(clipboard.lastWrittenText, 'chrome://flags/#prompt-api-for-gemini-nano');

    await clipboard.writeText(CHROME_AI_GUIDE_CONSTANTS.componentsUrl);
    assert.strictEqual(clipboard.lastWrittenText, 'chrome://components');

    // Stage 3: Parent checks /term/plug to verify context clues
    const plugTerm = terms.find((t) => t.slug === 'plug')!;
    assert.ok(plugTerm);
    assert.ok(plugTerm.plainMeaning.length > 0);
    assert.ok(plugTerm.contextClues.length > 0);

    // Stage 4: Parent saves tone analysis from Copilot advice
    store.saveAIOutput({
      type: 'tone-analysis',
      title: 'Tone Analysis: Asking about "plug"',
      content: 'Tone recommendation: Focus on platform and gaming context first before assuming illicit meaning.',
      summary: 'Keep it curious, not investigative',
      metadata: { termSlug: 'plug' },
    });

    assert.strictEqual(store.getTotalSavedCount(), 1);

    // Stage 5: Reload persistence check
    const persistentStore = new HeadlessStoreSimulator(storage);
    assert.strictEqual(persistentStore.getTotalSavedCount(), 1);
    assert.strictEqual(persistentStore.state.savedAIOutputs[0].type, 'tone-analysis');
  });

  await t.test('T4.3: Workflow - Comprehensive Multi-Feature Parenting Session (End-to-End)', async () => {
    const storage = new MockLocalStorage();
    // Pre-populate legacy terms
    storage.setItem('parent-decoder-saved-terms', JSON.stringify(['mid', 'rizz']));
    storage.setItem(
      'parent-decoder-saved-messages',
      JSON.stringify([{ id: 'msg_legacy', text: 'Hey bro you got rizz?', savedAt: 1700000000000 }])
    );

    const store = new HeadlessStoreSimulator(storage);
    const clipboard = new MockClipboard();

    assert.strictEqual(store.state.savedTerms.length, 2);
    assert.strictEqual(store.state.savedMessages.length, 1);
    assert.strictEqual(store.getTotalSavedCount(), 3);

    // 1. Playbook cycle & pause
    const queue = new PlaybookQueueStateMachine();
    queue.next();
    queue.onMouseEnter();
    queue.tick(); // Paused
    assert.strictEqual(queue.currentIndex, 1);
    queue.onMouseLeave();

    // 2. Tone Checklist interaction
    const checklist = new ToneChecklistStateMachine();
    checklist.toggle('tone-pressure');
    checklist.toggle('tone-hostile');
    assert.strictEqual(checklist.getSeverity(), 'Intervention Recommended');

    // Save Playbook Note
    store.saveAIOutput({
      type: 'playbook',
      title: 'Tone Checklist: High Pressure Alert',
      content: 'Intervention recommended due to pressure and hostile dynamics.',
      summary: 'Intervention Recommended',
    });
    assert.strictEqual(store.getTotalSavedCount(), 4);

    // 3. Fallback script generation & save for 'cook'
    const cookTerm = terms.find((t) => t.slug === 'cook')!;
    assert.ok(cookTerm);
    store.saveAIOutput({
      type: 'roleplay',
      title: `Practice: ${cookTerm.term}`,
      content: `Parent: ${cookTerm.opener}\nTeen: We are letting him cook!`,
      metadata: { termSlug: cookTerm.slug },
    });
    assert.strictEqual(store.getTotalSavedCount(), 5);

    // 4. Tone analysis from decoder
    store.saveAIOutput({
      type: 'tone-analysis',
      title: 'Tone Analysis: Dinner text check',
      content: 'Score: 88/100. Low cringe.',
    });
    assert.strictEqual(store.getTotalSavedCount(), 6);

    // 5. Verification on /saved
    assert.strictEqual(store.state.savedTerms.length, 2);
    assert.strictEqual(store.state.savedMessages.length, 1);
    assert.strictEqual(store.state.savedAIOutputs.length, 3);

    // Delete one AI output
    const playbookItem = store.state.savedAIOutputs.find((o) => o.type === 'playbook')!;
    store.removeAIOutput(playbookItem.id);
    assert.strictEqual(store.getTotalSavedCount(), 5);

    // Verify legacy items remain intact
    assert.deepStrictEqual(store.state.savedTerms, ['mid', 'rizz']);
    assert.strictEqual(store.state.savedMessages[0].text, 'Hey bro you got rizz?');
  });
});
