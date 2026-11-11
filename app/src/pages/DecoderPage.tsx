import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ArrowRight, BookmarkPlus, Check, Clipboard, LockKeyhole, MessagesSquare, RotateCcw, ScanText } from 'lucide-react'
import { useApp, copyText } from '../store'
import { decodeMessage } from '../data'
import { DecodeResults } from './HomePage'
import { PageIntro } from '../components/AppShell'
import { ToneAnalysis } from '../components/agent/ToneAnalysis'

export default function DecoderPage() {
  const [params] = useSearchParams()
  const [draft, setDraft] = useState(params.get('q') ?? '')
  const [submitted, setSubmitted] = useState(params.get('q') ?? '')
  const { saveMessage, notify } = useApp()
  const decode = () => { if (draft.trim()) setSubmitted(draft.trim()) }
  const copySummary = async () => {
    const matches = decodeMessage(submitted)
    await copyText(`Message: ${submitted}\n\n${matches.map((item) => `${item.term}: ${item.plainMeaning}`).join('\n')}`)
    notify('Decoding summary copied')
  }
  return <div className="page-shell narrow-page">
    <PageIntro eyebrow="Whole-message decoder" title="Paste the message. See the whole picture.">
      <p>We’ll highlight the words we recognise and explain them in plain English. Matching runs in your browser; no text is sent anywhere.</p>
    </PageIntro>
    <form className="decoder-form" onSubmit={(e) => { e.preventDefault(); decode() }}>
      <div className="field-heading"><label htmlFor="decoder-text">What did you see or hear?</label><span>{draft.length}/600</span></div>
      <textarea id="decoder-text" rows={5} maxLength={600} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); decode() } }} placeholder="e.g. ngl that party was mid fr fr 💀" />
      <p className="field-help">Enter to decode · Shift + Enter for a new line</p>
      <div className="decoder-form-actions"><button className="button" type="submit" disabled={!draft.trim()}><ScanText size={18} /> Decode message</button>{submitted && <button className="button button-outline" type="button" onClick={() => { setDraft(''); setSubmitted('') }}><RotateCcw size={16} /> Start over</button>}{draft.trim() && <button className="button button-ghost" type="button" onClick={() => saveMessage(draft)}><BookmarkPlus size={17} /> Save locally</button>}</div>
      <p className="privacy-line"><LockKeyhole size={14} /> Decoding happens on this device. Saving is optional and stays in this browser.</p>
    </form>
    {submitted && <section className="decoder-output" aria-live="polite"><div className="output-toolbar"><span><Check size={16} /> Local reading complete</span><button onClick={copySummary}><Clipboard size={15} /> Copy summary</button></div><DecodeResults text={submitted} /><ToneAnalysis message={submitted} matchedTerms={decodeMessage(submitted)} /></section>}
    {!submitted && <div className="decoder-examples"><span className="mono-label">Try an example</span>{['ngl that party was mid fr fr 💀', 'I’m lowkey spiraling about tomorrow', 'GG, that save was so clutch'].map((text) => <button key={text} onClick={() => { setDraft(text); setSubmitted(text) }}>{text}<ArrowRight size={15} /></button>)}</div>}
    <div className="page-next-actions"><Link to="/conversation-starters" className="button button-outline"><MessagesSquare size={17} /> Find conversation starters</Link><Link to="/saved" className="text-link">View saved items <ArrowRight size={15} /></Link></div>
  </div>
}
