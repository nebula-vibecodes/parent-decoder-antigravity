import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  Pause,
  Play,
  Quote,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Lightbulb,
  MessageSquare,
  Sparkles,
  RotateCcw,
  Monitor,
  Check,
  Compass,
} from 'lucide-react'
import { useApp } from '../../store'
import { ChromeAISetupGuide } from './ChromeAISetupGuide'

// ─────────────────────────────────────────────────────────────
// Data Interfaces & Curated Playbook Scenarios
// ─────────────────────────────────────────────────────────────

export interface PlaybookDialogueTurn {
  speaker: 'Parent' | 'Teen'
  text: string
  coachNote?: string
}

export interface PlaybookComparisonColumn {
  heading: string
  status: 'safe' | 'warning'
  points: string[]
}

export interface PlaybookScenario {
  id: string
  title: string
  tag: string
  description: string
  parentApproach: string
  sampleDialogue: string
  takeaway: string
  recommendedOpener: string
  comparison?: {
    benign: PlaybookComparisonColumn
    warning: PlaybookComparisonColumn
  }
  dialogueTurns?: PlaybookDialogueTurn[]
  coachingTips?: string[]
}

export const PLAYBOOK_SCENARIOS: PlaybookScenario[] = [
  {
    id: 'teasing-vs-bullying',
    title: 'Teasing vs Bullying',
    tag: 'Safety & Social Dynamics',
    description: 'Deciphering when friendly banter crosses into exclusionary roasting or digital harassment.',
    parentApproach: 'Ask questions about social context and reciprocity rather than reacting to single phrases.',
    sampleDialogue: 'Parent: "I heard you guys laughing at \'cooked\' earlier—did it feel like joking around or did it sting?"',
    takeaway: 'Focus on how your teen feels afterwards, not just the vocabulary used.',
    recommendedOpener: '“I heard you guys laughing at \'cooked\' earlier—did it feel like joking around or did it sting?”',
    comparison: {
      benign: {
        heading: 'Healthy Peer Banter ("Roasting")',
        status: 'safe',
        points: [
          'Mutual reciprocity: both teens roast each other playfully and laugh together.',
          'Warm voice tone and open body language; humor stops immediately if someone says stop.',
          'Confined to close friend groups; not designed to lower someone\'s public social standing.',
          'Teen feels included, energized, and connected after the interaction.',
        ],
      },
      warning: {
        heading: 'Harmful Roasting / Cyberbullying',
        status: 'warning',
        points: [
          'One-sided dynamic: the same person is repeatedly targeted and cannot joke back.',
          'Public spectacle: pile-ons in group chats, sharing humiliating clips or screenshots.',
          'Target is dismissed when asking to stop ("can\'t you take a joke? you\'re so sensitive").',
          'Teen exhibits withdrawal, dread of school or Discord, or hides phone screens.',
        ],
      },
    },
    dialogueTurns: [
      {
        speaker: 'Parent',
        text: "Hey, I noticed that group chat notification where everyone was saying you got 'cooked' in the game. Were you guys just clowning around, or was that starting to get personal?",
        coachNote: "Opens with observation rather than accusation, giving your teen room to describe the dynamic.",
      },
      {
        speaker: 'Teen',
        text: "Nah, it was funny at first because I missed an easy shot, but then Marcus started tagging people from other servers who weren't even in the match.",
        coachNote: "Teen pinpoints the shift from private friendly ribbing to public embarrassment.",
      },
      {
        speaker: 'Parent',
        text: "That definitely crosses from friendly banter to an audience spectacle. How did it feel when Marcus brought outside people in?",
        coachNote: "Validates the boundary violation without immediately lecturing or threatening device bans.",
      },
      {
        speaker: 'Teen',
        text: "Honestly super annoying. I just muted the chat because it felt like a pile-on.",
        coachNote: "Teen demonstrates healthy boundary setting (muting chat).",
      },
      {
        speaker: 'Parent',
        text: "Good for you muting it. In our family, real friends can take a joke and stop when it goes too far. If Marcus keeps dragging it out, you have zero obligation to stay in that group.",
        coachNote: "Affirms their autonomous boundary and reinforces family values around mutual dignity.",
      },
    ],
    coachingTips: [
      "Track the aftermath, not the words: Harsh slang ('cooked', 'L', 'trash') can be affectionate banter between close friends. Pay attention to your teen's demeanor 30 minutes later.",
      "Ask about reciprocity: Ask 'Do both of you give each other a hard time, or is it always one-way?' A lack of reciprocity is the #1 warning sign of bullying.",
      "Support boundary enforcement: Praise your teen when they mute, block, or step away from group chats rather than treating digital conflict as something they must silently endure.",
    ],
  },
  {
    id: 'brainrot-dinner-table',
    title: 'Brainrot memes at the dinner table',
    tag: 'Daily Culture & Boundaries',
    description: 'When algorithmic meme phrases dominate family meals and conversations.',
    parentApproach: 'Channel humor into curiosity: ask for a quick translation instead of shutting it down.',
    sampleDialogue: 'Parent: "Translate that one for me before we pass the salad—what makes it funny right now?"',
    takeaway: 'Meeting meme humor with playful curiosity keeps communication channels open.',
    recommendedOpener: '“Translate that one for me before we pass the salad—what makes it funny right now?”',
    comparison: {
      benign: {
        heading: 'Why Teens Love "Brainrot"',
        status: 'safe',
        points: [
          'Shared cultural shorthand: Repeating absurdist memes creates instant peer bonding.',
          'Subversive generational humor: Slang designed to bewilder adults is a normal rite of passage.',
          'Creative play: Combining unrelated memes (e.g. "Skibidi Ohio Rizz") is surrealist linguistic wordplay.',
        ],
      },
      warning: {
        heading: 'Common Parent Pitfalls',
        status: 'warning',
        points: [
          'Treating nonsense words as cognitive decay or moral crisis ("your brain is rotting").',
          'Lecturing angrily during meals, turning a lighthearted moment into a battlefield.',
          'Forcing the slang into adult speech, causing instant cringe and shutting down sharing.',
        ],
      },
    },
    dialogueTurns: [
      {
        speaker: 'Teen',
        text: "This steamed vegetable side dish has literally negative Ohio rizz.",
        coachNote: "Teen tests mealtime patience with surrealist internet slang.",
      },
      {
        speaker: 'Parent',
        text: "Wait, before we pass the salad—translate that one for me. What makes broccoli lose its internet rizz points?",
        coachNote: "Matches humor with playful curiosity rather than immediate reprimand.",
      },
      {
        speaker: 'Teen',
        text: "Haha! You wouldn't get it, it's just total brainrot from YouTube. It means it's super weird and unseasoned.",
        coachNote: "Teen happily explains the slang because they don't feel judged.",
      },
      {
        speaker: 'Parent',
        text: "Fair critique on the seasoning! Tell you what: eat three florets of broccoli, and over dessert you can explain the lore of Skibidi Toilet to me.",
        coachNote: "Maintains a firm mealtime boundary playfully without invalidating the child's culture.",
      },
      {
        speaker: 'Teen',
        text: "Deal. But you have to promise not to use 'skibidi' in front of my friends.",
        coachNote: "Establishes a warm mutual understanding.",
      },
    ],
    coachingTips: [
      "Don't fight absurdity with solemnity: Surreal memes thrive on adult confusion; reacting with amusement neutralizes their power to provoke.",
      "Separate vocabulary from respect: Slang at the dinner table isn't inherently rude, but talking with a mouthful or ignoring family members is. Correct manners, not words.",
      "Leverage meme interest as a conversational bridge: Asking teens to explain the origin of a meme often leads to deeper discussions about algorithms, digital creators, and media consumption.",
    ],
  },
  {
    id: 'party-vs-gaming-slang',
    title: 'Deciphering party vs gaming slang',
    tag: 'Risk & Awareness',
    description: 'Distinguishing innocent gaming terminology (clutch, aggro, plug) from substance or party references.',
    parentApproach: 'Clarify the platform and context before making assumptions about risk.',
    sampleDialogue: 'Parent: "When you mentioned \'plug\' just now, were you talking about a teammate or something else?"',
    takeaway: 'Context determines risk. Many terms carry completely safe gaming definitions.',
    recommendedOpener: '“When you mentioned \'plug\' just now, were you talking about a teammate or something else?”',
    comparison: {
      benign: {
        heading: 'Gaming / Stream Context (Harmless)',
        status: 'safe',
        points: [
          '“Plug”: The reliable teammate with smoke lineups, or sneaker/hardware contact.',
          '“Geeked”: High adrenaline, intense focus, hyped about clutch gaming victory.',
          '“Crash out”: Reckless in-game push, rushing into enemies, losing character life.',
          '“Cooked”: Team is losing a round or player is out of position.',
        ],
      },
      warning: {
        heading: 'Party / Substance Context (Attention)',
        status: 'warning',
        points: [
          '“Plug”: Sourcing illicit substances, vapes, or alcohol from an unknown contact.',
          '“Geeked”: Visibly intoxicated, under influence of stimulants or substances.',
          '“Crash out”: Explosive emotional meltdown, violent fight, destructive outburst.',
          '“Cooked”: Severe mental health crisis, academic despair, burnout.',
        ],
      },
    },
    dialogueTurns: [
      {
        speaker: 'Parent',
        text: "Hey, while you were on headset earlier, I heard you tell someone to 'hit the plug.' I know that word can mean a lot of things. In this match, what did that refer to?",
        coachNote: "Direct, calm observation that allows room for benign explanation without criminalizing slang.",
      },
      {
        speaker: 'Teen',
        text: "Oh, lol! In Valorant, our friend Tyler is the 'plug' for smoke lineups because he always knows the exact map coordinates.",
        coachNote: "Teen clarifies the gaming context readily because the parent didn't accuse them.",
      },
      {
        speaker: 'Parent',
        text: "Got it! That's a huge relief—it sounded pretty intense from down the hallway. You know if you ever run into actual party or substance situations with friends, you can always talk to me without judgment, right?",
        coachNote: "Reiterates an unconditional safety net for real-world risk while acknowledging the relief.",
      },
      {
        speaker: 'Teen',
        text: "Yeah, I know. It's really just game callouts, Mom.",
        coachNote: "Teen feels heard, trusted, and reassured.",
      },
      {
        speaker: 'Parent',
        text: "Good deal. Carry on with the round!",
        coachNote: "Closes smoothly without lingering or over-monitoring.",
      },
    ],
    coachingTips: [
      "Acknowledge the 90% benign reality: Over 90% of youth slang uses 'plug', 'geeked', and 'clutch' in gaming, sneakers, or humor. Approaching with that knowledge lowers teen defensiveness.",
      "Check the environment first: Were they wearing a headset playing competitive games? Looking at sneakers? Or whispering before leaving on a Saturday night? Environment reveals intent.",
      "Keep safety lines clear of judgment: If you ever discover a term does relate to substances, focus entirely on health, safety, and non-judgmental support, never on punitive anger.",
    ],
  },
]

// ─────────────────────────────────────────────────────────────
// Tone Checklist Criteria & Scoring Engine
// ─────────────────────────────────────────────────────────────

export interface ToneChecklistCriterion {
  id: string
  title: string
  shortDescription: string
  diagnosticQuestion: string
  healthyIndicator: string
  concernIndicator: string
}

export const TONE_CHECKLIST_CRITERIA: ToneChecklistCriterion[] = [
  {
    id: 'standing',
    title: 'Equal Social Standing',
    shortDescription: 'Both participants tease mutually without dominant social status or physical leverage.',
    diagnosticQuestion: 'Does either person hold dominant social status, popularity leverage, or physical power over the other?',
    healthyIndicator: 'Teens exchange playful banter where both laugh and give as good as they get.',
    concernIndicator: 'One participant is consistently the target of laughter while having no social capital to push back.',
  },
  {
    id: 'bilateral',
    title: 'Bilateral Engagement',
    shortDescription: 'The conversation is a reciprocal exchange, not a one-sided target or group dogpile.',
    diagnosticQuestion: 'Is the teen actively participating in the joke thread or being relentlessly targeted?',
    healthyIndicator: 'Teen replies with memes, reacts with laughter emojis, and actively participates.',
    concernIndicator: 'Teen is silent, attempting to deflect, or only replying with "stop" while others continue.',
  },
  {
    id: 'boundaries',
    title: 'Boundary Respect',
    shortDescription: 'Humor stops immediately when someone signals discomfort, says "chill", or asks to stop.',
    diagnosticQuestion: 'When someone says "chill", "not cool", or asks to stop, do peers back off immediately?',
    healthyIndicator: 'Friends immediately pivot topics or apologize when someone signals discomfort.',
    concernIndicator: 'Peers double down, call them "soft" or "sensitive", or escalate the teasing.',
  },
  {
    id: 'space',
    title: 'Appropriate Space',
    shortDescription: 'Banter happens in private direct messages rather than public shaming or broadcast forums.',
    diagnosticQuestion: 'Is the teasing contained in a direct message or broadcast to an entire audience?',
    healthyIndicator: 'Contained within a trusted, small direct message or close-friends group chat.',
    concernIndicator: 'Broadcast on public TikToks, open Discord servers, or school-wide group chats for audience amusement.',
  },
  {
    id: 'baseline',
    title: 'Calm Baseline Demeanor',
    shortDescription: 'Teen is sleeping, eating, attending school, and engaging offline without sudden anxiety or withdrawal.',
    diagnosticQuestion: 'Does your teen show changes in offline mood, appetite, sleep, or school attendance?',
    healthyIndicator: 'Offline demeanor remains relaxed; teen attends school and joins family meals normally.',
    concernIndicator: 'Teen nervously hides screens, skips meals, loses sleep, shows irritability, or dreads school.',
  },
]

export type ToneSeverityTier = 'healthy' | 'watchful' | 'intervention'

export interface ToneEvaluationResult {
  score: number // 0 to 5
  total: number // 5
  tier: ToneSeverityTier
  badgeLabel: string
  verdict: string
  colorClass: string
  badgeClass: string
  progressClass: string
  icon: typeof CheckCircle2
  summary: string
  guidance: string
  actionSteps: string[]
}

export function evaluateToneScore(checkedIds: Set<string>): ToneEvaluationResult {
  const score = checkedIds.size
  const total = TONE_CHECKLIST_CRITERIA.length

  if (score === 5) {
    return {
      score,
      total,
      tier: 'healthy',
      badgeLabel: 'Healthy Peer Interaction',
      verdict: 'Harmless / Normal Banter',
      colorClass: 'severity-harmless',
      badgeClass: 'severity-harmless',
      progressClass: 'progress-healthy',
      icon: CheckCircle2,
      summary: 'All 5 health markers present. Banter is reciprocal, private, and emotionally safe.',
      guidance:
        "Modern teen communication frequently uses dark humor, hyperbolic insults ('you are cooked', 'mid', 'L rizz'), and absurdist meme language as a form of social intimacy and belonging. Because the dynamic is bilateral, respectful of limits, private, and does not destabilize offline behavior, no parental intervention is necessary.",
      actionSteps: [
        'Maintain baseline trust: Avoid policing harmless friend-group slang or joking.',
        'Validate without micromanaging: Let them know you are always available if dynamics change.',
        'Stay playful: Ask what a meme meant or laugh along if they share it with you.',
      ],
    }
  }

  if (score >= 3) {
    return {
      score,
      total,
      tier: 'watchful',
      badgeLabel: 'Nuanced / Watchful',
      verdict: 'Watchful / Stay Curious',
      colorClass: 'severity-watchful',
      badgeClass: 'severity-watchful',
      progressClass: 'progress-watchful',
      icon: AlertCircle,
      summary: `${score} of 5 health markers present. Ambiguous dynamics warrant gentle parental curiosity.`,
      guidance:
        'This exchange contains mixed signals. The humor may be pushing against personal boundaries, one participant may feel mildly coerced, or the venue (a semi-public group chat) might be creating social tension. While not an acute emergency, it warrants gentle observation and low-stakes parent curiosity.',
      actionSteps: [
        "Ask low-stakes open questions: 'How did that exchange feel to you afterwards?' or 'Do things usually stay light with that group?'",
        'Check the setting: If this took place in a larger group, ask if they would prefer keeping banter in smaller direct messages.',
        'Observe somatic cues: Notice whether screen time ends with laughter or with a tight jaw, rapid device slamming, or withdrawal.',
      ],
    }
  }

  return {
    score,
    total,
    tier: 'intervention',
    badgeLabel: 'Supportive Intervention Recommended',
    verdict: 'Intervention Recommended',
    colorClass: 'severity-intervention',
    badgeClass: 'severity-intervention',
    progressClass: 'progress-intervention',
    icon: AlertTriangle,
    summary: `Only ${score} of 5 health markers present. High risk of bullying, exclusion, or digital distress.`,
    guidance:
      'When teasing lacks reciprocity, ignores boundaries, happens in public or broadcast forums, or correlates with offline anxiety and withdrawal, it has crossed from banter into digital harassment, ostracism, or emotional distress. Your teen likely needs calm, non-judgmental support and structural protection.',
    actionSteps: [
      "Step in with calm validation: 'I noticed things seemed tense on that chat. You don't have to handle that alone, and I'm not mad at you.'",
      "Offer an offline safe harbor: Give them permission to step away from the chat ('Blame me—tell them dinner is ready or your phone is off').",
      'Document and protect: Take discreet screenshots if targeted harassment is occurring; block or mute toxic users; involve school counselors if peer exclusion escalates.',
    ],
  }
}

// ─────────────────────────────────────────────────────────────
// Subcomponent 1: Desktop Chrome Notice
// ─────────────────────────────────────────────────────────────

export interface PlaybookChromeNoticeProps {
  onInteract?: () => void
  onLeave?: () => void
}

export function PlaybookChromeNotice({ onInteract, onLeave }: PlaybookChromeNoticeProps) {
  return (
    <aside
      className="playbook-chrome-notice"
      role="region"
      aria-label="Desktop Chrome AI availability notice"
      onMouseEnter={onInteract}
      onMouseLeave={onLeave}
      onFocusCapture={onInteract}
      onBlurCapture={onLeave}
    >
      <div className="playbook-notice-badge-row">
        <span className="playbook-notice-badge">
          <Monitor size={13} aria-hidden="true" />
          <Sparkles size={12} aria-hidden="true" />
          Interactive AI Mode
        </span>
      </div>

      <h2 className="playbook-notice-title">
        Live interactive AI is available on desktop Chrome
      </h2>

      <p className="playbook-notice-desc">
        Parent Decoder includes an interactive conversational Co-pilot and Cringe Checker powered
        by Google&apos;s on-device Gemini Nano. When enabled, roleplays and message feedback run
        100% privately in your browser with zero data transmission. While using this browser, enjoy
        our Interactive Parenting Playbook with dynamic scenarios and tone checklists below.
      </p>

      <div className="playbook-notice-guide-wrap">
        <ChromeAISetupGuide defaultOpen={false} compact={true} />
      </div>
    </aside>
  )
}

// ─────────────────────────────────────────────────────────────
// Subcomponent 2: Playbook Rotating Queue Carousel
// ─────────────────────────────────────────────────────────────

export interface PlaybookCarouselProps {
  scenarios?: PlaybookScenario[]
  autoAdvanceIntervalMs?: number
  onUserInteract?: () => void
  externalPaused?: boolean
}

export function PlaybookCarousel({
  scenarios = PLAYBOOK_SCENARIOS,
  autoAdvanceIntervalMs = 7000,
  onUserInteract,
  externalPaused = false,
}: PlaybookCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [userPaused, setUserPaused] = useState<boolean | null>(null)
  const timerRef = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Safe store access with fallback for standalone tests
  let saveAIOutput: (output: any) => void = () => {}
  let isAIOutputSaved: (title: string, type: 'tone-analysis' | 'roleplay' | 'playbook') => boolean = () => false
  try {
    const app = useApp()
    saveAIOutput = app.saveAIOutput
    isAIOutputSaved = app.isAIOutputSaved
  } catch {
    // Graceful no-op when outside AppProvider
  }

  const currentScenario = scenarios[currentIndex] || scenarios[0]
  const isEffectivelyPaused = userPaused !== null ? userPaused : externalPaused
  const isPaused = isEffectivelyPaused || isHovered || isFocused

  // Auto-advance timer lifecycle
  useEffect(() => {
    if (isPaused || scenarios.length <= 1) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    timerRef.current = window.setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return
      setCurrentIndex((prev) => (prev + 1) % scenarios.length)
    }, autoAdvanceIntervalMs)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPaused, scenarios.length, autoAdvanceIntervalMs, currentIndex])

  const handleNext = useCallback(() => {
    onUserInteract?.()
    setUserPaused(null)
    setCurrentIndex((prev) => (prev + 1) % scenarios.length)
  }, [scenarios.length, onUserInteract])

  const handlePrevious = useCallback(() => {
    onUserInteract?.()
    setUserPaused(null)
    setCurrentIndex((prev) => (prev - 1 + scenarios.length) % scenarios.length)
  }, [scenarios.length, onUserInteract])

  const handleGoTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < scenarios.length) {
        onUserInteract?.()
        setUserPaused(null)
        setCurrentIndex(index)
      }
    },
    [scenarios.length, onUserInteract]
  )

  const handleTogglePlayPause = useCallback(() => {
    onUserInteract?.()
    setUserPaused((prev) => {
      const currentlyPaused = prev !== null ? prev : externalPaused
      return !currentlyPaused
    })
  }, [onUserInteract, externalPaused])

  // Keyboard navigation for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      handleNext()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      handlePrevious()
    } else if (e.key === 'Home') {
      e.preventDefault()
      handleGoTo(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      handleGoTo(scenarios.length - 1)
    }
  }

  const handleFocusCapture = () => {
    setIsFocused(true)
  }

  const handleBlurCapture = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsFocused(false)
    }
  }

  // Save Scenario to Saved Items
  const saveTitle = `Playbook: ${currentScenario.title}`
  const isSaved = isAIOutputSaved(saveTitle, 'playbook')

  const handleSave = () => {
    onUserInteract?.()
    saveAIOutput({
      type: 'playbook',
      title: saveTitle,
      content: `${currentScenario.description}\n\nApproach: ${currentScenario.parentApproach}\nDialogue: ${currentScenario.sampleDialogue}\nTakeaway: ${currentScenario.takeaway}`,
      summary: currentScenario.takeaway,
      metadata: {
        scenarioId: currentScenario.id,
        tag: currentScenario.tag,
      },
    })
  }

  return (
    <div
      ref={containerRef}
      className="playbook-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Parenting Playbook Scenarios"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={handleFocusCapture}
      onBlurCapture={handleBlurCapture}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Queue Header with progress counter and controls */}
      <div className="playbook-queue-header">
        <div className="queue-header-left">
          <span className="queue-tag">{currentScenario.tag}</span>
          <span className="queue-progress-count" aria-live="polite">
            {currentIndex + 1} of {scenarios.length}
          </span>
          {isPaused && (
            <span className="queue-pause-indicator" aria-label="Auto-advance paused">
              <Pause size={10} /> Paused
            </span>
          )}
        </div>

        <div className="queue-controls-wrap">
          <button
            type="button"
            className="queue-control-btn play-pause-btn"
            onClick={handleTogglePlayPause}
            aria-label={isEffectivelyPaused ? 'Resume auto-advance' : 'Pause auto-advance'}
            title={isEffectivelyPaused ? 'Resume rotation' : 'Pause rotation'}
          >
            {isEffectivelyPaused ? <Play size={14} /> : <Pause size={14} />}
          </button>
          <button
            type="button"
            className="queue-control-btn"
            onClick={handlePrevious}
            aria-label="Previous scenario"
            title="Previous scenario"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            className="queue-control-btn"
            onClick={handleNext}
            aria-label="Next scenario"
            title="Next scenario"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Active Scenario Card */}
      <article
        key={currentScenario.id}
        className="scenario-card"
        role="group"
        aria-roledescription="slide"
        aria-label={`${currentIndex + 1} of ${scenarios.length}: ${currentScenario.title}`}
      >
        <div className="scenario-card-header">
          <div className="scenario-title-area">
            <span className="scenario-badge-pill">{currentScenario.tag}</span>
            <h3 className="scenario-title">{currentScenario.title}</h3>
            <p className="scenario-desc">{currentScenario.description}</p>
          </div>

          <button
            type="button"
            className={`scenario-save-btn ${isSaved ? 'saved' : ''}`}
            onClick={handleSave}
            aria-label={isSaved ? 'Saved to Saved Items' : 'Save to Saved Items'}
          >
            {isSaved ? (
              <>
                <BookmarkCheck size={14} />
                <span>Saved in Saved Items</span>
              </>
            ) : (
              <>
                <Bookmark size={14} />
                <span>Save Playbook Note</span>
              </>
            )}
          </button>
        </div>

        {/* Side-by-side comparative matrix */}
        {currentScenario.comparison && (
          <div className="scenario-comparison-grid">
            <div className="comparison-column comparison-column-healthy">
              <div className="comparison-col-header">
                <CheckCircle2 size={16} />
                <h4>{currentScenario.comparison.benign.heading}</h4>
              </div>
              <ul className="comparison-col-text" style={{ paddingLeft: '1.25rem', margin: 0 }}>
                {currentScenario.comparison.benign.points.map((pt, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>{pt}</li>
                ))}
              </ul>
            </div>

            <div className="comparison-column comparison-column-risk">
              <div className="comparison-col-header">
                <AlertTriangle size={16} />
                <h4>{currentScenario.comparison.warning.heading}</h4>
              </div>
              <ul className="comparison-col-text" style={{ paddingLeft: '1.25rem', margin: 0 }}>
                {currentScenario.comparison.warning.points.map((pt, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>{pt}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Recommended Opener Box */}
        {currentScenario.recommendedOpener && (
          <div className="scenario-opener-box">
            <div className="opener-label">
              <Quote size={14} /> Recommended Opener
            </div>
            <p className="opener-quote">{currentScenario.recommendedOpener}</p>
          </div>
        )}

        {/* Dialogue Script Box */}
        {currentScenario.dialogueTurns && currentScenario.dialogueTurns.length > 0 && (
          <div className="scenario-dialogue-box">
            <div className="scenario-dialogue-label">
              <MessageSquare size={14} /> Sample Dialogue &amp; Coach Notes
            </div>
            <div className="dialogue-turns-stack" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentScenario.dialogueTurns.map((turn, idx) => (
                <div key={idx} className="dialogue-turn">
                  <span className="dialogue-turn-speaker">{turn.speaker}</span>
                  <p className="dialogue-turn-content">{turn.text}</p>
                  {turn.coachNote && (
                    <div className="dialogue-turn-note" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11.5px', color: 'var(--brick-muted)', marginTop: '4px' }}>
                      <Sparkles size={12} style={{ color: 'var(--coral)' }} />
                      <span>{turn.coachNote}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coaching Tips */}
        {currentScenario.coachingTips && currentScenario.coachingTips.length > 0 && (
          <div className="scenario-coaching-box" style={{ background: 'var(--bone-light)', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--bone-deep)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 650, color: 'var(--foreground)', marginBottom: '8px' }}>
              <Lightbulb size={15} style={{ color: 'var(--amber)' }} /> Key Coaching Tips
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '13px', color: 'var(--brick-dark)', lineHeight: 1.55 }}>
              {currentScenario.coachingTips.map((tip, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Takeaway Banner */}
        <div className="scenario-takeaway-box">
          <Sparkles size={16} />
          <p className="scenario-takeaway-text">
            <strong>Key Takeaway:</strong> {currentScenario.takeaway}
          </p>
        </div>
      </article>

      {/* Indicator Dots / Selector Tray */}
      <div className="playbook-indicators" role="tablist" aria-label="Scenario selector">
        {scenarios.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={currentIndex === idx}
            aria-label={`Go to scenario ${idx + 1}: ${s.title}`}
            className={`queue-indicator-dot ${currentIndex === idx ? 'active' : ''}`}
            onClick={() => handleGoTo(idx)}
          >
            <span className="queue-indicator-bar" />
          </button>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Subcomponent 3: Interactive Tone Checklist
// ─────────────────────────────────────────────────────────────

export interface ToneChecklistProps {
  onUserInteraction?: () => void
}

export function ToneChecklist({ onUserInteraction }: ToneChecklistProps) {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set())
  const evaluation = useMemo(() => evaluateToneScore(checkedIds), [checkedIds])

  // Safe store access
  let saveAIOutput: (output: any) => void = () => {}
  let isAIOutputSaved: (title: string, type: 'tone-analysis' | 'roleplay' | 'playbook') => boolean = () => false
  let notify: (message: string) => void = () => {}
  try {
    const store = useApp()
    saveAIOutput = store.saveAIOutput
    isAIOutputSaved = store.isAIOutputSaved
    notify = store.notify
  } catch {
    // Graceful fallback in isolated tests
  }

  const saveTitle = `Tone Checklist: ${evaluation.score}/5 - ${evaluation.badgeLabel}`
  const isSaved = isAIOutputSaved(saveTitle, 'playbook')

  const handleToggle = useCallback(
    (id: string) => {
      onUserInteraction?.()
      setCheckedIds((prev) => {
        const next = new Set(prev)
        if (next.has(id)) {
          next.delete(id)
        } else {
          next.add(id)
        }
        return next
      })
    },
    [onUserInteraction]
  )

  const handleReset = useCallback(() => {
    onUserInteraction?.()
    setCheckedIds(new Set())
    notify('Tone checklist reset')
  }, [notify, onUserInteraction])

  const handleSave = useCallback(() => {
    onUserInteraction?.()
    const criteriaReport = TONE_CHECKLIST_CRITERIA.map((criterion) => {
      const isChecked = checkedIds.has(criterion.id)
      return `- [${isChecked ? 'x' : ' '}] **${criterion.title}**: ${criterion.shortDescription} (${isChecked ? 'Present' : 'Missing / Red Flag'})`
    }).join('\n')

    const content = `## Tone Checklist Assessment: ${evaluation.verdict} (${evaluation.score}/5 Criteria Met)

**Evaluated Tier**: ${evaluation.badgeLabel}
**Clinical Summary**: ${evaluation.summary}

### Criteria Evaluated:
${criteriaReport}

### Clinical Guidance:
${evaluation.guidance}

### Recommended Parent Actions:
${evaluation.actionSteps.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}
`

    saveAIOutput({
      type: 'playbook',
      title: saveTitle,
      content,
      summary: `${evaluation.score}/5 criteria met: ${evaluation.badgeLabel}`,
      metadata: {
        score: String(evaluation.score),
        total: String(evaluation.total),
        tier: evaluation.tier,
        category: 'tone-checklist',
        badgeLabel: evaluation.badgeLabel,
        evaluatedAt: new Date().toISOString(),
      },
    })
  }, [checkedIds, evaluation, onUserInteraction, saveAIOutput, saveTitle])

  const EvalIcon = evaluation.icon
  const percentage = Math.round((evaluation.score / evaluation.total) * 100)

  return (
    <div
      className="tone-checklist-card"
      onMouseEnter={onUserInteraction}
      onFocusCapture={onUserInteraction}
    >
      {/* Header */}
      <div className="tone-checklist-header">
        <div className="tone-checklist-title-area">
          <span className="queue-tag">Interactive Self-Assessment</span>
          <h3 className="tone-checklist-title">Teasing vs Bullying Tone Checklist</h3>
          <p className="tone-checklist-subtitle">
            Evaluate digital banter, boundary respect, and emotional safety with our 5-point
            interactive criteria.
          </p>
        </div>

        {/* Dynamic Severity Badge */}
        <div
          className={`tone-severity-badge ${evaluation.badgeClass}`}
          role="status"
          aria-live="polite"
        >
          <EvalIcon size={15} />
          <span>{evaluation.badgeLabel}</span>
          <span style={{ opacity: 0.75, marginLeft: '2px' }}>({evaluation.score}/5)</span>
        </div>
      </div>

      {/* Visual Meter */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--brick-muted)', fontFamily: 'Geist Mono, monospace' }}>
          <span>Criteria Met: {evaluation.score} of {evaluation.total}</span>
          <span>{percentage}% Health Rating</span>
        </div>
        <div style={{ height: '8px', width: '100%', background: 'var(--bone-deep)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${percentage}%`,
              borderRadius: '9999px',
              transition: 'width 0.3s ease, background-color 0.3s ease',
              background:
                evaluation.tier === 'healthy'
                  ? 'var(--sage)'
                  : evaluation.tier === 'watchful'
                  ? 'var(--amber)'
                  : 'var(--coral)',
            }}
          />
        </div>
      </div>

      {/* 5 Checkbox Items */}
      <div className="tone-checklist-items" role="group" aria-label="Tone Checklist Criteria">
        {TONE_CHECKLIST_CRITERIA.map((criterion, index) => {
          const isChecked = checkedIds.has(criterion.id)
          const checkboxId = `tone-chk-${criterion.id}`

          return (
            <label
              key={criterion.id}
              htmlFor={checkboxId}
              className={`tone-checklist-item ${isChecked ? 'checked' : ''}`}
            >
              <div className="tone-checkbox-wrap">
                <input
                  type="checkbox"
                  id={checkboxId}
                  checked={isChecked}
                  onChange={() => handleToggle(criterion.id)}
                  className="tone-checkbox-input"
                  aria-describedby={`${checkboxId}-desc`}
                />
                <div className="tone-checkbox-custom" aria-hidden="true">
                  {isChecked && <Check size={14} strokeWidth={3} />}
                </div>
              </div>

              <div className="tone-checklist-label-wrap">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'Geist Mono, monospace', color: 'var(--brick-muted)', fontWeight: 600 }}>
                    #{index + 1}
                  </span>
                  <span className="tone-checklist-text">{criterion.title}</span>
                </div>
                <p id={`${checkboxId}-desc`} style={{ margin: '2px 0 0', fontSize: '12.5px', color: 'var(--brick-muted)', lineHeight: 1.45 }}>
                  {criterion.shortDescription}
                </p>
                <p style={{ margin: '3px 0 0', fontSize: '11.5px', color: 'var(--brick-dark)', fontStyle: 'italic' }}>
                  <strong>Diagnostic Check:</strong> {criterion.diagnosticQuestion}
                </p>
              </div>
            </label>
          )
        })}
      </div>

      {/* Dynamic Diagnostic Output Box */}
      <div
        style={{
          borderRadius: '12px',
          padding: '16px 20px',
          border: '1px solid var(--bone-deep)',
          background: 'var(--bone-light)',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start',
        }}
      >
        <EvalIcon size={20} style={{ flexShrink: 0, marginTop: '2px', color: evaluation.tier === 'healthy' ? 'var(--sage)' : evaluation.tier === 'watchful' ? 'var(--amber)' : 'var(--coral)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <h4 style={{ margin: 0, fontSize: '14.5px', fontWeight: 650, color: 'var(--foreground)' }}>
            {evaluation.verdict} ({evaluation.score}/5 Criteria Met)
          </h4>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--brick-dark)', lineHeight: 1.55 }}>
            {evaluation.guidance}
          </p>
          <div style={{ marginTop: '4px' }}>
            <strong style={{ fontSize: '12px', color: 'var(--foreground)' }}>Recommended Actions:</strong>
            <ul style={{ margin: '4px 0 0', paddingLeft: '1.25rem', fontSize: '12.5px', color: 'var(--brick-dark)', lineHeight: 1.5 }}>
              {evaluation.actionSteps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="tone-checklist-actions">
        <button
          type="button"
          onClick={handleReset}
          disabled={checkedIds.size === 0}
          className="queue-control-btn"
          style={{ minWidth: 'auto', padding: '8px 14px', gap: '6px' }}
        >
          <RotateCcw size={14} />
          <span>Reset Checklist</span>
        </button>

        <div className="tone-actions-group">
          <span className="tone-checklist-score-summary">
            Score: <strong>{evaluation.score}</strong> / {evaluation.total}
          </span>
          <button
            type="button"
            onClick={handleSave}
            className={`scenario-save-btn ${isSaved ? 'saved' : ''}`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck size={14} />
                <span>Saved in Saved Items</span>
              </>
            ) : (
              <>
                <Bookmark size={14} />
                <span>Save Checklist Result</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Main Component: ParentingPlaybook
// ─────────────────────────────────────────────────────────────

export function ParentingPlaybook() {
  const [isQueueInteracted, setIsQueueInteracted] = useState(false)
  const [isNoticeActive, setIsNoticeActive] = useState(false)

  const handleQueueInteract = useCallback(() => {
    setIsQueueInteracted(true)
  }, [])

  const handleNoticeInteract = useCallback(() => {
    setIsNoticeActive(true)
  }, [])

  const handleNoticeLeave = useCallback(() => {
    setIsNoticeActive(false)
  }, [])

  return (
    <div className="parenting-playbook">
      {/* 1. Desktop Chrome AI Availability Notice (R1.5 / R4) */}
      <PlaybookChromeNotice
        onInteract={handleNoticeInteract}
        onLeave={handleNoticeLeave}
      />

      {/* 2. Interactive Guidance Intro */}
      <div className="playbook-intro-header" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--coral-dark)', fontSize: '12px', fontWeight: 650, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'Geist Mono, monospace' }}>
          <Compass size={15} />
          <span>Interactive Guidance</span>
        </div>
        <h2 className="playbook-section-title">Parenting Communication Playbook</h2>
        <p className="playbook-section-desc">
          Explore realistic conversational scenarios, compare healthy banter with warning signs,
          and evaluate digital tone with our 5-point interactive checklist.
        </p>
      </div>

      {/* 3. Section: Dynamic Rotating Scenario Queue */}
      <section className="playbook-section" aria-labelledby="rotating-queue-heading">
        <div className="playbook-section-header">
          <div>
            <h3 id="rotating-queue-heading" className="playbook-section-title" style={{ fontSize: '20px' }}>
              Scenario Coaching Cards
            </h3>
            <p className="playbook-section-desc">
              Real-world conversations with phrase breakdowns, comparison tables, and suggested openers.
            </p>
          </div>
        </div>
        <PlaybookCarousel
          externalPaused={isQueueInteracted || isNoticeActive}
          onUserInteract={handleQueueInteract}
        />
      </section>

      {/* 4. Section: Interactive Tone Checklist */}
      <section className="playbook-section" aria-labelledby="tone-checklist-heading">
        <div className="playbook-section-header">
          <div>
            <h3 id="tone-checklist-heading" className="playbook-section-title" style={{ fontSize: '20px' }}>
              Tone Diagnostic Checklist
            </h3>
            <p className="playbook-section-desc">
              Check off positive social markers to diagnose digital banter and identify whether support is needed.
            </p>
          </div>
        </div>
        <ToneChecklist
          onUserInteraction={handleQueueInteract}
        />
      </section>
    </div>
  )
}

export default ParentingPlaybook
