import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Term } from '../src/data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─────────────────────────────────────────────────────────────
// 1. Mock LocalStorage Implementation (Zero-dependency)
// ─────────────────────────────────────────────────────────────

export class MockLocalStorage implements Storage {
  private store: Map<string, string> = new Map();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  key(index: number): string | null {
    const keys = Array.from(this.store.keys());
    return keys[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }

  // Debug helper
  dump(): Record<string, string> {
    const res: Record<string, string> = {};
    for (const [k, v] of this.store.entries()) {
      res[k] = v;
    }
    return res;
  }
}

// ─────────────────────────────────────────────────────────────
// 2. Mock Clipboard Implementation
// ─────────────────────────────────────────────────────────────

export class MockClipboard {
  public lastWrittenText: string = '';
  public history: string[] = [];

  async writeText(text: string): Promise<void> {
    this.lastWrittenText = text;
    this.history.push(text);
  }

  async readText(): Promise<string> {
    return this.lastWrittenText;
  }

  reset(): void {
    this.lastWrittenText = '';
    this.history = [];
  }
}

// ─────────────────────────────────────────────────────────────
// 3. Contracts and Types (per PROJECT.md & ORIGINAL_REQUEST.md)
// ─────────────────────────────────────────────────────────────

export type SavedAIOutputType = 'tone-analysis' | 'roleplay' | 'playbook';

export interface SavedAIOutput {
  id: string;
  type: SavedAIOutputType;
  title: string;
  content: string;
  summary?: string;
  savedAt: number;
  metadata?: Record<string, string>;
}

export interface FallbackScriptTurn {
  speaker: 'Parent' | 'Teen';
  text: string;
  coachNote?: string;
}

export interface TermFallbackScript {
  termSlug: string;
  termName: string;
  situation: string;
  dialogue: FallbackScriptTurn[];
  coachingTips: string[];
  recommendedOpener: string;
}

export interface ChromeAISetupGuideProps {
  className?: string;
  defaultOpen?: boolean;
  compact?: boolean;
}

// ─────────────────────────────────────────────────────────────
// 4. Store State Simulator (mirroring store.tsx contract)
// ─────────────────────────────────────────────────────────────

export interface StoreState {
  savedTerms: string[];
  savedMessages: Array<{ id: string; text: string; savedAt: number }>;
  savedAIOutputs: SavedAIOutput[];
  toasts: Array<{ id: number; message: string }>;
}

export class HeadlessStoreSimulator {
  public storage: MockLocalStorage;
  public state: StoreState;

  constructor(storage?: MockLocalStorage) {
    this.storage = storage || new MockLocalStorage();
    this.state = this.loadFromStorage();
  }

  private loadFromStorage(): StoreState {
    let savedTerms: string[] = [];
    let savedMessages: Array<{ id: string; text: string; savedAt: number }> = [];
    let savedAIOutputs: SavedAIOutput[] = [];

    try {
      const rawTerms = this.storage.getItem('parent-decoder-saved-terms');
      if (rawTerms) savedTerms = JSON.parse(rawTerms);
    } catch {
      savedTerms = [];
    }

    try {
      const rawMessages = this.storage.getItem('parent-decoder-saved-messages');
      if (rawMessages) savedMessages = JSON.parse(rawMessages);
    } catch {
      savedMessages = [];
    }

    try {
      const rawAI = this.storage.getItem('parent-decoder-saved-ai-outputs');
      if (rawAI) savedAIOutputs = JSON.parse(rawAI);
    } catch {
      savedAIOutputs = [];
    }

    return { savedTerms, savedMessages, savedAIOutputs, toasts: [] };
  }

  private persistTerms(): void {
    this.storage.setItem('parent-decoder-saved-terms', JSON.stringify(this.state.savedTerms));
  }

  private persistMessages(): void {
    this.storage.setItem('parent-decoder-saved-messages', JSON.stringify(this.state.savedMessages));
  }

  private persistAIOutputs(): void {
    this.storage.setItem('parent-decoder-saved-ai-outputs', JSON.stringify(this.state.savedAIOutputs));
  }

  notify(message: string): void {
    this.state.toasts.push({ id: Date.now(), message });
  }

  toggleTerm(slug: string): void {
    const exists = this.state.savedTerms.includes(slug);
    if (exists) {
      this.state.savedTerms = this.state.savedTerms.filter((s) => s !== slug);
      this.notify('Removed from your saved terms');
    } else {
      this.state.savedTerms.push(slug);
      this.notify('Saved in this browser');
    }
    this.persistTerms();
  }

  saveMessage(text: string): void {
    const clean = text.trim().slice(0, 600);
    if (!clean) return;
    this.state.savedMessages = [
      { id: `${Date.now()}_${Math.random()}`, text: clean, savedAt: Date.now() },
      ...this.state.savedMessages.filter((m) => m.text !== clean),
    ].slice(0, 20);
    this.notify('Message saved only in this browser');
    this.persistMessages();
  }

  saveAIOutput(output: Omit<SavedAIOutput, 'id' | 'savedAt'>): SavedAIOutput {
    const newEntry: SavedAIOutput = {
      ...output,
      id: `ai_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      savedAt: Date.now(),
    };
    // Prepend new output
    this.state.savedAIOutputs = [newEntry, ...this.state.savedAIOutputs];
    this.notify('Saved to Saved Items');
    this.persistAIOutputs();
    return newEntry;
  }

  removeAIOutput(id: string): void {
    this.state.savedAIOutputs = this.state.savedAIOutputs.filter((item) => item.id !== id);
    this.notify('Removed item');
    this.persistAIOutputs();
  }

  clearAIOutputs(type?: SavedAIOutputType): void {
    if (type) {
      this.state.savedAIOutputs = this.state.savedAIOutputs.filter((item) => item.type !== type);
    } else {
      this.state.savedAIOutputs = [];
    }
    this.notify('Cleared saved AI outputs');
    this.persistAIOutputs();
  }

  isAIOutputSaved(title: string, type: SavedAIOutputType): boolean {
    return this.state.savedAIOutputs.some(
      (item) => item.type === type && item.title.trim().toLowerCase() === title.trim().toLowerCase()
    );
  }

  getTotalSavedCount(): number {
    return this.state.savedTerms.length + this.state.savedMessages.length + this.state.savedAIOutputs.length;
  }
}

// ─────────────────────────────────────────────────────────────
// 5. Playbook State Machine & Rotating Queue Simulator (R1)
// ─────────────────────────────────────────────────────────────

export interface PlaybookScenario {
  id: string;
  title: string;
  tag: string;
  description: string;
  parentApproach: string;
  sampleDialogue: string;
  takeaway: string;
}

export const REQUIRED_PLAYBOOK_SCENARIOS: PlaybookScenario[] = [
  {
    id: 'teasing-vs-bullying',
    title: 'Teasing vs Bullying',
    tag: 'Safety & Social Dynamics',
    description: 'Deciphering when friendly banter crosses into exclusionary roasting or digital harassment.',
    parentApproach: 'Ask questions about social context and reciprocity rather than reacting to single phrases.',
    sampleDialogue: 'Parent: "I heard you guys laughing at \'cooked\' earlier—did it feel like joking around or did it sting?"',
    takeaway: 'Focus on how your teen feels afterwards, not just the vocabulary used.',
  },
  {
    id: 'brainrot-dinner-table',
    title: 'Brainrot memes at the dinner table',
    tag: 'Daily Culture & Boundaries',
    description: 'When algorithmic meme phrases dominate family meals and conversations.',
    parentApproach: 'Channel humor into curiosity: ask for a quick translation instead of shutting it down.',
    sampleDialogue: 'Parent: "Translate that one for me before we pass the salad—what makes it funny right now?"',
    takeaway: 'Meeting meme humor with playful curiosity keeps communication channels open.',
  },
  {
    id: 'party-vs-gaming-slang',
    title: 'Deciphering party vs gaming slang',
    tag: 'Risk & Awareness',
    description: 'Distinguishing innocent gaming terminology (clutch, aggro, plug) from substance or party references.',
    parentApproach: 'Clarify the platform and context before making assumptions about risk.',
    sampleDialogue: 'Parent: "When you mentioned \'plug\' just now, were you talking about a teammate or something else?"',
    takeaway: 'Context determines risk. Many terms carry completely safe gaming definitions.',
  },
];

export class PlaybookQueueStateMachine {
  public currentIndex: number = 0;
  public scenarios: PlaybookScenario[];
  public isPaused: boolean = false;
  public autoAdvanceIntervalMs: number = 7000;
  public timerTicks: number = 0;

  constructor(scenarios: PlaybookScenario[] = REQUIRED_PLAYBOOK_SCENARIOS) {
    this.scenarios = scenarios;
  }

  next(): void {
    this.currentIndex = (this.currentIndex + 1) % this.scenarios.length;
  }

  previous(): void {
    this.currentIndex = (this.currentIndex - 1 + this.scenarios.length) % this.scenarios.length;
  }

  goTo(index: number): void {
    if (index >= 0 && index < this.scenarios.length) {
      this.currentIndex = index;
    }
  }

  onMouseEnter(): void {
    this.isPaused = true;
  }

  onMouseLeave(): void {
    this.isPaused = false;
  }

  onUserInteract(): void {
    this.isPaused = true;
  }

  tick(): void {
    if (!this.isPaused) {
      this.timerTicks++;
      this.next();
    }
  }

  getCurrentScenario(): PlaybookScenario {
    return this.scenarios[this.currentIndex];
  }
}

// ─────────────────────────────────────────────────────────────
// 6. Interactive Tone Checklist Simulator (R1)
// ─────────────────────────────────────────────────────────────

export interface ToneChecklistItem {
  id: string;
  text: string;
  weight: number;
}

export const TONE_CHECKLIST_ITEMS: ToneChecklistItem[] = [
  { id: 'tone-hostile', text: 'Tone feels mocking, hostile, or designed to humiliate', weight: 2 },
  { id: 'tone-one-sided', text: 'One-sided dynamic where one person cannot joke back', weight: 1 },
  { id: 'tone-secretive', text: 'Sudden secrecy or hiding device screens when approached', weight: 1 },
  { id: 'tone-isolation', text: 'Withdrawal from friends, activities, or family routines', weight: 1 },
  { id: 'tone-pressure', text: 'Pressure to share private information or participate in dares', weight: 2 },
];

export type ToneSeverity = 'Harmless / Normal Banter' | 'Watchful / Stay Curious' | 'Intervention Recommended';

export class ToneChecklistStateMachine {
  public checkedIds: Set<string> = new Set();

  toggle(id: string): void {
    if (this.checkedIds.has(id)) {
      this.checkedIds.delete(id);
    } else {
      this.checkedIds.add(id);
    }
  }

  reset(): void {
    this.checkedIds.clear();
  }

  getScore(): number {
    let score = 0;
    for (const item of TONE_CHECKLIST_ITEMS) {
      if (this.checkedIds.has(item.id)) {
        score += item.weight;
      }
    }
    return score;
  }

  getSeverity(): ToneSeverity {
    const score = this.getScore();
    if (score <= 1) return 'Harmless / Normal Banter';
    if (score <= 3) return 'Watchful / Stay Curious';
    return 'Intervention Recommended';
  }
}

// ─────────────────────────────────────────────────────────────
// 7. Starter Pills Definitions (R3)
// ─────────────────────────────────────────────────────────────

export const REQUIRED_STARTER_PILLS = [
  "My 12-year-old was called 'cooked' on Discord—how worried should I be?",
  "Check if my text asking them to do dishes sounds passive-aggressive",
  "How do I ask about 'plug 🔌' without sounding like a cop?",
] as const;

// ─────────────────────────────────────────────────────────────
// 8. Chrome AI Setup Guide Constants (R4)
// ─────────────────────────────────────────────────────────────

export const CHROME_AI_GUIDE_CONSTANTS = {
  flagUrl: 'chrome://flags/#prompt-api-for-gemini-nano',
  componentsUrl: 'chrome://components',
  componentName: 'Optimization Guide On Device Model',
  title: 'How to turn on local AI in Chrome (60 seconds)',
  guideSteps: [
    'Open chrome://flags/#prompt-api-for-gemini-nano in Google Chrome.',
    'Set Prompt API for Gemini Nano to Enabled.',
    'Restart Google Chrome.',
    'Check chrome://components to ensure Optimization Guide On Device Model is downloaded and up-to-date.',
  ],
};

// ─────────────────────────────────────────────────────────────
// 9. Dynamic Safe Loader for Code Under Test
// ─────────────────────────────────────────────────────────────

export async function tryLoadModule<T>(relativePath: string): Promise<T | null> {
  const fullPath = path.resolve(__dirname, '..', relativePath);
  for (const ext of ['', '.ts', '.tsx', '.js']) {
    const target = fullPath + ext;
    if (fs.existsSync(target)) {
      try {
        const mod = await import(target);
        return mod as T;
      } catch {
        return null;
      }
    }
  }
  return null;
}
