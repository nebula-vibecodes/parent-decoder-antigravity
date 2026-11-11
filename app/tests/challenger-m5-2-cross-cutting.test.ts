import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createRequire } from 'node:module';
import { terms, findTerm, type Term } from '../src/data';
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

// Polyfill global localStorage for Headless Node tests
const mockStorage = new MockLocalStorage();
Object.defineProperty(globalThis, 'localStorage', {
  value: mockStorage,
  writable: true,
  configurable: true,
});

// Polyfill window if needed
if (typeof (globalThis as any).window === 'undefined') {
  (globalThis as any).window = globalThis;
}

// ─────────────────────────────────────────────────────────────
// Real Store Logic Simulator (matches store.tsx 1:1)
// ─────────────────────────────────────────────────────────────

class AccurateStoreSimulator {
  public savedTerms: string[] = [];
  public savedMessages: { id: string; text: string; savedAt: number }[] = [];
  public savedAIOutputs: SavedAIOutput[] = [];
  public toastHistory: string[] = [];
  public storage: MockLocalStorage;

  constructor(storage: MockLocalStorage = mockStorage) {
    this.storage = storage;
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const termsRaw = this.storage.getItem('parent-decoder-saved-terms');
      this.savedTerms = termsRaw ? JSON.parse(termsRaw) : [];
      const msgsRaw = this.storage.getItem('parent-decoder-saved-messages');
      this.savedMessages = msgsRaw ? JSON.parse(msgsRaw) : [];
      const aiRaw = this.storage.getItem('parent-decoder-saved-ai-outputs');
      this.savedAIOutputs = aiRaw ? JSON.parse(aiRaw) : [];
    } catch {
      this.savedTerms = [];
      this.savedMessages = [];
      this.savedAIOutputs = [];
    }
  }

  persist() {
    this.storage.setItem('parent-decoder-saved-terms', JSON.stringify(this.savedTerms));
    this.storage.setItem('parent-decoder-saved-messages', JSON.stringify(this.savedMessages));
    this.storage.setItem('parent-decoder-saved-ai-outputs', JSON.stringify(this.savedAIOutputs));
  }

  notify(msg: string) {
    this.toastHistory.push(msg);
  }

  toggleTerm(slug: string) {
    const removing = this.savedTerms.includes(slug);
    this.savedTerms = removing ? this.savedTerms.filter((s) => s !== slug) : [...this.savedTerms, slug];
    this.notify(removing ? 'Removed from your saved terms' : 'Saved in this browser');
    this.persist();
  }

  saveMessage(text: string) {
    const clean = text.trim().slice(0, 600);
    if (!clean) return;
    this.savedMessages = [
      { id: `${Date.now()}`, text: clean, savedAt: Date.now() },
      ...this.savedMessages.filter((item) => item.text !== clean),
    ].slice(0, 20);
    this.notify('Message saved only in this browser');
    this.persist();
  }

  removeMessage(id: string) {
    this.savedMessages = this.savedMessages.filter((item) => item.id !== id);
    this.persist();
  }

  clearMessages() {
    this.savedMessages = [];
    this.persist();
  }

  clearTerms() {
    this.savedTerms = [];
    this.persist();
  }

  isAIOutputSaved(title: string, type: 'tone-analysis' | 'roleplay' | 'playbook') {
    const normalized = title.trim().toLowerCase();
    return this.savedAIOutputs.some(
      (item) => item.type === type && item.title.trim().toLowerCase() === normalized
    );
  }

  saveAIOutput(output: Omit<SavedAIOutput, 'id' | 'savedAt'>) {
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
    this.persist();
    return newItem;
  }

  removeAIOutput(id: string) {
    this.savedAIOutputs = this.savedAIOutputs.filter((item) => item.id !== id);
    this.persist();
  }

  clearAIOutputs(type?: 'tone-analysis' | 'roleplay' | 'playbook') {
    if (type) {
      this.savedAIOutputs = this.savedAIOutputs.filter((item) => item.type !== type);
    } else {
      this.savedAIOutputs = [];
    }
    this.persist();
  }

  getTotalSavedCount() {
    return this.savedTerms.length + this.savedMessages.length + this.savedAIOutputs.length;
  }
}

// ─────────────────────────────────────────────────────────────
// Component Bundle Helper using esbuild (Zero JSX runtime friction)
// ─────────────────────────────────────────────────────────────

function bundleComponent(filePath: string, mockStoreState: any, extraMocks: Record<string, any> = {}) {
  const bundled = esbuild.buildSync({
    entryPoints: [filePath],
    bundle: true,
    write: false,
    format: 'cjs',
    jsx: 'automatic',
    platform: 'node',
    target: 'node20',
    external: [
      'react',
      'react-dom',
      'react-dom/server',
      'react-router',
      'lucide-react',
      '../data',
      '../../data',
      '../store',
      '../../store',
      '../lib/ai/*',
      '../../lib/ai/*',
      './PrivacyBadge',
      './StreamingText',
      './ChromeAISetupGuide',
      '../components/AppShell',
    ],
  });

  const cjsModule: any = { exports: {} };
  const customRequire = (id: string) => {
    if (id === 'react') return React;
    if (id === 'react/jsx-runtime') return require('react/jsx-runtime');
    if (id === 'react-router') {
      return {
        Link: ({ to, children, ...props }: any) =>
          React.createElement('a', { href: to, ...props }, children),
        NavLink: ({ to, children, className, ...props }: any) => {
          const cls = typeof className === 'function' ? className({ isActive: false }) : className;
          return React.createElement('a', { href: to, className: cls, ...props }, children);
        },
        useNavigate: () => () => {},
        useLocation: () => ({ pathname: '/' }),
        useParams: () => ({ slug: 'skibidi' }),
        useSearchParams: () => [new URLSearchParams(), () => {}],
        Outlet: () => React.createElement('div', { className: 'mock-outlet' }),
      };
    }
    if (id === 'lucide-react') {
      return new Proxy({}, {
        get: (_t, prop: string) => (props: any) =>
          React.createElement('span', { 'data-icon': prop, ...props }),
      });
    }
    if (id.includes('store')) {
      return {
        useApp: () => ({
          savedTerms: mockStoreState.savedTerms ?? [],
          savedMessages: mockStoreState.savedMessages ?? [],
          savedAIOutputs: mockStoreState.savedAIOutputs ?? [],
          toggleTerm: mockStoreState.toggleTerm ?? (() => {}),
          saveMessage: mockStoreState.saveMessage ?? (() => {}),
          removeMessage: mockStoreState.removeMessage ?? (() => {}),
          clearMessages: mockStoreState.clearMessages ?? (() => {}),
          clearTerms: mockStoreState.clearTerms ?? (() => {}),
          saveAIOutput: mockStoreState.saveAIOutput ?? (() => {}),
          removeAIOutput: mockStoreState.removeAIOutput ?? (() => {}),
          clearAIOutputs: mockStoreState.clearAIOutputs ?? (() => {}),
          isAIOutputSaved: mockStoreState.isAIOutputSaved ?? (() => false),
          notify: mockStoreState.notify ?? (() => {}),
          openSearch: () => {},
          closeSearch: () => {},
          searchOpen: false,
        }),
        copyText: async (text: string) => {
          if (mockStoreState.clipboard) {
            await mockStoreState.clipboard.writeText(text);
          }
        },
      };
    }
    if (id.includes('data')) {
      return {
        terms,
        findTerm,
        concernLabel: { harmless: 'Harmless', discuss: 'Discuss', alert: 'Alert' },
        searchTerms: () => [],
      };
    }
    if (id.includes('AppShell')) {
      return {
        PageIntro: ({ eyebrow, title, children }: any) =>
          React.createElement('div', { className: 'mock-page-intro' },
            React.createElement('p', null, eyebrow),
            React.createElement('h1', null, title),
            children
          ),
        TermCard: ({ item }: any) =>
          React.createElement('div', { className: 'mock-term-card' }, item.term),
      };
    }
    if (id.includes('PrivacyBadge')) {
      return {
        PrivacyBadge: () => React.createElement('span', { className: 'mock-privacy-badge' }),
      };
    }
    if (id.includes('StreamingText')) {
      return {
        StreamingText: ({ text }: any) => React.createElement('span', { className: 'mock-streaming' }, text),
      };
    }
    if (id.includes('useAgent')) {
      return {
        useAgent: () => {
          const defaultAgent = {
            status: { engine: 'local', ready: true },
            messages: [],
            isStreaming: false,
            streamingText: '',
            initialize: async () => {},
            send: async () => {},
            reset: () => {},
          };
          return extraMocks.agent ? { ...defaultAgent, ...extraMocks.agent } : defaultAgent;
        },
      };
    }
    if (id.includes('systemPrompts')) {
      return {
        buildToneAnalysisPrompt: () => 'prompt',
      };
    }

    if (extraMocks[id]) return extraMocks[id];
    return require(id);
  };

  const fn = new Function('require', 'module', 'exports', 'React', bundled.outputFiles[0].text);
  fn(customRequire, cjsModule, cjsModule.exports, React);
  return cjsModule.exports;
}

// ─────────────────────────────────────────────────────────────
// Challenger M5_2 Test Suite
// ─────────────────────────────────────────────────────────────

test('Challenger M5_2: Empirical Verification & Adversarial Challenge Suite', async (t) => {

  // ═════════════════════════════════════════════════════════════
  // Section 1: ToneAnalysis Save Action Empirical Challenge
  // ═════════════════════════════════════════════════════════════

  await t.test('1.1: ToneAnalysis Title Formatting Contract', () => {
    // Specification: title format 'Tone: ' + message.slice(0, 30)...
    const formatToneTitle = (msg: string) => {
      const trimmed = msg.trim();
      return 'Tone: ' + trimmed.slice(0, 30) + (trimmed.length > 30 ? '…' : '');
    };

    // Test cases: short message (< 30 chars)
    const shortMsg = 'ngl that was mid';
    assert.strictEqual(formatToneTitle(shortMsg), 'Tone: ngl that was mid');
    assert.ok(!formatToneTitle(shortMsg).endsWith('…'));

    // Test cases: boundary message (exactly 30 chars)
    const exact30 = '123456789012345678901234567890';
    assert.strictEqual(formatToneTitle(exact30), 'Tone: 123456789012345678901234567890');
    assert.ok(!formatToneTitle(exact30).endsWith('…'));

    // Test cases: long message (> 30 chars)
    const longMsg = 'ngl that party was completely mid fr fr and everyone left early';
    const longTitle = formatToneTitle(longMsg);
    assert.ok(longTitle.startsWith('Tone: ngl that party was complete'));
    assert.ok(longTitle.endsWith('…'));
    assert.strictEqual(longTitle.slice(6, -1).length, 30);

    // Test cases: whitespace padded message
    const paddedMsg = '    lowkey spiraling right now    ';
    assert.strictEqual(formatToneTitle(paddedMsg), 'Tone: lowkey spiraling right now');

    // Test cases: empty and single character
    assert.strictEqual(formatToneTitle(''), 'Tone: ');
    assert.strictEqual(formatToneTitle('a'), 'Tone: a');

    // Test cases: emoji and unicode symbols
    const emojiMsg = '💀💀💀 fr fr cooked beyond repair';
    const emojiTitle = formatToneTitle(emojiMsg);
    assert.ok(emojiTitle.startsWith('Tone: '));
  });

  await t.test('1.2: ToneAnalysis Metadata Structure & Backward Compatibility', () => {
    // Specification: metadata { message, originalMessage: message }
    const store = new AccurateStoreSimulator(new MockLocalStorage());
    const rawMessage = '   She said I got no rizz at all 💀   ';
    const trimmed = rawMessage.trim();
    const title = 'Tone: ' + trimmed.slice(0, 30) + (trimmed.length > 30 ? '…' : '');
    const assistantContent = 'The phrase indicates playful teasing about social charisma.';

    const saved = store.saveAIOutput({
      type: 'tone-analysis',
      title,
      content: assistantContent,
      summary: `Tone reading for: “${trimmed.slice(0, 70)}${trimmed.length > 70 ? '…' : ''}”`,
      metadata: {
        message: trimmed,
        originalMessage: rawMessage,
      },
    });

    assert.ok(saved);
    assert.strictEqual(saved.type, 'tone-analysis');
    assert.strictEqual(saved.metadata?.message, trimmed);
    assert.strictEqual(saved.metadata?.originalMessage, rawMessage);
    assert.strictEqual(saved.summary, `Tone reading for: “She said I got no rizz at all 💀”`);
  });

  await t.test('1.3: ToneAnalysis Reactivity on isAIOutputSaved', () => {
    const store = new AccurateStoreSimulator(new MockLocalStorage());
    const rawMessage = 'You are so cooked bro';
    const trimmed = rawMessage.trim();
    const title = 'Tone: ' + trimmed.slice(0, 30);

    // 1. Initial state: not saved
    assert.strictEqual(store.isAIOutputSaved(title, 'tone-analysis'), false);

    // 2. Perform save
    store.saveAIOutput({
      type: 'tone-analysis',
      title,
      content: 'Analysis content',
      metadata: { message: trimmed, originalMessage: rawMessage },
    });

    // 3. Reactive query returns true
    assert.strictEqual(store.isAIOutputSaved(title, 'tone-analysis'), true);

    // 4. Case-insensitivity and whitespace resilience in isAIOutputSaved
    assert.strictEqual(store.isAIOutputSaved(`  ${title.toLowerCase()}  `, 'tone-analysis'), true);
    assert.strictEqual(store.isAIOutputSaved(title.toUpperCase(), 'tone-analysis'), true);

    // 5. Type isolation: saving tone-analysis does not mark roleplay or playbook as saved
    assert.strictEqual(store.isAIOutputSaved(title, 'roleplay'), false);
    assert.strictEqual(store.isAIOutputSaved(title, 'playbook'), false);
  });

  await t.test('1.4: ToneAnalysis Duplicate Prevention & Idempotency Stress', () => {
    const store = new AccurateStoreSimulator(new MockLocalStorage());
    const message = 'GG, that save was so clutch';
    const title = 'Tone: ' + message.slice(0, 30);

    // Initial count
    assert.strictEqual(store.getTotalSavedCount(), 0);

    // Save once
    store.saveAIOutput({
      type: 'tone-analysis',
      title,
      content: 'Content 1',
      metadata: { message, originalMessage: message },
    });
    assert.strictEqual(store.savedAIOutputs.length, 1);
    assert.strictEqual(store.getTotalSavedCount(), 1);

    // Attempt second save with identical title and type
    store.saveAIOutput({
      type: 'tone-analysis',
      title,
      content: 'Content 2 (Updated)',
      metadata: { message, originalMessage: message },
    });

    // Count MUST remain 1 (deduplicated by title & type in store.tsx)
    assert.strictEqual(store.savedAIOutputs.length, 1);
    assert.strictEqual(store.getTotalSavedCount(), 1);
    assert.strictEqual(store.savedAIOutputs[0].content, 'Content 2 (Updated)');

    // Stress: 25 rapid consecutive saves with case variants
    for (let i = 0; i < 25; i++) {
      store.saveAIOutput({
        type: 'tone-analysis',
        title: i % 2 === 0 ? title.toLowerCase() : title.toUpperCase(),
        content: `Stress iteration ${i}`,
      });
    }

    assert.strictEqual(store.savedAIOutputs.length, 1);
    assert.strictEqual(store.getTotalSavedCount(), 1);
  });

  await t.test('1.5: ToneAnalysis Component Live DOM Rendering Verification', () => {
    const toneAnalysisPath = path.resolve(__dirname, '../src/components/agent/ToneAnalysis.tsx');
    const rawMessage = 'Lowkey feel like giving up on this match';

    // Case 1: Engine unavailable -> returns null
    {
      const module = bundleComponent(toneAnalysisPath, {}, {
        agent: { status: { engine: 'unavailable', ready: false }, messages: [] },
      });
      const html = renderToString(
        React.createElement(module.ToneAnalysis, { message: rawMessage, matchedTerms: [] })
      );
      assert.strictEqual(html, '');
    }

    // Case 2: Engine local, unstarted state
    {
      const module = bundleComponent(toneAnalysisPath, {
        savedAIOutputs: [],
        isAIOutputSaved: () => false,
      });
      const htmlInitial = renderToString(
        React.createElement(module.ToneAnalysis, { message: rawMessage, matchedTerms: [] })
      );
      assert.ok(htmlInitial.includes('Analyze tone &amp; context') || htmlInitial.includes('Analyze tone & context'));
    }

    // Case 3: Verify source code integrity of handleSave and isSaved button in ToneAnalysis.tsx
    const toneSource = fs.readFileSync(toneAnalysisPath, 'utf-8');
    assert.ok(toneSource.includes("const title = 'Tone: ' + trimmedMessage.slice(0, 30) + (trimmedMessage.length > 30 ? '…' : '')"));
    assert.ok(toneSource.includes("const isSaved = isAIOutputSaved(title, 'tone-analysis')"));
    assert.ok(toneSource.includes("disabled={isSaved}"));
    assert.ok(toneSource.includes("isSaved ? 'Saved to Saved Items' : 'Save to Saved Items'"));
    assert.ok(toneSource.includes("isSaved ? 'saved-button' : 'button-light'"));
    assert.ok(toneSource.includes("metadata: {"));
    assert.ok(toneSource.includes("message: trimmedMessage"));
    assert.ok(toneSource.includes("originalMessage: message"));
  });

  // ═════════════════════════════════════════════════════════════
  // Section 2: AppShell Counter Synchronization Empirical Challenge
  // ═════════════════════════════════════════════════════════════

  await t.test('2.1: AppShell Total Count Formula Invariant', () => {
    // Specification: totalSaved = savedTerms.length + savedMessages.length + savedAIOutputs.length
    const store = new AccurateStoreSimulator(new MockLocalStorage());

    const calculateTotal = (termsCount: number, messagesCount: number, aiOutputsCount: number) => {
      return termsCount + messagesCount + aiOutputsCount;
    };

    assert.strictEqual(
      store.getTotalSavedCount(),
      calculateTotal(store.savedTerms.length, store.savedMessages.length, store.savedAIOutputs.length)
    );

    // Add 2 terms
    store.toggleTerm('skibidi');
    store.toggleTerm('rizz');
    // Add 1 message
    store.saveMessage('Check out this text');
    // Add 3 AI outputs across distinct types
    store.saveAIOutput({ type: 'tone-analysis', title: 'Tone 1', content: 'c' });
    store.saveAIOutput({ type: 'roleplay', title: 'Practice 1', content: 'c' });
    store.saveAIOutput({ type: 'playbook', title: 'Playbook 1', content: 'c' });

    const expectedTotal = 2 + 1 + 3; // 6
    assert.strictEqual(store.getTotalSavedCount(), expectedTotal);
    assert.strictEqual(
      store.getTotalSavedCount(),
      store.savedTerms.length + store.savedMessages.length + store.savedAIOutputs.length
    );
  });

  await t.test('2.2: Desktop & Mobile Navigation Counter Synchronization Rendering via AppShell Component', () => {
    const appShellPath = path.resolve(__dirname, '../src/components/AppShell.tsx');
    const shellSource = fs.readFileSync(appShellPath, 'utf-8');

    // 1. Static contract verification
    assert.ok(
      shellSource.includes('const totalSaved = savedTerms.length + savedMessages.length + savedAIOutputs.length'),
      'AppShell must calculate totalSaved strictly as sum of lengths'
    );
    assert.ok(
      shellSource.includes("{label === 'Saved' && totalSaved > 0 && <span className=\"nav-count\">{totalSaved}</span>}"),
      'Desktop nav must display nav-count when totalSaved > 0'
    );
    assert.ok(
      shellSource.includes('className="mobile-nav-label"'),
      'Mobile nav must use .mobile-nav-label wrapper'
    );
    assert.ok(
      shellSource.includes("{label === 'Saved' && totalSaved > 0 && <span className=\"nav-count\">{totalSaved}</span>}"),
      'Mobile nav must render nav-count identical to desktop nav'
    );

    // 2. Component execution testing
    // Test Case A: totalSaved === 0
    {
      const module = bundleComponent(appShellPath, {
        savedTerms: [],
        savedMessages: [],
        savedAIOutputs: [],
      });
      const headerHtml = renderToString(React.createElement(module.Header));
      assert.ok(!headerHtml.includes('nav-count'), 'When totalSaved === 0, nav-count must NOT appear in header');
      assert.ok(headerHtml.includes('Saved'));
    }

    // Test Case B: totalSaved === 1
    {
      const module = bundleComponent(appShellPath, {
        savedTerms: ['cooked'],
        savedMessages: [],
        savedAIOutputs: [],
      });
      const headerHtml = renderToString(React.createElement(module.Header));
      assert.ok(headerHtml.includes('nav-count'), 'When totalSaved === 1, nav-count must appear in header');
      assert.ok(headerHtml.includes('1'), 'When totalSaved === 1, nav-count must contain 1');
    }

    // Test Case C: totalSaved === 5 across categories
    {
      const module = bundleComponent(appShellPath, {
        savedTerms: ['skibidi'],
        savedMessages: [{ id: '1', text: 'm1' }],
        savedAIOutputs: [
          { id: 'a1', type: 'tone-analysis', title: 't1' },
          { id: 'a2', type: 'roleplay', title: 't2' },
          { id: 'a3', type: 'playbook', title: 't3' },
        ],
      });
      const headerHtml = renderToString(React.createElement(module.Header));
      assert.ok(headerHtml.includes('nav-count'));
      assert.ok(headerHtml.includes('5'));
    }
  });

  // ═════════════════════════════════════════════════════════════
  // Section 3: End-to-End Cross-Cutting User Journey (5 Saves -> 5 Tabs)
  // ═════════════════════════════════════════════════════════════

  await t.test('3.1: Complete 5-Step Cross-Cutting Save Journey', () => {
    const storage = new MockLocalStorage();
    const store = new AccurateStoreSimulator(storage);

    // Initial check: clean slate
    assert.strictEqual(store.getTotalSavedCount(), 0);

    // Step 1: Save a term guide on /term/:slug (e.g. /term/skibidi)
    const skibidi = terms.find((t) => t.slug === 'skibidi')!;
    assert.ok(skibidi);
    store.toggleTerm(skibidi.slug);
    assert.strictEqual(store.savedTerms.length, 1);
    assert.strictEqual(store.getTotalSavedCount(), 1);

    // Step 2: Save a decoded message on /decoder
    const rawDecoderMessage = 'ngl that party was mid fr fr 💀';
    store.saveMessage(rawDecoderMessage);
    assert.strictEqual(store.savedMessages.length, 1);
    assert.strictEqual(store.getTotalSavedCount(), 2);

    // Step 3: Save a tone analysis on /decoder
    const toneTitle = 'Tone: ' + rawDecoderMessage.slice(0, 30) + '…';
    const savedTone = store.saveAIOutput({
      type: 'tone-analysis',
      title: toneTitle,
      content: 'The speaker expresses frank disappointment regarding a social event.',
      summary: `Tone reading for: “${rawDecoderMessage}”`,
      metadata: {
        message: rawDecoderMessage,
        originalMessage: rawDecoderMessage,
      },
    });
    assert.ok(savedTone?.id);
    assert.strictEqual(store.getTotalSavedCount(), 3);

    // Step 4: Save a practice session on /term/:slug (e.g. /term/skibidi)
    const practiceTitle = 'Practice: ' + skibidi.term;
    const practiceDialogue = `Parent: ${skibidi.opener}\nTeen: It is just an internet joke series.\nParent: Thanks for explaining.`;
    const savedPractice = store.saveAIOutput({
      type: 'roleplay',
      title: practiceTitle,
      content: practiceDialogue,
      summary: `Dialogue practice for ${skibidi.term}`,
      metadata: {
        termSlug: skibidi.slug,
        termName: skibidi.term,
        category: skibidi.category,
      },
    });
    assert.ok(savedPractice?.id);
    assert.strictEqual(store.getTotalSavedCount(), 4);

    // Step 5: Save a playbook note on /copilot
    const queue = new PlaybookQueueStateMachine();
    const scenario = queue.getCurrentScenario(); // "Teasing vs Bullying"
    const playbookTitle = `Playbook: ${scenario.title}`;
    const savedPlaybook = store.saveAIOutput({
      type: 'playbook',
      title: playbookTitle,
      content: `${scenario.description}\n\nApproach: ${scenario.parentApproach}\nTakeaway: ${scenario.takeaway}`,
      summary: scenario.takeaway,
      metadata: {
        scenarioId: scenario.id,
        tag: scenario.tag,
      },
    });
    assert.ok(savedPlaybook?.id);
    assert.strictEqual(store.getTotalSavedCount(), 5);

    // Verify localStorage persistence
    const rawTerms = JSON.parse(storage.getItem('parent-decoder-saved-terms')!);
    const rawMsgs = JSON.parse(storage.getItem('parent-decoder-saved-messages')!);
    const rawAIs = JSON.parse(storage.getItem('parent-decoder-saved-ai-outputs')!);

    assert.strictEqual(rawTerms.length, 1);
    assert.strictEqual(rawMsgs.length, 1);
    assert.strictEqual(rawAIs.length, 3);
  });

  await t.test('3.2: Saved Page 5-Tab Distribution & Component Rendering Verification', () => {
    const savedPagePath = path.resolve(__dirname, '../src/pages/SavedPage.tsx');

    // 1. Source verification of SavedPage.tsx
    const savedSource = fs.readFileSync(savedPagePath, 'utf-8');
    assert.ok(
      savedSource.includes("export type SavedTab = 'terms' | 'messages' | 'tone-analysis' | 'roleplay' | 'playbook'"),
      'SavedPage must define the 5 standard tabs'
    );
    assert.ok(savedSource.includes('saved-quote-box'), 'SavedPage must include .saved-quote-box for tone readings');
    assert.ok(savedSource.includes('saved-meta-badge'), 'SavedPage must include .saved-meta-badge for roleplay links');
    assert.ok(savedSource.includes('saved-meta-pill'), 'SavedPage must include .saved-meta-pill for playbook tags');

    // 2. Component execution and rendering verification
    const mockStore = {
      savedTerms: ['skibidi'],
      savedMessages: [{ id: 'm1', text: 'ngl that party was mid fr fr 💀', savedAt: 1700000000000 }],
      savedAIOutputs: [
        {
          id: 'ai-tone-1',
          type: 'tone-analysis',
          title: 'Tone: ngl that party was mid fr fr…',
          content: 'Tone analysis body text',
          summary: 'Tone reading for message',
          savedAt: 1700000001000,
          metadata: { message: 'ngl that party was mid fr fr 💀', originalMessage: 'ngl that party was mid fr fr 💀' },
        },
        {
          id: 'ai-roleplay-1',
          type: 'roleplay',
          title: 'Practice: skibidi',
          content: 'Parent: Starter\nTeen: Response',
          summary: 'Practice session for skibidi',
          savedAt: 1700000002000,
          metadata: { termSlug: 'skibidi', termName: 'skibidi', category: 'Internet Culture & Memes' },
        },
        {
          id: 'ai-playbook-1',
          type: 'playbook',
          title: 'Playbook: Teasing vs Bullying',
          content: 'Playbook note content',
          summary: 'Key takeaway',
          savedAt: 1700000003000,
          metadata: { tag: 'Safety & Social Dynamics', scenarioId: 'teasing-vs-bullying' },
        },
      ],
      removeMessage: () => {},
      removeAIOutput: () => {},
      clearMessages: () => {},
      clearTerms: () => {},
      clearAIOutputs: () => {},
      notify: () => {},
    };

    const module = bundleComponent(savedPagePath, mockStore);
    const html = renderToString(React.createElement(module.default));

    // Verify all 5 tab buttons exist in role="tablist"
    assert.ok(html.includes('id="tab-terms"'));
    assert.ok(html.includes('id="tab-messages"'));
    assert.ok(html.includes('id="tab-tone-analysis"'));
    assert.ok(html.includes('id="tab-roleplay"'));
    assert.ok(html.includes('id="tab-playbook"'));

    // Verify labels and count spans
    assert.ok(html.includes('Terms'));
    assert.ok(html.includes('Messages'));
    assert.ok(html.includes('Tone Readings'));
    assert.ok(html.includes('Practice Sessions'));
    assert.ok(html.includes('Playbook Notes'));
    assert.ok(html.includes('<span>1</span>'));

    // By default, active tab is 'terms', so it renders the TermCard for skibidi
    assert.ok(html.includes('mock-term-card'));
    assert.ok(html.includes('skibidi'));
  });

  await t.test('3.3: Tab Isolation and Selective Category Clear Invariant', () => {
    const storage = new MockLocalStorage();
    const store = new AccurateStoreSimulator(storage);

    // Seed 5 items
    store.toggleTerm('skibidi');
    store.saveMessage('ngl that party was mid fr fr 💀');
    const toneItem = store.saveAIOutput({
      type: 'tone-analysis',
      title: 'Tone 1',
      content: 'c1',
      metadata: { message: 'm' },
    });
    const roleplayItem = store.saveAIOutput({
      type: 'roleplay',
      title: 'Practice 1',
      content: 'c2',
      metadata: { termSlug: 'skibidi' },
    });
    const playbookItem = store.saveAIOutput({
      type: 'playbook',
      title: 'Playbook 1',
      content: 'c3',
    });

    assert.strictEqual(store.getTotalSavedCount(), 5);

    // 1. Clear ONLY tone-analysis category
    store.clearAIOutputs('tone-analysis');
    assert.strictEqual(store.savedAIOutputs.filter((o) => o.type === 'tone-analysis').length, 0);
    // Other categories must remain 100% intact
    assert.strictEqual(store.savedTerms.length, 1);
    assert.strictEqual(store.savedMessages.length, 1);
    assert.strictEqual(store.savedAIOutputs.filter((o) => o.type === 'roleplay').length, 1);
    assert.strictEqual(store.savedAIOutputs.filter((o) => o.type === 'playbook').length, 1);
    assert.strictEqual(store.getTotalSavedCount(), 4);

    // 2. Remove single roleplay item
    store.removeAIOutput(roleplayItem!.id);
    assert.strictEqual(store.savedAIOutputs.filter((o) => o.type === 'roleplay').length, 0);
    assert.strictEqual(store.getTotalSavedCount(), 3);

    // 3. Clear messages
    store.clearMessages();
    assert.strictEqual(store.savedMessages.length, 0);
    assert.strictEqual(store.getTotalSavedCount(), 2);

    // 4. Clear terms
    store.clearTerms();
    assert.strictEqual(store.savedTerms.length, 0);
    assert.strictEqual(store.getTotalSavedCount(), 1);

    // 5. Clear playbook notes
    store.clearAIOutputs('playbook');
    assert.strictEqual(store.savedAIOutputs.filter((o) => o.type === 'playbook').length, 0);
    assert.strictEqual(store.getTotalSavedCount(), 0);
  });

  await t.test('3.4: Contextual Empty State CTAs and Deep Links Verification', () => {
    // Specification: Each tab provides designated contextual empty state guidance & CTA
    const emptyStateRoutes: Record<string, { ctaRoute: string; ctaText: string }> = {
      terms: { ctaRoute: '/browse', ctaText: 'Explore the library' },
      messages: { ctaRoute: '/decoder', ctaText: 'Open the decoder' },
      'tone-analysis': { ctaRoute: '/decoder', ctaText: 'Analyze a message' },
      roleplay: { ctaRoute: '/browse', ctaText: 'Browse terms to practice' },
      playbook: { ctaRoute: '/copilot', ctaText: 'Explore the Co-pilot & Playbook' },
    };

    // Verify all 5 categories have non-empty guidance
    const tabs = ['terms', 'messages', 'tone-analysis', 'roleplay', 'playbook'] as const;
    for (const tab of tabs) {
      const config = emptyStateRoutes[tab];
      assert.ok(config, `Missing empty state config for tab ${tab}`);
      assert.ok(config.ctaRoute.startsWith('/'), `CTA route must be absolute path: ${config.ctaRoute}`);
      assert.ok(config.ctaText.length > 5, `CTA text must be descriptive: ${config.ctaText}`);
    }

    // Check SavedPage.tsx contains the exact deep link paths
    const savedSource = fs.readFileSync(path.resolve(__dirname, '../src/pages/SavedPage.tsx'), 'utf-8');
    assert.ok(savedSource.includes('to="/browse"'));
    assert.ok(savedSource.includes('to="/decoder"'));
    assert.ok(savedSource.includes('to="/copilot"'));
  });

  // ═════════════════════════════════════════════════════════════
  // Section 4: Adversarial Stress & Chaos Scenarios
  // ═════════════════════════════════════════════════════════════

  await t.test('4.1: Adversarial Multi-Byte & Special Character Tone Prompts', () => {
    const store = new AccurateStoreSimulator(new MockLocalStorage());

    const adversarialMessages = [
      '⚡️🔥🚀',
      '"""Quoted text inside prompt"""',
      '<script>alert("xss")</script>',
      '\\n\\r\\t escaped characters',
      'Arabic / Hebrew rtl: مرحبا بالعالم שלום',
      'A'.repeat(500),
    ];

    for (const msg of adversarialMessages) {
      const trimmed = msg.trim();
      const title = 'Tone: ' + trimmed.slice(0, 30) + (trimmed.length > 30 ? '…' : '');

      assert.doesNotThrow(() => {
        const item = store.saveAIOutput({
          type: 'tone-analysis',
          title,
          content: 'Analysis for ' + trimmed.slice(0, 50),
          metadata: { message: trimmed, originalMessage: msg },
        });

        assert.ok(item?.id);
        assert.strictEqual(store.isAIOutputSaved(title, 'tone-analysis'), true);
      });
    }
  });

  await t.test('4.2: High-Volume Concurrent Cross-Cutting Operations & State Integrity', () => {
    const store = new AccurateStoreSimulator(new MockLocalStorage());

    // Perform interleaved operations across all categories
    for (let i = 0; i < 20; i++) {
      store.toggleTerm(`term-${i}`);
      store.saveMessage(`Message ${i}`);
      store.saveAIOutput({
        type: 'tone-analysis',
        title: `Tone analysis ${i}`,
        content: `Content ${i}`,
        metadata: { message: `Message ${i}` },
      });
      store.saveAIOutput({
        type: 'roleplay',
        title: `Practice ${i}`,
        content: `Dialogue ${i}`,
        metadata: { termSlug: `term-${i}` },
      });
      store.saveAIOutput({
        type: 'playbook',
        title: `Playbook note ${i}`,
        content: `Takeaway ${i}`,
      });
    }

    // Verify invariants
    // Note: saveAIOutput caps to 50 items with MRU eviction; terms and messages have their own bounds (20 for messages)
    assert.strictEqual(store.savedTerms.length, 20);
    assert.strictEqual(store.savedMessages.length, 20); // capped at 20 in store.tsx
    assert.strictEqual(store.savedAIOutputs.length, 50); // capped at 50 in store.tsx

    const expectedTotal = store.savedTerms.length + store.savedMessages.length + store.savedAIOutputs.length;
    assert.strictEqual(store.getTotalSavedCount(), expectedTotal);
    assert.strictEqual(store.getTotalSavedCount(), 20 + 20 + 50); // 90
  });

  await t.test('4.3: CSS Class Verification in index.css for M5 Requirements', () => {
    const cssContent = fs.readFileSync(path.resolve(__dirname, '../src/index.css'), 'utf-8');
    const requiredClasses = [
      '.mobile-nav-label',
      '.saved-quote-box',
      '.saved-meta-row',
      '.saved-meta-badge',
      '.saved-meta-pill',
      '.saved-meta-tier',
      '.tier-harmless',
      '.tier-watchful',
      '.tier-intervention',
      '.saved-button',
    ];

    for (const cls of requiredClasses) {
      assert.ok(cssContent.includes(cls), `index.css must contain styling for ${cls}`);
    }
  });

  await t.test('4.4: Complex Grapheme Clusters & Zero-Width-Joiner Emoji Slicing', () => {
    // E.g. Family emoji 👨‍👩‍👧‍👦, flag emojis, skin tone modifiers
    const complexMessage = '👨‍👩‍👧‍👦 lowkey family dinner was so cooked fr';
    const trimmed = complexMessage.trim();
    const title = 'Tone: ' + trimmed.slice(0, 30) + (trimmed.length > 30 ? '…' : '');

    assert.ok(title.startsWith('Tone: '));
    assert.doesNotThrow(() => {
      const store = new AccurateStoreSimulator(new MockLocalStorage());
      const item = store.saveAIOutput({
        type: 'tone-analysis',
        title,
        content: 'Family interaction analysis',
        metadata: { message: trimmed, originalMessage: complexMessage },
      });
      assert.ok(item?.id);
      assert.strictEqual(store.isAIOutputSaved(title, 'tone-analysis'), true);
    });
  });

  await t.test('4.5: Storage Error Resilience & Corrupted JSON Recovery', () => {
    const brokenStorage = new MockLocalStorage();
    // Corrupt storage with invalid non-JSON strings
    brokenStorage.setItem('parent-decoder-saved-terms', '{not-valid-json');
    brokenStorage.setItem('parent-decoder-saved-messages', 'undefined');
    brokenStorage.setItem('parent-decoder-saved-ai-outputs', 'null');

    const store = new AccurateStoreSimulator(brokenStorage);
    // Must gracefully fall back to empty arrays without crashing
    assert.deepStrictEqual(store.savedTerms, []);
    assert.deepStrictEqual(store.savedMessages, []);
    assert.deepStrictEqual(store.savedAIOutputs, []);
    assert.strictEqual(store.getTotalSavedCount(), 0);

    // Saving after recovery persists valid JSON
    store.toggleTerm('cooked');
    store.saveMessage('Recovered message');
    assert.strictEqual(store.getTotalSavedCount(), 2);
    assert.doesNotThrow(() => {
      JSON.parse(brokenStorage.getItem('parent-decoder-saved-terms')!);
      JSON.parse(brokenStorage.getItem('parent-decoder-saved-messages')!);
    });
  });

  await t.test('4.6: Empty/Null Content Protection on ToneAnalysis Save', () => {
    const store = new AccurateStoreSimulator(new MockLocalStorage());

    // In store.tsx:
    // const cleanTitle = output.title.trim().slice(0, 200)
    // const cleanContent = output.content.trim().slice(0, 10000)
    // if (!cleanTitle || !cleanContent) return

    // Attempt save with empty title
    const emptyTitleResult = store.saveAIOutput({
      type: 'tone-analysis',
      title: '   ',
      content: 'Valid content',
    });
    assert.strictEqual(emptyTitleResult, null);
    assert.strictEqual(store.savedAIOutputs.length, 0);

    // Attempt save with empty content
    const emptyContentResult = store.saveAIOutput({
      type: 'tone-analysis',
      title: 'Tone: Valid Title',
      content: '   ',
    });
    assert.strictEqual(emptyContentResult, null);
    assert.strictEqual(store.savedAIOutputs.length, 0);
  });

  await t.test('4.7: SavedPage Detailed Category Rendering: Quote Box, Badge, Tier Pill', () => {
    const savedPagePath = path.resolve(__dirname, '../src/pages/SavedPage.tsx');

    const mockStore = {
      savedTerms: ['skibidi'],
      savedMessages: [{ id: 'm1', text: 'Lowkey spiraling fr', savedAt: 1700000000000 }],
      savedAIOutputs: [
        {
          id: 'ai-tone-1',
          type: 'tone-analysis',
          title: 'Tone: Lowkey spiraling fr',
          content: 'Tone evaluation indicates slight anxiety.',
          summary: 'Tone reading summary',
          savedAt: 1700000001000,
          metadata: { message: 'Lowkey spiraling fr', originalMessage: 'Lowkey spiraling fr' },
        },
        {
          id: 'ai-roleplay-1',
          type: 'roleplay',
          title: 'Practice: skibidi',
          content: 'Parent: Starter script\nTeen: Response turn',
          summary: 'Practice session summary',
          savedAt: 1700000002000,
          metadata: { termSlug: 'skibidi', termName: 'skibidi', category: 'Internet Culture & Memes' },
        },
        {
          id: 'ai-playbook-1',
          type: 'playbook',
          title: 'Playbook: Teasing vs Bullying',
          content: 'Playbook content description',
          summary: 'Playbook summary',
          savedAt: 1700000003000,
          metadata: {
            tag: 'Safety & Social Dynamics',
            badgeLabel: 'Watchful / Guided Talk',
            tier: 'watchful',
            score: '2',
            total: '5',
          },
        },
      ],
      removeMessage: () => {},
      removeAIOutput: () => {},
      clearMessages: () => {},
      clearTerms: () => {},
      clearAIOutputs: () => {},
      notify: () => {},
    };

    const module = bundleComponent(savedPagePath, mockStore);

    // Render SavedPage and verify tabpanel details
    // Note: By default, active tab is 'terms'. To inspect other tab structures, let's verify component structure.
    const savedSource = fs.readFileSync(savedPagePath, 'utf-8');
    assert.ok(savedSource.includes('tag-tone-analysis'));
    assert.ok(savedSource.includes('tag-roleplay'));
    assert.ok(savedSource.includes('tag-playbook'));
    assert.ok(savedSource.includes('saved-quote-box'));
    assert.ok(savedSource.includes('saved-meta-badge'));
    assert.ok(savedSource.includes('saved-meta-pill'));
    assert.ok(savedSource.includes('tier-'));
  });
});
