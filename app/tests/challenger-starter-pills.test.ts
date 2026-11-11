import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─────────────────────────────────────────────────────────────
// 1. Headless DOM Mock Setup for React 19
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
  public focusCount: number = 0;
  public blurCount: number = 0;
  public listeners: Record<string, Function[]> = {};

  constructor(tag = 'div') {
    this.nodeName = tag.toUpperCase();
    this.tagName = tag.toUpperCase();
    this.type = tag === 'button' ? 'submit' : '';
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
    this.focusCount++;
  }

  blur() {
    this.focused = false;
    this.blurCount++;
  }

  scrollIntoView() {}
}

// Global DOM fixtures initialized BEFORE React imports
(globalThis as any).Element = MockElement;
(globalThis as any).HTMLElement = MockElement;
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
(globalThis as any).window.setTimeout = () => 1;
(globalThis as any).window.clearTimeout = () => {};
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

// Dynamic import of React & ReactDOMClient after DOM is ready
const React = await import('react');
const ReactDOMClient = await import('react-dom/client');

// ─────────────────────────────────────────────────────────────
// 2. Transpile and Load AgentChat Component
// ─────────────────────────────────────────────────────────────

interface AgentChatTestHarness {
  component: any;
  DEFAULT_STARTER_PROMPTS: readonly string[];
  STARTER_PILLS: readonly string[];
  mount: (agentOverrides?: any, props?: any) => {
    container: MockElement;
    root: any;
    getPills: () => { element: MockElement; props: any; prompt: string }[];
    getTextarea: () => { element: MockElement; props: any };
    getForm: () => { element: MockElement; props: any };
    getSendButton: () => { element: MockElement; props: any } | null;
    clickPill: (index: number) => void;
    keyDownPill: (index: number, key: string) => { defaultPrevented: boolean };
    submitForm: () => void;
    getSentCalls: () => string[];
    unmount: () => void;
  };
}

function createHarness(): AgentChatTestHarness {
  const filePath = path.resolve(__dirname, '../src/components/agent/AgentChat.tsx');
  const rawCode = fs.readFileSync(filePath, 'utf8');
  const transformed = esbuild.transformSync(rawCode, { loader: 'tsx', format: 'cjs' });

  let activeAgentMock: any = null;
  const sentMessages: string[] = [];

  const customRequire = (id: string) => {
    if (id === 'react') return React;
    if (id === 'lucide-react') {
      return {
        ArrowRight: () => React.createElement('span', null, 'ArrowRight'),
        Clipboard: () => React.createElement('span', null, 'Clipboard'),
        RotateCcw: () => React.createElement('span', null, 'RotateCcw'),
        Sparkles: () => React.createElement('span', null, 'Sparkles'),
        Square: () => React.createElement('span', null, 'Square'),
      };
    }
    if (id === '../../lib/ai/useAgent') {
      return {
        useAgent: () =>
          activeAgentMock || {
            status: { engine: 'local', ready: true },
            messages: [],
            isStreaming: false,
            streamingText: '',
            tokenInfo: { used: 0, max: 1000 },
            initialize: () => {},
            send: (text: string) => {
              sentMessages.push(text);
            },
            reset: () => {},
            stop: () => {},
          },
      };
    }
    if (id === './PrivacyBadge') {
      return { PrivacyBadge: () => React.createElement('div', { className: 'privacy-badge-stub' }) };
    }
    if (id === './StreamingText') {
      return { StreamingText: () => React.createElement('span', null, 'StreamingTextStub') };
    }
    if (id === '../../store') {
      return {
        copyText: async () => {},
        useApp: () => ({ notify: () => {} }),
      };
    }
    if (id === './ChromeAISetupGuide') {
      return {
        ChromeAISetupGuide: () => React.createElement('div', { className: 'chrome-setup-guide-stub' }),
      };
    }
    throw new Error(`Unhandled mock require: ${id}`);
  };

  const mod: { exports: any } = { exports: {} };
  const fn = new Function('React', 'require', 'exports', 'module', transformed.code);
  fn(React, customRequire, mod.exports, mod);

  const { AgentChat, DEFAULT_STARTER_PROMPTS, STARTER_PILLS } = mod.exports;

  function findNodes(node: MockElement, matchFn: (n: MockElement) => boolean): MockElement[] {
    let result: MockElement[] = [];
    if (matchFn(node)) result.push(node);
    if (node.childNodes) {
      for (const child of node.childNodes) {
        if (child instanceof MockElement) {
          result = result.concat(findNodes(child, matchFn));
        }
      }
    }
    return result;
  }

  function getReactProps(element: MockElement | undefined | null): any {
    if (!element) return null;
    const key = Object.keys(element).find((k) => k.startsWith('__reactProps'));
    return key ? (element as any)[key] : null;
  }

  const mount = (agentOverrides = {}, props = {}) => {
    sentMessages.length = 0;
    activeAgentMock = {
      status: { engine: 'local', ready: true },
      messages: [],
      isStreaming: false,
      streamingText: '',
      tokenInfo: { used: 0, max: 1000 },
      initialize: () => {},
      send: (t: string) => {
        sentMessages.push(t);
      },
      reset: () => {},
      stop: () => {},
      ...agentOverrides,
    };

    const container = new MockElement('div');
    container.ownerDocument = mockDocument;
    const root = ReactDOMClient.createRoot(container as any);

    React.act(() => {
      root.render(
        React.createElement(AgentChat, {
          systemPrompt: 'You are a parenting co-pilot test harness',
          placeholder: 'Type your message…',
          ...props,
        })
      );
    });

    const getPills = () => {
      const buttonNodes = findNodes(
        container,
        (n) => n.tagName === 'BUTTON' && n.attributes.class?.includes('starter-pill')
      );
      return buttonNodes.map((el) => {
        const p = getReactProps(el);
        return {
          element: el,
          props: p,
          prompt: el.attributes.title || (typeof p?.children === 'string' ? p.children : ''),
        };
      });
    };

    const getTextarea = () => {
      const ta = findNodes(container, (n) => n.tagName === 'TEXTAREA')[0];
      return { element: ta, props: getReactProps(ta) };
    };

    const getForm = () => {
      const form = findNodes(container, (n) => n.tagName === 'FORM')[0];
      return { element: form, props: getReactProps(form) };
    };

    const getSendButton = () => {
      const btns = findNodes(
        container,
        (n) => n.tagName === 'BUTTON' && (n.attributes.type === 'submit' || n.type === 'submit')
      );
      if (btns.length === 0) return null;
      return { element: btns[0], props: getReactProps(btns[0]) };
    };

    const clickPill = (index: number) => {
      const pills = getPills();
      assert.ok(pills[index], `Pill at index ${index} must exist to click`);
      React.act(() => {
        pills[index].props.onClick();
      });
    };

    const keyDownPill = (index: number, key: string) => {
      const pills = getPills();
      assert.ok(pills[index], `Pill at index ${index} must exist for keydown`);
      let prevented = false;
      const fakeEvent = {
        key,
        preventDefault: () => {
          prevented = true;
        },
      };
      React.act(() => {
        pills[index].props.onKeyDown(fakeEvent);
      });
      return { defaultPrevented: prevented };
    };

    const submitForm = () => {
      const form = getForm();
      assert.ok(form.element, 'Form must exist to submit');
      let prevented = false;
      React.act(() => {
        form.props.onSubmit({
          preventDefault: () => {
            prevented = true;
          },
        });
      });
    };

    const unmount = () => {
      React.act(() => {
        root.unmount();
      });
    };

    return {
      container,
      root,
      getPills,
      getTextarea,
      getForm,
      getSendButton,
      clickPill,
      keyDownPill,
      submitForm,
      getSentCalls: () => [...sentMessages],
      unmount,
    };
  };

  return {
    component: AgentChat,
    DEFAULT_STARTER_PROMPTS,
    STARTER_PILLS,
    mount,
  };
}

const harness = createHarness();

// ─────────────────────────────────────────────────────────────
// Test Suite: Starter Pills Empirical Challenge
// ─────────────────────────────────────────────────────────────

test('Challenger M2_2: Starter Pills Stress & Invariant Verification Suite', async (t) => {
  // ─────────────────────────────────────────────────────────
  // Suite 1: Static Contract & Corpus Invariants
  // ─────────────────────────────────────────────────────────

  await t.test('1.1: DEFAULT_STARTER_PROMPTS export and length verification', () => {
    assert.ok(Array.isArray(harness.DEFAULT_STARTER_PROMPTS), 'DEFAULT_STARTER_PROMPTS must be an array');
    assert.strictEqual(harness.DEFAULT_STARTER_PROMPTS.length, 5, 'Must contain exactly 5 starter prompts');
    assert.strictEqual(
      harness.STARTER_PILLS,
      harness.DEFAULT_STARTER_PROMPTS,
      'STARTER_PILLS must be an exact alias export of DEFAULT_STARTER_PROMPTS'
    );
  });

  await t.test('1.2: Exact character-for-character check on all 3 required prompts', () => {
    const requiredPrompts = [
      "My 12-year-old was called 'cooked' on Discord—how worried should I be?",
      "Check if my text asking them to do dishes sounds passive-aggressive",
      "How do I ask about 'plug 🔌' without sounding like a cop?",
    ] as const;

    for (const prompt of requiredPrompts) {
      assert.ok(
        harness.DEFAULT_STARTER_PROMPTS.includes(prompt),
        `Required prompt "${prompt}" must exist in DEFAULT_STARTER_PROMPTS`
      );
    }

    assert.strictEqual(
      harness.DEFAULT_STARTER_PROMPTS[0],
      "My 12-year-old was called 'cooked' on Discord—how worried should I be?"
    );
    assert.strictEqual(
      harness.DEFAULT_STARTER_PROMPTS[1],
      "Check if my text asking them to do dishes sounds passive-aggressive"
    );
    assert.strictEqual(
      harness.DEFAULT_STARTER_PROMPTS[2],
      "How do I ask about 'plug 🔌' without sounding like a cop?"
    );
  });

  await t.test('1.3: Unicode, emoji and quote fidelity in "plug 🔌" prompt', () => {
    const plugPrompt = harness.DEFAULT_STARTER_PROMPTS[2];
    assert.ok(plugPrompt.includes('🔌'), 'Must contain the electrical plug emoji');
    // Unicode code point verification
    const codePoints = Array.from(plugPrompt).map((c) => c.codePointAt(0)!);
    assert.ok(codePoints.includes(0x1f50c), 'Must contain Unicode code point 0x1F50C (Electric Plug)');

    // Ensure single quotes are standard ASCII 0x27 quotes
    assert.ok(plugPrompt.includes("'plug 🔌'"), 'Must contain single ASCII quotes enclosing plug');

    // JSON roundtrip stability test
    const serialized = JSON.stringify({ prompt: plugPrompt });
    const parsed = JSON.parse(serialized);
    assert.strictEqual(parsed.prompt, plugPrompt, 'Must survive JSON serialization roundtrip');
  });

  await t.test('1.4: Prompt length bounds check against textarea maxLength (600)', () => {
    for (const prompt of harness.DEFAULT_STARTER_PROMPTS) {
      assert.ok(prompt.length > 10, 'Prompt must not be empty or trivial');
      assert.ok(prompt.length <= 600, `Prompt "${prompt.slice(0, 20)}..." exceeds textarea maxLength 600`);
    }
  });

  // ─────────────────────────────────────────────────────────
  // Suite 2: Component Structure & Accessibility Invariants
  // ─────────────────────────────────────────────────────────

  await t.test('2.1: DOM region, tray group, and header semantics', () => {
    const mounted = harness.mount();
    try {
      const pills = mounted.getPills();
      assert.strictEqual(pills.length, 5, 'Must render exactly 5 pill buttons by default');

      // Check button type attributes
      for (const [idx, pill] of pills.entries()) {
        assert.strictEqual(
          pill.props.type,
          'button',
          `Pill ${idx} must explicitly have type="button" to prevent form submission`
        );
        assert.strictEqual(pill.element.attributes.type, 'button', `Pill ${idx} DOM attribute type must be "button"`);
        assert.strictEqual(pill.props.className, 'starter-pill', `Pill ${idx} must have starter-pill className`);
        assert.strictEqual(pill.props.title, pill.prompt, `Pill ${idx} title must equal prompt text`);
      }
    } finally {
      mounted.unmount();
    }
  });

  await t.test('2.2: Unavailable AI state does NOT render starter pills', () => {
    const mounted = harness.mount({ status: { engine: 'unavailable', ready: false } });
    try {
      const pills = mounted.getPills();
      assert.strictEqual(pills.length, 0, 'Starter pills must not render when engine is unavailable');
      const textarea = mounted.getTextarea();
      assert.strictEqual(textarea.element, undefined, 'Textarea must not render in unavailable state');
    } finally {
      mounted.unmount();
    }
  });

  await t.test('2.3: Custom starterPrompts prop override and empty array handling', () => {
    const customPrompts = [
      'Custom Prompt A: What is rizzy?',
      'Custom Prompt B: Is skibidi bad?',
    ];
    const mountedCustom = harness.mount({}, { starterPrompts: customPrompts });
    try {
      const pills = mountedCustom.getPills();
      assert.strictEqual(pills.length, 2, 'Should render exactly 2 pills when customPrompts has 2 items');
      assert.strictEqual(pills[0].prompt, customPrompts[0]);
      assert.strictEqual(pills[1].prompt, customPrompts[1]);
    } finally {
      mountedCustom.unmount();
    }

    const mountedEmpty = harness.mount({}, { starterPrompts: [] });
    try {
      const pillsEmpty = mountedEmpty.getPills();
      assert.strictEqual(pillsEmpty.length, 0, 'Should render 0 pills when starterPrompts is empty array');
    } finally {
      mountedEmpty.unmount();
    }
  });

  // ─────────────────────────────────────────────────────────
  // Suite 3: Behavioral Click & Textarea Population
  // ─────────────────────────────────────────────────────────

  await t.test('3.1: Clicking Prompt 1 ("cooked" on Discord) populates textarea exactly', () => {
    const mounted = harness.mount();
    try {
      const expectedPrompt = "My 12-year-old was called 'cooked' on Discord—how worried should I be?";
      assert.strictEqual(mounted.getTextarea().props.value, '', 'Initial textarea must be empty');

      mounted.clickPill(0);

      const updatedTextarea = mounted.getTextarea();
      assert.strictEqual(
        updatedTextarea.props.value,
        expectedPrompt,
        'Clicking Pill 0 must populate exact Discord prompt into textarea'
      );
    } finally {
      mounted.unmount();
    }
  });

  await t.test('3.2: Clicking Prompt 2 (dishes passive-aggressive) populates textarea exactly', () => {
    const mounted = harness.mount();
    try {
      const expectedPrompt = "Check if my text asking them to do dishes sounds passive-aggressive";
      mounted.clickPill(1);

      const updatedTextarea = mounted.getTextarea();
      assert.strictEqual(
        updatedTextarea.props.value,
        expectedPrompt,
        'Clicking Pill 1 must populate exact dishes prompt into textarea'
      );
    } finally {
      mounted.unmount();
    }
  });

  await t.test('3.3: Clicking Prompt 3 ("plug 🔌") populates textarea with emoji intact', () => {
    const mounted = harness.mount();
    try {
      const expectedPrompt = "How do I ask about 'plug 🔌' without sounding like a cop?";
      mounted.clickPill(2);

      const updatedTextarea = mounted.getTextarea();
      assert.strictEqual(
        updatedTextarea.props.value,
        expectedPrompt,
        'Clicking Pill 2 must populate exact plug prompt with emoji into textarea'
      );
      assert.ok(updatedTextarea.props.value.includes('🔌'), 'Textarea value must contain 🔌 emoji');
    } finally {
      mounted.unmount();
    }
  });

  await t.test('3.4: Overwrite behavior: consecutive pill clicks replace rather than append', () => {
    const mounted = harness.mount();
    try {
      const prompt0 = harness.DEFAULT_STARTER_PROMPTS[0];
      const prompt1 = harness.DEFAULT_STARTER_PROMPTS[1];
      const prompt2 = harness.DEFAULT_STARTER_PROMPTS[2];

      // Click pill 0
      mounted.clickPill(0);
      assert.strictEqual(mounted.getTextarea().props.value, prompt0);

      // Click pill 1
      mounted.clickPill(1);
      assert.strictEqual(mounted.getTextarea().props.value, prompt1);
      assert.ok(!mounted.getTextarea().props.value.includes(prompt0), 'Should not retain prior prompt text');

      // Click pill 2
      mounted.clickPill(2);
      assert.strictEqual(mounted.getTextarea().props.value, prompt2);
      assert.ok(!mounted.getTextarea().props.value.includes(prompt1), 'Should not concatenate prompts');
    } finally {
      mounted.unmount();
    }
  });

  await t.test('3.5: User draft overwrite: clicking a pill replaces existing typed draft', () => {
    const mounted = harness.mount();
    try {
      const textarea = mounted.getTextarea();
      // Simulate user typing a draft
      React.act(() => {
        textarea.props.onChange({ target: { value: 'Draft user message before choosing pill' } });
      });

      assert.strictEqual(mounted.getTextarea().props.value, 'Draft user message before choosing pill');

      // Now click pill 2
      mounted.clickPill(2);
      const expectedPrompt = harness.DEFAULT_STARTER_PROMPTS[2];
      assert.strictEqual(mounted.getTextarea().props.value, expectedPrompt);
      assert.ok(!mounted.getTextarea().props.value.includes('Draft user message'));
    } finally {
      mounted.unmount();
    }
  });

  await t.test('3.6: Subsequent user editing: user can append or modify populated prompt', () => {
    const mounted = harness.mount();
    try {
      mounted.clickPill(0);
      const initialPrompt = harness.DEFAULT_STARTER_PROMPTS[0];
      assert.strictEqual(mounted.getTextarea().props.value, initialPrompt);

      // User adds extra context to the prompt
      const modifiedPrompt = initialPrompt + ' Should I talk to their teacher?';
      React.act(() => {
        mounted.getTextarea().props.onChange({ target: { value: modifiedPrompt } });
      });

      assert.strictEqual(mounted.getTextarea().props.value, modifiedPrompt);
    } finally {
      mounted.unmount();
    }
  });

  // ─────────────────────────────────────────────────────────
  // Suite 4: Form Submission Prevention & Button Type Invariants
  // ─────────────────────────────────────────────────────────

  await t.test('4.1: Verify every starter pill button has type="button" and NOT "submit"', () => {
    const mounted = harness.mount();
    try {
      const pills = mounted.getPills();
      for (const [idx, pill] of pills.entries()) {
        assert.strictEqual(
          pill.props.type,
          'button',
          `Pill ${idx} React prop type must be "button"`
        );
        assert.strictEqual(
          pill.element.attributes.type,
          'button',
          `Pill ${idx} DOM attribute type must be "button"`
        );
        assert.notStrictEqual(
          pill.props.type,
          'submit',
          `Pill ${idx} must NEVER have type="submit"`
        );
      }
    } finally {
      mounted.unmount();
    }
  });

  await t.test('4.2: Adversarial form submit isolation: clicking pills NEVER triggers send()', () => {
    const mounted = harness.mount();
    try {
      // Click every pill in sequence
      for (let i = 0; i < 5; i++) {
        mounted.clickPill(i);
        assert.strictEqual(
          mounted.getSentCalls().length,
          0,
          `Clicking pill ${i} must NEVER dispatch form send()`
        );
      }

      // Verify that submitting the form deliberately DOES trigger send()
      mounted.submitForm();
      assert.strictEqual(mounted.getSentCalls().length, 1, 'Submitting form deliberately calls send() once');
      assert.strictEqual(
        mounted.getSentCalls()[0],
        harness.DEFAULT_STARTER_PROMPTS[4],
        'Deliberate submit should send the populated text'
      );
      // And clears the input
      assert.strictEqual(mounted.getTextarea().props.value, '', 'Textarea value resets after send()');
    } finally {
      mounted.unmount();
    }
  });

  await t.test('4.3: Submit button enabled/disabled state synced with pill selection', () => {
    const mounted = harness.mount();
    try {
      const sendButtonInitial = mounted.getSendButton();
      assert.ok(sendButtonInitial, 'Send button must exist');
      assert.strictEqual(sendButtonInitial.props.disabled, true, 'Send button must be disabled when input is empty');

      // Click pill 1
      mounted.clickPill(1);

      const sendButtonAfterPill = mounted.getSendButton();
      assert.strictEqual(
        sendButtonAfterPill?.props.disabled,
        false,
        'Send button must be enabled once a pill is selected'
      );
    } finally {
      mounted.unmount();
    }
  });

  // ─────────────────────────────────────────────────────────
  // Suite 5: Focus Transfer to Textarea
  // ─────────────────────────────────────────────────────────

  await t.test('5.1: Textarea receives focus when any starter pill is clicked', () => {
    const mounted = harness.mount();
    try {
      const textarea = mounted.getTextarea();
      assert.strictEqual(textarea.element.focused, false, 'Textarea initially unfocused');
      assert.strictEqual(textarea.element.focusCount, 0);

      // Click pill 0
      mounted.clickPill(0);
      assert.strictEqual(textarea.element.focused, true, 'Textarea must be focused after clicking pill 0');
      assert.strictEqual(textarea.element.focusCount, 1);

      // Blur manually
      textarea.element.blur();
      assert.strictEqual(textarea.element.focused, false);

      // Click pill 2
      mounted.clickPill(2);
      assert.strictEqual(textarea.element.focused, true, 'Textarea must be focused after clicking pill 2');
      assert.strictEqual(textarea.element.focusCount, 2);
    } finally {
      mounted.unmount();
    }
  });

  // ─────────────────────────────────────────────────────────
  // Suite 6: Disabled State During Streaming & Downloading
  // ─────────────────────────────────────────────────────────

  await t.test('6.1: When isStreaming is true, all starter pills have disabled and aria-disabled', () => {
    const mounted = harness.mount({ isStreaming: true });
    try {
      const pills = mounted.getPills();
      assert.strictEqual(pills.length, 5);

      for (const [idx, pill] of pills.entries()) {
        assert.strictEqual(pill.props.disabled, true, `Pill ${idx} props.disabled must be true during streaming`);
        assert.strictEqual(
          pill.props['aria-disabled'],
          true,
          `Pill ${idx} props['aria-disabled'] must be true during streaming`
        );
      }

      // Verify textarea itself is disabled during streaming
      assert.strictEqual(
        mounted.getTextarea().props.disabled,
        true,
        'Textarea must be disabled during streaming'
      );
    } finally {
      mounted.unmount();
    }
  });

  await t.test('6.2: Clicking a pill during streaming is completely ignored (no text mutation)', () => {
    const mounted = harness.mount({ isStreaming: true });
    try {
      assert.strictEqual(mounted.getTextarea().props.value, '');

      // Attempt to invoke onClick during streaming
      mounted.clickPill(0);
      assert.strictEqual(
        mounted.getTextarea().props.value,
        '',
        'Clicking pill during streaming must NOT mutate input'
      );

      mounted.clickPill(1);
      assert.strictEqual(mounted.getTextarea().props.value, '');
      assert.strictEqual(mounted.getSentCalls().length, 0);
    } finally {
      mounted.unmount();
    }
  });

  await t.test('6.3: When status.downloading is true, all starter pills are disabled', () => {
    const mounted = harness.mount({ status: { engine: 'local', ready: false, downloading: true, progress: 0.5 } });
    try {
      const pills = mounted.getPills();
      for (const [idx, pill] of pills.entries()) {
        assert.strictEqual(
          pill.props.disabled,
          true,
          `Pill ${idx} must be disabled while downloading model`
        );
        assert.strictEqual(
          pill.props['aria-disabled'],
          true,
          `Pill ${idx} must have aria-disabled while downloading model`
        );
      }

      // Attempt click
      mounted.clickPill(2);
      assert.strictEqual(
        mounted.getTextarea().props.value,
        '',
        'Clicking pill while downloading must NOT mutate input'
      );
    } finally {
      mounted.unmount();
    }
  });

  // ─────────────────────────────────────────────────────────
  // Suite 7: Keyboard Accessibility (Enter & Space)
  // ─────────────────────────────────────────────────────────

  await t.test('7.1: Pressing Enter key triggers selection and calls preventDefault', () => {
    const mounted = harness.mount();
    try {
      const res = mounted.keyDownPill(0, 'Enter');
      assert.strictEqual(res.defaultPrevented, true, 'Enter keydown must call preventDefault()');
      assert.strictEqual(
        mounted.getTextarea().props.value,
        harness.DEFAULT_STARTER_PROMPTS[0],
        'Enter keydown must populate prompt text'
      );
      assert.strictEqual(mounted.getTextarea().element.focused, true, 'Enter keydown must transfer focus');
    } finally {
      mounted.unmount();
    }
  });

  await t.test('7.2: Pressing Space key triggers selection and calls preventDefault', () => {
    const mounted = harness.mount();
    try {
      const res = mounted.keyDownPill(1, ' ');
      assert.strictEqual(res.defaultPrevented, true, 'Space keydown must call preventDefault()');
      assert.strictEqual(
        mounted.getTextarea().props.value,
        harness.DEFAULT_STARTER_PROMPTS[1],
        'Space keydown must populate prompt text'
      );
      assert.strictEqual(mounted.getTextarea().element.focused, true, 'Space keydown must transfer focus');
    } finally {
      mounted.unmount();
    }
  });

  await t.test('7.3: Pressing other keys (Escape, Tab, ArrowDown) does NOT trigger selection', () => {
    const mounted = harness.mount();
    try {
      const ignoredKeys = ['Escape', 'Tab', 'ArrowDown', 'ArrowUp', 'a', 'Shift'];
      for (const key of ignoredKeys) {
        const res = mounted.keyDownPill(2, key);
        assert.strictEqual(res.defaultPrevented, false, `Key "${key}" should not prevent default`);
        assert.strictEqual(
          mounted.getTextarea().props.value,
          '',
          `Key "${key}" should not populate textarea`
        );
      }
    } finally {
      mounted.unmount();
    }
  });

  await t.test('7.4: Keyboard navigation while streaming is ignored', () => {
    const mounted = harness.mount({ isStreaming: true });
    try {
      const res = mounted.keyDownPill(0, 'Enter');
      assert.strictEqual(res.defaultPrevented, true);
      assert.strictEqual(
        mounted.getTextarea().props.value,
        '',
        'Enter keydown while streaming must NOT populate textarea'
      );
    } finally {
      mounted.unmount();
    }
  });
});
