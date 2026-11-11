/* eslint-disable @typescript-eslint/no-empty-object-type */

// ──────────────────────────────────────────────────
// Chrome Built-in AI · LanguageModel Prompt API
// https://developer.chrome.com/docs/ai/built-in
// ──────────────────────────────────────────────────

interface LanguageModelCreateOptions {
  systemPrompt?: string
  temperature?: number
  topK?: number
  monitor?: (monitor: LanguageModelDownloadMonitor) => void
}

interface LanguageModelDownloadMonitor {
  addEventListener(
    type: 'downloadprogress',
    listener: (event: LanguageModelDownloadProgressEvent) => void,
  ): void
  removeEventListener?(
    type: string,
    listener: (event: any) => void,
  ): void
}

interface LanguageModelDownloadProgressEvent extends Event {
  loaded: number
  total: number
}

interface LanguageModelSession {
  prompt(input: string): Promise<string>
  promptStreaming(input: string): ReadableStream<string> & AsyncIterable<string>
  clone(): Promise<LanguageModelSession>
  destroy(): void
  tokensSoFar: number
  maxTokens: number
}

interface LanguageModelAPI {
  availability(): Promise<'available' | 'downloadable' | 'downloading' | 'unavailable'>
  create(options?: LanguageModelCreateOptions): Promise<LanguageModelSession>
}

declare global {
  // Current standard: global LanguageModel
  // eslint-disable-next-line no-var
  var LanguageModel: LanguageModelAPI | undefined

  interface Window {
    ai?: {
      languageModel?: LanguageModelAPI
    }
  }
}

// ──────────────────────────────────────────────────
// Application-level types
// ──────────────────────────────────────────────────

export type AIEngineType = 'local' | 'cloud' | 'unavailable'

export interface AIStatus {
  engine: AIEngineType
  ready: boolean
  downloading?: boolean
  progress?: number
  error?: string
}

export type AgentCapability = 'tone-analysis' | 'roleplay' | 'copilot' | 'cringe-check'

export interface AgentMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface TokenInfo {
  used: number
  max: number
}
