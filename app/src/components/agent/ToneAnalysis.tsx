import { useState } from 'react'
import { Bookmark, BookmarkCheck, Clipboard, RotateCcw, Sparkles } from 'lucide-react'
import { useAgent } from '../../lib/ai/useAgent'
import { buildToneAnalysisPrompt } from '../../lib/ai/systemPrompts'
import { PrivacyBadge } from './PrivacyBadge'
import { StreamingText } from './StreamingText'
import { copyText, useApp } from '../../store'
import type { Term } from '../../data'

export function ToneAnalysis({ message, matchedTerms }: { message: string; matchedTerms: Term[] }) {
  const { status, messages, isStreaming, streamingText, initialize, send, reset } = useAgent()
  const { notify, saveAIOutput, isAIOutputSaved } = useApp()
  const [started, setStarted] = useState(false)

  const analyze = async () => {
    setStarted(true)
    await initialize(buildToneAnalysisPrompt(matchedTerms, message))
    await send('Please analyze the tone and context of this message.')
  }

  const lastAssistant = messages.filter((m) => m.role === 'assistant').at(-1)

  const trimmedMessage = message.trim()
  const title = 'Tone: ' + trimmedMessage.slice(0, 30) + (trimmedMessage.length > 30 ? '…' : '')
  const isSaved = isAIOutputSaved(title, 'tone-analysis')

  const handleSave = () => {
    if (!lastAssistant) return
    saveAIOutput({
      type: 'tone-analysis',
      title,
      content: lastAssistant.content,
      summary: `Tone reading for: “${trimmedMessage.slice(0, 70)}${trimmedMessage.length > 70 ? '…' : ''}”`,
      metadata: {
        message: trimmedMessage,
        originalMessage: message,
      },
    })
    notify('Tone analysis saved to your collection')
  }

  // Hide the component entirely if on-device AI is not available
  if (status.engine === 'unavailable') return null

  if (!started) {
    return (
      <div className="tone-analysis">
        <button type="button" className="button button-outline" onClick={analyze}>
          <Sparkles size={17} /> Analyze tone & context
        </button>
        <PrivacyBadge status={status} />
      </div>
    )
  }

  return (
    <section className="tone-analysis tone-analysis-active" aria-live="polite">
      <div className="tone-analysis-header">
        <span className="mono-label">AI tone reading</span>
        <PrivacyBadge status={status} />
      </div>
      {isStreaming ? (
        <StreamingText text={streamingText} isStreaming />
      ) : lastAssistant ? (
        <div className="tone-analysis-result">
          <p>{lastAssistant.content}</p>
          <div className="tone-analysis-actions">
            <button
              type="button"
              className="button button-small"
              onClick={async () => {
                await copyText(lastAssistant.content)
                notify('Tone analysis copied')
              }}
            >
              <Clipboard size={15} /> Copy
            </button>
            <button
              type="button"
              className={`button button-small ${isSaved ? 'saved-button' : 'button-light'}`}
              onClick={handleSave}
              disabled={isSaved}
              aria-label={isSaved ? 'Saved to Saved Items' : 'Save to Saved Items'}
            >
              {isSaved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
              {isSaved ? 'Saved to Saved Items' : 'Save to Saved Items'}
            </button>
            <button
              type="button"
              className="button button-small button-outline"
              onClick={() => {
                reset()
                setStarted(false)
              }}
            >
              <RotateCcw size={15} /> Reset
            </button>
          </div>
        </div>
      ) : (
        <StreamingText text="" isStreaming />
      )}
    </section>
  )
}
