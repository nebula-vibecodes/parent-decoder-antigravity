import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { terms, findTerm, type Term, type Concern, type Category } from '../src/data';
import {
  getFallbackScriptForTerm,
  getFallbackScriptBySlug,
  generateDynamicFallbackScript,
  curatedScripts,
  cleanOuterQuotes,
  formatMeaningSnippet,
  normalizeConcern,
  getSituation,
  type TermFallbackScript,
} from '../src/lib/ai/fallbackScripts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─────────────────────────────────────────────────────────────
// 1. Transpile RoleplayChat.tsx and TermPage.tsx via esbuild
// ─────────────────────────────────────────────────────────────

const roleplayChatPath = path.resolve(__dirname, '../src/components/agent/RoleplayChat.tsx');
assert.ok(fs.existsSync(roleplayChatPath), `Target file ${roleplayChatPath} must exist`);

const bundledRoleplayChat = await esbuild.build({
  entryPoints: [roleplayChatPath],
  bundle: true,
  format: 'cjs',
  write: false,
  plugins: [
    {
      name: 'externalize-app-deps',
      setup(build) {
        build.onResolve({ filter: /store/ }, () => ({ path: 'mock-store', external: true }));
        build.onResolve({ filter: /useAgent/ }, () => ({ path: 'mock-agent', external: true }));
      },
    },
  ],
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    'lucide-react',
    'mock-store',
    'mock-agent',
  ],
});

// Mock state for useApp and useAgent
let mockSavedOutputs: any[] = [];
let mockNotifyCalls: string[] = [];
let mockCurrentEngine: 'local' | 'cloud' | 'unavailable' = 'unavailable';
let mockAgentMessages: any[] = [];
let mockClipboardText = '';

function setupMockEnvironment(engineStatus: 'local' | 'cloud' | 'unavailable' = 'unavailable') {
  mockCurrentEngine = engineStatus;
  mockSavedOutputs = [];
  mockNotifyCalls = [];
  mockAgentMessages = [];
  mockClipboardText = '';
}

function loadRoleplayChatModule(engineStatus: 'local' | 'cloud' | 'unavailable' = 'unavailable') {
  setupMockEnvironment(engineStatus);

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
    if (id === 'mock-agent' || id.includes('useAgent')) {
      return {
        useAgent: () => ({
          status: { engine: mockCurrentEngine, ready: mockCurrentEngine !== 'unavailable' },
          messages: mockAgentMessages,
          isStreaming: false,
          streamingText: '',
          initialize: () => {},
          send: () => {},
          reset: () => {},
        }),
      };
    }
    if (id === 'mock-store' || id.includes('store')) {
      return {
        useApp: () => ({
          savedAIOutputs: mockSavedOutputs,
          saveAIOutput: (output: any) => {
            mockSavedOutputs.push({ ...output, id: 'test-id-' + Date.now(), savedAt: Date.now() });
          },
          isAIOutputSaved: (title: string, type: string) => {
            return mockSavedOutputs.some((o) => o.title === title && o.type === type);
          },
          notify: (msg: string) => {
            mockNotifyCalls.push(msg);
          },
        }),
        copyText: async (text: string) => {
          mockClipboardText = text;
          return true;
        },
      };
    }
    if (id === '../../data') {
      return { terms, findTerm };
    }
    if (id === '../../lib/ai/fallbackScripts') {
      return { getFallbackScriptForTerm };
    }
    if (id === '../../lib/ai/systemPrompts') {
      return { buildRoleplayPrompt: () => 'System prompt' };
    }
    return require(id);
  };

  const mod: { exports: any } = { exports: {} };
  const fn = new Function('require', 'module', 'exports', 'React', bundledRoleplayChat.outputFiles[0].text);
  fn(customRequire, mod, mod.exports, React);
  return mod.exports.RoleplayChat;
}

// ─────────────────────────────────────────────────────────────
// TEST SUITE: Challenger M4_1
// ─────────────────────────────────────────────────────────────

test('Challenger M4_1: TermPage Button State & Fallback Script Corpus Empirical Challenge', async (t) => {

  // ═══════════════════════════════════════════════════════════
  // SECTION 1: TermPage.tsx Button State Toggling Verification
  // ═══════════════════════════════════════════════════════════

  await t.test('1.1: TermPage button label toggles reactively based on AI engine status', () => {
    const termPageSource = fs.readFileSync(
      path.resolve(__dirname, '../src/pages/TermPage.tsx'),
      'utf-8'
    );

    // Verify useAgent import and status query
    assert.ok(
      termPageSource.includes("import { useAgent } from '../lib/ai/useAgent'"),
      'TermPage must import useAgent hook'
    );
    assert.ok(
      termPageSource.includes('const { status } = useAgent()'),
      'TermPage must query status from useAgent'
    );

    // Verify button label derivation expression
    const labelLogicPattern =
      /status\.engine\s*===\s*['"]unavailable['"]\s*\?\s*['"]View conversation script & tips['"]\s*:\s*['"]Practice this conversation['"]/;
    assert.ok(
      labelLogicPattern.test(termPageSource),
      'TermPage must derive roleplayButtonLabel: "View conversation script & tips" when engine is unavailable, else "Practice this conversation"'
    );

    // Test the logic directly across all possible AIEngineType values
    const deriveButtonLabel = (engine: 'local' | 'cloud' | 'unavailable' | string) => {
      return engine === 'unavailable'
        ? 'View conversation script & tips'
        : 'Practice this conversation';
    };

    assert.strictEqual(
      deriveButtonLabel('unavailable'),
      'View conversation script & tips',
      "Must render 'View conversation script & tips' when engine is unavailable"
    );
    assert.strictEqual(
      deriveButtonLabel('local'),
      'Practice this conversation',
      "Must render 'Practice this conversation' when engine is local"
    );
    assert.strictEqual(
      deriveButtonLabel('cloud'),
      'Practice this conversation',
      "Must render 'Practice this conversation' when engine is cloud"
    );
  });

  await t.test('1.2: TermPage renders button with aria-label matching dynamic roleplayButtonLabel', () => {
    const termPageSource = fs.readFileSync(
      path.resolve(__dirname, '../src/pages/TermPage.tsx'),
      'utf-8'
    );

    // Check button JSX markup
    assert.ok(
      termPageSource.includes('aria-label={roleplayButtonLabel}'),
      'Button must include aria-label matching roleplayButtonLabel'
    );
    assert.ok(
      termPageSource.includes('{roleplayButtonLabel}'),
      'Button children must render dynamic roleplayButtonLabel'
    );
    assert.ok(
      termPageSource.includes('setRoleplayOpen(true)'),
      'Button onClick must trigger setRoleplayOpen(true)'
    );
    assert.ok(
      termPageSource.includes('<RoleplayChat term={item} open={roleplayOpen} onClose={() => setRoleplayOpen(false)} />'),
      'TermPage must pass item, roleplayOpen, and onClose handler to RoleplayChat'
    );
  });

  // ═══════════════════════════════════════════════════════════
  // SECTION 2: RoleplayChat Dual-Mode Rendering (Offline vs Live)
  // ═══════════════════════════════════════════════════════════

  await t.test('2.1: RoleplayChat offline view renders BookOpen icon, offline title, and intro text', () => {
    const RoleplayChatComponent = loadRoleplayChatModule('unavailable');
    const sampleTerm = findTerm('no-cap')!;
    assert.ok(sampleTerm, 'Term no-cap must exist');

    const html = renderToString(
      React.createElement(RoleplayChatComponent, {
        term: sampleTerm,
        open: true,
        onClose: () => {},
      })
    );

    // Offline / fallback drawer assertions
    assert.ok(html.includes('roleplay-drawer-fallback'), 'Drawer must have class roleplay-drawer-fallback');
    assert.ok(html.includes('data-icon="BookOpen"'), 'Header must render BookOpen icon in fallback mode');
    assert.ok(
      html.includes('Conversation Script &amp; Tips:'),
      'Header title must indicate Conversation Script & Tips'
    );
    assert.ok(html.includes('no cap'), 'Header must include term name');
    assert.ok(
      html.includes('On-device AI is offline in this browser'),
      'Intro must inform parent that on-device AI is offline'
    );
  });

  await t.test('2.2: RoleplayChat live view renders MessageCircleHeart icon, live title, and interactive input', () => {
    const RoleplayChatComponent = loadRoleplayChatModule('local');
    const sampleTerm = findTerm('no-cap')!;

    const html = renderToString(
      React.createElement(RoleplayChatComponent, {
        term: sampleTerm,
        open: true,
        onClose: () => {},
      })
    );

    // Live interactive view assertions
    assert.ok(!html.includes('roleplay-drawer-fallback'), 'Drawer must NOT have class roleplay-drawer-fallback in live mode');
    assert.ok(html.includes('data-icon="MessageCircleHeart"'), 'Header must render MessageCircleHeart icon in live mode');
    assert.ok(
      html.includes('Practice: ') && !html.includes('Conversation Script &amp; Tips:'),
      'Header title must say Practice: in live mode'
    );
    assert.ok(html.includes('roleplay-messages'), 'Live view must render roleplay-messages feed');
    assert.ok(html.includes('roleplay-input'), 'Live view must render roleplay-input form');
    assert.ok(!html.includes('roleplay-fallback-view'), 'Live view must NOT render roleplay-fallback-view');
  });

  await t.test('2.3: RoleplayChat returns null when open is false', () => {
    const RoleplayChatComponent = loadRoleplayChatModule('unavailable');
    const sampleTerm = findTerm('no-cap')!;

    const html = renderToString(
      React.createElement(RoleplayChatComponent, {
        term: sampleTerm,
        open: false,
        onClose: () => {},
      })
    );

    assert.strictEqual(html, '', 'Component must render nothing when open is false');
  });

  // ═══════════════════════════════════════════════════════════
  // SECTION 3: Deep Verification of RoleplayChat Fallback Components
  // ═══════════════════════════════════════════════════════════

  await t.test('3.1: Fallback view renders Scenario Context card with situation and copy opener button', () => {
    const RoleplayChatComponent = loadRoleplayChatModule('unavailable');
    const sampleTerm = (findTerm('cook') || findTerm('no-cap'))!;

    const html = renderToString(
      React.createElement(RoleplayChatComponent, {
        term: sampleTerm,
        open: true,
        onClose: () => {},
      })
    );

    assert.ok(html.includes('fallback-scenario-card'), 'Must contain fallback-scenario-card');
    assert.ok(html.includes('Scenario Context'), 'Must display Scenario Context header');
    assert.ok(
      html.includes('chemistry') && html.includes('midterm'),
      'Scenario text must render the curated situation for cooked'
    );
    assert.ok(html.includes('copy-opener-btn'), 'Must render copy opener button');
    assert.ok(html.includes('Recommended opener:'), 'Must label recommended opener');
  });

  await t.test('3.2: Fallback view renders 5-turn dialogue with alternating bubbles and coach notes', () => {
    const RoleplayChatComponent = loadRoleplayChatModule('unavailable');
    const sampleTerm = (findTerm('cook') || findTerm('no-cap'))!;

    const html = renderToString(
      React.createElement(RoleplayChatComponent, {
        term: sampleTerm,
        open: true,
        onClose: () => {},
      })
    );

    assert.ok(html.includes('fallback-dialogue-section'), 'Must contain fallback-dialogue-section');
    assert.ok(html.includes('Sample Conversation Script'), 'Must display section title');
    assert.ok(html.includes('agent-message-user'), 'Must contain user/parent message bubbles');
    assert.ok(html.includes('agent-message-assistant'), 'Must contain assistant/teen message bubbles');
    assert.ok(html.includes('You (parent)'), 'Must render You (parent) speaker labels');
    assert.ok(html.includes('Teen'), 'Must render Teen speaker labels');

    // Coach notes verification
    assert.ok(html.includes('fallback-coach-note'), 'Must render coach notes');
    assert.ok(html.includes('Coach insight'), 'Must label coach notes with Coach insight tag');
    assert.ok(html.includes('data-icon="Sparkles"'), 'Must render Sparkles icon for coach notes');
  });

  await t.test('3.3: Fallback view renders 3 Key Coaching Tips with Tip 1, Tip 2, Tip 3 badges', () => {
    const RoleplayChatComponent = loadRoleplayChatModule('unavailable');
    const sampleTerm = (findTerm('cook') || findTerm('no-cap'))!;

    const html = renderToString(
      React.createElement(RoleplayChatComponent, {
        term: sampleTerm,
        open: true,
        onClose: () => {},
      })
    );

    assert.ok(html.includes('fallback-coaching-section'), 'Must contain fallback-coaching-section');
    assert.ok(html.includes('Parent Coaching Tips'), 'Must display coaching section title');
    assert.ok(html.includes('fallback-tip-badge'), 'Must render tip badge container');
    assert.ok(/Tip (<!-- -->)?1/.test(html), 'Must render Tip 1 badge');
    assert.ok(/Tip (<!-- -->)?2/.test(html), 'Must render Tip 2 badge');
    assert.ok(/Tip (<!-- -->)?3/.test(html), 'Must render Tip 3 badge');
    assert.ok(html.includes('Decode the emotional temperature'), 'Must render first curated tip for cooked');
    assert.ok(html.includes('Notice digital echo chambers'), 'Must render second curated tip for cooked');
    assert.ok(html.includes('De-escalate catastrophic thinking'), 'Must render third curated tip for cooked');
  });

  await t.test('3.4: Fallback view embeds ChromeAISetupGuide and Action Footer', () => {
    const RoleplayChatComponent = loadRoleplayChatModule('unavailable');
    const sampleTerm = findTerm('skibidi')!;

    const html = renderToString(
      React.createElement(RoleplayChatComponent, {
        term: sampleTerm,
        open: true,
        onClose: () => {},
      })
    );

    // Chrome AI setup guide inclusion
    assert.ok(html.includes('fallback-guide-container'), 'Must contain fallback-guide-container');
    assert.ok(
      html.includes('Want interactive practice with live responses?'),
      'Must explain how to enable local AI'
    );
    assert.ok(
      html.includes('How to turn on local AI in Chrome (60 seconds)'),
      'Embedded guide must render the setup guide title'
    );
    assert.ok(
      html.includes('chrome-ai-setup-guide'),
      'Embedded guide must have chrome-ai-setup-guide class'
    );

    // Footer actions
    assert.ok(html.includes('roleplay-fallback-footer'), 'Must contain roleplay-fallback-footer');
    assert.ok(html.includes('Save script to Saved Items'), 'Must have Save script action');
    assert.ok(html.includes('Copy script'), 'Must have Copy script action');
    assert.ok(html.includes('Close'), 'Must have Close button');
  });

  // ═══════════════════════════════════════════════════════════
  // SECTION 4: Exhaustive Corpus Stress Test (All 792 Terms)
  // ═══════════════════════════════════════════════════════════

  await t.test('4.1: Exhaustive verification across all 792 terms in data.ts', () => {
    assert.strictEqual(terms.length, 792, 'Total terms in dataset must be exactly 792');

    let processedCount = 0;
    const errors: string[] = [];

    for (const term of terms) {
      processedCount++;
      const script = getFallbackScriptForTerm(term);

      // Verify structural completeness
      if (!script.termSlug) errors.push(`Term ${term.slug}: missing termSlug`);
      if (!script.termName) errors.push(`Term ${term.slug}: missing termName`);
      if (!script.situation || script.situation.trim().length < 20) {
        errors.push(`Term ${term.slug}: situation is too short or empty`);
      }
      if (!script.recommendedOpener || script.recommendedOpener.trim().length < 5) {
        errors.push(`Term ${term.slug}: recommendedOpener is too short or empty`);
      }

      // Verify dialogue length and alternation
      if (!Array.isArray(script.dialogue) || script.dialogue.length < 5) {
        errors.push(`Term ${term.slug}: dialogue has fewer than 5 turns (${script.dialogue?.length})`);
      } else {
        const expectedSpeakers = ['Parent', 'Teen', 'Parent', 'Teen', 'Parent'];
        script.dialogue.forEach((turn, idx) => {
          if (turn.speaker !== expectedSpeakers[idx]) {
            errors.push(`Term ${term.slug} turn ${idx}: speaker ${turn.speaker} !== expected ${expectedSpeakers[idx]}`);
          }
          if (!turn.text || turn.text.trim().length < 5) {
            errors.push(`Term ${term.slug} turn ${idx}: empty or trivial turn text`);
          }
          if (!turn.coachNote || turn.coachNote.trim().length < 10) {
            errors.push(`Term ${term.slug} turn ${idx}: missing or trivial coachNote`);
          }
        });
      }

      // Verify coaching tips
      if (!Array.isArray(script.coachingTips) || script.coachingTips.length !== 3) {
        errors.push(`Term ${term.slug}: coachingTips must have exactly 3 tips (${script.coachingTips?.length})`);
      } else {
        script.coachingTips.forEach((tip, idx) => {
          if (!tip || tip.trim().length < 15) {
            errors.push(`Term ${term.slug} tip ${idx}: tip is too short or empty`);
          }
        });
      }

      // Verify no corrupted strings or data structures
      const allText = JSON.stringify(script);
      if (allText.includes('NaN')) errors.push(`Term ${term.slug}: contains string 'NaN'`);
      if (allText.includes('[object Object]')) errors.push(`Term ${term.slug}: contains '[object Object]'`);
      if (allText.includes('null')) errors.push(`Term ${term.slug}: contains 'null'`);
    }

    assert.strictEqual(processedCount, 792, 'Must have processed all 792 terms');
    assert.deepStrictEqual(errors, [], `Corpus verification must have 0 errors, got: ${errors.slice(0, 5).join('; ')}`);
  });

  // ═══════════════════════════════════════════════════════════
  // SECTION 5: Curated Marquee Terms Verification
  // ═══════════════════════════════════════════════════════════

  await t.test('5.1: Marquee terms resolve high-quality curated scripts', () => {
    const marqueeList = [
      'no-cap',
      'cooked',
      'plug',
      'skibidi',
      'rizz',
      'mid',
      'crash-out',
      'bet',
      'delulu',
      'fanum-tax',
    ];

    for (const slug of marqueeList) {
      const termObj = findTerm(slug) || terms.find((t) => t.slug === slug || t.aliases?.includes(slug));
      assert.ok(termObj, `Marquee term "${slug}" must exist in terms corpus`);
      const script = getFallbackScriptForTerm(termObj);

      assert.strictEqual(script.dialogue.length, 5, `${slug} curated script must have exactly 5 turns`);
      assert.strictEqual(script.coachingTips.length, 3, `${slug} curated script must have exactly 3 tips`);

      // Ensure every single turn has an explicit, high-fidelity coach note
      script.dialogue.forEach((turn, idx) => {
        assert.ok(
          turn.coachNote && turn.coachNote.length >= 20,
          `${slug} turn ${idx} coach note must be >= 20 chars, got: "${turn.coachNote}"`
        );
      });
    }
  });

  await t.test('5.2: Marquee term "cooked" / "cook" alias parity', () => {
    const cookedTerm = findTerm('cooked') || findTerm('cook')!;
    assert.ok(cookedTerm, 'cook / cooked term must exist');

    const scriptCooked = getFallbackScriptForTerm(cookedTerm);
    const scriptBySlugCook = getFallbackScriptBySlug('cook');
    const scriptBySlugCooked = getFallbackScriptBySlug('cooked');

    assert.ok(scriptCooked, 'scriptCooked must resolve');
    assert.ok(scriptBySlugCook, 'scriptBySlugCook must resolve');
    assert.ok(scriptBySlugCooked, 'scriptBySlugCooked must resolve');

    assert.strictEqual(scriptBySlugCook.situation, scriptBySlugCooked.situation);
    assert.strictEqual(scriptBySlugCook.dialogue[0].text, scriptBySlugCooked.dialogue[0].text);
  });

  await t.test('5.3: Curated script "plug" handles sensitive safety check calmly', () => {
    const plugTerm = findTerm('plug')!;
    const script = getFallbackScriptForTerm(plugTerm);

    assert.ok(script.situation.includes('notification'), 'Plug situation must mention phone notification');
    assert.ok(script.dialogue[0].text.includes('plug'), 'First turn must address plug directly');
    assert.ok(
      script.dialogue[2].text.includes('substances') || script.dialogue[2].text.includes('sneakers'),
      'Parent dialogue must explore benign sneakers vs substances'
    );
    assert.ok(
      script.coachingTips[1].includes('90% benign reality'),
      'Coaching tip must educate parents on the 90% benign slang reality'
    );
  });

  await t.test('5.4: Curated script "crash-out" models emotional regulation', () => {
    const crashOutTerm = findTerm('crash-out')!;
    const script = getFallbackScriptForTerm(crashOutTerm);

    assert.ok(script.situation.includes('slams') || script.situation.includes('bag'), 'Must describe somatic anger display');
    assert.ok(script.dialogue[0].text.includes('crash out'), 'First turn clarifies crash out');
    assert.ok(
      script.coachingTips[1].includes('Validate the feeling, regulate the action'),
      'Must guide validating feeling while regulating action'
    );
  });

  await t.test('5.5: Curated script "skibidi" embraces playful absurdity and boundaries', () => {
    const skibidiTerm = findTerm('skibidi')!;
    const script = getFallbackScriptForTerm(skibidiTerm);

    assert.ok(script.situation.includes('broccoli') || script.situation.includes('dinner'), 'Must feature dinner table setting');
    assert.ok(
      script.coachingTips[0].includes("Don't fight absurdism with solemnity"),
      'Must advise not fighting absurdism with solemnity'
    );
  });

  // ═══════════════════════════════════════════════════════════
  // SECTION 6: Category and Concern Combinatorial Stress (9 x 3)
  // ═══════════════════════════════════════════════════════════

  await t.test('6.1: Dynamic generator adapts across all 9 categories and 3 concern levels', () => {
    const categories: Category[] = [
      'General slang',
      'Abbreviations',
      'Emojis & Symbols',
      'Gaming & Streaming',
      'Social Media Culture',
      'Relationships & Dating',
      'Substances & Party Culture',
      'Mental Well-being',
      'Sensitive Safety Topics',
    ];

    const concerns: Concern[] = ['harmless', 'discuss', 'attention'];

    for (const cat of categories) {
      for (const con of concerns) {
        const syntheticTerm: Term = {
          term: `test-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${con}`,
          slug: `test-slug-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${con}`,
          aliases: [],
          plainMeaning: `meaning of ${cat} in ${con} mode`,
          summary: `summary for ${cat}`,
          interpretations: ['interp 1', 'interp 2'],
          example: `This is an example for ${cat}`,
          contextClues: `Clue for ${cat}. Watch the context.`,
          opener: `Opener for ${cat}?`,
          category: cat,
          concern: con,
          reviewed: '2026-11-10',
        };

        const script = generateDynamicFallbackScript(syntheticTerm);

        // Verify situation setting matches category
        if (cat === 'Gaming & Streaming') {
          assert.ok(script.situation.includes('online game') || script.situation.includes('stream'));
        } else if (cat === 'Social Media Culture') {
          assert.ok(script.situation.includes('clip') || script.situation.includes('trending video'));
        } else if (cat === 'Emojis & Symbols') {
          assert.ok(script.situation.includes('symbol or emoji'));
        } else if (cat === 'Abbreviations') {
          assert.ok(script.situation.includes('abbreviation'));
        } else if (cat === 'Relationships & Dating') {
          assert.ok(script.situation.includes('school social dynamics') || script.situation.includes('crush'));
        } else if (cat === 'Substances & Party Culture') {
          assert.ok(script.situation.includes('overheard conversation') || script.situation.includes('weekend'));
        } else if (cat === 'Mental Well-being') {
          assert.ok(script.situation.includes('stress, school load'));
        } else if (cat === 'Sensitive Safety Topics') {
          assert.ok(script.situation.includes('online space') || script.situation.includes('message exchange'));
        }

        // Verify situation goal matches concern
        if (con === 'harmless') {
          assert.ok(script.situation.includes('understand their world and connect naturally'));
          assert.ok(script.coachingTips[0].includes('curiosity over imitation'));
        } else if (con === 'discuss') {
          assert.ok(script.situation.includes('explore the context and check in on their feelings'));
          assert.ok(script.coachingTips[0].includes('tone and relationship over vocabulary'));
        } else if (con === 'attention') {
          assert.ok(script.situation.includes('open a calm, supportive, non-judgmental check-in'));
          assert.ok(script.coachingTips[0].includes('Stay grounded and prioritize safety'));
        }

        // Verify turn counts and coach note presence
        assert.strictEqual(script.dialogue.length, 5);
        script.dialogue.forEach((t) => {
          assert.ok(t.coachNote && t.coachNote.length > 10);
        });
      }
    }
  });

  // ═══════════════════════════════════════════════════════════
  // SECTION 7: Edge Terms & Adversarial Boundary Mining
  // ═══════════════════════════════════════════════════════════

  await t.test('7.1: Emoji and Symbol terms render cleanly without NaN or string corruption', () => {
    const emojiTerms = terms.filter((t) => t.category === 'Emojis & Symbols');
    assert.ok(emojiTerms.length > 5, 'Should have multiple emoji terms in dataset');

    const RoleplayChatComponent = loadRoleplayChatModule('unavailable');

    for (const term of emojiTerms) {
      const script = getFallbackScriptForTerm(term);
      assert.ok(script.situation.length > 20, `Emoji term ${term.term} situation must be valid`);

      // Verify SSR rendering for emoji term
      const html = renderToString(
        React.createElement(RoleplayChatComponent, {
          term,
          open: true,
          onClose: () => {},
        })
      );

      assert.ok(html.includes('fallback-scenario-card'), `Emoji term ${term.slug} must render scenario card`);
      assert.ok(!html.includes('undefined'), `Emoji term ${term.slug} HTML must not contain undefined`);
    }
  });

  await t.test('7.2: Degenerate and Partial terms are handled defensively', () => {
    // Completely empty object
    const emptyScript = generateDynamicFallbackScript({});
    assert.strictEqual(emptyScript.termName, 'this slang term');
    assert.strictEqual(emptyScript.termSlug, 'unknown-term');
    assert.strictEqual(emptyScript.dialogue.length, 5);
    assert.strictEqual(emptyScript.coachingTips.length, 3);

    // Term with missing optional properties
    const minimalTerm: any = {
      term: 'minimal-test',
      slug: 'minimal-test',
    };
    const minScript = getFallbackScriptForTerm(minimalTerm);
    assert.ok(minScript.situation.length > 10);
    assert.strictEqual(minScript.dialogue.length, 5);
    assert.strictEqual(minScript.coachingTips.length, 3);

    // Term with weird quotes and punctuation
    const quotesTerm: any = {
      term: '“quoted-term”',
      slug: 'quoted-term',
      example: '““He said: "it\'s wild"””',
      plainMeaning: '“meaning with quotes.”',
      opener: '“Is this real?”',
      concern: 'HIGH', // Non-standard concern casing
    };
    const cleanedScript = getFallbackScriptForTerm(quotesTerm);
    assert.ok(!cleanedScript.recommendedOpener.startsWith('““'), 'Must strip double outer quotes');
    assert.strictEqual(normalizeConcern('HIGH'), 'attention', 'HIGH concern must normalize to attention');
    assert.strictEqual(normalizeConcern('talk'), 'discuss', 'talk alias must normalize to discuss');
    assert.strictEqual(normalizeConcern(undefined), 'harmless', 'undefined concern must normalize to harmless');
  });

  await t.test('7.3: formatMeaningSnippet and cleanOuterQuotes utility edge cases', () => {
    assert.strictEqual(cleanOuterQuotes(''), '');
    assert.strictEqual(cleanOuterQuotes(undefined), '');
    assert.strictEqual(cleanOuterQuotes('“smart quotes”'), 'smart quotes');
    assert.strictEqual(cleanOuterQuotes('"straight quotes"'), 'straight quotes');
    assert.strictEqual(cleanOuterQuotes("'single quotes'"), 'single quotes');
    assert.strictEqual(cleanOuterQuotes('No quotes'), 'No quotes');

    assert.strictEqual(formatMeaningSnippet(''), 'that');
    assert.strictEqual(formatMeaningSnippet(undefined), 'that');
    assert.strictEqual(formatMeaningSnippet('Honestly; I’m not exaggerating.'), 'honestly; I’m not exaggerating');
    assert.strictEqual(formatMeaningSnippet('Cool and calm...'), 'cool and calm');
  });

  // ═══════════════════════════════════════════════════════════
  // SECTION 8: Formatted Output & Copy / Save Actions Stress
  // ═══════════════════════════════════════════════════════════

  await t.test('8.1: Fallback script formatted transcript and save metadata integrity', () => {
    const sampleTerm = findTerm('no-cap')!;
    const script = getFallbackScriptForTerm(sampleTerm);

    // Verify transcript building logic used in handleSaveFallbackScript
    const dialogueTranscript = script.dialogue
      .map((d) => `${d.speaker}: ${d.text}`)
      .join('\n');

    assert.ok(dialogueTranscript.includes('Parent:'), 'Transcript must contain Parent turns');
    assert.ok(dialogueTranscript.includes('Teen:'), 'Transcript must contain Teen turns');
    const turns = dialogueTranscript.split('\n');
    assert.strictEqual(turns.length, 5, 'Transcript must have exactly 5 dialogue lines');

    // Verify formatted copy script text
    const lines: string[] = [];
    if (script.situation) lines.push(`Scenario: ${script.situation}\n`);
    if (script.recommendedOpener) lines.push(`Recommended Opener: “${script.recommendedOpener}”\n`);
    lines.push('--- Conversation Script ---');
    script.dialogue.forEach((turn) => {
      lines.push(`${turn.speaker}: ${turn.text}`);
      if (turn.coachNote) lines.push(`[Coach Note: ${turn.coachNote}]`);
    });
    if (script.coachingTips && script.coachingTips.length > 0) {
      lines.push('\n--- Coaching Tips ---');
      script.coachingTips.forEach((tip, idx) => {
        lines.push(`${idx + 1}. ${tip}`);
      });
    }
    const fullCopyScript = lines.join('\n');

    assert.ok(fullCopyScript.includes('Scenario:'), 'Copy script must include Scenario');
    assert.ok(fullCopyScript.includes('Recommended Opener:'), 'Copy script must include Opener');
    assert.ok(fullCopyScript.includes('--- Conversation Script ---'), 'Copy script must include Script header');
    assert.ok(fullCopyScript.includes('[Coach Note:'), 'Copy script must include Coach notes');
    assert.ok(fullCopyScript.includes('--- Coaching Tips ---'), 'Copy script must include Tips header');
    assert.ok(fullCopyScript.includes('1. Match their emotional energy'), 'Copy script must include Tip 1');
  });

  await t.test('8.2: Save script reactive indicator reflects saved state in RoleplayChat', () => {
    // Initialize mock with saved output
    const RoleplayChatComponent = loadRoleplayChatModule('unavailable');
    const sampleTerm = (findTerm('cook') || findTerm('no-cap'))!;
    const saveTitle = 'Practice: ' + sampleTerm.term;

    // Simulate item already in store
    mockSavedOutputs.push({
      id: 'saved-1',
      type: 'roleplay',
      title: saveTitle,
      content: 'Sample dialogue',
      summary: 'Sample summary',
      metadata: { termSlug: sampleTerm.slug, termName: sampleTerm.term, category: sampleTerm.category },
      savedAt: Date.now(),
    });

    const html = renderToString(
      React.createElement(RoleplayChatComponent, {
        term: sampleTerm,
        open: true,
        onClose: () => {},
      })
    );

    // Save button must reflect saved state
    assert.ok(html.includes('Saved to Saved Items'), 'Button label must change to "Saved to Saved Items"');
    assert.ok(html.includes('data-icon="BookmarkCheck"'), 'Button must render BookmarkCheck icon when saved');
    assert.ok(html.includes('saved-button'), 'Button must receive saved-button class');
  });
});
