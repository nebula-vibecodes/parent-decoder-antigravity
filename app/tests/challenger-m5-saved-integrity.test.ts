import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─────────────────────────────────────────────────────────────
// Headless DOM & Storage Environment Setup
// ─────────────────────────────────────────────────────────────

class MockLocalStorage {
  public store = new Map<string, string>();

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
}

// ─────────────────────────────────────────────────────────────
// Challenger M5 Test Suite: SavedPage, ToneAnalysis, AppShell
// ─────────────────────────────────────────────────────────────

test('Challenger M5: Saved Items Architecture, ToneAnalysis & AppShell Counter', async (t) => {

  // ─────────────────────────────────────────────────────────
  // 1. SavedTab Category Coverage & Interface Verification
  // ─────────────────────────────────────────────────────────
  await t.test('1. SavedTab Interface & Tab Config Integrity', () => {
    const savedPageSource = fs.readFileSync(
      path.resolve(__dirname, '../src/pages/SavedPage.tsx'),
      'utf8'
    );

    // Verify exported SavedTab union type has all 5 categories
    assert.ok(
      savedPageSource.includes("export type SavedTab = 'terms' | 'messages' | 'tone-analysis' | 'roleplay' | 'playbook'"),
      'SavedTab must export 5 distinct categories'
    );

    // Verify 5 tab IDs exist in tabs definition
    assert.ok(savedPageSource.includes("id: 'terms'"));
    assert.ok(savedPageSource.includes("id: 'messages'"));
    assert.ok(savedPageSource.includes("id: 'tone-analysis'"));
    assert.ok(savedPageSource.includes("id: 'roleplay'"));
    assert.ok(savedPageSource.includes("id: 'playbook'"));

    // Verify tab icons
    assert.ok(savedPageSource.includes('Bookmark'));
    assert.ok(savedPageSource.includes('MessageSquareText'));
    assert.ok(savedPageSource.includes('Sparkles'));
    assert.ok(savedPageSource.includes('BookOpen'));
    assert.ok(savedPageSource.includes('Compass'));
  });

  // ─────────────────────────────────────────────────────────
  // 2. Selective Category Clear Isolation (Zero Data Loss)
  // ─────────────────────────────────────────────────────────
  await t.test('2. Category Clear Isolation Stress Test', () => {
    const storage = new MockLocalStorage();

    const terms = ['cooked', 'rizz', 'skibidi', 'fanum-tax', 'delulu'];
    const messages = [
      { id: 'm1', text: 'Msg 1', savedAt: 1000 },
      { id: 'm2', text: 'Msg 2', savedAt: 2000 },
    ];
    const aiOutputs = [
      { id: 'ai-1', type: 'tone-analysis' as const, title: 'Tone 1', content: 'C1', savedAt: 1000 },
      { id: 'ai-2', type: 'tone-analysis' as const, title: 'Tone 2', content: 'C2', savedAt: 2000 },
      { id: 'ai-3', type: 'roleplay' as const, title: 'Roleplay 1', content: 'C3', savedAt: 3000 },
      { id: 'ai-4', type: 'roleplay' as const, title: 'Roleplay 2', content: 'C4', savedAt: 4000 },
      { id: 'ai-5', type: 'playbook' as const, title: 'Playbook 1', content: 'C5', savedAt: 5000 },
      { id: 'ai-6', type: 'playbook' as const, title: 'Playbook 2', content: 'C6', savedAt: 6000 },
    ];

    storage.setItem('parent-decoder-saved-terms', JSON.stringify(terms));
    storage.setItem('parent-decoder-saved-messages', JSON.stringify(messages));
    storage.setItem('parent-decoder-saved-ai-outputs', JSON.stringify(aiOutputs));

    // Simulate handleClear for 'tone-analysis'
    function handleClearSim(
      tab: 'terms' | 'messages' | 'tone-analysis' | 'roleplay' | 'playbook',
      s: MockLocalStorage
    ) {
      if (tab === 'terms') {
        s.setItem('parent-decoder-saved-terms', JSON.stringify([]));
      } else if (tab === 'messages') {
        s.setItem('parent-decoder-saved-messages', JSON.stringify([]));
      } else {
        const currentAI = JSON.parse(s.getItem('parent-decoder-saved-ai-outputs') || '[]');
        const filtered = currentAI.filter((item: any) => item.type !== tab);
        s.setItem('parent-decoder-saved-ai-outputs', JSON.stringify(filtered));
      }
    }

    // Clear tone-analysis only
    handleClearSim('tone-analysis', storage);
    let remAI = JSON.parse(storage.getItem('parent-decoder-saved-ai-outputs')!);
    assert.strictEqual(remAI.length, 4);
    assert.ok(remAI.every((item: any) => item.type !== 'tone-analysis'));
    assert.strictEqual(JSON.parse(storage.getItem('parent-decoder-saved-terms')!).length, 5);
    assert.strictEqual(JSON.parse(storage.getItem('parent-decoder-saved-messages')!).length, 2);

    // Clear roleplay only
    handleClearSim('roleplay', storage);
    remAI = JSON.parse(storage.getItem('parent-decoder-saved-ai-outputs')!);
    assert.strictEqual(remAI.length, 2);
    assert.ok(remAI.every((item: any) => item.type === 'playbook'));
    assert.strictEqual(JSON.parse(storage.getItem('parent-decoder-saved-terms')!).length, 5);

    // Clear playbook only
    handleClearSim('playbook', storage);
    remAI = JSON.parse(storage.getItem('parent-decoder-saved-ai-outputs')!);
    assert.strictEqual(remAI.length, 0);
    assert.strictEqual(JSON.parse(storage.getItem('parent-decoder-saved-terms')!).length, 5);
    assert.strictEqual(JSON.parse(storage.getItem('parent-decoder-saved-messages')!).length, 2);

    // Clear messages only
    handleClearSim('messages', storage);
    assert.strictEqual(JSON.parse(storage.getItem('parent-decoder-saved-messages')!).length, 0);
    assert.strictEqual(JSON.parse(storage.getItem('parent-decoder-saved-terms')!).length, 5);

    // Clear terms only
    handleClearSim('terms', storage);
    assert.strictEqual(JSON.parse(storage.getItem('parent-decoder-saved-terms')!).length, 0);
  });

  // ─────────────────────────────────────────────────────────
  // 3. ToneAnalysis Title, Summary & Metadata Conformance
  // ─────────────────────────────────────────────────────────
  await t.test('3. ToneAnalysis Formatting & Metadata Specification', () => {
    function computeTonePayload(message: string, content: string) {
      const trimmedMessage = message.trim();
      const title = 'Tone: ' + trimmedMessage.slice(0, 30) + (trimmedMessage.length > 30 ? '…' : '');
      const summary = `Tone reading for: “${trimmedMessage.slice(0, 70)}${trimmedMessage.length > 70 ? '…' : ''}”`;
      return {
        type: 'tone-analysis',
        title,
        content,
        summary,
        metadata: {
          message: trimmedMessage,
          originalMessage: message,
        },
      };
    }

    // Boundary 1: Short message (< 30 chars)
    const p1 = computeTonePayload('Are you cooked?', 'Analysis content');
    assert.strictEqual(p1.title, 'Tone: Are you cooked?');
    assert.strictEqual(p1.summary, 'Tone reading for: “Are you cooked?”');
    assert.strictEqual(p1.metadata.message, 'Are you cooked?');
    assert.strictEqual(p1.metadata.originalMessage, 'Are you cooked?');

    // Boundary 2: Exactly 30 chars
    const msg30 = '123456789012345678901234567890';
    const p2 = computeTonePayload(msg30, 'Analysis content');
    assert.strictEqual(p2.title, 'Tone: ' + msg30);
    assert.ok(!p2.title.endsWith('…'), 'Exactly 30 chars should not have ellipsis');

    // Boundary 3: 31 chars
    const msg31 = '1234567890123456789012345678901';
    const p3 = computeTonePayload(msg31, 'Analysis content');
    assert.strictEqual(p3.title, 'Tone: ' + msg30 + '…');

    // Boundary 4: Message with leading/trailing whitespace
    const padded = '   Spaces around this   ';
    const p4 = computeTonePayload(padded, 'Analysis content');
    assert.strictEqual(p4.title, 'Tone: Spaces around this');
    assert.strictEqual(p4.metadata.message, 'Spaces around this');
    assert.strictEqual(p4.metadata.originalMessage, padded);

    // Boundary 5: Long message > 70 chars for summary
    const msg100 = 'A'.repeat(100);
    const p5 = computeTonePayload(msg100, 'Analysis content');
    assert.strictEqual(p5.summary, `Tone reading for: “${'A'.repeat(70)}…”`);
  });

  // ─────────────────────────────────────────────────────────
  // 4. ToneAnalysis Source Code Analysis & Attributes
  // ─────────────────────────────────────────────────────────
  await t.test('4. ToneAnalysis Component Button State & Accessibility Attributes', () => {
    const toneSource = fs.readFileSync(
      path.resolve(__dirname, '../src/components/agent/ToneAnalysis.tsx'),
      'utf8'
    );

    // Button attributes
    assert.ok(toneSource.includes('type="button"'), 'Must have explicit type="button"');
    assert.ok(toneSource.includes('disabled={isSaved}'), 'Must disable button when saved');
    assert.ok(toneSource.includes("isSaved ? 'saved-button' : 'button-light'"), 'Must apply saved-button class');
    assert.ok(
      toneSource.includes("isSaved ? 'Saved to Saved Items' : 'Save to Saved Items'"),
      'Must toggle text and aria-label to Saved to Saved Items'
    );
    assert.ok(toneSource.includes('BookmarkCheck'), 'Must render BookmarkCheck icon when saved');
    assert.ok(toneSource.includes('Bookmark'), 'Must render Bookmark icon when not saved');

    // Engine unavailable guard
    assert.ok(
      toneSource.includes("if (status.engine === 'unavailable') return null"),
      'Must return null when on-device AI is unavailable'
    );
  });

  // ─────────────────────────────────────────────────────────
  // 5. AppShell Navigation Counter Across Viewports
  // ─────────────────────────────────────────────────────────
  await t.test('5. AppShell Nav Count Formula & Viewport Mirroring', () => {
    const appShellSource = fs.readFileSync(
      path.resolve(__dirname, '../src/components/AppShell.tsx'),
      'utf8'
    );

    // Formula
    assert.ok(
      appShellSource.includes('const totalSaved = savedTerms.length + savedMessages.length + savedAIOutputs.length'),
      'totalSaved must aggregate all 3 store collections'
    );

    // Desktop nav counter
    assert.ok(
      appShellSource.includes("{label === 'Saved' && totalSaved > 0 && <span className=\"nav-count\">{totalSaved}</span>}"),
      'Desktop nav must conditionally render nav-count for Saved'
    );

    // Mobile nav counter
    assert.ok(
      appShellSource.includes('className="mobile-nav-label"'),
      'Mobile nav must use mobile-nav-label for alignment'
    );
    assert.ok(
      appShellSource.includes("{label === 'Saved' && totalSaved > 0 && <span className=\"nav-count\">{totalSaved}</span>}"),
      'Mobile nav must render nav-count matching desktop'
    );
  });

  // ─────────────────────────────────────────────────────────
  // 6. SavedPage Rich Card Rendering & Deep Links
  // ─────────────────────────────────────────────────────────
  await t.test('6. SavedPage Card Layouts, Tags, and Deep Links', () => {
    const savedSource = fs.readFileSync(
      path.resolve(__dirname, '../src/pages/SavedPage.tsx'),
      'utf8'
    );

    // Tone analysis card
    assert.ok(savedSource.includes('tag-tone-analysis'), 'Tone analysis tag present');
    assert.ok(savedSource.includes('saved-quote-box'), 'Tone analysis quote box present');
    assert.ok(savedSource.includes('Copy reading'), '1-click copy reading button present');

    // Roleplay card
    assert.ok(savedSource.includes('tag-roleplay'), 'Roleplay tag present');
    assert.ok(savedSource.includes('saved-meta-badge'), 'Roleplay term badge present');
    assert.ok(savedSource.includes('saved-meta-pill'), 'Category pill present');
    assert.ok(savedSource.includes('Copy script'), '1-click copy script button present');

    // Playbook card
    assert.ok(savedSource.includes('tag-playbook'), 'Playbook tag present');
    assert.ok(savedSource.includes('saved-meta-tier'), 'Playbook tier badge present');
    assert.ok(savedSource.includes("tier-${item.metadata.tier || 'harmless'}"), 'Dynamic tier styling present');
    assert.ok(savedSource.includes('Copy note'), '1-click copy note button present');
    assert.ok(savedSource.includes('to="/copilot"'), 'Playbook deep link to /copilot present');

    // Empty states CTAs
    assert.ok(savedSource.includes('to="/browse"'), 'Empty state CTA to /browse');
    assert.ok(savedSource.includes('to="/decoder"'), 'Empty state CTA to /decoder');
    assert.ok(savedSource.includes('to="/copilot"'), 'Empty state CTA to /copilot');
  });

  // ─────────────────────────────────────────────────────────
  // 7. CSS Definitions & Responsive Tokens
  // ─────────────────────────────────────────────────────────
  await t.test('7. index.css Style Definitions for M5', () => {
    const css = fs.readFileSync(
      path.resolve(__dirname, '../src/index.css'),
      'utf8'
    );

    assert.ok(css.includes('.mobile-nav-label'), '.mobile-nav-label class defined');
    assert.ok(css.includes('.saved-tabs'), '.saved-tabs class defined');
    assert.ok(css.includes('.saved-quote-box'), '.saved-quote-box class defined');
    assert.ok(css.includes('.saved-meta-row'), '.saved-meta-row class defined');
    assert.ok(css.includes('.saved-meta-badge'), '.saved-meta-badge class defined');
    assert.ok(css.includes('.saved-meta-pill'), '.saved-meta-pill class defined');
    assert.ok(css.includes('.saved-meta-tier'), '.saved-meta-tier class defined');
    assert.ok(css.includes('.tier-harmless'), '.tier-harmless class defined');
    assert.ok(css.includes('.tier-watchful'), '.tier-watchful class defined');
    assert.ok(css.includes('.tier-intervention'), '.tier-intervention class defined');
    assert.ok(css.includes('.tone-analysis-actions .saved-button'), '.tone-analysis-actions .saved-button defined');
    assert.ok(css.includes('.dark .saved-quote-box'), 'dark mode for saved-quote-box defined');
    assert.ok(css.includes('.dark .saved-meta-badge'), 'dark mode for saved-meta-badge defined');
  });

  // ─────────────────────────────────────────────────────────
  // 8. Integrity Inspection: No Cheats, Facades, or Dummy Stubs
  // ─────────────────────────────────────────────────────────
  await t.test('8. Source Code Integrity Inspection', () => {
    const filesToCheck = [
      '../src/pages/SavedPage.tsx',
      '../src/components/agent/ToneAnalysis.tsx',
      '../src/components/AppShell.tsx',
    ];

    for (const relPath of filesToCheck) {
      const code = fs.readFileSync(path.resolve(__dirname, relPath), 'utf8');

      // Check for suspicious hardcoded bypasses or facade comments
      assert.ok(!code.includes('MOCK_TEST_RESULT'), `No mock test results in ${relPath}`);
      assert.ok(!code.includes('TODO: implement later'), `No unimplemented stubs in ${relPath}`);
      assert.ok(!code.includes('FAKE_IMPLEMENTATION'), `No fake implementations in ${relPath}`);
    }
  });
});
