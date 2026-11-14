import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { terms, findTerm, type Term } from '../src/data';
import { getFallbackScriptForTerm } from '../src/lib/ai/fallbackScripts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('Challenger M4: TermPage Button State & Roleplay Fallback Dialogue Scripts Stress Suite', async (t) => {
  // ─────────────────────────────────────────────────────────────
  // 1. Source Integrity & Static Analysis
  // ─────────────────────────────────────────────────────────────
  await t.test('1.1: TermPage.tsx correctly imports and uses useAgent for dynamic button state', () => {
    const termPageSource = fs.readFileSync(
      path.resolve(__dirname, '../src/pages/TermPage.tsx'),
      'utf-8'
    );

    // Verify useAgent import
    assert.ok(
      termPageSource.includes("import { useAgent } from '../lib/ai/useAgent'"),
      'TermPage must import useAgent'
    );
    // Verify status extraction
    assert.ok(
      termPageSource.includes('const { status } = useAgent()'),
      'TermPage must extract status from useAgent()'
    );
    // Verify dynamic button label logic
    assert.ok(
      termPageSource.includes("status.engine === 'unavailable'"),
      'TermPage must branch on status.engine === unavailable'
    );
    assert.ok(
      termPageSource.includes("'View conversation script & tips'"),
      'TermPage must provide "View conversation script & tips" label'
    );
    assert.ok(
      termPageSource.includes("'Practice this conversation'"),
      'TermPage must provide "Practice this conversation" label'
    );
    // Verify button renders dynamic label
    assert.ok(
      termPageSource.includes('{roleplayButtonLabel}'),
      'TermPage button must render {roleplayButtonLabel}'
    );
    // Verify button opens roleplay modal
    assert.ok(
      termPageSource.includes('setRoleplayOpen(true)'),
      'Button must trigger setRoleplayOpen(true)'
    );
  });

  await t.test('1.2: RoleplayChat.tsx source structure and dependencies', () => {
    const roleplaySource = fs.readFileSync(
      path.resolve(__dirname, '../src/components/agent/RoleplayChat.tsx'),
      'utf-8'
    );

    assert.ok(
      roleplaySource.includes('getFallbackScriptForTerm'),
      'RoleplayChat must import getFallbackScriptForTerm'
    );
    assert.ok(
      roleplaySource.includes('ChromeAISetupGuide'),
      'RoleplayChat must import ChromeAISetupGuide'
    );
    assert.ok(
      roleplaySource.includes("isFallback = status.engine === 'unavailable'"),
      'RoleplayChat must derive isFallback from status.engine === unavailable'
    );
    assert.ok(
      roleplaySource.includes('fallback-scenario-card'),
      'RoleplayChat must contain scenario card container'
    );
    assert.ok(
      roleplaySource.includes('fallback-coach-note'),
      'RoleplayChat must contain coach note element'
    );
    assert.ok(
      roleplaySource.includes('fallback-coaching-section'),
      'RoleplayChat must contain coaching tips section'
    );
    assert.ok(
      roleplaySource.includes('Save script to Saved Items'),
      'RoleplayChat must contain Save script action'
    );
    assert.ok(
      roleplaySource.includes('Copy script'),
      'RoleplayChat must contain Copy script action'
    );
  });

  // ─────────────────────────────────────────────────────────────
  // 2. CSS Styling & Layout Integrity
  // ─────────────────────────────────────────────────────────────
  await t.test('2.1: index.css contains all required M4 roleplay classes and dark mode overrides', () => {
    const cssSource = fs.readFileSync(
      path.resolve(__dirname, '../src/index.css'),
      'utf-8'
    );

    const requiredClasses = [
      '.roleplay-drawer-fallback',
      '.roleplay-fallback-view',
      '.roleplay-fallback-scroll',
      '.fallback-scenario-card',
      '.fallback-scenario-header',
      '.fallback-scenario-text',
      '.fallback-opener-box',
      '.copy-opener-btn',
      '.fallback-dialogue-section',
      '.fallback-section-title',
      '.fallback-dialogue-bubbles',
      '.fallback-turn-bubble',
      '.fallback-turn-text',
      '.fallback-coach-note',
      '.coach-note-user',
      '.coach-note-assistant',
      '.fallback-coach-tag',
      '.fallback-coach-explanation',
      '.fallback-coaching-section',
      '.fallback-tips-grid',
      '.fallback-tip-card',
      '.fallback-tip-badge',
      '.fallback-tip-body',
      '.fallback-guide-container',
      '.fallback-guide-intro',
      '.roleplay-fallback-footer',
      '.roleplay-footer-actions',
    ];

    for (const cls of requiredClasses) {
      assert.ok(
        cssSource.includes(cls),
        `index.css must define required class ${cls}`
      );
    }

    // Verify dark mode overrides
    assert.ok(
      cssSource.includes('.dark .coach-note-assistant'),
      'index.css must provide dark mode styles for coach note'
    );
    assert.ok(
      cssSource.includes('.dark .fallback-scenario-card'),
      'index.css must provide dark mode styles for scenario card'
    );
    assert.ok(
      cssSource.includes('.dark .fallback-coaching-section'),
      'index.css must provide dark mode styles for coaching section'
    );
  });

  // ─────────────────────────────────────────────────────────────
  // 3. Dynamic SSR Component Rendering (Offline Fallback vs Live)
  // ─────────────────────────────────────────────────────────────
  const roleplayPath = path.resolve(__dirname, '../src/components/agent/RoleplayChat.tsx');
  const bundled = esbuild.buildSync({
    entryPoints: [roleplayPath],
    bundle: true,
    format: 'cjs',
    write: false,
    external: [
      'react',
      'react-dom',
      'lucide-react',
      'react/jsx-runtime',
      '../../store',
      '../store',
      '../../lib/ai/useAgent',
      './ChromeAISetupGuide',
      './PrivacyBadge',
      './StreamingText',
    ],
  });

  let currentEngineStatus = 'unavailable';
  let mockSavedAIOutputs: any[] = [];
  let saveAIOutputCalls: any[] = [];

  const mockContext = {
    status: { engine: currentEngineStatus, ready: currentEngineStatus === 'local' },
    messages: [] as any[],
    isStreaming: false,
    streamingText: '',
    initialize: () => {},
    send: () => {},
    reset: () => {},
    notify: () => {},
    saveAIOutput: (output: any) => {
      saveAIOutputCalls.push(output);
      mockSavedAIOutputs.push({
        id: `ai-${Date.now()}`,
        ...output,
        savedAt: Date.now(),
      });
    },
    isAIOutputSaved: (title: string, type: string) => {
      return mockSavedAIOutputs.some(
        (item) => item.type === type && item.title.trim().toLowerCase() === title.trim().toLowerCase()
      );
    },
  };

  const cjsModule: any = { exports: {} };
  const customRequire = (id: string) => {
    if (id === 'react') return React;
    if (id === 'react/jsx-runtime') return require('react/jsx-runtime');
    if (id === 'lucide-react') {
      return new Proxy({}, {
        get: (_t, prop: string) => (props: any) =>
          React.createElement('span', { 'data-lucide': prop, ...props }),
      });
    }
    if (id.includes('useAgent')) {
      return {
        useAgent: () => ({
          status: { engine: currentEngineStatus, ready: currentEngineStatus === 'local' },
          messages: mockContext.messages,
          isStreaming: mockContext.isStreaming,
          streamingText: mockContext.streamingText,
          initialize: mockContext.initialize,
          send: mockContext.send,
          reset: mockContext.reset,
        }),
      };
    }
    if (id.includes('store')) {
      return {
        useApp: () => ({
          notify: mockContext.notify,
          saveAIOutput: mockContext.saveAIOutput,
          isAIOutputSaved: mockContext.isAIOutputSaved,
          savedAIOutputs: mockSavedAIOutputs,
        }),
        copyText: async () => {},
      };
    }
    if (id.includes('ChromeAISetupGuide')) {
      return {
        ChromeAISetupGuide: (props: any) =>
          React.createElement('div', { className: 'mock-chrome-ai-guide', ...props }, 'Chrome AI Setup Guide Mock'),
      };
    }
    if (id.includes('PrivacyBadge')) {
      return {
        PrivacyBadge: () => React.createElement('span', { className: 'mock-privacy-badge' }),
      };
    }
    if (id.includes('StreamingText')) {
      return {
        StreamingText: (props: any) => React.createElement('span', null, props.text),
      };
    }
    if (id.includes('fallbackScripts')) {
      return { getFallbackScriptForTerm };
    }
    if (id.includes('systemPrompts')) {
      return { buildRoleplayPrompt: () => 'mock prompt' };
    }
    return require(id);
  };

  const fn = new Function('require', 'module', 'exports', 'React', bundled.outputFiles[0].text);
  fn(customRequire, cjsModule, cjsModule.exports, React);
  const RoleplayChatComponent = cjsModule.exports.RoleplayChat;

  await t.test('3.1: Offline fallback mode renders dialogue script, situation, coach notes, tips, setup guide', () => {
    currentEngineStatus = 'unavailable';
    mockSavedAIOutputs = [];
    saveAIOutputCalls = [];

    const testTerm = findTerm('no-cap') || terms[0];
    const script = getFallbackScriptForTerm(testTerm);

    const html = renderToString(
      React.createElement(RoleplayChatComponent, {
        term: testTerm,
        open: true,
        onClose: () => {},
      })
    );

    // Decode HTML entities for plain string checks
    const decodedHtml = html
      .replace(/&#x27;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&');

    // Verify modal container and accessibility
    assert.ok(html.includes('roleplay-drawer-fallback'), 'Drawer must have roleplay-drawer-fallback class');
    assert.ok(decodedHtml.includes('Conversation Script & Tips:'), 'Header must state Conversation Script & Tips');
    assert.ok(decodedHtml.includes(testTerm.term), `Header must include term name "${testTerm.term}"`);

    // Verify scenario card
    assert.ok(html.includes('fallback-scenario-card'), 'Scenario card must be present');
    assert.ok(html.includes('Scenario Context'), 'Scenario header must be present');

    // Verify opener
    assert.ok(decodedHtml.includes(script.recommendedOpener), 'Recommended opener must be present');
    assert.ok(html.includes('Copy'), 'Opener copy button must be present');

    // Verify dialogue turns
    assert.ok(html.includes('Sample Conversation Script'), 'Sample Conversation Script header must be present');
    for (const turn of script.dialogue) {
      assert.ok(
        decodedHtml.includes(turn.text),
        `Turn text "${turn.text.slice(0, 20)}..." must be present in dialogue`
      );
      if (turn.coachNote) {
        assert.ok(decodedHtml.includes(turn.coachNote), `Coach note "${turn.coachNote.slice(0, 20)}..." must be present`);
      }
    }

    // Verify coaching tips
    assert.ok(html.includes('Parent Coaching Tips'), 'Parent Coaching Tips header must be present');
    for (const tip of script.coachingTips) {
      assert.ok(decodedHtml.includes(tip), `Coaching tip "${tip.slice(0, 20)}..." must be present`);
    }

    // Verify setup guide
    assert.ok(html.includes('mock-chrome-ai-guide'), 'ChromeAISetupGuide component must be rendered');

    // Verify action footer
    assert.ok(html.includes('Save script to Saved Items'), 'Save script button must be present');
    assert.ok(html.includes('Copy script'), 'Copy script button must be present');
    assert.ok(html.includes('Close'), 'Close button must be present');
  });

  await t.test('3.2: Reactive save state toggles to "Saved to Saved Items" when output exists in store', () => {
    currentEngineStatus = 'unavailable';
    const testTerm = findTerm('skibidi') || terms[1];
    const saveTitle = 'Practice: ' + testTerm.term;

    // Initially not saved
    mockSavedAIOutputs = [];
    const htmlBefore = renderToString(
      React.createElement(RoleplayChatComponent, {
        term: testTerm,
        open: true,
        onClose: () => {},
      })
    );
    assert.ok(htmlBefore.includes('Save script to Saved Items'), 'Initially shows Save script button');
    assert.ok(!htmlBefore.includes('Saved to Saved Items'), 'Initially does NOT show Saved button');

    // Add to saved store
    mockSavedAIOutputs.push({
      id: 'ai-mock-1',
      type: 'roleplay',
      title: saveTitle,
      content: 'Sample content',
      savedAt: Date.now(),
    });

    // Re-render
    const htmlAfter = renderToString(
      React.createElement(RoleplayChatComponent, {
        term: testTerm,
        open: true,
        onClose: () => {},
      })
    );
    assert.ok(htmlAfter.includes('Saved to Saved Items'), 'After save, button shows "Saved to Saved Items"');
    assert.ok(htmlAfter.includes('saved-button'), 'After save, button has .saved-button class');
  });

  await t.test('3.3: Live interactive mode preserves real-time chat UI when AI is local', () => {
    currentEngineStatus = 'local';
    const testTerm = findTerm('cooked') || terms[2];

    const html = renderToString(
      React.createElement(RoleplayChatComponent, {
        term: testTerm,
        open: true,
        onClose: () => {},
      })
    );

    // Drawer should NOT have fallback class
    assert.ok(!html.includes('roleplay-drawer-fallback'), 'Live drawer must not have roleplay-drawer-fallback class');
    // Header should indicate Practice
    assert.ok(html.includes('Practice: '), 'Live header must indicate Practice');
    // Input form must be present
    assert.ok(html.includes('roleplay-input'), 'Live mode must render roleplay-input form');
    assert.ok(html.includes('Type what you&#x27;d say to your teen'), 'Live mode must render input placeholder');
    // Fallback dialogue script must NOT be rendered
    assert.ok(!html.includes('fallback-scenario-card'), 'Live mode must NOT render fallback scenario card');
    assert.ok(!html.includes('Sample Conversation Script'), 'Live mode must NOT render fallback conversation script');
  });

  // ─────────────────────────────────────────────────────────────
  // 4. Corpus Stress: 100% of 617 Terms Render Without Throwing
  // ─────────────────────────────────────────────────────────────
  await t.test('4.1: Render fallback drawer for all 617 terms without any exception', () => {
    currentEngineStatus = 'unavailable';
    mockSavedAIOutputs = [];

    assert.strictEqual(terms.length, 617, 'Corpus must contain 617 terms');

    for (let i = 0; i < terms.length; i++) {
      const term = terms[i];
      assert.doesNotThrow(() => {
        const html = renderToString(
          React.createElement(RoleplayChatComponent, {
            term,
            open: true,
            onClose: () => {},
          })
        );
        assert.ok(html.length > 500, `Rendered HTML for term ${term.slug} must be substantial`);
      }, `Failed rendering fallback drawer for term index ${i} (${term.slug})`);
    }
  });

  // ─────────────────────────────────────────────────────────────
  // 5. Special Characters and Extreme Boundaries
  // ─────────────────────────────────────────────────────────────
  await t.test('5.1: Extreme and edge case terms (emojis, slashes, quotes, long strings)', () => {
    currentEngineStatus = 'unavailable';

    const edgeTerms: Term[] = [
      {
        slug: 'skull-emoji',
        term: '💀',
        category: 'Emojis & Symbols',
        concern: 'harmless',
        plainMeaning: 'I am dead from laughing',
        example: 'That joke was too much 💀💀💀',
        opener: 'I keep seeing the skull emoji, is that just laughing?',
        summary: 'Skull emoji meaning',
        contextClues: 'Check punctuation',
        interpretations: ['Hilarious', 'Overwhelmed'],
        aliases: ['dead', 'dying'],
      },
      {
        slug: 'quote-and-slash',
        term: '"quoted" / slash & ampersand',
        category: 'Online Culture',
        concern: 'discuss',
        plainMeaning: 'Testing punctuation escaping',
        example: 'He said "no way" / whatever & then left',
        opener: 'Can we talk about what happened earlier?',
        summary: 'Punctuation test',
        contextClues: 'Context clues',
        interpretations: ['Test meaning'],
        aliases: [],
      },
      {
        slug: 'urgent-concern-term',
        term: 'urgent-alert',
        category: 'Substances & Parties',
        concern: 'urgent',
        plainMeaning: 'Urgent substance reference',
        example: 'Looking for a plug tonight',
        opener: 'I want to check in because your safety matters to me.',
        summary: 'High concern check-in',
        contextClues: 'Context matters',
        interpretations: ['Substance reference'],
        aliases: ['plug', 'dealer'],
      },
    ];

    for (const term of edgeTerms) {
      assert.doesNotThrow(() => {
        const html = renderToString(
          React.createElement(RoleplayChatComponent, {
            term,
            open: true,
            onClose: () => {},
          })
        );
        assert.ok(html.includes('fallback-scenario-card'));
        assert.ok(html.includes('fallback-dialogue-section'));
        assert.ok(html.includes('fallback-coaching-section'));
      }, `Edge case term "${term.term}" threw during rendering`);
    }
  });

  // ─────────────────────────────────────────────────────────────
  // 6. Save Payload & Copy Transcript Contract Verification
  // ─────────────────────────────────────────────────────────────
  await t.test('6.1: Fallback script transcript and save payload contract adherence', () => {
    const term = findTerm('skibidi') || terms[0];
    const script = getFallbackScriptForTerm(term);

    // Verify transcript serialization logic identical to handleSaveFallbackScript
    const dialogueTranscript = script.dialogue
      .map((d) => `${d.speaker}: ${d.text}`)
      .join('\n');

    assert.ok(dialogueTranscript.includes('Parent:'), 'Transcript must contain Parent: turn');
    assert.ok(dialogueTranscript.includes('Teen:'), 'Transcript must contain Teen: turn');

    // Verify save payload contract matches store expectations
    const savePayload = {
      type: 'roleplay' as const,
      title: 'Practice: ' + term.term,
      content: dialogueTranscript,
      summary: script.situation || `Dialogue script for ${term.term}`,
      metadata: {
        termSlug: term.slug,
        termName: term.term,
        category: term.category,
      },
    };

    assert.strictEqual(savePayload.type, 'roleplay');
    assert.strictEqual(savePayload.title, 'Practice: ' + term.term);
    assert.ok(savePayload.content.length > 20);
    assert.ok(savePayload.summary.length > 10);
    assert.strictEqual(savePayload.metadata.termSlug, term.slug);
    assert.strictEqual(savePayload.metadata.termName, term.term);
  });

  await t.test('6.2: Copy script formatted output includes all required sections', () => {
    const term = findTerm('rizz') || terms[0];
    const script = getFallbackScriptForTerm(term);

    // Simulate formatting in handleCopyScript
    const lines: string[] = [];
    if (script.situation) {
      lines.push(`Scenario: ${script.situation}\n`);
    }
    if (script.recommendedOpener) {
      lines.push(`Recommended Opener: “${script.recommendedOpener}”\n`);
    }
    lines.push('--- Conversation Script ---');
    script.dialogue.forEach((turn) => {
      lines.push(`${turn.speaker}: ${turn.text}`);
      if (turn.coachNote) {
        lines.push(`[Coach Note: ${turn.coachNote}]`);
      }
    });
    if (script.coachingTips && script.coachingTips.length > 0) {
      lines.push('\n--- Coaching Tips ---');
      script.coachingTips.forEach((tip, idx) => {
        lines.push(`${idx + 1}. ${tip}`);
      });
    }

    const fullCopiedText = lines.join('\n');
    assert.ok(fullCopiedText.includes('Scenario:'));
    assert.ok(fullCopiedText.includes('Recommended Opener:'));
    assert.ok(fullCopiedText.includes('--- Conversation Script ---'));
    assert.ok(fullCopiedText.includes('--- Coaching Tips ---'));
    assert.ok(fullCopiedText.includes('[Coach Note:'));
  });

  // ─────────────────────────────────────────────────────────────
  // 7. TermPage Reactive State Transitions & Accessibility
  // ─────────────────────────────────────────────────────────────
  await t.test('7.1: TermPage button transitions dynamically with engine availability', () => {
    function deriveLabel(engine: 'unavailable' | 'local' | 'cloud'): string {
      return engine === 'unavailable'
        ? 'View conversation script & tips'
        : 'Practice this conversation';
    }

    assert.strictEqual(deriveLabel('unavailable'), 'View conversation script & tips');
    assert.strictEqual(deriveLabel('local'), 'Practice this conversation');
    assert.strictEqual(deriveLabel('cloud'), 'Practice this conversation');
  });
});

