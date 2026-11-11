import { useState, useRef, useEffect } from 'react'
import { ArrowRight, Clipboard, RotateCcw, Sparkles, Square } from 'lucide-react'
import { useAgent } from '../../lib/ai/useAgent'
import { PrivacyBadge } from './PrivacyBadge'
import { StreamingText } from './StreamingText'
import { copyText, useApp } from '../../store'
import { ChromeAISetupGuide } from './ChromeAISetupGuide'

export const DEFAULT_STARTER_PROMPTS = [
  "My 12-year-old was called 'cooked' on Discord—how worried should I be?",
  "Check if my text asking them to do dishes sounds passive-aggressive",
  "How do I ask about 'plug 🔌' without sounding like a cop?",
  "What does 'crash out' mean in gaming?",
  "Is 'delulu' just a joke or low self-esteem?",
] as const

export const STARTER_PILLS = DEFAULT_STARTER_PROMPTS

export interface AgentChatProps {
  systemPrompt: string
  placeholder?: string
  introMessage?: string
  starterPrompts?: readonly string[] | string[]
}

export function AgentChat({
  systemPrompt,
  placeholder = 'Type your message…',
  introMessage,
  starterPrompts = DEFAULT_STARTER_PROMPTS,
}: AgentChatProps) {
  const { status, messages, isStreaming, streamingText, initialize, send, reset, stop } = useAgent()
  const { notify } = useApp()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current && status.engine !== 'unavailable') {
      initialized.current = true
      initialize(systemPrompt)
    }
  }, [status.engine, initialize, systemPrompt])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingText])

  const handleSend = () => {
    const text = input.trim()
    if (!text || isStreaming) return
    setInput('')
    send(text)
  }

  const handleReset = () => {
    reset()
    initialized.current = false
    initialize(systemPrompt)
  }

  const handlePillSelect = (promptText: string) => {
    if (isStreaming || Boolean(status.downloading)) return
    setInput(promptText)
    inputRef.current?.focus()
  }

  const handlePillKeyDown = (e: React.KeyboardEvent, promptText: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handlePillSelect(promptText)
    }
  }

  if (status.engine === 'unavailable') {
    return (
      <div className="agent-unavailable">
        <h3>On-device AI is not available</h3>
        <p>
          The Parent Decoder Co-pilot uses Chrome's built-in AI to keep your
          conversations 100% private and on-device.
        </p>
        <p>To use this feature:</p>
        <ol>
          <li>
            Open this page in <strong>Google Chrome</strong>,{' '}
            <strong>Microsoft Edge</strong>, or <strong>Brave</strong> on a
            desktop computer.
          </li>
          <li>Make sure you're on the latest version of the browser.</li>
          <li>Enable the Prompt API if prompted.</li>
        </ol>
        <p>No data ever leaves your device when using on-device AI.</p>
        <ChromeAISetupGuide defaultOpen={false} />
      </div>
    )
  }

  const isPillDisabled = isStreaming || Boolean(status.downloading)

  return (
    <div className="agent-chat">
      <div className="agent-chat-header">
        <PrivacyBadge status={status} />
        {messages.length > 0 && (
          <button className="button button-ghost button-small" onClick={handleReset}>
            <RotateCcw size={14} /> New conversation
          </button>
        )}
      </div>

      <div className="agent-messages">
        {introMessage && messages.length === 0 && !isStreaming && (
          <div className="agent-message agent-message-assistant agent-intro">
            <p>{introMessage}</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`agent-message agent-message-${msg.role}`}>
            <p>{msg.content}</p>
            {msg.role === 'assistant' && (
              <button
                className="agent-copy"
                aria-label="Copy response"
                onClick={async () => {
                  await copyText(msg.content)
                  notify('Response copied')
                }}
              >
                <Clipboard size={14} />
              </button>
            )}
          </div>
        ))}
        {isStreaming && (
          <div className="agent-message agent-message-assistant">
            <StreamingText text={streamingText} isStreaming />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="agent-input" onSubmit={(e) => { e.preventDefault(); handleSend() }}>
        {starterPrompts && starterPrompts.length > 0 && (
          <div className="agent-starter-pills" role="region" aria-label="Suggested starter prompts">
            <div className="starter-pills-header">
              <span className="starter-pills-label">
                <Sparkles size={13} aria-hidden="true" />
                Prompt &amp; Play
              </span>
            </div>
            <div className="starter-pills-tray starter-pills-list" role="group" aria-label="Starter prompts">
              {starterPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="starter-pill"
                  disabled={isPillDisabled}
                  aria-disabled={isPillDisabled}
                  onClick={() => handlePillSelect(prompt)}
                  onKeyDown={(e) => handlePillKeyDown(e, prompt)}
                  title={prompt}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder={placeholder}
          rows={2}
          maxLength={600}
          disabled={isStreaming}
        />
        <div className="agent-input-actions">
          {isStreaming ? (
            <button type="button" className="button button-small button-outline" onClick={stop}>
              <Square size={14} /> Stop
            </button>
          ) : (
            <button type="submit" className="button button-small" disabled={!input.trim()}>
              Send <ArrowRight size={15} />
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
