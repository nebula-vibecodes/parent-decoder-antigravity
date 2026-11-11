import test from 'node:test';
import assert from 'node:assert';
import { terms, findTerm, type Term } from '../src/data';
import { expansionTerms } from '../src/termsExpansion';
import {
  getFallbackScriptForTerm,
  getConversationScript,
  getFallbackScriptBySlug,
  curatedScripts,
  generateDynamicFallbackScript,
  cleanOuterQuotes,
  formatMeaningSnippet,
  normalizeConcern,
  getSituation,
  type FallbackScriptTurn,
  type TermFallbackScript,
} from '../src/lib/ai/fallbackScripts';

test('Challenger M1_1: Empirical Corpus Verification', async (t) => {
  // ─────────────────────────────────────────────────────────────
  // 1. Corpus Size & Export Verification
  // ─────────────────────────────────────────────────────────────
  await t.test('1.1: Total term count and expansion integrity', () => {
    assert.strictEqual(terms.length, 792, `Expected exactly 792 terms in data.ts, found ${terms.length}`);
    assert.ok(expansionTerms.length > 0, `expansionTerms should not be empty, found ${expansionTerms.length}`);
    assert.strictEqual(
      terms.length,
      (terms.length - expansionTerms.length) + expansionTerms.length,
      'terms array must contain base terms + expansionTerms'
    );
  });

  await t.test('1.2: API alias and export contract check', () => {
    assert.strictEqual(typeof getFallbackScriptForTerm, 'function', 'getFallbackScriptForTerm must be exported as a function');
    assert.strictEqual(typeof getConversationScript, 'function', 'getConversationScript must be exported as an alias function');
    assert.strictEqual(getConversationScript, getFallbackScriptForTerm, 'getConversationScript must be an exact alias of getFallbackScriptForTerm');
    assert.strictEqual(typeof getFallbackScriptBySlug, 'function', 'getFallbackScriptBySlug must be exported as a function');
    assert.strictEqual(typeof curatedScripts, 'object', 'curatedScripts must be exported');
  });

  // ─────────────────────────────────────────────────────────────
  // 2. Comprehensive 792-Term Empirical Verification
  // ─────────────────────────────────────────────────────────────
  await t.test('2.1: 100% Corpus Coverage across all 792 terms', () => {
    let checkedCount = 0;
    const failures: { slug: string; reason: string }[] = [];

    for (const term of terms) {
      checkedCount++;
      const script = getFallbackScriptForTerm(term);

      if (!script) {
        failures.push({ slug: term.slug, reason: 'Returned null or undefined script' });
        continue;
      }

      // Check termSlug
      if (!script.termSlug || script.termSlug.trim() === '') {
        failures.push({ slug: term.slug, reason: 'Empty termSlug' });
      }

      // Check termName
      if (!script.termName || script.termName.trim() === '') {
        failures.push({ slug: term.slug, reason: 'Empty termName' });
      }

      // Check situation (must be non-empty, meaningful string)
      if (!script.situation || script.situation.trim().length < 15) {
        failures.push({ slug: term.slug, reason: `Situation too short: "${script.situation}"` });
      }

      // Check recommendedOpener
      if (!script.recommendedOpener || script.recommendedOpener.trim().length < 3) {
        failures.push({ slug: term.slug, reason: `Opener too short: "${script.recommendedOpener}"` });
      }

      // Check dialogue turns: must be >= 5
      if (!Array.isArray(script.dialogue) || script.dialogue.length < 5) {
        failures.push({ slug: term.slug, reason: `Dialogue turns count < 5: ${script.dialogue?.length}` });
        continue;
      }

      // Check speaker alternation
      for (let i = 0; i < script.dialogue.length; i++) {
        const turn = script.dialogue[i];
        const expectedSpeaker = i % 2 === 0 ? 'Parent' : 'Teen';
        if (turn.speaker !== expectedSpeaker) {
          failures.push({
            slug: term.slug,
            reason: `Turn ${i} speaker mismatch: expected ${expectedSpeaker}, got ${turn.speaker}`,
          });
        }

        // Check text
        if (!turn.text || turn.text.trim().length === 0) {
          failures.push({ slug: term.slug, reason: `Turn ${i} text is empty` });
        }

        // Check coachNote
        if (!turn.coachNote || turn.coachNote.trim().length === 0) {
          failures.push({ slug: term.slug, reason: `Turn ${i} coachNote is empty or missing` });
        }

        // Check for template leakage (unresolved JavaScript template variables)
        const termDataStr = JSON.stringify(term);
        if (turn.text.includes('${') || turn.text.includes('[object Object]') ||
            (turn.text.includes('undefined') && !termDataStr.includes('undefined')) ||
            (turn.text.includes('null') && !termDataStr.includes('null'))) {
          failures.push({ slug: term.slug, reason: `Turn ${i} text contains template leak: "${turn.text}"` });
        }
        if (turn.coachNote && (turn.coachNote.includes('${') || turn.coachNote.includes('[object Object]') ||
            (turn.coachNote.includes('undefined') && !termDataStr.includes('undefined')) ||
            (turn.coachNote.includes('null') && !termDataStr.includes('null')))) {
          failures.push({ slug: term.slug, reason: `Turn ${i} coachNote contains template leak` });
        }
      }

      // Check coachingTips: exactly 3
      if (!Array.isArray(script.coachingTips) || script.coachingTips.length !== 3) {
        failures.push({
          slug: term.slug,
          reason: `coachingTips length is not 3: ${script.coachingTips?.length}`,
        });
      } else {
        for (let j = 0; j < 3; j++) {
          const tip = script.coachingTips[j];
          if (!tip || tip.trim().length < 5) {
            failures.push({ slug: term.slug, reason: `Tip ${j} is empty or too short: "${tip}"` });
          }
          if (tip && (tip.includes('undefined') || tip.includes('null'))) {
            failures.push({ slug: term.slug, reason: `Tip ${j} contains template leak: "${tip}"` });
          }
        }
      }
    }

    assert.strictEqual(checkedCount, 792, `Expected to test 792 terms, checked ${checkedCount}`);
    if (failures.length > 0) {
      assert.fail(`Corpus verification failed on ${failures.length} issues:\n` + JSON.stringify(failures.slice(0, 10), null, 2));
    }
  });

  // ─────────────────────────────────────────────────────────────
  // 3. Marquee Slang Terms Deep Inspection
  // ─────────────────────────────────────────────────────────────
  await t.test('3.1: Marquee terms presence and quality', () => {
    const marqueeKeys = [
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

    for (const key of marqueeKeys) {
      assert.ok(curatedScripts[key], `curatedScripts must contain key "${key}"`);
      const script = curatedScripts[key];
      assert.strictEqual(script.dialogue.length, 5, `Marquee ${key} must have exactly 5 dialogue turns`);
      assert.strictEqual(script.coachingTips.length, 3, `Marquee ${key} must have exactly 3 coaching tips`);
      assert.ok(script.situation.length > 30, `Marquee ${key} must have detailed situation`);
      assert.ok(script.recommendedOpener.length > 10, `Marquee ${key} must have detailed recommended opener`);

      // Verify alternating speakers
      assert.strictEqual(script.dialogue[0].speaker, 'Parent');
      assert.strictEqual(script.dialogue[1].speaker, 'Teen');
      assert.strictEqual(script.dialogue[2].speaker, 'Parent');
      assert.strictEqual(script.dialogue[3].speaker, 'Teen');
      assert.strictEqual(script.dialogue[4].speaker, 'Parent');

      // Verify coach notes exist on EVERY turn
      for (let i = 0; i < 5; i++) {
        assert.ok(script.dialogue[i].coachNote && script.dialogue[i].coachNote!.length > 10, `Marquee ${key} turn ${i} must have substantive coachNote`);
      }
    }
  });

  await t.test('3.2: Marquee term "cook" alias support', () => {
    assert.ok(curatedScripts['cook'], 'curatedScripts must support "cook" alias');
    assert.strictEqual(curatedScripts['cook'].termSlug, 'cook');
    assert.strictEqual(curatedScripts['cook'].dialogue.length, 5);
  });

  await t.test('3.3: Marquee slug lookup via getFallbackScriptBySlug', () => {
    const marqueeKeys = [
      'no-cap',
      'cooked',
      'cook',
      'plug',
      'skibidi',
      'rizz',
      'mid',
      'crash-out',
      'bet',
      'delulu',
      'fanum-tax',
    ];

    for (const slug of marqueeKeys) {
      const script = getFallbackScriptBySlug(slug);
      assert.ok(script, `getFallbackScriptBySlug("${slug}") must resolve a script`);
      assert.ok(script.dialogue.length >= 5);
      assert.strictEqual(script.coachingTips.length, 3);
    }
  });

  // ─────────────────────────────────────────────────────────────
  // 4. Case Sensitivity and Formatting Variations
  // ─────────────────────────────────────────────────────────────
  await t.test('4.1: Case-insensitivity and whitespace trimming on slug lookup', () => {
    const variations = [
      'No-Cap',
      '  cooked  ',
      'PLUG',
      '  skibidi\n',
      'RiZz',
      'DELULU',
      'fanum-tax  ',
    ];

    for (const v of variations) {
      const script = getFallbackScriptBySlug(v);
      assert.ok(script, `getFallbackScriptBySlug("${v}") must resolve despite casing/whitespace`);
      assert.ok(script.dialogue.length >= 5);
    }
  });

  // ─────────────────────────────────────────────────────────────
  // 5. Adversarial Inputs & Boundary Stress-Testing
  // ─────────────────────────────────────────────────────────────
  await t.test('5.1: Null and undefined input handling in getFallbackScriptForTerm', () => {
    // Should not throw, should return a valid TermFallbackScript
    const nullScript = getFallbackScriptForTerm(null as any);
    assert.ok(nullScript, 'getFallbackScriptForTerm(null) must return a fallback script object');
    assert.strictEqual(nullScript.dialogue.length, 5, 'Fallback script for null must have 5 turns');
    assert.strictEqual(nullScript.coachingTips.length, 3, 'Fallback script for null must have 3 tips');
    assert.strictEqual(nullScript.dialogue[0].speaker, 'Parent');
    assert.strictEqual(nullScript.dialogue[1].speaker, 'Teen');

    const undefScript = getFallbackScriptForTerm(undefined as any);
    assert.ok(undefScript, 'getFallbackScriptForTerm(undefined) must return a fallback script object');
    assert.strictEqual(undefScript.dialogue.length, 5);
    assert.strictEqual(undefScript.coachingTips.length, 3);
  });

  await t.test('5.2: Empty object and sparse Term input handling', () => {
    const emptyScript = getFallbackScriptForTerm({} as any);
    assert.ok(emptyScript, 'getFallbackScriptForTerm({}) must succeed');
    assert.strictEqual(emptyScript.dialogue.length, 5);
    assert.strictEqual(emptyScript.coachingTips.length, 3);
    assert.ok(emptyScript.termSlug.length > 0);
    assert.ok(emptyScript.termName.length > 0);
    assert.ok(emptyScript.situation.length > 0);
    assert.ok(emptyScript.recommendedOpener.length > 0);

    for (let i = 0; i < 5; i++) {
      assert.ok(emptyScript.dialogue[i].text.length > 0, `Turn ${i} text must not be empty`);
      assert.ok(emptyScript.dialogue[i].coachNote && emptyScript.dialogue[i].coachNote!.length > 0, `Turn ${i} coachNote must not be empty`);
    }
  });

  await t.test('5.3: Unknown and arbitrary slugs', () => {
    const unknownTerm: Partial<Term> = {
      term: 'xyznonexistent',
      slug: 'xyznonexistent',
      category: 'General slang',
      concern: 'harmless',
      plainMeaning: 'nothing',
      example: 'xyz',
      contextClues: 'none',
      opener: 'what is xyz?',
    };

    const script = getFallbackScriptForTerm(unknownTerm as Term);
    assert.ok(script);
    assert.strictEqual(script.termSlug, 'xyznonexistent');
    assert.strictEqual(script.dialogue.length, 5);
    assert.strictEqual(script.coachingTips.length, 3);
  });

  await t.test('5.4: Adversarial slug lookup via getFallbackScriptBySlug', () => {
    assert.strictEqual(getFallbackScriptBySlug(''), undefined, 'Empty string slug returns undefined');
    assert.strictEqual(getFallbackScriptBySlug('   '), undefined, 'Whitespace slug returns undefined');
    assert.strictEqual(getFallbackScriptBySlug(null as any), undefined, 'Null slug returns undefined');
    assert.strictEqual(getFallbackScriptBySlug(undefined as any), undefined, 'Undefined slug returns undefined');
    assert.strictEqual(getFallbackScriptBySlug('completely-unknown-slug-404'), undefined, 'Unknown slug returns undefined');
  });

  await t.test('5.5: Non-standard concern values defensive normalization', () => {
    assert.strictEqual(normalizeConcern('action'), 'attention');
    assert.strictEqual(normalizeConcern('danger'), 'attention');
    assert.strictEqual(normalizeConcern('high'), 'attention');
    assert.strictEqual(normalizeConcern('watch'), 'discuss');
    assert.strictEqual(normalizeConcern('talk'), 'discuss');
    assert.strictEqual(normalizeConcern('medium'), 'discuss');
    assert.strictEqual(normalizeConcern('low'), 'harmless');
    assert.strictEqual(normalizeConcern(undefined), 'harmless');
    assert.strictEqual(normalizeConcern('something-weird'), 'harmless');
  });

  await t.test('5.6: Quote stripping and snippet formatting helpers', () => {
    assert.strictEqual(cleanOuterQuotes('“hello”'), 'hello');
    assert.strictEqual(cleanOuterQuotes('"world"'), 'world');
    assert.strictEqual(cleanOuterQuotes("'test'"), 'test');
    assert.strictEqual(cleanOuterQuotes('“inner “nested” quotes”'), 'inner “nested” quotes');
    assert.strictEqual(cleanOuterQuotes(''), '');
    assert.strictEqual(cleanOuterQuotes(undefined), '');

    assert.strictEqual(formatMeaningSnippet('Honestly; I’m not exaggerating.'), 'honestly; I’m not exaggerating');
    assert.strictEqual(formatMeaningSnippet('“A phrase.”'), 'a phrase');
    assert.strictEqual(formatMeaningSnippet(''), 'that');
    assert.strictEqual(formatMeaningSnippet(undefined), 'that');
  });

  await t.test('5.7: Emoji and special character terms check', () => {
    const specialTerms = terms.filter(t => /[^a-zA-Z0-9\s-]/.test(t.term) || /[^a-zA-Z0-9\s-]/.test(t.slug));
    assert.ok(specialTerms.length > 0, 'There should be terms with emojis or symbols');

    for (const term of specialTerms) {
      const script = getFallbackScriptForTerm(term);
      assert.ok(script, `Script for symbol term "${term.term}" must generate cleanly`);
      assert.strictEqual(script.dialogue.length, 5);
      assert.strictEqual(script.coachingTips.length, 3);
      for (const turn of script.dialogue) {
        assert.ok(turn.text.length > 0);
        assert.ok(turn.coachNote && turn.coachNote.length > 0);
      }
    }
  });

  await t.test('5.8: Category variations test across all 9 standard categories', () => {
    const categories = [
      'General slang',
      'Abbreviations',
      'Emojis & Symbols',
      'Gaming & Streaming',
      'Social Media Culture',
      'Relationships & Dating',
      'Substances & Party Culture',
      'Mental Well-being',
      'Sensitive Safety Topics',
    ] as const;

    for (const category of categories) {
      const testTerm: Partial<Term> = {
        term: `sample-${category}`,
        slug: `sample-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        category,
        concern: 'discuss',
        plainMeaning: 'a sample meaning',
        example: 'sample example',
        contextClues: 'sample clue',
        opener: 'sample opener?',
      };
      const script = getFallbackScriptForTerm(testTerm as Term);
      assert.ok(script.situation.length > 20, `Situation for ${category} must be populated`);
      assert.strictEqual(script.dialogue.length, 5);
      assert.strictEqual(script.coachingTips.length, 3);
    }
  });
});
