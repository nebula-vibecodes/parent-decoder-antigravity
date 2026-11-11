import { useState, useRef, useEffect, useMemo } from 'react'
import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Check,
  Copy,
  Lightbulb,
  MessageCircleHeart,
  MessageSquareQuote,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react'
import { useAgent } from '../../lib/ai/useAgent'
import { buildRoleplayPrompt } from '../../lib/ai/systemPrompts'
import { getFallbackScriptForTerm } from '../../lib/ai/fallbackScripts'
import { ChromeAISetupGuide } from './ChromeAISetupGuide'
import { PrivacyBadge } from './PrivacyBadge'
import { StreamingText } from './StreamingText'
import { copyText, useApp } from '../../store'
import type { Term } from '../../data'

export function RoleplayChat({
  term,
  open,
  onClose,
}: {
  term: Term
  open: boolean
  onClose: () => void
}) {
  const { status, messages, isStreaming, streamingText, initialize, send, reset } = useAgent()
  const { notify, saveAIOutput, isAIOutputSaved } = useApp()
  const [input, setInput] = useState('')
  const [scriptCopied, setScriptCopied] = useState(false)
  const [openerCopied, setOpenerCopied] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const initialized = useRef(false)

  const isFallback = status.engine === 'unavailable'
  const fallbackScript = useMemo(() => getFallbackScriptForTerm(term), [term])

  const saveTitle = 'Practice: ' + term.term
  const isSaved = isAIOutputSaved(saveTitle, 'roleplay')

  useEffect(() => {
    if (open && !initialized.current && status.engine !== 'unavailable') {
      initialized.current = true
      initialize(buildRoleplayPrompt(term))
    }
  }, [open, status.engine, initialize, term])

  useEffect(() => {
    if (open && !isFallback) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open, isFallback])

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
    initialize(buildRoleplayPrompt(term))
  }

  const handleSaveFallbackScript = () => {
    const dialogueTranscript = fallbackScript.dialogue
      .map((d) => `${d.speaker}: ${d.text}`)
      .join('\n')

    saveAIOutput({
      type: 'roleplay',
      title: saveTitle,
      content: dialogueTranscript,
      summary: fallbackScript.situation || `Dialogue script for ${term.term}`,
      metadata: {
        termSlug: term.slug,
        termName: term.term,
        category: term.category,
      },
    })
  }

  const handleSaveLiveSession = () => {
    if (messages.length === 0) return
    const dialogueTranscript = messages
      .map((m) => `${m.role === 'user' ? 'Parent' : 'Teen'}: ${m.content}`)
      .join('\n')

    saveAIOutput({
      type: 'roleplay',
      title: saveTitle,
      content: dialogueTranscript,
      summary: `Interactive roleplay session for ${term.term}`,
      metadata: {
        termSlug: term.slug,
        termName: term.term,
        category: term.category,
      },
    })
  }

  const handleCopyScript = async () => {
    const lines: string[] = []
    if (fallbackScript.situation) {
      lines.push(`Scenario: ${fallbackScript.situation}\n`)
    }
    if (fallbackScript.recommendedOpener) {
      lines.push(`Recommended Opener: “${fallbackScript.recommendedOpener}”\n`)
    }
    lines.push('--- Conversation Script ---')
    fallbackScript.dialogue.forEach((turn) => {
      lines.push(`${turn.speaker}: ${turn.text}`)
      if (turn.coachNote) {
        lines.push(`[Coach Note: ${turn.coachNote}]`)
      }
    })
    if (fallbackScript.coachingTips && fallbackScript.coachingTips.length > 0) {
      lines.push('\n--- Coaching Tips ---')
      fallbackScript.coachingTips.forEach((tip, idx) => {
        lines.push(`${idx + 1}. ${tip}`)
      })
    }
    await copyText(lines.join('\n'))
    setScriptCopied(true)
    notify('Conversation script copied')
    setTimeout(() => setScriptCopied(false), 2000)
  }

  const handleCopyOpener = async () => {
    await copyText(fallbackScript.recommendedOpener || term.opener)
    setOpenerCopied(true)
    notify('Conversation opener copied')
    setTimeout(() => setOpenerCopied(false), 2000)
  }

  if (!open) return null

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section
        className={`roleplay-drawer ${isFallback ? 'roleplay-drawer-fallback' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={
          isFallback
            ? `Conversation script & coaching tips for ${term.term}`
            : `Practice conversation about ${term.term}`
        }
      >
        <header className="roleplay-header">
          <div>
            {isFallback ? <BookOpen size={20} /> : <MessageCircleHeart size={20} />}
            <h2>
              {isFallback ? 'Conversation Script & Tips: ' : 'Practice: '}
              &ldquo;{term.term}&rdquo;
            </h2>
          </div>
          <div>
            <PrivacyBadge status={status} />
            <button className="icon-button" onClick={onClose} aria-label="Close">
              <X size={19} />
            </button>
          </div>
        </header>

        <div className="roleplay-intro">
          {isFallback ? (
            <>
              <p>
                On-device AI is offline in this browser. Review this prepared sample dialogue and coaching tips to practice naturally.
              </p>
              <p className="mono-label">
                Recommended opener: &ldquo;{fallbackScript.recommendedOpener || term.opener}&rdquo;
              </p>
            </>
          ) : (
            <>
              <p>
                Try saying what you'd say to your teen. The AI will respond as a realistic
                teenager and coach you afterward.
              </p>
              <p className="mono-label">Suggested opener: &ldquo;{term.opener}&rdquo;</p>
            </>
          )}
        </div>

        {isFallback ? (
          <div className="roleplay-fallback-view">
            <div className="roleplay-fallback-scroll" tabIndex={0} aria-label="Conversation script and tips">
              {/* Scenario Context Card */}
              <div className="fallback-scenario-card">
                <div className="fallback-scenario-header">
                  <MessageSquareQuote size={17} />
                  <strong>Scenario Context</strong>
                </div>
                <p className="fallback-scenario-text">{fallbackScript.situation}</p>
                <div className="fallback-opener-row">
                  <span className="mono-label">Recommended opener:</span>
                  <div className="fallback-opener-box">
                    <blockquote>&ldquo;{fallbackScript.recommendedOpener || term.opener}&rdquo;</blockquote>
                    <button
                      type="button"
                      className="button button-ghost button-small copy-opener-btn"
                      onClick={handleCopyOpener}
                      aria-label="Copy recommended opener"
                    >
                      {openerCopied ? <Check size={14} /> : <Copy size={14} />}
                      {openerCopied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Sample Dialogue Turns */}
              <div className="fallback-dialogue-section">
                <div className="fallback-section-title">
                  <Sparkles size={16} />
                  <h3>Sample Conversation Script</h3>
                </div>
                <div className="fallback-dialogue-bubbles">
                  {fallbackScript.dialogue.map((turn, idx) => (
                    <div
                      key={idx}
                      className={`agent-message ${
                        turn.speaker === 'Parent' ? 'agent-message-user' : 'agent-message-assistant'
                      } fallback-turn-bubble`}
                    >
                      <span className="agent-message-label">
                        {turn.speaker === 'Parent' ? 'You (parent)' : 'Teen'}
                      </span>
                      <p className="fallback-turn-text">{turn.text}</p>
                      {turn.coachNote && (
                        <div
                          className={`fallback-coach-note ${
                            turn.speaker === 'Parent' ? 'coach-note-user' : 'coach-note-assistant'
                          }`}
                        >
                          <span className="fallback-coach-tag">
                            <Sparkles size={11} /> Coach insight
                          </span>
                          <span className="fallback-coach-explanation">{turn.coachNote}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Coaching Tips */}
              <div className="fallback-coaching-section">
                <div className="fallback-section-title">
                  <Lightbulb size={16} />
                  <h3>Parent Coaching Tips</h3>
                </div>
                <div className="fallback-tips-grid">
                  {fallbackScript.coachingTips.map((tip, idx) => (
                    <div key={idx} className="fallback-tip-card">
                      <span className="fallback-tip-badge">Tip {idx + 1}</span>
                      <p className="fallback-tip-body">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chrome AI Setup Guide (R4 & T3.4) */}
              <div className="fallback-guide-container">
                <div className="fallback-guide-intro">
                  <p>
                    <strong>Want interactive practice with live responses?</strong> Enable Google Chrome's built-in on-device AI in 60 seconds.
                  </p>
                </div>
                <ChromeAISetupGuide defaultOpen={false} compact={true} />
              </div>
            </div>

            {/* Fallback Action Footer */}
            <footer className="roleplay-fallback-footer">
              <div className="roleplay-footer-actions">
                <button
                  type="button"
                  className={isSaved ? 'button button-small saved-button' : 'button button-small button-outline'}
                  onClick={handleSaveFallbackScript}
                >
                  {isSaved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                  {isSaved ? 'Saved to Saved Items' : 'Save script to Saved Items'}
                </button>
                <button
                  type="button"
                  className="button button-small button-outline"
                  onClick={handleCopyScript}
                >
                  {scriptCopied ? <Check size={14} /> : <Copy size={14} />}
                  {scriptCopied ? 'Copied script' : 'Copy script'}
                </button>
              </div>
              <button
                type="button"
                className="button button-ghost button-small"
                onClick={onClose}
              >
                Close
              </button>
            </footer>
          </div>
        ) : (
          /* Live Interactive Roleplay View */
          <>
            <div className="roleplay-messages">
              {messages.map((msg) => (
                <div key={msg.id} className={`agent-message agent-message-${msg.role}`}>
                  <span className="agent-message-label">
                    {msg.role === 'user' ? 'You (parent)' : 'Teen'}
                  </span>
                  <p>{msg.content}</p>
                </div>
              ))}
              {isStreaming && (
                <div className="agent-message agent-message-assistant">
                  <span className="agent-message-label">Teen</span>
                  <StreamingText text={streamingText} isStreaming />
                </div>
              )}
              {messages.length === 0 && !isStreaming && (
                <div className="agent-message agent-message-assistant agent-intro">
                  <p>Go ahead — try your opening line. I'll respond as your teen would.</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="roleplay-input" onSubmit={(e) => { e.preventDefault(); handleSend() }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type what you'd say to your teen…"
                maxLength={500}
                disabled={isStreaming}
              />
              <button
                type="submit"
                className="button button-small"
                disabled={!input.trim() || isStreaming}
              >
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="roleplay-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button className="button button-ghost button-small" onClick={handleReset}>
                <RotateCcw size={14} /> Start over
              </button>
              {messages.length > 0 && (
                <button
                  type="button"
                  className={isSaved ? 'button button-small saved-button' : 'button button-small button-outline'}
                  onClick={handleSaveLiveSession}
                  disabled={isSaved}
                >
                  {isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                  {isSaved ? 'Saved to Saved Items' : 'Save session'}
                </button>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
