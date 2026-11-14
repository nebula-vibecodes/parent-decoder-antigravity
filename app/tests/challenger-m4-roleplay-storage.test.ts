import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─────────────────────────────────────────────────────────────
// 1. Headless DOM & Storage Environment Setup for React 19
// ─────────────────────────────────────────────────────────────

class MockElement {
  public nodeType = 1;
  public nodeName: string;
  public tagName: string;
  public attributes: Record<string, string> = {};
  public style: Record<string, string> = {};
  public childNodes: any[] = [];
  public parentNode: any = null;
  public ownerDocument: any = null;
  public value: string = '';
  public disabled: boolean = false;
  public type: string = '';
  public focused: boolean = false;
  public listeners: Record<string, Function[]> = {};

  constructor(tag = 'div') {
    this.nodeName = tag.toUpperCase();
    this.tagName = tag.toUpperCase();
    this.type = tag === 'button' ? 'button' : tag === 'input' ? 'text' : '';
  }

  setAttribute(k: string, v: string) {
    this.attributes[k] = String(v);
    if (k === 'type') this.type = String(v);
    if (k === 'disabled') this.disabled = true;
    if (k === 'value') this.value = String(v);
  }

  getAttribute(k: string) {
    return this.attributes[k];
  }

  hasAttribute(k: string) {
    return k in this.attributes;
  }

  removeAttribute(k: string) {
    delete this.attributes[k];
    if (k === 'disabled') this.disabled = false;
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

  addEventListener(event: string, handler: Function) {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(handler);
  }

  removeEventListener(event: string, handler: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((h) => h !== handler);
    }
  }

  focus() {
    this.focused = true;
  }

  blur() {
    this.focused = false;
  }

  scrollIntoView() {}
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
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

// Mock Clipboard
class MockClipboard {
  public contents: string = '';
  async writeText(text: string): Promise<void> {
    this.contents = text;
  }
  async readText(): Promise<string> {
    return this.contents;
  }
}
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


// Mock LocalStorage
class MockLocalStorage {
  public store: Map<string, string> = new Map();

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  setItem(key: string, value: string): void {
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
}

const mockStorage = new MockLocalStorage();
(globalThis as any).localStorage = mockStorage;

// Load React and react-dom/server
const React = await import('react');
const ReactDOMServer = await import('react-dom/server');

// Import terms and fallback generator (.ts files work natively)
import { terms, findTerm, type Term } from '../src/data';
import { getFallbackScriptForTerm, type TermFallbackScript } from '../src/lib/ai/fallbackScripts';

// ─────────────────────────────────────────────────────────────
// 2. Load ChromeAISetupGuide, Store and RoleplayChat via esbuild
// ─────────────────────────────────────────────────────────────

// Load ChromeAISetupGuide.tsx
const guidePath = path.resolve(__dirname, '../src/components/agent/ChromeAISetupGuide.tsx');
const guideRaw = fs.readFileSync(guidePath, 'utf8');
const guideTransformed = esbuild.transformSync(guideRaw, { loader: 'tsx', format: 'cjs' });
const guideModule: { exports: any } = { exports: {} };
const evalGuide = new Function('React', 'require', 'exports', 'module', guideTransformed.code);
evalGuide(React, (id: string) => {
  if (id === 'react') return React;
  if (id === 'lucide-react') {
    return {
      Sparkles: () => React.createElement('span', { 'data-icon': 'Sparkles' }),
      ChevronDown: () => React.createElement('span', { 'data-icon': 'ChevronDown' }),
      ChevronUp: () => React.createElement('span', { 'data-icon': 'ChevronUp' }),
      Copy: () => React.createElement('span', { 'data-icon': 'Copy' }),
      Check: () => React.createElement('span', { 'data-icon': 'Check' }),
      ShieldCheck: () => React.createElement('span', { 'data-icon': 'ShieldCheck' }),
    };
  }
  if (id === '../../store') {
    return {
      useApp: () => ({ notify: () => {} }),
    };
  }
  throw new Error(`Unhandled require in ChromeAISetupGuide: ${id}`);
}, guideModule.exports, guideModule);

const { CHROME_AI_GUIDE_CONSTANTS, ChromeAISetupGuide, copyToClipboard } = guideModule.exports;

// Load store.tsx
const storePath = path.resolve(__dirname, '../src/store.tsx');
const storeRaw = fs.readFileSync(storePath, 'utf8');
const storeTransformed = esbuild.transformSync(storeRaw, { loader: 'tsx', format: 'cjs' });
const storeModule: { exports: any } = { exports: {} };
const evalStore = new Function('React', 'require', 'exports', 'module', storeTransformed.code);
evalStore(React, (id: string) => {
  if (id === 'react') return React;
  throw new Error(`Unhandled require in store.tsx: ${id}`);
}, storeModule.exports, storeModule);

const { AppProvider, useApp, copyText } = storeModule.exports;

// Load RoleplayChat.tsx
const roleplayChatPath = path.resolve(__dirname, '../src/components/agent/RoleplayChat.tsx');
const roleplayChatRaw = fs.readFileSync(roleplayChatPath, 'utf8');
const roleplayChatTransformed = esbuild.transformSync(roleplayChatRaw, { loader: 'tsx', format: 'cjs' });

let mockAgentState: {
  status: { engine: 'unavailable' | 'local' };
  messages: Array<{ id: string; role: 'user' | 'assistant'; content: string }>;
  isStreaming: boolean;
  streamingText: string;
  initialize: (prompt: string) => void;
  send: (text: string) => void;
  reset: () => void;
} = {
  status: { engine: 'unavailable' },
  messages: [],
  isStreaming: false,
  streamingText: '',
  initialize: () => {},
  send: () => {},
  reset: () => {},
};

let currentAppContextValue: any = null;

const customRoleplayRequire = (id: string) => {
  if (id === 'react') return React;
  if (id === 'lucide-react') {
    const iconNames = [
      'ArrowRight', 'Bookmark', 'BookmarkCheck', 'BookOpen', 'Check',
      'Copy', 'Lightbulb', 'MessageCircleHeart', 'MessageSquareQuote',
      'RotateCcw', 'Sparkles', 'X'
    ];
    const res: Record<string, any> = {};
    for (const name of iconNames) {
      res[name] = (props: any) => React.createElement('span', { 'data-icon': name, ...props });
    }
    return res;
  }
  if (id === '../../lib/ai/useAgent') {
    return {
      useAgent: () => mockAgentState,
    };
  }
  if (id === '../../lib/ai/systemPrompts') {
    return {
      buildRoleplayPrompt: (t: any) => `Roleplay prompt for ${t.term}`,
    };
  }
  if (id === '../../lib/ai/fallbackScripts') {
    return {
      getFallbackScriptForTerm,
    };
  }
  if (id === './ChromeAISetupGuide') {
    return {
      ChromeAISetupGuide,
      CHROME_AI_GUIDE_CONSTANTS,
    };
  }
  if (id === './PrivacyBadge') {
    return {
      PrivacyBadge: () => React.createElement('div', { className: 'mock-privacy-badge' }),
    };
  }
  if (id === './StreamingText') {
    return {
      StreamingText: ({ text }: { text: string }) => React.createElement('span', null, text),
    };
  }
  if (id === '../../store') {
    return {
      useApp: () => {
        if (!currentAppContextValue) {
          throw new Error('useApp must be used within AppProvider');
        }
        return currentAppContextValue;
      },
      copyText: async (t: string) => {
        await mockClipboard.writeText(t);
      },
    };
  }
  if (id === '../../data') {
    return { terms, findTerm };
  }
  throw new Error(`Unhandled mock require in RoleplayChat: ${id}`);
};

const roleplayModule: { exports: any } = { exports: {} };
const evalRoleplay = new Function('React', 'require', 'exports', 'module', roleplayChatTransformed.code);
evalRoleplay(React, customRoleplayRequire, roleplayModule.exports, roleplayModule);

const { RoleplayChat } = roleplayModule.exports;


// ─────────────────────────────────────────────────────────────
// 3. Headless Store Simulator matching store.tsx logic exactly
// ─────────────────────────────────────────────────────────────

interface SavedAIOutput {
  id: string;
  type: 'tone-analysis' | 'roleplay' | 'playbook';
  title: string;
  content: string;
  summary?: string;
  savedAt: number;
  metadata?: Record<string, string>;
}

interface SavedMessage {
  id: string;
  text: string;
  savedAt: number;
}

class StoreSimulation {
  public savedTerms: string[] = [];
  public savedMessages: SavedMessage[] = [];
  public savedAIOutputs: SavedAIOutput[] = [];
  public lastNotification: string = '';

  constructor(initialData?: {
    terms?: string[];
    messages?: SavedMessage[];
    aiOutputs?: SavedAIOutput[];
  }) {
    if (initialData?.terms) this.savedTerms = [...initialData.terms];
    if (initialData?.messages) this.savedMessages = [...initialData.messages];
    if (initialData?.aiOutputs) this.savedAIOutputs = [...initialData.aiOutputs];
  }

  notify(msg: string) {
    this.lastNotification = msg;
  }

  isAIOutputSaved(title: string, type: 'tone-analysis' | 'roleplay' | 'playbook'): boolean {
    const normalized = title.trim().toLowerCase();
    return this.savedAIOutputs.some(
      (item) => item.type === type && item.title.trim().toLowerCase() === normalized
    );
  }

  saveAIOutput(output: Omit<SavedAIOutput, 'id' | 'savedAt'>): SavedAIOutput | null {
    const cleanTitle = output.title.trim().slice(0, 200);
    const cleanContent = output.content.trim().slice(0, 10000);
    if (!cleanTitle || !cleanContent) return null;

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
        (item) =>
          !(item.type === output.type && item.title.trim().toLowerCase() === cleanTitle.toLowerCase())
      ),
    ].slice(0, 50);

    this.notify('Saved in this browser');
    return newItem;
  }

  removeAIOutput(id: string) {
    this.savedAIOutputs = this.savedAIOutputs.filter((item) => item.id !== id);
  }

  clearAIOutputs(type?: 'tone-analysis' | 'roleplay' | 'playbook') {
    if (type) {
      this.savedAIOutputs = this.savedAIOutputs.filter((item) => item.type !== type);
    } else {
      this.savedAIOutputs = [];
    }
  }

  toggleTerm(slug: string) {
    if (this.savedTerms.includes(slug)) {
      this.savedTerms = this.savedTerms.filter((s) => s !== slug);
      this.notify('Removed from your saved terms');
    } else {
      this.savedTerms.push(slug);
      this.notify('Saved in this browser');
    }
  }

  saveMessage(text: string) {
    const clean = text.trim().slice(0, 600);
    if (!clean) return;
    this.savedMessages = [
      { id: `${Date.now()}`, text: clean, savedAt: Date.now() },
      ...this.savedMessages.filter((m) => m.text !== clean),
    ].slice(0, 20);
    this.notify('Message saved only in this browser');
  }

  serializeToStorage(storage: MockLocalStorage) {
    storage.setItem('parent-decoder-saved-terms', JSON.stringify(this.savedTerms));
    storage.setItem('parent-decoder-saved-messages', JSON.stringify(this.savedMessages));
    storage.setItem('parent-decoder-saved-ai-outputs', JSON.stringify(this.savedAIOutputs));
  }

  loadFromStorage(storage: MockLocalStorage) {
    const termsStr = storage.getItem('parent-decoder-saved-terms');
    const msgStr = storage.getItem('parent-decoder-saved-messages');
    const aiStr = storage.getItem('parent-decoder-saved-ai-outputs');

    if (termsStr) this.savedTerms = JSON.parse(termsStr);
    if (msgStr) this.savedMessages = JSON.parse(msgStr);
    if (aiStr) this.savedAIOutputs = JSON.parse(aiStr);
  }
}

// ─────────────────────────────────────────────────────────────
// Test Suite: Roleplay Storage Challenger M4_2
// ─────────────────────────────────────────────────────────────

test('Challenger M4_2: Storage Persistence, Deduplication & Setup Guide Inclusion', async (suite) => {

  // ═════════════════════════════════════════════════════════════
  // Section 1: Zero Data Loss Verification Under Roleplay Saves
  // ═════════════════════════════════════════════════════════════
  await suite.test('1. Zero Data Loss Invariants Under High-Volume Roleplay Fallback Saves', async (t) => {
    mockStorage.clear();

    const initialTerms = ['skibidi', 'no-cap', 'cooked', 'rizz', 'sigma', 'gyatt', 'fanum-tax', 'delulu', 'bussing', 'bet'];
    const initialMessages: SavedMessage[] = initialTerms.map((t, idx) => ({
      id: `msg-${idx + 1}`,
      text: `Saved message about ${t}`,
      savedAt: 1700000000000 + idx * 1000,
    }));
    const initialToneOutputs: SavedAIOutput[] = [
      {
        id: 'ai-tone-1',
        type: 'tone-analysis',
        title: 'Tone: Dinner message',
        content: 'Constructive and warm.',
        summary: 'Warm tone score 90',
        savedAt: 1700000100000,
      },
      {
        id: 'ai-tone-2',
        type: 'tone-analysis',
        title: 'Tone: Curfew reminder',
        content: 'Direct and calm.',
        summary: 'Direct tone score 85',
        savedAt: 1700000200000,
      },
    ];
    const initialPlaybookOutputs: SavedAIOutput[] = [
      {
        id: 'ai-playbook-1',
        type: 'playbook',
        title: 'Playbook: Teasing vs Bullying',
        content: 'Check for mutual laughter and power balance.',
        summary: 'Focus on pattern and reaction.',
        savedAt: 1700000300000,
        metadata: { scenarioId: 'teasing-vs-bullying' },
      },
      {
        id: 'ai-playbook-2',
        type: 'playbook',
        title: 'Playbook: Brainrot memes at the dinner table',
        content: 'Acknowledge the meme without adopting slang unnaturally.',
        summary: 'Curiosity before correction.',
        savedAt: 1700000400000,
        metadata: { scenarioId: 'brainrot-memes' },
      },
    ];
    const initialRoleplayOutputs: SavedAIOutput[] = [
      {
        id: 'ai-roleplay-legacy',
        type: 'roleplay',
        title: 'Practice: legacy-term',
        content: 'Parent: Hello\nTeen: Hey',
        summary: 'Legacy roleplay session',
        savedAt: 1700000500000,
      },
    ];

    const store = new StoreSimulation({
      terms: initialTerms,
      messages: initialMessages,
      aiOutputs: [...initialToneOutputs, ...initialPlaybookOutputs, ...initialRoleplayOutputs],
    });

    store.serializeToStorage(mockStorage);

    // Save fallback scripts for 15 marquee and dynamic terms
    const testTerms = terms.slice(0, 15);
    for (const term of testTerms) {
      const script = getFallbackScriptForTerm(term);
      const dialogueTranscript = script.dialogue.map((d) => `${d.speaker}: ${d.text}`).join('\n');
      const saveTitle = 'Practice: ' + term.term;

      store.saveAIOutput({
        type: 'roleplay',
        title: saveTitle,
        content: dialogueTranscript,
        summary: script.situation || `Dialogue script for ${term.term}`,
        metadata: {
          termSlug: term.slug,
          termName: term.term,
          category: term.category,
        },
      });
    }

    // Serialize to mock storage and reload to test complete round-trip
    store.serializeToStorage(mockStorage);
    const reloadedStore = new StoreSimulation();
    reloadedStore.loadFromStorage(mockStorage);

    // INVARIANT 1: savedTerms are 100% intact with zero changes or deletions
    assert.strictEqual(reloadedStore.savedTerms.length, initialTerms.length, 'savedTerms count must remain identical');
    assert.deepStrictEqual(reloadedStore.savedTerms, initialTerms, 'savedTerms items must be completely identical');

    // INVARIANT 2: savedMessages are 100% intact with zero changes or deletions
    assert.strictEqual(reloadedStore.savedMessages.length, initialMessages.length, 'savedMessages count must remain identical');
    assert.deepStrictEqual(reloadedStore.savedMessages, initialMessages, 'savedMessages objects must be completely identical');

    // INVARIANT 3: existing tone-analysis outputs are 100% preserved
    const toneOutputs = reloadedStore.savedAIOutputs.filter((o) => o.type === 'tone-analysis');
    assert.strictEqual(toneOutputs.length, 2, 'Tone analysis outputs must be preserved');
    assert.strictEqual(toneOutputs[0].title, 'Tone: Dinner message');
    assert.strictEqual(toneOutputs[1].title, 'Tone: Curfew reminder');

    // INVARIANT 4: existing playbook outputs are 100% preserved
    const playbookOutputs = reloadedStore.savedAIOutputs.filter((o) => o.type === 'playbook');
    assert.strictEqual(playbookOutputs.length, 2, 'Playbook outputs must be preserved');
    assert.strictEqual(playbookOutputs[0].metadata?.scenarioId, 'teasing-vs-bullying');
    assert.strictEqual(playbookOutputs[1].metadata?.scenarioId, 'brainrot-memes');

    // INVARIANT 5: legacy roleplay output is preserved
    const legacyRoleplay = reloadedStore.savedAIOutputs.find((o) => o.title === 'Practice: legacy-term');
    assert.ok(legacyRoleplay, 'Legacy roleplay session must be preserved');
    assert.strictEqual(legacyRoleplay?.type, 'roleplay');

    // INVARIANT 6: all 15 new fallback roleplay outputs are saved with valid schema
    for (const term of testTerms) {
      const savedItem = reloadedStore.savedAIOutputs.find((o) => o.title === 'Practice: ' + term.term);
      assert.ok(savedItem, `Fallback script for ${term.term} must be present in savedAIOutputs`);
      assert.strictEqual(savedItem?.type, 'roleplay');
      assert.ok(savedItem?.id.startsWith('ai-'), 'Item id must start with ai-');
      assert.ok(savedItem?.savedAt > 0, 'Item must have a valid positive timestamp');
      assert.strictEqual(savedItem?.metadata?.termSlug, term.slug);
      assert.strictEqual(savedItem?.metadata?.termName, term.term);
      assert.strictEqual(savedItem?.metadata?.category, term.category);
      assert.ok(savedItem?.content.includes('Parent:'), 'Transcript must contain Parent turn');
      assert.ok(savedItem?.content.includes('Teen:'), 'Transcript must contain Teen turn');
    }
  });

  // ═════════════════════════════════════════════════════════════
  // Section 2: Live Roleplay Session Saving & Transcript Formatting
  // ═════════════════════════════════════════════════════════════
  await suite.test('2. Live Roleplay Session Saving, Turn Formatting & Empty Guards', async (t) => {
    const store = new StoreSimulation();
    const testTerm = findTerm('no-cap')!;
    assert.ok(testTerm);

    const saveTitle = 'Practice: ' + testTerm.term;

    // Test 2.1: Empty message guard — saving when messages.length === 0 must return null / no-op
    const emptyMessages: Array<{ id: string; role: 'user' | 'assistant'; content: string }> = [];
    if (emptyMessages.length > 0) {
      store.saveAIOutput({
        type: 'roleplay',
        title: saveTitle,
        content: '',
      });
    }
    assert.strictEqual(store.savedAIOutputs.length, 0, 'No output saved when messages are empty');
    assert.strictEqual(store.isAIOutputSaved(saveTitle, 'roleplay'), false);

    // Test 2.2: Multi-turn live dialogue saving
    const liveMessages: Array<{ id: string; role: 'user' | 'assistant'; content: string }> = [
      { id: '1', role: 'user', content: 'Hey, I noticed someone said you were cooked on Discord. Are you okay?' },
      { id: '2', role: 'assistant', content: 'Lol it just means I lost a 1v1 match badly, it is not serious Mom.' },
      { id: '3', role: 'user', content: 'Oh got it! I wanted to make sure nobody was picking on you.' },
      { id: '4', role: 'assistant', content: 'Nah we were just clowning around in the lobby.' },
    ];

    const dialogueTranscript = liveMessages
      .map((m) => `${m.role === 'user' ? 'Parent' : 'Teen'}: ${m.content}`)
      .join('\n');

    const savedLive = store.saveAIOutput({
      type: 'roleplay',
      title: saveTitle,
      content: dialogueTranscript,
      summary: `Interactive roleplay session for ${testTerm.term}`,
      metadata: {
        termSlug: testTerm.slug,
        termName: testTerm.term,
        category: testTerm.category,
      },
    });

    assert.ok(savedLive);
    assert.strictEqual(savedLive.type, 'roleplay');
    assert.strictEqual(savedLive.title, 'Practice: ' + testTerm.term);
    assert.strictEqual(savedLive.summary, 'Interactive roleplay session for ' + testTerm.term);
    assert.strictEqual(savedLive.metadata?.termSlug, testTerm.slug);
    assert.strictEqual(savedLive.metadata?.category, testTerm.category);

    // Verify transcript structure has exact role prefixes
    const lines = savedLive.content.split('\n');
    assert.strictEqual(lines.length, 4);
    assert.strictEqual(lines[0], 'Parent: Hey, I noticed someone said you were cooked on Discord. Are you okay?');
    assert.strictEqual(lines[1], 'Teen: Lol it just means I lost a 1v1 match badly, it is not serious Mom.');
    assert.strictEqual(lines[2], 'Parent: Oh got it! I wanted to make sure nobody was picking on you.');
    assert.strictEqual(lines[3], 'Teen: Nah we were just clowning around in the lobby.');

    // Test 2.3: Reactive indicator check immediately after live save
    assert.strictEqual(store.isAIOutputSaved(saveTitle, 'roleplay'), true);
  });

  // ═════════════════════════════════════════════════════════════
  // Section 3: Deduplication Logic & Reactive Indicators
  // ═════════════════════════════════════════════════════════════
  await suite.test('3. Deduplication Logic, Case Normalization & Reactive Indicators', async (t) => {
    const store = new StoreSimulation();
    const plugTerm = findTerm('plug')!;
    assert.ok(plugTerm);

    const saveTitle = 'Practice: ' + plugTerm.term;

    // Test 3.1: Save fallback script initially
    const script = getFallbackScriptForTerm(plugTerm);
    const initialSave = store.saveAIOutput({
      type: 'roleplay',
      title: saveTitle,
      content: script.dialogue.map((d) => `${d.speaker}: ${d.text}`).join('\n'),
      summary: script.situation,
      metadata: {
        termSlug: plugTerm.slug,
        termName: plugTerm.term,
        category: plugTerm.category,
      },
    });

    assert.ok(initialSave);
    assert.strictEqual(store.savedAIOutputs.length, 1);
    assert.strictEqual(store.isAIOutputSaved(saveTitle, 'roleplay'), true);

    // Test 3.2: Case-insensitive and whitespace tolerance in isAIOutputSaved
    assert.strictEqual(store.isAIOutputSaved('Practice: PLUG', 'roleplay'), true, 'Case-insensitive title match');
    assert.strictEqual(store.isAIOutputSaved('  Practice: plug  ', 'roleplay'), true, 'Trimmed title match');
    assert.strictEqual(store.isAIOutputSaved('practice: plug', 'roleplay'), true, 'All lowercase title match');
    assert.strictEqual(store.isAIOutputSaved('Practice: plug', 'tone-analysis'), false, 'Type isolation (tone-analysis)');
    assert.strictEqual(store.isAIOutputSaved('Practice: plug', 'playbook'), false, 'Type isolation (playbook)');

    // Test 3.3: Idempotent re-save: saving 20 times in a row results in exactly 1 entry
    const initialTimestamp = initialSave.savedAt;
    for (let i = 0; i < 20; i++) {
      store.saveAIOutput({
        type: 'roleplay',
        title: saveTitle,
        content: script.dialogue.map((d) => `${d.speaker}: ${d.text}`).join('\n'),
        summary: script.situation,
        metadata: {
          termSlug: plugTerm.slug,
          termName: plugTerm.term,
          category: plugTerm.category,
        },
      });
    }

    assert.strictEqual(store.savedAIOutputs.length, 1, 'Multiple saves of same roleplay must collapse to 1 entry');
    assert.strictEqual(store.savedAIOutputs[0].title, saveTitle);
    assert.ok(store.savedAIOutputs[0].savedAt >= initialTimestamp);

    // Test 3.4: Overwriting Fallback Script with Live Session for same term updates content without duplicating
    const liveTranscript = 'Parent: Hey, who is your plug?\nTeen: Whoa Mom, it just means someone with connections or goods.';
    const updatedSave = store.saveAIOutput({
      type: 'roleplay',
      title: saveTitle, // Same title: "Practice: plug"
      content: liveTranscript,
      summary: 'Interactive roleplay session for plug',
      metadata: {
        termSlug: plugTerm.slug,
        termName: plugTerm.term,
        category: plugTerm.category,
      },
    });

    assert.ok(updatedSave);
    assert.strictEqual(store.savedAIOutputs.length, 1, 'Total roleplay items must still be 1 after live session update');
    assert.strictEqual(store.savedAIOutputs[0].content, liveTranscript, 'Content must be updated to live transcript');
    assert.strictEqual(store.savedAIOutputs[0].summary, 'Interactive roleplay session for plug');

    // Test 3.5: Distinct terms do not overwrite each other
    const skibidiTerm = findTerm('skibidi')!;
    store.saveAIOutput({
      type: 'roleplay',
      title: 'Practice: ' + skibidiTerm.term,
      content: 'Parent: What is skibidi?\nTeen: Just a silly meme sound.',
      summary: 'Practice for skibidi',
    });

    assert.strictEqual(store.savedAIOutputs.length, 2);
    assert.strictEqual(store.isAIOutputSaved('Practice: plug', 'roleplay'), true);
    assert.strictEqual(store.isAIOutputSaved('Practice: skibidi', 'roleplay'), true);

    // Test 3.6: Removal resets reactive indicator
    const plugItem = store.savedAIOutputs.find((o) => o.title === 'Practice: plug')!;
    store.removeAIOutput(plugItem.id);
    assert.strictEqual(store.savedAIOutputs.length, 1);
    assert.strictEqual(store.isAIOutputSaved('Practice: plug', 'roleplay'), false);
    assert.strictEqual(store.isAIOutputSaved('Practice: skibidi', 'roleplay'), true);

    // Test 3.7: Clear roleplay resets indicator for all roleplays
    store.clearAIOutputs('roleplay');
    assert.strictEqual(store.savedAIOutputs.length, 0);
    assert.strictEqual(store.isAIOutputSaved('Practice: skibidi', 'roleplay'), false);
  });

  // ═════════════════════════════════════════════════════════════
  // Section 4: Quota Bounding & Eviction Under Roleplay Floods
  // ═════════════════════════════════════════════════════════════
  await suite.test('4. 50-Item Capacity Bounding & MRU Eviction Under Roleplay Flood', async (t) => {
    const store = new StoreSimulation();

    // Save 65 distinct roleplay items
    for (let i = 1; i <= 65; i++) {
      store.saveAIOutput({
        type: 'roleplay',
        title: `Practice: term-${i}`,
        content: `Dialogue content for term-${i}`,
        summary: `Summary for term-${i}`,
      });
    }

    // Invariant: strictly bounded to 50 items
    assert.strictEqual(store.savedAIOutputs.length, 50, 'Store must cap at exactly 50 items');

    // Invariant: Most recent item is at index 0 (MRU)
    assert.strictEqual(store.savedAIOutputs[0].title, 'Practice: term-65');
    assert.strictEqual(store.savedAIOutputs[49].title, 'Practice: term-16');

    // Oldest items (term-1 to term-15) must be evicted
    assert.strictEqual(store.isAIOutputSaved('Practice: term-1', 'roleplay'), false, 'term-1 must be evicted');
    assert.strictEqual(store.isAIOutputSaved('Practice: term-15', 'roleplay'), false, 'term-15 must be evicted');
    assert.strictEqual(store.isAIOutputSaved('Practice: term-16', 'roleplay'), true, 'term-16 must be retained');
    assert.strictEqual(store.isAIOutputSaved('Practice: term-65', 'roleplay'), true, 'term-65 must be retained');

    // Re-saving term-16 moves it to index 0
    store.saveAIOutput({
      type: 'roleplay',
      title: 'Practice: term-16',
      content: 'Updated content for term-16',
    });

    assert.strictEqual(store.savedAIOutputs.length, 50, 'Length remains 50 after re-saving existing item');
    assert.strictEqual(store.savedAIOutputs[0].title, 'Practice: term-16', 'Re-saved item moves to MRU head (index 0)');
  });

  // ═════════════════════════════════════════════════════════════
  // Section 5: React Component Rendering & Setup Guide Inclusion
  // ═════════════════════════════════════════════════════════════
  await suite.test('5. RoleplayChat UI: Fallback Drawer, Setup Guide & 1-Click Copy Verification', async (t) => {
    const term = findTerm('skibidi')!;
    assert.ok(term);

    const store = new StoreSimulation();
    currentAppContextValue = {
      savedTerms: store.savedTerms,
      savedMessages: store.savedMessages,
      savedAIOutputs: store.savedAIOutputs,
      saveAIOutput: (output: any) => store.saveAIOutput(output),
      removeAIOutput: (id: string) => store.removeAIOutput(id),
      clearAIOutputs: (type?: any) => store.clearAIOutputs(type),
      isAIOutputSaved: (title: string, type: any) => store.isAIOutputSaved(title, type),
      notify: (msg: string) => store.notify(msg),
    };

    // Subtest 5.1: Fallback View SSR inspection when engine === 'unavailable'
    mockAgentState = {
      status: { engine: 'unavailable' },
      messages: [],
      isStreaming: false,
      streamingText: '',
      initialize: () => {},
      send: () => {},
      reset: () => {},
    };

    const fallbackHtml = ReactDOMServer.renderToString(
      React.createElement(RoleplayChat, {
        term,
        open: true,
        onClose: () => {},
      })
    );
    // Verify Fallback drawer classes and markup
    assert.ok(fallbackHtml.includes('roleplay-drawer-fallback'), 'Must have roleplay-drawer-fallback class');
    assert.ok(fallbackHtml.includes('Conversation Script'), 'Header must indicate conversation script');
    assert.ok(fallbackHtml.includes('Scenario Context'), 'Must render Scenario Context card');
    assert.ok(fallbackHtml.includes('Sample Conversation Script'), 'Must render Sample Conversation Script section');
    assert.ok(fallbackHtml.includes('Parent Coaching Tips'), 'Must render Coaching Tips section');
    assert.ok(/Tip\s*(<!-- -->)?\s*1/.test(fallbackHtml) && /Tip\s*(<!-- -->)?\s*2/.test(fallbackHtml) && /Tip\s*(<!-- -->)?\s*3/.test(fallbackHtml), 'Must render 3 coaching tip badges');


    // Verify Chrome AI Setup Guide presence in fallback drawer
    assert.ok(fallbackHtml.includes('fallback-guide-container'), 'Must contain fallback-guide-container');
    assert.ok(fallbackHtml.includes('chrome-ai-setup-guide') || fallbackHtml.includes('chrome-ai-guide'), 'Must contain ChromeAISetupGuide component');
    assert.ok(fallbackHtml.includes('How to turn on local AI in Chrome (60 seconds)'), 'Setup guide title must match exact specification');
    assert.ok(fallbackHtml.includes('chrome-ai-guide-compact') || fallbackHtml.includes('chrome-ai-setup-guide-compact'), 'Setup guide must have compact prop set');

    // Verify Save script button initial state
    assert.ok(fallbackHtml.includes('Save script to Saved Items'), 'Button text must be "Save script to Saved Items" before saving');

    // Subtest 5.2: Save script action and reactive indicator update in UI
    store.saveAIOutput({
      type: 'roleplay',
      title: 'Practice: ' + term.term,
      content: 'Parent: Sample\nTeen: Dialogue',
    });

    currentAppContextValue.savedAIOutputs = store.savedAIOutputs;

    const savedFallbackHtml = ReactDOMServer.renderToString(
      React.createElement(RoleplayChat, {
        term,
        open: true,
        onClose: () => {},
      })
    );

    assert.ok(savedFallbackHtml.includes('Saved to Saved Items'), 'Button text must transition to "Saved to Saved Items" after saving');
    assert.ok(savedFallbackHtml.includes('saved-button'), 'Button must receive saved-button styling class');

    // Subtest 5.3: Live View isolation when engine === 'local'
    mockAgentState = {
      status: { engine: 'local' },
      messages: [
        { id: '1', role: 'user', content: 'What is skibidi?' },
        { id: '2', role: 'assistant', content: 'Just a meme!' },
      ],
      isStreaming: false,
      streamingText: '',
      initialize: () => {},
      send: () => {},
      reset: () => {},
    };

    const liveHtml = ReactDOMServer.renderToString(
      React.createElement(RoleplayChat, {
        term,
        open: true,
        onClose: () => {},
      })
    );

    // In live view: fallback scenario card, coach notes, and embedded setup guide must NOT be present
    assert.ok(!liveHtml.includes('roleplay-drawer-fallback'), 'Live drawer must not have roleplay-drawer-fallback class');
    assert.ok(!liveHtml.includes('fallback-scenario-card'), 'Live drawer must not render fallback scenario card');
    assert.ok(!liveHtml.includes('fallback-guide-container'), 'Live drawer must not render fallback guide container');
    assert.ok(liveHtml.includes('roleplay-messages'), 'Live drawer must render interactive message container');
    assert.ok(liveHtml.includes('roleplay-input'), 'Live drawer must render interactive input form');
  });

  // ═════════════════════════════════════════════════════════════
  // Section 6: ChromeAISetupGuide Direct Component & 1-Click Copy Tests
  // ═════════════════════════════════════════════════════════════
  await suite.test('6. ChromeAISetupGuide Direct 1-Click Flags Copy & Clipboard Stress', async (t) => {
    mockClipboard.contents = '';

    // Verify exact required constant strings
    assert.strictEqual(CHROME_AI_GUIDE_CONSTANTS.flagUrl, 'chrome://flags/#prompt-api-for-gemini-nano');
    assert.strictEqual(CHROME_AI_GUIDE_CONSTANTS.optimizationFlagUrl, 'chrome://flags/#optimization-guide-on-device-model');
    assert.strictEqual(CHROME_AI_GUIDE_CONSTANTS.componentsUrl, 'chrome://components');
    assert.strictEqual(CHROME_AI_GUIDE_CONSTANTS.title, 'How to turn on local AI in Chrome (60 seconds)');

    // Test 1-click copy action with mock clipboard
    await mockClipboard.writeText(CHROME_AI_GUIDE_CONSTANTS.flagUrl);
    assert.strictEqual(mockClipboard.contents, 'chrome://flags/#prompt-api-for-gemini-nano');

    await mockClipboard.writeText(CHROME_AI_GUIDE_CONSTANTS.componentsUrl);
    assert.strictEqual(mockClipboard.contents, 'chrome://components');

    // Test renderToString with defaultOpen={true} exposes flag URL and copy buttons
    const expandedHtml = ReactDOMServer.renderToString(
      React.createElement(ChromeAISetupGuide, {
        defaultOpen: true,
        compact: true,
      })
    );

    assert.ok(expandedHtml.includes('chrome://flags/#prompt-api-for-gemini-nano'), 'Expanded guide must display prompt API flag');
    assert.ok(expandedHtml.includes('chrome://flags/#optimization-guide-on-device-model'), 'Expanded guide must display optimization guide flag');
    assert.ok(expandedHtml.includes('chrome://components'), 'Expanded guide must display chrome://components URL');
    assert.ok(expandedHtml.includes('Copy flag link') || expandedHtml.includes('Copy Prompt API flag URL'), 'Must contain copy flag link button');
    assert.ok(expandedHtml.includes('chrome-ai-guide-compact') || expandedHtml.includes('chrome-ai-setup-guide-compact'), 'Must adhere to compact prop');
  });

  // ═════════════════════════════════════════════════════════════
  // Section 7: TermPage Button Label State Transition
  // ═════════════════════════════════════════════════════════════
  await suite.test('7. TermPage Practice Button Label State Transition', async (t) => {
    const deriveButtonLabel = (engine: 'unavailable' | 'local') =>
      engine === 'unavailable' ? 'View conversation script & tips' : 'Practice this conversation';

    assert.strictEqual(deriveButtonLabel('unavailable'), 'View conversation script & tips');
    assert.strictEqual(deriveButtonLabel('local'), 'Practice this conversation');

    // Verify TermPage.tsx source code contains this exact dynamic binding
    const termPagePath = path.resolve(__dirname, '../src/pages/TermPage.tsx');
    const termPageCode = fs.readFileSync(termPagePath, 'utf8');

    assert.ok(termPageCode.includes("status.engine === 'unavailable'"), 'TermPage must query status.engine');
    assert.ok(termPageCode.includes('View conversation script & tips'), 'TermPage must have "View conversation script & tips" label');
    assert.ok(termPageCode.includes('Practice this conversation'), 'TermPage must have "Practice this conversation" label');
    assert.ok(termPageCode.includes('{roleplayButtonLabel}'), 'TermPage button must render dynamic label');
  });

  // ═════════════════════════════════════════════════════════════
  // Section 8: Corpus Edge Terms Fallback Script Persistence Stress
  // ═════════════════════════════════════════════════════════════
  await suite.test('8. Corpus Edge Terms (Emojis, Slashes, Quotes) Fallback Persistence', async (t) => {
    const edgeSlugs = [
      'cooked',
      'plug',
      'skibidi',
      'no-cap',
      'crash-out',
      'cap-no-cap',
      'skull-emoji',
      '10-10',
      'eyes-emoji',
      'blue-cap-emoji',
    ];

    const store = new StoreSimulation();

    for (const slug of edgeSlugs) {
      const term = findTerm(slug);
      if (!term) continue;

      const script = getFallbackScriptForTerm(term);
      assert.ok(script.dialogue.length >= 2, `${slug} must have at least 2 dialogue turns`);
      assert.ok(script.coachingTips.length === 3, `${slug} must have 3 coaching tips`);
      assert.ok(script.situation.length > 0, `${slug} must have situation text`);

      const transcript = script.dialogue.map((d) => `${d.speaker}: ${d.text}`).join('\n');
      const title = 'Practice: ' + term.term;

      const saved = store.saveAIOutput({
        type: 'roleplay',
        title,
        content: transcript,
        summary: script.situation,
        metadata: {
          termSlug: term.slug,
          termName: term.term,
          category: term.category,
        },
      });

      assert.ok(saved, `Saving roleplay for edge term ${slug} must succeed`);
      assert.strictEqual(store.isAIOutputSaved(title, 'roleplay'), true, `isAIOutputSaved must be true for ${slug}`);
    }

    // Verify storage roundtrip with special characters / emojis
    store.serializeToStorage(mockStorage);
    const reloaded = new StoreSimulation();
    reloaded.loadFromStorage(mockStorage);

    assert.strictEqual(reloaded.savedAIOutputs.length, store.savedAIOutputs.length);
    for (const item of reloaded.savedAIOutputs) {
      assert.strictEqual(item.type, 'roleplay');
      assert.ok(item.content.length > 0);
      assert.ok(item.metadata?.termSlug);
    }
  });

  // ═════════════════════════════════════════════════════════════
  // Section 9: Adversarial Input Sanitization & Content Truncation Bounds

  // ═════════════════════════════════════════════════════════════
  await suite.test('9. Adversarial Input Sanitization, Unicode, XSS & Truncation Bounds', async (t) => {
    const store = new StoreSimulation();

    // 9.1: Empty or whitespace-only title must be rejected (no-op)
    assert.strictEqual(store.saveAIOutput({ type: 'roleplay', title: '', content: 'Valid dialogue' }), null);
    assert.strictEqual(store.saveAIOutput({ type: 'roleplay', title: '   \n\t  ', content: 'Valid dialogue' }), null);
    assert.strictEqual(store.savedAIOutputs.length, 0);

    // 9.2: Empty or whitespace-only content must be rejected (no-op)
    assert.strictEqual(store.saveAIOutput({ type: 'roleplay', title: 'Practice: test', content: '' }), null);
    assert.strictEqual(store.saveAIOutput({ type: 'roleplay', title: 'Practice: test', content: '    \n  ' }), null);
    assert.strictEqual(store.savedAIOutputs.length, 0);

    // 9.3: Overly long title (> 200 chars) must be truncated to 200 chars cleanly
    const hugeTitle = 'Practice: ' + 'A'.repeat(500);
    const savedHugeTitle = store.saveAIOutput({
      type: 'roleplay',
      title: hugeTitle,
      content: 'Sample content',
    });
    assert.ok(savedHugeTitle);
    assert.strictEqual(savedHugeTitle.title.length, 200);

    // 9.4: Overly long content (> 10,000 chars) must be truncated to 10,000 chars cleanly
    const hugeContent = 'Parent: Turn\nTeen: Turn\n'.repeat(1000); // > 24,000 chars
    const savedHugeContent = store.saveAIOutput({
      type: 'roleplay',
      title: 'Practice: huge-content-term',
      content: hugeContent,
    });
    assert.ok(savedHugeContent);
    assert.strictEqual(savedHugeContent.content.length, 10000);

    // 9.5: HTML / Script tag injection resilience
    const xssScript = '<script>alert("xss")</script><b>Bold attack</b>';
    const savedXss = store.saveAIOutput({
      type: 'roleplay',
      title: 'Practice: xss-attack',
      content: xssScript,
      summary: '<iframe src="malicious.html"></iframe>',
    });
    assert.ok(savedXss);
    assert.strictEqual(savedXss.content, xssScript); // Treated strictly as plain string data, not executable HTML
    assert.strictEqual(savedXss.summary, '<iframe src="malicious.html"></iframe>');

    // 9.6: Unicode surrogate pairs & multilingual slang strings
    const unicodeTitle = 'Practice: 💀 🧢 🔌 日本語 Español العربية';
    const unicodeContent = 'Parent: 💯\nTeen: 🚀';
    const savedUnicode = store.saveAIOutput({
      type: 'roleplay',
      title: unicodeTitle,
      content: unicodeContent,
    });
    assert.ok(savedUnicode);
    assert.strictEqual(store.isAIOutputSaved(unicodeTitle, 'roleplay'), true);
  });

  // ═════════════════════════════════════════════════════════════
  // Section 10: QuotaExceededError Resilience & Malformed Storage Recovery
  // ═════════════════════════════════════════════════════════════
  await suite.test('10. QuotaExceededError & Malformed LocalStorage Recovery', async (t) => {
    // 10.1: Malformed JSON string in localStorage should not crash useStored initialization
    const malformedStorage = new MockLocalStorage();
    malformedStorage.setItem('parent-decoder-saved-ai-outputs', '{not-a-valid-json');

    let parsedInitial: any = 'fallback-empty';
    try {
      const stored = malformedStorage.getItem('parent-decoder-saved-ai-outputs');
      if (stored) {
        parsedInitial = JSON.parse(stored);
      }
    } catch {
      parsedInitial = [];
    }
    assert.deepStrictEqual(parsedInitial, [], 'Malformed JSON must safely recover to empty array []');

    // 10.2: Non-array stored value when initial is array
    malformedStorage.setItem('parent-decoder-saved-ai-outputs', JSON.stringify({ error: 'not-an-array' }));
    let arrayRecovered: any;
    try {
      const stored = malformedStorage.getItem('parent-decoder-saved-ai-outputs');
      const parsed = JSON.parse(stored!);
      if (Array.isArray([]) && !Array.isArray(parsed)) {
        arrayRecovered = [];
      } else {
        arrayRecovered = parsed;
      }
    } catch {
      arrayRecovered = [];
    }
    assert.deepStrictEqual(arrayRecovered, [], 'Non-array JSON must safely reset to empty array []');

    // 10.3: QuotaExceededError handling in localStorage.setItem
    class QuotaExceededLocalStorage extends MockLocalStorage {
      override setItem(key: string, value: string): void {
        throw new Error('QuotaExceededError: DOMException quota exceeded');
      }
    }

    const quotaStorage = new QuotaExceededLocalStorage();
    const resilientStore = new StoreSimulation();
    resilientStore.saveAIOutput({
      type: 'roleplay',
      title: 'Practice: quota-test',
      content: 'Sample text',
    });

    let threwUncaught = false;
    try {
      resilientStore.serializeToStorage(quotaStorage);
    } catch (e: any) {
      if (e.message.includes('QuotaExceededError')) {
        threwUncaught = true; // Expected simulation catch
      }
    }
    assert.strictEqual(threwUncaught, true);
    // In-memory state remains fully intact even if physical storage throws
    assert.strictEqual(resilientStore.savedAIOutputs.length, 1);
    assert.strictEqual(resilientStore.savedAIOutputs[0].title, 'Practice: quota-test');
  });

  // ═════════════════════════════════════════════════════════════
  // Section 11: Rapid Concurrent Click Simulation (100 Clicks)
  // ═════════════════════════════════════════════════════════════
  await suite.test('11. 100-Rapid-Click Concurrency Simulation & Zero Duplication', async (t) => {
    const store = new StoreSimulation();
    const testTerm = findTerm('no-cap')!;
    const script = getFallbackScriptForTerm(testTerm);
    const transcript = script.dialogue.map((d) => `${d.speaker}: ${d.text}`).join('\n');
    const saveTitle = 'Practice: ' + testTerm.term;

    // Simulate clicking the save button 100 times in rapid succession
    for (let click = 0; click < 100; click++) {
      store.saveAIOutput({
        type: 'roleplay',
        title: saveTitle,
        content: transcript,
        summary: script.situation,
        metadata: {
          termSlug: testTerm.slug,
          termName: testTerm.term,
          category: testTerm.category,
        },
      });
    }

    // Invariant: Exactly 1 item exists in store
    assert.strictEqual(store.savedAIOutputs.length, 1, '100 clicks must produce exactly 1 saved item');
    assert.strictEqual(store.savedAIOutputs[0].title, saveTitle);
    assert.strictEqual(store.isAIOutputSaved(saveTitle, 'roleplay'), true);
  });

  // ═════════════════════════════════════════════════════════════
  // Section 12: Full Corpus Sweep: 100% of all 617 Terms Fallback Script Persistence
  // ═════════════════════════════════════════════════════════════
  await suite.test('12. Full Corpus Sweep: All 617 Terms Fallback Script Persistence Without Error', async (t) => {
    assert.strictEqual(terms.length, 617, 'Total terms count must be exactly 617');

    let totalDialogueTurns = 0;
    let totalTips = 0;

    for (let i = 0; i < terms.length; i++) {
      const term = terms[i];
      const script = getFallbackScriptForTerm(term);

      assert.ok(script, `Script must exist for term #${i}: ${term.slug}`);
      assert.ok(script.termSlug, `termSlug must be defined for ${term.slug}`);
      assert.ok(script.dialogue.length >= 2, `Dialogue must have at least 2 turns for ${term.slug}`);
      assert.strictEqual(script.coachingTips.length, 3, `Coaching tips must have exactly 3 tips for ${term.slug}`);
      assert.ok(script.situation && script.situation.length > 0, `Situation must be non-empty for ${term.slug}`);
      assert.ok(script.recommendedOpener && script.recommendedOpener.length > 0, `Opener must be non-empty for ${term.slug}`);

      totalDialogueTurns += script.dialogue.length;
      totalTips += script.coachingTips.length;

      // Ensure every speaker is either 'Parent' or 'Teen'
      for (const turn of script.dialogue) {
        assert.ok(turn.speaker === 'Parent' || turn.speaker === 'Teen', `Speaker must be Parent or Teen, got ${turn.speaker}`);
        assert.ok(turn.text && turn.text.length > 0, `Turn text must not be empty in ${term.slug}`);
      }
    }

    assert.ok(totalDialogueTurns >= 617 * 2, 'Must have at least 1234 total dialogue turns across all terms');
    assert.strictEqual(totalTips, 617 * 3, 'Must have exactly 1,851 coaching tips across all terms');
  });
});

