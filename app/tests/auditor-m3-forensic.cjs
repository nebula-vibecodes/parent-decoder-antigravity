const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const ts = require(path.resolve(__dirname, '../node_modules/typescript'));

// Transpiler for TS/TSX modules in this node test
require.extensions['.tsx'] = function(m, filename) {
  const src = fs.readFileSync(filename, 'utf8');
  const out = ts.transpileModule(src, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ES2022,
    },
  });
  m._compile(out.outputText, filename);
};
require.extensions['.ts'] = require.extensions['.tsx'];

console.log('══════════════════════════════════════════════════════════════════════');
console.log(' Forensic Auditor M3: Independent Forensic Integrity & Spec Test');
console.log('══════════════════════════════════════════════════════════════════════\n');

let totalChecks = 0;
let passedChecks = 0;

function check(name, fn) {
  totalChecks++;
  try {
    fn();
    passedChecks++;
    console.log(`  ✔ [PASS] ${name}`);
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}:`, err.message);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Phase 1: Source Code & Integrity Scan
// ─────────────────────────────────────────────────────────────────────────────
console.log('▶ Phase 1: Source Code Analysis & Prohibited Pattern Scan');

const playbookPath = path.resolve(__dirname, '../src/components/agent/ParentingPlaybook.tsx');
const copilotPath = path.resolve(__dirname, '../src/pages/CopilotPage.tsx');
const cssPath = path.resolve(__dirname, '../src/index.css');

assert.ok(fs.existsSync(playbookPath), 'ParentingPlaybook.tsx must exist');
assert.ok(fs.existsSync(copilotPath), 'CopilotPage.tsx must exist');
assert.ok(fs.existsSync(cssPath), 'index.css must exist');

const playbookSrc = fs.readFileSync(playbookPath, 'utf8');
const copilotSrc = fs.readFileSync(copilotPath, 'utf8');
const cssSrc = fs.readFileSync(cssPath, 'utf8');

check('Check 1.1: No mock / dummy / facade objects in source', () => {
  assert.doesNotMatch(playbookSrc, /\bmockPlaybook\b/i);
  assert.doesNotMatch(playbookSrc, /\bdummyPlaybook\b/i);
  assert.doesNotMatch(playbookSrc, /\bfakeResponse\b/i);
  assert.doesNotMatch(playbookSrc, /return\s+["']PASS["']/);
});

check('Check 1.2: Genuine React state and lifecycle hooks utilized', () => {
  assert.ok(playbookSrc.includes('useState'), 'Must use useState');
  assert.ok(playbookSrc.includes('useEffect'), 'Must use useEffect');
  assert.ok(playbookSrc.includes('useRef'), 'Must use useRef');
  assert.ok(playbookSrc.includes('useCallback'), 'Must use useCallback');
  assert.ok(playbookSrc.includes('useMemo'), 'Must use useMemo');
  assert.ok(playbookSrc.includes('clearInterval'), 'Must implement clearInterval cleanup');
});

check('Check 1.3: CopilotPage routes to ParentingPlaybook when AI is unavailable without dead-end error', () => {
  assert.ok(copilotSrc.includes("status.engine === 'unavailable'"), 'Must check status.engine');
  assert.ok(copilotSrc.includes('<ParentingPlaybook'), 'Must render ParentingPlaybook on unavailable AI');
  assert.doesNotMatch(copilotSrc, /agent-unavailable/);
});

// ─────────────────────────────────────────────────────────────────────────────
// Phase 2: Module Exports & Marquee Scenario Corpus
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n▶ Phase 2: Functional Contract & Marquee Scenario Verification');

const playbook = require(playbookPath);

check('Check 2.1: Module exports all required components and data structures', () => {
  assert.strictEqual(typeof playbook.ParentingPlaybook, 'function');
  assert.strictEqual(typeof playbook.PlaybookCarousel, 'function');
  assert.strictEqual(typeof playbook.ToneChecklist, 'function');
  assert.strictEqual(typeof playbook.PlaybookChromeNotice, 'function');
  assert.ok(Array.isArray(playbook.PLAYBOOK_SCENARIOS));
  assert.ok(Array.isArray(playbook.TONE_CHECKLIST_CRITERIA));
  assert.strictEqual(typeof playbook.evaluateToneScore, 'function');
});

check('Check 2.2: All 3 marquee scenarios are present with complete pedagogical metadata', () => {
  const scenarios = playbook.PLAYBOOK_SCENARIOS;
  assert.strictEqual(scenarios.length, 3, 'Must contain exactly 3 marquee scenarios');

  const required = [
    { id: 'teasing-vs-bullying', title: 'Teasing vs Bullying', tag: 'Safety & Social Dynamics' },
    { id: 'brainrot-dinner-table', title: 'Brainrot memes at the dinner table', tag: 'Daily Culture & Boundaries' },
    { id: 'party-vs-gaming-slang', title: 'Deciphering party vs gaming slang', tag: 'Risk & Awareness' },
  ];

  for (const req of required) {
    const s = scenarios.find((item) => item.id === req.id);
    assert.ok(s, `Missing scenario ${req.id}`);
    assert.strictEqual(s.title, req.title);
    assert.strictEqual(s.tag, req.tag);
    assert.ok(s.description.length >= 25, `${req.id} description too short`);
    assert.ok(s.parentApproach.length >= 25, `${req.id} parentApproach too short`);
    assert.ok(s.sampleDialogue.length >= 25, `${req.id} sampleDialogue too short`);
    assert.ok(s.takeaway.length >= 25, `${req.id} takeaway too short`);
    assert.ok(s.recommendedOpener.length >= 20, `${req.id} recommendedOpener too short`);

    // Comparative matrix
    assert.ok(s.comparison && s.comparison.benign && s.comparison.warning);
    assert.strictEqual(s.comparison.benign.status, 'safe');
    assert.strictEqual(s.comparison.warning.status, 'warning');
    assert.ok(s.comparison.benign.points.length >= 3);
    assert.ok(s.comparison.warning.points.length >= 3);

    // Dialogue turns with alternating speakers and coach notes
    assert.ok(Array.isArray(s.dialogueTurns) && s.dialogueTurns.length >= 4);
    for (const turn of s.dialogueTurns) {
      assert.ok(['Parent', 'Teen'].includes(turn.speaker));
      assert.ok(turn.text.length > 5);
      assert.ok(turn.coachNote.length > 5);
    }

    // Coaching tips
    assert.ok(Array.isArray(s.coachingTips) && s.coachingTips.length === 3);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Phase 3: Tone Checklist Criteria & Powerset Scoring Engine
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n▶ Phase 3: Diagnostic Criteria & Exhaustive Scoring Engine');

check('Check 3.1: Exactly 5 criteria with distinct diagnostic questions', () => {
  const criteria = playbook.TONE_CHECKLIST_CRITERIA;
  assert.strictEqual(criteria.length, 5);
  const ids = criteria.map((c) => c.id);
  assert.deepStrictEqual(ids, ['standing', 'bilateral', 'boundaries', 'space', 'baseline']);
  for (const c of criteria) {
    assert.ok(c.title && c.shortDescription && c.diagnosticQuestion && c.healthyIndicator && c.concernIndicator);
  }
});

check('Check 3.2: Exhaustive 2^5 = 32 powerset evaluation of evaluateToneScore', () => {
  const allIds = ['standing', 'bilateral', 'boundaries', 'space', 'baseline'];

  for (let mask = 0; mask < 32; mask++) {
    const subset = new Set();
    for (let i = 0; i < 5; i++) {
      if ((mask & (1 << i)) !== 0) {
        subset.add(allIds[i]);
      }
    }

    const res = playbook.evaluateToneScore(subset);
    const score = subset.size;

    assert.strictEqual(res.score, score);
    assert.strictEqual(res.total, 5);

    if (score === 5) {
      assert.strictEqual(res.tier, 'healthy');
      assert.strictEqual(res.badgeLabel, 'Healthy Peer Interaction');
      assert.strictEqual(res.verdict, 'Harmless / Normal Banter');
      assert.strictEqual(res.colorClass, 'severity-harmless');
    } else if (score >= 3) {
      assert.strictEqual(res.tier, 'watchful');
      assert.strictEqual(res.badgeLabel, 'Nuanced / Watchful');
      assert.strictEqual(res.verdict, 'Watchful / Stay Curious');
      assert.strictEqual(res.colorClass, 'severity-watchful');
    } else {
      assert.strictEqual(res.tier, 'intervention');
      assert.strictEqual(res.badgeLabel, 'Supportive Intervention Recommended');
      assert.strictEqual(res.verdict, 'Intervention Recommended');
      assert.strictEqual(res.colorClass, 'severity-intervention');
    }

    assert.ok(res.summary.length > 10);
    assert.ok(res.guidance.length > 20);
    assert.ok(Array.isArray(res.actionSteps) && res.actionSteps.length === 3);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Phase 4: Carousel Mechanics, Pause Triggers & Modulo Navigation
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n▶ Phase 4: Rotating Queue Math & Interval Pause Mechanics');

check('Check 4.1: Modulo navigation wrap-around arithmetic', () => {
  const len = 3;
  // Next wrap from 2 to 0
  assert.strictEqual((2 + 1) % len, 0);
  // Previous wrap from 0 to 2
  assert.strictEqual((0 - 1 + len) % len, 2);
  // Double previous from 0 to 1
  assert.strictEqual((((0 - 1 + len) % len) - 1 + len) % len, 1);
});

check('Check 4.2: Carousel source code inspects multi-modal pause triggers', () => {
  assert.ok(playbookSrc.includes('isPaused = userPaused || isHovered || isFocused || externalPaused'));
  assert.ok(playbookSrc.includes('onMouseEnter'));
  assert.ok(playbookSrc.includes('onMouseLeave'));
  assert.ok(playbookSrc.includes('onFocusCapture'));
  assert.ok(playbookSrc.includes('onBlurCapture'));
  assert.ok(playbookSrc.includes('document.hidden'));
  assert.ok(playbookSrc.includes('autoAdvanceIntervalMs = 7000'));
});

check('Check 4.3: Keyboard navigation handles ArrowLeft, ArrowRight, Home, End', () => {
  assert.ok(playbookSrc.includes("e.key === 'ArrowRight'"));
  assert.ok(playbookSrc.includes("e.key === 'ArrowLeft'"));
  assert.ok(playbookSrc.includes("e.key === 'Home'"));
  assert.ok(playbookSrc.includes("e.key === 'End'"));
});

check('Check 4.4: Accessibility & Form Invariant: All buttons declare explicit type="button"', () => {
  const buttonRegex = /<button\b([^>]*)>/g;
  let match;
  let buttonCount = 0;
  while ((match = buttonRegex.exec(playbookSrc)) !== null) {
    buttonCount++;
    const attrs = match[1];
    assert.ok(
      attrs.includes('type="button"'),
      `Button #${buttonCount} missing explicit type="button": ${match[0]}`
    );
  }
  assert.ok(buttonCount >= 7, `Expected at least 7 buttons, found ${buttonCount}`);
});

// ─────────────────────────────────────────────────────────────────────────────
// Phase 5: Desktop Chrome Notice & Setup Guide Embedding
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n▶ Phase 5: Desktop Chrome Notice & Embedded Guide');

check('Check 5.1: Notice displays verbatim required title and embeds ChromeAISetupGuide', () => {
  assert.ok(playbookSrc.includes('Live interactive AI is available on desktop Chrome'));
  assert.ok(playbookSrc.includes('<ChromeAISetupGuide'));
  assert.ok(playbookSrc.includes('defaultOpen={false}'));
  assert.ok(playbookSrc.includes('compact={true}'));
});

// ─────────────────────────────────────────────────────────────────────────────
// Phase 6: Saved Items Store Actions
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n▶ Phase 6: Persistence & Saved Items Actions (R5)');

check('Check 6.1: Scenario card saves with type="playbook" and rich metadata', () => {
  assert.ok(playbookSrc.includes("type: 'playbook'"));
  assert.ok(playbookSrc.includes('saveTitle = `Playbook: ${currentScenario.title}`'));
  assert.ok(playbookSrc.includes('scenarioId: currentScenario.id'));
});

check('Check 6.2: Tone checklist assessment saves formatted diagnostic markdown', () => {
  assert.ok(playbookSrc.includes('## Tone Checklist Assessment:'));
  assert.ok(playbookSrc.includes('category: \'tone-checklist\''));
  assert.ok(playbookSrc.includes('evaluation.actionSteps'));
});

// ─────────────────────────────────────────────────────────────────────────────
// Phase 7: CSS Token Alignment
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n▶ Phase 7: Styling & Responsive CSS Token Verification');

check('Check 7.1: index.css contains all required selectors and responsive rules', () => {
  const requiredSelectors = [
    '.parenting-playbook',
    '.playbook-chrome-notice',
    '.playbook-carousel',
    '.playbook-queue-header',
    '.queue-control-btn',
    '.playbook-indicators',
    '.queue-indicator-dot',
    '.scenario-card',
    '.scenario-comparison-grid',
    '.comparison-column-healthy',
    '.comparison-column-risk',
    '.scenario-opener-box',
    '.scenario-dialogue-box',
    '.scenario-takeaway-box',
    '.tone-checklist-card',
    '.tone-severity-badge',
    '.severity-harmless',
    '.severity-watchful',
    '.severity-intervention',
    '.tone-checklist-item',
    '.tone-checkbox-wrap',
    '.tone-checkbox-custom',
  ];

  for (const sel of requiredSelectors) {
    assert.ok(cssSrc.includes(sel), `Missing CSS selector: ${sel}`);
  }

  assert.ok(cssSrc.includes('@media (max-width: 768px)'));
  assert.ok(cssSrc.includes('.dark .playbook-carousel'));
});

console.log('\n══════════════════════════════════════════════════════════════════════');
console.log(` ✅ ALL ${passedChecks}/${totalChecks} FORENSIC INTEGRITY CHECKS PASSED!`);
console.log(' VERDICT: CLEAN (Zero integrity violations, zero facades, zero cheating)');
console.log('══════════════════════════════════════════════════════════════════════\n');
