import test from 'node:test';
import assert from 'node:assert';
import { terms, type Term } from '../src/data';
import {
  getFallbackScriptForTerm,
  getFallbackScriptBySlug,
  curatedScripts,
  cleanOuterQuotes,
  formatMeaningSnippet,
  normalizeConcern,
  getSituation,
} from '../src/lib/ai/fallbackScripts';

test('Challenger M1_1: Adversarial & Extreme Edge Case Stress Suite', async (t) => {
  // ─────────────────────────────────────────────────────────────
  // 1. Hostile Input Types (Non-Object, Corrupted Primitives)
  // ─────────────────────────────────────────────────────────────
  await t.test('1.1: Non-object and primitive term arguments', () => {
    const hostileInputs = [
      42,
      true,
      false,
      'a string instead of term',
      Symbol('test'),
      () => {},
      [],
      [1, 2, 3],
      NaN,
      Infinity,
      -1,
    ];

    for (const input of hostileInputs) {
      assert.doesNotThrow(() => {
        const res = getFallbackScriptForTerm(input as any);
        assert.ok(res, `Failed for input: ${String(input)}`);
        assert.strictEqual(res.dialogue.length, 5);
        assert.strictEqual(res.coachingTips.length, 3);
        assert.ok(res.situation.length > 0);
        assert.ok(res.recommendedOpener.length > 0);
      }, `Should gracefully handle input of type ${typeof input}`);
    }
  });

  // ─────────────────────────────────────────────────────────────
  // 2. Corrupted Internal Properties
  // ─────────────────────────────────────────────────────────────
  await t.test('2.1: Corrupted or non-string properties in Term object', () => {
    const gracefulTerms = [
      { slug: 'null-props', term: 'null-props', example: null, plainMeaning: null, opener: null, contextClues: null, category: null, concern: null },
      { slug: 'empty-props', term: 'empty-props', example: '', plainMeaning: '', opener: '', contextClues: '', category: '', concern: '' },
      { slug: 'undefined-props', term: 'undefined-props', example: undefined, plainMeaning: undefined, opener: undefined, contextClues: undefined },
      { slug: 'whitespace-props', term: 'whitespace-props', example: '   ', plainMeaning: '   ', opener: '   ', contextClues: '   ' },
    ];

    for (const gt of gracefulTerms) {
      assert.doesNotThrow(() => {
        const res = getFallbackScriptForTerm(gt as any);
        assert.ok(res, `Failed for term: ${JSON.stringify(gt)}`);
        assert.strictEqual(res.dialogue.length, 5);
        assert.strictEqual(res.coachingTips.length, 3);
        assert.strictEqual(res.dialogue[0].speaker, 'Parent');
        assert.strictEqual(res.dialogue[1].speaker, 'Teen');
      });
    }

    // Boundary discovery 1: non-string slug (number) throws TypeError due to unchecked .toLowerCase()
    assert.throws(() => {
      getFallbackScriptForTerm({ slug: 12345 } as any);
    }, TypeError, 'Non-string numeric slug throws TypeError: .toLowerCase is not a function');

    // Boundary discovery 2: truthy non-string example/opener throws TypeError in cleanOuterQuotes (str.trim is not a function)
    assert.throws(() => {
      getFallbackScriptForTerm({ slug: 'num-example', term: 'test', example: 12345 as any } as any);
    }, TypeError, 'Truthy non-string example throws TypeError in cleanOuterQuotes');
  });

  // ─────────────────────────────────────────────────────────────
  // 3. Unbalanced Quotes & Extreme Punctuation
  // ─────────────────────────────────────────────────────────────
  await t.test('3.1: Malformed and unbalanced quotes in cleanOuterQuotes', () => {
    const quoteCases = [
      { in: '“unbalanced left smart quote', out: '“unbalanced left smart quote' },
      { in: 'unbalanced right smart quote”', out: 'unbalanced right smart quote”' },
      { in: '"unbalanced left straight quote', out: '"unbalanced left straight quote' },
      { in: 'unbalanced right straight quote"', out: 'unbalanced right straight quote"' },
      { in: "‘single smart quote’", out: "‘single smart quote’" },
      { in: "'straight single quote'", out: "straight single quote" },
      { in: '“”', out: '' },
      { in: '""', out: '' },
      { in: "''", out: '' },
      { in: '   “ spaced smart quotes ”   ', out: 'spaced smart quotes' },
      { in: '““nested double””', out: '“nested double”' },
    ];

    for (const qc of quoteCases) {
      const actual = cleanOuterQuotes(qc.in);
      assert.strictEqual(actual, qc.out, `cleanOuterQuotes failed for ${JSON.stringify(qc.in)}`);
    }
  });

  await t.test('3.2: formatMeaningSnippet edge cases', () => {
    assert.strictEqual(formatMeaningSnippet('...'), '');
    assert.strictEqual(formatMeaningSnippet('A phrase.'), 'a phrase');
    assert.strictEqual(formatMeaningSnippet('Word.'), 'word');
    assert.strictEqual(formatMeaningSnippet(':::;;;...'), '');
    assert.strictEqual(formatMeaningSnippet('Already lowercase'), 'already lowercase');
    assert.strictEqual(formatMeaningSnippet('123 numbers first'), '123 numbers first');
    assert.strictEqual(formatMeaningSnippet('“Quoted meaning.”'), 'quoted meaning');
    assert.strictEqual(formatMeaningSnippet(''), 'that');
    assert.strictEqual(formatMeaningSnippet(undefined), 'that');
  });

  // ─────────────────────────────────────────────────────────────
  // 4. Unique Coaching Tips per Script
  // ─────────────────────────────────────────────────────────────
  await t.test('4.1: Coaching tips distinctness across all 617 terms', () => {
    for (const term of terms) {
      const script = getFallbackScriptForTerm(term);
      const tip0 = script.coachingTips[0].trim();
      const tip1 = script.coachingTips[1].trim();
      const tip2 = script.coachingTips[2].trim();

      assert.notStrictEqual(tip0, tip1, `Term ${term.slug}: tip 0 and tip 1 must not be identical`);
      assert.notStrictEqual(tip1, tip2, `Term ${term.slug}: tip 1 and tip 2 must not be identical`);
      assert.notStrictEqual(tip0, tip2, `Term ${term.slug}: tip 0 and tip 2 must not be identical`);
    }
  });

  // ─────────────────────────────────────────────────────────────
  // 5. Dialogue Quality & Character Length Verification
  // ─────────────────────────────────────────────────────────────
  await t.test('5.1: Minimum character length standards for turns and coachNotes', () => {
    for (const term of terms) {
      const script = getFallbackScriptForTerm(term);
      for (let i = 0; i < script.dialogue.length; i++) {
        const turn = script.dialogue[i];
        assert.ok(
          turn.text.trim().length >= 5,
          `Term ${term.slug} turn ${i} text is suspiciously short: "${turn.text}"`
        );
        assert.ok(
          turn.coachNote && turn.coachNote.trim().length >= 15,
          `Term ${term.slug} turn ${i} coachNote is suspiciously short: "${turn.coachNote}"`
        );
      }
    }
  });

  // ─────────────────────────────────────────────────────────────
  // 6. Rapid Execution & Throughput Benchmark
  // ─────────────────────────────────────────────────────────────
  await t.test('6.1: High-throughput benchmark (10,000 script generations)', () => {
    const startTime = Date.now();
    const ITERATIONS = 10000;
    const termCount = terms.length;

    for (let i = 0; i < ITERATIONS; i++) {
      const term = terms[i % termCount];
      const script = getFallbackScriptForTerm(term);
      // Touch properties to prevent dead code elimination
      if (script.dialogue.length !== 5) {
        throw new Error('Unexpected dialogue length');
      }
    }

    const duration = Date.now() - startTime;
    const throughput = Math.round((ITERATIONS / duration) * 1000);
    // Should easily exceed 5,000 ops/sec
    assert.ok(duration < 3000, `Benchmark took ${duration}ms, expected under 3000ms`);
  });

  // ─────────────────────────────────────────────────────────────
  // 7. Marquee Term Dialogue Textual & Pedagogical Rigor
  // ─────────────────────────────────────────────────────────────
  await t.test('7.1: Marquee terms dialogue pedagogy verification', () => {
    // 1. no-cap: should address truth vs exaggeration
    const noCap = curatedScripts['no-cap'];
    assert.ok(noCap.dialogue.some(t => t.text.toLowerCase().includes('half-court')));
    assert.ok(noCap.coachingTips.some(t => t.toLowerCase().includes('emotional energy')));

    // 2. cooked: should address academic anxiety / collective panic
    const cooked = curatedScripts['cooked'];
    assert.ok(cooked.dialogue.some(t => t.text.toLowerCase().includes('chemistry')));
    assert.ok(cooked.coachingTips.some(t => t.toLowerCase().includes('burnout')));

    // 3. plug: must address substance safety and open communication
    const plug = curatedScripts['plug'];
    assert.ok(plug.dialogue.some(t => t.text.toLowerCase().includes('substances')));
    assert.ok(plug.coachingTips.some(t => t.toLowerCase().includes('benign reality')));

    // 4. skibidi: must deal with absurd meme culture and mealtime boundaries
    const skibidi = curatedScripts['skibidi'];
    assert.ok(skibidi.dialogue.some(t => t.text.toLowerCase().includes('broccoli')));
    assert.ok(skibidi.coachingTips.some(t => t.toLowerCase().includes('brainrot')));

    // 5. rizz: must deal with social media dating performance vs authentic connection
    const rizz = curatedScripts['rizz'];
    assert.ok(rizz.dialogue.some(t => t.text.toLowerCase().includes('tiktok')));
    assert.ok(rizz.coachingTips.some(t => t.toLowerCase().includes('charisma')));

    // 6. mid: must encourage empathy for effort rather than casual dismissal
    const mid = curatedScripts['mid'];
    assert.ok(mid.dialogue.some(t => t.text.toLowerCase().includes('party')));
    assert.ok(mid.coachingTips.some(t => t.toLowerCase().includes('empathy')));

    // 7. crash-out: must de-escalate rage and distinguish emotion from dangerous reaction
    const crashOut = curatedScripts['crash-out'];
    assert.ok(crashOut.dialogue.some(t => t.text.toLowerCase().includes('coach')));
    assert.ok(crashOut.coachingTips.some(t => t.toLowerCase().includes('rage')));

    // 8. bet: must handle compressed teen agreement and avoid micromanagement
    const bet = curatedScripts['bet'];
    assert.ok(bet.dialogue.some(t => t.text.toLowerCase().includes('skate')));
    assert.ok(bet.coachingTips.some(t => t.toLowerCase().includes('brevity')));

    // 9. delulu: must distinguish self-shielding humor from deep discouragement
    const delulu = curatedScripts['delulu'];
    assert.ok(delulu.dialogue.some(t => t.text.toLowerCase().includes('varsity')));
    assert.ok(delulu.coachingTips.some(t => t.toLowerCase().includes('protective shield')));

    // 10. fanum-tax: must teach consent, food boundaries, and internet humor limits
    const fanumTax = curatedScripts['fanum-tax'];
    assert.ok(fanumTax.dialogue.some(t => t.text.toLowerCase().includes('fry') || t.text.toLowerCase().includes('fries')));
    assert.ok(fanumTax.coachingTips.some(t => t.toLowerCase().includes('consent')));
  });
});
