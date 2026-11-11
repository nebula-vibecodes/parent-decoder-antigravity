import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import ReactDOM from 'react-dom/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─────────────────────────────────────────────────────────────
// 1. Headless DOM & Storage Environment Setup for React 19
// ─────────────────────────────────────────────────────────────

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

class MockElement {
  public nodeType = 1;
  public nodeName: string;
  public tagName: string;
  public style: Record<string, string> = {};
  public attributes: Record<string, string> = {};
  public childNodes: any[] = [];
  public parentNode: any = null;
  public ownerDocument: any = null;
  public listeners: Record<string, Function[]> = {};
  public value: string = '';
  public disabled: boolean = false;
  public type: string = '';

  constructor(tag = 'div') {
    this.nodeName = tag.toUpperCase();
    this.tagName = tag.toUpperCase();
    this.type = tag === 'button' ? 'button' : tag === 'input' ? 'text' : '';
  }

  setAttribute(k: string, v: string) {
    this.attributes[k] = String(v);
    if (k === 'disabled') this.disabled = true;
    if (k === 'value') this.value = String(v);
    if (k === 'type') this.type = String(v);
  }
  getAttribute(k: string) { return this.attributes[k]; }
  hasAttribute(k: string) { return k in this.attributes; }
  removeAttribute(k: string) {
    delete this.attributes[k];
    if (k === 'disabled') this.disabled = false;
  }

  addEventListener(event: string, handler: Function) {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(handler);
  }
  removeEventListener(event: string, handler: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((h) => h !== handler);
    }
  }

  appendChild(child: any) {
    this.childNodes.push(child);
    child.parentNode = this;
    return child;
  }
  removeChild(child: any) {
    const idx = this.childNodes.indexOf(child);
    if (idx >= 0) this.childNodes.splice(idx, 1);
    return child;
  }
  insertBefore(child: any, ref: any) {
    const idx = this.childNodes.indexOf(ref);
    if (idx >= 0) this.childNodes.splice(idx, 0, child);
    else this.childNodes.push(child);
    child.parentNode = this;
    return child;
  }
}

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

  get length(): number {
    return this.store.size;
  }

  dump(): Record<string, string> {
    const res: Record<string, string> = {};
    for (const [k, v] of this.store.entries()) {
      res[k] = v;
    }
    return res;
  }
}

class MockClipboard {
  public contents: string = '';
  async writeText(text: string): Promise<void> {
    this.contents = text;
  }
  async readText(): Promise<string> {
    return this.contents;
  }
  reset(): void {
    this.contents = '';
  }
}

(globalThis as any).Element = MockElement;
(globalThis as any).HTMLElement = MockElement;
(globalThis as any).HTMLInputElement = MockElement;
(globalThis as any).HTMLButtonElement = MockElement;
(globalThis as any).HTMLIFrameElement = function () {};

const mockDocument = {
  nodeType: 9,
  defaultView: globalThis,
  createElement: (tag: string) => new MockElement(tag),
  createDocumentFragment: () => new MockElement('#fragment'),
  createTextNode: (text: string) => ({ nodeType: 3, nodeValue: text, textContent: text }),
  createComment: (text: string) => ({ nodeType: 8, nodeValue: text }),
  addEventListener() {},
  removeEventListener() {},
};

(globalThis as any).document = mockDocument;
(globalThis as any).window = globalThis;
(globalThis as any).window.setTimeout = (cb: Function) => {
  cb();
  return 1;
};
(globalThis as any).window.clearTimeout = () => {};

const mockClipboard = new MockClipboard();
try {
  Object.defineProperty(globalThis.navigator, 'clipboard', {
    value: mockClipboard,
    configurable: true,
    writable: true,
  });
} catch {
  Object.defineProperty(globalThis, 'navigator', {
    value: { clipboard: mockClipboard },
    configurable: true,
    writable: true,
  });
}

// ─────────────────────────────────────────────────────────────
// 2. Component Loaders via esbuild
// ─────────────────────────────────────────────────────────────

// Compile store.tsx once so context is shared across components
const storePath = path.resolve(__dirname, '../src/store.tsx');
const storeRaw = fs.readFileSync(storePath, 'utf8');
const storeCompiled = esbuild.transformSync(storeRaw, { loader: 'tsx', format: 'cjs' });

let sharedStorage = new MockLocalStorage();
(globalThis as any).localStorage = sharedStorage;

const sharedStoreMod: { exports: any } = { exports: {} };
const storeFn = new Function('React', 'require', 'exports', 'module', storeCompiled.code);
storeFn(React, (id: string) => {
  if (id === 'react') return React;
  throw new Error(`Unhandled require in store.tsx: ${id}`);
}, sharedStoreMod.exports, sharedStoreMod);

const { AppProvider, useApp, copyText } = sharedStoreMod.exports;

function loadRealStore(initialStorage: Record<string, string> = {}) {
  const storage = new MockLocalStorage();
  for (const [k, v] of Object.entries(initialStorage)) {
    storage.setItem(k, v);
  }
  (globalThis as any).localStorage = storage;

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
    AppProvider,
    useApp,
    copyText,
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

// Load SavedPage with specific tab
function loadSavedPageComponent(forcedTab?: string) {
  const savedPagePath = path.resolve(__dirname, '../src/pages/SavedPage.tsx');
  let rawCode = fs.readFileSync(savedPagePath, 'utf8');
  if (forcedTab) {
    rawCode = rawCode.replace(
      "const [tab, setTab] = useState<SavedTab>('terms')",
      `const [tab, setTab] = useState<SavedTab>('${forcedTab}' as any)`
    );
  }
  const compiled = esbuild.transformSync(rawCode, { loader: 'tsx', format: 'cjs' });

  let lastNavigated: string | null = null;
  const mockNavigate = (to: string) => { lastNavigated = to; };

  const mod: { exports: any } = { exports: {} };
  const fn = new Function('React', 'require', 'exports', 'module', compiled.code);
  fn(React, (id: string) => {
    if (id === 'react') return React;
    if (id === 'react-router') {
      return {
        useNavigate: () => mockNavigate,
        Link: ({ to, children, className, ...props }: any) =>
          React.createElement('a', { href: to, className, ...props }, children),
      };
    }
    if (id === 'lucide-react') {
      return new Proxy({}, {
        get: (_target, prop: string) => (props: any) =>
          React.createElement('span', { 'data-icon': prop, ...props }),
      });
    }
    if (id === '../data') {
      return {
        findTerm: (slug: string) => ({
          term: slug.toUpperCase(),
          slug,
          plainMeaning: `Definition for ${slug}`,
          category: 'Slang',
        }),
      };
    }
    if (id === '../components/AppShell') {
      return {
        PageIntro: ({ eyebrow, title, children }: any) =>
          React.createElement('div', { className: 'page-intro' },
            React.createElement('span', { className: 'eyebrow' }, eyebrow),
            React.createElement('h1', null, title),
            children
          ),
        TermCard: ({ item }: any) =>
          React.createElement('div', { className: 'term-card', 'data-slug': item.slug }, item.term),
      };
    }
    if (id === '../store') {
      return sharedStoreMod.exports;
    }
    throw new Error(`Unhandled require in SavedPage: ${id}`);
  }, mod.exports, mod);

  return {
    SavedPage: mod.exports.default,
    getLastNavigated: () => lastNavigated,
  };
}

// ─────────────────────────────────────────────────────────────
// CHALLENGER TEST SUITE: Milestone 5 Storage & Tab Behaviors
// ─────────────────────────────────────────────────────────────

test('Challenger M5_1: Storage Isolation, Zero Data Loss & Tab Behaviors Adversarial Verification', async (t) => {

  // ═══════════════════════════════════════════════════════════
  // SUITE 1: Category-Specific Clearing Invariant Stress
  // ═══════════════════════════════════════════════════════════

  await t.test('1.1: clearAIOutputs("tone-analysis") purges ONLY tone readings, leaving roleplay and playbook intact', () => {
    const harness = loadRealStore();
    let store = harness.getStore();

    // Populate 10 tone-analysis, 10 roleplay, 10 playbook items
    harness.act(() => {
      for (let i = 0; i < 10; i++) {
        store.saveAIOutput({
          type: 'tone-analysis',
          title: `Tone Reading #${i}`,
          content: `Tone analysis content #${i}`,
          metadata: { message: `Prompt #${i}` },
        });
        store.saveAIOutput({
          type: 'roleplay',
          title: `Practice Script #${i}`,
          content: `Dialogue content #${i}`,
          metadata: { termSlug: `term-${i}` },
        });
        store.saveAIOutput({
          type: 'playbook',
          title: `Playbook Note #${i}`,
          content: `Guidance content #${i}`,
          metadata: { tag: `Tag #${i}`, tier: 'watchful' },
        });
      }
      // Also save some terms and messages
      store.toggleTerm('skibidi');
      store.toggleTerm('rizz');
      store.saveMessage('Did you do your homework?');
    });

    store = harness.getStore();
    assert.strictEqual(store.savedAIOutputs.length, 30, 'Initial count must be 30 items');
    assert.strictEqual(store.savedTerms.length, 2);
    assert.strictEqual(store.savedMessages.length, 1);

    // Call clearAIOutputs('tone-analysis')
    harness.act(() => {
      store.clearAIOutputs('tone-analysis');
    });

    store = harness.getStore();

    // Check tone-analysis is completely cleared
    const remainingTone = store.savedAIOutputs.filter((i: any) => i.type === 'tone-analysis');
    assert.strictEqual(remainingTone.length, 0, 'Zero tone-analysis items should remain');

    // Check roleplay is 100% intact
    const remainingRoleplay = store.savedAIOutputs.filter((i: any) => i.type === 'roleplay');
    assert.strictEqual(remainingRoleplay.length, 10, 'All 10 roleplay items must remain intact');
    for (let i = 0; i < 10; i++) {
      assert.ok(
        remainingRoleplay.some((r: any) => r.title === `Practice Script #${i}` && r.content === `Dialogue content #${i}`),
        `Roleplay item #${i} must preserve title and content exactly`
      );
    }

    // Check playbook is 100% intact
    const remainingPlaybook = store.savedAIOutputs.filter((i: any) => i.type === 'playbook');
    assert.strictEqual(remainingPlaybook.length, 10, 'All 10 playbook items must remain intact');
    for (let i = 0; i < 10; i++) {
      assert.ok(
        remainingPlaybook.some((p: any) => p.title === `Playbook Note #${i}` && p.content === `Guidance content #${i}`),
        `Playbook item #${i} must preserve title and content exactly`
      );
    }

    // Check total AI outputs count is exactly 20
    assert.strictEqual(store.savedAIOutputs.length, 20);

    // Check localStorage persistence
    const rawStored = JSON.parse(harness.storage.getItem('parent-decoder-saved-ai-outputs')!);
    assert.strictEqual(rawStored.length, 20);
    assert.ok(rawStored.every((item: any) => item.type !== 'tone-analysis'));

    // Check savedTerms and savedMessages in localStorage are 100% untouched
    assert.deepStrictEqual(JSON.parse(harness.storage.getItem('parent-decoder-saved-terms')!), ['skibidi', 'rizz']);
    assert.strictEqual(JSON.parse(harness.storage.getItem('parent-decoder-saved-messages')!).length, 1);

    harness.unmount();
  });

  await t.test('1.2: clearAIOutputs("roleplay") purges ONLY roleplay items, leaving tone readings and playbook intact', () => {
    const harness = loadRealStore();
    let store = harness.getStore();

    harness.act(() => {
      for (let i = 0; i < 5; i++) {
        store.saveAIOutput({ type: 'tone-analysis', title: `Tone ${i}`, content: `C${i}` });
        store.saveAIOutput({ type: 'roleplay', title: `Roleplay ${i}`, content: `C${i}` });
        store.saveAIOutput({ type: 'playbook', title: `Playbook ${i}`, content: `C${i}` });
      }
    });

    store = harness.getStore();
    assert.strictEqual(store.savedAIOutputs.length, 15);

    harness.act(() => {
      store.clearAIOutputs('roleplay');
    });

    store = harness.getStore();
    assert.strictEqual(store.savedAIOutputs.length, 10);
    assert.strictEqual(store.savedAIOutputs.filter((i: any) => i.type === 'roleplay').length, 0);
    assert.strictEqual(store.savedAIOutputs.filter((i: any) => i.type === 'tone-analysis').length, 5);
    assert.strictEqual(store.savedAIOutputs.filter((i: any) => i.type === 'playbook').length, 5);

    harness.unmount();
  });

  await t.test('1.3: clearAIOutputs("playbook") purges ONLY playbook items, leaving tone readings and roleplay intact', () => {
    const harness = loadRealStore();
    let store = harness.getStore();

    harness.act(() => {
      for (let i = 0; i < 5; i++) {
        store.saveAIOutput({ type: 'tone-analysis', title: `Tone ${i}`, content: `C${i}` });
        store.saveAIOutput({ type: 'roleplay', title: `Roleplay ${i}`, content: `C${i}` });
        store.saveAIOutput({ type: 'playbook', title: `Playbook ${i}`, content: `C${i}` });
      }
    });

    store = harness.getStore();
    assert.strictEqual(store.savedAIOutputs.length, 15);

    harness.act(() => {
      store.clearAIOutputs('playbook');
    });

    store = harness.getStore();
    assert.strictEqual(store.savedAIOutputs.length, 10);
    assert.strictEqual(store.savedAIOutputs.filter((i: any) => i.type === 'playbook').length, 0);
    assert.strictEqual(store.savedAIOutputs.filter((i: any) => i.type === 'tone-analysis').length, 5);
    assert.strictEqual(store.savedAIOutputs.filter((i: any) => i.type === 'roleplay').length, 5);

    harness.unmount();
  });

  await t.test('1.4: clearAIOutputs() with no args purges ALL AI outputs, but never touches savedTerms or savedMessages', () => {
    const harness = loadRealStore();
    let store = harness.getStore();

    harness.act(() => {
      store.toggleTerm('cap');
      store.saveMessage('Are you cooked?');
      store.saveAIOutput({ type: 'tone-analysis', title: 'T1', content: 'C1' });
      store.saveAIOutput({ type: 'roleplay', title: 'R1', content: 'C1' });
      store.saveAIOutput({ type: 'playbook', title: 'P1', content: 'C1' });
    });

    store = harness.getStore();
    assert.strictEqual(store.savedAIOutputs.length, 3);
    assert.strictEqual(store.savedTerms.length, 1);
    assert.strictEqual(store.savedMessages.length, 1);

    harness.act(() => {
      store.clearAIOutputs();
    });

    store = harness.getStore();
    assert.strictEqual(store.savedAIOutputs.length, 0, 'All AI outputs must be cleared');
    assert.deepStrictEqual(store.savedTerms, ['cap'], 'savedTerms must remain intact');
    assert.strictEqual(store.savedMessages.length, 1, 'savedMessages must remain intact');
    assert.strictEqual(store.savedMessages[0].text, 'Are you cooked?');

    harness.unmount();
  });

  await t.test('1.5: Adversarial clear calls (unknown category, already empty category) are safe no-ops', () => {
    const harness = loadRealStore();
    let store = harness.getStore();

    harness.act(() => {
      store.saveAIOutput({ type: 'tone-analysis', title: 'T1', content: 'C1' });
      store.saveAIOutput({ type: 'playbook', title: 'P1', content: 'C1' });
    });

    store = harness.getStore();
    assert.strictEqual(store.savedAIOutputs.length, 2);

    // Call with unknown category
    harness.act(() => {
      (store.clearAIOutputs as any)('non-existent-category');
    });

    store = harness.getStore();
    assert.strictEqual(store.savedAIOutputs.length, 2, 'Unknown category clear must not delete valid items');

    // Call clear on category that has 0 items ('roleplay')
    harness.act(() => {
      store.clearAIOutputs('roleplay');
    });

    store = harness.getStore();
    assert.strictEqual(store.savedAIOutputs.length, 2, 'Clearing an already empty category must be a safe no-op');

    harness.unmount();
  });

  // ═══════════════════════════════════════════════════════════
  // SUITE 2: Zero Data Loss Cross-Category Invariant Stress
  // ═══════════════════════════════════════════════════════════

  await t.test('2.1: clearTerms() never purges messages or AI outputs in state or localStorage', () => {
    const harness = loadRealStore();
    let store = harness.getStore();

    harness.act(() => {
      for (let i = 0; i < 10; i++) {
        store.toggleTerm(`term-slug-${i}`);
        store.saveMessage(`Message #${i}`);
        store.saveAIOutput({ type: 'tone-analysis', title: `Tone #${i}`, content: `Content #${i}` });
      }
    });

    store = harness.getStore();
    assert.strictEqual(store.savedTerms.length, 10);
    assert.strictEqual(store.savedMessages.length, 10);
    assert.strictEqual(store.savedAIOutputs.length, 10);

    const initialMessages = [...store.savedMessages];
    const initialAIOutputs = [...store.savedAIOutputs];

    // Clear terms
    harness.act(() => {
      store.clearTerms();
    });

    store = harness.getStore();

    // 1. In React state
    assert.deepStrictEqual(store.savedTerms, [], 'savedTerms must be empty array');
    assert.deepStrictEqual(store.savedMessages, initialMessages, 'savedMessages must be 100% identical');
    assert.deepStrictEqual(store.savedAIOutputs, initialAIOutputs, 'savedAIOutputs must be 100% identical');

    // 2. In localStorage
    assert.deepStrictEqual(JSON.parse(harness.storage.getItem('parent-decoder-saved-terms')!), []);
    assert.deepStrictEqual(JSON.parse(harness.storage.getItem('parent-decoder-saved-messages')!), JSON.parse(JSON.stringify(initialMessages)));
    assert.deepStrictEqual(JSON.parse(harness.storage.getItem('parent-decoder-saved-ai-outputs')!), JSON.parse(JSON.stringify(initialAIOutputs)));

    harness.unmount();
  });

  await t.test('2.2: clearMessages() never purges terms or AI outputs in state or localStorage', () => {
    const harness = loadRealStore();
    let store = harness.getStore();

    harness.act(() => {
      for (let i = 0; i < 10; i++) {
        store.toggleTerm(`term-slug-${i}`);
        store.saveMessage(`Message #${i}`);
        store.saveAIOutput({ type: 'playbook', title: `Playbook #${i}`, content: `Content #${i}` });
      }
    });

    store = harness.getStore();
    assert.strictEqual(store.savedTerms.length, 10);
    assert.strictEqual(store.savedMessages.length, 10);
    assert.strictEqual(store.savedAIOutputs.length, 10);

    const initialTerms = [...store.savedTerms];
    const initialAIOutputs = [...store.savedAIOutputs];

    // Clear messages
    harness.act(() => {
      store.clearMessages();
    });

    store = harness.getStore();

    // 1. In React state
    assert.deepStrictEqual(store.savedMessages, [], 'savedMessages must be empty array');
    assert.deepStrictEqual(store.savedTerms, initialTerms, 'savedTerms must be 100% identical');
    assert.deepStrictEqual(store.savedAIOutputs, initialAIOutputs, 'savedAIOutputs must be 100% identical');

    // 2. In localStorage
    assert.deepStrictEqual(JSON.parse(harness.storage.getItem('parent-decoder-saved-messages')!), []);
    assert.deepStrictEqual(JSON.parse(harness.storage.getItem('parent-decoder-saved-terms')!), JSON.parse(JSON.stringify(initialTerms)));
    assert.deepStrictEqual(JSON.parse(harness.storage.getItem('parent-decoder-saved-ai-outputs')!), JSON.parse(JSON.stringify(initialAIOutputs)));

    harness.unmount();
  });

  await t.test('2.3: Interleaved Stress Harness (300 randomized cross-category mutations) maintains 100% storage isolation', () => {
    const harness = loadRealStore();
    let store = harness.getStore();

    const termsPool = ['cooked', 'rizz', 'gyatt', 'fanum-tax', 'delulu', 'skibidi', 'bussing', 'cap', 'bet', 'mewing'];
    const aiTypes = ['tone-analysis', 'roleplay', 'playbook'] as const;

    // Independent oracle tracking
    let expectedTerms: string[] = [];
    let expectedMessageTexts: string[] = [];
    let expectedAITitles: { type: string; title: string }[] = [];

    // Run 300 random interleaved operations
    for (let op = 0; op < 300; op++) {
      const actionType = op % 8;

      harness.act(() => {
        store = harness.getStore();
        if (actionType === 0) {
          // Toggle term
          const term = termsPool[op % termsPool.length];
          store.toggleTerm(term);
          if (expectedTerms.includes(term)) {
            expectedTerms = expectedTerms.filter((t) => t !== term);
          } else {
            expectedTerms.push(term);
          }
        } else if (actionType === 1) {
          // Save message
          const msgText = `Random message #${op}`;
          store.saveMessage(msgText);
          expectedMessageTexts = [msgText, ...expectedMessageTexts.filter((t) => t !== msgText)].slice(0, 20);
        } else if (actionType === 2) {
          // Remove message if any
          if (store.savedMessages.length > 0) {
            const victim = store.savedMessages[0];
            store.removeMessage(victim.id);
            expectedMessageTexts = expectedMessageTexts.filter((t) => t !== victim.text);
          }
        } else if (actionType === 3) {
          // Save AI output
          const type = aiTypes[op % aiTypes.length];
          const title = `AI Item #${op} [${type}]`;
          store.saveAIOutput({
            type,
            title,
            content: `Content for ${op}`,
            summary: `Summary ${op}`,
          });
          expectedAITitles = [
            { type, title },
            ...expectedAITitles.filter((i) => !(i.type === type && i.title.toLowerCase() === title.toLowerCase())),
          ].slice(0, 50);
        } else if (actionType === 4) {
          // Remove AI output if any
          if (store.savedAIOutputs.length > 0) {
            const victim = store.savedAIOutputs[store.savedAIOutputs.length - 1]; // oldest
            store.removeAIOutput(victim.id);
            expectedAITitles = expectedAITitles.filter((i) => !(i.type === victim.type && i.title === victim.title));
          }
        } else if (actionType === 5) {
          // Selective clear of one AI type occasionally
          if (op % 25 === 0) {
            const targetType = aiTypes[op % aiTypes.length];
            store.clearAIOutputs(targetType);
            expectedAITitles = expectedAITitles.filter((i) => i.type !== targetType);
          }
        } else if (actionType === 6) {
          // Clear terms occasionally
          if (op === 150) {
            store.clearTerms();
            expectedTerms = [];
          }
        } else if (actionType === 7) {
          // Clear messages occasionally
          if (op === 250) {
            store.clearMessages();
            expectedMessageTexts = [];
          }
        }
      });
    }

    store = harness.getStore();

    // Verify Invariant: In-memory vs Oracle
    assert.deepStrictEqual(store.savedTerms, expectedTerms, 'savedTerms must match expected oracle');
    assert.strictEqual(store.savedMessages.length, expectedMessageTexts.length, 'savedMessages count must match oracle');
    for (let i = 0; i < expectedMessageTexts.length; i++) {
      assert.strictEqual(store.savedMessages[i].text, expectedMessageTexts[i]);
    }
    assert.strictEqual(store.savedAIOutputs.length, expectedAITitles.length, 'savedAIOutputs count must match oracle');
    for (let i = 0; i < expectedAITitles.length; i++) {
      assert.strictEqual(store.savedAIOutputs[i].title, expectedAITitles[i].title);
      assert.strictEqual(store.savedAIOutputs[i].type, expectedAITitles[i].type);
    }

    // Verify Invariant: LocalStorage vs Oracle
    const storedTerms = JSON.parse(harness.storage.getItem('parent-decoder-saved-terms')!);
    const storedMessages = JSON.parse(harness.storage.getItem('parent-decoder-saved-messages')!);
    const storedAIOutputs = JSON.parse(harness.storage.getItem('parent-decoder-saved-ai-outputs')!);

    assert.deepStrictEqual(storedTerms, expectedTerms);
    assert.strictEqual(storedMessages.length, expectedMessageTexts.length);
    assert.strictEqual(storedAIOutputs.length, expectedAITitles.length);

    harness.unmount();
  });

  // ═══════════════════════════════════════════════════════════
  // SUITE 3: Empty State CTAs and Tab Behaviors Verification
  // ═══════════════════════════════════════════════════════════

  await t.test('3.1: SavedPage empty state CTAs match exact required deep links and text for all 5 categories', () => {
    const harness = loadRealStore();

    // 1. terms tab
    const { SavedPage: TermsPage } = loadSavedPageComponent('terms');
    const termsHtml = ReactDOMServer.renderToString(
      React.createElement(harness.AppProvider, null, React.createElement(TermsPage))
    );
    assert.ok(termsHtml.includes('href="/browse"'), 'Terms empty state must link to /browse');
    assert.ok(termsHtml.includes('Explore the library'), 'Terms CTA must be "Explore the library"');
    assert.ok(termsHtml.includes('Nothing saved here yet.'), 'Terms heading must be "Nothing saved here yet."');

    // 2. messages tab
    const { SavedPage: MessagesPage } = loadSavedPageComponent('messages');
    const messagesHtml = ReactDOMServer.renderToString(
      React.createElement(harness.AppProvider, null, React.createElement(MessagesPage))
    );
    assert.ok(messagesHtml.includes('href="/decoder"'), 'Messages empty state must link to /decoder');
    assert.ok(messagesHtml.includes('Open the decoder'), 'Messages CTA must be "Open the decoder"');
    assert.ok(messagesHtml.includes('No messages saved yet.'), 'Messages heading must be "No messages saved yet."');

    // 3. tone-analysis tab
    const { SavedPage: TonePage } = loadSavedPageComponent('tone-analysis');
    const toneHtml = ReactDOMServer.renderToString(
      React.createElement(harness.AppProvider, null, React.createElement(TonePage))
    );
    assert.ok(toneHtml.includes('href="/decoder"'), 'Tone-analysis empty state must link to /decoder');
    assert.ok(toneHtml.includes('Analyze a message'), 'Tone-analysis CTA must be "Analyze a message"');
    assert.ok(toneHtml.includes('No tone readings saved yet.'), 'Tone-analysis heading must be "No tone readings saved yet."');

    // 4. roleplay tab
    const { SavedPage: RoleplayPage } = loadSavedPageComponent('roleplay');
    const roleplayHtml = ReactDOMServer.renderToString(
      React.createElement(harness.AppProvider, null, React.createElement(RoleplayPage))
    );
    assert.ok(roleplayHtml.includes('href="/browse"'), 'Roleplay empty state must link to /browse');
    assert.ok(roleplayHtml.includes('Browse terms to practice'), 'Roleplay CTA must be "Browse terms to practice"');
    assert.ok(roleplayHtml.includes('No practice sessions saved yet.'), 'Roleplay heading must be "No practice sessions saved yet."');

    // 5. playbook tab
    const { SavedPage: PlaybookPage } = loadSavedPageComponent('playbook');
    const playbookHtml = ReactDOMServer.renderToString(
      React.createElement(harness.AppProvider, null, React.createElement(PlaybookPage))
    );
    assert.ok(playbookHtml.includes('href="/copilot"'), 'Playbook empty state must link to /copilot');
    assert.ok(
      playbookHtml.includes('Explore the Co-pilot &amp; Playbook') || playbookHtml.includes('Explore the Co-pilot'),
      'Playbook CTA must link to copilot'
    );
    assert.ok(playbookHtml.includes('No playbook notes saved yet.'), 'Playbook heading must be "No playbook notes saved yet."');

    // Tablist accessibility check
    assert.ok(termsHtml.includes('role="tablist"'), 'Must have role="tablist"');
    assert.ok(termsHtml.includes('aria-label="Saved items categories"'), 'Must have accessible tablist label');

    // All 5 tabs must be rendered in the header
    assert.ok(termsHtml.includes('id="tab-terms"'));
    assert.ok(termsHtml.includes('id="tab-messages"'));
    assert.ok(termsHtml.includes('id="tab-tone-analysis"'));
    assert.ok(termsHtml.includes('id="tab-roleplay"'));
    assert.ok(termsHtml.includes('id="tab-playbook"'));

    harness.unmount();
  });

  await t.test('3.2: SavedPage active tab switching renders correct contextual empty states and CTAs', () => {
    const harness = loadRealStore();

    // Verify all 5 tab definitions in SavedPage
    const requiredDestinations = {
      terms: '/browse',
      messages: '/decoder',
      'tone-analysis': '/decoder',
      roleplay: '/browse',
      playbook: '/copilot',
    };

    for (const [tabKey, expectedUrl] of Object.entries(requiredDestinations)) {
      const { SavedPage } = loadSavedPageComponent(tabKey);
      const html = ReactDOMServer.renderToString(
        React.createElement(harness.AppProvider, null, React.createElement(SavedPage))
      );
      assert.ok(
        html.includes(`href="${expectedUrl}"`),
        `Tab ${tabKey} empty state must link to ${expectedUrl}`
      );
    }

    harness.unmount();
  });

  await t.test('3.3: Tab counters reflect accurate counts across categories', () => {
    const { SavedPage } = loadSavedPageComponent();
    const harness = loadRealStore();
    let store = harness.getStore();

    harness.act(() => {
      store.toggleTerm('rizz');
      store.toggleTerm('skibidi');
      store.toggleTerm('gyatt'); // 3 terms
      store.saveMessage('Message 1');
      store.saveMessage('Message 2'); // 2 messages
      store.saveAIOutput({ type: 'tone-analysis', title: 'T1', content: 'C1' }); // 1 tone
      store.saveAIOutput({ type: 'roleplay', title: 'R1', content: 'C1' });
      store.saveAIOutput({ type: 'roleplay', title: 'R2', content: 'C2' }); // 2 roleplay
      store.saveAIOutput({ type: 'playbook', title: 'P1', content: 'C1' });
      store.saveAIOutput({ type: 'playbook', title: 'P2', content: 'C2' });
      store.saveAIOutput({ type: 'playbook', title: 'P3', content: 'C3' });
      store.saveAIOutput({ type: 'playbook', title: 'P4', content: 'C4' }); // 4 playbook
    });

    const html = ReactDOMServer.renderToString(
      React.createElement(harness.AppProvider, null, React.createElement(SavedPage))
    );

    // Terms count is 3
    assert.ok(html.includes('id="tab-terms"'), 'Terms tab button present');
    assert.ok(html.includes('<span>3</span>'), 'Terms counter must be 3');
    // Messages count is 2
    assert.ok(html.includes('id="tab-messages"'), 'Messages tab button present');
    assert.ok(html.includes('<span>2</span>'), 'Messages counter must be 2');
    // Tone count is 1
    assert.ok(html.includes('id="tab-tone-analysis"'), 'Tone tab button present');
    assert.ok(html.includes('<span>1</span>'), 'Tone counter must be 1');
    // Playbook count is 4
    assert.ok(html.includes('id="tab-playbook"'), 'Playbook tab button present');
    assert.ok(html.includes('<span>4</span>'), 'Playbook counter must be 4');

    harness.unmount();
  });

  // ═══════════════════════════════════════════════════════════
  // SUITE 4: Storage Limits, MRU Eviction & Corrupt Metadata
  // ═══════════════════════════════════════════════════════════

  await t.test('4.1: Capacity limits: 0 items, 1 item, 50 items (max cap), and MRU eviction beyond 50', () => {
    const harness = loadRealStore();
    let store = harness.getStore();

    // 0 items
    assert.strictEqual(store.savedAIOutputs.length, 0);

    // 1 item
    harness.act(() => {
      store.saveAIOutput({ type: 'tone-analysis', title: 'Single Item', content: 'Solo content' });
    });
    store = harness.getStore();
    assert.strictEqual(store.savedAIOutputs.length, 1);
    assert.strictEqual(store.savedAIOutputs[0].title, 'Single Item');

    // Fill to exactly 50 items
    harness.act(() => {
      for (let i = 2; i <= 50; i++) {
        store.saveAIOutput({
          type: 'roleplay',
          title: `Item #${i}`,
          content: `Content #${i}`,
        });
      }
    });
    store = harness.getStore();
    assert.strictEqual(store.savedAIOutputs.length, 50, 'Store must hold exactly 50 items at cap');
    assert.strictEqual(store.savedAIOutputs[0].title, 'Item #50', 'Newest item at index 0');
    assert.strictEqual(store.savedAIOutputs[49].title, 'Single Item', 'Oldest item at index 49');

    // Add 51st item -> oldest ("Single Item") must be evicted
    harness.act(() => {
      store.saveAIOutput({
        type: 'playbook',
        title: 'Item #51 (Causes Eviction)',
        content: 'Content #51',
      });
    });
    store = harness.getStore();
    assert.strictEqual(store.savedAIOutputs.length, 50, 'Store must remain capped at exactly 50 items');
    assert.strictEqual(store.savedAIOutputs[0].title, 'Item #51 (Causes Eviction)', '51st item prepended');
    assert.strictEqual(store.savedAIOutputs[49].title, 'Item #2', 'Oldest item is now Item #2');
    assert.strictEqual(
      store.isAIOutputSaved('Single Item', 'tone-analysis'),
      false,
      'Oldest item must be evicted'
    );

    // Add 50 more items (Items 52..101)
    harness.act(() => {
      for (let i = 52; i <= 101; i++) {
        store.saveAIOutput({
          type: 'playbook',
          title: `Item #${i}`,
          content: `Content #${i}`,
        });
      }
    });
    store = harness.getStore();
    assert.strictEqual(store.savedAIOutputs.length, 50, 'Must still be capped at 50');
    assert.strictEqual(store.savedAIOutputs[0].title, 'Item #101');
    assert.strictEqual(store.savedAIOutputs[49].title, 'Item #52');

    harness.unmount();
  });

  await t.test('4.2: MRU promotion: re-saving an existing item moves it to front without evicting unrelated items', () => {
    const harness = loadRealStore();
    let store = harness.getStore();

    // Populate 50 items
    harness.act(() => {
      for (let i = 1; i <= 50; i++) {
        store.saveAIOutput({
          type: 'playbook',
          title: `Scenario ${i}`,
          content: `Initial content ${i}`,
        });
      }
    });

    store = harness.getStore();
    assert.strictEqual(store.savedAIOutputs.length, 50);
    // Scenario 1 is at index 49 (oldest)
    assert.strictEqual(store.savedAIOutputs[49].title, 'Scenario 1');

    // Re-save Scenario 1 with updated content
    harness.act(() => {
      store.saveAIOutput({
        type: 'playbook',
        title: 'Scenario 1',
        content: 'Promoted content for scenario 1',
      });
    });

    store = harness.getStore();
    assert.strictEqual(store.savedAIOutputs.length, 50, 'Count must remain 50 (no duplicate created)');
    assert.strictEqual(store.savedAIOutputs[0].title, 'Scenario 1', 'Scenario 1 is now at index 0');
    assert.strictEqual(store.savedAIOutputs[0].content, 'Promoted content for scenario 1');
    // The previous oldest before re-save was Scenario 2, which is now at index 49
    assert.strictEqual(store.savedAIOutputs[49].title, 'Scenario 2');

    // Scenario 50 (previously index 0) is now at index 1
    assert.strictEqual(store.savedAIOutputs[1].title, 'Scenario 50');

    harness.unmount();
  });

  await t.test('4.3: Corrupt and missing metadata handling in SavedPage rendering', () => {
    const { SavedPage } = loadSavedPageComponent();
    const harness = loadRealStore();
    let store = harness.getStore();

    // Inject items with diverse adversarial metadata variations
    harness.act(() => {
      // 1. Tone analysis with missing metadata (undefined)
      store.saveAIOutput({
        type: 'tone-analysis',
        title: 'Tone Reading: No Metadata',
        content: 'Tone analysis result without metadata',
      });

      // 2. Tone analysis with empty metadata object
      store.saveAIOutput({
        type: 'tone-analysis',
        title: 'Tone Reading: Empty Metadata',
        content: 'Tone analysis with empty metadata',
        metadata: {},
      });

      // 3. Tone analysis with legacy originalMessage metadata only
      store.saveAIOutput({
        type: 'tone-analysis',
        title: 'Tone Reading: Legacy OriginalMessage',
        content: 'Tone reading with legacy metadata',
        metadata: { originalMessage: 'Did you finish your chores?' },
      });

      // 4. Roleplay session with missing metadata
      store.saveAIOutput({
        type: 'roleplay',
        title: 'Practice: No Metadata',
        content: 'Parent: Hello\nTeen: Hey',
      });

      // 5. Roleplay session with termSlug but no termName
      store.saveAIOutput({
        type: 'roleplay',
        title: 'Practice: Slug Only',
        content: 'Script content',
        metadata: { termSlug: 'rizz' },
      });

      // 6. Playbook note with missing metadata
      store.saveAIOutput({
        type: 'playbook',
        title: 'Playbook: No Metadata',
        content: 'Playbook notes',
      });

      // 7. Playbook note with missing tier and missing total
      store.saveAIOutput({
        type: 'playbook',
        title: 'Playbook: Partial Metadata',
        content: 'Playbook evaluation',
        metadata: { tag: 'Banter vs Teasing', score: '3' },
      });

      // 8. Playbook note with complete metadata and unusual tier
      store.saveAIOutput({
        type: 'playbook',
        title: 'Playbook: Complete Metadata',
        content: 'Evaluation note',
        metadata: {
          tag: 'Social Media',
          tier: 'intervention',
          badgeLabel: 'Intervention Required',
          score: '5',
          total: '5',
        },
      });
    });

    store = harness.getStore();
    assert.strictEqual(store.savedAIOutputs.length, 8);

    // Verify SavedPage renders all 8 items across tabs without any unhandled exceptions
    assert.doesNotThrow(() => {
      const html = ReactDOMServer.renderToString(
        React.createElement(harness.AppProvider, null, React.createElement(SavedPage))
      );
      assert.ok(html.length > 0);
    }, 'SavedPage must render corrupted/missing metadata without throwing exceptions');

    harness.unmount();
  });

  await t.test('4.4: Corrupt localStorage keys recovery on initialization', () => {
    // Inject corrupt JSON into all localStorage keys
    const corruptStorage: Record<string, string> = {
      'parent-decoder-saved-terms': 'INVALID_JSON_TERMS{[[',
      'parent-decoder-saved-messages': '{"notAnArray": 123}',
      'parent-decoder-saved-ai-outputs': 'null',
    };

    const harness = loadRealStore(corruptStorage);
    const store = harness.getStore();

    // Verify all 3 collections safely default to empty arrays
    assert.deepStrictEqual(store.savedTerms, [], 'Corrupt terms must default to empty array');
    assert.deepStrictEqual(store.savedMessages, [], 'Non-array messages must default to empty array');
    assert.deepStrictEqual(store.savedAIOutputs, [], 'Null AI outputs must default to empty array');

    // New saves work normally without crashing
    harness.act(() => {
      store.toggleTerm('skibidi');
      store.saveMessage('Fresh message');
      store.saveAIOutput({ type: 'tone-analysis', title: 'Fresh Tone', content: 'Fresh content' });
    });

    const updatedStore = harness.getStore();
    assert.strictEqual(updatedStore.savedTerms.length, 1);
    assert.strictEqual(updatedStore.savedMessages.length, 1);
    assert.strictEqual(updatedStore.savedAIOutputs.length, 1);

    harness.unmount();
  });

  await t.test('4.5: Storage QuotaExceededError is caught gracefully without breaking UI state', () => {
    const harness = loadRealStore();
    const store = harness.getStore();

    // Simulate quota exceeded
    harness.storage.throwOnSet = true;

    // saveAIOutput should catch storage error in useStored useEffect without crashing
    assert.doesNotThrow(() => {
      harness.act(() => {
        store.saveAIOutput({
          type: 'playbook',
          title: 'Quota Exceeded Test',
          content: 'Test content',
        });
      });
    });

    const currentStore = harness.getStore();
    // In-memory React state is still updated
    assert.strictEqual(currentStore.savedAIOutputs.length, 1);
    assert.strictEqual(currentStore.savedAIOutputs[0].title, 'Quota Exceeded Test');

    harness.unmount();
  });

  // ═══════════════════════════════════════════════════════════
  // SUITE 5: Cross-Cutting M5 Integration Verification
  // ═══════════════════════════════════════════════════════════

  await t.test('5.1: ToneAnalysis save title formatting and metadata contract adherence', () => {
    // Test the exact title computation logic used in ToneAnalysis.tsx:
    // const trimmedMessage = message.trim()
    // const title = 'Tone: ' + trimmedMessage.slice(0, 30) + (trimmedMessage.length > 30 ? '…' : '')
    function computeToneTitle(message: string): string {
      const trimmedMessage = message.trim();
      return 'Tone: ' + trimmedMessage.slice(0, 30) + (trimmedMessage.length > 30 ? '…' : '');
    }

    // Short message (<30 chars)
    const shortTitle = computeToneTitle('Are you cooked?');
    assert.strictEqual(shortTitle, 'Tone: Are you cooked?');

    // Exactly 30 chars
    const exact30 = '123456789012345678901234567890';
    const exactTitle = computeToneTitle(exact30);
    assert.strictEqual(exactTitle, 'Tone: 123456789012345678901234567890');

    // Long message (>30 chars)
    const longMsg = 'My teen told me I have zero rizz and need to touch grass immediately';
    const longTitle = computeToneTitle(longMsg);
    assert.strictEqual(longTitle, 'Tone: My teen told me I have zero ri…');
    assert.strictEqual(longTitle.length, 37); // 'Tone: ' (6) + 30 chars + '…' (1)

    // Verify metadata structure
    const harness = loadRealStore();
    let store = harness.getStore();

    harness.act(() => {
      store.saveAIOutput({
        type: 'tone-analysis',
        title: longTitle,
        content: 'The message is playful teasing.',
        summary: `Tone reading for: “${longMsg.trim().slice(0, 70)}…”`,
        metadata: {
          message: longMsg.trim(),
          originalMessage: longMsg,
        },
      });
    });

    store = harness.getStore();
    const saved = store.savedAIOutputs[0];
    assert.strictEqual(saved.title, longTitle);
    assert.strictEqual(saved.metadata?.message, longMsg.trim());
    assert.strictEqual(saved.metadata?.originalMessage, longMsg);
    assert.strictEqual(store.isAIOutputSaved(longTitle, 'tone-analysis'), true);

    harness.unmount();
  });

  await t.test('5.2: Header navigation badge counter aggregates across all 5 saved categories', () => {
    // Formula from AppShell.tsx:
    // const totalSaved = savedTerms.length + savedMessages.length + savedAIOutputs.length
    const harness = loadRealStore();
    let store = harness.getStore();

    function calcTotal(s: any): number {
      return s.savedTerms.length + s.savedMessages.length + s.savedAIOutputs.length;
    }

    // Initial total is 0
    assert.strictEqual(calcTotal(store), 0);

    // Add 3 terms
    harness.act(() => {
      store.toggleTerm('rizz');
      store.toggleTerm('gyatt');
      store.toggleTerm('cap');
    });
    store = harness.getStore();
    assert.strictEqual(calcTotal(store), 3);

    // Add 2 messages
    harness.act(() => {
      store.saveMessage('Msg 1');
      store.saveMessage('Msg 2');
    });
    store = harness.getStore();
    assert.strictEqual(calcTotal(store), 5);

    // Add 4 AI outputs across mixed types
    harness.act(() => {
      store.saveAIOutput({ type: 'tone-analysis', title: 'T1', content: 'C1' });
      store.saveAIOutput({ type: 'roleplay', title: 'R1', content: 'C1' });
      store.saveAIOutput({ type: 'playbook', title: 'P1', content: 'C1' });
      store.saveAIOutput({ type: 'playbook', title: 'P2', content: 'C2' });
    });
    store = harness.getStore();
    assert.strictEqual(calcTotal(store), 9, '3 terms + 2 messages + 4 AI outputs = 9');

    // Remove 1 AI output
    harness.act(() => {
      store.removeAIOutput(store.savedAIOutputs[0].id);
    });
    store = harness.getStore();
    assert.strictEqual(calcTotal(store), 8);

    // Clear tone-analysis (1 item)
    harness.act(() => {
      store.clearAIOutputs('tone-analysis');
    });
    store = harness.getStore();
    assert.strictEqual(calcTotal(store), 7);

    // Clear all terms
    harness.act(() => {
      store.clearTerms();
    });
    store = harness.getStore();
    assert.strictEqual(calcTotal(store), 4); // 2 messages + 2 AI outputs

    // Clear all messages
    harness.act(() => {
      store.clearMessages();
    });
    store = harness.getStore();
    assert.strictEqual(calcTotal(store), 2); // 2 AI outputs

    // Clear all AI outputs
    harness.act(() => {
      store.clearAIOutputs();
    });
    store = harness.getStore();
    assert.strictEqual(calcTotal(store), 0);

    harness.unmount();
  });

});
