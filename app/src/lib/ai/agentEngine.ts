import type { AIStatus } from './types'

let cachedStatus: AIStatus | null = null

function getAPI() {
  return (
    (typeof globalThis.LanguageModel !== 'undefined' && globalThis.LanguageModel) ||
    globalThis.window?.ai?.languageModel ||
    undefined
  )
}

/**
 * Detect whether on-device AI (Chrome LanguageModel / Prompt API) is available.
 * Caches the result after the first call — use `resetStatus()` to re-probe.
 */
export async function detectAIEngine(): Promise<AIStatus> {
  if (cachedStatus) return cachedStatus

  try {
    const api = getAPI()
    if (!api) {
      cachedStatus = { engine: 'unavailable', ready: false }
      return cachedStatus
    }

    const availability = await api.availability()

    switch (availability) {
      case 'available':
        cachedStatus = { engine: 'local', ready: true }
        break
      case 'downloadable':
        cachedStatus = { engine: 'local', ready: false, downloading: false }
        break
      case 'downloading':
        cachedStatus = { engine: 'local', ready: false, downloading: true }
        break
      default:
        cachedStatus = { engine: 'unavailable', ready: false }
    }
  } catch {
    cachedStatus = { engine: 'unavailable', ready: false }
  }

  return cachedStatus
}

/**
 * Create a LanguageModel session with a given system prompt.
 * An optional `onProgress` callback receives download progress (0–1)
 * when the model needs to be fetched for the first time.
 */
export async function createSession(
  systemPrompt: string,
  onProgress?: (ratio: number) => void,
) {
  const api = getAPI()
  if (!api) throw new Error('On-device AI is not available in this browser.')

  const session = await api.create({
    systemPrompt,
    monitor: onProgress
      ? (m) => {
          m.addEventListener('downloadprogress', (e) => {
            onProgress(e.loaded / (e.total || 1))
          })
        }
      : undefined,
  })

  // Update cached status now that we know the model is ready
  cachedStatus = { engine: 'local', ready: true }

  return session
}

/** Clear the cached detection result so the next `detectAIEngine()` re-probes the browser. */
export function resetStatus() {
  cachedStatus = null
}
