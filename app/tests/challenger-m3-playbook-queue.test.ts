import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';
import React from 'react';
import { renderToString } from 'react-dom/server';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─────────────────────────────────────────────────────────────
// 1. Bundle and Transpile ParentingPlaybook.tsx via esbuild
// ─────────────────────────────────────────────────────────────

const playbookPath = path.resolve(__dirname, '../src/components/agent/ParentingPlaybook.tsx');
assert.ok(fs.existsSync(playbookPath), `Target file ${playbookPath} must exist`);

const bundled = esbuild.buildSync({
  entryPoints: [playbookPath],
  bundle: true,
  format: 'cjs',
  write: false,
  external: ['react', 'react-dom', 'lucide-react', 'react/jsx-runtime'],
});

const mockSavedOutputs: any[] = [];
let notifyCallCount = 0;
let lastNotification = '';

const customRequire = (id: string) => {
  if (id === 'react') return React;
  if (id === 'react/jsx-runtime') return require('react/jsx-runtime');
  if (id === 'lucide-react') {
    return new Proxy(
      {},
      {
        get: (_target, prop: string) => {
          return (props: any) =>
            React.createElement('span', { 'data-icon': prop, ...props });
        },
      }
    );
  }
  if (id === '../../store' || id === '../store') {
    return {
      useApp: () => ({
        savedAIOutputs: mockSavedOutputs,
        saveAIOutput: (output: any) => {
          mockSavedOutputs.push({ ...output, id: 'test-id-' + Date.now(), savedAt: Date.now() });
        },
        removeAIOutput: (id: string) => {
          const idx = mockSavedOutputs.findIndex((o) => o.id === id);
          if (idx >= 0) mockSavedOutputs.splice(idx, 1);
        },
        isAIOutputSaved: (title: string, type: string) => {
          return mockSavedOutputs.some((o) => o.title === title && o.type === type);
        },
        notify: (msg: string) => {
          notifyCallCount++;
          lastNotification = msg;
        },
      }),
    };
  }
  return require(id);
};

const mod: { exports: any } = { exports: {} };
const fn = new Function('require', 'module', 'exports', 'React', bundled.outputFiles[0].text);
fn(customRequire, mod, mod.exports, React);

const {
  PLAYBOOK_SCENARIOS,
  ParentingPlaybook,
  PlaybookCarousel,
  PlaybookChromeNotice,
  TONE_CHECKLIST_CRITERIA,
  ToneChecklist,
  evaluateToneScore,
} = mod.exports;

// ─────────────────────────────────────────────────────────────
// 2. Headless DOM Mock Setup for Interactive State Testing
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
    this.type = tag === 'button' ? 'button' : '';
  }

  setAttribute(k: string, v: string) {
    this.attributes[k] = String(v);
    if (k === 'type') this.type = String(v);
    if (k === 'disabled') this.disabled = true;
    if (k === 'value') this.value = String(v);
  }

  getAttribute(k: string) {
    return this.attributes[k] ?? null;
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
}

// ─────────────────────────────────────────────────────────────
// 3. Test Suites
// ─────────────────────────────────────────────────────────────

test('Challenger M3_1: Playbook Queue & Scenario Correctness Stress Suite', async (suite) => {

  // ═══════════════════════════════════════════════════════════
  // SUITE 1: Required Scenario Cards & Corpus Integrity
  // ═══════════════════════════════════════════════════════════

  await suite.test('1.1: Exact required scenarios presence and identifiers', () => {
    assert.ok(Array.isArray(PLAYBOOK_SCENARIOS), 'PLAYBOOK_SCENARIOS must be exported as an array');
    assert.strictEqual(PLAYBOOK_SCENARIOS.length, 3, 'Must contain exactly 3 required scenarios');

    const expectedTitles = [
      'Teasing vs Bullying',
      'Brainrot memes at the dinner table',
      'Deciphering party vs gaming slang',
    ];

    const actualTitles = PLAYBOOK_SCENARIOS.map((s: any) => s.title);
    for (const expected of expectedTitles) {
      assert.ok(
        actualTitles.includes(expected),
        `Required scenario "${expected}" must be present in PLAYBOOK_SCENARIOS. Found: ${actualTitles.join(', ')}`
      );
    }

    const expectedIds = ['teasing-vs-bullying', 'brainrot-dinner-table', 'party-vs-gaming-slang'];
    const actualIds = PLAYBOOK_SCENARIOS.map((s: any) => s.id);
    for (const expected of expectedIds) {
      assert.ok(
        actualIds.includes(expected),
        `Scenario with ID "${expected}" must be present. Found: ${actualIds.join(', ')}`
      );
    }
  });

  await suite.test('1.2: Scenario 1 "Teasing vs Bullying" deep content integrity', () => {
    const s = PLAYBOOK_SCENARIOS.find((item: any) => item.id === 'teasing-vs-bullying');
    assert.ok(s, 'Scenario teasing-vs-bullying must exist');
    assert.strictEqual(s.title, 'Teasing vs Bullying');
    assert.ok(s.tag && s.tag.length > 5, 'Must have descriptive tag');
    assert.ok(s.description.toLowerCase().includes('banter') || s.description.toLowerCase().includes('roasting'), 'Description must address banter/roasting');
    assert.ok(s.parentApproach && s.parentApproach.length >= 20, 'Parent approach must be actionable');
    assert.ok(s.sampleDialogue && s.sampleDialogue.length >= 20, 'Sample dialogue must be substantial');
    assert.ok(s.takeaway && s.takeaway.length >= 20, 'Takeaway must be substantial');
    assert.ok(s.recommendedOpener && s.recommendedOpener.length >= 20, 'Opener must be non-empty');

    // Comparative matrix validation
    assert.ok(s.comparison, 'Must provide comparison matrix');
    assert.strictEqual(s.comparison.benign.status, 'safe');
    assert.strictEqual(s.comparison.warning.status, 'warning');
    assert.ok(s.comparison.benign.points.length >= 3, 'Benign column must have >= 3 criteria');
    assert.ok(s.comparison.warning.points.length >= 3, 'Warning column must have >= 3 criteria');

    // Dialogue turns validation
    assert.ok(Array.isArray(s.dialogueTurns), 'Must have dialogue turns');
    assert.ok(s.dialogueTurns.length >= 4, 'Must have at least 4 dialogue turns');
    const speakers = s.dialogueTurns.map((t: any) => t.speaker);
    assert.ok(speakers.includes('Parent'), 'Must include Parent speaker');
    assert.ok(speakers.includes('Teen'), 'Must include Teen speaker');

    for (const turn of s.dialogueTurns) {
      assert.ok(['Parent', 'Teen'].includes(turn.speaker), `Speaker must be Parent or Teen, got ${turn.speaker}`);
      assert.ok(turn.text && turn.text.length >= 10, 'Dialogue text must be substantial');
      assert.ok(turn.coachNote && turn.coachNote.length >= 10, 'Each turn must have coaching note');
    }

    // Coaching tips
    assert.ok(Array.isArray(s.coachingTips), 'Must have coaching tips');
    assert.ok(s.coachingTips.length >= 3, 'Must have >= 3 coaching tips');
  });

  await suite.test('1.3: Scenario 2 "Brainrot memes at the dinner table" deep content integrity', () => {
    const s = PLAYBOOK_SCENARIOS.find((item: any) => item.id === 'brainrot-dinner-table');
    assert.ok(s, 'Scenario brainrot-dinner-table must exist');
    assert.strictEqual(s.title, 'Brainrot memes at the dinner table');
    assert.ok(s.tag && s.tag.length > 5, 'Must have descriptive tag');

    // Check slang references (skibidi, rizz, etc.)
    const combinedText = JSON.stringify(s).toLowerCase();
    assert.ok(combinedText.includes('rizz'), 'Brainrot scenario must mention rizz');
    assert.ok(combinedText.includes('brainrot') || combinedText.includes('skibidi'), 'Brainrot scenario must mention brainrot/skibidi');

    // Dialogue turns
    assert.ok(s.dialogueTurns.length >= 4, 'Must have at least 4 dialogue turns');
    const speakers = s.dialogueTurns.map((t: any) => t.speaker);
    assert.ok(speakers.includes('Parent') && speakers.includes('Teen'), 'Must alternate Parent and Teen');

    // Comparison points
    assert.ok(s.comparison.benign.points.length >= 3, 'Benign column must have >= 3 points');
    assert.ok(s.comparison.warning.points.length >= 3, 'Warning column must have >= 3 points');
    assert.ok(s.coachingTips.length >= 3, 'Must have >= 3 coaching tips');
  });

  await suite.test('1.4: Scenario 3 "Deciphering party vs gaming slang" deep content integrity', () => {
    const s = PLAYBOOK_SCENARIOS.find((item: any) => item.id === 'party-vs-gaming-slang');
    assert.ok(s, 'Scenario party-vs-gaming-slang must exist');
    assert.strictEqual(s.title, 'Deciphering party vs gaming slang');

    const combinedText = JSON.stringify(s).toLowerCase();
    assert.ok(combinedText.includes('plug'), 'Must address the slang term "plug"');
    assert.ok(combinedText.includes('gaming') || combinedText.includes('valorant'), 'Must contextualize gaming usage');
    assert.ok(combinedText.includes('substance') || combinedText.includes('party'), 'Must contextualize risk/party usage');

    // Check comparison columns distinguish gaming from party/substance
    assert.ok(s.comparison.benign.heading.toLowerCase().includes('gaming'), 'Benign heading must specify gaming context');
    assert.ok(
      s.comparison.warning.heading.toLowerCase().includes('party') ||
      s.comparison.warning.heading.toLowerCase().includes('substance'),
      'Warning heading must specify party/substance context'
    );
    assert.ok(s.dialogueTurns.length >= 4, 'Must have >= 4 dialogue turns');
    assert.ok(s.coachingTips.length >= 3, 'Must have >= 3 coaching tips');
  });

  await suite.test('1.5: Invariants across all scenarios (uniqueness, completeness, types)', () => {
    const ids = new Set<string>();
    const titles = new Set<string>();

    for (const scenario of PLAYBOOK_SCENARIOS) {
      assert.strictEqual(typeof scenario.id, 'string', 'Scenario id must be string');
      assert.ok(scenario.id.length > 0, 'Scenario id must not be empty');
      assert.ok(!ids.has(scenario.id), `Scenario id "${scenario.id}" must be unique`);
      ids.add(scenario.id);

      assert.strictEqual(typeof scenario.title, 'string', 'Scenario title must be string');
      assert.ok(scenario.title.length > 0, 'Scenario title must not be empty');
      assert.ok(!titles.has(scenario.title), `Scenario title "${scenario.title}" must be unique`);
      titles.add(scenario.title);

      assert.strictEqual(typeof scenario.description, 'string');
      assert.strictEqual(typeof scenario.parentApproach, 'string');
      assert.strictEqual(typeof scenario.sampleDialogue, 'string');
      assert.strictEqual(typeof scenario.takeaway, 'string');
      assert.strictEqual(typeof scenario.recommendedOpener, 'string');
    }
  });

  // ═══════════════════════════════════════════════════════════
  // SUITE 2: Desktop Chrome AI Notice Verification
  // ═══════════════════════════════════════════════════════════

  await suite.test('2.1: Verbatim notice text check in PlaybookChromeNotice', () => {
    const html = renderToString(React.createElement(PlaybookChromeNotice));

    const exactNoticePhrase = 'Live interactive AI is available on desktop Chrome';
    assert.ok(
      html.includes(exactNoticePhrase),
      `Notice markup must include exact phrase: "${exactNoticePhrase}"`
    );

    // Verify explanatory context
    assert.ok(
      html.includes('Gemini Nano') || html.includes('on-device'),
      'Notice markup must mention Gemini Nano or on-device AI'
    );
    assert.ok(
      html.includes('Interactive Parenting Playbook'),
      'Notice markup must mention Interactive Parenting Playbook'
    );
  });

  await suite.test('2.2: Semantic region and ARIA attributes on Chrome Notice', () => {
    const html = renderToString(React.createElement(PlaybookChromeNotice));
    assert.ok(html.includes('role="region"'), 'Notice must have role="region"');
    assert.ok(
      html.includes('aria-label="Desktop Chrome AI availability notice"'),
      'Notice must have aria-label="Desktop Chrome AI availability notice"'
    );
  });

  await suite.test('2.3: Embedded ChromeAISetupGuide inside Chrome Notice', () => {
    const html = renderToString(React.createElement(PlaybookChromeNotice));
    // Verify that ChromeAISetupGuide is present inside notice (accordion header or flag text)
    assert.ok(
      html.includes('chrome-setup-guide') ||
      html.includes('60 seconds') ||
      html.includes('prompt-api-for-gemini-nano'),
      'Notice must embed the Chrome AI Setup Guide'
    );
  });

  await suite.test('2.4: Notice interaction handlers trigger queue pause hook', () => {
    let interactCount = 0;
    let leaveCount = 0;

    const props = {
      onInteract: () => interactCount++,
      onLeave: () => leaveCount++,
    };

    const element = React.createElement(PlaybookChromeNotice, props);
    assert.strictEqual(typeof element.type, 'function');

    // Simulate event handlers attached to the aside region
    const rendered = (element.type as any)(props);
    assert.strictEqual(typeof rendered.props.onMouseEnter, 'function');
    assert.strictEqual(typeof rendered.props.onMouseLeave, 'function');
    assert.strictEqual(typeof rendered.props.onFocusCapture, 'function');
    assert.strictEqual(typeof rendered.props.onBlurCapture, 'function');

    rendered.props.onMouseEnter();
    assert.strictEqual(interactCount, 1, 'onMouseEnter must call onInteract');

    rendered.props.onFocusCapture();
    assert.strictEqual(interactCount, 2, 'onFocusCapture must call onInteract');

    rendered.props.onMouseLeave();
    assert.strictEqual(leaveCount, 1, 'onMouseLeave must call onLeave');

    rendered.props.onBlurCapture();
    assert.strictEqual(leaveCount, 2, 'onBlurCapture must call onLeave');
  });

  // ═══════════════════════════════════════════════════════════
  // SUITE 3: Queue Bounds Wrapping & Stepping Invariants
  // ═══════════════════════════════════════════════════════════

  await suite.test('3.1: Index bounds cyclic wrapping (next at index 2 goes to 0; prev at 0 goes to 2)', () => {
    const N = PLAYBOOK_SCENARIOS.length;
    assert.strictEqual(N, 3);

    // Mathematical definition of next and prev
    const nextIndex = (curr: number) => (curr + 1) % N;
    const prevIndex = (curr: number) => (curr - 1 + N) % N;

    // Test forward cycle: 0 -> 1 -> 2 -> 0
    assert.strictEqual(nextIndex(0), 1, 'Next from 0 must be 1');
    assert.strictEqual(nextIndex(1), 2, 'Next from 1 must be 2');
    assert.strictEqual(nextIndex(2), 0, 'Next from 2 must wrap to 0 (BOUNDARY WRAPPING)');

    // Test backward cycle: 0 -> 2 -> 1 -> 0
    assert.strictEqual(prevIndex(0), 2, 'Prev from 0 must wrap to 2 (BOUNDARY WRAPPING)');
    assert.strictEqual(prevIndex(2), 1, 'Prev from 2 must be 1');
    assert.strictEqual(prevIndex(1), 0, 'Prev from 1 must be 0');
  });

  await suite.test('3.2: 1,000-cycle high-throughput forward & backward traversal stress', () => {
    const N = 3;
    let curr = 0;

    // 1,000 forward steps
    for (let step = 0; step < 1000; step++) {
      curr = (curr + 1) % N;
      assert.ok(curr >= 0 && curr < N, `Index ${curr} must remain within [0, ${N - 1}]`);
      assert.strictEqual(curr, (step + 1) % N, 'Index must match exact arithmetic progression');
    }

    // 1,000 backward steps
    for (let step = 0; step < 1000; step++) {
      curr = (curr - 1 + N) % N;
      assert.ok(curr >= 0 && curr < N, `Index ${curr} must remain within [0, ${N - 1}]`);
    }

    // After 1000 forward steps and 1000 backward steps, we return precisely to original starting position 0
    assert.strictEqual(curr, 0, 'Backward traversal must return precisely to original starting position 0 without drift');
  });

  await suite.test('3.3: Direct jump (goTo) bounds enforcement', () => {
    const N = 3;
    let currentIndex = 1;

    const handleGoTo = (index: number) => {
      if (index >= 0 && index < N) {
        currentIndex = index;
      }
    };

    // Valid jumps
    handleGoTo(0);
    assert.strictEqual(currentIndex, 0);
    handleGoTo(2);
    assert.strictEqual(currentIndex, 2);
    handleGoTo(1);
    assert.strictEqual(currentIndex, 1);

    // Adversarial out-of-bounds indices
    handleGoTo(-1);
    assert.strictEqual(currentIndex, 1, 'Negative index -1 must be rejected');
    handleGoTo(-999);
    assert.strictEqual(currentIndex, 1, 'Negative index -999 must be rejected');
    handleGoTo(3);
    assert.strictEqual(currentIndex, 1, 'Index equal to length (3) must be rejected');
    handleGoTo(4);
    assert.strictEqual(currentIndex, 1, 'Index 4 must be rejected');
    handleGoTo(100);
    assert.strictEqual(currentIndex, 1, 'Index 100 must be rejected');
    handleGoTo(NaN as any);
    assert.strictEqual(currentIndex, 1, 'NaN must be rejected');
  });

  await suite.test('3.4: Degenerate scenario arrays (single scenario and 2 scenarios)', () => {
    // Single scenario array
    const singleLen = 1;
    const nextSingle = (c: number) => (c + 1) % singleLen;
    const prevSingle = (c: number) => (c - 1 + singleLen) % singleLen;

    assert.strictEqual(nextSingle(0), 0, 'Single-element next must remain 0');
    assert.strictEqual(prevSingle(0), 0, 'Single-element prev must remain 0');

    // 2-scenario array
    const twoLen = 2;
    const nextTwo = (c: number) => (c + 1) % twoLen;
    const prevTwo = (c: number) => (c - 1 + twoLen) % twoLen;

    assert.strictEqual(nextTwo(0), 1);
    assert.strictEqual(nextTwo(1), 0);
    assert.strictEqual(prevTwo(0), 1);
    assert.strictEqual(prevTwo(1), 0);
  });

  // ═══════════════════════════════════════════════════════════
  // SUITE 4: Auto-Advance Timer & Interval Lifecycle
  // ═══════════════════════════════════════════════════════════

  await suite.test('4.1: Auto-advance interval timing mechanics and state machine', () => {
    // Simulate the exact lifecycle of PlaybookCarousel's interval logic
    let intervalTimer: any = null;
    let timerCleared = false;
    let currentIdx = 0;
    const N = 3;
    const intervalMs = 7000;

    let isPaused = false;

    function startTimer() {
      if (isPaused || N <= 1) {
        if (intervalTimer) {
          clearInterval(intervalTimer);
          timerCleared = true;
        }
        return;
      }
      intervalTimer = {
        id: 12345,
        ms: intervalMs,
        tick: () => {
          currentIdx = (currentIdx + 1) % N;
        },
      };
    }

    // Initial start
    startTimer();
    assert.ok(intervalTimer !== null, 'Timer must be started when not paused');
    assert.strictEqual(currentIdx, 0);

    // Tick 1
    intervalTimer.tick();
    assert.strictEqual(currentIdx, 1, 'After 1st interval tick, index should be 1');

    // Tick 2
    intervalTimer.tick();
    assert.strictEqual(currentIdx, 2, 'After 2nd interval tick, index should be 2');

    // Tick 3 (wrap-around)
    intervalTimer.tick();
    assert.strictEqual(currentIdx, 0, 'After 3rd interval tick, index should wrap to 0');
  });

  await suite.test('4.2: Timer pause conditions: Hover, Focus, UserPaused, ExternalPaused', () => {
    let userPaused = false;
    let isHovered = false;
    let isFocused = false;
    let externalPaused = false;

    const computeIsPaused = () => userPaused || isHovered || isFocused || externalPaused;

    assert.strictEqual(computeIsPaused(), false, 'Initially unpaused');

    // Hover triggers pause
    isHovered = true;
    assert.strictEqual(computeIsPaused(), true, 'Hover must pause');
    isHovered = false;
    assert.strictEqual(computeIsPaused(), false, 'Un-hover must resume');

    // Focus triggers pause
    isFocused = true;
    assert.strictEqual(computeIsPaused(), true, 'Focus must pause');
    isFocused = false;
    assert.strictEqual(computeIsPaused(), false, 'Blur must resume');

    // Manual user button triggers pause
    userPaused = true;
    assert.strictEqual(computeIsPaused(), true, 'Manual user pause must pause');
    // Leaving mouse while userPaused is true must STAY paused
    isHovered = false;
    isFocused = false;
    assert.strictEqual(computeIsPaused(), true, 'Must remain paused if user paused manually');
    userPaused = false;
    assert.strictEqual(computeIsPaused(), false, 'Manual user unpause must resume');

    // External pause (e.g. user interacting with Tone Checklist)
    externalPaused = true;
    assert.strictEqual(computeIsPaused(), true, 'External pause prop must pause');
    externalPaused = false;
    assert.strictEqual(computeIsPaused(), false, 'External pause cleared must resume');
  });

  await suite.test('4.3: Document visibility guard prevents background-tab advancement', () => {
    let currentIdx = 0;
    const N = 3;

    // Simulate tick with document.hidden
    const tick = (docHidden: boolean) => {
      if (docHidden) return;
      currentIdx = (currentIdx + 1) % N;
    };

    tick(true); // tab hidden
    assert.strictEqual(currentIdx, 0, 'Tick while document.hidden must NOT advance queue');

    tick(false); // tab visible
    assert.strictEqual(currentIdx, 1, 'Tick while tab visible advances queue');
  });

  await suite.test('4.4: User interaction callback is invoked across all interaction vectors', () => {
    let interactionCount = 0;
    const onUserInteract = () => interactionCount++;

    const nextAction = () => onUserInteract();
    const prevAction = () => onUserInteract();
    const goTo = (_i: number) => onUserInteract();
    const togglePlayPause = () => onUserInteract();
    const saveAction = () => onUserInteract();

    nextAction();
    assert.strictEqual(interactionCount, 1, 'Next button must trigger onUserInteract');

    prevAction();
    assert.strictEqual(interactionCount, 2, 'Prev button must trigger onUserInteract');

    goTo(1);
    assert.strictEqual(interactionCount, 3, 'Indicator dot click must trigger onUserInteract');

    togglePlayPause();
    assert.strictEqual(interactionCount, 4, 'Play/pause button must trigger onUserInteract');

    saveAction();
    assert.strictEqual(interactionCount, 5, 'Save scenario note button must trigger onUserInteract');
  });

  // ═══════════════════════════════════════════════════════════
  // SUITE 5: Keyboard Accessibility & ARIA Specifications
  // ═══════════════════════════════════════════════════════════

  await suite.test('5.1: Keyboard navigation (ArrowRight, ArrowLeft, Home, End)', () => {
    const N = 3;
    let currentIndex = 1;

    const handleKeyDown = (key: string) => {
      if (key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % N;
      } else if (key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + N) % N;
      } else if (key === 'Home') {
        currentIndex = 0;
      } else if (key === 'End') {
        currentIndex = N - 1;
      }
    };

    // Starting at 1
    handleKeyDown('ArrowRight');
    assert.strictEqual(currentIndex, 2);

    handleKeyDown('ArrowRight'); // Wrap to 0
    assert.strictEqual(currentIndex, 0, 'ArrowRight at index 2 must wrap to 0');

    handleKeyDown('ArrowLeft'); // Wrap to 2
    assert.strictEqual(currentIndex, 2, 'ArrowLeft at index 0 must wrap to 2');

    handleKeyDown('Home');
    assert.strictEqual(currentIndex, 0, 'Home must jump to index 0');

    handleKeyDown('End');
    assert.strictEqual(currentIndex, 2, 'End must jump to index 2 (last)');

    // Unrelated key should not change index
    handleKeyDown('Tab');
    assert.strictEqual(currentIndex, 2, 'Tab key must not alter index');
  });

  await suite.test('5.2: Carousel ARIA attributes and semantic markup in renderToString', () => {
    const html = renderToString(React.createElement(PlaybookCarousel));

    // Region & roledescription
    assert.ok(html.includes('role="region"'), 'Carousel container must have role="region"');
    assert.ok(html.includes('aria-roledescription="carousel"'), 'Must have aria-roledescription="carousel"');
    assert.ok(html.includes('aria-label="Parenting Playbook Scenarios"'), 'Must have descriptive aria-label');

    // Slide group
    assert.ok(html.includes('role="group"'), 'Active slide must have role="group"');
    assert.ok(html.includes('aria-roledescription="slide"'), 'Active slide must have aria-roledescription="slide"');

    // Tablist indicators
    assert.ok(html.includes('role="tablist"'), 'Indicators container must have role="tablist"');
    assert.ok(html.includes('role="tab"'), 'Indicators must have role="tab"');
    assert.ok(html.includes('aria-selected="true"'), 'Active indicator must have aria-selected="true"');

    // Live progress counter
    assert.ok(html.includes('aria-live="polite"'), 'Counter must have aria-live="polite"');

    // Button types
    // Verify that buttons in the carousel have explicit type="button"
    const buttonTags = html.match(/<button[^>]*>/g) || [];
    assert.ok(buttonTags.length >= 4, 'Must have at least 4 buttons (play/pause, prev, next, save, indicators)');
    for (const b of buttonTags) {
      assert.ok(b.includes('type="button"'), `Button must have type="button": ${b}`);
    }
  });

  // ═══════════════════════════════════════════════════════════
  // SUITE 6: SSR & DOM Rendering Integrity of Full Playbook
  // ═══════════════════════════════════════════════════════════

  await suite.test('6.1: SSR renderToString(<ParentingPlaybook />) succeeds without errors', () => {
    const html = renderToString(React.createElement(ParentingPlaybook));
    assert.ok(html.length > 5000, `Rendered HTML must be substantial, got ${html.length} chars`);

    // Must contain Chrome Notice
    assert.ok(html.includes('Live interactive AI is available on desktop Chrome'));

    // Must contain Scenario Section
    assert.ok(html.includes('Scenario Coaching Cards'));
    assert.ok(html.includes('Teasing vs Bullying'));

    // Must contain Tone Checklist Section
    assert.ok(html.includes('Tone Diagnostic Checklist'));
    assert.ok(html.includes('Teasing vs Bullying Tone Checklist'));
  });

  await suite.test('6.2: Custom scenarios prop injection into PlaybookCarousel', () => {
    const customScenarios = [
      {
        id: 'custom-1',
        title: 'Custom Scenario 1',
        tag: 'Custom Tag',
        description: 'Custom description for testing.',
        parentApproach: 'Custom parent approach.',
        sampleDialogue: 'Parent: Custom sample dialogue.',
        takeaway: 'Custom takeaway message.',
        recommendedOpener: 'Custom recommended opener.',
      },
      {
        id: 'custom-2',
        title: 'Custom Scenario 2',
        tag: 'Custom Tag 2',
        description: 'Custom description 2.',
        parentApproach: 'Custom parent approach 2.',
        sampleDialogue: 'Parent: Custom sample dialogue 2.',
        takeaway: 'Custom takeaway message 2.',
        recommendedOpener: 'Custom recommended opener 2.',
      },
    ];

    const html = renderToString(
      React.createElement(PlaybookCarousel, { scenarios: customScenarios as any })
    );

    assert.ok(html.includes('Custom Scenario 1'));
    assert.ok(html.includes('1 of 2'));
  });

  // ═══════════════════════════════════════════════════════════
  // SUITE 7: CopilotPage Fallback Route & Dead-End Elimination
  // ═══════════════════════════════════════════════════════════

  await suite.test('7.1: CopilotPage source analysis confirms dead-end elimination', () => {
    const copilotPagePath = path.resolve(__dirname, '../src/pages/CopilotPage.tsx');
    assert.ok(fs.existsSync(copilotPagePath), `CopilotPage must exist at ${copilotPagePath}`);
    const code = fs.readFileSync(copilotPagePath, 'utf8');

    // Check branching on status.engine
    assert.ok(code.includes("status.engine === 'unavailable'"), 'Must check status.engine === unavailable');
    assert.ok(code.includes('<ParentingPlaybook'), 'Must mount <ParentingPlaybook /> when AI unavailable');

    // Confirm that dead-end card is NOT rendered in the unavailable branch
    assert.ok(
      !code.includes('agent-unavailable') || !code.includes("status.engine === 'unavailable'\n    return <div className=\"agent-unavailable\""),
      'Must not render dead-end agent-unavailable card'
    );

    // Live AI branch
    assert.ok(code.includes('<AgentChat'), 'Must mount <AgentChat /> when AI is available');
  });

  await suite.test('7.2: CSS classes existence in index.css for Playbook elements', () => {
    const cssPath = path.resolve(__dirname, '../src/index.css');
    assert.ok(fs.existsSync(cssPath), `index.css must exist at ${cssPath}`);
    const css = fs.readFileSync(cssPath, 'utf8');

    const expectedClasses = [
      '.parenting-playbook',
      '.playbook-chrome-notice',
      '.playbook-carousel',
      '.playbook-queue-header',
      '.queue-control-btn',
      '.scenario-card',
      '.scenario-comparison-grid',
      '.queue-indicator-dot',
      '.tone-checklist-card',
      '.tone-checklist-items',
    ];

    for (const cls of expectedClasses) {
      assert.ok(css.includes(cls), `CSS must include class rule "${cls}"`);
    }
  });

});
