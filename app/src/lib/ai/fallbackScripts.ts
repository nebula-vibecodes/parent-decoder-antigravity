import type { Term } from '../../data'
import { terms, findTerm } from '../../data'

export interface FallbackScriptTurn {
  speaker: 'Parent' | 'Teen'
  text: string
  coachNote?: string
}

export interface TermFallbackScript {
  termSlug: string
  termName: string
  situation: string
  dialogue: FallbackScriptTurn[]
  coachingTips: string[]
  recommendedOpener: string
}

/**
 * Strips matching outer smart or straight quotation marks while preserving
 * interior quotes, apostrophes, and punctuation.
 */
export function cleanOuterQuotes(str?: string): string {
  if (!str) return ''
  let text = str.trim()
  if (
    (text.startsWith('“') && text.endsWith('”')) ||
    (text.startsWith('"') && text.endsWith('"')) ||
    (text.startsWith("'") && text.endsWith("'"))
  ) {
    text = text.slice(1, -1).trim()
  }
  return text
}

/**
 * Normalizes plain meaning into a conversational clause.
 */
export function formatMeaningSnippet(meaning?: string): string {
  if (!meaning) return 'that'
  let text = cleanOuterQuotes(meaning).trim()
  text = text.replace(/[.:;]+$/, '').trim()
  if (/^[A-Z](\s|[a-z])/.test(text)) {
    text = text.charAt(0).toLowerCase() + text.slice(1)
  }
  return text
}

/**
 * Defensive concern normalizer supporting both standard schema and dispatch aliases.
 */
export function normalizeConcern(concern?: string): 'harmless' | 'discuss' | 'attention' {
  if (!concern) return 'harmless'
  const c = String(concern).toLowerCase().trim()
  if (c === 'attention' || c === 'action' || c === 'danger' || c === 'high') return 'attention'
  if (c === 'discuss' || c === 'watch' || c === 'talk' || c === 'medium') return 'discuss'
  return 'harmless'
}

/**
 * Generates a realistic, context-specific 2-sentence scenario based on category and concern.
 */
export function getSituation(
  term: Partial<Term>,
  cleanExample: string,
  concern: 'harmless' | 'discuss' | 'attention',
): string {
  const cat = term.category || 'General slang'
  let setting = ''
  switch (cat) {
    case 'Gaming & Streaming':
      setting = `Your teen is playing an online game with friends or watching a stream, and you hear them say or type: “${cleanExample}”.`
      break
    case 'Social Media Culture':
      setting = `Your teen shares a clip or mentions a trending video, casually using the phrase: “${cleanExample}”.`
      break
    case 'Emojis & Symbols':
      setting = `You notice this symbol or emoji in a text notification or group chat preview: “${cleanExample}”.`
      break
    case 'Abbreviations':
      setting = `You spot this abbreviation in a quick message or comment thread: “${cleanExample}”.`
      break
    case 'Relationships & Dating':
      setting = `Your teen is talking about school social dynamics, a crush, or a friend group situation: “${cleanExample}”.`
      break
    case 'Substances & Party Culture':
      setting = `You come across this expression in an overheard conversation or weekend message: “${cleanExample}”.`
      break
    case 'Mental Well-being':
      setting = `Your teen drops this phrase while discussing their stress, school load, or how their week is going: “${cleanExample}”.`
      break
    case 'Sensitive Safety Topics':
      setting = `You see this term referenced in an online space or message exchange: “${cleanExample}”.`
      break
    default:
      setting = `Your teen uses this slang term during a casual conversation after school: “${cleanExample}”.`
      break
  }

  let goal = ''
  if (concern === 'harmless') {
    goal =
      'You want to understand their world and connect naturally without making things awkward or sounding like an interrogator.'
  } else if (concern === 'discuss') {
    goal =
      'You want to explore the context and check in on their feelings without putting them on the defensive.'
  } else {
    goal =
      'You want to open a calm, supportive, non-judgmental check-in to ensure their safety and well-being.'
  }

  return `${setting} ${goal}`
}

/**
 * Curated Marquee Scripts for key slang terms (5 turns each, coach notes, 3 tips)
 */
export const curatedScripts: Record<string, TermFallbackScript> = {
  'no-cap': {
    termSlug: 'no-cap',
    termName: 'no cap',
    situation:
      "Your 14-year-old comes home energized from basketball practice, exclaiming that their teammate sank a half-court shot with their eyes closed, 'no cap'. You want to share their excitement while understanding how they express honesty.",
    recommendedOpener: "“When you say ‘no cap’ here, do you mean it really surprised you?”",
    dialogue: [
      {
        speaker: 'Parent',
        text: "Wait, a half-court shot with eyes closed? When you say 'no cap,' are you saying he literally did that, or was it just an insane play?",
        coachNote:
          'Validates the excitement first while playfully clarifying exaggeration versus literal truth.',
      },
      {
        speaker: 'Teen',
        text: "No, literally, no cap! Like, Jordan stood there, spun around, yelled 'watch this,' and drained it. Whole gym went crazy.",
        coachNote:
          "Teen responds with energetic detail because the parent didn't dismiss the story as impossible.",
      },
      {
        speaker: 'Parent',
        text: "That’s wild! I love seeing you that hyped. Does your group usually say 'cap' when someone is just making stuff up to look cool?",
        coachNote:
          'Connects to their peer dynamics by asking how they negotiate truth and bragging with friends.',
      },
      {
        speaker: 'Teen',
        text: "Oh yeah, if someone says they bench 200 or talked to a varsity coach, everyone just drops the 🧢 emoji in the chat. You gotta be real with people.",
        coachNote: 'Teen shares peer social norms and values around authenticity.',
      },
      {
        speaker: 'Parent',
        text: "Makes complete sense. Authenticity matters a lot. It sounds like a legendary moment in the gym today—thanks for telling me about it!",
        coachNote:
          "Closes with connection, affirming the teen's value of honesty without attempting to adopt the slang.",
      },
    ],
    coachingTips: [
      "Match their emotional energy: When a teen uses positive slang like 'no cap' to share an exciting story, lean into their enthusiasm rather than fact-checking every literal detail.",
      "Curiosity over skepticism: Asking 'are they being real or joking?' shows respect for their social discernment rather than treating slang as deceptive language.",
      "Resist adopting the slang: Acknowledge the meaning without forcing 'no cap' into your own vocabulary, which often triggers cringe and shuts down conversation.",
    ],
  },

  'cooked': {
    termSlug: 'cooked',
    termName: 'cooked',
    situation:
      "Your 13-year-old is staring at their laptop after studying for chemistry, slumping into the sofa and groaning, 'I am literally so cooked for tomorrow's midterm.'",
    recommendedOpener:
      "“Hey, I heard that sigh—when you say you're 'cooked,' does that mean you're running on empty, or is the material feeling impossible?”",
    dialogue: [
      {
        speaker: 'Parent',
        text: "Hey, I heard that heavy sigh from across the room. When you say you're 'cooked,' does that mean your brain is exhausted, or does the chemistry material feel impossible?",
        coachNote:
          'Separates physical/cognitive fatigue from academic despair, giving the teen multiple handles to express distress.',
      },
      {
        speaker: 'Teen',
        text: "Both. Honestly, everyone in the group chat is saying they're cooked. Mr. Vance gave us fifty equations and I don't get the stoichiometry at all.",
        coachNote: 'Teen reveals school-wide anxiety amplified by peer group chats.',
      },
      {
        speaker: 'Parent',
        text: 'That sounds genuinely overwhelming, especially when the whole class chat is spiraling together. Let’s take a breath—you’ve been at that desk for two hours.',
        coachNote:
          'Validates the collective overwhelm while interrupting the panic feedback loop.',
      },
      {
        speaker: 'Teen',
        text: "Yeah, my eyes hurt and the Discord notifications are just making it worse. I feel like if I fail this, my whole GPA is ruined.",
        coachNote:
          'Teen identifies the digital stress multiplier (Discord notifications) and catastrophic thinking.',
      },
      {
        speaker: 'Parent',
        text: "One exam doesn't define your future. Step away from the screen for twenty minutes, grab a snack, and let's pick just the top three review problems together. Deal?",
        coachNote:
          'Establishes a healthy boundary with digital panic, de-escalates catastrophic thoughts, and offers scaffolded support.',
      },
    ],
    coachingTips: [
      "Decode the emotional temperature: 'Cooked' usually signals acute overwhelm or burnout; treat it as an invitation to offer relief and perspective rather than lecturing on study habits.",
      'Notice digital echo chambers: Teen panic is frequently magnified by group chats where everyone repeats catastrophic slang; help them unplug from the collective anxiety.',
      'De-escalate catastrophic thinking: Help them separate a single challenging test or mistake from their overall worth and capability.',
    ],
  },

  'plug': {
    termSlug: 'plug',
    termName: 'plug',
    situation:
      "You glance at your 16-year-old’s phone while they are showing you a video, and a notification banner pops up saying: 'Did you hit up the plug yet?' You want to check in calmly to ensure safety without jumping to worst-case assumptions.",
    recommendedOpener:
      "“Hey, I saw that notification about finding a ‘plug’—in this conversation, are you guys talking about sneakers, concert tickets, or something else?”",
    dialogue: [
      {
        speaker: 'Parent',
        text: "Hey, before we move on to that video—I couldn't help but notice that banner asking if you 'hit up the plug yet.' I know that word can mean a lot of things. What's the hookup for here?",
        coachNote:
          'Addresses the observation directly and transparently without sneaking or accusing, giving room for harmless context.',
      },
      {
        speaker: 'Teen',
        text: "Whoa, why are you reading my notifications? It’s not what you think, stop being paranoid.",
        coachNote: 'Teen exhibits defensive boundary pushback due to privacy sensitivity.',
      },
      {
        speaker: 'Parent',
        text: "I hear you, and I wasn't trying to snoop—it popped right on the screen. My only job is keeping you safe. 'Plug' can mean sneakers, event tickets, or it can mean substances. I trust you, so I'm asking you directly.",
        coachNote:
          'Maintains a calm, steady posture; acknowledges privacy while standing firm on safety and naming realities without aggression.',
      },
      {
        speaker: 'Teen',
        text: "It’s literally about the Travis Scott hoodie drop. Marco has an older brother working at the mall who can hold two sizes before they sell out. That’s all.",
        coachNote:
          'Teen clarifies the retail context when they realize the parent is calm and informed rather than punishing.',
      },
      {
        speaker: 'Parent',
        text: "Got it. That’s a relief, and an awesome sneaker connect. I appreciate you telling me straight up. You know if you or your friends ever run into situations involving substances or unsafe stuff, you can come to me with no judgment.",
        coachNote:
          'Affirms their honesty, establishes trust, and reiterates the open-door policy for real substance safety.',
      },
    ],
    coachingTips: [
      "Transparent and direct over covert snooping: If you see a concerning word like 'plug', bring it up calmly in the moment instead of secretly investigating their phone.",
      "Acknowledge the 90% benign reality: In youth slang, 'the plug' most commonly refers to sneakers, discount codes, concert tickets, or homework answers; approaching with that knowledge lowers defensiveness.",
      'Stand firm on safety while eliminating moral panic: Frame safety inquiries around parental care and protection, never around criminalizing slang or violating mutual dignity.',
    ],
  },

  'skibidi': {
    termSlug: 'skibidi',
    termName: 'skibidi',
    situation:
      "At the dinner table, your 11-year-old looks at the steamed broccoli and declares, 'This side dish is negative skibidi rizz.' Their older sibling laughs, and you want to engage the humor without letting dinner turn into chaos.",
    recommendedOpener:
      "“I know that one changes every five minutes—what does ‘skibidi’ mean when it comes to vegetables?”",
    dialogue: [
      {
        speaker: 'Parent',
        text: "Wait, 'negative skibidi rizz' for steamed broccoli? Walk me through that math—is 'skibidi' good, bad, or just pure chaotic energy here?",
        coachNote:
          'Leans into playfulness, signaling curiosity rather than irritation at internet brainrot humor.',
      },
      {
        speaker: 'Teen',
        text: "Haha, it means it's totally cursed, Dad! Like, Skibidi Toilet is this weird YouTube meme, but now people just say it when something is totally unhinged or mid.",
        coachNote:
          'Teen happily explains the absurdity of internet meme culture to a receptive parent.',
      },
      {
        speaker: 'Parent',
        text: 'So broccoli has lost all its internet points. Fair critique on the seasoning! Does anyone in your class actually know what the song says, or is repeating it just the fun part?',
        coachNote:
          'Accepts the joke, acknowledges the culinary feedback gently, and explores the communal nature of meme humor.',
      },
      {
        speaker: 'Teen',
        text: "Nobody cares what it means! It’s just funny because teachers get so triggered when someone mumbles it during quiet study.",
        coachNote:
          'Teen reveals the primary adolescent function of the meme: testing adult boundaries and shared subversion.',
      },
      {
        speaker: 'Parent',
        text: 'Ah, the classic teacher-triggering word. Well, here at the table, broccoli still has vitamins, so eat three florets and then we can debate the lore of Skibidi Toilet.',
        coachNote:
          'Holds a mild, healthy dinner boundary with good humor, maintaining connection without lecturing.',
      },
    ],
    coachingTips: [
      "Don't fight absurdism with solemnity: Surreal meme slang ('brainrot') is designed to baffle adults; reacting with amusement neutralizes its power to provoke.",
      'Understand the social function of inside jokes: Repeating absurd phrases creates peer bonding and establishes mild generational independence.',
      'Hold mealtime and situational boundaries playfully: You can ask kids to pause meme talk during serious moments without pathologizing their humor.',
    ],
  },

  'rizz': {
    termSlug: 'rizz',
    termName: 'rizz',
    situation:
      "Your 15-year-old is getting ready for a school dance, looking in the mirror and nervously muttering that they have 'unspoken rizz' before immediately doubting themselves.",
    recommendedOpener:
      "“Does ‘rizz’ mean being confident, or are your friends just hyping each other up?”",
    dialogue: [
      {
        speaker: 'Parent',
        text: "You look sharp! I heard you mention 'rizz'—does that mean you’re feeling confident about talking to people tonight, or is there some pressure to perform?",
        coachNote:
          'Validates their appearance and gently probes the vulnerability beneath the swagger.',
      },
      {
        speaker: 'Teen',
        text: "I don't know... everyone talks like you either have 'W rizz' or you're completely cooked. It's like you have to be smooth 24/7 or people clip you and make fun of it.",
        coachNote:
          'Teen reveals the intense social anxiety and fear of embarrassment in the TikTok era.',
      },
      {
        speaker: 'Parent',
        text: 'That sounds exhausting. Real connection usually comes from just listening and being sincere, not having rehearsed pickup lines or performing for an audience.',
        coachNote:
          'Reframes dating and social connection away from algorithmic performance toward genuine human presence.',
      },
      {
        speaker: 'Teen',
        text: 'Yeah. The guys act like you have to do some TikTok trick. But Maya and I already laugh about our art class project anyway.',
        coachNote:
          'Teen grounds themselves in an actual real-world relationship rather than social media scripts.',
      },
      {
        speaker: 'Parent',
        text: "There you go. That natural laughter is worth ten times more than any internet 'rizz.' Just go be yourself, have fun with Maya, and don't worry about performing.",
        coachNote: 'Reinforces self-worth and genuine relational safety.',
      },
    ],
    coachingTips: [
      "Unpack the performance pressure: 'Rizz' (from charisma) can feel like a high-stakes test of social worth; help teens see that authentic kindness beats performed charm.",
      'Normalize awkwardness: Reassure teens that healthy dating and friendships involve awkward moments, and that social media highlights are artificial.',
      'Celebrate genuine qualities: Point out specific character strengths—like their humor, loyalty, or empathy—as real charisma.',
    ],
  },

  'mid': {
    termSlug: 'mid',
    termName: 'mid',
    situation:
      "Your teen comes back from a friend's birthday party or band concert and shrugs, dismissing the host's effort as 'completely mid.' You want to encourage empathy and gratitude without invalidating their honest opinion.",
    recommendedOpener: "“What didn’t live up to the hype for you?”",
    dialogue: [
      {
        speaker: 'Parent',
        text: "Hey, welcome back! You described the party as 'mid'—what didn’t live up to the hype for you?",
        coachNote:
          'Uses open curiosity to explore their reaction without immediately scolding them for being ungrateful.',
      },
      {
        speaker: 'Teen',
        text: 'I mean, the music playlist was basic, the pizza took an hour, and everyone was just on their phones. It was just average.',
        coachNote: 'Teen articulates specific observations about the social vibe.',
      },
      {
        speaker: 'Parent',
        text: 'I get that—when you anticipate a huge party, an awkward vibe can feel underwhelming. Did Julian seem stressed about how it was going?',
        coachNote:
          "Validates their disappointment while gently directing attention toward the friend's perspective.",
      },
      {
        speaker: 'Teen',
        text: 'Actually, yeah. His parents were arguing in the kitchen and he kept apologizing for the food. I felt kind of bad for him.',
        coachNote:
          'Teen shifts from dismissive slang to genuine empathy when prompted by perspective-taking.',
      },
      {
        speaker: 'Parent',
        text: "That must have been tough for him to host. Maybe shoot him a text tomorrow saying thanks for having you over? It takes a lot to host, even when it's not perfect.",
        coachNote:
          'Guides the teen toward compassionate action and mature friendship manners without punishing their initial slang.',
      },
    ],
    coachingTips: [
      "Distinguish critique of products from critique of people: 'Mid' is fine for movies or video games, but can be hurtful when applied to friends, home-cooked food, or someone's effort.",
      "Invite empathy gently: Rather than saying 'don't be mean,' ask questions about how the other person might have felt in that situation.",
      'Honor honest feelings: Allow teens to express boredom or disappointment in private with you so they don\'t have to pretend everything is amazing.',
    ],
  },

  'crash-out': {
    termSlug: 'crash-out',
    termName: 'crash out',
    situation:
      "Your 16-year-old slams their school bag onto the floor, kicks off their shoes with force, and mutters, 'If Coach cuts my minutes again on Friday, I am literally going to crash out on him.'",
    recommendedOpener:
      "“When you say ‘crash out,’ do you mean you’re totally exhausted, or is the frustration boiling over?”",
    dialogue: [
      {
        speaker: 'Parent',
        text: "Hey, I see how hard you slammed that bag down. When you say 'crash out,' do you mean you're physically exhausted, or is your anger at a boiling point right now?",
        coachNote:
          'Acknowledges the somatic display of anger calmly and clarifies whether this is physical depletion or emotional escalation.',
      },
      {
        speaker: 'Teen',
        text: "I am sick of him benching me for no reason! I bust my butt in practice and he plays the seniors who don't even try. I want to scream in his face.",
        coachNote:
          'Teen vents intense feelings of unfairness and impulses toward verbal retaliation.',
      },
      {
        speaker: 'Parent',
        text: "You have worked tirelessly all season, so feeling passed over is infuriating. I completely understand why you're angry. But an explosive confrontation with Coach will only get you suspended.",
        coachNote:
          'Separates the validity of the emotion (justified anger) from the danger of destructive behavior (consequences of explosive reaction).',
      },
      {
        speaker: 'Teen',
        text: "I know, but everyone online laughs at 'crash outs' until it happens in real life. I just don't know how to get him to see me.",
        coachNote:
          'Teen recognizes the disconnect between internet memes glorifying reckless anger and real-world consequences.',
      },
      {
        speaker: 'Parent',
        text: "Let’s get some dinner into you first so your nervous system can settle. Then tomorrow, let's write down three specific, respectful questions you can ask Coach in private about what skills he wants to see.",
        coachNote:
          'Regulates physical needs first, models constructive conflict resolution, and prevents impulsive self-sabotage.',
      },
    ],
    coachingTips: [
      "Clarify the dual meaning immediately: 'Crash out' can mean sleeping from exhaustion OR a reckless emotional meltdown; assess safety and emotional regulation first.",
      'Validate the feeling, regulate the action: Always validate that feelings of unfairness or rage are real, while establishing firm safety guardrails against destructive retaliation.',
      "Address internet glorification of rage: Discuss how social media algorithms reward viral outbursts ('crashing out'), while real adult life penalizes them heavily.",
    ],
  },

  'bet': {
    termSlug: 'bet',
    termName: 'bet',
    situation:
      "You remind your 15-year-old that they need to finish their laundry and be back from the skate park by 6:00 PM for family dinner. They reply with a clipped, single-word 'Bet' without looking up from their shoes.",
    recommendedOpener:
      "“Does ‘bet’ mean we’re on the same page for 6:00 PM, or does that feel tight for you?”",
    dialogue: [
      {
        speaker: 'Parent',
        text: "Hey, I heard the 'Bet'—just to make sure we're on the exact same page, does that mean you're locked in for 6:00 PM, or does that timeline feel too tight for skating?",
        coachNote:
          'Checks clarity and intent without interpreting a short word as disrespect or hostility.',
      },
      {
        speaker: 'Teen',
        text: 'Yeah, I said bet. It means agreed. Why do you always repeat everything I say like I didn\'t hear you?',
        coachNote: 'Teen expresses irritation at feeling micromanaged or distrusted.',
      },
      {
        speaker: 'Parent',
        text: "I'm not trying to micromanage you. 'Bet' can mean enthusiastic agreement, or it can be a quick brush-off when someone is annoyed. I just wanted to verify so dinner isn't waiting.",
        coachNote:
          "Explains parental motivation transparently without getting defensive about the teen's irritation.",
      },
      {
        speaker: 'Teen',
        text: "I'm not annoyed at dinner, I just want to catch the sunlight before it gets dark. I'll set an alarm on my phone for 5:45 so I leave on time.",
        coachNote:
          'Teen takes proactive responsibility once they realize the parent is seeking collaboration, not control.',
      },
      {
        speaker: 'Parent',
        text: '5:45 alarm sounds like a great plan. Have a blast at the park, skate safe, and see you at 6:00!',
        coachNote:
          'Affirms their autonomous solution, expresses warmth, and lets them go smoothly.',
      },
    ],
    coachingTips: [
      "Don't mistake brevity for defiance: Teen slang is often highly compressed; 'bet' is usually efficient agreement rather than passive aggression.",
      'Verify the agreement calmly: When timing or chores matter, ask a friendly clarifying question to ensure both parties share the same expectations.',
      'Encourage proactive responsibility: Support the teen in using their own tools (alarms, calendar reminders) rather than acting as their external nag.',
    ],
  },

  'delulu': {
    termSlug: 'delulu',
    termName: 'delulu',
    situation:
      "Your 14-year-old is looking over tryout lists or thinking about texting someone they like, sighing and saying, 'Maybe thinking I could make varsity is just completely delulu.'",
    recommendedOpener:
      "“Is calling yourself ‘delulu’ just a defense mechanism, or are you feeling genuinely discouraged?”",
    dialogue: [
      {
        speaker: 'Parent',
        text: "I heard you say you might be 'delulu' about varsity. Is that just a way to protect your feelings if it doesn't happen, or are you feeling really discouraged?",
        coachNote:
          'Pinpoints the psychological protective mechanism behind the self-deprecating humor.',
      },
      {
        speaker: 'Teen',
        text: "Well, everyone on TikTok says 'delulu is the solulu,' but let's be real—the sophomores are way faster than me. If I don't make it, everyone will laugh that I even tried.",
        coachNote:
          'Teen admits the core fear: social vulnerability and fear of public failure.',
      },
      {
        speaker: 'Parent',
        text: 'Putting yourself out there and trying out for something competitive takes real courage. That’s ambition, not delusion.',
        coachNote:
          "Reframes their aspiration from foolishness ('delusional') to courage and healthy ambition.",
      },
      {
        speaker: 'Teen',
        text: "I guess. I just don't want to look like an idiot who thought they were better than they actually are.",
        coachNote: 'Teen clarifies the vulnerability around modesty and peer perception.',
      },
      {
        speaker: 'Parent',
        text: "Trying and falling short never makes you look foolish to people who actually matter. You've trained hard. Go give it your all at tryouts, and no matter what the roster says, I'm proud of you for going for it.",
        coachNote:
          'Separates parental pride from outcome, giving the teen emotional security to take healthy risks.',
      },
    ],
    coachingTips: [
      "Spot self-shielding humor: Terms like 'delulu' are frequently used as protective shields so teens can express big dreams without the pain of looking foolish if they fail.",
      'Reframe ambition positively: Validate their courage to try out, audition, or take social risks instead of laughing off the ambition.',
      'Differentiate playful hope from detachment: Playful self-delusion (\'manifesting\') is healthy fun; self-defeating cynicism is when gentle parental encouragement is needed.',
    ],
  },

  'fanum-tax': {
    termSlug: 'fanum-tax',
    termName: 'fanum tax',
    situation:
      "You order a basket of fries at a diner, and your 12-year-old reaches over without asking, grabs three large fries, and grins saying, 'Collecting the Fanum tax!' You want to keep the mood light while teaching basic consent and consideration around food.",
    recommendedOpener:
      "“Is that your group’s joke for sharing snacks—and does everyone get a choice?”",
    dialogue: [
      {
        speaker: 'Parent',
        text: "Hey, hands off the fry stash! Did you just hit me with a 'Fanum tax' before I even got a single bite?",
        coachNote:
          'Calls out the action with playful banter rather than immediate scolding, recognizing the internet reference.',
      },
      {
        speaker: 'Teen',
        text: 'Haha, yes! AMP rules! If you have hot food in your vicinity, the tax must be paid. Fanum literally does it to Kai Cenat on stream all the time.',
        coachNote:
          'Teen excitedly cites the Twitch/YouTube creator origins of the meme.',
      },
      {
        speaker: 'Parent',
        text: 'I respect the streamer lore, but in this jurisdiction, the fry owner gets a veto! Do people do that at school lunch too?',
        coachNote:
          'Matches the humor while exploring whether this behavior crosses boundaries with peers at school.',
      },
      {
        speaker: 'Teen',
        text: "Yeah, sometimes at lunch guys grab chips. Most people laugh, but last week Alex got really upset when someone took his cookie because he hadn't eaten breakfast.",
        coachNote:
          'Teen reflects on a real school scenario where the meme crossed into genuine boundary violation.',
      },
      {
        speaker: 'Parent',
        text: 'That’s a great example. Memes are fun when both people are in on the joke, but not when someone is actually hungry or feeling disrespected. Always ask first—and now, you may officially have one more fry.',
        coachNote:
          'Teaches consent and empathy seamlessly through a meme, then rewards the reflection with generosity.',
      },
    ],
    coachingTips: [
      'Use meme humor to teach empathy: Internet trends often involve playful boundary-testing; use them as low-stakes moments to discuss consent and respecting others.',
      'Separate harmless fun from bullying: What is funny between close friends can feel like bullying or food insecurity to a peer who didn\'t consent.',
      'Maintain boundaries with warmth: You don\'t have to tolerate rudeness to understand a joke; set the boundary with a smile and explain the human reason behind it.',
    ],
  },
}

// Support 'cook' slug alias
curatedScripts['cook'] = {
  ...curatedScripts['cooked'],
  termSlug: 'cook',
  termName: 'cook / cooked',
}

/**
 * Deterministically generates a 5-turn dialogue and 3 coaching tips for ANY term.
 */
export function generateDynamicFallbackScript(term: Partial<Term>): TermFallbackScript {
  const safeTerm = term || {}
  const concern = normalizeConcern(safeTerm.concern)
  const termName = safeTerm.term || 'this slang term'
  const termSlug = safeTerm.slug || 'unknown-term'
  const cleanExample = cleanOuterQuotes(safeTerm.example) || termName
  const cleanOpener =
    cleanOuterQuotes(safeTerm.opener) || `What does “${termName}” mean in that context?`
  const meaningSnippet = formatMeaningSnippet(safeTerm.plainMeaning)
  const rawFirstClue = safeTerm.contextClues
    ? cleanOuterQuotes(safeTerm.contextClues.split('.')[0])
    : ''
  const cleanFirstClue = rawFirstClue
    ? rawFirstClue.charAt(0).toLowerCase() + rawFirstClue.slice(1)
    : 'context and tone matter most'
  const categoryContext = safeTerm.category
    ? safeTerm.category.toLowerCase()
    : 'things like this'

  const situation = getSituation(safeTerm, cleanExample, concern)

  const dialogue: FallbackScriptTurn[] = [
    {
      speaker: 'Parent',
      text: cleanOpener,
      coachNote:
        concern === 'harmless'
          ? 'Opening with neutral curiosity about the slang without judging or trying too hard to sound cool.'
          : concern === 'discuss'
            ? 'Asking with open curiosity rather than suspicion, preventing your teen from feeling defensive or interrogated.'
            : 'A calm, neutral tone signals emotional safety and reassures your teen they aren’t in trouble.',
    },
    {
      speaker: 'Teen',
      text:
        concern === 'harmless'
          ? `Haha, where'd you hear that? Yeah, it basically means '${meaningSnippet}'. Just don't try saying it in front of my friends, okay?`
          : concern === 'discuss'
            ? `Oh, that? It usually means '${meaningSnippet}'. Don't make it weird, we were just talking with friends.`
            : `Why are you asking about that? It's not a big deal, people mostly say it when they're talking about ${meaningSnippet}.`,
      coachNote:
        concern === 'harmless'
          ? "Teens often tease parents who ask about slang, but their willingness to explain shows they don't feel threatened."
          : concern === 'discuss'
            ? 'Your teen tests the waters to see if you\'re going to overreact or lecture them.'
            : 'Initial hesitation is normal for sensitive topics; staying calm keeps the door open.',
    },
    {
      speaker: 'Parent',
      text:
        concern === 'harmless'
          ? "Fair enough! I'm definitely not trying to steal your slang or police your words. I just like understanding your world and the context behind it."
          : concern === 'discuss'
            ? "I get that, and I'm not here to police your vocabulary. I just know words can land differently depending on the vibe—how did it feel when that was said?"
            : `I hear you, and I promise you aren't in any trouble at all. I just care about how you're doing, especially when it comes to ${categoryContext}.`,
      coachNote:
        concern === 'harmless'
          ? "De-escalates defensiveness by establishing that you respect their peer language and aren't trying to co-opt it."
          : concern === 'discuss'
            ? 'Reframes the conversation around feelings and peer dynamics rather than policing slang terms.'
            : 'Reassuring unconditional safety interrupts fear and helps teens open up about genuine distress.',
    },
    {
      speaker: 'Teen',
      text:
        concern === 'harmless'
          ? `Yeah, like in our group someone might say: “${cleanExample}”. In our circle, ${cleanFirstClue}.`
          : concern === 'discuss'
            ? `Yeah, like in our chat someone might say: “${cleanExample}”. It really depends on the vibe—${cleanFirstClue}.`
            : `Yeah, like in our group someone might drop: “${cleanExample}”. Things have just been kind of overwhelming lately, honestly.`,
      coachNote:
        concern === 'harmless'
          ? "Teen shares authentic peer context and examples once they know you're genuinely listening."
          : concern === 'discuss'
            ? 'Teen opens up about how their social circle actually uses the phrase.'
            : 'Once fear of punishment is removed, teens often share the real emotional stress behind high-stakes terms.',
    },
    {
      speaker: 'Parent',
      text:
        concern === 'harmless'
          ? "Got it! That context helps a lot. Thanks for walking me through it—and I promise your street cred is safe with me!"
          : concern === 'discuss'
            ? 'That makes a lot of sense. Thanks for explaining it. My door is always open if things ever feel weird or cross a line with friends.'
            : "Thank you for being honest with me. Whatever you're going through, you never have to carry it alone. We'll figure it out together—no judgment.",
      coachNote:
        concern === 'harmless'
          ? 'Closes on a warm, humorous note, making it easy for your teen to talk with you again next time.'
          : concern === 'discuss'
            ? 'Establishes a healthy boundary and leaves an open invitation for future check-ins without hovering.'
            : 'Affirms unconditional love, connection, and collaborative support before jumping into problem-solving.',
    },
  ]

  const cleanContext =
    cleanOuterQuotes(safeTerm.contextClues) || 'Context and tone determine the true meaning.'

  const coachingTips: string[] = [
    concern === 'harmless'
      ? `Lead with curiosity over imitation: Asking what “${termName}” means in their circle signals interest without trying to adopt slang, which teens usually find 'cringe'.`
      : concern === 'discuss'
        ? `Focus on tone and relationship over vocabulary: With terms like “${termName}”, the literal definition matters less than how it was delivered—watch whether everyone was laughing or if someone felt targeted.`
        : `Stay grounded and prioritize safety: When discussing sensitive terms like “${termName}”, an unhurried, non-judgmental tone keeps your teen from retreating into secrecy.`,
    `Read the room: ${cleanContext}`,
    concern === 'harmless'
      ? 'Keep everyday chats low-stakes: Light slang is a bridge for connection. Validating their world builds credit for when heavier topics arise.'
      : concern === 'discuss'
        ? 'Check for emotional impact: Ask open questions like “Did that feel like playful banter or did it sting?” to help them evaluate social boundaries.'
        : 'Anchor in support and clear safety boundaries: Reiterate that your primary concern is their health and safety, not punishment. If you suspect real danger or distress, stay close and seek professional guidance if needed.',
  ]

  return {
    termSlug,
    termName,
    situation,
    dialogue,
    coachingTips,
    recommendedOpener: cleanOpener,
  }
}

/**
 * Primary API: Guarantees 100% coverage across all 413 terms.
 */
export function getFallbackScriptForTerm(term: Term): TermFallbackScript {
  if (!term) return generateDynamicFallbackScript({})
  const norm = (term.slug || '').toLowerCase().trim()
  if (curatedScripts[norm]) return curatedScripts[norm]
  if (norm === 'cook' && curatedScripts['cooked']) return curatedScripts['cooked']
  if (norm === 'cooked' && curatedScripts['cook']) return curatedScripts['cook']
  return generateDynamicFallbackScript(term)
}

/** Alias to ensure compatibility with architecture references */
export const getConversationScript = getFallbackScriptForTerm

/** Convenience resolver by slug */
export function getFallbackScriptBySlug(slug: string): TermFallbackScript | undefined {
  if (!slug) return undefined
  const norm = slug.toLowerCase().trim()
  if (curatedScripts[norm]) return curatedScripts[norm]
  if (norm === 'cook' && curatedScripts['cooked']) return curatedScripts['cooked']
  if (norm === 'cooked' && curatedScripts['cook']) return curatedScripts['cook']
  const foundTerm =
    findTerm(norm) ||
    terms.find((t) => t.aliases && t.aliases.map((a) => a.toLowerCase()).includes(norm))
  if (foundTerm) return getFallbackScriptForTerm(foundTerm)
  return undefined
}
