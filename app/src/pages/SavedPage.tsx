import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  Clipboard,
  Compass,
  ExternalLink,
  LockKeyhole,
  MessageSquareText,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { findTerm } from '../data'
import { PageIntro, TermCard } from '../components/AppShell'
import { copyText, useApp, type SavedAIOutput } from '../store'

export type SavedTab = 'terms' | 'messages' | 'tone-analysis' | 'roleplay' | 'playbook'

interface TabConfig {
  id: SavedTab
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  count: number
  clearLabel: string
}

export default function SavedPage() {
  const {
    savedTerms,
    savedMessages,
    savedAIOutputs,
    removeMessage,
    removeAIOutput,
    clearMessages,
    clearTerms,
    clearAIOutputs,
    notify,
  } = useApp()

  const [tab, setTab] = useState<SavedTab>('terms')
  const [confirm, setConfirm] = useState(false)
  const navigate = useNavigate()

  const toneReadings = useMemo(
    () => savedAIOutputs.filter((item) => item.type === 'tone-analysis'),
    [savedAIOutputs]
  )

  const practiceSessions = useMemo(
    () => savedAIOutputs.filter((item) => item.type === 'roleplay'),
    [savedAIOutputs]
  )

  const playbookNotes = useMemo(
    () => savedAIOutputs.filter((item) => item.type === 'playbook'),
    [savedAIOutputs]
  )

  const tabs: TabConfig[] = [
    {
      id: 'terms',
      label: 'Terms',
      icon: Bookmark,
      count: savedTerms.length,
      clearLabel: 'terms',
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquareText,
      count: savedMessages.length,
      clearLabel: 'messages',
    },
    {
      id: 'tone-analysis',
      label: 'Tone Readings',
      icon: Sparkles,
      count: toneReadings.length,
      clearLabel: 'tone readings',
    },
    {
      id: 'roleplay',
      label: 'Practice Sessions',
      icon: BookOpen,
      count: practiceSessions.length,
      clearLabel: 'practice sessions',
    },
    {
      id: 'playbook',
      label: 'Playbook Notes',
      icon: Compass,
      count: playbookNotes.length,
      clearLabel: 'playbook notes',
    },
  ]

  const activeTabConfig = tabs.find((t) => t.id === tab) ?? tabs[0]
  const currentCount = activeTabConfig.count

  const handleClear = () => {
    if (tab === 'terms') {
      clearTerms()
    } else if (tab === 'messages') {
      clearMessages()
    } else {
      clearAIOutputs(tab)
    }
    setConfirm(false)
  }

  const handleCopyAIItem = async (item: SavedAIOutput, label: string) => {
    const parts: string[] = [item.title]
    if (item.summary) {
      parts.push(item.summary)
    }
    parts.push(item.content)
    await copyText(parts.join('\n\n'))
    notify(`${label} copied`)
  }

  return (
    <div className="page-shell saved-page">
      <PageIntro eyebrow="Your private collection" title="Kept only where you left them.">
        <p>
          Saved terms, messages, tone readings, practice scripts, and playbook notes live in this
          browser on this device. They do not sync, and clearing browser data removes them.
        </p>
      </PageIntro>

      <div className="saved-tabs" role="tablist" aria-label="Saved items categories">
        {tabs.map((t) => {
          const Icon = t.icon
          const isSelected = tab === t.id
          return (
            <button
              type="button"
              key={t.id}
              role="tab"
              id={`tab-${t.id}`}
              aria-controls={`tabpanel-${t.id}`}
              aria-selected={isSelected}
              onClick={() => {
                setTab(t.id)
                setConfirm(false)
              }}
            >
              <Icon size={17} /> {t.label} <span>{t.count}</span>
            </button>
          )
        })}
      </div>

      <div
        id={`tabpanel-${tab}`}
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
      >
        {currentCount > 0 ? (
          <>
            <div className="saved-list">
              {tab === 'terms' && (
                <div className="term-grid">
                  {savedTerms.map((slug) => {
                    const item = findTerm(slug)
                    return item ? <TermCard key={slug} item={item} /> : null
                  })}
                </div>
              )}

              {tab === 'messages' &&
                savedMessages.map((item) => (
                  <article className="saved-message" key={item.id}>
                    <button
                      type="button"
                      onClick={() => navigate(`/decoder?q=${encodeURIComponent(item.text)}`)}
                      aria-label={`Open decoder with message: ${item.text}`}
                    >
                      <span>{item.text}</span>
                      <small>Saved {new Date(item.savedAt).toLocaleDateString()}</small>
                    </button>
                    <button
                      type="button"
                      className="icon-button"
                      aria-label={`Delete saved message: ${item.text}`}
                      onClick={() => removeMessage(item.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </article>
                ))}

              {tab === 'tone-analysis' && (
                <div className="saved-ai-grid">
                  {toneReadings.map((item) => (
                    <article className="saved-ai-card" key={item.id}>
                      <div className="saved-ai-meta">
                        <span className="saved-ai-tag tag-tone-analysis">Tone Reading</span>
                        <small>{new Date(item.savedAt).toLocaleDateString()}</small>
                      </div>
                      <h3>{item.title}</h3>
                      {(item.metadata?.message || item.metadata?.originalMessage) && (
                        <blockquote className="saved-quote-box">
                          &ldquo;{item.metadata.message || item.metadata.originalMessage}&rdquo;
                        </blockquote>
                      )}
                      {item.summary && <p className="saved-ai-summary">{item.summary}</p>}
                      <div className="saved-ai-content">
                        <pre>{item.content}</pre>
                      </div>
                      <div className="saved-ai-actions">
                        <button
                          type="button"
                          className="button button-small button-outline"
                          onClick={() => handleCopyAIItem(item, 'Tone reading')}
                        >
                          <Clipboard size={14} /> Copy reading
                        </button>
                        {item.metadata?.termSlug && (
                          <Link
                            to={`/term/${item.metadata.termSlug}`}
                            className="button button-small button-ghost"
                          >
                            <ExternalLink size={13} /> View term
                          </Link>
                        )}
                        <button
                          type="button"
                          className="icon-button"
                          aria-label={`Delete ${item.title}`}
                          onClick={() => removeAIOutput(item.id)}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {tab === 'roleplay' && (
                <div className="saved-ai-grid">
                  {practiceSessions.map((item) => (
                    <article className="saved-ai-card" key={item.id}>
                      <div className="saved-ai-meta">
                        <span className="saved-ai-tag tag-roleplay">Practice Session</span>
                        <small>{new Date(item.savedAt).toLocaleDateString()}</small>
                      </div>
                      <h3>{item.title}</h3>
                      {item.metadata?.termSlug && (
                        <div className="saved-meta-row">
                          <Link
                            to={`/term/${item.metadata.termSlug}`}
                            className="saved-meta-badge"
                          >
                            <ExternalLink size={12} /> Term: {item.metadata.termName || item.metadata.termSlug}
                          </Link>
                          {item.metadata?.category && (
                            <span className="saved-meta-pill">{item.metadata.category}</span>
                          )}
                        </div>
                      )}
                      {item.summary && <p className="saved-ai-summary">{item.summary}</p>}
                      <div className="saved-ai-content">
                        <pre>{item.content}</pre>
                      </div>
                      <div className="saved-ai-actions">
                        <button
                          type="button"
                          className="button button-small button-outline"
                          onClick={() => handleCopyAIItem(item, 'Practice session')}
                        >
                          <Clipboard size={14} /> Copy script
                        </button>
                        {item.metadata?.termSlug && (
                          <Link
                            to={`/term/${item.metadata.termSlug}`}
                            className="button button-small button-ghost"
                          >
                            <ExternalLink size={13} /> View term
                          </Link>
                        )}
                        <button
                          type="button"
                          className="icon-button"
                          aria-label={`Delete ${item.title}`}
                          onClick={() => removeAIOutput(item.id)}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {tab === 'playbook' && (
                <div className="saved-ai-grid">
                  {playbookNotes.map((item) => (
                    <article className="saved-ai-card" key={item.id}>
                      <div className="saved-ai-meta">
                        <span className="saved-ai-tag tag-playbook">Playbook Note</span>
                        <small>{new Date(item.savedAt).toLocaleDateString()}</small>
                      </div>
                      <h3>{item.title}</h3>
                      {(item.metadata?.tag || item.metadata?.badgeLabel || item.metadata?.score) && (
                        <div className="saved-meta-row">
                          {item.metadata?.tag && (
                            <span className="saved-meta-pill">{item.metadata.tag}</span>
                          )}
                          {item.metadata?.badgeLabel && (
                            <span className={`saved-meta-tier tier-${item.metadata.tier || 'harmless'}`}>
                              {item.metadata.badgeLabel}
                            </span>
                          )}
                          {item.metadata?.score && item.metadata?.total && (
                            <span className="saved-meta-pill">
                              Score: {item.metadata.score}/{item.metadata.total}
                            </span>
                          )}
                        </div>
                      )}
                      {item.summary && <p className="saved-ai-summary">{item.summary}</p>}
                      <div className="saved-ai-content">
                        <pre>{item.content}</pre>
                      </div>
                      <div className="saved-ai-actions">
                        <button
                          type="button"
                          className="button button-small button-outline"
                          onClick={() => handleCopyAIItem(item, 'Playbook note')}
                        >
                          <Clipboard size={14} /> Copy note
                        </button>
                        <Link
                          to="/copilot"
                          className="button button-small button-ghost"
                        >
                          <Compass size={13} /> View in Playbook
                        </Link>
                        <button
                          type="button"
                          className="icon-button"
                          aria-label={`Delete ${item.title}`}
                          onClick={() => removeAIOutput(item.id)}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="clear-row">
              {confirm ? (
                <>
                  <span>Clear all saved {activeTabConfig.clearLabel}?</span>
                  <button type="button" className="button button-small" onClick={handleClear}>
                    Yes, clear
                  </button>
                  <button
                    type="button"
                    className="button button-small button-outline"
                    onClick={() => setConfirm(false)}
                  >
                    Keep them
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="button button-ghost"
                  onClick={() => setConfirm(true)}
                >
                  <Trash2 size={16} /> Clear saved {activeTabConfig.clearLabel}
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="empty-state">
            {tab === 'terms' && (
              <>
                <Bookmark size={30} />
                <h2>Nothing saved here yet.</h2>
                <p>Use the bookmark on any term guide to keep it close.</p>
                <Link className="button" to="/browse">
                  Explore the library <ArrowRight size={16} />
                </Link>
              </>
            )}
            {tab === 'messages' && (
              <>
                <MessageSquareText size={30} />
                <h2>No messages saved yet.</h2>
                <p>Choose &ldquo;Save locally&rdquo; after decoding a message. Nothing is saved automatically.</p>
                <Link className="button" to="/decoder">
                  Open the decoder <ArrowRight size={16} />
                </Link>
              </>
            )}
            {tab === 'tone-analysis' && (
              <>
                <Sparkles size={30} />
                <h2>No tone readings saved yet.</h2>
                <p>
                  Run a tone &amp; context analysis in the Decoder and choose &ldquo;Save to Saved Items&rdquo; to keep guidance handy.
                </p>
                <Link className="button" to="/decoder">
                  Analyze a message <ArrowRight size={16} />
                </Link>
              </>
            )}
            {tab === 'roleplay' && (
              <>
                <BookOpen size={30} />
                <h2>No practice sessions saved yet.</h2>
                <p>
                  Save conversation scripts or live roleplay dialogues from any term page to review conversation strategies.
                </p>
                <Link className="button" to="/browse">
                  Browse terms to practice <ArrowRight size={16} />
                </Link>
              </>
            )}
            {tab === 'playbook' && (
              <>
                <Compass size={30} />
                <h2>No playbook notes saved yet.</h2>
                <p>
                  Save parenting scenarios or tone checklist evaluations from the Parenting Playbook for quick reference.
                </p>
                <Link className="button" to="/copilot">
                  Explore the Co-pilot &amp; Playbook <ArrowRight size={16} />
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      <p className="privacy-line saved-privacy">
        <LockKeyhole size={14} /> Browser-local only. No account, cloud copy, or cross-device sync.
      </p>
    </div>
  )
}
