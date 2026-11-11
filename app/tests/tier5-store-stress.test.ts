import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import esbuild from 'esbuild';
import React from 'react';
import ReactDOM from 'react-dom/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

// ─────────────────────────────────────────────────────────────
// Headless DOM & Storage Test Environment Setup for React 19
// ─────────────────────────────────────────────────────────────

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

class MockLocalStorage {
  public store = new Map<string, string>();
  public throwOnSet = false;

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  setItem(key: string, value: string): void {
    if (this.throwOnSet) {
      throw new Error('QuotaExceededError: DOMException quota exceeded');
    }
    this.store.set(key, String(value));
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  dump(): Record<string, string> {
    const res: Record<string, string> = {};
    for (const [k, v] of this.store.entries()) {
      res[k] = v;
    }
    return res;
  }
}

class MockElement {
  public nodeType = 1;
  public nodeName: string;
  public tagName: string;
  public style: Record<string, string> = {};
  public attributes: Record<string, string> = {};
  public childNodes: any[] = [];
  public parentNode: any = null;
  public ownerDocument: any = null;

  constructor(tag = 'div') {
    this.nodeName = tag.toUpperCase();
    this.tagName = tag.toUpperCase();
  }

  setAttribute(k: string, v: string) { this.attributes[k] = v; }
  getAttribute(k: string) { return this.attributes[k]; }
  addEventListener() {}
  removeEventListener() {}
  appendChild(child: any) {
    this.childNodes.push(child);
    child.parentNode = this;
    return child;
  }
  removeChild(child: any) {
    const i = this.childNodes.indexOf(child);
    if (i >= 0) this.childNodes.splice(i, 1);
    return child;
  }
  insertBefore(child: any, ref: any) {
    const i = this.childNodes.indexOf(ref);
    if (i >= 0) this.childNodes.splice(i, 0, child);
    else this.childNodes.push(child);
    return child;
  }
}

// Global DOM fixtures
(globalThis as any).Element = MockElement;
(globalThis as any).HTMLElement = MockElement;
(globalThis as any).HTMLIFrameElement = function() {};

const mockDocument = {
  nodeType: 9,
  defaultView: globalThis,
  activeElement: null,
  createElement: (tag: string) => new MockElement(tag),
  createDocumentFragment: () => new MockElement('#fragment'),
  createTextNode: (text: string) => ({ nodeType: 3, nodeValue: text, textContent: text }),
  createComment: (text: string) => ({ nodeType: 8, nodeValue: text }),
  addEventListener() {},
  removeEventListener() {},
};

(globalThis as any).document = mockDocument;
(globalThis as any).window = globalThis;
(globalThis as any).window.setTimeout = () => 1;
(globalThis as any).window.clearTimeout = () => {};

// ─────────────────────────────────────────────────────────────
// Store Loader & React Mount Harness
// ─────────────────────────────────────────────────────────────

function mountRealStore(initialStorage: Record<string, string> = {}) {
  const storage = new MockLocalStorage();
  for (const [k, v] of Object.entries(initialStorage)) {
    storage.setItem(k, v);
  }
  (globalThis as any).localStorage = storage;

  // Compile app/src/store.tsx directly with esbuild
  const storePath = path.resolve(__dirname, '../src/store.tsx');
  const rawCode = fs.readFileSync(storePath, 'utf8');
  const compiled = esbuild.transformSync(rawCode, { loader: 'tsx', format: 'cjs' });

  const mod: { exports: any } = { exports: {} };
  const fn = new Function('React', 'require', 'exports', 'module', compiled.code);
  fn(React, require, mod.exports, mod);

  const { AppProvider, useApp } = mod.exports;

  let currentStore: any = null;
  function StoreConsumer() {
    currentStore = useApp();
    return React.createElement('div', null, 'StoreConsumerActive');
  }

  const container = new MockElement('div');
  container.ownerDocument = mockDocument;
  const root = ReactDOM.createRoot(container as any);

  React.act(() => {
    root.render(React.createElement(AppProvider, null, React.createElement(StoreConsumer)));
  });

  return {
    getStore: () => currentStore,
    storage,
    root,
    act: (callback: () => void) => {
      React.act(callback);
    },
    unmount: () => {
      React.act(() => {
        root.unmount();
      });
    },
  };
}

// ─────────────────────────────────────────────────────────────
// Tier 5 Store Stress Test Suite
// ─────────────────────────────────────────────────────────────

test('Tier 5: Store Stress, Zero Data Loss & Invariant Verification', async (t) => {

  // ─────────────────────────────────────────────────────────
  // Suite 1: Zero Data Loss Verification
  // ─────────────────────────────────────────────────────────

  await t.test('5.1: Zero Data Loss — pre-populated savedTerms and savedMessages remain 100% intact across 100+ operations', () => {
    const initialTerms = [
      'cooked', 'rizz', 'gyatt', 'fanum-tax', 'delulu',
      'skibidi', 'bussing', 'cap', 'no-cap', 'bet',
      'mewing', 'ratio', 'sus', 'opp', 'sigma',
      'npc', 'mid', 'drip', 'glow-up', 'salty',
      'simp', 'sheesh', 'slay', 'stan', 'touch-grass',
      'based', 'boomer', 'clout', 'cringe', 'flex',
      'gatekeep', 'gaslight', 'girlboss', 'goated', 'hits-different',
      'ick', 'iykyk', 'karen', 'lowkey', 'highkey',
      'main-character', 'mood', 'periodt', 'rent-free', 'savage',
      'shook', 'snack', 'tea', 'vibe-check', 'yeet',
    ];

    const initialMessages = Array.from({ length: 20 }, (_, i) => ({
      id: `msg_${1000 + i}`,
      text: `Legacy teen text message #${i + 1}: "Are we cooked for the finals? 💀"`,
      savedAt: 1700000000000 + i * 100000,
    }));

    const harness = mountRealStore({
      'parent-decoder-saved-terms': JSON.stringify(initialTerms),
      'parent-decoder-saved-messages': JSON.stringify(initialMessages),
    });

    let store = harness.getStore();
    assert.deepStrictEqual(store.savedTerms, initialTerms, 'Initial terms must match storage');
    assert.deepStrictEqual(store.savedMessages, initialMessages, 'Initial messages must match storage');

    // Run 90 diverse store saves
    harness.act(() => {
      for (let i = 0; i < 30; i++) {
        store.saveAIOutput({
          type: 'tone-analysis',
          title: `Tone Assessment #${i}`,
          content: `Automated tone analysis result #${i}`,
        });
      }
      for (let i = 0; i < 30; i++) {
        store.saveAIOutput({
          type: 'roleplay',
          title: `Roleplay Dialogue #${i}`,
          content: `Dialogue script turn #${i}`,
        });
      }
      for (let i = 0; i < 30; i++) {
        store.saveAIOutput({
          type: 'playbook',
          title: `Playbook Scenario #${i}`,
          content: `Playbook guidance notes #${i}`,
        });
      }
    });

    store = harness.getStore();
    assert.strictEqual(store.savedAIOutputs.length, 50, 'Must be bounded to 50 items');

    // Remove 10 items
    harness.act(() => {
      const itemsToRemove = store.savedAIOutputs.slice(0, 10);
      for (const item of itemsToRemove) {
        store.removeAIOutput(item.id);
      }
    });

    store = harness.getStore();
    assert.strictEqual(store.savedAIOutputs.length, 40);

    // Clear tone-analysis category selectively
    harness.act(() => {
      store.clearAIOutputs('tone-analysis');
    });

    store = harness.getStore();

    // Add 10 more items
    harness.act(() => {
      for (let i = 0; i < 10; i++) {
        store.saveAIOutput({
          type: 'playbook',
          title: `Additional Playbook #${i}`,
          content: `Guidance #${i}`,
        });
      }
    });

    store = harness.getStore();

    // Full clear of AI outputs
    harness.act(() => {
      store.clearAIOutputs();
    });

    store = harness.getStore();

    // VERIFY ZERO DATA LOSS:
    // 1. In React state
    assert.deepStrictEqual(store.savedTerms, initialTerms, 'savedTerms in React state must remain 100% intact');
    assert.deepStrictEqual(store.savedMessages, initialMessages, 'savedMessages in React state must remain 100% intact');

    // 2. In localStorage
    const storedTerms = JSON.parse(harness.storage.getItem('parent-decoder-saved-terms')!);
    const storedMessages = JSON.parse(harness.storage.getItem('parent-decoder-saved-messages')!);

    assert.deepStrictEqual(storedTerms, initialTerms, 'localStorage parent-decoder-saved-terms must remain untouched');
    assert.deepStrictEqual(storedMessages, initialMessages, 'localStorage parent-decoder-saved-messages must remain untouched');

    // 3. Verify legacy mutations still work without corrupting AI outputs
    harness.act(() => {
      store.toggleTerm('brand-new-term');
      store.saveMessage('New incoming message text');
    });

    store = harness.getStore();
    assert.ok(store.savedTerms.includes('brand-new-term'), 'toggleTerm must function normally');
    assert.strictEqual(store.savedMessages[0].text, 'New incoming message text', 'saveMessage must function normally');
    assert.deepStrictEqual(store.savedAIOutputs, [], 'savedAIOutputs remains empty');

    harness.unmount();
  });

  // ─────────────────────────────────────────────────────────
  // Suite 2: Deduplication Stress Testing
  // ─────────────────────────────────────────────────────────

  await t.test('5.2: Deduplication — multiple saves with same title & type collapse to 1 entry with updated timestamp', () => {
    const harness = mountRealStore();
    let store = harness.getStore();

    assert.strictEqual(store.isAIOutputSaved('Dinner Table Banter', 'playbook'), false);

    let savedAt1: number;

    // First save
    harness.act(() => {
      store.saveAIOutput({
        type: 'playbook',
        title: 'Dinner Table Banter',
        content: 'Initial playbook content v1',
        summary: 'Summary v1',
      });
    });

    store = harness.getStore();
    assert.strictEqual(store.savedAIOutputs.length, 1);
    assert.strictEqual(store.savedAIOutputs[0].title, 'Dinner Table Banter');
    assert.strictEqual(store.savedAIOutputs[0].content, 'Initial playbook content v1');
    savedAt1 = store.savedAIOutputs[0].savedAt;

    assert.strictEqual(store.isAIOutputSaved('Dinner Table Banter', 'playbook'), true);
    assert.strictEqual(store.isAIOutputSaved('  DINNER TABLE BANTER  ', 'playbook'), true, 'Case and whitespace insensitive check');
    assert.strictEqual(store.isAIOutputSaved('Dinner Table Banter', 'roleplay'), false, 'Different type must return false');

    // Second save: same title (different casing + padding), same type, updated content
    harness.act(() => {
      store.saveAIOutput({
        type: 'playbook',
        title: '  dinner table banter  ',
        content: 'Updated playbook content v2',
        summary: 'Summary v2',
      });
    });

    store = harness.getStore();
    assert.strictEqual(store.savedAIOutputs.length, 1, 'Length must remain 1 after deduplication');
    assert.strictEqual(store.savedAIOutputs[0].content, 'Updated playbook content v2', 'Content must be updated');
    assert.strictEqual(store.savedAIOutputs[0].summary, 'Summary v2');
    assert.ok(store.savedAIOutputs[0].savedAt >= savedAt1, 'savedAt timestamp must be updated');

    // Third save: same title across DIFFERENT type ('roleplay')
    harness.act(() => {
      store.saveAIOutput({
        type: 'roleplay',
        title: 'Dinner Table Banter',
        content: 'Roleplay dialogue content',
      });
    });

    store = harness.getStore();
    assert.strictEqual(store.savedAIOutputs.length, 2, 'Different type with same title must NOT deduplicate');
    assert.strictEqual(store.isAIOutputSaved('Dinner Table Banter', 'roleplay'), true);
    assert.strictEqual(store.isAIOutputSaved('Dinner Table Banter', 'playbook'), true);

    // Fourth save: same title across third type ('tone-analysis')
    harness.act(() => {
      store.saveAIOutput({
        type: 'tone-analysis',
        title: 'Dinner Table Banter',
        content: 'Tone analysis rating',
      });
    });

    store = harness.getStore();
    assert.strictEqual(store.savedAIOutputs.length, 3, 'All 3 distinct types must coexist');

    // Deduplicate only the 'roleplay' type
    harness.act(() => {
      store.saveAIOutput({
        type: 'roleplay',
        title: 'dinner table banter',
        content: 'Roleplay dialogue content v2',
      });
    });

    store = harness.getStore();
    assert.strictEqual(store.savedAIOutputs.length, 3, 'Total count must remain 3');
    const roleplayItem = store.savedAIOutputs.find((i: any) => i.type === 'roleplay');
    assert.strictEqual(roleplayItem.content, 'Roleplay dialogue content v2');

    harness.unmount();
  });

  // ─────────────────────────────────────────────────────────
  // Suite 3: Selective Clear vs Full Clear
  // ─────────────────────────────────────────────────────────

  await t.test('5.3: Selective Clear vs Full Clear — category isolation and zero legacy spillover', () => {
    const harness = mountRealStore({
      'parent-decoder-saved-terms': JSON.stringify(['cooked', 'bet']),
      'parent-decoder-saved-messages': JSON.stringify([{ id: 'm1', text: 'Hey', savedAt: 100 }]),
    });
    let store = harness.getStore();

    // Populate 5 of each type: 15 items total
    harness.act(() => {
      for (let i = 0; i < 5; i++) {
        store.saveAIOutput({ type: 'tone-analysis', title: `Tone ${i}`, content: `Content ${i}` });
        store.saveAIOutput({ type: 'roleplay', title: `Roleplay ${i}`, content: `Content ${i}` });
        store.saveAIOutput({ type: 'playbook', title: `Playbook ${i}`, content: `Content ${i}` });
      }
    });

    store = harness.getStore();
    assert.strictEqual(store.savedAIOutputs.length, 15);

    // Selective clear: tone-analysis
    harness.act(() => {
      store.clearAIOutputs('tone-analysis');
    });

    store = harness.getStore();
    assert.strictEqual(store.savedAIOutputs.length, 10);
    assert.strictEqual(store.savedAIOutputs.filter((i: any) => i.type === 'tone-analysis').length, 0);
    assert.strictEqual(store.savedAIOutputs.filter((i: any) => i.type === 'roleplay').length, 5);
    assert.strictEqual(store.savedAIOutputs.filter((i: any) => i.type === 'playbook').length, 5);

    // Selective clear: roleplay
    harness.act(() => {
      store.clearAIOutputs('roleplay');
    });

    store = harness.getStore();
    assert.strictEqual(store.savedAIOutputs.length, 5);
    assert.strictEqual(store.savedAIOutputs.filter((i: any) => i.type === 'roleplay').length, 0);
    assert.strictEqual(store.savedAIOutputs.filter((i: any) => i.type === 'playbook').length, 5);

    // Verify savedTerms & savedMessages remained completely intact
    assert.deepStrictEqual(store.savedTerms, ['cooked', 'bet']);
    assert.strictEqual(store.savedMessages.length, 1);

    // Full clear
    harness.act(() => {
      store.clearAIOutputs();
    });

    store = harness.getStore();
    assert.strictEqual(store.savedAIOutputs.length, 0);
    assert.deepStrictEqual(JSON.parse(harness.storage.getItem('parent-decoder-saved-ai-outputs')!), []);
    assert.deepStrictEqual(JSON.parse(harness.storage.getItem('parent-decoder-saved-terms')!), ['cooked', 'bet']);
    assert.strictEqual(JSON.parse(harness.storage.getItem('parent-decoder-saved-messages')!).length, 1);

    harness.unmount();
  });

  // ─────────────────────────────────────────────────────────
  // Suite 4: Quota & Bounding to 50 items
  // ─────────────────────────────────────────────────────────

  await t.test('5.4: Quota Bounding — list strictly bounds to 50 items with MRU eviction ordering', () => {
    const harness = mountRealStore();
    let store = harness.getStore();

    // Sequentially save 80 distinct items
    for (let i = 1; i <= 80; i++) {
      harness.act(() => {
        store.saveAIOutput({
          type: 'playbook',
          title: `Playbook Scenario #${i}`,
          content: `Content payload for item ${i}`,
        });
      });

      store = harness.getStore();
      if (i <= 50) {
        assert.strictEqual(store.savedAIOutputs.length, i, `Length should be ${i} before reaching cap`);
      } else {
        assert.strictEqual(store.savedAIOutputs.length, 50, 'Length must be strictly capped at 50');
      }
    }

    assert.strictEqual(store.savedAIOutputs.length, 50, 'Final count must be exactly 50');

    // Most recent items must be at the front (MRU order)
    assert.strictEqual(store.savedAIOutputs[0].title, 'Playbook Scenario #80');
    assert.strictEqual(store.savedAIOutputs[1].title, 'Playbook Scenario #79');
    assert.strictEqual(store.savedAIOutputs[49].title, 'Playbook Scenario #31');

    // Oldest items (1..30) must have been evicted
    for (let i = 1; i <= 30; i++) {
      assert.strictEqual(
        store.isAIOutputSaved(`Playbook Scenario #${i}`, 'playbook'),
        false,
        `Item #${i} must have been evicted`
      );
    }

    // Items 31..80 must all exist
    for (let i = 31; i <= 80; i++) {
      assert.strictEqual(
        store.isAIOutputSaved(`Playbook Scenario #${i}`, 'playbook'),
        true,
        `Item #${i} must exist in store`
      );
    }

    // Re-saving item #40 (currently near the end) must bring it to index 0 without changing count
    harness.act(() => {
      store.saveAIOutput({
        type: 'playbook',
        title: 'Playbook Scenario #40',
        content: 'Promoted item content',
      });
    });

    store = harness.getStore();
    assert.strictEqual(store.savedAIOutputs.length, 50, 'Count must remain exactly 50');
    assert.strictEqual(store.savedAIOutputs[0].title, 'Playbook Scenario #40', 'Re-saved item promoted to index 0');
    assert.strictEqual(store.savedAIOutputs[0].content, 'Promoted item content');

    harness.unmount();
  });

  // ─────────────────────────────────────────────────────────
  // Suite 5: Adversarial Inputs & Boundary Edge Cases
  // ─────────────────────────────────────────────────────────

  await t.test('5.5: Adversarial Inputs — input sanitation, limits, and storage error resilience', () => {
    const harness = mountRealStore();
    let store = harness.getStore();

    // 1. Empty title or whitespace only
    harness.act(() => {
      store.saveAIOutput({ type: 'tone-analysis', title: '   ', content: 'Valid content' });
      store.saveAIOutput({ type: 'tone-analysis', title: '', content: 'Valid content' });
    });
    store = harness.getStore();
    assert.strictEqual(store.savedAIOutputs.length, 0, 'Empty or whitespace title must be rejected');

    // 2. Empty content or whitespace only
    harness.act(() => {
      store.saveAIOutput({ type: 'tone-analysis', title: 'Valid Title', content: '   ' });
      store.saveAIOutput({ type: 'tone-analysis', title: 'Valid Title', content: '' });
    });
    store = harness.getStore();
    assert.strictEqual(store.savedAIOutputs.length, 0, 'Empty or whitespace content must be rejected');

    // 3. Oversized title (>200 chars) & content (>10,000 chars) & summary (>500 chars)
    const longTitle = 'T'.repeat(350);
    const longContent = 'C'.repeat(25000);
    const longSummary = 'S'.repeat(1200);

    harness.act(() => {
      store.saveAIOutput({
        type: 'tone-analysis',
        title: longTitle,
        content: longContent,
        summary: longSummary,
      });
    });

    store = harness.getStore();
    assert.strictEqual(store.savedAIOutputs.length, 1);
    const saved = store.savedAIOutputs[0];
    assert.strictEqual(saved.title.length, 200, 'Title must be sliced to 200 characters');
    assert.strictEqual(saved.content.length, 10000, 'Content must be sliced to 10000 characters');
    assert.strictEqual(saved.summary.length, 500, 'Summary must be sliced to 500 characters');

    // 4. Unicode emojis and special characters preservation
    const unicodeTitle = '🔌 Plug vs 💀 Cooked / "Quoted" & <Escaped>';
    const unicodeContent = 'Emojis: 🎉 🔥 ✨ 🚀 🧠 \nLines: \t Indented';

    harness.act(() => {
      store.saveAIOutput({
        type: 'roleplay',
        title: unicodeTitle,
        content: unicodeContent,
        metadata: { term: 'plug', concern: 'high' },
      });
    });

    store = harness.getStore();
    const unicodeSaved = store.savedAIOutputs[0];
    assert.strictEqual(unicodeSaved.title, unicodeTitle);
    assert.strictEqual(unicodeSaved.content, unicodeContent);
    assert.deepStrictEqual(unicodeSaved.metadata, { term: 'plug', concern: 'high' });

    // 5. Corrupted localStorage resilience on store mount
    const corruptedHarness = mountRealStore({
      'parent-decoder-saved-ai-outputs': '{{{INVALID_JSON',
      'parent-decoder-saved-terms': '{"notAnArray": 123}',
      'parent-decoder-saved-messages': 'null',
    });

    const corruptedStore = corruptedHarness.getStore();
    assert.deepStrictEqual(corruptedStore.savedAIOutputs, [], 'Must fallback to empty array on malformed JSON');
    assert.deepStrictEqual(corruptedStore.savedTerms, [], 'Must fallback to empty array on non-array JSON');
    assert.deepStrictEqual(corruptedStore.savedMessages, [], 'Must fallback to empty array on null JSON');

    // 6. QuotaExceededError resilience
    corruptedHarness.storage.throwOnSet = true;
    // Should NOT throw uncaught error
    assert.doesNotThrow(() => {
      corruptedHarness.act(() => {
        corruptedStore.saveAIOutput({
          type: 'playbook',
          title: 'Quota Test',
          content: 'Test content',
        });
      });
    }, 'Storage quota failure must be handled gracefully without crashing React');

    // 7. Non-existent ID removal
    assert.doesNotThrow(() => {
      corruptedHarness.act(() => {
        corruptedStore.removeAIOutput('non-existent-id-99999');
      });
    }, 'Removing non-existent ID must be a safe no-op');

    harness.unmount();
    corruptedHarness.unmount();
  });

});
