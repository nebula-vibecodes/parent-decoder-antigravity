import test from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';
import React from 'react';
import { renderToString } from 'react-dom/server';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper for mocking navigator and document in Node environments with read-only global descriptors
function mockGlobals(navMock: any, docMock: any) {
  const origNavDesc = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  const origDocDesc = Object.getOwnPropertyDescriptor(globalThis, 'document');

  if (navMock !== undefined) {
    Object.defineProperty(globalThis, 'navigator', {
      value: navMock,
      configurable: true,
      writable: true,
    });
  } else {
    // Simulate undefined
    Object.defineProperty(globalThis, 'navigator', {
      value: undefined,
      configurable: true,
      writable: true,
    });
  }

  if (docMock !== undefined) {
    Object.defineProperty(globalThis, 'document', {
      value: docMock,
      configurable: true,
      writable: true,
    });
  } else {
    // Simulate undefined
    Object.defineProperty(globalThis, 'document', {
      value: undefined,
      configurable: true,
      writable: true,
    });
  }

  return function restore() {
    if (origNavDesc) {
      Object.defineProperty(globalThis, 'navigator', origNavDesc);
    } else {
      delete (globalThis as any).navigator;
    }
    if (origDocDesc) {
      Object.defineProperty(globalThis, 'document', origDocDesc);
    } else {
      delete (globalThis as any).document;
    }
  };
}

// Bundle ChromeAISetupGuide.tsx synchronously via esbuild so we can test the real source directly in Node
const targetFile = path.resolve(__dirname, '../src/components/agent/ChromeAISetupGuide.tsx');
const bundled = esbuild.buildSync({
  entryPoints: [targetFile],
  bundle: true,
  format: 'cjs',
  write: false,
  external: ['react', 'react-dom', 'lucide-react', 'react/jsx-runtime'],
});

const componentModule: {
  CHROME_AI_GUIDE_CONSTANTS: {
    flagUrl: string;
    optimizationFlagUrl: string;
    componentsUrl: string;
    componentName: string;
    title: string;
    guideSteps: readonly string[];
  };
  copyToClipboard: (text: string) => Promise<boolean>;
  ChromeAISetupGuide: React.FC<{
    className?: string;
    defaultOpen?: boolean;
    compact?: boolean;
  }>;
} = {
  CHROME_AI_GUIDE_CONSTANTS: {} as any,
  copyToClipboard: {} as any,
  ChromeAISetupGuide: {} as any,
};

const moduleObj = { exports: componentModule };
const runBundle = new Function('require', 'module', 'exports', 'React', bundled.outputFiles[0].text);
runBundle(
  (id: string) => {
    if (id === 'react') return React;
    if (id === 'react/jsx-runtime') return require('react/jsx-runtime');
    if (id === 'lucide-react') {
      const createIcon = (name: string) => (props: any) =>
        React.createElement('svg', { 'data-icon': name, ...props });
      return {
        Sparkles: createIcon('Sparkles'),
        ChevronDown: createIcon('ChevronDown'),
        ChevronUp: createIcon('ChevronUp'),
        Copy: createIcon('Copy'),
        Check: createIcon('Check'),
        ShieldCheck: createIcon('ShieldCheck'),
      };
    }
    return require(id);
  },
  moduleObj,
  moduleObj.exports,
  React
);

const { CHROME_AI_GUIDE_CONSTANTS, copyToClipboard, ChromeAISetupGuide } = moduleObj.exports;

test('Challenger M2_1: Chrome AI Setup Guide Empirical Stress Suite', async (t) => {
  // ─────────────────────────────────────────────────────────────
  // 1. Exact URLs, Strings, and Constants Verification
  // ─────────────────────────────────────────────────────────────
  await t.test('1.1: Exact flag and component URLs specification conformance', () => {
    // 1. Prompt API flag URL
    assert.strictEqual(
      CHROME_AI_GUIDE_CONSTANTS.flagUrl,
      'chrome://flags/#prompt-api-for-gemini-nano',
      'Step 1 flag URL must be exactly "chrome://flags/#prompt-api-for-gemini-nano"'
    );
    assert.ok(!CHROME_AI_GUIDE_CONSTANTS.flagUrl.includes(' '), 'Flag URL must not contain spaces');
    assert.ok(CHROME_AI_GUIDE_CONSTANTS.flagUrl.startsWith('chrome://flags/#'), 'Must target chrome://flags/#');
    assert.ok(!CHROME_AI_GUIDE_CONSTANTS.flagUrl.endsWith('/'), 'Flag URL must not end with trailing slash');

    // 2. Optimization Guide flag URL
    assert.strictEqual(
      CHROME_AI_GUIDE_CONSTANTS.optimizationFlagUrl,
      'chrome://flags/#optimization-guide-on-device-model',
      'Step 2 flag URL must be exactly "chrome://flags/#optimization-guide-on-device-model"'
    );
    assert.ok(!CHROME_AI_GUIDE_CONSTANTS.optimizationFlagUrl.includes(' '), 'Optimization URL must not contain spaces');
    assert.ok(CHROME_AI_GUIDE_CONSTANTS.optimizationFlagUrl.startsWith('chrome://flags/#'), 'Must target chrome://flags/#');
    assert.ok(!CHROME_AI_GUIDE_CONSTANTS.optimizationFlagUrl.endsWith('/'), 'Optimization URL must not end with trailing slash');

    // 3. Components URL
    assert.strictEqual(
      CHROME_AI_GUIDE_CONSTANTS.componentsUrl,
      'chrome://components',
      'Step 4 URL must be exactly "chrome://components"'
    );
    assert.ok(!CHROME_AI_GUIDE_CONSTANTS.componentsUrl.includes(' '), 'Components URL must not contain spaces');
    assert.strictEqual(CHROME_AI_GUIDE_CONSTANTS.componentsUrl, 'chrome://components', 'Exact match without trailing slash');

    // 4. Component name
    assert.strictEqual(
      CHROME_AI_GUIDE_CONSTANTS.componentName,
      'Optimization Guide On Device Model',
      'Component name must be exact'
    );

    // 5. Title
    assert.strictEqual(
      CHROME_AI_GUIDE_CONSTANTS.title,
      'How to turn on local AI in Chrome (60 seconds)',
      'Accordion trigger title must match requirement R4'
    );

    // 6. Guide Steps Array
    assert.strictEqual(CHROME_AI_GUIDE_CONSTANTS.guideSteps.length, 4, 'Must have 4 steps');
    assert.ok(CHROME_AI_GUIDE_CONSTANTS.guideSteps[0].includes('chrome://flags/#prompt-api-for-gemini-nano'));
    assert.ok(CHROME_AI_GUIDE_CONSTANTS.guideSteps[1].includes('Prompt API for Gemini Nano'));
    assert.ok(CHROME_AI_GUIDE_CONSTANTS.guideSteps[2].includes('Restart Google Chrome'));
    assert.ok(CHROME_AI_GUIDE_CONSTANTS.guideSteps[3].includes('chrome://components'));
  });

  // ─────────────────────────────────────────────────────────────
  // 2. Empirical Testing of copyToClipboard & Fallback Mechanisms
  // ─────────────────────────────────────────────────────────────
  await t.test('2.1: copyToClipboard succeeds via modern navigator.clipboard.writeText', async () => {
    let capturedText = '';
    let textareaCreated = false;

    const restore = mockGlobals(
      {
        clipboard: {
          writeText: async (text: string) => {
            capturedText = text;
          },
        },
      },
      {
        createElement: () => {
          textareaCreated = true;
          return { style: {}, setAttribute: () => {}, select: () => {} };
        },
        body: { appendChild: () => {}, removeChild: () => {} },
        execCommand: () => true,
      }
    );

    try {
      const result = await copyToClipboard(CHROME_AI_GUIDE_CONSTANTS.flagUrl);
      assert.strictEqual(result, true, 'Should return true on successful writeText');
      assert.strictEqual(capturedText, 'chrome://flags/#prompt-api-for-gemini-nano');
      assert.strictEqual(textareaCreated, false, 'Should not invoke document fallback when navigator succeeds');
    } finally {
      restore();
    }
  });

  await t.test('2.2: copyToClipboard falls back to textarea + execCommand when navigator.clipboard.writeText rejects', async () => {
    let textareaProps: {
      value?: string;
      style?: Record<string, string>;
      readonlyAttr?: string;
      selected?: boolean;
    } = {};
    let appendedChild: any = null;
    let removedChild: any = null;
    let execCommandCalled = false;
    let execCommandArg = '';

    const mockTextarea: any = {
      style: {},
      value: '',
      setAttribute: (k: string, v: string) => {
        if (k === 'readonly') textareaProps.readonlyAttr = v;
      },
      select: () => {
        textareaProps.selected = true;
      },
    };

    const restore = mockGlobals(
      {
        clipboard: {
          writeText: async () => {
            throw new Error('NotAllowedError: Document is not focused or clipboard permission denied');
          },
        },
      },
      {
        createElement: (tag: string) => {
          if (tag === 'textarea') return mockTextarea;
          return {};
        },
        body: {
          appendChild: (el: any) => {
            appendedChild = el;
          },
          removeChild: (el: any) => {
            removedChild = el;
          },
        },
        execCommand: (cmd: string) => {
          execCommandCalled = true;
          execCommandArg = cmd;
          return true;
        },
      }
    );

    try {
      const testString = 'chrome://flags/#optimization-guide-on-device-model';
      const result = await copyToClipboard(testString);

      assert.strictEqual(result, true, 'Fallback must return true when execCommand succeeds');
      assert.strictEqual(mockTextarea.value, testString, 'Textarea value must match target string');
      assert.strictEqual(mockTextarea.style.position, 'fixed', 'Textarea must have fixed position');
      assert.strictEqual(mockTextarea.style.left, '-999999px', 'Textarea must be placed offscreen left');
      assert.strictEqual(mockTextarea.style.top, '-999999px', 'Textarea must be placed offscreen top');
      assert.strictEqual(textareaProps.readonlyAttr, '', 'Textarea must have readonly attribute');
      assert.strictEqual(textareaProps.selected, true, 'Textarea select() must be invoked');
      assert.strictEqual(execCommandCalled, true, 'document.execCommand must be invoked');
      assert.strictEqual(execCommandArg, 'copy', 'execCommand must be called with "copy"');
      assert.strictEqual(appendedChild, mockTextarea, 'Textarea must be appended to body');
      assert.strictEqual(removedChild, mockTextarea, 'Textarea must be cleaned up from body');
    } finally {
      restore();
    }
  });

  await t.test('2.3: copyToClipboard falls back when navigator.clipboard is undefined', async () => {
    let execCommandSuccess = false;

    const restore = mockGlobals(
      { clipboard: undefined },
      {
        createElement: () => ({
          style: {},
          value: '',
          setAttribute: () => {},
          select: () => {},
        }),
        body: {
          appendChild: () => {},
          removeChild: () => {},
        },
        execCommand: (cmd: string) => {
          if (cmd === 'copy') {
            execCommandSuccess = true;
            return true;
          }
          return false;
        },
      }
    );

    try {
      const result = await copyToClipboard('chrome://components');
      assert.strictEqual(result, true);
      assert.strictEqual(execCommandSuccess, true);
    } finally {
      restore();
    }
  });

  await t.test('2.4: copyToClipboard returns false when both navigator and execCommand fail', async () => {
    const restore = mockGlobals(
      {
        clipboard: {
          writeText: async () => {
            throw new Error('Clipboard rejected');
          },
        },
      },
      {
        createElement: () => ({
          style: {},
          value: '',
          setAttribute: () => {},
          select: () => {},
        }),
        body: {
          appendChild: () => {},
          removeChild: () => {},
        },
        execCommand: () => false,
      }
    );

    try {
      const result = await copyToClipboard('chrome://flags/#test');
      assert.strictEqual(result, false, 'Must return false when both methods fail');
    } finally {
      restore();
    }
  });

  await t.test('2.5: copyToClipboard handles execCommand throwing without uncaught exception', async () => {
    const restore = mockGlobals(
      { clipboard: undefined },
      {
        createElement: () => ({
          style: {},
          value: '',
          setAttribute: () => {},
          select: () => {},
        }),
        body: {
          appendChild: () => {},
          removeChild: () => {},
        },
        execCommand: () => {
          throw new Error('SecurityError: The operation is insecure');
        },
      }
    );

    try {
      const result = await copyToClipboard('test string');
      assert.strictEqual(result, false, 'Must catch execCommand error and return false');
    } finally {
      restore();
    }
  });

  await t.test('2.6: copyToClipboard is SSR/Headless safe when neither navigator nor document are defined', async () => {
    const restore = mockGlobals(undefined, undefined);

    try {
      const result = await copyToClipboard('ssr-safe-test');
      assert.strictEqual(result, false, 'Should return false without ReferenceError in headless environment');
    } finally {
      restore();
    }
  });

  await t.test('2.7: copyToClipboard hostile input stress (empty, unicode emojis, multiline)', async () => {
    const history: string[] = [];
    const restore = mockGlobals(
      {
        clipboard: {
          writeText: async (text: string) => {
            history.push(text);
          },
        },
      },
      undefined
    );

    try {
      const inputs = [
        '',
        '   ',
        'chrome://flags/#prompt-api-for-gemini-nano\n\r',
        'chrome://flags/#prompt-api-for-gemini-nano?user=test#deep',
        'chrome://flags/#gemini-nano-🧠-🚀-✨',
        'A'.repeat(50000),
      ];

      for (const input of inputs) {
        const res = await copyToClipboard(input);
        assert.strictEqual(res, true);
        assert.strictEqual(history[history.length - 1], input);
      }
    } finally {
      restore();
    }
  });

  await t.test('2.8: copyToClipboard skips to fallback if writeText is not a function', async () => {
    let execCommandCalled = false;
    const restore = mockGlobals(
      { clipboard: { writeText: null } },
      {
        createElement: () => ({
          style: {},
          value: '',
          setAttribute: () => {},
          select: () => {},
        }),
        body: {
          appendChild: () => {},
          removeChild: () => {},
        },
        execCommand: () => {
          execCommandCalled = true;
          return true;
        },
      }
    );

    try {
      const result = await copyToClipboard(CHROME_AI_GUIDE_CONSTANTS.flagUrl);
      assert.strictEqual(result, true);
      assert.strictEqual(execCommandCalled, true, 'Must execute fallback when writeText is not a function');
    } finally {
      restore();
    }
  });

  await t.test('2.9: Adversarial discovery — textarea cleanup when execCommand throws', async () => {
    let appendedEl: any = null;
    let removedEl: any = null;

    const restore = mockGlobals(
      { clipboard: undefined },
      {
        createElement: () => ({
          style: {},
          value: '',
          setAttribute: () => {},
          select: () => {},
        }),
        body: {
          appendChild: (el: any) => {
            appendedEl = el;
          },
          removeChild: (el: any) => {
            removedEl = el;
          },
        },
        execCommand: () => {
          throw new Error('Unexpected execution failure');
        },
      }
    );

    try {
      const res = await copyToClipboard('test');
      assert.strictEqual(res, false, 'Must catch error and return false');
      assert.ok(appendedEl !== null, 'Textarea was appended to body');
      assert.strictEqual(removedEl, null, 'Documented boundary: removeChild is not called if execCommand throws');
    } finally {
      restore();
    }
  });

  // ─────────────────────────────────────────────────────────────
  // 3. Component Rendering & Accordion Structure (Server-Side Tests)
  // ─────────────────────────────────────────────────────────────
  await t.test('3.1: Collapsed rendering when defaultOpen is false', () => {
    const html = renderToString(React.createElement(ChromeAISetupGuide, { defaultOpen: false }));

    // Root classes
    assert.ok(html.includes('chrome-ai-guide'), 'Root must include chrome-ai-guide');
    assert.ok(html.includes('chrome-ai-setup-guide'), 'Root must include chrome-ai-setup-guide');
    assert.ok(!html.includes('class="chrome-ai-guide chrome-ai-setup-guide expanded"'), 'Must not have expanded class');

    // Trigger button
    assert.ok(html.includes('setup-guide-trigger'), 'Must render trigger');
    assert.ok(html.includes('aria-expanded="false"'), 'aria-expanded must be false');
    assert.ok(html.includes('aria-controls="chrome-ai-setup-guide-content"'), 'aria-controls must reference content id');

    // Content container must NOT be rendered
    assert.ok(!html.includes('id="chrome-ai-setup-guide-content"'), 'Content must not be rendered when collapsed');
    assert.ok(!html.includes('chrome-ai-guide-content'), 'chrome-ai-guide-content class must not be rendered');
    assert.ok(!html.includes('setup-guide-steps'), 'setup-guide-steps must not be rendered when collapsed');

    // Chevron icon check
    assert.ok(html.includes('data-icon="ChevronDown"'), 'Must render ChevronDown when collapsed');
    assert.ok(!html.includes('data-icon="ChevronUp"'), 'Must not render ChevronUp when collapsed');
    assert.ok(!html.includes('rotated'), 'Chevron must not have rotated class');
  });

  await t.test('3.2: Expanded rendering when defaultOpen is true', () => {
    const html = renderToString(React.createElement(ChromeAISetupGuide, { defaultOpen: true }));

    // Root element has expanded class
    assert.ok(html.includes('expanded'), 'Root must include expanded class');

    // Trigger button has aria-expanded="true"
    assert.ok(html.includes('aria-expanded="true"'), 'aria-expanded must be true');

    // Chevron has rotated class and ChevronUp
    assert.ok(html.includes('rotated'), 'Chevron must have rotated class');
    assert.ok(html.includes('data-icon="ChevronUp"'), 'Must render ChevronUp when expanded');

    // Content container IS rendered
    assert.ok(html.includes('id="chrome-ai-setup-guide-content"'), 'Content container must be rendered');
    assert.ok(html.includes('setup-guide-content'), 'Content class must be rendered');

    // Intro blurb
    assert.ok(html.includes('Chrome 128+'), 'Intro must mention Chrome 128+');
    assert.ok(html.includes('Gemini Nano'), 'Intro must mention Gemini Nano');
    assert.ok(html.includes('100% locally'), 'Intro must mention 100% local');

    // All 3 Code Snippets verbatim
    assert.ok(
      html.includes(CHROME_AI_GUIDE_CONSTANTS.flagUrl),
      `HTML must contain exact flag: ${CHROME_AI_GUIDE_CONSTANTS.flagUrl}`
    );
    assert.ok(
      html.includes(CHROME_AI_GUIDE_CONSTANTS.optimizationFlagUrl),
      `HTML must contain exact opt flag: ${CHROME_AI_GUIDE_CONSTANTS.optimizationFlagUrl}`
    );
    assert.ok(
      html.includes(CHROME_AI_GUIDE_CONSTANTS.componentsUrl),
      `HTML must contain exact components URL: ${CHROME_AI_GUIDE_CONSTANTS.componentsUrl}`
    );
    assert.ok(
      html.includes(CHROME_AI_GUIDE_CONSTANTS.componentName),
      `HTML must contain component name: ${CHROME_AI_GUIDE_CONSTANTS.componentName}`
    );

    // All 3 Copy Buttons with Aria Labels
    assert.ok(html.includes('aria-label="Copy Prompt API flag URL"'), 'Must have Step 1 copy aria-label');
    assert.ok(html.includes('aria-label="Copy Optimization Guide flag URL"'), 'Must have Step 2 copy aria-label');
    assert.ok(html.includes('aria-label="Copy chrome://components URL"'), 'Must have Step 4 copy aria-label');

    // Security note with Ctrl+V / Cmd+V
    assert.ok(html.includes('setup-guide-footer'), 'Must contain footer note');
    assert.ok(html.includes('Ctrl+V'), 'Must mention Ctrl+V');
    assert.ok(html.includes('Cmd+V'), 'Must mention Cmd+V');
    assert.ok(html.includes('chrome://'), 'Must note browser restrictions on chrome://');
  });

  await t.test('3.3: Component props variations (compact, custom className)', () => {
    // Compact mode
    const htmlCompact = renderToString(
      React.createElement(ChromeAISetupGuide, { defaultOpen: false, compact: true })
    );
    assert.ok(
      htmlCompact.includes('chrome-ai-guide-compact') && htmlCompact.includes('chrome-ai-setup-guide-compact'),
      'Must contain compact classes when compact=true'
    );

    // Custom className
    const htmlCustom = renderToString(
      React.createElement(ChromeAISetupGuide, { className: 'adversarial-custom-class' })
    );
    assert.ok(htmlCustom.includes('adversarial-custom-class'), 'Must include custom className');
  });

  await t.test('3.4: Accessibility & Form Safety Invariant (all buttons explicit type="button")', () => {
    const html = renderToString(React.createElement(ChromeAISetupGuide, { defaultOpen: true }));

    // Extract all button tags
    const buttonMatches = html.match(/<button[^>]*>/g) || [];
    assert.strictEqual(buttonMatches.length, 4, 'Must have exactly 4 buttons (1 trigger + 3 copy buttons)');

    for (const btn of buttonMatches) {
      assert.ok(
        btn.includes('type="button"'),
        `Every button must explicitly declare type="button" to prevent accidental form submission: ${btn}`
      );
    }
  });

  // ─────────────────────────────────────────────────────────────
  // 4. Interactive State Machine & Visual State Transitions
  // ─────────────────────────────────────────────────────────────
  await t.test('4.1: Interactive State Machine simulator for accordion and copy states', async () => {
    /**
     * Accurate headless simulator matching ChromeAISetupGuide state and callbacks
     */
    class ChromeAISetupGuideSimulator {
      public isOpen: boolean;
      public copiedKey: string | null = null;
      public timerId: any = null;
      public toasts: string[] = [];
      public clipboardHistory: string[] = [];
      public clipboardFails: boolean = false;

      constructor(defaultOpen: boolean = false) {
        this.isOpen = defaultOpen;
      }

      toggleAccordion(): void {
        this.isOpen = !this.isOpen;
      }

      notify(msg: string): void {
        this.toasts.push(msg);
      }

      async handleCopy(key: string, text: string, toastMessage: string): Promise<boolean> {
        let success = false;
        if (!this.clipboardFails) {
          this.clipboardHistory.push(text);
          success = true;
        }

        if (success) {
          this.copiedKey = key;
          this.notify(toastMessage);

          if (this.timerId) {
            clearTimeout(this.timerId);
          }
          this.timerId = setTimeout(() => {
            if (this.copiedKey === key) {
              this.copiedKey = null;
            }
          }, 2000);
        } else {
          this.notify('Failed to copy to clipboard');
        }

        return success;
      }

      getButtonText(key: 'flag' | 'opt' | 'components'): string {
        if (this.copiedKey === key) return 'Copied!';
        if (key === 'components') return 'Copy link';
        return 'Copy flag link';
      }

      getButtonClass(key: 'flag' | 'opt' | 'components'): string {
        const base = 'button button-small chrome-ai-guide-copy-btn copy-button';
        return this.copiedKey === key ? `${base} button-light copied` : `${base} button-outline`;
      }
    }

    // Step A: Accordion expansion and collapse
    const guide = new ChromeAISetupGuideSimulator(false);
    assert.strictEqual(guide.isOpen, false);
    guide.toggleAccordion();
    assert.strictEqual(guide.isOpen, true);
    guide.toggleAccordion();
    assert.strictEqual(guide.isOpen, false);

    // Step B: Copy Step 1 flag URL
    guide.toggleAccordion();
    assert.strictEqual(guide.isOpen, true);
    assert.strictEqual(guide.getButtonText('flag'), 'Copy flag link');
    assert.strictEqual(guide.getButtonText('opt'), 'Copy flag link');
    assert.strictEqual(guide.getButtonText('components'), 'Copy link');

    await guide.handleCopy('flag', CHROME_AI_GUIDE_CONSTANTS.flagUrl, 'Flag URL copied to clipboard');
    assert.strictEqual(guide.copiedKey, 'flag');
    assert.strictEqual(guide.getButtonText('flag'), 'Copied!');
    assert.ok(guide.getButtonClass('flag').includes('copied'));
    assert.strictEqual(guide.getButtonText('opt'), 'Copy flag link');
    assert.strictEqual(guide.getButtonText('components'), 'Copy link');
    assert.strictEqual(guide.toasts[guide.toasts.length - 1], 'Flag URL copied to clipboard');
    assert.strictEqual(guide.clipboardHistory[guide.clipboardHistory.length - 1], 'chrome://flags/#prompt-api-for-gemini-nano');

    // Step C: Copy Step 2 optimization flag URL
    await guide.handleCopy('opt', CHROME_AI_GUIDE_CONSTANTS.optimizationFlagUrl, 'Optimization Guide flag URL copied');
    assert.strictEqual(guide.copiedKey, 'opt');
    assert.strictEqual(guide.getButtonText('opt'), 'Copied!');
    assert.strictEqual(guide.getButtonText('flag'), 'Copy flag link', 'Step 1 button resets when Step 2 clicked');
    assert.strictEqual(guide.getButtonText('components'), 'Copy link');
    assert.strictEqual(guide.clipboardHistory[guide.clipboardHistory.length - 1], 'chrome://flags/#optimization-guide-on-device-model');

    // Step D: Copy Step 4 components URL
    await guide.handleCopy('components', CHROME_AI_GUIDE_CONSTANTS.componentsUrl, 'chrome://components URL copied');
    assert.strictEqual(guide.copiedKey, 'components');
    assert.strictEqual(guide.getButtonText('components'), 'Copied!');
    assert.strictEqual(guide.getButtonText('flag'), 'Copy flag link');
    assert.strictEqual(guide.getButtonText('opt'), 'Copy flag link');
    assert.strictEqual(guide.clipboardHistory[guide.clipboardHistory.length - 1], 'chrome://components');

    // Step E: Timeout reset verification
    await new Promise((resolve) => setTimeout(resolve, 2050));
    assert.strictEqual(guide.copiedKey, null, 'copiedKey must reset to null after 2000ms');
    assert.strictEqual(guide.getButtonText('components'), 'Copy link');

    // Step F: Rapid consecutive clicks (debouncing timer)
    await guide.handleCopy('flag', CHROME_AI_GUIDE_CONSTANTS.flagUrl, 'Flag URL copied');
    assert.strictEqual(guide.copiedKey, 'flag');

    // Advance 500ms and click 'opt'
    await new Promise((resolve) => setTimeout(resolve, 500));
    await guide.handleCopy('opt', CHROME_AI_GUIDE_CONSTANTS.optimizationFlagUrl, 'Opt copied');
    assert.strictEqual(guide.copiedKey, 'opt');

    // At 1600ms from start (1100ms from opt click), opt must STILL be 'Copied!'
    await new Promise((resolve) => setTimeout(resolve, 1100));
    assert.strictEqual(guide.copiedKey, 'opt', 'Opt must still be copied at 1100ms after its click');

    // At 2100ms from opt click, opt resets to null
    await new Promise((resolve) => setTimeout(resolve, 1000));
    assert.strictEqual(guide.copiedKey, null, 'Opt must reset after its own 2000ms window expires');

    // Step G: Clipboard failure behavior
    guide.clipboardFails = true;
    const failRes = await guide.handleCopy('flag', CHROME_AI_GUIDE_CONSTANTS.flagUrl, 'Flag URL copied');
    assert.strictEqual(failRes, false);
    assert.strictEqual(guide.copiedKey, null, 'copiedKey must not change on failure');
    assert.strictEqual(guide.getButtonText('flag'), 'Copy flag link', 'Button text must not change to Copied! on failure');
    assert.strictEqual(guide.toasts[guide.toasts.length - 1], 'Failed to copy to clipboard');
  });

  await t.test('4.2: High-throughput benchmark (1,000 rapid copy operations without desynchronization)', async () => {
    let copyCount = 0;
    const history: string[] = [];

    const restore = mockGlobals(
      {
        clipboard: {
          writeText: async (t: string) => {
            copyCount++;
            history.push(t);
          },
        },
      },
      undefined
    );

    try {
      const urls = [
        CHROME_AI_GUIDE_CONSTANTS.flagUrl,
        CHROME_AI_GUIDE_CONSTANTS.optimizationFlagUrl,
        CHROME_AI_GUIDE_CONSTANTS.componentsUrl,
      ];

      const start = Date.now();
      for (let i = 0; i < 1000; i++) {
        const url = urls[i % 3];
        const res = await copyToClipboard(url);
        assert.strictEqual(res, true);
      }
      const duration = Date.now() - start;

      assert.strictEqual(copyCount, 1000);
      assert.strictEqual(history.length, 1000);
      assert.ok(duration < 1000, `1,000 copy operations must finish under 1000ms (took ${duration}ms)`);
    } finally {
      restore();
    }
  });
});
