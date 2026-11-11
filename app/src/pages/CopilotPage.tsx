import { useState } from 'react'
import { Bot, MessageCircleHeart, Sparkles } from 'lucide-react'
import { PageIntro } from '../components/AppShell'
import { AgentChat } from '../components/agent/AgentChat'
import { ParentingPlaybook } from '../components/agent/ParentingPlaybook'
import { useAgent } from '../lib/ai/useAgent'
import { buildCopilotPrompt, buildCringeCheckPrompt } from '../lib/ai/systemPrompts'

const modes = [
  {
    id: 'copilot' as const,
    label: 'Co-pilot',
    icon: Bot,
    prompt: buildCopilotPrompt(),
    placeholder: 'Ask about a word, emoji, situation, or platform…',
    intro:
      "I can help you understand slang, decode messages, or prepare for a conversation with your teen. What's on your mind?",
  },
  {
    id: 'cringe' as const,
    label: 'Cringe Checker',
    icon: MessageCircleHeart,
    prompt: buildCringeCheckPrompt(),
    placeholder: 'Paste the text you want to send your teen…',
    intro:
      "Paste a message you're thinking of sending to your teen, and I'll let you know if it lands naturally or could use a tweak.",
  },
]

export default function CopilotPage() {
  const { status } = useAgent()
  const [mode, setMode] = useState<'copilot' | 'cringe'>('copilot')
  const active = modes.find((m) => m.id === mode)!

  // When on-device AI is unavailable: Render Interactive Parenting Playbook without dead-end error
  if (status.engine === 'unavailable') {
    return (
      <div className="page-shell copilot-page">
        <PageIntro
          eyebrow="Parenting Playbook"
          title="Your parenting communication partner."
        >
          <p>
            Actionable communication strategies, real-world scenario breakdowns, and
            tone check frameworks for navigating modern teen conversation.
          </p>
        </PageIntro>

        <ParentingPlaybook />
      </div>
    )
  }

  // When AI is available: Render live interactive Co-pilot & Cringe Checker
  return (
    <div className="page-shell copilot-page">
      <PageIntro eyebrow="AI Co-pilot" title="Your parenting communication partner.">
        <p>
          Powered by on-device AI. Your messages stay in this browser and are
          never sent to a server.
        </p>
      </PageIntro>

      <div className="copilot-modes" role="tablist" aria-label="Co-pilot mode">
        {modes.map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={mode === m.id}
            onClick={() => setMode(m.id)}
          >
            <m.icon size={17} /> {m.label}
          </button>
        ))}
      </div>

      <AgentChat
        key={mode}
        systemPrompt={active.prompt}
        placeholder={active.placeholder}
        introMessage={active.intro}
      />

      <p className="privacy-line copilot-privacy">
        <Sparkles size={14} /> Responses are generated locally and may not always
        be accurate. Use your judgment — and your relationship — as the real guide.
      </p>
    </div>
  )
}

