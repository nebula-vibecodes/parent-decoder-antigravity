import { useState, useCallback, useRef, useEffect } from 'react'
import { detectAIEngine, createSession } from './agentEngine'
import type { AIStatus, AgentMessage, TokenInfo } from './types'

/**
 * React hook that manages an on-device AI conversation session.
 *
 * Usage:
 *   const { status, messages, isStreaming, streamingText, initialize, send, reset, stop } = useAgent()
 *
 *   // 1. initialize() with a system prompt to create a session
 *   // 2. send() user messages — responses stream in via `streamingText`
 *   // 3. reset() to start a new conversation
 */
export function useAgent() {
  const [status, setStatus] = useState<AIStatus>({ engine: 'unavailable', ready: false })
  const [messages, setMessages] = useState<AgentMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>({ used: 0, max: 0 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sessionRef = useRef<any>(null)
  const abortRef = useRef(false)

  // Detect engine capability on mount
  useEffect(() => {
    detectAIEngine().then(setStatus)
  }, [])

  /** Create (or re-create) a session with the given system prompt. */
  const initialize = useCallback(
    async (systemPrompt: string, onProgress?: (ratio: number) => void) => {
      // Tear down any previous session
      if (sessionRef.current) {
        try { sessionRef.current.destroy() } catch { /* ok */ }
        sessionRef.current = null
      }
      setMessages([])
      setStreamingText('')

      try {
        const session = await createSession(systemPrompt, (p) => {
          setStatus((s) => ({ ...s, downloading: true, progress: p }))
          onProgress?.(p)
        })
        sessionRef.current = session
        setStatus((s) => ({ ...s, ready: true, downloading: false, progress: undefined, error: undefined }))
        setTokenInfo({ used: session.tokensSoFar ?? 0, max: session.maxTokens ?? 0 })
      } catch (err) {
        setStatus((s) => ({
          ...s,
          ready: false,
          error: err instanceof Error ? err.message : 'Failed to initialise AI session.',
        }))
      }
    },
    [],
  )

  /** Send a user message and stream the assistant's response. */
  const send = useCallback(async (prompt: string) => {
    const session = sessionRef.current
    if (!session || isStreaming) return

    const userMsg: AgentMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: Date.now(),
    }
    setMessages((m) => [...m, userMsg])
    setIsStreaming(true)
    setStreamingText('')
    abortRef.current = false

    try {
      const stream = await session.promptStreaming(prompt)
      let accumulated = ''

      // The Prompt API stream yields the full accumulated text at each step.
      // Support both AsyncIterable (for-await) and ReadableStream (getReader).
      if (typeof stream[Symbol.asyncIterator] === 'function') {
        for await (const chunk of stream) {
          if (abortRef.current) break
          accumulated = typeof chunk === 'string' ? chunk : accumulated
          setStreamingText(accumulated)
        }
      } else if (typeof stream.getReader === 'function') {
        const reader = (stream as ReadableStream<string>).getReader()
        try {
          // eslint-disable-next-line no-constant-condition
          while (true) {
            if (abortRef.current) break
            const { done, value } = await reader.read()
            if (done) break
            accumulated = typeof value === 'string' ? value : accumulated
            setStreamingText(accumulated)
          }
        } finally {
          reader.releaseLock()
        }
      }

      if (!abortRef.current && accumulated) {
        const assistantMsg: AgentMessage = {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: accumulated,
          timestamp: Date.now(),
        }
        setMessages((m) => [...m, assistantMsg])
      }

      // Update token usage
      setTokenInfo({ used: session.tokensSoFar ?? 0, max: session.maxTokens ?? 0 })
    } catch (err) {
      const errorMsg: AgentMessage = {
        id: `e-${Date.now()}`,
        role: 'assistant',
        content: `I wasn't able to process that. ${err instanceof Error ? err.message : 'Please try again.'}`,
        timestamp: Date.now(),
      }
      setMessages((m) => [...m, errorMsg])
    } finally {
      setIsStreaming(false)
      setStreamingText('')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStreaming])

  /** Destroy the session and clear all messages. */
  const reset = useCallback(() => {
    if (sessionRef.current) {
      try { sessionRef.current.destroy() } catch { /* ok */ }
      sessionRef.current = null
    }
    setMessages([])
    setStreamingText('')
    setTokenInfo({ used: 0, max: 0 })
  }, [])

  /** Abort the current streaming response. */
  const stop = useCallback(() => {
    abortRef.current = true
  }, [])

  // Clean up on unmount
  useEffect(
    () => () => {
      if (sessionRef.current) {
        try { sessionRef.current.destroy() } catch { /* ok */ }
      }
    },
    [],
  )

  return { status, messages, isStreaming, streamingText, tokenInfo, initialize, send, reset, stop }
}
