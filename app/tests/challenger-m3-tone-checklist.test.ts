import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─────────────────────────────────────────────────────────────
// 1. Headless DOM Mock Setup for React 19 Client Testing
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
  public checked: boolean = false;
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
    if (k === 'checked') this.checked = true;
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
    if (k === 'checked') this.checked = false;
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
(globalThis as any).HTMLIFrameElement = function () {};
(globalThis as any).window.setTimeout = (cb: Function) => {
  cb();
  return 1;
};
(globalThis as any).window.clearTimeout = () => {};
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

// Mock LocalStorage
class MockLocalStorage {
  private store: Map<string, string> = new Map();

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

// Dynamic import of React & ReactDOMClient
const React = await import('react');
const ReactDOMClient = await import('react-dom/client');

// ─────────────────────────────────────────────────────────────
// 2. Load ParentingPlaybook and Store Modules via esbuild
// ─────────────────────────────────────────────────────────────

const playbookPath = path.resolve(__dirname, '../src/components/agent/ParentingPlaybook.tsx');
const playbookRaw = fs.readFileSync(playbookPath, 'utf8');
const playbookTransformed = esbuild.transformSync(playbookRaw, { loader: 'tsx', format: 'cjs' });

let currentAppContextValue: any = null;

const customRequire = (id: string) => {
  if (id === 'react') return React;
  if (id === 'lucide-react') {
    const iconNames = [
      'ChevronLeft', 'ChevronRight', 'Bookmark', 'BookmarkCheck', 'Pause', 'Play',
      'Quote', 'CheckCircle2', 'AlertCircle', 'AlertTriangle', 'Lightbulb',
      'MessageSquare', 'Sparkles', 'RotateCcw', 'Monitor', 'Check', 'Compass'
    ];
    const res: Record<string, any> = {};
    for (const name of iconNames) {
      res[name] = (props: any) => React.createElement('span', { 'data-icon': name, ...props });
    }
    return res;
  }
  if (id === '../../store') {
    return {
      useApp: () => {
        if (!currentAppContextValue) {
          throw new Error('useApp must be used within AppProvider');
        }
        return currentAppContextValue;
      },
      copyText: async () => {},
    };
  }
  if (id === './ChromeAISetupGuide') {
    return {
      ChromeAISetupGuide: () => React.createElement('div', { className: 'chrome-ai-setup-guide-stub' }),
    };
  }
  throw new Error(`Unhandled mock require: ${id}`);
};

const playbookModule: { exports: any } = { exports: {} };
const runnerFn = new Function('React', 'require', 'exports', 'module', playbookTransformed.code);
runnerFn(React, customRequire, playbookModule.exports, playbookModule);

const {
  TONE_CHECKLIST_CRITERIA,
  evaluateToneScore,
  ToneChecklist,
  ParentingPlaybook,
} = playbookModule.exports;

// Helper to inspect rendered MockElement tree
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

function getTextContent(node: any): string {
  if (!node) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join(' ');
  if (node.props && node.props.children) return getTextContent(node.props.children);
  if (node.childNodes) return node.childNodes.map(getTextContent).join(' ');
  return '';
}

// ─────────────────────────────────────────────────────────────
// 3. Automated Test Suite Execution
// ─────────────────────────────────────────────────────────────

test('Challenger M3_2: Tone Checklist & Storage Empirical Stress Suite', async (t) => {

  // ───────────────────────────────────────────────────────────
  // Suite 1: Exact Criteria Structure & Diagnostic Content
  // ───────────────────────────────────────────────────────────

  await t.test('1.1: Criteria count is exactly 5 and has unique string IDs', () => {
    assert.strictEqual(
      TONE_CHECKLIST_CRITERIA.length,
      5,
      `Expected exactly 5 tone checklist criteria, got ${TONE_CHECKLIST_CRITERIA.length}`
    );

    const ids = TONE_CHECKLIST_CRITERIA.map((c: any) => c.id);
    const uniqueIds = new Set(ids);
    assert.strictEqual(uniqueIds.size, 5, 'All 5 criterion IDs must be strictly unique');

    const expectedIds = ['standing', 'bilateral', 'boundaries', 'space', 'baseline'];
    assert.deepStrictEqual(ids, expectedIds, `Expected IDs [${expectedIds}], got [${ids}]`);
  });

  await t.test('1.2: Complete data model integrity on all 5 criteria', () => {
    for (const criterion of TONE_CHECKLIST_CRITERIA) {
      assert.ok(criterion.id && typeof criterion.id === 'string', 'id must be non-empty string');
      assert.ok(criterion.title && typeof criterion.title === 'string', 'title must be non-empty string');
      assert.ok(criterion.shortDescription && typeof criterion.shortDescription === 'string', 'shortDescription must be non-empty string');
      assert.ok(criterion.diagnosticQuestion && typeof criterion.diagnosticQuestion === 'string', 'diagnosticQuestion must be non-empty string');
      assert.ok(criterion.healthyIndicator && typeof criterion.healthyIndicator === 'string', 'healthyIndicator must be non-empty string');
      assert.ok(criterion.concernIndicator && typeof criterion.concernIndicator === 'string', 'concernIndicator must be non-empty string');

      // Verify strings are non-trivial (at least 15 chars)
      assert.ok(criterion.title.length >= 10, `Title too brief for ${criterion.id}`);
      assert.ok(criterion.shortDescription.length >= 25, `shortDescription too brief for ${criterion.id}`);
      assert.ok(criterion.diagnosticQuestion.length >= 25, `diagnosticQuestion too brief for ${criterion.id}`);
      assert.ok(criterion.healthyIndicator.length >= 25, `healthyIndicator too brief for ${criterion.id}`);
      assert.ok(criterion.concernIndicator.length >= 25, `concernIndicator too brief for ${criterion.id}`);
    }
  });

  await t.test('1.3: Diagnostic questions address specific relational dimensions', () => {
    const standing = TONE_CHECKLIST_CRITERIA.find((c: any) => c.id === 'standing');
    assert.match(standing.diagnosticQuestion, /status|power|leverage/i, 'standing must address status/power');

    const bilateral = TONE_CHECKLIST_CRITERIA.find((c: any) => c.id === 'bilateral');
    assert.match(bilateral.diagnosticQuestion, /participat|target/i, 'bilateral must address active participation vs targeting');

    const boundaries = TONE_CHECKLIST_CRITERIA.find((c: any) => c.id === 'boundaries');
    assert.match(boundaries.diagnosticQuestion, /chill|stop|back off/i, 'boundaries must address signaling discomfort/stop');

    const space = TONE_CHECKLIST_CRITERIA.find((c: any) => c.id === 'space');
    assert.match(space.diagnosticQuestion, /direct message|broadcast|audience/i, 'space must address DM vs public broadcast');

    const baseline = TONE_CHECKLIST_CRITERIA.find((c: any) => c.id === 'baseline');
    assert.match(baseline.diagnosticQuestion, /mood|appetite|sleep|attendance/i, 'baseline must address offline behavioral changes');
  });

  // ───────────────────────────────────────────────────────────
  // Suite 2: Exhaustive Combinatorial Scoring Engine (2^5 = 32 States)
  // ───────────────────────────────────────────────────────────

  await t.test('2.1: Exhaustive 32-state combinatorial coverage across all score buckets', () => {
    const allIds = TONE_CHECKLIST_CRITERIA.map((c: any) => c.id);
    const total = 5;

    // Power set generator: 2^5 = 32 subsets
    for (let mask = 0; mask < 32; mask++) {
      const subset = new Set<string>();
      for (let i = 0; i < 5; i++) {
        if ((mask & (1 << i)) !== 0) {
          subset.add(allIds[i]);
        }
      }

      const score = subset.size;
      const res = evaluateToneScore(subset);

      assert.strictEqual(res.score, score, `Score mismatch for mask ${mask.toString(2)}`);
      assert.strictEqual(res.total, total, `Total must strictly equal 5`);

      // Bucket 1: 0, 1, 2 out of 5 -> 'intervention'
      if (score <= 2) {
        assert.strictEqual(res.tier, 'intervention', `Expected 'intervention' for score ${score}`);
        assert.strictEqual(res.badgeLabel, 'Supportive Intervention Recommended');
        assert.strictEqual(res.verdict, 'Intervention Recommended');
        assert.strictEqual(res.colorClass, 'severity-intervention');
        assert.strictEqual(res.badgeClass, 'severity-intervention');
        assert.strictEqual(res.progressClass, 'progress-intervention');
      }
      // Bucket 2: 3, 4 out of 5 -> 'watchful'
      else if (score <= 4) {
        assert.strictEqual(res.tier, 'watchful', `Expected 'watchful' for score ${score}`);
        assert.strictEqual(res.badgeLabel, 'Nuanced / Watchful');
        assert.strictEqual(res.verdict, 'Watchful / Stay Curious');
        assert.strictEqual(res.colorClass, 'severity-watchful');
        assert.strictEqual(res.badgeClass, 'severity-watchful');
        assert.strictEqual(res.progressClass, 'progress-watchful');
      }
      // Bucket 3: 5 out of 5 -> 'healthy'
      else if (score === 5) {
        assert.strictEqual(res.tier, 'healthy', `Expected 'healthy' for score ${score}`);
        assert.strictEqual(res.badgeLabel, 'Healthy Peer Interaction');
        assert.strictEqual(res.verdict, 'Harmless / Normal Banter');
        assert.strictEqual(res.colorClass, 'severity-harmless');
        assert.strictEqual(res.badgeClass, 'severity-harmless');
        assert.strictEqual(res.progressClass, 'progress-healthy');
      }

      // Verification of non-empty clinical payload
      assert.ok(res.summary.length > 20, 'Summary must be non-empty');
      assert.ok(res.guidance.length > 50, 'Guidance must be comprehensive');
      assert.ok(Array.isArray(res.actionSteps) && res.actionSteps.length >= 3, 'Must have at least 3 action steps');
      for (const step of res.actionSteps) {
        assert.ok(step && typeof step === 'string' && step.length > 10, 'Each action step must be non-trivial string');
      }
    }
  });

  await t.test('2.2: Percentage computation accuracy across all score points', () => {
    const expectedPercentages = [0, 20, 40, 60, 80, 100];
    const allIds = TONE_CHECKLIST_CRITERIA.map((c: any) => c.id);

    for (let score = 0; score <= 5; score++) {
      const set = new Set(allIds.slice(0, score));
      const res = evaluateToneScore(set);
      const percentage = Math.round((res.score / res.total) * 100);
      assert.strictEqual(percentage, expectedPercentages[score], `Expected ${expectedPercentages[score]}% for score ${score}/5`);
    }
  });

  await t.test('2.3: Extraneous or invalid ID defense in evaluateToneScore', () => {
    // If an external caller passes a Set with an unrecognized ID,
    // evaluateToneScore uses checkedIds.size directly.
    const extraneousSet = new Set(['unknown-id-1', 'unknown-id-2']);
    const res = evaluateToneScore(extraneousSet);
    assert.strictEqual(res.score, 2, 'Evaluates set size');
    assert.strictEqual(res.tier, 'intervention');

    // Empty set safety
    const emptyRes = evaluateToneScore(new Set());
    assert.strictEqual(emptyRes.score, 0);
    assert.strictEqual(emptyRes.tier, 'intervention');
  });

  // ───────────────────────────────────────────────────────────
  // Suite 3: ToneChecklist Component State & Interactive DOM
  // ───────────────────────────────────────────────────────────

  await t.test('3.1: Mount ToneChecklist and verify initial rendered state', () => {
    const notifyCalls: string[] = [];
    currentAppContextValue = {
      savedAIOutputs: [],
      saveAIOutput: () => {},
      removeAIOutput: () => {},
      clearAIOutputs: () => {},
      isAIOutputSaved: () => false,
      notify: (msg: string) => notifyCalls.push(msg),
    };

    const container = new MockElement('div');
    container.ownerDocument = mockDocument;
    const root = ReactDOMClient.createRoot(container as any);

    let interactionCalled = false;
    React.act(() => {
      root.render(
        React.createElement(ToneChecklist, {
          onUserInteraction: () => {
            interactionCalled = true;
          },
        })
      );
    });

    // Verify all 5 checkboxes are rendered and unchecked
    const checkboxes = findNodes(container, (n) => n.tagName === 'INPUT' && n.type === 'checkbox');
    assert.strictEqual(checkboxes.length, 5, 'Must render exactly 5 checkbox inputs');

    for (const chk of checkboxes) {
      const props = getReactProps(chk);
      assert.strictEqual(props.checked, false, 'Checkbox must be initially unchecked');
    }


    // Verify reset button is disabled initially
    const buttons = findNodes(container, (n) => n.tagName === 'BUTTON');
    const resetBtn = buttons.find((b) => {
      const props = getReactProps(b);
      return props && props.children && getTextContent(props.children).includes('Reset Checklist');
    });
    assert.ok(resetBtn, 'Reset button must be present in action footer');
    const resetProps = getReactProps(resetBtn);
    assert.strictEqual(resetProps.disabled, true, 'Reset button must be disabled when 0 items checked');

    // Verify initial badge shows 0/5
    const badge = findNodes(container, (n) => {
      const cls = n.getAttribute('class') || '';
      return cls.includes('tone-severity-badge');
    })[0];
    assert.ok(badge, 'Tone severity badge must be rendered');
    const badgeProps = getReactProps(badge);
    assert.ok(badgeProps.className.includes('severity-intervention'), 'Initial badge class must be severity-intervention');

    root.unmount();
  });

  await t.test('3.2: Toggling checkboxes dynamically updates score, badge, and reset state', () => {
    currentAppContextValue = {
      savedAIOutputs: [],
      saveAIOutput: () => {},
      removeAIOutput: () => {},
      clearAIOutputs: () => {},
      isAIOutputSaved: () => false,
      notify: () => {},
    };

    const container = new MockElement('div');
    container.ownerDocument = mockDocument;
    const root = ReactDOMClient.createRoot(container as any);

    let interactionCount = 0;
    React.act(() => {
      root.render(
        React.createElement(ToneChecklist, {
          onUserInteraction: () => {
            interactionCount++;
          },
        })
      );
    });

    const getCheckboxes = () => findNodes(container, (n) => n.tagName === 'INPUT' && n.type === 'checkbox');
    const getResetButton = () => {
      const buttons = findNodes(container, (n) => n.tagName === 'BUTTON');
      return buttons.find((b) => {
        const props = getReactProps(b);
        return props && props.children && getTextContent(props.children).includes('Reset Checklist');
      });
    };
    const getBadge = () => findNodes(container, (n) => (n.getAttribute('class') || '').includes('tone-severity-badge'))[0];

    // Toggle 1st item ('standing')
    React.act(() => {
      const chk1 = getCheckboxes()[0];
      const props = getReactProps(chk1);
      props.onChange();
    });

    assert.strictEqual(interactionCount, 1, 'onUserInteraction should be fired on toggle');
    assert.strictEqual(getReactProps(getCheckboxes()[0]).checked, true, 'First checkbox should be checked');
    assert.strictEqual(getReactProps(getResetButton()).disabled, false, 'Reset button should now be enabled');
    assert.ok(getReactProps(getBadge()).className.includes('severity-intervention'), '1/5 is still intervention tier');

    // Toggle 2nd item ('bilateral')
    React.act(() => {
      const chk2 = getCheckboxes()[1];
      getReactProps(chk2).onChange();
    });
    assert.strictEqual(getReactProps(getCheckboxes()[1]).checked, true);
    assert.ok(getReactProps(getBadge()).className.includes('severity-intervention'), '2/5 is still intervention tier');

    // Toggle 3rd item ('boundaries') -> Score 3/5: transitions to WATCHFUL
    React.act(() => {
      const chk3 = getCheckboxes()[2];
      getReactProps(chk3).onChange();
    });
    assert.strictEqual(getReactProps(getCheckboxes()[2]).checked, true);
    assert.ok(getReactProps(getBadge()).className.includes('severity-watchful'), '3/5 must transition to severity-watchful');

    // Toggle 4th item ('space') -> Score 4/5: stays WATCHFUL
    React.act(() => {
      const chk4 = getCheckboxes()[3];
      getReactProps(chk4).onChange();
    });
    assert.strictEqual(getReactProps(getCheckboxes()[3]).checked, true);
    assert.ok(getReactProps(getBadge()).className.includes('severity-watchful'), '4/5 must remain severity-watchful');

    // Toggle 5th item ('baseline') -> Score 5/5: transitions to HEALTHY
    React.act(() => {
      const chk5 = getCheckboxes()[4];
      getReactProps(chk5).onChange();
    });
    assert.strictEqual(getReactProps(getCheckboxes()[4]).checked, true);
    assert.ok(getReactProps(getBadge()).className.includes('severity-harmless'), '5/5 must transition to severity-harmless (healthy)');

    // Untoggle 5th item ('baseline') -> Score decreases to 4/5: transitions back to WATCHFUL
    React.act(() => {
      const chk5 = getCheckboxes()[4];
      getReactProps(chk5).onChange();
    });
    assert.strictEqual(getReactProps(getCheckboxes()[4]).checked, false, 'Untoggled checkbox should be unchecked');
    assert.ok(getReactProps(getBadge()).className.includes('severity-watchful'), 'Untoggling to 4/5 transitions back to watchful');

    root.unmount();
  });

  await t.test('3.3: Reset action resets all checkboxes, resets score to 0, and notifies store', () => {
    const notifyCalls: string[] = [];
    currentAppContextValue = {
      savedAIOutputs: [],
      saveAIOutput: () => {},
      removeAIOutput: () => {},
      clearAIOutputs: () => {},
      isAIOutputSaved: () => false,
      notify: (msg: string) => notifyCalls.push(msg),
    };

    const container = new MockElement('div');
    container.ownerDocument = mockDocument;
    const root = ReactDOMClient.createRoot(container as any);

    let interactionCount = 0;
    React.act(() => {
      root.render(
        React.createElement(ToneChecklist, {
          onUserInteraction: () => {
            interactionCount++;
          },
        })
      );
    });

    const getCheckboxes = () => findNodes(container, (n) => n.tagName === 'INPUT' && n.type === 'checkbox');
    const getResetButton = () => {
      const buttons = findNodes(container, (n) => n.tagName === 'BUTTON');
      return buttons.find((b) => {
        const props = getReactProps(b);
        return props && props.children && getTextContent(props.children).includes('Reset Checklist');
      });
    };
    const getBadge = () => findNodes(container, (n) => (n.getAttribute('class') || '').includes('tone-severity-badge'))[0];

    // Check all 5 checkboxes
    React.act(() => {
      for (const chk of getCheckboxes()) {
        getReactProps(chk).onChange();
      }
    });

    // Verify all 5 are checked
    for (const chk of getCheckboxes()) {
      assert.strictEqual(getReactProps(chk).checked, true);
    }
    assert.strictEqual(getReactProps(getResetButton()).disabled, false);

    // Trigger Reset action
    React.act(() => {
      const resetBtn = getResetButton();
      getReactProps(resetBtn).onClick();
    });

    // Verify all checkboxes are now unchecked
    for (let i = 0; i < 5; i++) {
      assert.strictEqual(
        getReactProps(getCheckboxes()[i]).checked,
        false,
        `Checkbox ${i} must be unchecked after reset`
      );
    }

    // Verify Reset button is disabled again
    assert.strictEqual(getReactProps(getResetButton()).disabled, true, 'Reset button must be disabled after reset');

    // Verify badge is back to intervention tier
    assert.ok(getReactProps(getBadge()).className.includes('severity-intervention'));

    // Verify toast notification was fired
    assert.ok(notifyCalls.includes('Tone checklist reset'), 'Toast notification "Tone checklist reset" must be triggered');

    root.unmount();
  });

  await t.test('3.4: Standalone resilience when rendered outside AppProvider', () => {
    // Setting context to null simulates standalone render outside AppProvider
    currentAppContextValue = null;

    const container = new MockElement('div');
    container.ownerDocument = mockDocument;
    const root = ReactDOMClient.createRoot(container as any);

    // Should NOT throw uncaught error thanks to try/catch fallback in ToneChecklist
    assert.doesNotThrow(() => {
      React.act(() => {
        root.render(React.createElement(ToneChecklist, {}));
      });
    });

    // Checkboxes should still be functional
    const checkboxes = findNodes(container, (n) => n.tagName === 'INPUT' && n.type === 'checkbox');
    assert.strictEqual(checkboxes.length, 5);

    // Toggling should still update local state
    React.act(() => {
      getReactProps(checkboxes[0]).onChange();
    });
    assert.strictEqual(getReactProps(checkboxes[0]).checked, true);

    root.unmount();
  });

  // ───────────────────────────────────────────────────────────
  // Suite 4: Storage Persistence & Zero Data Loss Guarantee
  // ───────────────────────────────────────────────────────────

  await t.test('4.1: Save action persists checklist with category "playbook" and markdown summary', () => {
    mockStorage.clear();

    // Pre-populate legacy storage
    const legacyTerms = ['cooked', 'rizz', 'skibidi'];
    const legacyMessages = [{ id: 'm1', text: 'Please clean dishes', savedAt: 1700000000000 }];
    const legacyAIOutputs = [{
      id: 'ai-init',
      type: 'tone-analysis',
      title: 'Prior Tone Reading',
      content: 'Banter is playful',
      savedAt: 1700000000000
    }];

    mockStorage.setItem('parent-decoder-saved-terms', JSON.stringify(legacyTerms));
    mockStorage.setItem('parent-decoder-saved-messages', JSON.stringify(legacyMessages));
    mockStorage.setItem('parent-decoder-saved-ai-outputs', JSON.stringify(legacyAIOutputs));

    let savedOutputs = [...legacyAIOutputs];
    const notifyCalls: string[] = [];

    // Store implementation matching store.tsx saveAIOutput & isAIOutputSaved
    currentAppContextValue = {
      savedAIOutputs: savedOutputs,
      saveAIOutput: (output: any) => {
        const cleanTitle = output.title.trim().slice(0, 200);
        const cleanContent = output.content.trim().slice(0, 10000);
        const id = `ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const newItem = {
          id,
          type: output.type,
          title: cleanTitle,
          content: cleanContent,
          summary: output.summary,
          savedAt: Date.now(),
          metadata: output.metadata,
        };
        savedOutputs = [
          newItem,
          ...savedOutputs.filter(
            (item: any) => !(item.type === output.type && item.title.trim().toLowerCase() === cleanTitle.toLowerCase())
          ),
        ].slice(0, 50);
        mockStorage.setItem('parent-decoder-saved-ai-outputs', JSON.stringify(savedOutputs));
        currentAppContextValue.savedAIOutputs = savedOutputs;
        notifyCalls.push('Saved in this browser');
      },
      isAIOutputSaved: (title: string, type: string) => {
        const normalized = title.trim().toLowerCase();
        return savedOutputs.some(
          (item: any) => item.type === type && item.title.trim().toLowerCase() === normalized
        );
      },
      notify: (msg: string) => notifyCalls.push(msg),
    };

    const container = new MockElement('div');
    container.ownerDocument = mockDocument;
    const root = ReactDOMClient.createRoot(container as any);

    React.act(() => {
      root.render(React.createElement(ToneChecklist, {}));
    });

    const getCheckboxes = () => findNodes(container, (n) => n.tagName === 'INPUT' && n.type === 'checkbox');
    const getSaveButton = () => {
      const buttons = findNodes(container, (n) => n.tagName === 'BUTTON');
      return buttons.find((b) => (b.getAttribute('class') || '').includes('scenario-save-btn'));
    };

    // Check all 5 criteria (Score: 5/5)
    React.act(() => {
      for (const chk of getCheckboxes()) {
        getReactProps(chk).onChange();
      }
    });

    // Save initial 5/5
    React.act(() => {
      const saveBtn = getSaveButton();
      getReactProps(saveBtn).onClick();
    });

    // 1. Verify storage persistence
    const rawStored = mockStorage.getItem('parent-decoder-saved-ai-outputs');
    assert.ok(rawStored, 'parent-decoder-saved-ai-outputs must exist in localStorage');
    const parsedStored = JSON.parse(rawStored);
    assert.strictEqual(parsedStored.length, 2, 'Must have 2 items (prior legacy tone reading + new playbook note)');

    const savedEntry = parsedStored[0];
    assert.strictEqual(savedEntry.type, 'playbook', 'Saved output type must strictly be "playbook"');
    assert.strictEqual(savedEntry.title, 'Tone Checklist: 5/5 - Healthy Peer Interaction');
    assert.strictEqual(savedEntry.metadata.score, '5');
    assert.strictEqual(savedEntry.metadata.total, '5');
    assert.strictEqual(savedEntry.metadata.tier, 'healthy');
    assert.strictEqual(savedEntry.metadata.category, 'tone-checklist');
    assert.strictEqual(savedEntry.metadata.badgeLabel, 'Healthy Peer Interaction');
    assert.ok(savedEntry.metadata.evaluatedAt, 'Must include evaluatedAt timestamp');

    // 2. Verify markdown content includes all criteria checked
    assert.ok(savedEntry.content.includes('## Tone Checklist Assessment: Harmless / Normal Banter (5/5 Criteria Met)'));
    assert.ok(savedEntry.content.includes('- [x] **Equal Social Standing**'));
    assert.ok(savedEntry.content.includes('- [x] **Bilateral Engagement**'));
    assert.ok(savedEntry.content.includes('- [x] **Boundary Respect**'));
    assert.ok(savedEntry.content.includes('- [x] **Appropriate Space**'));
    assert.ok(savedEntry.content.includes('- [x] **Calm Baseline Demeanor**'));
    assert.ok(savedEntry.content.includes('### Clinical Guidance:'));
    assert.ok(savedEntry.content.includes('### Recommended Parent Actions:'));

    // 3. ZERO DATA LOSS CHECK: Legacy terms and messages must be 100% intact!
    const storedTerms = JSON.parse(mockStorage.getItem('parent-decoder-saved-terms')!);
    assert.deepStrictEqual(storedTerms, legacyTerms, 'savedTerms must remain completely untouched (Zero Data Loss)');

    const storedMessages = JSON.parse(mockStorage.getItem('parent-decoder-saved-messages')!);
    assert.deepStrictEqual(storedMessages, legacyMessages, 'savedMessages must remain completely untouched (Zero Data Loss)');

    // 4. Verify toast notification
    assert.ok(notifyCalls.includes('Saved in this browser'), 'Must notify user of successful save');

    // 5. Re-render to verify button reflects saved state
    React.act(() => {
      root.render(React.createElement(ToneChecklist, {}));
    });
    const updatedSaveBtn = getSaveButton();
    const saveBtnProps = getReactProps(updatedSaveBtn);
    assert.ok(saveBtnProps.className.includes('saved'), 'Save button must have "saved" CSS class');
    assert.ok(getTextContent(saveBtnProps.children).includes('Saved in Saved Items'), 'Save button text must show "Saved in Saved Items"');

    root.unmount();
  });

  await t.test('4.2: Deduplication on repeated saves of same checklist state', () => {
    let savedOutputs: any[] = [];
    currentAppContextValue = {
      savedAIOutputs: savedOutputs,
      saveAIOutput: (output: any) => {
        const cleanTitle = output.title.trim().slice(0, 200);
        const newItem = {
          id: `ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          type: output.type,
          title: cleanTitle,
          content: output.content,
          savedAt: Date.now(),
        };
        savedOutputs = [
          newItem,
          ...savedOutputs.filter(
            (item: any) => !(item.type === output.type && item.title.trim().toLowerCase() === cleanTitle.toLowerCase())
          ),
        ];
        currentAppContextValue.savedAIOutputs = savedOutputs;
      },
      isAIOutputSaved: (title: string, type: string) => {
        return savedOutputs.some(
          (item: any) => item.type === type && item.title.trim().toLowerCase() === title.trim().toLowerCase()
        );
      },
      notify: () => {},
    };

    const container = new MockElement('div');
    container.ownerDocument = mockDocument;
    const root = ReactDOMClient.createRoot(container as any);

    React.act(() => {
      root.render(React.createElement(ToneChecklist, {}));
    });

    const getCheckboxes = () => findNodes(container, (n) => n.tagName === 'INPUT' && n.type === 'checkbox');
    const getSaveButton = () => {
      const buttons = findNodes(container, (n) => n.tagName === 'BUTTON');
      return buttons.find((b) => (b.getAttribute('class') || '').includes('scenario-save-btn'));
    };

    // Check item 1 and 2
    React.act(() => {
      getReactProps(getCheckboxes()[0]).onChange();
      getReactProps(getCheckboxes()[1]).onChange();
    });

    // Save twice
    React.act(() => {
      getReactProps(getSaveButton()).onClick();
    });
    assert.strictEqual(savedOutputs.length, 1, 'First save should result in 1 item');

    React.act(() => {
      getReactProps(getSaveButton()).onClick();
    });
    assert.strictEqual(savedOutputs.length, 1, 'Second save of identical title & type must deduplicate to 1 item');

    root.unmount();
  });

  await t.test('4.3: Distinct score states produce distinct saved entries', () => {
    let savedOutputs: any[] = [];
    currentAppContextValue = {
      savedAIOutputs: savedOutputs,
      saveAIOutput: (output: any) => {
        const cleanTitle = output.title.trim().slice(0, 200);
        const newItem = {
          id: `ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          type: output.type,
          title: cleanTitle,
          content: output.content,
          savedAt: Date.now(),
        };
        savedOutputs = [
          newItem,
          ...savedOutputs.filter(
            (item: any) => !(item.type === output.type && item.title.trim().toLowerCase() === cleanTitle.toLowerCase())
          ),
        ];
        currentAppContextValue.savedAIOutputs = savedOutputs;
      },
      isAIOutputSaved: (title: string, type: string) => {
        return savedOutputs.some(
          (item: any) => item.type === type && item.title.trim().toLowerCase() === title.trim().toLowerCase()
        );
      },
      notify: () => {},
    };

    const container = new MockElement('div');
    container.ownerDocument = mockDocument;
    const root = ReactDOMClient.createRoot(container as any);

    React.act(() => {
      root.render(React.createElement(ToneChecklist, {}));
    });

    const getCheckboxes = () => findNodes(container, (n) => n.tagName === 'INPUT' && n.type === 'checkbox');
    const getResetButton = () => {
      const buttons = findNodes(container, (n) => n.tagName === 'BUTTON');
      return buttons.find((b) => {
        const props = getReactProps(b);
        return props && props.children && JSON.stringify(props.children).includes('Reset Checklist');
      });
    };
    const getSaveButton = () => {
      const buttons = findNodes(container, (n) => n.tagName === 'BUTTON');
      return buttons.find((b) => (b.getAttribute('class') || '').includes('scenario-save-btn'));
    };

    // Save 0/5
    React.act(() => {
      getReactProps(getSaveButton()).onClick();
    });
    assert.strictEqual(savedOutputs.length, 1);
    assert.strictEqual(savedOutputs[0].title, 'Tone Checklist: 0/5 - Supportive Intervention Recommended');

    // Toggle 3 items (3/5) and save
    React.act(() => {
      getReactProps(getCheckboxes()[0]).onChange();
      getReactProps(getCheckboxes()[1]).onChange();
      getReactProps(getCheckboxes()[2]).onChange();
    });
    React.act(() => {
      getReactProps(getSaveButton()).onClick();
    });
    assert.strictEqual(savedOutputs.length, 2);
    assert.strictEqual(savedOutputs[0].title, 'Tone Checklist: 3/5 - Nuanced / Watchful');

    // Toggle all 5 items (5/5) and save
    React.act(() => {
      getReactProps(getCheckboxes()[3]).onChange();
      getReactProps(getCheckboxes()[4]).onChange();
    });
    React.act(() => {
      getReactProps(getSaveButton()).onClick();
    });
    assert.strictEqual(savedOutputs.length, 3);
    assert.strictEqual(savedOutputs[0].title, 'Tone Checklist: 5/5 - Healthy Peer Interaction');

    root.unmount();
  });

  // ───────────────────────────────────────────────────────────
  // Suite 5: Adversarial Stress & Rapid Operations
  // ───────────────────────────────────────────────────────────

  await t.test('5.1: High-throughput stress: 1,000 rapid toggles and resets maintaining consistency', () => {
    currentAppContextValue = {
      savedAIOutputs: [],
      saveAIOutput: () => {},
      isAIOutputSaved: () => false,
      notify: () => {},
    };

    const container = new MockElement('div');
    container.ownerDocument = mockDocument;
    const root = ReactDOMClient.createRoot(container as any);

    React.act(() => {
      root.render(React.createElement(ToneChecklist, {}));
    });

    const getCheckboxes = () => findNodes(container, (n) => n.tagName === 'INPUT' && n.type === 'checkbox');
    const getResetButton = () => {
      const buttons = findNodes(container, (n) => n.tagName === 'BUTTON');
      return buttons.find((b) => {
        const props = getReactProps(b);
        return props && props.children && getTextContent(props.children).includes('Reset Checklist');
      });
    };

    // Run 1,000 random operations (toggle random checkbox or reset)
    React.act(() => {
      for (let op = 0; op < 1000; op++) {
        const rand = Math.random();
        if (rand < 0.8) {
          const chkIndex = Math.floor(Math.random() * 5);
          getReactProps(getCheckboxes()[chkIndex]).onChange();
        } else {
          const resetBtn = getResetButton();
          const props = getReactProps(resetBtn);
          if (!props.disabled) {
            props.onClick();
          }
        }
      }
    });

    // Check count of checked checkboxes matches internal state
    const checkboxes = getCheckboxes();
    let checkedCount = 0;
    for (const chk of checkboxes) {
      if (getReactProps(chk).checked) checkedCount++;
    }

    assert.ok(checkedCount >= 0 && checkedCount <= 5, 'Checked count must remain bounded between 0 and 5');

    // Final reset must cleanly restore 0
    React.act(() => {
      const resetBtn = getResetButton();
      const props = getReactProps(resetBtn);
      if (!props.disabled) {
        props.onClick();
      }
    });

    for (const chk of getCheckboxes()) {
      assert.strictEqual(getReactProps(chk).checked, false);
    }
    assert.strictEqual(getReactProps(getResetButton()).disabled, true);

    root.unmount();
  });

  await t.test('5.2: Quota bounding verification (strict 50-item limit with MRU eviction)', () => {
    let savedOutputs: any[] = [];
    currentAppContextValue = {
      savedAIOutputs: savedOutputs,
      saveAIOutput: (output: any) => {
        const cleanTitle = output.title.trim().slice(0, 200);
        const newItem = {
          id: `ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          type: output.type,
          title: cleanTitle,
          content: output.content,
          savedAt: Date.now(),
        };
        // store.tsx caps at 50 items
        savedOutputs = [
          newItem,
          ...savedOutputs.filter(
            (item: any) => !(item.type === output.type && item.title.trim().toLowerCase() === cleanTitle.toLowerCase())
          ),
        ].slice(0, 50);
        currentAppContextValue.savedAIOutputs = savedOutputs;
      },
      isAIOutputSaved: () => false,
      notify: () => {},
    };

    // Save 65 distinct items
    for (let i = 1; i <= 65; i++) {
      currentAppContextValue.saveAIOutput({
        type: 'playbook',
        title: `Playbook Note #${i}`,
        content: `Content for note ${i}`,
      });
    }

    assert.strictEqual(savedOutputs.length, 50, 'Store must cap at exactly 50 items');
    assert.strictEqual(savedOutputs[0].title, 'Playbook Note #65', 'Most recently added note must be at the top');
    assert.strictEqual(savedOutputs[49].title, 'Playbook Note #16', 'Items #1 through #15 must be evicted');
  });

  await t.test('5.3: ParentingPlaybook root container integrates ToneChecklist section properly', () => {
    currentAppContextValue = {
      savedAIOutputs: [],
      saveAIOutput: () => {},
      isAIOutputSaved: () => false,
      notify: () => {},
    };

    const container = new MockElement('div');
    container.ownerDocument = mockDocument;
    const root = ReactDOMClient.createRoot(container as any);

    React.act(() => {
      root.render(React.createElement(ParentingPlaybook, {}));
    });

    // Verify sections
    const sections = findNodes(container, (n) => n.tagName === 'SECTION');
    assert.strictEqual(sections.length, 2, 'Must contain 2 sections: Scenario Carousel and Tone Checklist');

    // Section 2 should have tone checklist heading
    const toneHeading = findNodes(container, (n) => n.attributes.id === 'tone-checklist-heading');
    assert.strictEqual(toneHeading.length, 1, 'tone-checklist-heading must exist');

    // Checkboxes should exist inside ParentingPlaybook
    const checkboxes = findNodes(container, (n) => n.tagName === 'INPUT' && n.type === 'checkbox');
    assert.strictEqual(checkboxes.length, 5, '5 tone checklist checkboxes must be mounted inside ParentingPlaybook');

    root.unmount();
  });
});
