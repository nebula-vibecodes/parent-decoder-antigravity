import { expansionTerms } from './termsExpansion'

export type Concern = 'harmless' | 'discuss' | 'attention'
export type Category =
  | 'General slang'
  | 'Abbreviations'
  | 'Emojis & Symbols'
  | 'Gaming & Streaming'
  | 'Social Media Culture'
  | 'Relationships & Dating'
  | 'Substances & Party Culture'
  | 'Mental Well-being'
  | 'Sensitive Safety Topics'

export type Term = {
  term: string
  slug: string
  aliases: string[]
  plainMeaning: string
  summary: string
  interpretations: string[]
  example: string
  contextClues: string
  opener: string
  category: Category
  concern: Concern
  reviewed: string
  origin?: string
}

export const terms: Term[] = [
  {
    "term": "no cap",
    "slug": "no-cap",
    "aliases": [
      "nocap",
      "no 🧢",
      "cap"
    ],
    "plainMeaning": "Honestly; I’m not exaggerating.",
    "summary": "Emphasizes that something is true or sincere.",
    "interpretations": [
      "“No cap” means the speaker is being serious.",
      "Calling something “cap” means it seems false or exaggerated."
    ],
    "example": "“That was the best concert I’ve seen, no cap.”",
    "contextClues": "Usually friendly emphasis. Between friends, “cap” can be a teasing challenge rather than a serious accusation.",
    "opener": "“When you say ‘no cap’ here, do you mean it really surprised you?”",
    "category": "General slang",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "fr fr",
    "slug": "fr-fr",
    "aliases": [
      "fr",
      "for real for real",
      "frfr"
    ],
    "plainMeaning": "For real, for real.",
    "summary": "Strong agreement or reassurance that something is genuine.",
    "interpretations": [
      "Earnest agreement: “Exactly.”",
      "Extra emphasis after a surprising claim.",
      "Occasionally ironic when the surrounding message is exaggerated."
    ],
    "example": "“We need a day off, fr fr.”",
    "contextClues": "Repeated “fr” usually adds sincerity; an exaggerated sentence or laughing emoji can make it ironic.",
    "opener": "“Sounds like you really agree—what part feels most true?”",
    "category": "Abbreviations",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "skibidi",
    "slug": "skibidi",
    "aliases": [
      "skibidi toilet",
      "skibidy"
    ],
    "plainMeaning": "A playful nonsense word or viral reference.",
    "summary": "A flexible joke word whose meaning depends almost entirely on tone.",
    "interpretations": [
      "A reference to the viral Skibidi Toilet animation series.",
      "A deliberately absurd adjective meaning good, bad, strange—or nothing precise.",
      "A shared joke among younger speakers."
    ],
    "example": "“That is the most skibidi thing I’ve seen all day.”",
    "contextClues": "Usually absurd or playful, especially among younger kids. Ask rather than assigning a fixed definition.",
    "opener": "“I know that one changes a lot—what does ‘skibidi’ mean in your group?”",
    "category": "Social Media Culture",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "delulu",
    "slug": "delulu",
    "aliases": [
      "delulu is the solulu",
      "delusional"
    ],
    "plainMeaning": "Playfully unrealistic or over-optimistic.",
    "summary": "Self-aware wishful thinking, often about a crush, celebrity, or goal.",
    "interpretations": [
      "Joking optimism: hoping for an unlikely outcome.",
      "A light tease between friends.",
      "Sometimes a sharper insult if directed at someone during conflict."
    ],
    "example": "“I’m delulu, but maybe they’ll invite me backstage.”",
    "contextClues": "Self-description is usually playful. Used angrily at another person, it can feel dismissive.",
    "opener": "“Is ‘delulu’ a joke here, or did that comment bother you?”",
    "category": "Relationships & Dating",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "cook / let him cook",
    "slug": "cook",
    "aliases": [
      "cook",
      "let him cook",
      "let her cook",
      "cooking",
      "cooked"
    ],
    "plainMeaning": "Let someone continue; they may be doing something impressive.",
    "summary": "Praise for a strong idea or performance—though “cooked” can mean the opposite.",
    "interpretations": [
      "“Let them cook” means give them time to finish.",
      "“They’re cooking” means they are performing well.",
      "“I’m cooked” means exhausted, doomed, or unprepared."
    ],
    "example": "“Wait, let her cook—this plan might actually work.”",
    "contextClues": "Praise when someone is creating or performing. “Cooked” after a test or mistake is usually dramatic frustration.",
    "opener": "“Were they doing really well, or does ‘cooked’ mean something went wrong?”",
    "category": "Gaming & Streaming",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "rizz",
    "slug": "rizz",
    "aliases": [
      "riz",
      "rizzler",
      "unspoken rizz"
    ],
    "plainMeaning": "Charm or flirting ability.",
    "summary": "Someone’s ability to attract or confidently talk to a potential romantic interest.",
    "interpretations": [
      "A compliment about confidence or charisma.",
      "A joke about an awkward attempt at flirting.",
      "“Rizzler” can be admiring or teasing."
    ],
    "example": "“He got her number—that was pure rizz.”",
    "contextClues": "Usually playful. Tone and relationship determine whether it is praise or friendly teasing.",
    "opener": "“Does ‘rizz’ mean they were confident, or are your friends joking about it?”",
    "category": "Relationships & Dating",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "💀 (skull emoji)",
    "slug": "skull-emoji",
    "aliases": [
      "💀",
      "skull",
      "dead",
      "i’m dead"
    ],
    "plainMeaning": "That’s hilarious, awkward, or unbelievable.",
    "summary": "A visual form of “I’m dead,” most often reacting to humor.",
    "interpretations": [
      "Something is extremely funny.",
      "A moment is painfully awkward or embarrassing.",
      "Dramatic disbelief: “I cannot believe that happened.”"
    ],
    "example": "“You really said that in front of the whole class 💀”",
    "contextClues": "After a joke, it means laughter. After embarrassment, it may be a light roast. It is rarely literal.",
    "opener": "“Was the skull because it was funny, or because the moment felt awkward?”",
    "category": "Emojis & Symbols",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "gyatt",
    "slug": "gyatt",
    "aliases": [
      "gyat",
      "gyaat",
      "god damn"
    ],
    "plainMeaning": "A loud exclamation of surprise, usually a meme reaction.",
    "summary": "A stretched-out “god damn” that spread through streams and short video; often a reaction to anything surprising, sometimes a comment on someone’s body.",
    "interpretations": [
      "A meme-style exclamation of surprise at almost anything.",
      "A hype noise younger speakers repeat mostly because it sounds funny.",
      "A comment about someone’s curves, which can be objectifying."
    ],
    "example": "“gyatt the way that combo ended the round”",
    "contextClues": "Stream chat and joke context is the norm, and plenty of kids use it with no meaning attached at all. Aimed at a real person, it can land as unwanted.",
    "opener": "“How are people using ‘gyatt’ right now—is it just a reaction to stuff?”",
    "category": "Social Media Culture",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "bet",
    "slug": "bet",
    "aliases": [
      "aight bet",
      "alright bet"
    ],
    "plainMeaning": "Okay; agreed; challenge accepted.",
    "summary": "A quick way to confirm a plan or accept a challenge.",
    "interpretations": [
      "Simple agreement: “Sounds good.”",
      "Confident acceptance: “Watch me.”",
      "A tense “we’ll see” during an argument."
    ],
    "example": "“Meet by the library at four?” “Bet.”",
    "contextClues": "Usually neutral and friendly. A clipped reply during conflict may sound challenging.",
    "opener": "“Does ‘bet’ just mean you agreed to the plan here?”",
    "category": "General slang",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "ate / left no crumbs",
    "slug": "ate",
    "aliases": [
      "ate",
      "ate that",
      "left no crumbs",
      "devoured"
    ],
    "plainMeaning": "Did something exceptionally well.",
    "summary": "Enthusiastic praise for a look, performance, comeback, or creative work.",
    "interpretations": [
      "“She ate” means she did an excellent job.",
      "“Left no crumbs” intensifies the praise.",
      "Can be playfully exaggerated among friends."
    ],
    "example": "“That presentation? You ate and left no crumbs.”",
    "contextClues": "Almost always positive; look for praise around fashion, art, performance, or a clever response.",
    "opener": "“What did they do that everyone thought was so good?”",
    "category": "General slang",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "mid",
    "slug": "mid",
    "aliases": [
      "mid af",
      "midd"
    ],
    "plainMeaning": "Mediocre or disappointing.",
    "summary": "A blunt way to say something did not live up to the hype.",
    "interpretations": [
      "Average quality rather than terrible.",
      "Dismissive criticism of music, food, games, or style.",
      "Intentional teasing when friends disagree about taste."
    ],
    "example": "“Everyone hyped that movie, but it was mid.”",
    "contextClues": "Usually opinionated but low-stakes. Directed at a person or their work, it can feel unkind.",
    "opener": "“What didn’t live up to the hype for you?”",
    "category": "General slang",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "sus",
    "slug": "sus",
    "aliases": [
      "sussy",
      "suspicious",
      "sussy baka"
    ],
    "plainMeaning": "Suspicious, questionable, or odd.",
    "summary": "Calls attention to behavior that seems off, often jokingly.",
    "interpretations": [
      "A genuine suspicion that something is not right.",
      "A playful accusation inspired by Among Us.",
      "A vague joke about something awkward."
    ],
    "example": "“You disappeared right when the snacks went missing—that’s sus.”",
    "contextClues": "Gaming references are often playful. If connected to safety or trust, ask what specifically felt wrong.",
    "opener": "“Is ‘sus’ just part of the joke, or did something actually make you uncomfortable?”",
    "category": "Gaming & Streaming",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "bussin",
    "slug": "bussin",
    "aliases": [
      "bussin bussin",
      "bussing"
    ],
    "plainMeaning": "Really good, especially food.",
    "summary": "Strong praise for something enjoyable or high quality.",
    "interpretations": [
      "Most commonly, food tastes excellent.",
      "Can praise music, an outfit, or an experience.",
      "Sometimes deliberately overused for comic effect."
    ],
    "example": "“These noodles are bussin.”",
    "contextClues": "Usually upbeat and uncomplicated; the object being praised clarifies the meaning.",
    "opener": "“That sounds like a strong review—what made it so good?”",
    "category": "General slang",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "sigma",
    "slug": "sigma",
    "aliases": [
      "sigma male",
      "what the sigma",
      "sigma grindset"
    ],
    "plainMeaning": "Independent, impressive, or absurdly self-confident.",
    "summary": "A meme label that can praise independence, parody masculinity, or simply sound silly.",
    "interpretations": [
      "Admiration for someone who seems self-directed.",
      "Ironic parody of rigid “alpha male” ideas.",
      "A nonsense reaction among younger speakers: “What the sigma?”"
    ],
    "example": "“He finished the group project alone—sigma move.”",
    "contextClues": "Often ironic. Content about dominance or gender roles may deserve a calm conversation about the underlying message.",
    "opener": "“Is ‘sigma’ a joke in this video, or do people mean the ideas seriously?”",
    "category": "Social Media Culture",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "ngl",
    "slug": "ngl",
    "aliases": [
      "not gonna lie",
      "not gon lie",
      "ngl tho"
    ],
    "plainMeaning": "Not going to lie.",
    "summary": "A soft introduction to an honest opinion or small confession.",
    "interpretations": [
      "Signals candidness before an opinion.",
      "Softens a potentially blunt statement.",
      "Can introduce something vulnerable or sincere."
    ],
    "example": "“Ngl, I was nervous before I went in.”",
    "contextClues": "Pay attention to what follows; the phrase may create space for honesty rather than deception.",
    "opener": "“Thanks for being honest—what made that feel nerve-racking?”",
    "category": "Abbreviations",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "iykyk",
    "slug": "iykyk",
    "aliases": [
      "if you know you know",
      "iykyk 🤫"
    ],
    "plainMeaning": "If you know, you know.",
    "summary": "Signals an inside joke, shared experience, or reference understood by a smaller group.",
    "interpretations": [
      "A friendly inside joke.",
      "A reference that would take too long to explain.",
      "Occasionally an exclusionary hint, depending on the group dynamic."
    ],
    "example": "“The back staircase after lunch… iykyk.”",
    "contextClues": "Usually builds belonging, but it can make others feel left out if used pointedly.",
    "opener": "“Sounds like there’s a story there—do you feel like filling me in?”",
    "category": "Abbreviations",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "touch grass",
    "slug": "touch-grass",
    "aliases": [
      "go touch grass",
      "touch some grass",
      "touchgrass"
    ],
    "plainMeaning": "Log off and reconnect with real life.",
    "summary": "Tells someone they are too invested in an online argument or niche topic.",
    "interpretations": [
      "Playful reminder to take a break from the internet.",
      "Dismissive way to end an argument.",
      "Self-directed joke after spending too much time online."
    ],
    "example": "“I’ve argued about this game for two hours. I need to touch grass.”",
    "contextClues": "Self-directed use is light. A reply to someone sharing a real concern can be belittling.",
    "opener": "“Was that a friendly nudge to take a break, or did it feel dismissive?”",
    "category": "Mental Well-being",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "simp",
    "slug": "simp",
    "aliases": [
      "simping",
      "simped",
      "simpy"
    ],
    "plainMeaning": "Someone seen as giving excessive attention to a crush or admired person.",
    "summary": "Usually teases someone for being very eager to please another person.",
    "interpretations": [
      "Friendly teasing about a crush.",
      "Criticism that someone is neglecting their own boundaries.",
      "A gendered insult used to shame ordinary kindness or affection."
    ],
    "example": "“You brought them coffee again? You’re such a simp.”",
    "contextClues": "Tone matters: joking among close friends differs from repeated shaming or pressure to act uncaring.",
    "opener": "“Was everyone laughing together, or did being called that feel uncomfortable?”",
    "category": "Relationships & Dating",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "clout",
    "slug": "clout",
    "aliases": [
      "clout chasing",
      "clout chaser",
      "for clout"
    ],
    "plainMeaning": "Online influence, attention, or social status.",
    "summary": "Describes visibility or actions taken mainly to gain attention.",
    "interpretations": [
      "Neutral influence or popularity.",
      "“Clout chasing” criticizes attention-seeking behavior.",
      "Can describe pressure to post something dramatic for engagement."
    ],
    "example": "“They only started that argument for clout.”",
    "contextClues": "Often critical. If risky behavior is involved, focus on pressure and consequences rather than the slang.",
    "opener": "“Do you think they wanted attention, or was something else going on?”",
    "category": "Social Media Culture",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "main character energy",
    "slug": "main-character-energy",
    "aliases": [
      "main character",
      "mce",
      "main character moment",
      "maincharacter"
    ],
    "plainMeaning": "Acting confident, noticeable, or centered in your own story.",
    "summary": "Can celebrate confidence or tease someone for making everything about themselves.",
    "interpretations": [
      "Positive confidence and self-expression.",
      "A cinematic, memorable personal moment.",
      "Criticism of self-centered behavior."
    ],
    "example": "“Walking in with that playlist gave me main character energy.”",
    "contextClues": "Self-use is often empowering or ironic. Said about someone else, tone decides whether it is praise or criticism.",
    "opener": "“Did that feel like a confident moment, or were people teasing someone for taking over?”",
    "category": "Social Media Culture",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "crash out",
    "slug": "crash-out",
    "aliases": [
      "crashing out",
      "crashed out",
      "crashout"
    ],
    "plainMeaning": "Fall asleep from exhaustion—or, in other contexts, lose control emotionally.",
    "summary": "Two very different everyday uses. Most often it simply means going to sleep, hard and early. It can also describe an intense emotional reaction, which may be dramatic joking or genuine escalation.",
    "interpretations": [
      "Falling asleep from tiredness: “I’m gonna crash out early tonight.”",
      "Sleeping somewhere casually: “I crashed out on the couch.”",
      "Exaggerated frustration: “I’m about to lose it.”",
      "An angry outburst or impulsive decision, which in some contexts could cause real consequences."
    ],
    "example": "“practice wiped me out, I’m about to crash out” / “if they cancel again I might crash out”",
    "contextClues": "Mentions of being tired, late nights, naps, or a couch or bed point to sleep. Anger words, conflict, or laughing hyperbole point to the emotional meaning; specific threats, plans, or escalating behavior deserve a gentle, direct check-in.",
    "opener": "“When you say ‘crash out,’ do you mean you’re exhausted—or is something getting to you?”",
    "category": "Mental Well-being",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "fanum tax",
    "slug": "fanum-tax",
    "aliases": [
      "fanum taxed",
      "taxing your food",
      "the fanum tax",
      "fanumtax"
    ],
    "plainMeaning": "Playfully taking a bite of someone else’s food.",
    "summary": "A meme inspired by creator Fanum, usually used when friends steal a little food.",
    "interpretations": [
      "A joking “tax” collected from a friend’s snack.",
      "A reference to Fanum and the AMP creator group.",
      "General nonsense humor among younger kids."
    ],
    "example": "“You opened fries, so I’m taking the Fanum tax.”",
    "contextClues": "Usually playful when everyone is comfortable. It is still okay for someone to say no to sharing.",
    "opener": "“Is that your group’s joke for sharing snacks—and does everyone get a choice?”",
    "category": "Gaming & Streaming",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "😭 (loudly crying emoji)",
    "slug": "loudly-crying-emoji",
    "aliases": [
      "😭",
      "crying emoji",
      "sob emoji",
      "i’m crying"
    ],
    "plainMeaning": "That is extremely funny, moving, or overwhelming.",
    "summary": "Often expresses laughter more than sadness in casual chats.",
    "interpretations": [
      "Laughing so hard you cry.",
      "Genuine sadness or being touched.",
      "Dramatic disbelief or pleading."
    ],
    "example": "“The dog stole the microphone 😭”",
    "contextClues": "The surrounding sentence matters: jokes suggest laughter; vulnerable messages may indicate real sadness.",
    "opener": "“Are those laughing tears, or did that actually hit you hard?”",
    "category": "Emojis & Symbols",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "periodt",
    "slug": "periodt",
    "aliases": [
      "and thats on period"
    ],
    "plainMeaning": "End of discussion; that’s final.",
    "summary": "Adds confidence or finality to a statement.",
    "interpretations": [
      "Strong agreement or self-affirmation.",
      "A playful flourish after a bold opinion.",
      "A firm boundary during disagreement."
    ],
    "example": "“You deserve friends who respect you, periodt.”",
    "contextClues": "Often supportive and celebratory. In conflict, it can signal that the speaker is done debating.",
    "opener": "“It sounds like you feel strongly about that—what makes it feel settled?”",
    "category": "General slang",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "🧢 (cap emoji)",
    "slug": "cap-emoji",
    "aliases": [
      "🧢",
      "cap emoji",
      "blue cap"
    ],
    "plainMeaning": "That sounds like a lie or an exaggeration.",
    "summary": "A visual shorthand for “cap,” meaning something seems untrue.",
    "interpretations": [
      "Friendly disbelief: “Sure you did.”",
      "Playful accusation of exaggerating a story.",
      "Occasionally a pointed challenge during a disagreement."
    ],
    "example": "“You ran the whole thing in ten minutes? 🧢”",
    "contextClues": "Usually good-natured banter. If it appears repeatedly in a tense thread, it may be a real dispute.",
    "opener": "“Were your friends joking around, or did they really not believe you?”",
    "category": "Emojis & Symbols",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "istg",
    "slug": "istg",
    "aliases": [
      "i swear to god",
      "i stg",
      "istgg"
    ],
    "plainMeaning": "I swear to God—said for emphasis.",
    "summary": "Adds intensity to a claim, a complaint, or a bit of frustration.",
    "interpretations": [
      "Emphasis: “I really mean it.”",
      "Mild exasperation with a sibling, friend, or teacher.",
      "Occasionally genuine anger, depending on the rest of the message."
    ],
    "example": "“Istg this bus is never on time.”",
    "contextClues": "Usually everyday venting. Repeated, escalating messages may point to a frustration worth talking through.",
    "opener": "“That sounded frustrating—what’s been going on?”",
    "category": "Abbreviations",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "brainrot",
    "slug": "brainrot",
    "aliases": [
      "brain rot",
      "brainrotted",
      "rotting"
    ],
    "plainMeaning": "Silly, repetitive online content—or the foggy feeling after too much of it.",
    "summary": "Self-aware humor about scrolling or memes that make no sense to outsiders.",
    "interpretations": [
      "A label for absurd meme humor.",
      "A joke about feeling mentally mushy after hours of scrolling.",
      "Sometimes a real acknowledgment that screen time isn’t feeling good."
    ],
    "example": "“Sorry, that was pure brainrot—I’ve been scrolling all night.”",
    "contextClues": "Almost always self-deprecating humor. If it comes with tiredness or low mood, it may open a conversation about rest.",
    "opener": "“Is that just a joke about the videos, or does scrolling leave you feeling drained?”",
    "category": "Mental Well-being",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "unalive",
    "slug": "unalive",
    "aliases": [
      "unalived",
      "unaliving",
      "self unalive"
    ],
    "plainMeaning": "A euphemism for dying or killing—originally to dodge content filters, now everyday joking speech too.",
    "summary": "One word covering several different situations: fiction and games, softened talk about real death, dark humor, and occasionally self-reference.",
    "interpretations": [
      "Fiction, games, and plots: “the boss unalived me twelve times.”",
      "A filter-avoidance euphemism so a post about death isn’t taken down.",
      "General euphemistic or meme language where the softer word is just the habit now.",
      "Dark humor or exaggerated frustration: “this homework is unaliving me.”",
      "Third-person discussion of a real death or news story.",
      "In some cases, self-reference that may point to genuine distress."
    ],
    "example": "“That final boss unalived me twelve times.”",
    "contextClues": "Games, shows, and memes are the usual context, and the word travels widely on its own. What changes the picture is who it is about: used about themselves, or alongside withdrawal or hopelessness, respond to the feeling directly and kindly.",
    "opener": "“How do people use that word in your circles—is it mostly a game and meme thing?”",
    "category": "Sensitive Safety Topics",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "catfish",
    "slug": "catfish",
    "aliases": [
      "catfishing",
      "catfished",
      "cat fish"
    ],
    "plainMeaning": "Someone using a fake identity or photos online.",
    "summary": "Describes pretending to be a different person, often in messages or dating apps.",
    "interpretations": [
      "Someone was deceived by a fake profile.",
      "A joke about a photo looking nothing like real life.",
      "A warning that a stranger online may not be who they claim."
    ],
    "example": "“that account is so sus, the photos look like stock images”",
    "contextClues": "Often used jokingly about filters. If a real stranger is involved, focus on support rather than blame.",
    "opener": "“If someone online ever turned out not to be who they said, would you feel okay telling me?”",
    "category": "Sensitive Safety Topics",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "opps",
    "slug": "opps",
    "aliases": [
      "opp",
      "the opps",
      "opposition"
    ],
    "plainMeaning": "Rivals, or whoever someone is up against.",
    "summary": "Usually ordinary rivalry—another team, squad, or friend group—though it can also describe people someone is genuinely in conflict with.",
    "interpretations": [
      "Everyday rivalry: the other team, another school, a rival gaming squad.",
      "Meme and lyric language repeated because it sounds good, with no personal meaning.",
      "Sometimes people someone is genuinely in conflict with."
    ],
    "example": "“We’re playing the opps Friday, it’s gonna be a movie.”",
    "contextClues": "The word came out of drill and rap music, but everyday use now runs through gaming, sports, school rivalries, memes, and joking conflict. Repeated references to specific people, places, or feeling unsafe are worth a calm conversation.",
    "opener": "“Who are the opps here—another team, or something else going on?”",
    "category": "General slang",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "sesh",
    "slug": "sesh",
    "aliases": [
      "seshing",
      "gym sesh"
    ],
    "plainMeaning": "A session of something—study, gaming, gym, or a social hangout.",
    "summary": "A neutral shorthand whose meaning depends entirely on the activity named alongside it.",
    "interpretations": [
      "Study, gym, or gaming session.",
      "A general hangout with friends.",
      "In some circles, a session of drinking or smoking."
    ],
    "example": "“Late study sesh at mine tonight?”",
    "contextClues": "The nearby word usually clarifies it. If the plan sounds vague, asking about who and where is more useful than reading into the word.",
    "opener": "“What’s the plan for tonight—who’s going and where will you be?”",
    "category": "Substances & Party Culture",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "pregame",
    "slug": "pregame",
    "aliases": [
      "pres",
      "pre drinks",
      "pregaming",
      "pre game"
    ],
    "plainMeaning": "Gathering before an event—often, but not always, with drinking.",
    "summary": "Meeting up ahead of a party, concert, or game to get started early.",
    "interpretations": [
      "A completely dry warm-up before a match or concert.",
      "Drinking before going out, common in older teen and college settings.",
      "Simply getting ready together with music and food."
    ],
    "example": "“We’re doing a pregame at Sam’s before the concert.”",
    "contextClues": "Age, setting, and who is hosting matter more than the word. Curiosity about logistics usually reveals the tone.",
    "opener": "“Where’s the pregame, who’s hosting, and how are you getting home afterward?”",
    "category": "Substances & Party Culture",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "zooted",
    "slug": "zooted",
    "aliases": [
      "zooted af",
      "zooted out",
      "zooty"
    ],
    "plainMeaning": "Visibly out of it—said about someone who looks obviously high or wired.",
    "summary": "The louder, more comic cousin of “faded”: it paints someone as wide-eyed and obviously under the influence, and it’s often pure exaggeration.",
    "interpretations": [
      "Visibly intoxicated, most often on cannabis.",
      "Comic exaggeration about being loopy, wired, or running on no sleep.",
      "Describing how someone else looked at a gathering."
    ],
    "example": "“he had two energy drinks and started acting zooted”",
    "contextClues": "Often hyperbole, and usually about how someone looks rather than what they took. Where “faded” leans mellow and sleepy, “zooted” leans cartoonishly out of it. If it describes a real gathering, a calm, judgment-free conversation about getting home safely goes further than a confrontation.",
    "opener": "“Was that a joke about being tired, or was something actually going on that night?”",
    "category": "Substances & Party Culture",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "plug",
    "slug": "plug",
    "aliases": [
      "the plug",
      "plugged",
      "my plug"
    ],
    "plainMeaning": "A useful connection—someone who can get you something.",
    "summary": "Usually about tickets, sneakers, food, merch, or information; in some conversations it means a source for substances.",
    "interpretations": [
      "A useful connection or source in general: “he’s got the plug for everything.”",
      "Someone who can get hold of scarce things—tickets, sneakers, limited drops.",
      "A recommendation or hookup for food, merch, or info: “plug me in.”",
      "In some contexts, a source for alcohol or drugs."
    ],
    "example": "“my cousin’s the plug for tickets, he never misses”",
    "contextClues": "What is being obtained is what matters, not the word. The large majority of uses are completely ordinary; ask about the what rather than the vocabulary.",
    "opener": "“What’s the plug for in this one—tickets, shoes, something else?”",
    "category": "General slang",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "aura",
    "slug": "aura",
    "aliases": [
      "aura points",
      "plus aura",
      "minus aura",
      "lost aura",
      "aurapoints"
    ],
    "plainMeaning": "Someone’s coolness or social presence, measured as imaginary points.",
    "summary": "A playful scoring system for moments that make someone look confident—or embarrass themselves.",
    "interpretations": [
      "“Plus aura” means someone did something impressive.",
      "“Minus aura” means an awkward or embarrassing moment.",
      "Sometimes just a vibe: “she has good aura.”"
    ],
    "example": "“He tripped walking up to accept the award—minus a thousand aura.”",
    "contextClues": "Almost always lighthearted teasing among friends. If someone is repeatedly assigned “minus aura,” check whether the teasing still feels mutual.",
    "opener": "“Is ‘aura’ just your group’s way of joking about cool moments, or does it ever feel pointed?”",
    "category": "General slang",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "lowkey / highkey",
    "slug": "lowkey",
    "aliases": [
      "lowkey",
      "highkey",
      "low key",
      "high key",
      "lowk",
      "highk"
    ],
    "plainMeaning": "Lowkey: kind of, quietly. Highkey: definitely, openly.",
    "summary": "Opposite intensifiers that say how strongly or openly someone feels something.",
    "interpretations": [
      "“Lowkey” softens an opinion or admits something quietly.",
      "“Highkey” emphasizes the feeling openly.",
      "Both can be ironic depending on the sentence."
    ],
    "example": "“Lowkey want to skip the party, highkey want to stay home and sleep.”",
    "contextClues": "Usually casual emphasis. What follows “lowkey” can be a small confession worth hearing out.",
    "opener": "“You said you lowkey wanted to skip it—what’s making it feel like a lot?”",
    "category": "General slang",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "vibe check",
    "slug": "vibe-check",
    "aliases": [
      "vibe",
      "vibes",
      "good vibes",
      "bad vibes",
      "failed the vibe check",
      "vibecheck"
    ],
    "plainMeaning": "An assessment of the mood or feeling of a person, place, or moment.",
    "summary": "Judging whether something feels right, fun, or off.",
    "interpretations": [
      "A genuine read on the atmosphere: “this party passed the vibe check.”",
      "A joking verdict on someone’s behavior.",
      "“Bad vibes” can signal real discomfort with a situation."
    ],
    "example": "“New kid walked in and immediately passed the vibe check.”",
    "contextClues": "Usually playful. If your child says a person or place gives “bad vibes,” it’s worth gently asking why—they may be describing real unease.",
    "opener": "“When something gives you bad vibes, what usually tips you off?”",
    "category": "General slang",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "ick",
    "slug": "ick",
    "aliases": [
      "the ick",
      "got the ick",
      "icks"
    ],
    "plainMeaning": "A sudden feeling of being put off by someone.",
    "summary": "Describes an instant loss of attraction or interest, often over something small.",
    "interpretations": [
      "A small habit that suddenly makes someone less appealing.",
      "A joking list of trivial turn-offs shared with friends.",
      "Sometimes a genuine gut feeling that something is off."
    ],
    "example": "“He clapped when the plane landed and I got the ick.”",
    "contextClues": "Mostly lighthearted dating talk. If the “ick” is about someone’s behavior feeling wrong rather than silly, that’s a different conversation.",
    "opener": "“Was the ick something funny, or did something actually feel off about them?”",
    "category": "Relationships & Dating",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "slay",
    "slug": "slay",
    "aliases": [
      "slayed",
      "slaying",
      "you slay"
    ],
    "plainMeaning": "Did something amazingly well; looks fantastic.",
    "summary": "Enthusiastic praise, especially for style, confidence, or performance.",
    "interpretations": [
      "A compliment on an outfit or look.",
      "Praise for doing something impressively.",
      "A warm, supportive cheer between friends."
    ],
    "example": "“That presentation? Slay. You had the whole class listening.”",
    "contextClues": "Almost always positive and encouraging. The tone is celebratory, not sarcastic, unless clearly paired with an eye-roll.",
    "opener": "“What did they do that deserved a ‘slay’?”",
    "category": "General slang",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "based",
    "slug": "based",
    "aliases": [
      "based af",
      "so based",
      "based and"
    ],
    "plainMeaning": "Admirable for being unapologetically yourself or saying what you think.",
    "summary": "Praise for someone who states an opinion or acts confidently without caring about judgment.",
    "interpretations": [
      "Genuine admiration for honesty or confidence.",
      "Agreement with a bold opinion: “based take.”",
      "Sometimes ironic, praising something absurd on purpose."
    ],
    "example": "“She told the coach the drills were pointless. Based.”",
    "contextClues": "Usually light approval. Occasionally used in online spaces with stronger political undertones—the surrounding conversation shows which it is.",
    "opener": "“What did they say that everyone agreed with so strongly?”",
    "category": "General slang",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "tbh",
    "slug": "tbh",
    "aliases": [
      "to be honest",
      "tbh tho",
      "tbh with you"
    ],
    "plainMeaning": "To be honest.",
    "summary": "Introduces a candid opinion or softens a blunt one.",
    "interpretations": [
      "Genuine honesty before an opinion.",
      "A softener before mild criticism.",
      "A routine filler with little real weight."
    ],
    "example": "“Tbh I didn’t really like the movie everyone’s talking about.”",
    "contextClues": "Pay attention to what follows—it’s often the honest part. Usually low-stakes, everyday candor.",
    "opener": "“Appreciate the honesty—what didn’t work for you about it?”",
    "category": "Abbreviations",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "smh",
    "slug": "smh",
    "aliases": [
      "shaking my head",
      "smh my head",
      "smdh"
    ],
    "plainMeaning": "Shaking my head—in disbelief or disappointment.",
    "summary": "A reaction to something foolish, disappointing, or unbelievable.",
    "interpretations": [
      "Mild disappointment at someone’s choice.",
      "Amused disbelief at a ridiculous situation.",
      "Self-directed: “I forgot my keys again, smh.”"
    ],
    "example": "“He really showed up without the project we both worked on, smh.”",
    "contextClues": "Usually mild exasperation, not deep conflict. Repeated “smh” messages about the same person may signal an ongoing frustration.",
    "opener": "“What happened that had you shaking your head?”",
    "category": "Abbreviations",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "idk / idc",
    "slug": "idk",
    "aliases": [
      "idk",
      "idc",
      "i don’t know",
      "i don’t care"
    ],
    "plainMeaning": "I don’t know / I don’t care.",
    "summary": "Everyday shorthand for uncertainty or indifference.",
    "interpretations": [
      "Genuine uncertainty: “idk what’s happening Friday.”",
      "“Idc” as real indifference about a low-stakes choice.",
      "A clipped “idc” during conflict can mean hurt feelings, not actual indifference."
    ],
    "example": "“Idk where we’re eating, idc as long as there’s fries.”",
    "contextClues": "Mostly casual planning talk. In a tense conversation, “idc” or “whatever” can be a shield for feelings—respond to the mood, not just the words.",
    "opener": "“When you say you don’t care, is that true, or is it more that it feels complicated?”",
    "category": "Abbreviations",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "pov",
    "slug": "pov",
    "aliases": [
      "pov you",
      "my pov"
    ],
    "plainMeaning": "Point of view—a meme format putting you inside a scene.",
    "summary": "Used in videos and captions to set up a scenario the viewer imagines experiencing.",
    "interpretations": [
      "A skit format: “POV: you’re the last one picked.”",
      "A caption framing a relatable moment.",
      "Sometimes used loosely to mean “my perspective.”"
    ],
    "example": "“POV: you open the group chat after sleeping in and there are 400 messages.”",
    "contextClues": "Almost always a humor format. The scene described tells you the joke; the word itself carries no risk.",
    "opener": "“What’s the scene in that POV video—what makes it funny?”",
    "category": "Abbreviations",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "fyp",
    "slug": "fyp",
    "aliases": [
      "for you page",
      "for you",
      "foryoupage"
    ],
    "plainMeaning": "The For You Page—TikTok’s main personalized feed.",
    "summary": "Refers to TikTok’s algorithmic feed, or the hope that a video lands on many people’s feeds.",
    "interpretations": [
      "Talking about what appeared in their feed: “this was all over my FYP.”",
      "A hashtag hoping for reach.",
      "Shorthand for TikTok content in general."
    ],
    "example": "“My FYP is nothing but recipes and dog videos now.”",
    "contextClues": "Neutral platform talk. What shows up on someone’s FYP reflects what they watch—useful, low-pressure window into their interests.",
    "opener": "“What’s your FYP been showing you lately? Anything actually good?”",
    "category": "Abbreviations",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "w / l",
    "slug": "w",
    "aliases": [
      "dub",
      "ell",
      "big w",
      "take the l",
      "win or loss"
    ],
    "plainMeaning": "Win or loss—judging whether something went well or badly.",
    "summary": "A quick verdict on events, borrowed from gaming scoreboards.",
    "interpretations": [
      "“That’s a W” means something went well.",
      "“Take the L” means accept the loss or embarrassment.",
      "Playful scoring of everyday moments."
    ],
    "example": "“They extended the deadline—massive W for all of us.”",
    "contextClues": "Almost always playful commentary. “Take the L” aimed repeatedly at one person can edge into mockery.",
    "opener": "“What was the W—or the L—of your day?”",
    "category": "Abbreviations",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "fire emoji (🔥)",
    "slug": "fire-emoji",
    "aliases": [
      "🔥",
      "fire",
      "that’s fire",
      "fire emoji",
      "lit emoji"
    ],
    "plainMeaning": "That’s excellent, exciting, or impressive.",
    "summary": "A reaction of strong approval for music, outfits, food, skills, or news.",
    "interpretations": [
      "Praise: something is really good.",
      "Hype for an upcoming release or event.",
      "A streak indicator on Snapchat, marking days of consecutive messages."
    ],
    "example": "“Your new track is actually 🔥”",
    "contextClues": "Almost always positive. In Snapchat context, 🔥 next to a name just means a messaging streak—routine, not a statement about the relationship.",
    "opener": "“What got the fire emoji—what was so good?”",
    "category": "Emojis & Symbols",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "eyes emoji (👀)",
    "slug": "eyes-emoji",
    "aliases": [
      "👀",
      "eyes",
      "eyes emoji",
      "the eyes"
    ],
    "plainMeaning": "I’m watching this; something interesting is happening.",
    "summary": "Signals attention, anticipation, or that drama is unfolding.",
    "interpretations": [
      "“I’m watching this situation develop.”",
      "Anticipation: a hint that news is coming.",
      "Playful nosiness about gossip or drama."
    ],
    "example": "“She posted a photo with someone new 👀”",
    "contextClues": "Usually playful curiosity about drama or announcements. The surrounding gossip is the story, not the emoji.",
    "opener": "“What’s everyone watching—did something happen?”",
    "category": "Emojis & Symbols",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "melting face emoji (🫠)",
    "slug": "melting-face-emoji",
    "aliases": [
      "🫠",
      "melting face",
      "melting emoji",
      "im melting"
    ],
    "plainMeaning": "I’m overwhelmed, embarrassed, or done with everything.",
    "summary": "Expresses a mix of embarrassment, exhaustion, or sarcastic surrender.",
    "interpretations": [
      "Mild embarrassment: “I waved back at someone who wasn’t waving at me 🫠”",
      "Overwhelm from stress or heat.",
      "Sarcastic smiling through something frustrating."
    ],
    "example": "“Just realized I’ve been calling my teacher ‘mom’ all year 🫠”",
    "contextClues": "Usually self-deprecating humor. If it appears alongside real stress or exhaustion, it can be a soft way of saying things feel like too much.",
    "opener": "“Was that a funny embarrassing moment, or are things feeling like a lot lately?”",
    "category": "Emojis & Symbols",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "red flag emoji (🚩)",
    "slug": "red-flag-emoji",
    "aliases": [
      "🚩",
      "red flag emoji",
      "that’s a red flag"
    ],
    "plainMeaning": "A warning sign in someone’s behavior.",
    "summary": "Marks behavior that seems concerning, especially in dating or friendships.",
    "interpretations": [
      "A genuine warning sign noticed in someone’s behavior.",
      "A joking verdict on trivial habits: “he doesn’t like dogs 🚩”",
      "Self-aware humor about one’s own quirks."
    ],
    "example": "“He said he’s ‘not really into reading’ 🚩🚩🚩”",
    "contextClues": "As an emoji it is mostly a jokey verdict stamped on a trivial habit, more punchline than warning. If the flags described are about controlling, unkind, or pressuring behavior, take the underlying observation seriously even if the tone is light.",
    "opener": "“What did they do that felt like a red flag—was it silly, or did it actually bother you?”",
    "category": "Emojis & Symbols",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "sparkles emoji (✨)",
    "slug": "sparkles-emoji",
    "aliases": [
      "✨",
      "sparkles",
      "sparkle emoji"
    ],
    "plainMeaning": "Adds emphasis, sarcasm, or a touch of magic to a word.",
    "summary": "Frames a word or phrase to make it feel special—or pointedly sarcastic.",
    "interpretations": [
      "Genuine enthusiasm: “✨girl dinner✨”",
      "Sarcasm: “✨another group project✨”",
      "A playful, aesthetic flourish with no extra meaning."
    ],
    "example": "“Love that for us—✨homework all weekend✨”",
    "contextClues": "Tone decides everything: around something exciting it’s sincere; around a chore it’s dry sarcasm. Either way it’s expressive, not concerning.",
    "opener": "“Were the sparkles sincere or sarcastic there?”",
    "category": "Emojis & Symbols",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "npc",
    "slug": "npc",
    "aliases": [
      "npc behavior",
      "npc energy",
      "like an npc"
    ],
    "plainMeaning": "Someone acting on autopilot, like a background video-game character.",
    "summary": "Teases people who seem scripted, repetitive, or oblivious—borrowed from “non-player character.”",
    "interpretations": [
      "A joke about someone repeating the same phrase or routine.",
      "A meme format filming “NPC” moments in public.",
      "Used at a person, it can be dehumanizing if repeated."
    ],
    "example": "“The barista said ‘have a good one’ to my ‘you too’—total NPC moment, mine not hers.”",
    "contextClues": "Self-deprecating or observational use is common and harmless. Aimed persistently at a classmate, it can become a way of dismissing someone.",
    "opener": "“Is ‘NPC’ just a joke about autopilot moments, or is it about a specific person?”",
    "category": "Gaming & Streaming",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "clutch",
    "slug": "clutch",
    "aliases": [
      "clutched",
      "clutched up",
      "clutch moment",
      "so clutch"
    ],
    "plainMeaning": "Came through at a critical moment.",
    "summary": "Praise for succeeding under pressure, from gaming and sports.",
    "interpretations": [
      "Winning a round alone against the odds in a game.",
      "Delivering something just in time: “you brought the charger, clutch.”",
      "Describing a person who reliably comes through."
    ],
    "example": "“Down to one player against four and he still won—clutch.”",
    "contextClues": "Almost always positive praise. In gaming chats it’s one of the friendlier words you’ll see.",
    "opener": "“What was the clutch moment—what did they pull off?”",
    "category": "Gaming & Streaming",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "sweat / sweaty",
    "slug": "sweat",
    "aliases": [
      "sweat",
      "sweaty",
      "sweats",
      "sweaty lobby"
    ],
    "plainMeaning": "Someone trying extremely hard to win, sometimes too hard.",
    "summary": "Describes intensely competitive players or matches where everyone is trying their absolute hardest.",
    "interpretations": [
      "A skilled, try-hard opponent: “this lobby is full of sweats.”",
      "Self-description: “I was sweating that whole match.”",
      "A complaint that a casual game got too intense."
    ],
    "example": "“It’s supposed to be a fun mode and everyone’s playing like complete sweats.”",
    "contextClues": "Usually exasperated humor about competition. If gaming sessions routinely end in frustration, that mood—not the word—is the thing to ask about.",
    "opener": "“Were the matches fun tonight, or was everyone taking it too seriously?”",
    "category": "Gaming & Streaming",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "gg",
    "slug": "gg",
    "aliases": [
      "gg wp",
      "ggwp",
      "good game",
      "ggs",
      "gg ez"
    ],
    "plainMeaning": "Good game—said after a match.",
    "summary": "A standard sign-off after a game, usually sportsmanlike.",
    "interpretations": [
      "Genuine sportsmanship: “gg, that was close.”",
      "Sarcastic “gg” after a crushing loss.",
      "“Gg ez” is a taunt—poor sportsmanship, sometimes bannable in games."
    ],
    "example": "“Gg everyone, rematch tomorrow?”",
    "contextClues": "Plain “gg” is polite routine. “Gg ez” or a gloating tone signals taunting—worth a word about being a good sport if it’s your kid sending it.",
    "opener": "“Do people in your games keep it friendly afterward, or does it get salty?”",
    "category": "Gaming & Streaming",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "clip it",
    "slug": "clip-it",
    "aliases": [
      "clip",
      "clipped",
      "clip that",
      "clipping"
    ],
    "plainMeaning": "Save a short video of that moment.",
    "summary": "Asking someone to capture a funny or impressive moment from a stream or game.",
    "interpretations": [
      "Requesting a highlight be saved from a stream.",
      "Sharing a short captured moment: “look at this clip.”",
      "Admiration: the moment was worth keeping."
    ],
    "example": "“Did you see that shot? Someone clip it.”",
    "contextClues": "Completely ordinary streaming culture. Clips are how gaming and stream moments get shared—no concern attached to the word itself.",
    "opener": "“What happened that was worth clipping?”",
    "category": "Gaming & Streaming",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "ratio",
    "slug": "ratio",
    "aliases": [
      "ratioed",
      "get ratioed",
      "ratio bozo"
    ],
    "plainMeaning": "A reply that gets more likes than the original post—signaling the crowd disagrees.",
    "summary": "On social media, a reply out-performing the post it answers means public opinion has ruled against it.",
    "interpretations": [
      "A genuine pile-on where the community disagrees with a take.",
      "A game: replying “ratio” hoping to out-like the original.",
      "Can become targeted mockery when a group ratios one person repeatedly."
    ],
    "example": "“He said the remake was better than the original and got ratioed instantly.”",
    "contextClues": "Usually about opinions and jokes. If your child is the one being ratioed by classmates, the pile-on can sting—ask how it felt rather than dismissing it.",
    "opener": "“Was the ratio just about a hot take, or did it feel like people ganging up?”",
    "category": "Social Media Culture",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "lore",
    "slug": "lore",
    "aliases": [
      "the lore",
      "lore drop",
      "deep lore",
      "lore accurate"
    ],
    "plainMeaning": "The backstory or ongoing saga behind a person, group, or joke.",
    "summary": "Borrowed from games and fandoms; now means the shared history behind any friend group’s stories.",
    "interpretations": [
      "The backstory explaining an inside joke.",
      "Updates in an ongoing personal saga: “lore drop.”",
      "Fandom knowledge about a game or show’s world."
    ],
    "example": "“You can’t sit with us until you learn the lore of the group chat.”",
    "contextClues": "Playful belonging language. Occasionally used to exclude—if someone’s always left out of “the lore,” that dynamic is worth noticing.",
    "opener": "“What’s the lore behind that joke—what did I miss?”",
    "category": "Social Media Culture",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "canon event",
    "slug": "canon-event",
    "aliases": [
      "canon",
      "it’s canon",
      "a canon event"
    ],
    "plainMeaning": "An experience everyone has to go through; it can’t be skipped.",
    "summary": "From the Spider-Verse films: a moment that’s part of your story, even if it’s painful or embarrassing.",
    "interpretations": [
      "An inevitable rite of passage: first heartbreak, a bad haircut phase.",
      "Acceptance that someone has to learn something the hard way.",
      "A wry joke about universal embarrassing moments."
    ],
    "example": "“Watching your friend date someone obviously wrong for them and not being able to stop it—a canon event.”",
    "contextClues": "Usually philosophical humor about growing up. A gentle way young people talk about hard experiences being part of life.",
    "opener": "“What makes that a canon event—is it something you went through too?”",
    "category": "Social Media Culture",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "rent free",
    "slug": "rent-free",
    "aliases": [
      "living rent free",
      "rent free in my head",
      "lives rent free"
    ],
    "plainMeaning": "Something you can’t stop thinking about.",
    "summary": "Describes a memory, person, or moment occupying your thoughts constantly.",
    "interpretations": [
      "A funny moment you keep replaying.",
      "An annoyance you can’t let go of.",
      "A crush or person constantly on your mind."
    ],
    "example": "“That comeback she had in class is living rent free in my head.”",
    "contextClues": "Tone decides whether it’s fond, funny, or frustrated. If it’s about a conflict they can’t shake, it may be worth talking through.",
    "opener": "“What’s living rent free for you these days—something funny or something bugging you?”",
    "category": "Social Media Culture",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "gatekeep",
    "slug": "gatekeep",
    "aliases": [
      "gatekeeping",
      "gatekeeper",
      "gatekept"
    ],
    "plainMeaning": "Keeping something—music, a spot, knowledge—secret so it stays special.",
    "summary": "Deliberately not sharing a discovery so it doesn’t become mainstream.",
    "interpretations": [
      "Playfully refusing to name a song or restaurant.",
      "Protecting a community or place from overcrowding.",
      "Criticism of someone being exclusionary with knowledge."
    ],
    "example": "“I’m gatekeeping this study spot until after finals.”",
    "contextClues": "Mostly tongue-in-cheek. In hobby communities it can describe real exclusion of newcomers—context shows which.",
    "opener": "“What are you gatekeeping, and is it working?”",
    "category": "Social Media Culture",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "situationship",
    "slug": "situationship",
    "aliases": [
      "situationships",
      "in a situationship"
    ],
    "plainMeaning": "A romantic connection that isn’t a defined relationship.",
    "summary": "More than friends, less than official—an undefined romantic arrangement.",
    "interpretations": [
      "Two people acting like a couple without labels.",
      "A frustrating in-between state one person wants clarified.",
      "A deliberately casual arrangement both people chose."
    ],
    "example": "“We’ve been in a situationship for four months and I still don’t know what we are.”",
    "contextClues": "Often carries frustration or confusion underneath the casual word. If your child mentions one, curiosity about how they feel about it goes further than questions about the other person.",
    "opener": "“How do you feel about where things are—does the undefined part work for you?”",
    "category": "Relationships & Dating",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "talking stage",
    "slug": "talking-stage",
    "aliases": [
      "the talking stage",
      "talkingstage",
      "just talking",
      "we’re talking"
    ],
    "plainMeaning": "The early phase of getting to know a romantic interest.",
    "summary": "The texting-and-hanging-out period before anything is official.",
    "interpretations": [
      "Early mutual interest, mostly over messages.",
      "A low-commitment way to explore compatibility.",
      "Sometimes a prolonged phase that never becomes a relationship."
    ],
    "example": "“We’re not dating, we’re just in the talking stage.”",
    "contextClues": "Normal, healthy part of how young people approach dating now. The word itself is neutral—what matters is whether they seem happy about it.",
    "opener": "“What’s the talking stage like these days—how do you know when it’s going well?”",
    "category": "Relationships & Dating",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "ghosting",
    "slug": "ghosting",
    "aliases": [
      "ghost",
      "ghosted",
      "got ghosted"
    ],
    "plainMeaning": "Cutting off contact with someone without explanation.",
    "summary": "Suddenly stopping all replies to end a friendship, talking stage, or relationship.",
    "interpretations": [
      "Someone vanished on your child: “he ghosted me.”",
      "Your child avoiding someone by not replying.",
      "A mutual fade where both people stop responding."
    ],
    "example": "“We talked every day for a month and then she just ghosted me.”",
    "contextClues": "Being ghosted genuinely hurts and can dent self-esteem. If it happened to them, lead with empathy; if they’re doing the ghosting, a gentle word about kinder endings helps.",
    "opener": "“That sounds like it stung—do you want to talk about what happened?”",
    "category": "Relationships & Dating",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "red flag / green flag",
    "slug": "red-flag",
    "aliases": [
      "green flag",
      "green flags",
      "beige flag",
      "red flags"
    ],
    "plainMeaning": "Warning signs versus good signs in a person’s behavior.",
    "summary": "A checklist language for judging whether someone seems healthy to date or befriend.",
    "interpretations": [
      "Red flags: controlling, unkind, or pressuring behavior.",
      "Green flags: respect, consistency, kindness.",
      "Beige flags: quirks that are neither good nor bad, just odd."
    ],
    "example": "“He remembered what I said last week and asked about it—green flag.”",
    "contextClues": "Often used lightly, but the framework is genuinely useful. If the “red flags” they describe involve control or pressure, treat it as real information delivered in casual packaging.",
    "opener": "“What counts as a green flag for you in a friend or someone you’re dating?”",
    "category": "Relationships & Dating",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "dry texter",
    "slug": "dry-texter",
    "aliases": [
      "dry texting",
      "drytexter",
      "dry replies",
      "being dry"
    ],
    "plainMeaning": "Someone who replies with short, low-effort messages.",
    "summary": "One-word answers and slow replies that make conversation feel like pulling teeth.",
    "interpretations": [
      "Genuine disinterest in the conversation.",
      "A busy or distracted person, not a snub.",
      "“Being dry” on purpose during a conflict to signal annoyance."
    ],
    "example": "“He’s such a dry texter—‘lol’ and ‘yeah’ and nothing else.”",
    "contextClues": "Usually mild complaint. If your child is anxious about someone’s dry replies, the worry underneath—do they still like me?—is the real topic.",
    "opener": "“Do you think they’re losing interest, or are they just bad at texting?”",
    "category": "Relationships & Dating",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "faded",
    "slug": "faded",
    "aliases": [
      "faded af",
      "getting faded",
      "so faded"
    ],
    "plainMeaning": "Hazy and dulled—mellow-drunk, high, or just running on empty.",
    "summary": "Describes a blurry, low-energy state. Used for real intoxication and, very often, for plain exhaustion, and usually said about oneself.",
    "interpretations": [
      "Mellow intoxication, usually alcohol or cannabis.",
      "Very common exaggeration for no sleep and zero energy.",
      "Describing someone else’s hazy state."
    ],
    "example": "“three hours of sleep and I’m walking around faded”",
    "contextClues": "Often hyperbole about exhaustion, and it leans sleepy rather than wild—“zooted” is the word for looking obviously out of it. If it describes a real night out, a calm conversation about getting home matters more than the vocabulary.",
    "opener": "“Was that a joke about being tired, or was it an actual party situation?”",
    "category": "Substances & Party Culture",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "lit",
    "slug": "lit",
    "aliases": [
      "lit af",
      "it’s lit",
      "so lit"
    ],
    "plainMeaning": "Exciting, fun, or excellent—often about a party or event.",
    "summary": "High-energy praise for an event, song, or atmosphere.",
    "interpretations": [
      "A party or event that’s genuinely fun.",
      "Hype for something upcoming: “Friday’s gonna be lit.”",
      "Occasionally describes an atmosphere where drinking is happening."
    ],
    "example": "“The bonfire last night was actually lit.”",
    "contextClues": "Mostly means “fun.” The event being described matters more than the word—asking what made it fun tells you what you need to know.",
    "opener": "“What made it so lit—what was the best part?”",
    "category": "Substances & Party Culture",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "kickback",
    "slug": "kickback",
    "aliases": [
      "kick back",
      "a kickback"
    ],
    "plainMeaning": "A small, casual hangout—more relaxed than a party.",
    "summary": "A low-key gathering at someone’s place with a handful of people.",
    "interpretations": [
      "A genuinely chill evening with friends, music, and food.",
      "A smaller party that may still involve drinking, depending on the crowd.",
      "Just hanging out doing nothing in particular."
    ],
    "example": "“Nothing crazy, just a kickback at Jordan’s tonight.”",
    "contextClues": "The word promises low-key, but the reality depends on who’s hosting and who’s going. Logistics questions—where, who, how you’re getting home—work better than parsing the word.",
    "opener": "“Who’s going to be at the kickback, and what’s the plan for getting home?”",
    "category": "Substances & Party Culture",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "burnt out",
    "slug": "burnt-out",
    "aliases": [
      "burnout",
      "burntout",
      "burned out",
      "so burnt out"
    ],
    "plainMeaning": "Exhausted from doing too much for too long.",
    "summary": "Describes deep tiredness from school, sports, work, or everything at once.",
    "interpretations": [
      "Genuine exhaustion from an overloaded schedule.",
      "Dramatic shorthand for a tiring week.",
      "A signal that motivation and enjoyment are dropping too."
    ],
    "example": "“Between AP classes and practice every day, I’m completely burnt out.”",
    "contextClues": "Sometimes casual exaggeration, sometimes a real statement about capacity. If it comes with withdrawal from things they used to enjoy, treat it as an opening to talk about load and rest.",
    "opener": "“What’s taking the most out of you right now—and what would make it lighter?”",
    "category": "Mental Well-being",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "doomscrolling",
    "slug": "doomscrolling",
    "aliases": [
      "doomscroll",
      "doom scrolling",
      "doomscrolled"
    ],
    "plainMeaning": "Endlessly scrolling negative or absorbing content, usually at night.",
    "summary": "Losing time to a feed of bad news or endless videos, and feeling worse after.",
    "interpretations": [
      "Self-aware joke about staying up too late on the phone.",
      "Genuinely feeling anxious after consuming heavy content.",
      "A habit they recognize but struggle to stop."
    ],
    "example": "“I meant to sleep an hour ago but I’ve been doomscrolling.”",
    "contextClues": "Usually said with self-aware humor. If it’s frequent and paired with anxiety or poor sleep, it’s a practical conversation about habits—not a character flaw.",
    "opener": "“Does scrolling at night leave you feeling okay, or kind of worse?”",
    "category": "Mental Well-being",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "bed rotting",
    "slug": "bed-rotting",
    "aliases": [
      "bed rot",
      "rotting in bed",
      "bedrotting"
    ],
    "plainMeaning": "Spending a long stretch in bed with snacks and a phone.",
    "summary": "Often described as deliberate rest or joked about; it can also cover exhaustion, illness, burnout, low mood, or avoidance. The phrase itself doesn’t say which.",
    "interpretations": [
      "Intentional rest after an exhausting stretch.",
      "A meme-ified way of describing a lazy day.",
      "Being genuinely wiped out, unwell, or burnt out.",
      "Sometimes low mood or avoidance described lightly."
    ],
    "example": "“No plans Saturday. I’m bed rotting and nobody can stop me.”",
    "contextClues": "As an occasional reset it’s ordinary and usually joked about. The word can’t tell you how someone feels; if it’s most days, or replacing things they used to enjoy, the pattern is what to notice.",
    "opener": "“Is bed rotting your way of recharging, or have things been feeling heavy lately?”",
    "category": "Mental Well-being",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "fomo",
    "slug": "fomo",
    "aliases": [
      "fomo af",
      "major fomo",
      "fear of missing out"
    ],
    "plainMeaning": "Fear of missing out on what others are doing.",
    "summary": "The anxious feeling that everyone is having fun without you.",
    "interpretations": [
      "Mild regret about skipping an event.",
      "Real anxiety triggered by watching friends’ posts.",
      "A joking excuse for going to everything: “I have fomo.”"
    ],
    "example": "“Seeing everyone’s stories from the game gave me major fomo.”",
    "contextClues": "Often light, but social media can make it constant. If it’s driving them to say yes to everything or feel bad at home, it’s worth talking about how feeds show highlights, not reality.",
    "opener": "“When you get fomo, is it more about the event or about feeling left out?”",
    "category": "Mental Well-being",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "overstimulated",
    "slug": "overstimulated",
    "aliases": [
      "overstimulation",
      "over stimulated",
      "so overstimulated",
      "overstimulating"
    ],
    "plainMeaning": "Overwhelmed by too much noise, activity, or input at once.",
    "summary": "Feeling maxed out by sensory or social overload and needing quiet.",
    "interpretations": [
      "Genuine sensory overwhelm in loud, busy places.",
      "Social battery running out after a long day.",
      "Casual shorthand for “I need everyone to stop talking to me.”"
    ],
    "example": "“The mall on a Saturday has me so overstimulated, I need to sit in the car.”",
    "contextClues": "Increasingly used accurately and self-awarely. Honoring it—giving space, lowering noise—builds trust better than pushing through.",
    "opener": "“What tends to overload you—and what helps when it happens?”",
    "category": "Mental Well-being",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "kms",
    "slug": "kms",
    "aliases": [
      "k m s",
      "kill myself",
      "gonna kms"
    ],
    "plainMeaning": "Literally “kill myself”—often used as exaggeration or dark humor, though context can’t be assumed.",
    "summary": "In teen texting it usually means embarrassment or frustration, but the same three letters can also carry real distress, so the surrounding context matters more than the abbreviation.",
    "interpretations": [
      "Dramatic exaggeration: “I forgot my presentation at home, kms.”",
      "Dark humor or a joking bid for sympathy among friends who all speak this way.",
      "Sometimes a real expression of distress inside casual phrasing."
    ],
    "example": "“Spilled coffee all over my white shirt before the photo, kms.”",
    "contextClues": "Look at the whole pattern rather than one message. Alongside jokes and everyday complaints it usually reads as hyperbole; alongside hopelessness, plans, withdrawal, or goodbyes it should never be assumed to be a joke. Respond to the feeling directly and calmly—and know that 988, the U.S. Suicide & Crisis Lifeline (call or text), is there for both of you. If someone is in immediate danger, contact your local emergency services.",
    "opener": "“That one gets used as a joke a lot, and sometimes it isn’t. How are you doing, honestly?”",
    "category": "Sensitive Safety Topics",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "grooming",
    "slug": "grooming",
    "aliases": [
      "groomer",
      "being groomed",
      "groomed"
    ],
    "plainMeaning": "A pattern where someone older builds trust with a young person in order to manipulate or exploit them—and, online, also a word thrown around loosely as an accusation.",
    "summary": "A serious safety term for gradual trust-building, boundary erosion, and manipulation toward sexual or other abuse. Separately, it gets used carelessly in internet arguments, where the word alone proves nothing.",
    "interpretations": [
      "A genuine description of a pattern: an adult or older teen building trust, eroding boundaries, isolating someone, and pushing toward exploitation.",
      "Awareness language from online safety education.",
      "General discussion of the concept, such as a news story or a video.",
      "An unsupported insult in an online argument—serious to say, but not evidence by itself."
    ],
    "example": "“the server banned him after people said he kept messaging the younger kids privately”",
    "contextClues": "If your child uses this word about a real person in their life, listen carefully and stay calm—your reaction shapes whether they keep talking. If it’s just internet argument slang, a light question about context is enough.",
    "opener": "“I want to understand what’s going on—can you tell me more about who you mean and what happened?”",
    "category": "Sensitive Safety Topics",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "send pics",
    "slug": "send-pics",
    "aliases": [
      "send pic",
      "send nudes",
      "pics?",
      "send a pic"
    ],
    "plainMeaning": "A request for photos—ranging from innocent to pressured requests for explicit images.",
    "summary": "Can be a harmless ask for a selfie or a pressured request for intimate photos; the surrounding relationship decides which.",
    "interpretations": [
      "Innocent: a friend asking to see an outfit or a new pet.",
      "Flirtatious but mutual photo-sharing between teens.",
      "Pressured or repeated requests for explicit images, which can become coercion."
    ],
    "example": "“Send pics of the fit before you leave.”",
    "contextClues": "The word “pics” alone proves nothing—most uses are ordinary. What matters is whether your child feels free to say no. A standing, judgment-free “you can always tell me” matters more than monitoring messages.",
    "opener": "“Has anyone ever asked you for photos in a way that felt pushy or weird? You’d never be in trouble for telling me.”",
    "category": "Sensitive Safety Topics",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "sh",
    "slug": "sh",
    "aliases": [
      "self harm",
      "sh tw",
      "tw sh"
    ],
    "plainMeaning": "Usually just “shh” or a typo—but in content warnings it is shorthand for self-harm.",
    "summary": "Two letters carry very little meaning on their own. Most sightings are “shh,” a slip of the keyboard, or initials. In content warnings written as “tw: sh,” it refers to self-injury and appears mostly in supportive or recovery spaces.",
    "interpretations": [
      "Telling someone to be quiet: “sh, they’ll hear us.”",
      "A typo or shortened word while typing fast.",
      "A content warning: “tw: sh” before a post mentioning self-injury.",
      "Someone discussing their own struggles, often seeking support."
    ],
    "example": "“sh he’s right there” / “The post had a ‘tw: sh’ warning so I scrolled past.”",
    "contextClues": "On its own, in the middle of a sentence, it is almost always “shh” or a typo. The clinical meaning generally appears with warning wording like “tw” or “cw.” Even then, seeing it is not evidence your child self-harms—it circulates widely in warnings and support content. If it appears in their own writing about themselves, approach with calm openness, not alarm; 988, the U.S. Suicide & Crisis Lifeline, and the U.S. Crisis Text Line (text HOME to 741741) exist for exactly these conversations. If someone is in immediate danger, contact your local emergency services.",
    "opener": "“That abbreviation comes up a lot online—how do people use it? And how have things been for you lately?”",
    "category": "Sensitive Safety Topics",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "ed",
    "slug": "ed",
    "aliases": [
      "eating disorder",
      "ednos",
      "ed tw",
      "edtwt"
    ],
    "plainMeaning": "Often a class, a nickname, or a name—Driver’s Ed, Phys Ed, someone called Ed. In content warnings, shorthand for eating disorder.",
    "summary": "Two letters with several ordinary uses. School schedules (“Driver’s Ed,” “Phys Ed”), the name Ed, and everyday abbreviations account for most sightings. Written as “ed tw” or inside tags like “edtwt,” it refers to eating disorders and appears in warnings, recovery spaces, and—concerningly—communities that romanticize disordered eating.",
    "interpretations": [
      "A school class: “I have Driver’s Ed after lunch.”",
      "A person’s name or nickname.",
      "A content warning before food or body-related posts.",
      "Tags like “edtwt” for eating-disorder Twitter, which includes both support and harmful content."
    ],
    "example": "“ed got moved to second period” / “The video started with an ‘ed tw’ so people could skip it.”",
    "contextClues": "School, schedule, or name context is exactly what it looks like. The clinical meaning usually travels with warning wording (“tw,” “cw”) or community tags. Even then, the abbreviation alone says nothing about your child. If you notice it alongside changed eating habits or body talk, a gentle, non-accusatory conversation (and a pediatrician or therapist) helps far more than food policing.",
    "opener": "“How do people your age use that term—is it mostly warnings, or something else?”",
    "category": "Sensitive Safety Topics",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "bf / gf",
    "slug": "bf",
    "aliases": [
      "bf",
      "gf",
      "boyfriend",
      "girlfriend",
      "my bf",
      "my gf"
    ],
    "plainMeaning": "Boyfriend or girlfriend—a labeled romantic relationship.",
    "summary": "Short forms for boyfriend and girlfriend, the most common way teens name a relationship.",
    "interpretations": [
      "A straightforward romantic relationship both people acknowledge.",
      "Sometimes used loosely for someone they’re interested in or recently started seeing.",
      "Occasionally joking: calling a close friend or even a pet “my gf” playfully."
    ],
    "example": "“My gf wants me to come to her game on Friday.”",
    "contextClues": "Usually exactly what it sounds like. What matters more than the label is whether the relationship feels respectful and equal—if they’re happy to talk about the person, that’s a good sign.",
    "opener": "“I’d love to hear about them—what do you like most about your boyfriend or girlfriend?”",
    "category": "Relationships & Dating",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "bestie",
    "slug": "bestie",
    "aliases": [
      "best friend",
      "best friends",
      "bestie behavior",
      "my bestie",
      "besties"
    ],
    "plainMeaning": "A close friend—your favorite person.",
    "summary": "Warm, casual word for a best friend, used sincerely or playfully with almost anyone.",
    "interpretations": [
      "A genuine best friend.",
      "A friendly label for anyone they’re close to that day—“bestie” gets around.",
      "An online comment to a creator or stranger, meaning “friend” in a warm, casual way."
    ],
    "example": "“Bestie said she’d cover for me, so I’m covered.”",
    "contextClues": "Almost always warm. Watch the friendship itself rather than the word—reciprocity and kindness matter more than titles.",
    "opener": "“Who’s your bestie these days—what makes you two click?”",
    "category": "General slang",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "day one",
    "slug": "day-one",
    "aliases": [
      "day 1",
      "day 1s",
      "day ones",
      "my day one"
    ],
    "plainMeaning": "A friend who’s been loyal since the beginning.",
    "summary": "Someone who has stuck around through everything—a loyalty title, not just a duration.",
    "interpretations": [
      "A longtime, loyal friend.",
      "Praise for someone who stood by them during something hard.",
      "Occasionally ironic about someone who just arrived but acts like a veteran."
    ],
    "example": "“She’s my day one—we’ve known each other since kindergarten.”",
    "contextClues": "Almost always a compliment about loyalty. Friendship hierarchies shift fast at this age, so “day one” status can matter a lot to them.",
    "opener": "“Who are your day ones—what’s kept you close all this time?”",
    "category": "General slang",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "third wheel",
    "slug": "third-wheel",
    "aliases": [
      "thirdwheel",
      "third wheeling",
      "third wheeling it",
      "fifth wheel"
    ],
    "plainMeaning": "The extra person hanging out with a couple.",
    "summary": "Feeling like the odd one out next to a paired-off couple—usually joked about, sometimes genuinely lonely.",
    "interpretations": [
      "Self-deprecating joke about tagging along with a couple.",
      "A genuine feeling of being left out or unwanted.",
      "Teasing a friend who keeps joining a couple’s plans."
    ],
    "example": "“They were being all coupley at lunch, so I just third-wheeled my way through it.”",
    "contextClues": "Mostly light complaint. If it comes up repeatedly, it may point to feeling left behind as friends pair off—a feeling worth hearing out, not fixing.",
    "opener": "“Do you ever feel like the third wheel, or is it more of a joke with your group?”",
    "category": "Relationships & Dating",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "left on read",
    "slug": "left-on-read",
    "aliases": [
      "left me on read",
      "leftonread",
      "on read",
      "left on opened",
      "left me on delivered",
      "on delivered"
    ],
    "plainMeaning": "Someone saw your message and didn’t reply.",
    "summary": "The modern silent treatment—read receipts make non-replies visible, and they sting.",
    "interpretations": [
      "A friend or crush saw the message and hasn’t answered yet.",
      "A deliberate snub during conflict.",
      "The person genuinely forgot, got busy, or opened it by accident."
    ],
    "example": "“I asked if she was mad and she left me on read for three hours.”",
    "contextClues": "Feels bigger to them than it usually is—but not always. If it’s part of a pattern of on-again, off-again attention from one person, the mixed messages themselves are the thing to talk about.",
    "opener": "“That waiting-for-a-reply feeling is the worst—what do you think is going on?”",
    "category": "Relationships & Dating",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "double text",
    "slug": "double-text",
    "aliases": [
      "doubletext",
      "double texting",
      "double texted",
      "double texting him",
      "double texting her"
    ],
    "plainMeaning": "Sending another message before the person replies.",
    "summary": "Following up on yourself—often treated as slightly embarrassing, though almost everyone does it.",
    "interpretations": [
      "A practical follow-up: “did you see my message?”",
      "Anxiety-driven over-messaging, then worrying it looked desperate.",
      "Joking about the “shame” of double texting, which is mostly a meme."
    ],
    "example": "“I know I already texted, but I’m double texting because I really need an answer.”",
    "contextClues": "Usually harmless. If they’re sending many anxious messages to someone who rarely replies, the imbalance in effort is worth a caring conversation.",
    "opener": "“Do you ever worry about double texting—what makes a reply feel urgent?”",
    "category": "Relationships & Dating",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "tea",
    "slug": "tea",
    "aliases": [
      "the tea",
      "spill the tea",
      "spilling the tea",
      "spilled the tea"
    ],
    "plainMeaning": "Gossip or the inside story on something.",
    "summary": "Juicy news, especially about other people’s relationships or drama.",
    "interpretations": [
      "Playful gossip traded between friends.",
      "Genuine news someone wants to share: “I have tea.”",
      "Occasionally a rumor about a real person, which can spread and hurt."
    ],
    "example": "“Sit down, I have tea about what happened at Maya’s party.”",
    "contextClues": "Mostly harmless social currency. If the tea is about a specific classmate, it’s worth a light nudge about how stories spread—and how they’d feel if it were them.",
    "opener": "“What’s the tea? And is it the kind that’s funny or the kind that could hurt someone?”",
    "category": "General slang",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "beef",
    "slug": "beef",
    "aliases": [
      "beefing",
      "got beef",
      "have beef",
      "beef with"
    ],
    "plainMeaning": "A conflict or grudge with someone.",
    "summary": "Ongoing friction between two people or groups, from petty disagreements to genuine fallout.",
    "interpretations": [
      "A trivial squabble, often described jokingly.",
      "A real falling-out with a friend that’s actually bothering them.",
      "In some circles, escalating conflict between groups."
    ],
    "example": "“I’ve got beef with Jordan—he told everyone about my crush.”",
    "contextClues": "Tone tells you how serious it is. Laughing about it usually means it’s small; if it involves specific people, threats, or fear, treat it as real and stay calm and curious.",
    "opener": "“What’s the beef about—do you want to talk it through or just vent?”",
    "category": "General slang",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "salty",
    "slug": "salty",
    "aliases": [
      "so salty",
      "salty af",
      "being salty",
      "salty about"
    ],
    "plainMeaning": "Bitter or irritated, especially about losing or being corrected.",
    "summary": "Acting visibly annoyed or resentful about something small.",
    "interpretations": [
      "Good-natured teasing after losing a game or being wrong.",
      "Genuine lingering resentment about something.",
      "Self-aware: “I know I’m being salty.”"
    ],
    "example": "“He’s still salty about losing Mario Kart last weekend.”",
    "contextClues": "Usually playful banter. If someone is described as salty about the same thing for weeks, the underlying grudge may be worth a conversation.",
    "opener": "“What’s got them so salty—did something happen?”",
    "category": "General slang",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "gc",
    "slug": "gc",
    "aliases": [
      "group chat",
      "groupchat",
      "the group chat",
      "gc drama"
    ],
    "plainMeaning": "Group chat—the constant background of teen social life.",
    "summary": "Where plans, jokes, drama, and half of teen communication actually happen.",
    "interpretations": [
      "Just naming the chat: “check the gc.”",
      "Referring to drama or news that happened in one.",
      "Different group chats play different roles—close friends, teammates, classmates."
    ],
    "example": "“The gc has been going crazy since the rumor started.”",
    "contextClues": "Group chats are where belonging happens—and where exclusion and pile-ons can too. If the gc has been stressful lately, who’s in it and how they treat each other matters more than the app.",
    "opener": "“How’s the group chat treating you lately—fun place or stressful place?”",
    "category": "Abbreviations",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "moots",
    "slug": "moots",
    "aliases": [
      "moot",
      "mutuals",
      "my moots"
    ],
    "plainMeaning": "Mutual followers—people who follow each other online.",
    "summary": "Online friends who follow each other back, often forming genuine communities.",
    "interpretations": [
      "Simply mutual followers.",
      "A real online friend group that talks regularly.",
      "Sometimes online-only friends they’ve never met in person."
    ],
    "example": "“One of my moots made this edit and it’s amazing.”",
    "contextClues": "Mostly wholesome community-building. Online friends are real friends to teens—asking about them with genuine interest tells you a lot and keeps the door open if something feels off.",
    "opener": "“Tell me about your moots—how did you all find each other?”",
    "category": "Social Media Culture",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "close friends",
    "slug": "close-friends",
    "aliases": [
      "closefriends",
      "close friends list",
      "close friends story",
      "cf list"
    ],
    "plainMeaning": "A private story on Instagram or TikTok shown only to chosen people.",
    "summary": "A restricted story list—being added is a social signal, and being left off can sting.",
    "interpretations": [
      "A smaller, more honest or unfiltered story for real friends.",
      "A status marker: being on someone’s close friends list means being in their inner circle.",
      "Sometimes used to keep content away from a wider audience, including adults."
    ],
    "example": "“She put me on her close friends, so I saw the story before anyone else.”",
    "contextClues": "Usually just privacy among friends. Being left off a list they expected to be on can genuinely hurt—worth hearing about. It’s also normal for teens to want spaces adults aren’t in; that’s development, not a warning sign.",
    "opener": "“I know close friends stories are a thing—is that a space you and your friends use?”",
    "category": "Social Media Culture",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "finsta / spam account",
    "slug": "finsta",
    "aliases": [
      "finsta",
      "spam account",
      "spam acc",
      "spam insta",
      "private account"
    ],
    "plainMeaning": "A second, private account for a smaller, realer audience.",
    "summary": "A side account where teens post unfiltered content for close friends only, away from the polished main account.",
    "interpretations": [
      "A genuine outlet for casual, unfiltered posts among friends.",
      "A place for jokes and spam content nobody takes seriously.",
      "Occasionally a space to keep feelings or activity private from adults."
    ],
    "example": "“I only post on my spam now—the main account feels like a performance.”",
    "contextClues": "Mostly healthy: it’s often a more honest space than their main account. Curiosity about what they share there, without demanding access, keeps trust intact.",
    "opener": "“I’ve heard people have spam accounts—what’s yours like, if you have one?”",
    "category": "Social Media Culture",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "soft block / hard block",
    "slug": "soft-block",
    "aliases": [
      "soft block",
      "hard block",
      "soft blocked",
      "hard blocked",
      "softblock",
      "hardblock"
    ],
    "plainMeaning": "Quietly removing a follower (soft) versus fully blocking them (hard).",
    "summary": "Two levels of stepping back from someone online—one discreet, one explicit.",
    "interpretations": [
      "A soft block is a quiet way to create distance without confrontation.",
      "A hard block cuts contact completely and is visible to the person.",
      "Sometimes friends advise blocking as self-protection after conflict."
    ],
    "example": "“He kept replying to everything, so I just soft blocked him.”",
    "contextClues": "Usually a reasonable boundary-setting tool. If your child blocked someone—or was blocked—after conflict, the story behind it is the conversation, not the button.",
    "opener": "“If someone’s bothering you online, do you and your friends block them or just tune them out?”",
    "category": "Social Media Culture",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "subtweet",
    "slug": "subtweet",
    "aliases": [
      "subtweeting",
      "subtweeted",
      "vague post",
      "vagueposting"
    ],
    "plainMeaning": "Posting about someone without naming them.",
    "summary": "An indirect public jab or complaint that everyone in the know can identify anyway.",
    "interpretations": [
      "A playful jab at a friend everyone recognizes.",
      "Venting frustration without naming names.",
      "A targeted way to criticize or embarrass someone while keeping plausible deniability."
    ],
    "example": "“So glad some people know how to cancel plans last minute 🙂 — total subtweet.”",
    "contextClues": "Watch who it’s about. If your child is writing them, it may be hurt feelings looking for an outlet; if classmates are subtweeting them, ask how it feels to be the unnamed subject.",
    "opener": "“Was that subtweet about someone specific—did it start something?”",
    "category": "Social Media Culture",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "soft launch / hard launch",
    "slug": "soft-launch",
    "aliases": [
      "softlaunch",
      "hardlaunch",
      "soft launched",
      "hard launched",
      "soft launching",
      "hard launching"
    ],
    "plainMeaning": "Gradually revealing a relationship online (soft) versus announcing it outright (hard).",
    "summary": "How couples go public on social media—a hand in frame first, then the official post.",
    "interpretations": [
      "A soft launch: subtle photos—a hand, a shadow, a second plate.",
      "A hard launch: the explicit announcement post.",
      "Sometimes joked about when someone launches and quickly deletes."
    ],
    "example": "“She soft launched him with a coffee photo and everyone figured it out in minutes.”",
    "contextClues": "Mostly harmless ritual and fun. If a relationship lives entirely online or the launch caused fallout, the real-life relationship is worth a curious question or two.",
    "opener": "“Did you see that soft launch? What’s the etiquette these days?”",
    "category": "Relationships & Dating",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "thirst trap",
    "slug": "thirst-trap",
    "aliases": [
      "thirsty",
      "thirsttrap",
      "thirsty post",
      "thirst trapping"
    ],
    "plainMeaning": "A photo posted to attract attention or compliments.",
    "summary": "A flattering photo designed to draw admiring responses—often used jokingly, sometimes sincerely.",
    "interpretations": [
      "A self-aware joke: posting a gym mirror pic and calling it a thirst trap.",
      "A sincere bid for attention or validation.",
      "A criticism of someone else’s post as attention-seeking."
    ],
    "example": "“Posted one photo from the beach and my aunt called it a thirst trap.”",
    "contextClues": "Mostly self-aware humor. The word is a good opening for talking about what gets posted publicly and who can see it—without shaming anyone for wanting to feel attractive.",
    "opener": "“Do you and your friends actually call photos thirst traps, or is it all a joke?”",
    "category": "Social Media Culture",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "sliding into the DMs",
    "slug": "sliding-into-the-dms",
    "aliases": [
      "slide into the dms",
      "sliding into dms",
      "slid into the dms",
      "slid into her dms",
      "dms"
    ],
    "plainMeaning": "Message someone privately, usually to flirt.",
    "summary": "Starting a private conversation with someone—often a crush or a stranger—on social media.",
    "interpretations": [
      "A confident, often funny way to describe flirting in DMs.",
      "Just messaging a friend privately—“I’ll DM you” is routine.",
      "Reaching out to someone they don’t know in person, which ranges from sweet to unwanted."
    ],
    "example": "“He slid into my DMs with a playlist and honestly it kind of worked.”",
    "contextClues": "Between people who know each other, it’s normal flirting. Messages from strangers—especially older ones asking for photos or secrets—deserve a calm heads-up about trusting your gut and telling an adult.",
    "opener": "“Do people actually meet through DMs now—has that ever happened in your world?”",
    "category": "Relationships & Dating",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "down bad",
    "slug": "down-bad",
    "aliases": [
      "down bad af",
      "so down bad",
      "down horrendous",
      "down astronomically"
    ],
    "plainMeaning": "Extremely smitten—hopelessly into someone.",
    "summary": "Being so attracted or devoted that judgment visibly leaves the building. Used about oneself, it’s self-aware comedy.",
    "interpretations": [
      "Openly, dramatically crushing on someone.",
      "A joking self-roast about embarrassing behavior over a crush.",
      "Occasionally describes attraction that’s more physical than romantic."
    ],
    "example": "“He liked her photo from 2019. He’s down bad.”",
    "contextClues": "Almost always comic exaggeration. Occasionally it flags behavior that’s out of character—chasing someone who isn’t interested is worth a gentle word about self-respect, not a lecture.",
    "opener": "“Who’s got you or your friends down bad these days?”",
    "category": "Relationships & Dating",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "shoot your shot",
    "slug": "shoot-your-shot",
    "aliases": [
      "shoot my shot",
      "shooting your shot",
      "shot your shot",
      "shoot ur shot"
    ],
    "plainMeaning": "Take the chance and ask someone out.",
    "summary": "Making a move despite the possibility of rejection—usually encouraged with cheering, not pressure.",
    "interpretations": [
      "Encouragement to confess a crush or ask someone out.",
      "Praise for having tried, whatever the result.",
      "Occasionally applied to non-romantic brave asks, like applying for something."
    ],
    "example": "“Just shoot your shot—worst case she says no and you never have to wonder.”",
    "contextClues": "Healthy risk-taking in small doses. Worth pairing with the other lesson: that a “no” is an answer, not a challenge.",
    "opener": "“Are you thinking about shooting your shot with someone? What would the worst case look like?”",
    "category": "Relationships & Dating",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "catch feelings",
    "slug": "catch-feelings",
    "aliases": [
      "caught feelings",
      "catching feelings",
      "caught feelings for"
    ],
    "plainMeaning": "Develop real romantic feelings, often unintentionally.",
    "summary": "When a casual connection turns into genuine feelings—frequently described like catching a cold.",
    "interpretations": [
      "Falling for someone in a casual arrangement they meant to keep light.",
      "Worry that the feelings aren’t returned.",
      "Teasing a friend for getting attached."
    ],
    "example": "“We said no feelings attached and now I’ve gone and caught them.”",
    "contextClues": "The phrase often hides vulnerability—admitting feelings feels risky. If they mention catching feelings, they’re usually trusting you with something real.",
    "opener": "“How are you feeling about it—do you think they feel the same way?”",
    "category": "Relationships & Dating",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "friendzone",
    "slug": "friendzone",
    "aliases": [
      "friend zone",
      "friendzoned",
      "friend zoned",
      "in the friendzone"
    ],
    "plainMeaning": "When someone offers friendship, not romance, and the other person wanted more.",
    "summary": "Being placed permanently in the friend category by someone you’re interested in.",
    "interpretations": [
      "Disappointment that a crush sees them only as a friend.",
      "A joke about romantic bad luck.",
      "Occasionally used with resentment toward a person who owes nothing—the idea that kindness earns romance."
    ],
    "example": "“She said I’m like a brother to her. Friendzoned.”",
    "contextClues": "Usually light disappointment. If the word comes with bitterness toward the other person, it’s a chance to talk about how nobody owes anyone a relationship—and that friendship isn’t a consolation prize.",
    "opener": "“That’s a disappointing spot to be in—how are you doing about it?”",
    "category": "Relationships & Dating",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "dtr",
    "slug": "dtr",
    "aliases": [
      "define the relationship",
      "defining the relationship",
      "dtr talk",
      "what are we"
    ],
    "plainMeaning": "Define the relationship—the talk about what you are.",
    "summary": "The conversation that turns “something” into an official label—or doesn’t.",
    "interpretations": [
      "A genuine talk to clarify commitment.",
      "Anxiety around having the talk or asking “what are we?”",
      "Sometimes pressure—someone pushing for a label faster than the other wants."
    ],
    "example": "“We’ve been seeing each other two months, it’s time to dtr.”",
    "contextClues": "Usually healthy—clarity is good. If one person keeps delaying the conversation after the other asked, that limbo itself is worth talking about.",
    "opener": "“Have you two talked about what you are—do you want to?”",
    "category": "Relationships & Dating",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "fwb",
    "slug": "fwb",
    "aliases": [
      "friends with benefits",
      "friends w benefits",
      "fwb situation"
    ],
    "plainMeaning": "Friends with benefits—a friendship that includes physical intimacy without commitment.",
    "summary": "A casual physical arrangement between friends, with no relationship label.",
    "interpretations": [
      "A genuinely mutual, honest arrangement between people on the same page.",
      "One person secretly hoping it becomes a relationship—often the one who gets hurt.",
      "Mostly a term heard from older teens, shows, or music rather than a description of your child’s life."
    ],
    "example": "“They’re not dating—they’re just fwb, allegedly.”",
    "contextClues": "The phrase alone doesn’t tell you what’s happening in your child’s life. If it comes up, a calm, judgment-free conversation about respect, readiness, and protection lands better than panic—punishing honesty teaches them to hide.",
    "opener": "“That’s a term I hear—do people your age treat it casually? I’m asking to understand, not to lecture.”",
    "category": "Relationships & Dating",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "sneaky link",
    "slug": "sneaky-link",
    "aliases": [
      "sneaky linked",
      "my sneaky link",
      "sneakylink"
    ],
    "plainMeaning": "Someone you meet up with in secret—usually a casual hookup kept private.",
    "summary": "A discreet, often secretive casual connection; the secrecy is the defining feature.",
    "interpretations": [
      "A casual fling kept private to avoid gossip.",
      "Hiding the connection from friends or a partner.",
      "Meetups arranged privately with someone the family doesn’t know."
    ],
    "example": "“Nobody’s supposed to know, but she’s been seeing her sneaky link on weekends.”",
    "contextClues": "Secrecy is normal for teens protecting privacy—but it also removes safety nets. Who they’re meeting, where, and how they get home matter more than the relationship label. A calm heads-up about meeting anyone privately lands better than confrontation.",
    "opener": "“What does ‘sneaky link’ mean to your friends—is it just keeping something private?”",
    "category": "Relationships & Dating",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "side piece",
    "slug": "side-piece",
    "aliases": [
      "sidepiece",
      "side chick",
      "side dude"
    ],
    "plainMeaning": "A person someone secretly sees while in a relationship.",
    "summary": "The person involved with someone who already has a partner—cheating vocabulary from music and everyday gossip.",
    "interpretations": [
      "Gossip about someone else’s cheating.",
      "Language from song lyrics repeated casually.",
      "Sometimes a real situation someone your child knows—or they themselves—are caught in."
    ],
    "example": "“Apparently she was his side piece the whole time he was dating Alex.”",
    "contextClues": "Often just gossip or lyrics. If it touches their own life—either role—lead with steadiness: cheating drama among teens is painful, and your calm reaction determines whether they keep you informed.",
    "opener": "“That sounds like a lot of drama—how is everyone handling it?”",
    "category": "Relationships & Dating",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "love bombing",
    "slug": "love-bombing",
    "aliases": [
      "love bomb",
      "lovebomb",
      "love bombed",
      "lovebombing",
      "love bomber"
    ],
    "plainMeaning": "Overwhelming someone with attention early on, which in some cases is part of a control pattern.",
    "summary": "Intense flattery, gifts, and constant contact at the start of a relationship. Intensity on its own isn’t manipulation; the pattern worth naming pairs it with pressure, guilt, or control.",
    "interpretations": [
      "Genuine early-relationship excitement, which looks much the same from the outside.",
      "A pattern where the attention arrives with rapid escalation, pressure, guilt, isolation from friends, disregard for boundaries, or affection withdrawn the moment someone says no.",
      "Awareness language teens use to warn friends about controlling partners."
    ],
    "example": "“he was texting her nonstop for two weeks and then got mad every time she saw her friends”",
    "contextClues": "Strong feelings early on are ordinary and not proof of anything. What’s worth noticing is whether space and boundaries are respected: affection that comes with conditions, guilt over wanting time apart, or pressure to pull away from friends is the part that matters.",
    "opener": "“How do you tell the difference between someone really liking you and someone moving too fast?”",
    "category": "Relationships & Dating",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "breadcrumbing",
    "slug": "breadcrumbing",
    "aliases": [
      "breadcrumb",
      "breadcrumbed",
      "breadcrumbing me"
    ],
    "plainMeaning": "Stringing someone along with small, intermittent signals of interest.",
    "summary": "Just enough attention—a like, a “miss you” text—to keep someone interested without real commitment.",
    "interpretations": [
      "Keeping someone on the hook without intending more.",
      "Someone genuinely ambivalent, neither committing nor letting go.",
      "Teens naming a pattern they’ve noticed—or experienced."
    ],
    "example": "“He likes my stories and texts ‘miss you’ every two weeks. That’s breadcrumbing.”",
    "contextClues": "Being breadcrumbed is confusing and quietly wears down self-esteem. If your child describes this pattern, help them name it and think about what they actually want—not just how to win the person over.",
    "opener": "“How do you feel when they only show up every once in a while—does that work for you?”",
    "category": "Relationships & Dating",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "ship / otp",
    "slug": "ship",
    "aliases": [
      "ship",
      "otp",
      "shipping",
      "shipped",
      "i ship them",
      "i ship it"
    ],
    "plainMeaning": "Supporting a romantic pairing—real or fictional—with your whole heart.",
    "summary": "Fandom and friend-group language for wanting two people together; “otp” means one true pairing.",
    "interpretations": [
      "Rooting for a fictional couple in a show, book, or game.",
      "Rooting for two friends to get together.",
      "Playfully “shipping” anything—a snack combo, two teachers’ nameplates."
    ],
    "example": "“They finally got together and the entire gc ships them.”",
    "contextClues": "Almost always fun and harmless. One nuance: shipping real people can pressure actual friends—keep an eye if teasing about a pairing stops feeling fun to someone.",
    "opener": "“Who do you ship these days—any fictional couples you’re invested in?”",
    "category": "Social Media Culture",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "pick-me",
    "slug": "pick-me",
    "aliases": [
      "pick me girl",
      "pick me boy",
      "pick me behavior",
      "pickme"
    ],
    "plainMeaning": "A critical label for someone seen as putting others down to seem more appealing.",
    "summary": "The label criticizes performing against your own group to win approval, most often aimed at girls. Whether it fits a particular person is an opinion, not a fact.",
    "interpretations": [
      "Criticism of genuinely dismissive or self-deprecating behavior.",
      "A gendered insult thrown at any girl with mostly male friends.",
      "Sometimes reclaimed jokingly: “sorry for my pick me moment.”"
    ],
    "example": "“She said she only gets along with guys because girls are too much drama—pick me behavior.”",
    "contextClues": "It describes behavior some people criticize, and it’s also thrown at girls unfairly. If your child is using it—or being called it—belonging and approval are the real conversation, not the label itself.",
    "opener": "“What does someone have to do to get called that? Is it usually serious or a joke?”",
    "category": "Relationships & Dating",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "e-dating",
    "slug": "e-dating",
    "aliases": [
      "edating",
      "e-date",
      "online relationship",
      "online boyfriend",
      "online girlfriend",
      "internet boyfriend"
    ],
    "plainMeaning": "A romantic relationship conducted entirely or mostly online.",
    "summary": "Dating someone met and kept online—in games, Discord, or social apps—sometimes without ever meeting in person.",
    "interpretations": [
      "A genuine relationship with someone they met through games or shared interests.",
      "A playful “e-romance” between online friends.",
      "A relationship with someone whose age and identity are unverified."
    ],
    "example": "“My cousin’s been e-dating someone from his Discord for months and they talk every night.”",
    "contextClues": "Real feelings happen online, and these relationships can be meaningful. The calm questions that matter: how long they’ve known the person, whether they’ve verified who they are (video calls help), and whether anyone is asking for photos, money, or secrecy.",
    "opener": "“I know relationships online are normal now—if you ever date someone you met online, I’d love to hear about them sometime.”",
    "category": "Relationships & Dating",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "it’s giving",
    "slug": "its-giving",
    "aliases": [
      "it is giving",
      "it be giving"
    ],
    "plainMeaning": "It has the vibe or quality of something.",
    "summary": "A flexible compliment—or soft criticism—naming the vibe something gives off.",
    "interpretations": [
      "A compliment: “it’s giving main character.”",
      "A gentle roast: “it’s giving homework.”",
      "Left hanging—“it’s giving…”—as a playful insult inviting others to fill in the blank."
    ],
    "example": "“The new fit? It’s giving confidence.”",
    "contextClues": "What follows the phrase is the verdict. A trailing pause with a look is usually teasing; a completed sentence is usually praise.",
    "opener": "“What was it giving—was that a compliment or a roast?”",
    "category": "General slang",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "ohio",
    "slug": "ohio",
    "aliases": [
      "only in ohio",
      "down in ohio",
      "ohio final boss"
    ],
    "plainMeaning": "Bizarre, chaotic, or absurd—in a joking way.",
    "summary": "A meme that paints the state of Ohio as a place where weird, impossible things happen; now means “weird” generally.",
    "interpretations": [
      "Calling something strange or chaotic: “that’s so Ohio.”",
      "A running joke format with no real connection to the state.",
      "“Ohio final boss” describes an especially absurd person or moment."
    ],
    "example": "“The cafeteria served pizza with peas on it. Only in Ohio.”",
    "contextClues": "Almost never about actual Ohio—it’s a nonsense meme. The joke is the absurdity, not a message.",
    "opener": "“What makes something ‘Ohio’—is it just your word for weird?”",
    "category": "Social Media Culture",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "6-7",
    "slug": "6-7",
    "aliases": [
      "six seven",
      "67"
    ],
    "plainMeaning": "A deliberately meaningless viral phrase.",
    "summary": "From a song lyric; kids shout “six seven” at any mention of the numbers, often with a juggling hand gesture. It means nothing—and that’s the joke.",
    "interpretations": [
      "A reflexive joke whenever “6” and “7” appear together.",
      "A way to be silly and derail a moment on purpose.",
      "A group signal: saying it proves you’re in on the trend."
    ],
    "example": "“Turn to page sixty-seven—” “SIX SEVEN!”",
    "contextClues": "There is no hidden meaning to decode; the humor is that adults keep looking for one. It can be disruptive in class, which is the only real friction point.",
    "opener": "“Okay, I give up—is there actually a meaning, or is that the whole joke?”",
    "category": "Social Media Culture",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "no thoughts, head empty",
    "slug": "no-thoughts-head-empty",
    "aliases": [
      "head empty",
      "headempty",
      "no thoughts",
      "brain empty"
    ],
    "plainMeaning": "Thinking about nothing; blissfully blank.",
    "summary": "A self-deprecating meme about having an empty, peaceful mind—or being too tired to think.",
    "interpretations": [
      "Relaxation: nothing on the mind, and it’s nice.",
      "Overwhelm played as a joke: too much going on to form a thought.",
      "A caption for zoning out or being silly."
    ],
    "example": "“Me after finals: no thoughts, head empty, just vibes.”",
    "contextClues": "Usually lighthearted. If it comes with real exhaustion or feeling checked out often, it can be a soft way of describing burnout.",
    "opener": "“Is ‘head empty’ a good feeling right now, or more of a fried-brain feeling?”",
    "category": "Social Media Culture",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "chat, is this real",
    "slug": "chat-is-this-real",
    "aliases": [
      "is this real chat"
    ],
    "plainMeaning": "Addressing an imaginary audience, like a streamer talking to their chat.",
    "summary": "Kids narrate life as if streaming to a live audience, even when no one is watching—an ironic, self-aware joke.",
    "interpretations": [
      "Disbelief at something absurd: “chat, is this real?”",
      "Narrating an awkward moment to an invisible audience.",
      "“Chat” used as a joke stand-in for friends."
    ],
    "example": "“Teacher said no homework, then assigned three pages. Chat, is this real?”",
    "contextClues": "Pure streamer-culture irony—imitating how streamers talk to viewers. There’s no actual audience or app involved.",
    "opener": "“Do you actually watch streamers, or is talking to ‘chat’ just the joke?”",
    "category": "Gaming & Streaming",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "lock in",
    "slug": "lock-in",
    "aliases": [
      "lockin",
      "locked in",
      "locking in",
      "lock in twin"
    ],
    "plainMeaning": "Focus up and get serious.",
    "summary": "A promise to stop messing around and concentrate—on exams, a game, training, or a goal.",
    "interpretations": [
      "Genuine commitment: “I have to lock in for finals.”",
      "A joke about briefly focusing after procrastinating.",
      "Hyping up a friend before a big moment."
    ],
    "example": "“No games this weekend, I need to lock in for the SAT.”",
    "contextClues": "Usually a positive, self-motivating phrase. If it’s always said but never happens, that’s just normal teen procrastination with better branding.",
    "opener": "“What are you locking in for—anything you want a hand with?”",
    "category": "Gaming & Streaming",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "yap / yapping",
    "slug": "yap",
    "aliases": [
      "yap",
      "yapping",
      "yapper",
      "yapping away",
      "yap session"
    ],
    "plainMeaning": "Talking a lot, often about nothing important.",
    "summary": "Describes rambling conversation—sometimes affectionate, sometimes a complaint.",
    "interpretations": [
      "Affectionate: a long, fun talk with friends.",
      "A complaint that someone won’t stop talking.",
      "Self-aware: “sorry, I’m yapping.”"
    ],
    "example": "“We stayed up till 2 just yapping about nothing.”",
    "contextClues": "Between friends it’s warm. Said about someone in annoyance, it’s mild criticism—nothing deeper.",
    "opener": "“Good yap or annoying yap—who were you talking to?”",
    "category": "General slang",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "aura farming",
    "slug": "aura-farming",
    "aliases": [
      "farm aura",
      "farming aura",
      "aura farmer"
    ],
    "plainMeaning": "Doing things specifically to look cool and gain ‘aura points.’",
    "summary": "Extends the aura-points meme: deliberately acting smooth, mysterious, or impressive to build social credit.",
    "interpretations": [
      "Playful accusation that someone is performing coolness.",
      "Self-aware joke about your own dramatic behavior.",
      "Genuine admiration for someone’s effortless vibe."
    ],
    "example": "“He leaned against the wall with sunglasses indoors—bro is aura farming.”",
    "contextClues": "Almost always teasing between friends about trying too hard to look cool. Light and meme-driven.",
    "opener": "“What counts as aura farming in your group—what’s the most obvious example?”",
    "category": "Social Media Culture",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "mewing",
    "slug": "mewing",
    "aliases": [
      "mew",
      "mewing streak",
      "he’s mewing"
    ],
    "plainMeaning": "A jawline trend—pressing the tongue to the roof of the mouth, or jokingly refusing to talk.",
    "summary": "From looks-focused corners of the internet; kids joke that they “can’t talk, they’re mewing,” often with a shushing gesture.",
    "interpretations": [
      "A joke excuse to stay silent in class.",
      "Genuine interest in jawline appearance from fitness content.",
      "A meme gesture (finger to lips, then along the jaw) with no deeper meaning."
    ],
    "example": "“Asked him a question and he just did the mewing thing. Useless.”",
    "contextClues": "Mostly a silly classroom gag. If it comes with real anxiety about appearance or hours of looks-focused content, that’s the part worth a gentle conversation.",
    "opener": "“Is mewing just a joke with your friends, or do people actually care about that stuff?”",
    "category": "Social Media Culture",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "looksmaxxing",
    "slug": "looksmaxxing",
    "aliases": [
      "looksmax",
      "looksmaxx",
      "softmaxxing",
      "hardmaxxing"
    ],
    "plainMeaning": "Trying to maximize physical attractiveness.",
    "summary": "From online appearance-obsessed communities; ranges from skincare and gym to extreme measures and harsh self-rating.",
    "interpretations": [
      "Innocent self-improvement: better hair, skincare, fitness.",
      "Meme exaggeration: “I’m looksmaxxing by drinking water.”",
      "Harsh appearance-ranking culture that can feed body-image anxiety."
    ],
    "example": "“He’s been looksmaxxing all summer—new haircut, gym, the works.”",
    "contextClues": "The word alone is often a joke. Worth a calm check-in if it comes with self-criticism, rating people’s faces, or content from communities built around appearance judgment.",
    "opener": "“Does ‘looksmaxxing’ just mean skincare and gym, or does it get more intense than that?”",
    "category": "Social Media Culture",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "clanker",
    "slug": "clanker",
    "aliases": [
      "clankers",
      "dirty clanker",
      "clanka"
    ],
    "plainMeaning": "A joking insult for robots and AI.",
    "summary": "From Star Wars slang for battle droids; now a mock-slur kids direct at AI chatbots, robot vacuums, and delivery bots.",
    "interpretations": [
      "Ironic hostility toward AI: “the clanker took my job.”",
      "A joke about robot machines misbehaving.",
      "Playful roleplay of a future robot uprising."
    ],
    "example": "“The robot vacuum ate my charger cable. Stupid clanker.”",
    "contextClues": "It’s a deliberate parody of prejudice language aimed at machines rather than people—the joke is treating AI like a rival group. Because it borrows that style on purpose, how it lands depends on the group and the tone.",
    "opener": "“Is ‘clanker’ just your word for when the AI or the vacuum does something dumb?”",
    "category": "Social Media Culture",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "type shi",
    "slug": "type-shi",
    "aliases": [
      "type shii",
      "type sh*t",
      "on some type shi"
    ],
    "plainMeaning": "That kind of thing; something like that.",
    "summary": "A vague, censored way to say “that kind of stuff,” used to agree, describe, or gesture at a whole vibe.",
    "interpretations": [
      "Agreement: “type shi” = “exactly, that kind of thing.”",
      "Describing a vibe without specifics.",
      "A filler phrase that mostly signals casual approval."
    ],
    "example": "“Late-night drives, music up, windows down—type shi.”",
    "contextClues": "Intentionally vague; the censored spelling is about style and filters, not secrecy. It describes moods, not activities.",
    "opener": "“When you say ‘type shi,’ what kind of thing do you actually mean?”",
    "category": "General slang",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "deadass",
    "slug": "deadass",
    "aliases": [
      "dead ass",
      "dead serious"
    ],
    "plainMeaning": "Seriously; genuinely; “really?”",
    "summary": "New York–rooted slang for complete sincerity—as a statement or a question checking if someone’s serious.",
    "interpretations": [
      "Emphasis: “I’m deadass tired.”",
      "A question: “deadass?” = “are you serious?”",
      "Expressing disbelief at surprising news."
    ],
    "example": "“They moved the test to Friday.” “Deadass? I haven’t studied.”",
    "contextClues": "Despite the intense wording, it’s everyday emphasis. “Deadass?” as a question is usually an invitation to share the story.",
    "opener": "“Wait, what happened—you sounded genuinely surprised.”",
    "category": "General slang",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "on god",
    "slug": "on-god",
    "aliases": [
      "ong",
      "on g",
      "ong fr"
    ],
    "plainMeaning": "I swear; honestly; that’s the truth.",
    "summary": "A strong sincerity marker, like “I swear to God,” used to back up a claim or react to one.",
    "interpretations": [
      "Backing up your own statement: “on god I didn’t touch it.”",
      "Reacting with agreement: “ong that test was brutal.”",
      "Often stacked with “fr” for extra emphasis."
    ],
    "example": "“Ong I finished the project before midnight, check the timestamp.”",
    "contextClues": "Everyday emphasis, not an oath anyone takes literally. Often signals the speaker wants to be believed about something small.",
    "opener": "“Sounds like you really want to be believed—what’s the story?”",
    "category": "Abbreviations",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "sybau",
    "slug": "sybau",
    "aliases": [
      "sybau 💀",
      "sybauu"
    ],
    "plainMeaning": "A rude dismissal: “shut yo b— up.”",
    "summary": "A censored abbreviation telling someone to stop talking—used jokingly among friends or as a genuine brush-off.",
    "interpretations": [
      "Playful disbelief between close friends: “sybau, that did not happen.”",
      "A real dismissal during an argument.",
      "Meme punctuation with little bite, like a verbal eye-roll."
    ],
    "example": "“You think the remake is better? Sybau 💀”",
    "contextClues": "Tone and relationship decide everything. Between friends laughing, it’s banter; in a heated thread, it’s meant to shut someone down.",
    "opener": "“Was that joking around with friends, or was someone actually being told to stop?”",
    "category": "Abbreviations",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "pmo",
    "slug": "pmo",
    "aliases": [
      "pmo rn",
      "pmo so bad"
    ],
    "plainMeaning": "“Piss me off”—or, in other contexts, “put me on.”",
    "summary": "Two opposite meanings: annoyance (“that pmo”) or a request for a recommendation (“pmo to that song”).",
    "interpretations": [
      "Annoyance: “slow wifi pmo.”",
      "A recommendation request: “pmo to a good show.”",
      "Context fully decides which meaning is in play."
    ],
    "example": "“Pmo to that playlist you mentioned, I need new music.”",
    "contextClues": "Read the surrounding sentence: frustration words mean “annoys me”; asking for songs, shows, or intros means “recommend.” Same letters, different moods.",
    "opener": "“When you said pmo, were you annoyed or asking for a recommendation?”",
    "category": "Abbreviations",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "ts",
    "slug": "ts",
    "aliases": [
      "ts 💀",
      "ts pmo",
      "this ts"
    ],
    "plainMeaning": "Short for “this”—used to react to something with disbelief or annoyance.",
    "summary": "A clipped, stylized spelling of “this,” usually reacting to something absurd, annoying, or unbelievable.",
    "interpretations": [
      "Reaction to something ridiculous: “ts is crazy.”",
      "Often stacked: “ts pmo” = “this annoys me.”",
      "A dismissive gesture at a situation."
    ],
    "example": "“They raised the price again, ts pmo 💀”",
    "contextClues": "Almost always mild venting about everyday annoyances—prices, homework, wifi. The stack of abbreviations is style, not intensity.",
    "opener": "“What’s ‘ts’ about—what’s annoying you today?”",
    "category": "Abbreviations",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "icl",
    "slug": "icl",
    "aliases": [
      "i can’t lie",
      "icl ts",
      "icl rn"
    ],
    "plainMeaning": "I can’t lie—introducing an honest admission.",
    "summary": "A sincerity opener, like ngl, signaling the speaker is about to be real about something.",
    "interpretations": [
      "Honest opinion: “icl that movie was mid.”",
      "A small confession: “icl I’m nervous.”",
      "Softening a blunt take."
    ],
    "example": "“Icl I actually liked the song everyone’s hating on.”",
    "contextClues": "Like ngl, it often precedes the real content of the message—what follows is the part to listen to.",
    "opener": "“Appreciate the honesty—what made you want to say it straight?”",
    "category": "Abbreviations",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "unc",
    "slug": "unc",
    "aliases": [
      "unc status",
      "uncle status",
      "big unc",
      "unc vibes"
    ],
    "plainMeaning": "Jokingly calling someone old—short for “uncle.”",
    "summary": "A generational joke: anyone over about 25, or a teen who acts old, gets labeled “unc.”",
    "interpretations": [
      "Teasing someone for being older or out of touch.",
      "Self-deprecating: “I’m unc status, I go to bed at 9.”",
      "Affectionate respect for an older sibling, cousin, or coach."
    ],
    "example": "“You remember flip phones? Okay unc.”",
    "contextClues": "Almost always affectionate generational banter, though tone and relationship decide whether it lands as funny or as a jab.",
    "opener": "“So what officially makes someone unc—asking for a friend who may qualify.”",
    "category": "General slang",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "alpha / beta",
    "slug": "alpha",
    "aliases": [
      "alpha male",
      "beta male",
      "alpha energy",
      "so beta"
    ],
    "plainMeaning": "Labels for dominant versus passive behavior—usually ironic.",
    "summary": "Borrowed from outdated “pack” pseudoscience; teens mostly use it to mock the very idea of ranking people this way.",
    "interpretations": [
      "Ironic praise: “alpha move” for something confident or absurd.",
      "Mocking someone who takes the labels seriously.",
      "Occasionally sincere, picked up from manosphere content."
    ],
    "example": "“He ate the last slice without asking. Alpha behavior, honestly.”",
    "contextClues": "Usually parody. If the language shows up sincerely and often—ranking people, rigid ideas about masculinity—it’s worth a curious conversation about where those ideas come from.",
    "opener": "“Do people say ‘alpha’ as a joke, or do some actually believe in that ranking stuff?”",
    "category": "Social Media Culture",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "glazing",
    "slug": "glazing",
    "aliases": [
      "glaze",
      "glazer",
      "stop glazing"
    ],
    "plainMeaning": "Excessively praising or sucking up to someone.",
    "summary": "Calling out over-the-top compliments aimed at a creator, athlete, friend, or crush.",
    "interpretations": [
      "Teasing a friend for hyping someone too much.",
      "Criticism of fans who defend a creator no matter what.",
      "Self-aware: “I’m glazing but she really is that good.”"
    ],
    "example": "“You’ve talked about his jump shot for ten minutes—stop glazing.”",
    "contextClues": "Playful policing of enthusiasm within friend groups. It can sting if someone’s genuine admiration keeps getting mocked.",
    "opener": "“Were they actually being over the top, or does your group just tease anyone who’s a fan?”",
    "category": "Social Media Culture",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "bombastic side eye",
    "slug": "bombastic-side-eye",
    "aliases": [
      "side eye",
      "side-eyeing"
    ],
    "plainMeaning": "A dramatic, judgmental sideways look.",
    "summary": "From a viral TikTok sound; describes reacting to something questionable with theatrical silent judgment.",
    "interpretations": [
      "Reacting to a bad take or wild behavior.",
      "A meme caption for any disapproving moment.",
      "Playful judgment between friends."
    ],
    "example": "“He put milk in before the cereal. Bombastic side eye.”",
    "contextClues": "Pure meme theatrics—the exaggeration is the joke. The “judgment” is almost always about trivial things.",
    "opener": "“What earned the bombastic side eye today?”",
    "category": "Social Media Culture",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "the audacity",
    "slug": "the-audacity",
    "aliases": [
      "the audacity of",
      "audacity",
      "the nerve"
    ],
    "plainMeaning": "Shock at someone’s boldness or nerve.",
    "summary": "Calling out behavior that’s impressively or offensively bold—usually with amused outrage.",
    "interpretations": [
      "Amused disbelief at someone’s nerve.",
      "Genuine irritation at entitled behavior.",
      "A dramatic, playful exaggeration for small slights."
    ],
    "example": "“The audacity of my brother to eat my leftovers and leave the container in the fridge.”",
    "contextClues": "Usually comedic outrage about minor everyday betrayals. If it’s about a real pattern of someone taking advantage, the feeling underneath may be real.",
    "opener": "“Okay, what did they do—was it funny-bold or actually not okay?”",
    "category": "General slang",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "understood the assignment",
    "slug": "understood-the-assignment",
    "aliases": [
      "understood the assignment ✅",
      "she understood the assignment"
    ],
    "plainMeaning": "Did exactly what was needed, perfectly.",
    "summary": "Praise for someone who nailed the brief—an outfit, a performance, a gift, a reply.",
    "interpretations": [
      "Genuine praise for nailing a theme or task.",
      "Ironic praise for absurd commitment to a bit.",
      "A caption celebrating your own effort."
    ],
    "example": "“Spirit week theme was ‘decades’ and she came in full 70s. Understood the assignment.”",
    "contextClues": "Almost always celebratory. It’s one of the more wholesome phrases you’ll see—someone showed up and did well.",
    "opener": "“Who understood the assignment—what did they pull off?”",
    "category": "Social Media Culture",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "stan",
    "slug": "stan",
    "aliases": [
      "stanning",
      "stans",
      "stan account",
      "we stan"
    ],
    "plainMeaning": "To be a devoted fan of someone or something.",
    "summary": "From the Eminem song about an obsessive fan; now mostly means enthusiastic, affectionate fandom.",
    "interpretations": [
      "Enthusiastic support: “we stan a hardworking queen.”",
      "Identity: being part of an artist’s fandom.",
      "Occasionally, genuinely obsessive fan behavior—the original darker meaning."
    ],
    "example": "“I’ve stanned this band since before they were famous.”",
    "contextClues": "Overwhelmingly positive fan language. Only if fandom starts consuming money, sleep, or self-worth does it deserve a gentle conversation about balance.",
    "opener": "“Who do you stan these days—what got you into them?”",
    "category": "Social Media Culture",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "bias",
    "slug": "bias",
    "aliases": [
      "my bias",
      "bias wrecker",
      "ult bias"
    ],
    "plainMeaning": "Your favorite member of a music group, especially K-pop.",
    "summary": "Fandom shorthand for the member you love most; a “bias wrecker” is one who tempts you to switch.",
    "interpretations": [
      "Declaring a favorite: “Jimin is my bias.”",
      "“Bias wrecker”: another member threatening the ranking.",
      "“Ult bias”: the favorite above all favorites."
    ],
    "example": "“My bias wrecked me again—this is why I can’t have a stable bias.”",
    "contextClues": "Pure fandom fun with its own cheerful vocabulary. A window into what music and communities your child loves.",
    "opener": "“Who’s your bias right now, and is anyone wrecking it?”",
    "category": "Social Media Culture",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "rage bait",
    "slug": "rage-bait",
    "aliases": [
      "ragebait",
      "engagement bait",
      "it’s rage bait"
    ],
    "plainMeaning": "Content designed to make people angry so they engage with it.",
    "summary": "Posts crafted to provoke outrage, because angry comments and shares boost the algorithm.",
    "interpretations": [
      "Calling out a post as deliberately provocative.",
      "Media literacy: recognizing manipulation and refusing to engage.",
      "Accusing someone’s opinion of being insincere provocation."
    ],
    "example": "“Don’t even comment, it’s obvious rage bait.”",
    "contextClues": "Genuinely useful vocabulary—kids who call out rage bait are practicing healthy skepticism about what their feeds show them.",
    "opener": "“How can you tell when something’s rage bait? That’s a genuinely useful skill.”",
    "category": "Social Media Culture",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "copypasta",
    "slug": "copypasta",
    "aliases": [
      "copy pasta"
    ],
    "plainMeaning": "A block of text copied and pasted repeatedly as a joke.",
    "summary": "Long, absurd, or dramatic text that gets reposted across chats and comment sections until it becomes a shared joke.",
    "interpretations": [
      "A meme text everyone recognizes and reposts.",
      "Mocking overdramatic posts by reposting them verbatim.",
      "Chat spam during streams, done collectively for fun."
    ],
    "example": "“Someone pasted the whole navy seal copypasta in the Discord again.”",
    "contextClues": "Inside-joke recycling—the humor is recognition, not content. Some copypastas are crude, but the format itself is just internet folklore.",
    "opener": "“What’s the copypasta about—is it one of those texts everyone just knows?”",
    "category": "Gaming & Streaming",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "kekw",
    "slug": "kekw",
    "aliases": [
      "kek",
      "kekw emote",
      "kekw moment"
    ],
    "plainMeaning": "Laughing hard—a Twitch emote for big laughter.",
    "summary": "Stream-chat shorthand for “that’s hilarious,” sometimes with a mocking edge when it’s aimed at someone’s mistake.",
    "interpretations": [
      "Something is very funny—roughly “lol” in stream chat.",
      "Laughing at a fail, which can feel mocking to the person involved.",
      "Said out loud as a joke, even by people who don’t watch streams."
    ],
    "example": "“he missed the easiest shot in the game kekw”",
    "contextClues": "Twitch emote culture, and usually just laughter. Pointed repeatedly at one person’s mistakes, it shades into teasing.",
    "opener": "“Is ‘kekw’ just the chat way of saying that’s funny?”",
    "category": "Gaming & Streaming",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "pog",
    "slug": "pog",
    "aliases": [
      "poggers",
      "pogchamp",
      "pog moment",
      "pogged"
    ],
    "plainMeaning": "Excitement or approval—something impressive just happened.",
    "summary": "Stream vocabulary for hype: a great play, good news, or anything worth cheering about.",
    "interpretations": [
      "Hype at an impressive moment: “that clutch was pog.”",
      "General approval, close to “awesome” or “let’s go.”",
      "Ironic hype about something completely mundane."
    ],
    "example": "“new update drops tonight, pog”",
    "contextClues": "Borrowed from the PogChamp emote and almost always straightforward excitement. No hidden meaning.",
    "opener": "“What makes something ‘pog’—anything impressive?”",
    "category": "Gaming & Streaming",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "goofy ahh",
    "slug": "goofy-ahh",
    "aliases": [
      "goofy ahh beat",
      "goofy ahh sound",
      "goofyahh"
    ],
    "plainMeaning": "Ridiculous, silly, or absurd—censored spelling of “goofy ass.”",
    "summary": "A meme intensifier for anything bizarre, usually paired with a strange image or sound.",
    "interpretations": [
      "Describing something hilariously weird.",
      "A caption format: “goofy ahh haircut.”",
      "Affectionate mockery of a friend’s behavior."
    ],
    "example": "“Why did the school bell make that goofy ahh sound today.”",
    "contextClues": "The misspelling is stylistic, not secretive. It’s commentary on absurdity—one of the milder intensifiers in circulation.",
    "opener": "“What was so goofy—what happened?”",
    "category": "Social Media Culture",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "bozo",
    "slug": "bozo",
    "aliases": [
      "bozo behavior",
      "certified bozo",
      "🤡"
    ],
    "plainMeaning": "A clown; someone who did something foolish.",
    "summary": "Calling someone a fool for a bad take, a mistake, or embarrassing behavior—often with the clown emoji.",
    "interpretations": [
      "Mocking a bad opinion: “ratio bozo.”",
      "Teasing a friend for a silly mistake.",
      "Self-deprecating: “I’m a bozo, I forgot my own password.”"
    ],
    "example": "“He trash-talked all week and then lost 5-0. Certified bozo.”",
    "contextClues": "Standard banter vocabulary. Aimed repeatedly at one person by a group, it can shade into pile-on mockery—worth noticing who it’s aimed at and how they take it.",
    "opener": "“Was that friends clowning each other, or is one person getting it from everyone?”",
    "category": "Gaming & Streaming",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "griddy",
    "slug": "griddy",
    "aliases": [
      "hit the griddy",
      "doing the griddy",
      "the griddy"
    ],
    "plainMeaning": "A viral celebration dance.",
    "summary": "A hopping dance with swinging arms that spread from sports celebrations to TikTok; “hitting the griddy” means doing it.",
    "interpretations": [
      "Celebrating a win, big or small.",
      "Doing the dance ironically at an awkward moment.",
      "A group dare or party moment."
    ],
    "example": "“He hit the griddy in the hallway after the test scores posted.”",
    "contextClues": "Entirely wholesome celebration culture. The only risk is someone filming it in an inappropriate place.",
    "opener": "“What was the griddy celebrating?”",
    "category": "Social Media Culture",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "twin",
    "slug": "twin",
    "aliases": [
      "twin 🤝",
      "my twin",
      "twins"
    ],
    "plainMeaning": "Close friend; someone who agrees or is just like you.",
    "summary": "A warm term for a best friend or anyone who shares your exact opinion—“same brain.”",
    "interpretations": [
      "A best friend: “me and my twin.”",
      "Agreement: “twin 🤝” = “exactly, same.”",
      "Someone who dressed alike or had the same idea."
    ],
    "example": "“You brought snacks too? Twin 🤝”",
    "contextClues": "Affectionate belonging language. Hearing your child call someone “twin” is hearing about a friendship that matters to them.",
    "opener": "“Who’s your twin these days—what makes you two the same?”",
    "category": "General slang",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "finna",
    "slug": "finna",
    "aliases": [
      "finna go",
      "im finna",
      "fixing to"
    ],
    "plainMeaning": "About to; going to.",
    "summary": "From “fixing to,” a casual way to announce an immediate intention.",
    "interpretations": [
      "Announcing a plan: “finna head out.”",
      "A soft warning: “I’m finna lose it” is usually hyperbole.",
      "Everyday filler in casual narration."
    ],
    "example": "“I’m finna sleep, this week was long.”",
    "contextClues": "Completely ordinary planning language. Even “finna crash out” style exaggerations are usually dramatic venting—tone and follow-through are what matter.",
    "opener": "“What are you finna do—anything fun this weekend?”",
    "category": "General slang",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "valid",
    "slug": "valid",
    "aliases": [
      "so valid",
      "valid af",
      "that’s valid"
    ],
    "plainMeaning": "Fair; reasonable; understandable.",
    "summary": "Affirming that someone’s feeling, opinion, or choice makes sense.",
    "interpretations": [
      "Genuine validation: “you’re upset and that’s valid.”",
      "Agreement with an opinion or taste.",
      "A warm, supportive response in friend groups."
    ],
    "example": "“You don’t want to go? That’s valid, it’s been a long week.”",
    "contextClues": "One of the kindest words in the current vocabulary—it’s how teens tell each other their feelings are legitimate.",
    "opener": "“What were you validating—was someone going through something?”",
    "category": "General slang",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "cracked",
    "slug": "cracked",
    "aliases": [
      "cracked at the game",
      "he’s cracked",
      "shes cracked",
      "absolutely cracked"
    ],
    "plainMeaning": "Exceptionally skilled at a game.",
    "summary": "Enthusiastic praise for a player whose speed, aim, or decisions stand out.",
    "interpretations": [
      "A genuine compliment about strong play.",
      "Exaggerated praise after one impressive moment.",
      "Sometimes used jokingly for an oddly specific real-life skill."
    ],
    "example": "“She won that whole fight alone—she’s actually cracked.”",
    "contextClues": "Nearly always positive. In gaming, it describes skill rather than anything being broken or drug-related.",
    "opener": "“What did they do that was so impressive?”",
    "category": "Gaming & Streaming",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "carry",
    "slug": "carry",
    "aliases": [
      "carried",
      "carrying",
      "hard carry",
      "got carried",
      "team carry"
    ],
    "plainMeaning": "Do most of the work that helps a team win.",
    "summary": "A strong player can “carry” teammates through a difficult match.",
    "interpretations": [
      "Praise for the player who made the biggest contribution.",
      "Self-deprecating thanks: “you carried me.”",
      "A put-down if someone says a teammate only won because others carried them."
    ],
    "example": "“I barely survived that round—you completely carried us.”",
    "contextClues": "Often appreciative team talk. During an argument, “you got carried” can dismiss someone’s contribution.",
    "opener": "“Was ‘carry’ meant as thanks, or were teammates arguing about who did the work?”",
    "category": "Gaming & Streaming",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "diff",
    "slug": "diff",
    "aliases": [
      "team diff",
      "teamdiff",
      "skill diff",
      "skilldiff",
      "player diff",
      "playerdiff",
      "huge diff",
      "gap",
      "gapped"
    ],
    "plainMeaning": "A difference in skill or performance decided the match.",
    "summary": "Short for “difference,” often naming the role or player seen as the reason one team won.",
    "interpretations": [
      "Matter-of-fact comparison between teams.",
      "Praise for a standout player.",
      "Blame or taunting when aimed at the losing player."
    ],
    "example": "“That last round was a healer diff—their support kept everyone alive.”",
    "contextClues": "Common competitive shorthand, not automatically bullying. Repeatedly blaming one teammate with “diff” can become unfair pile-on behavior.",
    "opener": "“Was everyone analyzing the match, or did one player end up taking all the blame?”",
    "category": "Gaming & Streaming",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "throw / throwing",
    "slug": "throw",
    "aliases": [
      "throwing",
      "threw the game",
      "game throw",
      "thrower",
      "inting",
      "intentional feeding"
    ],
    "plainMeaning": "Make mistakes that cost the team the game—sometimes deliberately.",
    "summary": "Players say someone is “throwing” when their choices turn a likely win into a loss.",
    "interpretations": [
      "An accidental mistake under pressure.",
      "A frustrated exaggeration about ordinary bad play.",
      "Deliberately sabotaging a match, sometimes called “inting.”"
    ],
    "example": "“We had the lead, then we all rushed in alone and threw.”",
    "contextClues": "Most uses are ordinary post-game frustration. Claims of deliberate sabotage need more evidence than one teammate playing badly.",
    "opener": "“Did someone make a mistake, or do you think they were actually trying to ruin the match?”",
    "category": "Gaming & Streaming",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "stomp",
    "slug": "stomp",
    "aliases": [
      "stomped",
      "got stomped",
      "stomping",
      "steamroll",
      "steamrolled"
    ],
    "plainMeaning": "Win very easily and by a wide margin.",
    "summary": "Describes a one-sided match where one team overwhelms the other.",
    "interpretations": [
      "A decisive competitive win.",
      "Frustration about an uneven matchup.",
      "Light boasting after a strong team performance."
    ],
    "example": "“That lobby was rough—we got stomped in five minutes.”",
    "contextClues": "Normal competition language. It describes the score or pace, not physical violence.",
    "opener": "“Was the match uneven, or did the other team just have a great round?”",
    "category": "Gaming & Streaming",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "ranked",
    "slug": "ranked",
    "aliases": [
      "ranked mode",
      "ranked queue",
      "competitive mode",
      "comp",
      "climbing ranked",
      "rank grind"
    ],
    "plainMeaning": "A competitive mode where results affect a player’s rating.",
    "summary": "Ranked play usually feels more serious because wins and losses change a visible rank.",
    "interpretations": [
      "A standard competitive playlist.",
      "Working toward a higher rank over time.",
      "A source of pressure or frustration when identity gets tied too closely to results."
    ],
    "example": "“I’m playing ranked with Maya tonight—we’re one win from moving up.”",
    "contextClues": "Ordinary game structure. If losses repeatedly affect sleep, mood, or friendships, the useful conversation is about balance rather than the word itself.",
    "opener": "“Is ranked fun for you right now, or has the climb started feeling stressful?”",
    "category": "Gaming & Streaming",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "queue / solo queue",
    "slug": "queue",
    "aliases": [
      "queue",
      "queued",
      "queuing",
      "solo queue",
      "soloqueue",
      "duo queue",
      "duoqueue",
      "q up",
      "queue up",
      "queueup"
    ],
    "plainMeaning": "Wait to be placed into a match, alone or with others.",
    "summary": "The queue is the matchmaking line; “solo queue” means entering without a pre-made team.",
    "interpretations": [
      "Waiting for the next match.",
      "Playing alone with assigned teammates.",
      "Inviting friends to join: “queue up.”"
    ],
    "example": "“Queue up after dinner—I need one more for the team.”",
    "contextClues": "Routine multiplayer vocabulary. “Solo queue is awful” usually means frustration with unfamiliar teammates.",
    "opener": "“Are you queuing with friends tonight or getting matched with new teammates?”",
    "category": "Gaming & Streaming",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "stack / five-stack",
    "slug": "stack",
    "aliases": [
      "stacked team",
      "five stack",
      "5 stack",
      "full stack",
      "three stack",
      "four stack",
      "premade"
    ],
    "plainMeaning": "A coordinated group of friends entering a match together.",
    "summary": "A “stack” is a pre-arranged team rather than players matched together at random.",
    "interpretations": [
      "A friend group playing as one team.",
      "A coordinated team with an advantage over strangers.",
      "“Stacked” can also mean a team has unusually strong players."
    ],
    "example": "“We finally have a five-stack, so nobody has to solo queue.”",
    "contextClues": "Usually positive social play. The number tells how many friends are grouped together.",
    "opener": "“Who’s in your stack—friends from school or people you met through the game?”",
    "category": "Gaming & Streaming",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "randoms",
    "slug": "randoms",
    "aliases": [
      "randos",
      "random teammates",
      "random fills"
    ],
    "plainMeaning": "Players assigned as teammates who are not part of your friend group.",
    "summary": "A neutral or mildly frustrated name for unfamiliar teammates supplied by matchmaking.",
    "interpretations": [
      "Simply distinguishing strangers from friends.",
      "Complaining about poor coordination with unfamiliar teammates.",
      "Occasionally dismissive language that forgets those players are people too."
    ],
    "example": "“We only had three online, so the game gave us two randoms.”",
    "contextClues": "Usually practical shorthand. Insults directed at “randoms” can reflect match frustration, but the word itself is ordinary.",
    "opener": "“Did the random teammates communicate well, or was it hard to coordinate?”",
    "category": "Gaming & Streaming",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "sbmm",
    "slug": "sbmm",
    "aliases": [
      "skill based matchmaking",
      "skillbasedmatchmaking",
      "matchmaking rating",
      "mmr",
      "elo",
      "hidden mmr"
    ],
    "plainMeaning": "A system that matches players with others near their skill level.",
    "summary": "Players discuss SBMM when matches feel unusually difficult, easy, or inconsistent.",
    "interpretations": [
      "A real matchmaking system based on performance.",
      "A theory about why a game session feels harder.",
      "“Elo” or “MMR” may refer to the rating the system uses."
    ],
    "example": "“My SBMM must have gone up because every lobby tonight is intense.”",
    "contextClues": "Normal discussion about how games build matches. Players may blame it when frustrated even without knowing the exact system.",
    "opener": "“Does the matchmaking feel fair lately, or are the games swinging between too easy and too hard?”",
    "category": "Gaming & Streaming",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "smurf",
    "slug": "smurf",
    "aliases": [
      "smurfing",
      "smurf account",
      "smurfed",
      "low rank alt"
    ],
    "plainMeaning": "A skilled player using a lower-ranked account.",
    "summary": "Smurfing lets an experienced player enter matches intended for newer or less-skilled players.",
    "interpretations": [
      "Playing casually with lower-ranked friends.",
      "Seeking easier matches or faster wins.",
      "Evading a restriction or ban, which may violate game rules."
    ],
    "example": "“That new account is dropping huge scores—everyone thinks it’s a smurf.”",
    "contextClues": "Often a fairness complaint, not proof of cheating. Concern rises if someone is evading bans, buying accounts, or asking for login details.",
    "opener": "“What made everyone think that account belonged to a more experienced player?”",
    "category": "Gaming & Streaming",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "afk",
    "slug": "afk",
    "aliases": [
      "away from keyboard",
      "a f k",
      "brb afk",
      "went afk",
      "afk player"
    ],
    "plainMeaning": "Temporarily away and not actively playing.",
    "summary": "A quick notice that someone stepped away from their keyboard or controller.",
    "interpretations": [
      "A short bathroom, food, or family break.",
      "A player disconnected or stopped responding.",
      "A complaint that a teammate abandoned the match."
    ],
    "example": "“AFK two minutes—my food just got here.”",
    "contextClues": "Routine status language across games and Discord. It does not imply secrecy or a problem by itself.",
    "opener": "“Were they just taking a quick break, or did someone leave in the middle of the match?”",
    "category": "Gaming & Streaming",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "glhf",
    "slug": "glhf",
    "aliases": [
      "gl hf",
      "good luck have fun"
    ],
    "plainMeaning": "Good luck, have fun.",
    "summary": "A friendly message exchanged at the start of a match.",
    "interpretations": [
      "Genuine sportsmanship.",
      "A routine greeting with no deeper meaning.",
      "Occasionally sarcastic, though usually still mild."
    ],
    "example": "“Glhf everyone—first match of the tournament.”",
    "contextClues": "One of gaming’s friendliest standard phrases. Tone only changes it when paired with obvious taunting.",
    "opener": "“Do people in your matches usually start out friendly like that?”",
    "category": "Gaming & Streaming",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "lag / ping",
    "slug": "lag",
    "aliases": [
      "lag",
      "lagging",
      "laggy",
      "high ping",
      "ping spike",
      "latency",
      "rubberbanding"
    ],
    "plainMeaning": "A delayed or unstable connection affecting the game.",
    "summary": "Lag makes actions arrive late; ping is a common measurement of that delay.",
    "interpretations": [
      "A genuine internet or server problem.",
      "A reason movement looks jumpy or delayed.",
      "A joking excuse after losing a fight."
    ],
    "example": "“My ping spiked and I lagged right off the map.”",
    "contextClues": "Technical gaming language. Sometimes it is a real connection issue; sometimes friends say “lag” to laugh off a mistake.",
    "opener": "“Was the connection actually acting up, or was ‘lag’ the group’s excuse for that round?”",
    "category": "Gaming & Streaming",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "rng",
    "slug": "rng",
    "aliases": [
      "random number generator",
      "rngesus",
      "bad rng",
      "good rng",
      "rng luck"
    ],
    "plainMeaning": "Random luck built into a game.",
    "summary": "RNG decides unpredictable outcomes such as item drops, card draws, or damage rolls.",
    "interpretations": [
      "Good or bad luck during play.",
      "A complaint that chance mattered more than skill.",
      "“RNGesus” humorously personifies luck."
    ],
    "example": "“I’ve opened twenty chests and still no drop—my RNG is cursed.”",
    "contextClues": "Ordinary mechanics talk. In games with paid random items, repeated spending is a separate issue from simply discussing RNG.",
    "opener": "“What outcome were you hoping the RNG would give you?”",
    "category": "Gaming & Streaming",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "buff / nerf",
    "slug": "buff",
    "aliases": [
      "buff",
      "buffed",
      "buffing",
      "nerf",
      "nerfed",
      "nerfing",
      "needs a nerf"
    ],
    "plainMeaning": "Make something stronger or weaker through a game update.",
    "summary": "Developers buff underperforming characters or items and nerf ones considered too powerful.",
    "interpretations": [
      "An official balance change.",
      "A player’s request for a future update.",
      "A joking comparison when something changes outside gaming."
    ],
    "example": "“They nerfed my favorite character, but the new ability got a small buff.”",
    "contextClues": "Standard balance vocabulary with no safety implication. Complaints are part of how communities debate game updates.",
    "opener": "“Did the update make your favorite character feel different?”",
    "category": "Gaming & Streaming",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "meta",
    "slug": "meta",
    "aliases": [
      "the meta",
      "current meta",
      "meta pick",
      "off meta",
      "metagame",
      "metagaming"
    ],
    "plainMeaning": "The strategies currently considered most effective.",
    "summary": "The “meta” is the community’s shared idea of which characters, items, or tactics work best right now.",
    "interpretations": [
      "Popular high-performing strategies.",
      "A competitive trend shaped by updates and tournaments.",
      "“Off-meta” means choosing something unusual but potentially viable."
    ],
    "example": "“That character isn’t meta, but I still win more when I play them.”",
    "contextClues": "Normal strategy discussion. Following the meta can be serious competition or simply part of learning a game.",
    "opener": "“What’s considered meta right now, and do you enjoy playing that way?”",
    "category": "Gaming & Streaming",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "grind",
    "slug": "grind",
    "aliases": [
      "grinding",
      "the grind",
      "grindset",
      "grinding levels",
      "xp grind",
      "grindy"
    ],
    "plainMeaning": "Repeat activities to make gradual progress.",
    "summary": "Grinding earns levels, rank, currency, or items through sustained play.",
    "interpretations": [
      "Patiently working toward an in-game goal.",
      "A repetitive task that feels tedious.",
      "Long play sessions that may need balance if they crowd out sleep or responsibilities."
    ],
    "example": "“I’m grinding quests tonight so I can unlock the new character.”",
    "contextClues": "Usually ordinary goal-setting inside a game. Duration and impact matter more than the word itself.",
    "opener": "“What are you working toward, and about how long does the grind take?”",
    "category": "Gaming & Streaming",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "loot / loot box",
    "slug": "loot",
    "aliases": [
      "loot",
      "looting",
      "loot box",
      "lootbox",
      "loot boxes",
      "lootboxes",
      "rare drop",
      "legendary drop"
    ],
    "plainMeaning": "Items or rewards found, earned, or randomly received in a game.",
    "summary": "Loot can be ordinary equipment picked up during play; loot boxes are randomized reward containers.",
    "interpretations": [
      "Free items collected during gameplay.",
      "A rare reward from an enemy or event.",
      "A paid random box, which can resemble gambling mechanics."
    ],
    "example": "“I got a rare drop from the boss, but I’m not buying loot boxes.”",
    "contextClues": "“Loot” alone is routine. If real money buys randomized chances, a calm check-in about spending and odds is useful.",
    "opener": "“Is that loot earned by playing, or does the game ask you to pay for a chance at it?”",
    "category": "Gaming & Streaming",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "pay-to-win",
    "slug": "pay-to-win",
    "aliases": [
      "p2w",
      "pay2win",
      "wallet warrior"
    ],
    "plainMeaning": "A game where spending money can create a competitive advantage.",
    "summary": "Players use this critically when purchases affect winning rather than only appearance.",
    "interpretations": [
      "Buying stronger items, characters, or faster progression.",
      "A complaint that free players face an unfair disadvantage.",
      "Sometimes exaggerated when any optional purchase exists."
    ],
    "example": "“The new upgrade doubles your stats, so everyone’s calling the update pay-to-win.”",
    "contextClues": "Usually consumer criticism, not evidence your child spent money. Check whether the game merely offers purchases or whether spending is actually happening.",
    "opener": "“What can people buy, and does it really change who has the advantage?”",
    "category": "Gaming & Streaming",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "microtransactions",
    "slug": "microtransactions",
    "aliases": [
      "microtransaction",
      "in game purchase",
      "iap",
      "mtx",
      "buying currency"
    ],
    "plainMeaning": "Small purchases made inside a game.",
    "summary": "These purchases may include virtual currency, convenience, cosmetics, or randomized rewards.",
    "interpretations": [
      "An optional cosmetic purchase.",
      "Repeated small charges that add up.",
      "Pressure from limited-time offers or game progression."
    ],
    "example": "“The game is free, but it has microtransactions for outfits and extra slots.”",
    "contextClues": "The term is neutral. A check-in helps when purchases are hidden, unauthorized, pressured, or difficult to track.",
    "opener": "“Are the purchases just optional extras, and do you have a spending limit that feels clear?”",
    "category": "Gaming & Streaming",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "skins / cosmetics",
    "slug": "skins",
    "aliases": [
      "skin",
      "skins",
      "cosmetic",
      "cosmetics",
      "weapon skin",
      "character skin"
    ],
    "plainMeaning": "Visual items that change how something looks in a game.",
    "summary": "Skins and cosmetics usually personalize a character or item without changing gameplay power.",
    "interpretations": [
      "A favorite outfit, animation, or visual theme.",
      "A collectible or status symbol in a gaming community.",
      "A purchasable item that can create social pressure even without gameplay benefits."
    ],
    "example": "“That skin looks cool, but I’m waiting to see if it comes back for free.”",
    "contextClues": "Ordinary personalization. The useful distinction is between enjoying cosmetics and feeling pressured to spend or keep up.",
    "opener": "“Is that skin just one you like, or does it feel like everyone expects you to have it?”",
    "category": "Gaming & Streaming",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "raid",
    "slug": "raid",
    "aliases": [
      "stream raid",
      "raiding",
      "raided the stream",
      "twitch raid",
      "raid incoming"
    ],
    "plainMeaning": "Send one streamer’s viewers to another channel together.",
    "summary": "A raid is often a supportive handoff that helps another creator gain viewers and community attention.",
    "interpretations": [
      "A friendly welcome from one stream community to another.",
      "A creator introducing viewers to someone new.",
      "Rarely, a coordinated disruptive arrival rather than a supportive Twitch-style raid."
    ],
    "example": "“We ended the stream by raiding a smaller art channel.”",
    "contextClues": "On Twitch, raids are usually positive and built into the platform. Harassing arrivals will include spam, threats, or targeted disruption—not just the word “raid.”",
    "opener": "“Was it a friendly stream raid, and what kind of creator did everyone visit?”",
    "category": "Gaming & Streaming",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "lurk / lurker",
    "slug": "lurk",
    "aliases": [
      "lurk",
      "lurking",
      "lurker",
      "going to lurk",
      "just lurking"
    ],
    "plainMeaning": "Watch or listen without actively chatting.",
    "summary": "Many viewers quietly keep a stream or Discord conversation open while doing something else.",
    "interpretations": [
      "A silent but supportive stream viewer.",
      "Reading a community without posting.",
      "Taking a break from active chat while staying present."
    ],
    "example": "“Homework time, but I’ll lurk in the stream.”",
    "contextClues": "Normal and often welcomed online behavior. In this context, “lurker” does not automatically mean stalking or spying.",
    "opener": "“Do you like listening to streams in the background while you do other things?”",
    "category": "Gaming & Streaming",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "mod / moderator",
    "slug": "mod",
    "aliases": [
      "mod",
      "mods",
      "moderator",
      "chat mod",
      "server mod",
      "mod team"
    ],
    "plainMeaning": "A trusted person who helps manage a chat or community.",
    "summary": "Moderators enforce rules, remove disruptive messages, and help keep streams or servers usable.",
    "interpretations": [
      "A volunteer or staff community moderator.",
      "Someone with tools to time out, mute, or ban users.",
      "In another gaming context, “mod” can mean a fan-made modification to a game."
    ],
    "example": "“Tag a mod—the chat keeps getting spammed.”",
    "contextClues": "Usually a routine safety and organization role. Genuine moderators should not need passwords, payments, or private personal details to help.",
    "opener": "“Is that a chat moderator or a game modification—and do you know what permissions they have?”",
    "category": "Gaming & Streaming",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "sub / gifted sub",
    "slug": "sub",
    "aliases": [
      "subbed",
      "subscriber",
      "gifted sub",
      "gift subs",
      "gifting subs",
      "tier one sub",
      "prime sub"
    ],
    "plainMeaning": "A paid or gifted subscription that supports a streamer.",
    "summary": "Subscriptions can unlock emotes or chat perks; a gifted sub is paid for by another viewer.",
    "interpretations": [
      "Choosing to financially support a creator.",
      "Receiving temporary channel perks as a gift.",
      "A community celebration when many subscriptions are gifted at once."
    ],
    "example": "“Someone gifted five subs, and one landed on my account.”",
    "contextClues": "Common streaming economy language. Receiving a platform gift does not create an obligation to contact or repay the giver.",
    "opener": "“Was the sub gifted randomly through the platform, or did someone ask for anything in return?”",
    "category": "Gaming & Streaming",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "emote",
    "slug": "emote",
    "aliases": [
      "emotes",
      "twitch emote",
      "channel emote",
      "custom emote",
      "animated emote"
    ],
    "plainMeaning": "A small reaction image or animation used in game and stream chats.",
    "summary": "Emotes work like community-specific emoji, often carrying an inside joke or creator reference.",
    "interpretations": [
      "A visual reaction such as laughter, hype, or disbelief.",
      "A subscriber perk in a creator’s channel.",
      "An in-game character animation or dance."
    ],
    "example": "“Chat filled the screen with the hype emote after the win.”",
    "contextClues": "Ordinary community shorthand. The image and surrounding conversation explain the meaning better than its name alone.",
    "opener": "“What does that emote mean in this community?”",
    "category": "Gaming & Streaming",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "backseat gaming",
    "slug": "backseat-gaming",
    "aliases": [
      "backseating",
      "backseatgaming",
      "backseat gamer",
      "no backseating",
      "backseat driver"
    ],
    "plainMeaning": "Tell someone how to play when they did not ask for help.",
    "summary": "Viewers or friends give instructions, hints, or criticism from the sidelines.",
    "interpretations": [
      "Well-meant advice that was not requested.",
      "Spoiling solutions or taking over someone’s experience.",
      "Requested coaching, which is different if the player welcomes it."
    ],
    "example": "“No backseating, please—I want to solve the puzzle myself.”",
    "contextClues": "Usually a boundary about enjoying a game independently. Ignoring a clear “no backseating” request is disrespectful, though not automatically a larger safety issue.",
    "opener": "“Did you want help, or were people not respecting how you wanted to play?”",
    "category": "Gaming & Streaming",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "griefing",
    "slug": "griefing",
    "aliases": [
      "griefer",
      "griefed",
      "griefing teammates",
      "team griefing",
      "trolling the lobby"
    ],
    "plainMeaning": "Deliberately disrupt other players’ experience.",
    "summary": "Griefers may sabotage teammates, block progress, or repeatedly provoke people for a reaction.",
    "interpretations": [
      "A one-off prank everyone finds funny.",
      "Deliberate match sabotage that violates game rules.",
      "Repeated targeted disruption that can become harassment."
    ],
    "example": "“He kept blocking our path on purpose, so the team reported him for griefing.”",
    "contextClues": "Minor trolling and targeted harassment are not the same. Look for repetition, threats, singling someone out, or continuing after they ask it to stop.",
    "opener": "“Was it a brief joke, or did someone keep targeting the same player after it stopped being fun?”",
    "category": "Gaming & Streaming",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "stream sniping",
    "slug": "stream-sniping",
    "aliases": [
      "stream snipe",
      "streamsniping",
      "stream sniper",
      "sniping the stream",
      "ghosting the streamer"
    ],
    "plainMeaning": "Use someone’s live stream to gain an unfair advantage or find them in-game.",
    "summary": "A viewer watches a live broadcast to learn the streamer’s location, plan, or private match information.",
    "interpretations": [
      "Cheating by using live information during a match.",
      "Trying to enter the same game to get on stream.",
      "Targeted disruption if someone repeatedly follows or harasses the creator."
    ],
    "example": "“They knew our location every round, so chat thinks someone was stream sniping.”",
    "contextClues": "Often a fair-play accusation, not proof by itself. Repeated following, threats, or attempts to expose real-world location move it into a genuine safety concern.",
    "opener": "“Did it seem like unfair gameplay, or was someone repeatedly following the streamer beyond the match?”",
    "category": "Gaming & Streaming",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "hacker / cheating",
    "slug": "hacker",
    "aliases": [
      "hacker",
      "hacking",
      "cheater",
      "cheating",
      "hacks",
      "aimbot",
      "wallhacks"
    ],
    "plainMeaning": "Using prohibited tools or exploits to gain an unfair advantage—or being accused of it.",
    "summary": "Players often say “hacker” when someone performs suspiciously well, even when there is no proof.",
    "interpretations": [
      "A genuine cheating accusation involving unauthorized software.",
      "A frustrated compliment for an unusually skilled player.",
      "An excuse after losing to someone whose play was hard to understand."
    ],
    "example": "“That shot looked impossible, but a weird replay isn’t enough to call them a hacker.”",
    "contextClues": "The word alone does not prove account compromise or criminal hacking. Evidence, platform reports, and whether anyone is requesting downloads or login details matter.",
    "opener": "“What looked suspicious, and did you use the game’s reporting tools rather than engaging with them?”",
    "category": "Gaming & Streaming",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "toxic",
    "slug": "toxic",
    "aliases": [
      "toxic player",
      "toxic lobby",
      "toxicity",
      "being toxic",
      "toxic chat"
    ],
    "plainMeaning": "Hostile, insulting, or unpleasant behavior in a game community.",
    "summary": "Players call chat or teammates toxic when competition turns into insults, blame, or repeated negativity.",
    "interpretations": [
      "Routine trash talk that everyone accepts.",
      "Persistent insults or blaming that makes play unpleasant.",
      "Targeted harassment involving identity, threats, or repeated contact."
    ],
    "example": "“I muted the lobby because the chat got toxic after we lost.”",
    "contextClues": "Not every competitive comment is harassment. Concern rises with slurs, threats, coordinated targeting, or behavior that continues across matches or platforms.",
    "opener": "“Was it ordinary trash talk, or did anything feel targeted or hard to get away from?”",
    "category": "Gaming & Streaming",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "report / ban",
    "slug": "report",
    "aliases": [
      "reported",
      "report them",
      "banned",
      "ban",
      "permaban",
      "perma banned",
      "timeout",
      "timed out"
    ],
    "plainMeaning": "Flag behavior for review or restrict someone from a game or community.",
    "summary": "Reports ask moderators or game systems to review conduct; bans and timeouts limit access.",
    "interpretations": [
      "Using built-in tools after cheating, spam, or harassment.",
      "A temporary chat timeout for breaking rules.",
      "An exaggerated threat after an ordinary disagreement."
    ],
    "example": "“Don’t argue with them—mute, report, and let the mods review it.”",
    "contextClues": "Reporting is a normal safety tool, not proof the reported person did something wrong. False or mass reporting can itself be abusive.",
    "opener": "“What happened before the report, and did the platform give you the tools you needed?”",
    "category": "Gaming & Streaming",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "trade scam",
    "slug": "trade-scam",
    "aliases": [
      "tradescam",
      "trading scam",
      "item scam",
      "skin scam",
      "trust trade",
      "dupe scam",
      "free items link",
      "trade link"
    ],
    "plainMeaning": "A trick designed to steal virtual items, currency, or an account.",
    "summary": "Scammers may promise rare items, fake giveaways, favorable trades, or account help to get clicks, codes, or login access.",
    "interpretations": [
      "A deliberately unfair in-game trade.",
      "A phishing link disguised as a giveaway or item offer.",
      "A “trust trade” asking someone to hand over an item first with a promise to return more."
    ],
    "example": "“They offered a free skin through a link, but the server warned it was a trade scam.”",
    "contextClues": "Real concern signs include off-platform links, urgency, requests for passwords or verification codes, and pressure to keep the deal secret. Ordinary player-to-player trading is not automatically unsafe.",
    "opener": "“Did anyone ask you to click a link, share a code, or send an item first?”",
    "category": "Gaming & Streaming",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "face with tears of joy emoji (😂)",
    "slug": "face-with-tears-of-joy-emoji",
    "aliases": [
      "😂",
      "tears of joy emoji",
      "laughing crying emoji",
      "cry laugh",
      "crying laughing"
    ],
    "plainMeaning": "That is very funny.",
    "summary": "A familiar laughter reaction that can be sincere, exaggerated, or lightly teasing.",
    "interpretations": [
      "Genuine laughter at a joke or story.",
      "A friendly way to soften teasing.",
      "Sometimes used ironically when something is awkward rather than funny."
    ],
    "example": "“You joined the call while still muted 😂”",
    "contextClues": "After a shared joke it usually means warm laughter. In an argument, repeated laughing emojis can feel dismissive or mocking.",
    "opener": "“Was that genuinely funny, or were they being a little sarcastic?”",
    "category": "Emojis & Symbols",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "rolling on the floor laughing emoji (🤣)",
    "slug": "rolling-on-the-floor-laughing-emoji",
    "aliases": [
      "🤣",
      "rofl emoji",
      "rolling laughing emoji",
      "floor laughing",
      "rofl"
    ],
    "plainMeaning": "I am laughing extremely hard.",
    "summary": "An amplified laughter reaction, often deliberately dramatic.",
    "interpretations": [
      "Something feels exceptionally funny.",
      "Exaggerated laughter for playful effect.",
      "Occasionally laughing at someone rather than with them."
    ],
    "example": "“Not the chair breaking right when he sat down 🤣”",
    "contextClues": "Usually playful among friends. If aimed repeatedly at one person after embarrassment, it may land as ridicule.",
    "opener": "“Was everyone laughing together, or did someone feel singled out?”",
    "category": "Emojis & Symbols",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "thinking face emoji (🤔)",
    "slug": "thinking-face-emoji",
    "aliases": [
      "🤔",
      "thinking emoji",
      "thinking face",
      "hmm emoji",
      "thinking hard"
    ],
    "plainMeaning": "I’m considering that, questioning it, or not fully convinced.",
    "summary": "A flexible reaction for curiosity, skepticism, playful suspicion, or genuine thought.",
    "interpretations": [
      "Pausing to think through an idea.",
      "Doubting whether a claim adds up.",
      "Playfully hinting that there may be more to a story."
    ],
    "example": "“You finished all of that homework in ten minutes? 🤔”",
    "contextClues": "After a question it usually signals thought or skepticism. Between friends it can lightly tease; during conflict it may challenge someone’s honesty.",
    "opener": "“Were they genuinely thinking about it, or questioning whether it was true?”",
    "category": "Emojis & Symbols",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "moai emoji (🗿)",
    "slug": "moai-emoji",
    "aliases": [
      "🗿",
      "moai emoji",
      "stone face emoji",
      "easter island head",
      "moyai"
    ],
    "plainMeaning": "A deadpan, stoic, or deliberately random reaction.",
    "summary": "Often functions as an emotionless punchline or absurd response rather than a literal statue reference.",
    "interpretations": [
      "Deadpan approval or composure.",
      "An intentionally expressionless response to awkward content.",
      "Random meme humor with no stable meaning."
    ],
    "example": "“Bro submitted the assignment with no name 🗿”",
    "contextClues": "Its meaning comes mostly from the shared joke and surrounding message. It is often intentionally vague or nonsensical.",
    "opener": "“What does the stone face mean in your group—deadpan, impressed, or just random?”",
    "category": "Emojis & Symbols",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "headstone emoji (🪦)",
    "slug": "headstone-emoji",
    "aliases": [
      "🪦",
      "headstone emoji",
      "tombstone emoji",
      "grave emoji",
      "rip emoji"
    ],
    "plainMeaning": "That ended me; that was hilarious or a total failure.",
    "summary": "A dramatic extension of “I’m dead,” used for laughter, embarrassment, or the end of something.",
    "interpretations": [
      "A joke was extremely funny.",
      "A plan, streak, or hope has humorously failed.",
      "Less commonly, a sincere reference to death or grief."
    ],
    "example": "“My screen froze one point before we won 🪦”",
    "contextClues": "Gaming, joke, or mishap context is usually figurative. Messages about an actual loss should be read literally and compassionately.",
    "opener": "“Is that a joking ‘RIP,’ or is this about something that really happened?”",
    "category": "Emojis & Symbols",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "upside-down face emoji (🙃)",
    "slug": "upside-down-face-emoji",
    "aliases": [
      "🙃",
      "upside down face",
      "upside-down smile",
      "sarcastic smile emoji"
    ],
    "plainMeaning": "I’m smiling through something awkward or frustrating.",
    "summary": "A polite-looking smile that often signals irony, resignation, or quiet annoyance.",
    "interpretations": [
      "Dry sarcasm after an inconvenience.",
      "Awkwardness or embarrassment.",
      "Trying to stay light while feeling frustrated."
    ],
    "example": "“They moved the deadline to tomorrow 🙃”",
    "contextClues": "A positive sentence may be sincere, but bad news followed by this emoji usually means the opposite of cheerful.",
    "opener": "“That upside-down smile feels a little sarcastic—was it frustrating?”",
    "category": "Emojis & Symbols",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "grimacing face emoji (😬)",
    "slug": "grimacing-face-emoji",
    "aliases": [
      "😬",
      "grimace emoji",
      "grimacing emoji",
      "yikes face",
      "awkward teeth emoji"
    ],
    "plainMeaning": "Yikes; that is awkward, tense, or uncomfortable.",
    "summary": "Reacts to secondhand embarrassment, a close call, or an uncomfortable situation.",
    "interpretations": [
      "Secondhand embarrassment.",
      "Nervousness about a mistake or consequence.",
      "A gentle signal that a comment did not land well."
    ],
    "example": "“He replied-all to the entire school 😬”",
    "contextClues": "Usually a mild reaction. In a personal exchange, it can signal discomfort without directly saying no.",
    "opener": "“Was that just awkward, or did something make you uncomfortable?”",
    "category": "Emojis & Symbols",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "face with peeking eye emoji (🫣)",
    "slug": "face-with-peeking-eye-emoji",
    "aliases": [
      "🫣",
      "peeking emoji",
      "peek emoji",
      "face peeking",
      "hiding face emoji"
    ],
    "plainMeaning": "I can barely watch, but I want to see.",
    "summary": "Combines embarrassment, suspense, curiosity, and playful anticipation.",
    "interpretations": [
      "Watching an awkward or dramatic moment.",
      "Nervous anticipation before news or a reveal.",
      "Shy interest or light flirting."
    ],
    "example": "“Okay I finally sent the message 🫣”",
    "contextClues": "A crush conversation may make it flirtatious; drama or a risky game moment usually makes it suspenseful.",
    "opener": "“Were you nervous, excited, or both when you sent that?”",
    "category": "Emojis & Symbols",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "flushed face emoji (😳)",
    "slug": "flushed-face-emoji",
    "aliases": [
      "😳",
      "flushed emoji",
      "blushing emoji",
      "wide eyes blush",
      "shocked blush"
    ],
    "plainMeaning": "I’m surprised, embarrassed, or flustered.",
    "summary": "A wide-eyed reaction that can signal shock, a compliment landing, or flirtatious embarrassment.",
    "interpretations": [
      "Unexpected surprise or disbelief.",
      "Embarrassment after being noticed.",
      "Feeling flustered by a crush or compliment."
    ],
    "example": "“They said my outfit looked amazing 😳”",
    "contextClues": "Compliments and crush talk suggest flirting; sudden news suggests surprise. It does not establish romantic interest by itself.",
    "opener": "“Did that catch you off guard, or was it a flirty kind of reaction?”",
    "category": "Emojis & Symbols",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "face with rolling eyes emoji (🙄)",
    "slug": "face-with-rolling-eyes-emoji",
    "aliases": [
      "🙄",
      "eye roll emoji",
      "rolling eyes",
      "eyeroll",
      "eye rolling face"
    ],
    "plainMeaning": "That is annoying, obvious, or not worth taking seriously.",
    "summary": "Shows mild irritation, skepticism, or teasing exasperation.",
    "interpretations": [
      "Playful annoyance with a friend.",
      "Disbelief at an excuse or claim.",
      "Dismissiveness during a real disagreement."
    ],
    "example": "“He said the homework ‘deleted itself’ again 🙄”",
    "contextClues": "Friendly banter softens it; short replies during conflict can make it feel contemptuous or dismissive.",
    "opener": "“Was that playful annoyance, or are you actually frustrated with them?”",
    "category": "Emojis & Symbols",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "person standing emoji (🧍)",
    "slug": "person-standing-emoji",
    "aliases": [
      "🧍",
      "standing emoji",
      "person standing",
      "standing there emoji",
      "awkward standing"
    ],
    "plainMeaning": "I’m just standing here awkwardly or speechlessly.",
    "summary": "A deadpan reaction to feeling out of place, ignored, stunned, or unsure what to do.",
    "interpretations": [
      "Awkwardly waiting while something happens.",
      "Being left speechless by a strange comment.",
      "Feeling overlooked in a group, sometimes expressed humorously."
    ],
    "example": "“Everyone paired up and I was just there 🧍”",
    "contextClues": "Often self-deprecating. Repeated references to being excluded may point to a real friendship concern worth asking about.",
    "opener": "“Was that a funny awkward moment, or did you feel left out?”",
    "category": "Emojis & Symbols",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "pleading face emoji (🥺)",
    "slug": "pleading-face-emoji",
    "aliases": [
      "🥺",
      "pleading emoji",
      "puppy eyes emoji",
      "please face",
      "cute pleading face"
    ],
    "plainMeaning": "Please, that is sweet, or I feel vulnerable.",
    "summary": "Softens a request and can express affection, shyness, or emotional tenderness.",
    "interpretations": [
      "A cute or playful request.",
      "Feeling touched by something kind.",
      "Flirtatious vulnerability or asking for reassurance."
    ],
    "example": "“Can we get snacks on the way home 🥺”",
    "contextClues": "Usually affectionate and harmless. Pressure still matters: a cute emoji does not make someone obligated to agree.",
    "opener": "“Was that just a cute way of asking, or did you feel pressured to say yes?”",
    "category": "Emojis & Symbols",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "smirking face emoji (😏)",
    "slug": "smirking-face-emoji",
    "aliases": [
      "😏",
      "smirk emoji",
      "smirking emoji",
      "flirty smirk",
      "suggestive face"
    ],
    "plainMeaning": "I know something, I’m teasing, or I’m flirting.",
    "summary": "Adds a knowing, mischievous, or suggestive tone that depends heavily on the relationship.",
    "interpretations": [
      "Playful confidence after making a point.",
      "An inside joke or hint.",
      "Flirting or a suggestive implication."
    ],
    "example": "“So you noticed my new profile picture 😏”",
    "contextClues": "Between close friends it may be teasing; with romantic language it is more likely flirtatious. The emoji alone does not reveal intent.",
    "opener": "“Was that an inside joke, or did it feel like flirting?”",
    "category": "Emojis & Symbols",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "heart hands emoji (🫶)",
    "slug": "heart-hands-emoji",
    "aliases": [
      "🫶",
      "heart hands",
      "heart hands emoji",
      "hand heart",
      "love hands"
    ],
    "plainMeaning": "Love, appreciation, or strong support.",
    "summary": "A warm sign of care used among friends, fans, family members, and romantic partners.",
    "interpretations": [
      "Thanking someone sincerely.",
      "Showing friendship or community support.",
      "Romantic affection in a dating conversation."
    ],
    "example": "“You all showed up for me today 🫶”",
    "contextClues": "The relationship and surrounding words determine whether it is friendly, communal, or romantic.",
    "opener": "“Was that friend appreciation, fan support, or something more romantic?”",
    "category": "Emojis & Symbols",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "red heart emoji (❤️)",
    "slug": "red-heart-emoji",
    "aliases": [
      "❤️",
      "❤",
      "red heart",
      "heart emoji",
      "love heart"
    ],
    "plainMeaning": "Love, care, strong approval, or support.",
    "summary": "A broad expression of affection that is not automatically romantic.",
    "interpretations": [
      "Family or friendship affection.",
      "Romantic interest or love.",
      "Strong appreciation for a post, song, or idea."
    ],
    "example": "“Thanks for checking on me ❤️”",
    "contextClues": "Who sent it, the conversation, and established relationship matter more than the symbol. One heart alone does not prove a romance.",
    "opener": "“What did the heart mean in that friendship or conversation?”",
    "category": "Emojis & Symbols",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "finger-pointing emoji pair (👉👈)",
    "slug": "finger-pointing-emoji-pair",
    "aliases": [
      "👉👈",
      "finger pointing pair",
      "two fingers emoji",
      "shy fingers",
      "pointing fingers together"
    ],
    "plainMeaning": "I’m feeling shy, tentative, or playfully asking.",
    "summary": "A stylized shy gesture used before a request, confession, or flirtatious comment.",
    "interpretations": [
      "Playful hesitation before asking a favor.",
      "Shy flirting or a crush confession.",
      "Deliberate cuteness or self-parody."
    ],
    "example": "“Maybe we could hang out after school 👉👈”",
    "contextClues": "Often ironic as well as sincere. A request should still respect boundaries, regardless of the cute presentation.",
    "opener": "“Was that genuinely shy, jokingly dramatic, or a little flirty?”",
    "category": "Emojis & Symbols",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "nail polish emoji (💅)",
    "slug": "nail-polish-emoji",
    "aliases": [
      "💅",
      "nail polish emoji",
      "painting nails",
      "nails emoji",
      "sassy nails"
    ],
    "plainMeaning": "Unbothered, confident, stylish, or knowingly dramatic.",
    "summary": "Adds attitude to a statement, often signaling confidence, dismissal, or playful sass.",
    "interpretations": [
      "Feeling confident or pleased with oneself.",
      "Pretending not to care about criticism.",
      "A playful, camp, or fashion-forward flourish."
    ],
    "example": "“Finished the project before everyone else 💅”",
    "contextClues": "Usually playful self-confidence. In a disagreement, it can make a reply feel dismissive rather than neutral.",
    "opener": "“Was that a confident little victory, or were they brushing someone off?”",
    "category": "Emojis & Symbols",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "hundred points emoji (💯)",
    "slug": "hundred-points-emoji",
    "aliases": [
      "💯",
      "hundred emoji",
      "100 emoji",
      "keep it 100",
      "one hundred"
    ],
    "plainMeaning": "Absolutely true, excellent, or fully agreed.",
    "summary": "Signals strong approval, authenticity, or maximum effort.",
    "interpretations": [
      "Strong agreement: “Exactly.”",
      "Praise for an excellent performance.",
      "A reminder to be honest or “keep it real.”"
    ],
    "example": "“That chorus is the best part 💯”",
    "contextClues": "Usually straightforward approval. Repetition makes the reaction more emphatic, not necessarily more serious.",
    "opener": "“What were they agreeing with so strongly?”",
    "category": "Emojis & Symbols",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "double exclamation mark emoji (‼️)",
    "slug": "double-exclamation-mark-emoji",
    "aliases": [
      "‼️",
      "‼",
      "double exclamation",
      "double exclamation emoji",
      "red exclamation marks"
    ],
    "plainMeaning": "Pay attention; this feels important or intense.",
    "summary": "Adds urgency, surprise, excitement, or exaggerated emphasis.",
    "interpretations": [
      "Excitement about news or plans.",
      "A strong reaction to something surprising.",
      "Urgency or anger when paired with demands."
    ],
    "example": "“They just announced another show ‼️”",
    "contextClues": "Event news usually means excitement. Commands or conflict can make it feel urgent or confrontational.",
    "opener": "“Were those exclamation marks excitement, or did the message feel urgent?”",
    "category": "Emojis & Symbols",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "pinched fingers emoji (🤌)",
    "slug": "pinched-fingers-emoji",
    "aliases": [
      "🤌",
      "pinched fingers",
      "chefs kiss hand",
      "italian hand emoji",
      "hand pinch emoji"
    ],
    "plainMeaning": "Perfect, what do you mean, or emphasis—depending on context.",
    "summary": "A flexible hand gesture used for praise, questioning, frustration, or theatrical emphasis.",
    "interpretations": [
      "“Chef’s kiss”: something is excellent.",
      "“What are you saying?” or disbelief.",
      "Dramatic emphasis that imitates a familiar hand gesture."
    ],
    "example": "“The ending of that video 🤌”",
    "contextClues": "Praise words suggest “perfect”; a question or argument suggests confusion or frustration. Cultural meanings vary.",
    "opener": "“Did that mean ‘perfect,’ or more like ‘what are you talking about?’”",
    "category": "Emojis & Symbols",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "saluting face emoji (🫡)",
    "slug": "saluting-face-emoji",
    "aliases": [
      "🫡",
      "salute emoji",
      "saluting face",
      "yes sir emoji",
      "understood salute"
    ],
    "plainMeaning": "Understood, I’ll do it, or I accept my fate.",
    "summary": "Signals acknowledgment, respect, or joking resignation to an unpleasant task.",
    "interpretations": [
      "A sincere “got it.”",
      "Playful obedience after receiving instructions.",
      "Ironic resignation before doing something difficult."
    ],
    "example": "“Guess I’m presenting first tomorrow 🫡”",
    "contextClues": "A direct instruction suggests acknowledgment; bad news or a chore often makes it dryly humorous.",
    "opener": "“Was that a sincere ‘got it,’ or a joking ‘here we go’?”",
    "category": "Emojis & Symbols",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "peach emoji (🍑)",
    "slug": "peach-emoji",
    "aliases": [
      "🍑",
      "peach emoji",
      "peach",
      "butt emoji",
      "booty emoji"
    ],
    "plainMeaning": "A peach—or a coded reference to someone’s backside.",
    "summary": "Often keeps its literal food meaning, but online it can also refer to body shape or flirtation.",
    "interpretations": [
      "The actual fruit, food, or a peach color.",
      "A playful reference to someone’s backside.",
      "Flirting or a suggestive joke."
    ],
    "example": "“That gym routine has me feeling strong 🍑”",
    "contextClues": "Food and recipe context is literal. Comments about appearance, fitness, dating, or private messages may be suggestive; that still does not prove unsafe behavior.",
    "opener": "“Was that about food or fitness, or was someone making a comment about a body?”",
    "category": "Emojis & Symbols",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "eggplant emoji (🍆)",
    "slug": "eggplant-emoji",
    "aliases": [
      "🍆",
      "eggplant emoji",
      "eggplant",
      "aubergine emoji"
    ],
    "plainMeaning": "An eggplant—or a coded sexual reference.",
    "summary": "In recipes it is literal; in flirting or jokes it commonly represents male anatomy.",
    "interpretations": [
      "The vegetable in food or gardening context.",
      "A sexual joke or flirtatious innuendo.",
      "Immature humor without a serious proposition."
    ],
    "example": "“The group chat turned a normal recipe photo into an 🍆 joke.”",
    "contextClues": "Food context is ordinary. Paired with flirtatious messages, body emojis, secrecy, pressure, or an unknown sender, the interaction deserves a calm boundaries conversation.",
    "opener": "“Was that just a joke among friends, or did anyone make the conversation feel uncomfortable?”",
    "category": "Emojis & Symbols",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "hot face emoji (🥵)",
    "slug": "hot-face-emoji",
    "aliases": [
      "🥵",
      "hot face emoji",
      "overheated emoji",
      "sweating hot emoji",
      "thirst emoji"
    ],
    "plainMeaning": "That is very hot, intense, difficult, or attractive.",
    "summary": "Can react to temperature, strenuous effort, spicy food, or attraction.",
    "interpretations": [
      "Physically hot or exhausted after activity.",
      "Something is intense, difficult, or exciting.",
      "Flirtatious attraction toward a person."
    ],
    "example": "“That last workout set was brutal 🥵”",
    "contextClues": "Weather, exercise, food, and gaming point to literal heat or intensity. A photo or compliment may make it flirtatious.",
    "opener": "“Was that about the heat or effort, or were they reacting to someone?”",
    "category": "Emojis & Symbols",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "smiling face with horns emoji (😈)",
    "slug": "smiling-face-with-horns-emoji",
    "aliases": [
      "😈",
      "devil emoji",
      "purple devil",
      "horns emoji",
      "mischief emoji"
    ],
    "plainMeaning": "I’m being mischievous, bold, or suggestive.",
    "summary": "Frames a comment as naughty, rebellious, teasing, or sometimes flirtatious.",
    "interpretations": [
      "Harmless mischief or rule-bending humor.",
      "Competitive confidence before a prank or game.",
      "Suggestive flirting in a private conversation."
    ],
    "example": "“We’re getting dessert before dinner 😈”",
    "contextClues": "Everyday rule-breaking jokes are usually harmless. Flirty language, secrecy, pressure, or an unfamiliar contact changes the context.",
    "opener": "“Was that playful mischief, or did the conversation take a more suggestive turn?”",
    "category": "Emojis & Symbols",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "eye mouth eye emoji sequence (👁️👄👁️)",
    "slug": "eye-mouth-eye-emoji-sequence",
    "aliases": [
      "👁️👄👁️",
      "👁👄👁",
      "eye mouth eye",
      "eye lips eye",
      "staring face sequence"
    ],
    "plainMeaning": "I’m staring in stunned, awkward, or fascinated disbelief.",
    "summary": "An intentionally strange face used as a silent reaction when words do not fit.",
    "interpretations": [
      "Speechless disbelief at something bizarre.",
      "Awkwardly watching drama unfold.",
      "Deliberately absurd meme humor with no precise literal meaning."
    ],
    "example": "“The teacher opened the meme we sent by accident 👁️👄👁️”",
    "contextClues": "It usually performs a reaction rather than naming a feeling exactly. The message before it explains whether the stare is amused, shocked, or awkward.",
    "opener": "“What happened right before that speechless face?”",
    "category": "Emojis & Symbols",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "doxxing",
    "slug": "doxxing",
    "aliases": [
      "dox",
      "doxed",
      "doxxed",
      "doxing",
      "getting doxxed",
      "drop their address"
    ],
    "plainMeaning": "Sharing someone’s private identifying information without permission.",
    "summary": "Usually refers to exposing an address, school, workplace, phone number, or other personal details online.",
    "interpretations": [
      "A genuine threat or act of publishing private information.",
      "An exaggerated joke after someone reveals a harmless detail about themselves.",
      "A mistaken label for sharing information that was already intentionally public."
    ],
    "example": "“Delete that screenshot—the street sign could make it easier to dox her.”",
    "contextClues": "Specific addresses, schools, phone numbers, threats, or attempts to rally others deserve prompt attention. Casual jokes about recognizing a neighborhood are not automatically doxxing.",
    "opener": "“Did anyone share or threaten to share information that you wanted kept private?”",
    "category": "Sensitive Safety Topics",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "swatting",
    "slug": "swatting",
    "aliases": [
      "swat them",
      "swatted",
      "swat call",
      "fake emergency call"
    ],
    "plainMeaning": "Making a false emergency report to send police to someone’s location.",
    "summary": "An abusive and dangerous form of online harassment, sometimes mentioned around streamers or gaming disputes.",
    "interpretations": [
      "A real threat to make a false emergency report.",
      "News or discussion about a creator who was targeted.",
      "An edgy joke that still names a serious act."
    ],
    "example": "“The streamer ended early after someone threatened swatting in chat.”",
    "contextClues": "A specific target, address, claim that a call was made, or active threat is different from discussing a news story. The word alone does not show who is involved.",
    "opener": "“Is this something people were discussing, or did someone make a specific threat toward you or another person?”",
    "category": "Sensitive Safety Topics",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "sextortion",
    "slug": "sextortion",
    "aliases": [
      "sextorted",
      "sextortion scam",
      "blackmail with pics",
      "pay or i leak",
      "pay or leak"
    ],
    "plainMeaning": "Threatening to share intimate material unless someone pays or complies.",
    "summary": "A form of coercion that can begin with flirting, impersonation, account compromise, or a request for images.",
    "interpretations": [
      "A direct blackmail threat involving private images.",
      "A warning or news discussion about this kind of scam.",
      "Someone seeking help after receiving a threatening message."
    ],
    "example": "“The account said ‘pay or I leak it,’ so he told a trusted adult instead of replying.”",
    "contextClues": "Demands for money, more images, secrecy, or immediate compliance are significant. A young person targeted by this is not at fault and should not have to handle it alone.",
    "opener": "“Did someone threaten or pressure you, and would it help to work through the next step together?”",
    "category": "Sensitive Safety Topics",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "leak / leaked",
    "slug": "leak",
    "aliases": [
      "leak",
      "leaked",
      "leaking",
      "got leaked",
      "private leak"
    ],
    "plainMeaning": "Something private or unreleased was shared without permission—or appeared early online.",
    "summary": "Can describe unreleased music and game information, but also private messages, photos, or personal details.",
    "interpretations": [
      "An unreleased song, trailer, update, or spoiler appearing early.",
      "Private screenshots or information shared without consent.",
      "A rumor being called a leak even when it is unverified."
    ],
    "example": "“Is that a real album leak, or just another edited clip?”",
    "contextClues": "Entertainment talk is usually about early content. Names, private images, addresses, or threats to publish something make consent and safety more relevant.",
    "opener": "“What was supposedly leaked—public entertainment news, or something someone expected to stay private?”",
    "category": "Sensitive Safety Topics",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "expose",
    "slug": "expose",
    "aliases": [
      "exposed",
      "exposing",
      "expose page",
      "expose account",
      "callout post"
    ],
    "plainMeaning": "Publicly reveal or accuse someone of hidden behavior.",
    "summary": "Online ‘exposing’ can range from sharing evidence of misconduct to gossip, retaliation, or incomplete claims.",
    "interpretations": [
      "Calling attention to behavior someone believes was harmful.",
      "Sharing gossip or private messages during a conflict.",
      "A joke about revealing an ordinary secret or embarrassing habit."
    ],
    "example": "“They made an expose post, but half the screenshots had no context.”",
    "contextClues": "Look at consent, evidence, whether private information is included, and whether a crowd is being encouraged to target someone. An accusation is not automatically proof.",
    "opener": "“What are people claiming happened, and is anyone being pressured or targeted?”",
    "category": "Sensitive Safety Topics",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "dogpile",
    "slug": "dogpile",
    "aliases": [
      "dogpiling",
      "dogpiled",
      "dog piled",
      "pile on",
      "piling on",
      "mass replies"
    ],
    "plainMeaning": "Many people joining in to criticize or target one person.",
    "summary": "A flood of replies can be spontaneous disagreement, coordinated harassment, or something in between.",
    "interpretations": [
      "Many users independently disagreeing with a public post.",
      "A group piling on with jokes or insults.",
      "Coordinated targeting intended to overwhelm or intimidate someone."
    ],
    "example": "“I muted the post once the replies turned into a dogpile.”",
    "contextClues": "Volume alone is not proof of coordination. Threats, identity-based attacks, repeated contact, and urging others to join make the situation more concerning.",
    "opener": "“Did it feel like lots of disagreement, or like people were organizing to target someone?”",
    "category": "Sensitive Safety Topics",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "creep / creeper",
    "slug": "creep",
    "aliases": [
      "creep",
      "creeper",
      "creepy person",
      "being creepy",
      "weirdo in my dms"
    ],
    "plainMeaning": "Someone whose behavior feels uncomfortable, intrusive, or inappropriate.",
    "summary": "Can be a casual insult, but may also describe unwanted attention, boundary-crossing, or persistent contact.",
    "interpretations": [
      "A joking label for a friend acting odd.",
      "Someone repeatedly sending unwanted messages.",
      "An older or unknown person making personal or sexual requests."
    ],
    "example": "“That account kept asking where I live, so I blocked the creep.”",
    "contextClues": "One awkward interaction is different from repeated contact, requests for location or images, secrecy, or ignoring a clear no.",
    "opener": "“What did they do that felt creepy, and did you feel able to end the conversation?”",
    "category": "Sensitive Safety Topics",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "stranger danger",
    "slug": "stranger-danger",
    "aliases": [
      "stranger danger online",
      "internet stranger",
      "random stranger",
      "stranger alert"
    ],
    "plainMeaning": "A warning—or joke—about interacting with someone unknown.",
    "summary": "Often used ironically when a new person messages, though it can also flag a genuine boundary concern.",
    "interpretations": [
      "A playful reaction to an unfamiliar person joining a chat.",
      "A reminder not to share personal details with an unknown account.",
      "Concern about someone misrepresenting their identity or intentions."
    ],
    "example": "“A random account asked for my school—stranger danger.”",
    "contextClues": "A simple hello from a new community member is ordinary. Requests for private contact, location, images, secrecy, money, or an in-person meeting deserve more care.",
    "opener": "“Was that just a joke about someone new, or did the person ask for something private?”",
    "category": "Sensitive Safety Topics",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "add me on snap",
    "slug": "add-me-on-snap",
    "aliases": [
      "add me on snapchat",
      "add my snap",
      "what’s your snap",
      "snap me"
    ],
    "plainMeaning": "Connect with me on Snapchat.",
    "summary": "A common request to move a conversation to Snapchat, which may be ordinary socializing or a step toward more private contact.",
    "interpretations": [
      "Friends exchanging usernames normally.",
      "Someone moving from a public comment or game chat to direct messages.",
      "An unfamiliar person seeking private or disappearing-message contact."
    ],
    "example": "“We met in the game lobby and they said ‘add me on snap.’”",
    "contextClues": "Moving platforms is common and not inherently unsafe. Age differences, secrecy, pressure, personal questions, or repeated requests after a no matter more than the phrase itself.",
    "opener": "“How do you know them, and does moving the chat there feel comfortable to you?”",
    "category": "Sensitive Safety Topics",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "sewer slide",
    "slug": "sewer-slide",
    "aliases": [
      "sewerslide",
      "commit sewer slide",
      "sewer side",
      "unalive myself"
    ],
    "plainMeaning": "A disguised reference to suicide, sometimes serious and sometimes used as dark humor.",
    "summary": "An altered phrase used to avoid filters or soften a difficult subject; context and the person’s current well-being matter.",
    "interpretations": [
      "Dark or exaggerated humor after a minor frustration.",
      "Discussion of suicide-related content or moderation rules.",
      "A possible indirect expression of personal distress or suicidal thoughts."
    ],
    "example": "“someone in the comments wrote ‘sewer slide’ and I couldn’t tell if it was a joke”",
    "contextClues": "Specific intent, hopelessness, saying goodbye, access to means, or a sudden change in behavior warrants immediate supportive attention. Meme use alone does not establish intent, but it is reasonable to ask directly and calmly.",
    "opener": "“I care about you, and I want to check clearly: are you thinking about hurting yourself or suicide?”",
    "category": "Sensitive Safety Topics",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "cart",
    "slug": "cart",
    "aliases": [
      "vape cart",
      "weed cart",
      "thc cart",
      "cartridge",
      "dab cart"
    ],
    "plainMeaning": "A cartridge—often referring to cannabis oil used in a vape.",
    "summary": "In shopping it can mean an online basket; in substance conversations it often means a vape cartridge.",
    "interpretations": [
      "A normal online shopping cart.",
      "An ink, printer, or gaming cartridge in shortened speech.",
      "A cannabis or THC vape cartridge."
    ],
    "example": "“Is the cart empty?”",
    "contextClues": "Checkout, shopping, printers, or games suggest an ordinary meaning. Vape, battery, hit, flavor, THC, or dispensary language suggests substance use.",
    "opener": "“When you said ‘cart,’ did you mean shopping or a cartridge for something?”",
    "category": "Substances & Party Culture",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "pen",
    "slug": "pen",
    "aliases": [
      "vape pen",
      "weed pen",
      "dab pen",
      "thc pen",
      "wax pen"
    ],
    "plainMeaning": "A writing tool—or a small vape device.",
    "summary": "Online and in conversation, ‘pen’ may refer to an ordinary pen or to a device used for nicotine or cannabis.",
    "interpretations": [
      "An ordinary writing pen or stylus.",
      "A nicotine vape device.",
      "A cannabis concentrate vape device."
    ],
    "example": "“Someone asked if I wanted to hit their pen after practice.”",
    "contextClues": "Writing, drawing, and schoolwork are literal. Words like hit, cart, battery, flavor, smoke, or THC point toward vaping.",
    "opener": "“Was that a writing pen, or were they talking about a vape?”",
    "category": "Substances & Party Culture",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "edible",
    "slug": "edible",
    "aliases": [
      "edibles",
      "gummy",
      "weed gummy",
      "thc gummy",
      "special brownie"
    ],
    "plainMeaning": "Food containing cannabis—or simply something safe to eat.",
    "summary": "The ordinary adjective is broad, but party or cannabis context often means THC-infused food or candy.",
    "interpretations": [
      "Anything that can be eaten.",
      "A cannabis-infused gummy, brownie, or snack.",
      "A joke about food without any substance reference."
    ],
    "example": "“They said the gummy was an edible, not regular candy.”",
    "contextClues": "THC, dose, milligrams, dispensary, high, or warnings not to eat too much point to cannabis. Recipe or allergy talk may be entirely literal.",
    "opener": "“Did ‘edible’ just mean food there, or something containing cannabis?”",
    "category": "Substances & Party Culture",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "gas",
    "slug": "gas",
    "aliases": [
      "that gas",
      "some gas",
      "gas pack",
      "gassed",
      "straight gas"
    ],
    "plainMeaning": "Excellent or exciting—or, in some contexts, cannabis.",
    "summary": "A flexible word used for praise, fuel, being tired out, or strong-smelling cannabis.",
    "interpretations": [
      "Praise: something is very good.",
      "Literal gasoline or fuel.",
      "Slang for cannabis, especially in buying or smoking conversations."
    ],
    "example": "“That new track is gas.”",
    "contextClues": "Music, food, or performance talk usually means excellent. Price, quantity, smoke, smell, plug, or strain language may indicate cannabis.",
    "opener": "“Did ‘gas’ mean it was really good, or were they referring to something else?”",
    "category": "Substances & Party Culture",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "green",
    "slug": "green",
    "aliases": [
      "the green",
      "some green",
      "green stuff",
      "greens"
    ],
    "plainMeaning": "The color, money, nature—or sometimes cannabis.",
    "summary": "An ordinary word that can become a coded cannabis reference depending on surrounding language.",
    "interpretations": [
      "A color, plants, environmental topics, or vegetables.",
      "Money in some conversations.",
      "Cannabis in smoking or buying context."
    ],
    "example": "“He asked whether anyone was bringing green.”",
    "contextClues": "Art, clothing, food, gardening, or money talk suggests ordinary meanings. Smoke, rolling, plug, grams, or party plans can shift the meaning.",
    "opener": "“What did ‘green’ refer to in that conversation?”",
    "category": "Substances & Party Culture",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "snow",
    "slug": "snow",
    "aliases": [
      "snow emoji drugs",
      "white snow",
      "snowing",
      "skiing slang"
    ],
    "plainMeaning": "Frozen weather—or sometimes a coded reference to cocaine.",
    "summary": "Usually literal weather language, though some party conversations use ‘snow’ as a substance euphemism.",
    "interpretations": [
      "Actual snow, weather, skiing, or winter plans.",
      "A visual or aesthetic reference to white color.",
      "A coded reference to cocaine in some contexts."
    ],
    "example": "“They kept saying there would be ‘snow’ at the after-party.”",
    "contextClues": "Forecasts, mountains, travel, and winter photos are ordinary. Buying, powder, lines, price, or party secrecy can indicate a drug reference.",
    "opener": "“Was everyone talking about weather or skiing, or did ‘snow’ mean something different there?”",
    "category": "Substances & Party Culture",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "molly",
    "slug": "molly",
    "aliases": [
      "mdma",
      "ecstasy",
      "molly drug",
      "roll on molly"
    ],
    "plainMeaning": "A person’s name—or a common name for MDMA.",
    "summary": "In party context, ‘Molly’ often refers to a psychoactive drug, though it remains an ordinary name.",
    "interpretations": [
      "A person named Molly.",
      "MDMA or a substance sold as MDMA.",
      "Music or cultural references that mention the drug without indicating personal use."
    ],
    "example": "“The message said someone was bringing molly to the festival.”",
    "contextClues": "Capitalization does not reliably settle the meaning. Festival, pills, dose, rolling, buying, or taking language makes a substance meaning more likely.",
    "opener": "“Is Molly a person in this conversation, or were they talking about a substance?”",
    "category": "Substances & Party Culture",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "lean",
    "slug": "lean",
    "aliases": [
      "purple drank",
      "sizzurp",
      "dirty sprite",
      "lean drink",
      "drank"
    ],
    "plainMeaning": "Tilt—or a drink made with misused cough medicine.",
    "summary": "The everyday verb is common; music and party culture may use ‘lean’ for a codeine-containing mixture.",
    "interpretations": [
      "The ordinary action of leaning or relying on someone.",
      "A cultural or music reference.",
      "A drink involving misused prescription cough syrup."
    ],
    "example": "“The lyric mentions lean, but that doesn’t tell us whether anyone used it.”",
    "contextClues": "Grammar often helps: ‘lean on me’ is ordinary, while cup, purple, syrup, pour, or drink language may refer to the substance.",
    "opener": "“Was that just part of a lyric or everyday phrase, or were they discussing a drink?”",
    "category": "Substances & Party Culture",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "function / function tonight",
    "slug": "function",
    "aliases": [
      "function",
      "the function",
      "func",
      "at the function",
      "function tonight"
    ],
    "plainMeaning": "A party, gathering, or social event.",
    "summary": "A broad social term that may describe anything from a school event to an informal party.",
    "interpretations": [
      "A casual hangout or celebration.",
      "A school, family, or community event.",
      "A larger party where details about supervision or substances may be unclear."
    ],
    "example": "“Are you going to the function after the game?”",
    "contextClues": "The word itself is neutral. Host, location, transportation, trusted friends, expected adults, and plans for getting home provide more useful context.",
    "opener": "“What kind of gathering is it, and what’s the plan for getting there and home?”",
    "category": "Substances & Party Culture",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "spiraling",
    "slug": "spiraling",
    "aliases": [
      "i’m spiraling",
      "spiral",
      "spiraled",
      "in a spiral"
    ],
    "plainMeaning": "My thoughts or feelings feel increasingly hard to manage.",
    "summary": "Can describe genuine anxiety or distress, but is also used dramatically for minor frustrations or exciting news.",
    "interpretations": [
      "Overthinking after a stressful event.",
      "Feeling emotionally overwhelmed or increasingly distressed.",
      "Playful exaggeration about a show, crush, or small mistake."
    ],
    "example": "“They haven’t replied and now I’m spiraling.”",
    "contextClues": "Laughing emojis and low-stakes topics suggest exaggeration. Hopelessness, inability to function, panic, or repeated distress deserves a supportive check-in.",
    "opener": "“When you say you’re spiraling, is that playful exaggeration or are things feeling hard to manage?”",
    "category": "Mental Well-being",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "dissociating",
    "slug": "dissociating",
    "aliases": [
      "dissociate",
      "dissociated",
      "dissociation",
      "dissociative",
      "zoning out hard"
    ],
    "plainMeaning": "Feeling disconnected—or casually describing zoning out.",
    "summary": "A clinical word that is also used loosely online for spacing out, emotional numbness, or feeling unreal.",
    "interpretations": [
      "Casually zoning out from boredom or fatigue.",
      "Feeling detached from surroundings or emotions.",
      "Discussing a diagnosed or recurring mental health experience."
    ],
    "example": "“I stared at the screen for ten minutes and felt like I was dissociating.”",
    "contextClues": "A meme after a boring class differs from repeated lost time, fear, distress, or difficulty functioning. The term alone cannot diagnose anything.",
    "opener": "“Do you mean you zoned out, or did you feel disconnected in a way that worried you?”",
    "category": "Mental Well-being",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "intrusive thoughts",
    "slug": "intrusive-thoughts",
    "aliases": [
      "intrusive thought",
      "the intrusive thoughts won",
      "intrusive thoughts won",
      "letting intrusive thoughts win"
    ],
    "plainMeaning": "Unwanted thoughts—or an online joke about acting on a silly impulse.",
    "summary": "The phrase has a genuine mental health meaning but is often used inaccurately as meme language for harmless impulsive ideas.",
    "interpretations": [
      "A joke about doing something silly or impulsive.",
      "An unwanted, upsetting thought that does not reflect someone’s wishes.",
      "A shorthand used in discussion of anxiety or other mental health experiences."
    ],
    "example": "“The intrusive thoughts won, so I cut my sandwich into a star.”",
    "contextClues": "A harmless action and comic tone usually indicate the meme. Repeated distress, fear of losing control, or thoughts involving harm deserve calm support; unwanted thoughts are not intentions by themselves.",
    "opener": "“Is that the meme version about a silly impulse, or are unwanted thoughts actually bothering you?”",
    "category": "Mental Well-being",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "panic mode",
    "slug": "panic-mode",
    "aliases": [
      "in panic mode",
      "full panic",
      "panic activated",
      "panicking"
    ],
    "plainMeaning": "I feel rushed, overwhelmed, or very anxious.",
    "summary": "Often exaggerates deadline stress, though it can also describe genuine panic symptoms.",
    "interpretations": [
      "Last-minute stress before a test or deadline.",
      "Dramatic excitement during a game or event.",
      "A genuine episode of intense anxiety or panic."
    ],
    "example": "“The project is due in an hour, so I’m in panic mode.”",
    "contextClues": "A specific deadline and joking tone suggest ordinary stress. Trouble breathing, feeling unsafe, recurring episodes, or inability to settle may need more immediate support.",
    "opener": "“Is this deadline stress, or are you feeling panicked in a way that you need help with right now?”",
    "category": "Mental Well-being",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "not okay",
    "slug": "not-okay",
    "aliases": [
      "i’m not okay",
      "notokay",
      "not doing okay",
      "really not okay",
      "not ok"
    ],
    "plainMeaning": "Something feels emotionally difficult—or I am reacting dramatically.",
    "summary": "Can be a casual reaction to media or news, but can also be a direct statement of distress.",
    "interpretations": [
      "Playful overwhelm after a dramatic show, song, or celebrity update.",
      "Having a difficult day and wanting support.",
      "A serious expression of emotional distress."
    ],
    "example": "“That ending destroyed me, I’m not okay 😭”",
    "contextClues": "Entertainment context and laughter often signal exaggeration. Hopelessness, withdrawal, goodbye language, self-harm references, or saying they cannot stay safe calls for direct, caring attention.",
    "opener": "“I want to understand—do you mean the show hit hard, or are you personally not feeling okay?”",
    "category": "Mental Well-being",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "emotionally unavailable",
    "slug": "emotionally-unavailable",
    "aliases": [
      "emotionally unavailable person",
      "emotionally distant",
      "closed off emotionally",
      "unavailable emotionally"
    ],
    "plainMeaning": "Not ready or able to engage openly with emotions or closeness.",
    "summary": "A popular relationship label that may describe boundaries, avoidance, limited interest, or a mismatch in communication styles.",
    "interpretations": [
      "Someone does not want a close or committed relationship.",
      "A person has difficulty discussing feelings.",
      "A broad label applied after disappointment, without knowing the other person’s inner state."
    ],
    "example": "“They only text when it suits them, so my friend says they’re emotionally unavailable.”",
    "contextClues": "Look at actual behavior—consistency, honesty, respect, and stated boundaries—rather than treating the label as a diagnosis.",
    "opener": "“What have they done that feels emotionally unavailable to you?”",
    "category": "Mental Well-being",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "social battery",
    "slug": "social-battery",
    "aliases": [
      "socialbattery",
      "social battery dead",
      "low social battery",
      "battery drained socially",
      "out of social battery",
      "socially drained"
    ],
    "plainMeaning": "My energy for being around people is running low.",
    "summary": "A common metaphor for needing quiet or recovery after social interaction.",
    "interpretations": [
      "Ordinary introversion or tiredness after socializing.",
      "Needing a break from messages, events, or group conversation.",
      "Sometimes a gentle way to decline plans without rejecting the friendship."
    ],
    "example": "“I had fun, but my social battery is at zero.”",
    "contextClues": "Usually healthy self-awareness and boundary-setting. Long-term isolation, persistent low mood, or losing interest in everything provides different context.",
    "opener": "“Do you just need some recharge time, or have social things been feeling difficult lately?”",
    "category": "Mental Well-being",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "masking",
    "slug": "masking",
    "aliases": [
      "masking all day",
      "unmasking",
      "social masking",
      "mask my traits",
      "masked it"
    ],
    "plainMeaning": "Hiding natural reactions, traits, or distress to fit expectations.",
    "summary": "Often discussed by autistic, ADHD, and other neurodivergent people, but can more broadly mean concealing feelings or behavior.",
    "interpretations": [
      "Adjusting behavior to blend into a social setting.",
      "Hiding neurodivergent traits to avoid judgment.",
      "Pretending to feel okay when stressed or upset."
    ],
    "example": "“I was masking through the whole event and felt exhausted afterward.”",
    "contextClues": "The term can describe a real and tiring experience, but it does not establish a diagnosis. Frequency, exhaustion, and whether the person feels safe being themselves matter.",
    "opener": "“What were you having to hide or manage, and what would help you feel more comfortable?”",
    "category": "Mental Well-being",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "dw",
    "slug": "dw",
    "aliases": [
      "d w",
      "dw abt it",
      "dw about it",
      "don’t worry"
    ],
    "plainMeaning": "Don’t worry.",
    "summary": "A quick reassurance that something is handled or not a problem. Extremely common in texts and group chats, usually to stop someone from apologizing or over-explaining.",
    "interpretations": [
      "“It’s fine, no need to stress.”",
      "“I’ve already taken care of it.”",
      "Occasionally a way to close a topic they don’t want to discuss."
    ],
    "example": "“Sorry I’m late!” “dw we just got here”",
    "contextClues": "Usually casual and kind. If it keeps appearing whenever you ask a specific question, the topic itself may be worth revisiting gently.",
    "opener": "“You said ‘dw’—was that about the plan, or was there something you didn’t feel like going into?”",
    "category": "Abbreviations",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "hmu",
    "slug": "hmu",
    "aliases": [
      "h m u",
      "hit me up",
      "hmu later",
      "hmuu"
    ],
    "plainMeaning": "Hit me up—message or call me.",
    "summary": "An open invitation to get in touch, usually about hanging out. Friendly and ordinary between people who already know each other; from a stranger online it is simply a request for contact, not proof of anything.",
    "interpretations": [
      "“Text me when you’re free.”",
      "“I’m open to plans, let me know.”",
      "Sometimes a flirty opening between people who are interested in each other."
    ],
    "example": "“hmu if you’re going to the game friday”",
    "contextClues": "Between known friends this is routine. Worth a calm conversation when it comes from an account your child doesn’t know offline.",
    "opener": "“Who usually says ‘hmu’ to you—are they people you know from school?”",
    "category": "Abbreviations",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "rn",
    "slug": "rn",
    "aliases": [
      "r n",
      "right now",
      "rn rn"
    ],
    "plainMeaning": "Right now.",
    "summary": "A time marker attached to almost anything—a mood, a location, a craving. Its meaning comes entirely from the words around it.",
    "interpretations": [
      "“At this exact moment.”",
      "Emphasis on a current feeling: “I’m so tired rn.”",
      "Used to say something is temporary."
    ],
    "example": "“can’t talk rn, in class”",
    "contextClues": "Neutral shorthand. What matters is the sentence it’s attached to, not the abbreviation.",
    "opener": "“What’s going on for you right now?”",
    "category": "Abbreviations",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "brb",
    "slug": "brb",
    "aliases": [
      "b r b",
      "be right back",
      "brb 2 sec"
    ],
    "plainMeaning": "Be right back.",
    "summary": "A long-standing chat shorthand for stepping away briefly. Still used constantly in games, group chats, and calls.",
    "interpretations": [
      "Stepping away from a device or game for a moment.",
      "A polite pause in a conversation.",
      "Sometimes a soft exit from a chat they don’t want to continue."
    ],
    "example": "“brb mom’s calling me”",
    "contextClues": "Almost always literal and harmless. No particular significance on its own.",
    "opener": "“Do you get interrupted a lot when you’re gaming with friends?”",
    "category": "Abbreviations",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "gtg",
    "slug": "gtg",
    "aliases": [
      "g t g",
      "got to go",
      "gotta go",
      "g2g"
    ],
    "plainMeaning": "Got to go—I’m leaving the conversation.",
    "summary": "A quick sign-off. Usually means a parent called, class started, or the battery died; sometimes it is a graceful way out of an uncomfortable chat.",
    "interpretations": [
      "“I have to leave now.”",
      "Ending a conversation politely.",
      "Exiting a chat that turned awkward or tense."
    ],
    "example": "“gtg dinner, talk later”",
    "contextClues": "Routine. If it follows a conflict or an uncomfortable message, the exit itself may be the interesting part.",
    "opener": "“Do you ever use ‘gtg’ just to get out of a conversation you don’t like?”",
    "category": "Abbreviations",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "fs",
    "slug": "fs",
    "aliases": [
      "f s",
      "for sure",
      "fs fs",
      "fasho"
    ],
    "plainMeaning": "For sure—agreement or confirmation.",
    "summary": "A short yes. Doubling it (“fs fs”) adds enthusiasm, similar to “fr fr.”",
    "interpretations": [
      "Plain agreement: “Definitely.”",
      "Confirming a plan.",
      "Sometimes a low-effort reply that means “sure, whatever.”"
    ],
    "example": "“you coming to practice?” “fs”",
    "contextClues": "Tone is hard to read in two letters. Repeated one-word replies can simply mean they are busy.",
    "opener": "“Was that a real yes, or more of a ‘maybe’?”",
    "category": "Abbreviations",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "wya",
    "slug": "wya",
    "aliases": [
      "w y a",
      "where you at",
      "where are you",
      "wyaa"
    ],
    "plainMeaning": "Where are you?",
    "summary": "A logistics question between friends trying to meet up. Common and practical, though it is also the kind of question worth noticing if it comes from someone your child only knows online.",
    "interpretations": [
      "“Where should I meet you?”",
      "“Are you on your way?”",
      "Occasionally impatience: “You’re late.”"
    ],
    "example": "“wya? we’re by the front doors”",
    "contextClues": "Normal between friends making plans. A stranger asking for a location is a good moment for a calm talk about what not to share.",
    "opener": "“When friends ask ‘wya,’ how much do you usually tell people about where you are?”",
    "category": "Abbreviations",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "wtv",
    "slug": "wtv",
    "aliases": [
      "w t v",
      "whatever",
      "wtvr",
      "wtv then"
    ],
    "plainMeaning": "Whatever.",
    "summary": "Can be genuinely easygoing (“I don’t mind either way”) or a signal of being hurt and withdrawing. The surrounding messages usually tell you which.",
    "interpretations": [
      "“I have no preference.”",
      "Dropping a topic to avoid an argument.",
      "Quiet frustration or hurt feelings."
    ],
    "example": "“fine wtv, do what you want”",
    "contextClues": "After a disagreement it often means something did bother them. As a reply about food or plans it usually means nothing at all.",
    "opener": "“That ‘wtv’ read a bit flat to me—did something about that bother you?”",
    "category": "Abbreviations",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "abt",
    "slug": "abt",
    "aliases": [
      "a b t",
      "about",
      "abt that",
      "abt it"
    ],
    "plainMeaning": "About.",
    "summary": "Pure spelling shorthand, most often inside phrases like “dw abt it” or “what abt you.” It carries no meaning of its own.",
    "interpretations": [
      "A shortened “about.”",
      "Part of “dw abt it” (don’t worry about it).",
      "Part of “what abt you.”"
    ],
    "example": "“what abt saturday instead”",
    "contextClues": "Just typing speed. Read the sentence around it.",
    "opener": "“What were you two figuring out there?”",
    "category": "Abbreviations",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "bfr",
    "slug": "bfr",
    "aliases": [
      "b f r",
      "be for real",
      "bfr rn",
      "be fr"
    ],
    "plainMeaning": "Be for real—said in disbelief or to challenge someone.",
    "summary": "Used when something sounds unbelievable, unfair, or like an excuse. Usually banter between friends, but in an argument it can be sharp and dismissive.",
    "interpretations": [
      "“You can’t be serious.”",
      "Playful disbelief at good or wild news.",
      "A pointed challenge during a disagreement."
    ],
    "example": "“you left me on read for 3 days bfr”",
    "contextClues": "Laughing emojis make it teasing. In a tense back-and-forth it can read as an accusation.",
    "opener": "“Was that a joke between you two, or was there a real disagreement going on?”",
    "category": "Abbreviations",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "wdym",
    "slug": "wdym",
    "aliases": [
      "w d y m",
      "what do you mean",
      "wdym by that",
      "wdymm"
    ],
    "plainMeaning": "What do you mean?",
    "summary": "A request for clarification. Depending on tone, it is either genuine confusion or a pushback on something the other person said.",
    "interpretations": [
      "Honest confusion about a message.",
      "Surprise at unexpected news.",
      "A challenge: “Explain yourself.”"
    ],
    "example": "“wdym you’re not coming anymore”",
    "contextClues": "Punctuation and follow-up messages show whether it’s curiosity or friction.",
    "opener": "“Did you two sort out what they actually meant?”",
    "category": "Abbreviations",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "wdyfm",
    "slug": "wdyfm",
    "aliases": [
      "w d y f m",
      "what do you fucking mean",
      "wdyfm bro"
    ],
    "plainMeaning": "A blunt, profane version of “what do you mean?”",
    "summary": "Used for exaggerated shock, often about something trivial like a game result or a plan change. Among friends it is usually comedic emphasis rather than genuine anger, though it can also appear in real arguments.",
    "interpretations": [
      "Joking outrage at surprising news.",
      "Genuine frustration during a conflict.",
      "Meme-style overreaction copied from streamers."
    ],
    "example": "“wdyfm the concert sold out in 4 minutes”",
    "contextClues": "Over-the-top subject matter and laughing reactions point to humor. Aimed directly at a person mid-argument, it reads as hostile.",
    "opener": "“Is that just how your friends joke around, or was that conversation actually heated?”",
    "category": "Abbreviations",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "gmfu",
    "slug": "gmfu",
    "aliases": [
      "g m f u",
      "got me fucked up",
      "that gmfu"
    ],
    "plainMeaning": "“Got me messed up”—that upset, shocked, or wronged me.",
    "summary": "A strong expression of being thrown off by something, from a bad grade to a friend’s behavior. Frequently hyperbolic, but it does signal that something landed badly.",
    "interpretations": [
      "“That really annoyed or hurt me.”",
      "Exaggerated reaction to something minor.",
      "Genuine upset about being treated unfairly."
    ],
    "example": "“she told everyone what i said, that gmfu”",
    "contextClues": "The trigger matters more than the phrase. Repeated use about the same person or group may be worth a longer conversation.",
    "opener": "“That sounded like something got under your skin—what happened?”",
    "category": "Abbreviations",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "nvm",
    "slug": "nvm",
    "aliases": [
      "n v m",
      "nevermind",
      "never mind",
      "nvmd"
    ],
    "plainMeaning": "Never mind.",
    "summary": "Withdraws a question or request. Often practical (“figured it out”), but sometimes it means someone decided not to say what they were going to say.",
    "interpretations": [
      "“I solved it, no need to answer.”",
      "“Forget I asked.”",
      "Backing away from something they started to share."
    ],
    "example": "“can you pick me up at 6 — nvm i got a ride”",
    "contextClues": "Harmless when a follow-up explains it. A “nvm” that replaces something personal is worth a gentle door-opener later.",
    "opener": "“You said ‘never mind’ earlier—was there something you wanted to tell me?”",
    "category": "Abbreviations",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "dispo",
    "slug": "dispo",
    "aliases": [
      "dispos",
      "dispo vape",
      "disposable vape",
      "dispoo"
    ],
    "plainMeaning": "A disposable vape device.",
    "summary": "Short for “disposable.” Used in vaping talk, including by teens describing what other people at school have. The word describes an object, not who is using it.",
    "interpretations": [
      "A single-use nicotine vape.",
      "Sometimes a disposable cannabis vape, depending on the group.",
      "Referenced in jokes and complaints about vaping at school."
    ],
    "example": "“someone’s dispo set off the bathroom alarm again”",
    "contextClues": "Often gossip or complaints about school rather than personal use. Frequent first-person references, or hiding devices, give more context than the word alone.",
    "opener": "“I keep hearing about ‘dispos’ at schools—what’s the situation like at yours?”",
    "category": "Substances & Party Culture",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "penjamin",
    "slug": "penjamin",
    "aliases": [
      "penjamin franklin",
      "pen jamin",
      "penj"
    ],
    "plainMeaning": "A joking nickname for a vape pen.",
    "summary": "A pun on “pen” and “Benjamin Franklin,” spread through memes and stream chat. The humor is the point, and it appears constantly in jokes by people who don’t vape.",
    "interpretations": [
      "A meme nickname for a vape pen.",
      "Part of a running internet joke rather than a real reference to a device.",
      "Occasionally a coded way to mention a vape in a chat."
    ],
    "example": "“he pulled out the penjamin franklin in the middle of class 💀”",
    "contextClues": "Meme framing and laughing emojis are typical. Talk about buying, sharing, or hiding a device is a different signal than repeating a joke.",
    "opener": "“That ‘penjamin’ joke is everywhere—do people at your school actually vape a lot, or is it mostly a meme?”",
    "category": "Substances & Party Culture",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "blinker",
    "slug": "blinker",
    "aliases": [
      "blinkers",
      "hit a blinker",
      "blinking it",
      "took a blinker"
    ],
    "plainMeaning": "A car’s turn signal—or, in vaping slang, a very long pull until the device’s light blinks.",
    "summary": "For driving-age teens this is ordinary car vocabulary (“use your blinker”). In vaping slang it names an exaggerated hit, after the indicator light that flashes when a device cuts off—usually mentioned as a dare or a joke about someone overdoing it.",
    "interpretations": [
      "A turn signal while driving or learning to drive.",
      "The old joke about buying “blinker fluid.”",
      "An exaggerated or show-off vape hit, often a dare among friends.",
      "Teasing someone for coughing after a big hit."
    ],
    "example": "“you forgot your blinker again” / “bro tried to hit a blinker and nearly passed out”",
    "contextClues": "Driving, cars, lessons, or traffic means the turn signal. Phrases like “hit a blinker” point to vaping, and are often a story about someone else; personal, repeated references may point to regular use and are worth a calm conversation.",
    "opener": "“I’ve heard the word ‘blinker’ a few times—what does it mean when your friends say it?”",
    "category": "Substances & Party Culture",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "nic",
    "slug": "nic",
    "aliases": [
      "nic buzz",
      "nic sick",
      "niccing",
      "nicotine buzz"
    ],
    "plainMeaning": "Nicotine, especially the feeling of it.",
    "summary": "“Nic buzz” is the light-headed feeling after vaping; “nic sick” is feeling nauseous from too much. Both often appear in warnings and jokes between teens rather than boasts.",
    "interpretations": [
      "The physical effect of nicotine.",
      "Feeling unwell after vaping too much.",
      "A cautionary story shared between friends."
    ],
    "example": "“i got nic sick at the sleepover and felt awful”",
    "contextClues": "Sometimes shared as a bad experience, which can be a genuine opening to talk. Discussion of needing it to focus or feel calm is a more significant signal.",
    "opener": "“You mentioned feeling nic sick—what happened, and how did you feel afterwards?”",
    "category": "Substances & Party Culture",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "pod",
    "slug": "pod",
    "aliases": [
      "pods",
      "vape pod",
      "pod system",
      "juul pod"
    ],
    "plainMeaning": "Usually an earbud, a podcast, or a small group—and in vaping slang, a refill cartridge.",
    "summary": "Most everyday uses are harmless: “pods” for AirPods or earbuds, “a pod” for a podcast episode, or a small study or friend group. In vaping talk it names a replaceable nicotine cartridge and appears in school gossip and complaints as often as in personal use.",
    "interpretations": [
      "An earbud: “has anyone seen my left pod?”",
      "A podcast or episode: “listening to a new pod.”",
      "A small group of people, like a study pod.",
      "A replaceable nicotine cartridge, often mentioned about someone else’s device or vaping in school bathrooms."
    ],
    "example": "“i lost a pod on the bus again” / “they found a pod in his locker”",
    "contextClues": "Music, charging, losing one, or listening means earbuds or podcasts. Vape, device, flavor, purchase, trading, or concealment talk points to nicotine and gives a clearer picture than the word by itself.",
    "opener": "“Is that pod your earbuds, or something else people are talking about at school?”",
    "category": "Substances & Party Culture",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "wax / dab",
    "slug": "wax",
    "aliases": [
      "wax",
      "dab",
      "dabs",
      "dabbing",
      "dab rig",
      "wax pen hit"
    ],
    "plainMeaning": "A concentrated cannabis product, and the act of using it.",
    "summary": "Stronger than dried cannabis flower. Confusingly, “dab” is also a dance move and a meme, so context decides the meaning entirely.",
    "interpretations": [
      "A cannabis concentrate.",
      "The dance move or the meme (“hit the dab”).",
      "Used loosely in jokes without any real reference to substances."
    ],
    "example": "“that’s not weed, that’s wax”",
    "contextClues": "Dance or meme references are very common, especially in younger groups. Talk about buying, strength, or tolerance points somewhere different.",
    "opener": "“That word comes up in two really different ways—what does it usually mean when your friends say it?”",
    "category": "Substances & Party Culture",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "buzzed",
    "slug": "buzzed",
    "aliases": [
      "buzz",
      "a buzz",
      "lil buzzed",
      "buzzin"
    ],
    "plainMeaning": "Mildly affected by alcohol or nicotine.",
    "summary": "Describes a light, early effect rather than being drunk. Also used loosely for excitement or a caffeine jolt, which is why the surrounding conversation matters.",
    "interpretations": [
      "Slightly affected by alcohol.",
      "The light-headed feeling from nicotine.",
      "Figuratively excited or wired, including from energy drinks."
    ],
    "example": "“two sips and he says he’s buzzed”",
    "contextClues": "Party context suggests alcohol; a coffee or energy-drink conversation usually doesn’t. Teasing tone is common.",
    "opener": "“When people say ‘buzzed’ around you, what are they usually talking about?”",
    "category": "Substances & Party Culture",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "crossfaded",
    "slug": "crossfaded",
    "aliases": [
      "cross faded",
      "crossfade",
      "crossy",
      "cross faded rn"
    ],
    "plainMeaning": "Affected by alcohol and cannabis at the same time.",
    "summary": "A specific state, usually mentioned in party stories. Like most party vocabulary, it is often repeated second-hand or as a joke rather than describing the speaker.",
    "interpretations": [
      "Being under the influence of both alcohol and cannabis.",
      "Retelling a story about someone else at a party.",
      "Exaggeration for comic effect."
    ],
    "example": "“he was crossfaded and fell asleep on the trampoline”",
    "contextClues": "Often a story about someone else. First-person accounts, or a pattern of weekend stories, are worth a calm and curious conversation.",
    "opener": "“What sort of things actually happen at the parties people talk about?”",
    "category": "Substances & Party Culture",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "t-break",
    "slug": "t-break",
    "aliases": [
      "t break",
      "tbreak",
      "tolerance break",
      "taking a t break"
    ],
    "plainMeaning": "A deliberate pause from using a substance, usually cannabis.",
    "summary": "Short for “tolerance break.” Notably, it is often used in the context of cutting back, and sometimes it is borrowed jokingly for breaks from caffeine, gaming, or phones.",
    "interpretations": [
      "Taking a break from cannabis.",
      "A joking break from something else entirely (coffee, energy drinks, a game).",
      "Discussed in threads about cutting down."
    ],
    "example": "“on a t-break til after exams”",
    "contextClues": "The joke usage is genuinely common online. Where it is sincere, the impulse to cut back can be a constructive starting point rather than a confrontation.",
    "opener": "“I’ve seen that phrase used both seriously and as a joke—how do people around you use it?”",
    "category": "Substances & Party Culture",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "geeking",
    "slug": "geeking",
    "aliases": [
      "geekin",
      "geeked",
      "geeked up",
      "geekin out"
    ],
    "plainMeaning": "Acting agitated, giddy, or hyper—sometimes substance-related, often not.",
    "summary": "In much of internet and gaming culture, “geeked” just means extremely excited or hyped. In some communities it refers to being visibly affected by a stimulant. Tone and setting decide which is meant.",
    "interpretations": [
      "Very excited or hyped about something.",
      "Laughing uncontrollably at a joke.",
      "In some groups, behavior attributed to a stimulant."
    ],
    "example": "“i was geeked when the tickets came through”",
    "contextClues": "Excitement about a concert, game, or release is the usual meaning. Party or late-night contexts with erratic behavior described are a different situation.",
    "opener": "“What was the ‘geeked’ about—were you just hyped about something?”",
    "category": "Substances & Party Culture",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "zaza",
    "slug": "zaza",
    "aliases": [
      "za za",
      "za",
      "zaza pack"
    ],
    "plainMeaning": "Slang for high-grade cannabis.",
    "summary": "A marketing-style word that spread through rap lyrics and memes. Because it is so tied to song lyrics, it is quoted far more often than it is used literally.",
    "interpretations": [
      "Strong or expensive cannabis.",
      "A lyric or meme quotation.",
      "Used jokingly about anything supposedly premium."
    ],
    "example": "“that lyric with ‘zaza’ is stuck in my head”",
    "contextClues": "Music and meme references dominate. References to buying, sharing, or prices are meaningfully different.",
    "opener": "“That word shows up in a lot of songs—do people around you use it for anything else?”",
    "category": "Substances & Party Culture",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "loud",
    "slug": "loud",
    "aliases": [
      "that loud",
      "loud pack",
      "some loud"
    ],
    "plainMeaning": "Strong-smelling cannabis—or simply the ordinary word “loud.”",
    "summary": "One of the most ambiguous words in this category: the everyday meaning is far more common. Only clear substance context makes the slang meaning likely.",
    "interpretations": [
      "The ordinary meaning: noisy.",
      "Strong-smelling cannabis.",
      "Praise for something bold, like an outfit or a sound."
    ],
    "example": "“the party was loud until the neighbours came over”",
    "contextClues": "Assume the ordinary meaning unless the conversation is clearly about substances. A single ambiguous word proves nothing.",
    "opener": "“Is that just describing the noise, or does it mean something else in your group?”",
    "category": "Substances & Party Culture",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "trauma dumping",
    "slug": "trauma-dumping",
    "aliases": [
      "trauma dump",
      "trauma dumped",
      "traumadumping",
      "vent dumping"
    ],
    "plainMeaning": "Sharing heavy personal experiences suddenly, often on someone who wasn’t ready for it.",
    "summary": "A boundaries word popular on TikTok. It can describe a genuinely overwhelming interaction, but it is also used unfairly to shut down a friend who simply opened up.",
    "interpretations": [
      "Feeling overwhelmed by someone else’s heavy disclosures.",
      "Worrying they overshared and feeling embarrassed.",
      "Used as a put-down against someone who was being vulnerable."
    ],
    "example": "“sorry for trauma dumping, i just needed to say it out loud”",
    "contextClues": "Apologizing for it may mean they are carrying something heavy with nowhere to put it. Being accused of it can leave someone reluctant to talk at all.",
    "opener": "“It sounds like something heavy came up—would you want to talk about it with me or with someone else you trust?”",
    "category": "Mental Well-being",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "chronically online",
    "slug": "chronically-online",
    "aliases": [
      "chronically online take",
      "terminally online",
      "chronically onlineee"
    ],
    "plainMeaning": "So immersed in internet culture that it shapes how someone sees everything.",
    "summary": "Usually an insult aimed at strangers with strange opinions, and often used self-deprecatingly too. It is a comment on perspective, not a diagnosis of screen addiction.",
    "interpretations": [
      "A criticism of an out-of-touch online opinion.",
      "Self-aware joking about their own screen time.",
      "A general dismissal in an argument."
    ],
    "example": "“that’s such a chronically online thing to say”",
    "contextClues": "Nearly always an opinion about discourse, not a statement about hours spent on a phone. Genuine worry about screen time sounds different.",
    "opener": "“What kind of takes get called ‘chronically online’?”",
    "category": "Mental Well-being",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "menty b",
    "slug": "menty-b",
    "aliases": [
      "mentyb",
      "menty be",
      "having a menty b",
      "mental breakdown"
    ],
    "plainMeaning": "A joking shorthand for a mental breakdown.",
    "summary": "Deliberately cute phrasing used to describe stress with a bit of distance from it. Most often it is exam or drama stress. Sometimes the light wording is how someone tests whether it is safe to say more.",
    "interpretations": [
      "Exaggerated stress over a deadline or plan falling apart.",
      "Real distress said in a way that feels less heavy.",
      "A shared joke in a group chat about being overwhelmed."
    ],
    "example": "“full menty b over this chem test”",
    "contextClues": "A specific stressor and laughing tone usually mean ordinary overwhelm. Repetition, withdrawal, or sleep changes deserve a warmer, slower conversation.",
    "opener": "“That sounded rough even with the joke attached—how much is on your plate right now?”",
    "category": "Mental Well-being",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "in my feels",
    "slug": "in-my-feels",
    "aliases": [
      "in my feelings",
      "feeling my feels",
      "big feels",
      "all up in my feels"
    ],
    "plainMeaning": "Feeling emotional, often nostalgic or sad.",
    "summary": "Usually triggered by a song, a memory, or late-night thinking. It describes an emotional mood, not a crisis, and it is one of the easier openings for a conversation.",
    "interpretations": [
      "Nostalgic or sentimental about something.",
      "Sad in a soft, reflective way.",
      "Emotional after a film, song, or breakup."
    ],
    "example": "“this song has me in my feels ngl”",
    "contextClues": "Music and late-night timestamps are typical. Persistent low mood over weeks is a different picture than a sentimental evening.",
    "opener": "“What’s got you in your feels tonight?”",
    "category": "Mental Well-being",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "healing era",
    "slug": "healing-era",
    "aliases": [
      "healing arc",
      "my healing era",
      "in my healing era"
    ],
    "plainMeaning": "Describing a current period of recovering or looking after themselves.",
    "summary": "Part of the “era” framing popular on TikTok. It can mean therapy and real work, or simply drinking more water and going to bed earlier. It signals intent, not necessarily a past trauma.",
    "interpretations": [
      "Working on themselves after a difficult period.",
      "A lighthearted reference to new habits.",
      "Distancing from a friendship or relationship that hurt."
    ],
    "example": "“no drama for me, i’m in my healing era”",
    "contextClues": "Often optimistic and self-directed. Asking what they are healing from can be intrusive; asking what is helping is usually welcomed.",
    "opener": "“What’s been helping you feel better lately?”",
    "category": "Mental Well-being",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "hyperfixation",
    "slug": "hyperfixation",
    "aliases": [
      "hyperfixated",
      "hyper fixation",
      "hyperfixating",
      "current hyperfixation"
    ],
    "plainMeaning": "An intense, absorbing interest in one topic for a stretch of time.",
    "summary": "Widely used by neurodivergent communities and, more loosely, by anyone deep into a show or hobby. Enthusiasm for a subject is not evidence of a diagnosis.",
    "interpretations": [
      "A deep current interest in a game, band, or show.",
      "A described experience of intense focus.",
      "Joking about rewatching the same series again."
    ],
    "example": "“my hyperfixation this month is that one album”",
    "contextClues": "Usually joyful and social. It matters more if the focus is crowding out sleep, meals, or friendships.",
    "opener": "“What are you deep into at the moment—tell me about it?”",
    "category": "Mental Well-being",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "decompress",
    "slug": "decompress",
    "aliases": [
      "decompressing",
      "need to decompress",
      "decompression time"
    ],
    "plainMeaning": "Winding down after something draining.",
    "summary": "Straightforward self-care language: quiet time after school, a match, or a social event. Usually a healthy sign of self-awareness.",
    "interpretations": [
      "Needing quiet after a busy day.",
      "Recovering after a stressful event.",
      "A polite way to ask for space."
    ],
    "example": "“give me an hour to decompress and then i’m up for it”",
    "contextClues": "Normally a good sign. Needing many hours alone every day, or avoiding everything, would be worth noticing over time.",
    "opener": "“What actually helps you wind down after a long day?”",
    "category": "Mental Well-being",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "checked out",
    "slug": "checked-out",
    "aliases": [
      "checked out mentally",
      "fully checked out",
      "im checked out"
    ],
    "plainMeaning": "Mentally disengaged from something.",
    "summary": "Usually about school, a job, or a losing game near the end of a term. It describes low motivation rather than a mental health condition, though sustained disengagement is worth attention.",
    "interpretations": [
      "No motivation left for school or a task.",
      "Giving up on a game that’s already lost.",
      "Emotionally withdrawn from a friendship or relationship."
    ],
    "example": "“i’ve been checked out since the last exam”",
    "contextClues": "End-of-term fatigue is extremely common. Withdrawal across several areas at once—school, friends, hobbies—suggests a longer conversation.",
    "opener": "“Sounds like your energy for school is low—has something changed recently?”",
    "category": "Mental Well-being",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "running on empty",
    "slug": "running-on-empty",
    "aliases": [
      "running on fumes",
      "on empty",
      "no gas left",
      "running on 0"
    ],
    "plainMeaning": "Out of energy and pushing through anyway.",
    "summary": "A tiredness metaphor, often during exam season or a packed schedule. Common and usually literal about sleep and workload.",
    "interpretations": [
      "Very tired from a heavy schedule.",
      "Emotionally drained.",
      "Joking about a late night."
    ],
    "example": "“three hours sleep, running on empty today”",
    "contextClues": "Sleep and schedule details usually explain it. A long stretch of it is a practical prompt to look at commitments together.",
    "opener": "“How much sleep have you actually been getting this week?”",
    "category": "Mental Well-being",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "dysregulated",
    "slug": "dysregulated",
    "aliases": [
      "dysregulation",
      "emotionally dysregulated",
      "regulate myself",
      "co-regulate"
    ],
    "plainMeaning": "Feeling unable to settle emotions back to a calm baseline.",
    "summary": "Therapy vocabulary that has spread into everyday teen language. It describes a state in the moment; using the word is not a diagnosis, and often it reflects a young person who has learned useful language for feelings.",
    "interpretations": [
      "Overwhelmed and struggling to calm down.",
      "Describing a strong reaction after a conflict.",
      "Borrowed casually to mean “thrown off.”"
    ],
    "example": "“i got so dysregulated after that argument”",
    "contextClues": "Naming the feeling is generally a good sign. What helps them settle is the more useful question.",
    "opener": "“When you feel like that, what usually helps you come back down?”",
    "category": "Mental Well-being",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "romanticizing my life",
    "slug": "romanticizing-my-life",
    "aliases": [
      "romanticizing",
      "romanticise my life",
      "main character walk",
      "romanticizing the little things"
    ],
    "plainMeaning": "Deliberately appreciating small everyday moments.",
    "summary": "A positive TikTok habit—making a nice coffee, a walk with music, treating ordinary days as worth noticing. Occasionally it slides into performing a life for an audience.",
    "interpretations": [
      "Finding joy in small routines.",
      "Framing an ordinary day as cinematic.",
      "Sometimes curating an image online rather than enjoying the moment."
    ],
    "example": "“romanticizing my life with a walk and this playlist ☕️”",
    "contextClues": "Usually wholesome and self-directed. Worth noticing only if everything becomes content for other people.",
    "opener": "“What’s a small thing that’s been making your days better lately?”",
    "category": "Mental Well-being",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "grippy sock vacation",
    "slug": "grippy-sock-vacation",
    "aliases": [
      "grippy socks",
      "grippy sock jail",
      "grippy sock hotel"
    ],
    "plainMeaning": "A dark-humor euphemism for a stay in a psychiatric hospital.",
    "summary": "Named after the non-slip socks given to inpatients. It circulates in mental health meme spaces, sometimes by people describing their own experience and sometimes as a joke among people with none. It is heavy language regardless of tone.",
    "interpretations": [
      "Referring to their own past inpatient stay.",
      "Dark humor within mental health meme culture.",
      "Repeating a joke without understanding it."
    ],
    "example": "“saw a grippy sock vacation meme and did not know what it meant”",
    "contextClues": "This one is worth following up on warmly and without alarm, especially alongside hopelessness, goodbye language, or self-harm references. Many young people simply encounter it as a meme.",
    "opener": "“I came across that phrase and wasn’t sure what it meant—how do people use it where you see it?”",
    "category": "Mental Well-being",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "burner account",
    "slug": "burner-account",
    "aliases": [
      "burner",
      "burner acct",
      "burner page",
      "throwaway account"
    ],
    "plainMeaning": "A secondary, usually anonymous account.",
    "summary": "Burners have very ordinary uses—following a hobby, avoiding a follower list, lurking on a fan page—and less ordinary ones, like saying things anonymously. The existence of one is not proof of anything.",
    "interpretations": [
      "A private account away from classmates and family.",
      "An anonymous account for a specific interest or fandom.",
      "Occasionally used to post or message without being identified."
    ],
    "example": "“that comment was definitely from a burner”",
    "contextClues": "Wanting privacy from peers is normal at this age. Anonymous conflict, harassment, or contact with strangers is the part that merits a conversation.",
    "opener": "“Lots of people keep a second account—what do people usually use them for?”",
    "category": "Sensitive Safety Topics",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "pic for pic",
    "slug": "pic-for-pic",
    "aliases": [
      "p4p",
      "pic 4 pic",
      "trade pics",
      "pic trade"
    ],
    "plainMeaning": "An offer to exchange photos, sometimes sexual ones.",
    "summary": "The phrase itself is ambiguous—friends trade selfies and camera-roll photos constantly—but it is also a common opener in pressured or exploitative exchanges, including from accounts pretending to be a peer.",
    "interpretations": [
      "An ordinary swap of selfies or photos between friends.",
      "A pressured request for intimate images framed as fair trade.",
      "A message from an unknown account testing whether someone will respond."
    ],
    "example": "“random account messaged asking for a pic for pic”",
    "contextClues": "Who is asking, and whether there is pressure, flattery, or secrecy, matters far more than the wording. Young people who have already sent something need a calm, no-blame response and help, not punishment.",
    "opener": "“If someone online ever pressured you to send a photo, would you feel able to tell me?”",
    "category": "Sensitive Safety Topics",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "vent account",
    "slug": "vent-account",
    "aliases": [
      "vent acc",
      "vent page",
      "vent acct",
      "venting account"
    ],
    "plainMeaning": "An account used mainly to post difficult feelings.",
    "summary": "Sometimes a healthy outlet and a source of support; sometimes a sign that someone doesn’t feel able to talk to people around them. It can also expose them to communities that normalize self-harm.",
    "interpretations": [
      "A private outlet for hard feelings.",
      "A way to find others who relate.",
      "A place where distress is shared publicly rather than with someone close."
    ],
    "example": "“i only post that stuff on my vent account”",
    "contextClues": "Having somewhere to express feelings can be protective. What matters is whether they also have a real person to talk to, and what the surrounding community is like.",
    "opener": "“Do you have someone you can talk to when things feel heavy—online or offline?”",
    "category": "Sensitive Safety Topics",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "vault app",
    "slug": "vault-app",
    "aliases": [
      "vault apps",
      "hidden photo app",
      "calculator app hiding",
      "decoy app"
    ],
    "plainMeaning": "An app that hides photos or files behind a disguised icon.",
    "summary": "Known in parenting discussions as “decoy” apps. Reasons vary widely—privacy from siblings, embarrassment, or hiding something serious—and the presence of one doesn’t tell you which. Conversation tends to work better than searching a device.",
    "interpretations": [
      "Keeping ordinary private things away from siblings or friends.",
      "Hiding content they think would get them in trouble.",
      "Something a friend told them about rather than something they use."
    ],
    "example": "“someone said there are apps that look like a calculator”",
    "contextClues": "Curiosity and rumors are common. A trust-based conversation about what they feel they need to hide is more useful than an inspection.",
    "opener": "“If there was something on your phone you felt you had to hide, would you be able to tell me about it?”",
    "category": "Sensitive Safety Topics",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "orbiting",
    "slug": "orbiting",
    "aliases": [
      "orbiter",
      "orbited",
      "orbiting me"
    ],
    "plainMeaning": "Someone stops talking to you but keeps watching your posts and stories.",
    "summary": "A dating-culture term for ambiguous, low-effort attention: no replies, but constant story views and likes. Confusing rather than dangerous, though persistent unwanted attention is worth taking seriously.",
    "interpretations": [
      "An ex or crush who watches everything but never messages.",
      "Keeping a low-effort connection alive.",
      "Feeling watched by someone who won’t actually talk."
    ],
    "example": "“he never replies but watches every story, full orbiting”",
    "contextClues": "Usually mixed-signals frustration. If it feels like being monitored or it won’t stop, blocking and talking it through is reasonable.",
    "opener": "“That sounds confusing—how does it feel having them watching but not talking to you?”",
    "category": "Sensitive Safety Topics",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "paperclipping",
    "slug": "paperclipping",
    "aliases": [
      "paperclip",
      "paperclipped",
      "paper clipping"
    ],
    "plainMeaning": "Someone reappears now and then just to get attention, then vanishes again.",
    "summary": "Named after the old office assistant that popped up unprompted. It describes an unreliable pattern of contact that can leave someone feeling used, and it is mostly a dating-discourse label rather than a safety term.",
    "interpretations": [
      "An ex who resurfaces periodically for validation.",
      "A pattern of hot-and-cold contact.",
      "A label used after being let down repeatedly."
    ],
    "example": "“she paperclipped back into my dms after two months”",
    "contextClues": "Usually about frustration and self-respect. Repeated cycles that leave your child upset are worth discussing directly.",
    "opener": "“How do you feel when they come back like that?”",
    "category": "Sensitive Safety Topics",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "gaslighting",
    "slug": "gaslighting",
    "aliases": [
      "gaslight",
      "gaslit",
      "gaslighting me",
      "gaslighter"
    ],
    "plainMeaning": "Making someone doubt their own memory or perception of events.",
    "summary": "Originally a specific manipulation pattern; in teen use it often just means “they lied” or “we remember it differently.” The loose use is so widespread that the word alone tells you very little.",
    "interpretations": [
      "A repeated pattern of making someone doubt reality.",
      "Casual use meaning someone lied or denied something.",
      "A joke: “stop gaslighting me, you said 5pm.”"
    ],
    "example": "“he keeps saying that never happened, i feel like i’m being gaslit”",
    "contextClues": "Playful use among friends is common. A persistent pattern in a relationship—especially with isolation, pressure, or fear—deserves serious, supportive attention.",
    "opener": "“What’s been happening that makes you feel like you can’t trust your own version of it?”",
    "category": "Sensitive Safety Topics",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "block and report",
    "slug": "block-and-report",
    "aliases": [
      "block n report",
      "blocked and reported",
      "b&r",
      "report and block"
    ],
    "plainMeaning": "Blocking an account and reporting it to the platform.",
    "summary": "Often said as a joke reply to a bad take, but it is also the actual safety step young people take with strangers and harassment. Hearing it used seriously is usually a sign of good digital instincts.",
    "interpretations": [
      "A meme response to an unpopular opinion.",
      "A real action taken against harassment or a stranger.",
      "Advice given to a friend dealing with someone creepy."
    ],
    "example": "“weird dm from a random account, block and report”",
    "contextClues": "Joke usage is very common online. Used sincerely, it is worth praising and following up on what happened.",
    "opener": "“Have you ever had to actually block or report someone—what happened?”",
    "category": "Sensitive Safety Topics",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "drop your location",
    "slug": "drop-your-location",
    "aliases": [
      "drop loc",
      "drop your loc",
      "send me your location",
      "share location"
    ],
    "plainMeaning": "A request to share where someone is.",
    "summary": "Completely routine between friends meeting up, and also the single most common thing worth pausing on when it comes from an account your child doesn’t know offline.",
    "interpretations": [
      "Friends coordinating where to meet.",
      "Sharing live location with close friends or family.",
      "A stranger asking for information they shouldn’t have."
    ],
    "example": "“drop your loc, we’ll come to you”",
    "contextClues": "Who is asking is what matters. A calm rule about not sharing location with people they haven’t met offline is easier to keep than a ban.",
    "opener": "“Who do you share your location with, and how do you decide?”",
    "category": "Sensitive Safety Topics",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "money flip",
    "slug": "money-flip",
    "aliases": [
      "money flipping",
      "flip your cash",
      "cash flip",
      "flip scam"
    ],
    "plainMeaning": "A scam promising to multiply money sent to a stranger.",
    "summary": "A common social media con aimed at young people, often run from hacked or impersonated accounts and sometimes involving requests to move money for someone else. Nothing is ever flipped; the money is gone.",
    "interpretations": [
      "A fake investment or cash-multiplying offer.",
      "A scam message from a hacked friend’s account.",
      "Recruitment to move money on someone else’s behalf."
    ],
    "example": "“someone from my friend’s account offered to flip £50”",
    "contextClues": "Pressure, secrecy, urgency, and gift-card or transfer requests are the signals. Young people who get caught out are usually embarrassed, so a no-blame response matters.",
    "opener": "“If someone online offered you easy money, would you feel comfortable telling me about it?”",
    "category": "Sensitive Safety Topics",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "sugar daddy dm",
    "slug": "sugar-daddy-dm",
    "aliases": [
      "sugar daddy",
      "sugar mommy",
      "sugaring",
      "sd dm",
      "spoil you dm"
    ],
    "plainMeaning": "A message offering money or gifts in exchange for attention or images.",
    "summary": "These messages arrive unsolicited in teens’ inboxes and comment sections, often from scam or exploitative accounts. Most young people simply screenshot and laugh at them; the risk is in replying, not in receiving one.",
    "interpretations": [
      "A scam or exploitative offer sent to a stranger.",
      "A joke or meme about the messages everyone receives.",
      "An attempt to build private contact with a young person."
    ],
    "example": "“got another sugar daddy dm, blocked it 💀”",
    "contextClues": "Joking about these messages usually means they recognized them for what they are. Secrecy, gifts, or money arriving from someone online is the part to follow up on warmly.",
    "opener": "“Do you get weird messages offering money or gifts—what do you usually do with them?”",
    "category": "Sensitive Safety Topics",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "jumped",
    "slug": "jumped",
    "aliases": [
      "got jumped",
      "jump him",
      "jumping someone",
      "gonna get jumped"
    ],
    "plainMeaning": "Startled, or given a jump-start—and in other contexts, attacked by a group.",
    "summary": "Plenty of ordinary uses: being startled, a car battery being jumped, or jumping in a game. It is also used for real fights, for exaggeration about losing badly online, and for rumors traveling around a school, so it is worth asking about calmly rather than assuming either way.",
    "interpretations": [
      "Being startled: “you scared me, I jumped.”",
      "Jump-starting a car: “my dad jumped the battery.”",
      "Exaggeration about being beaten in a game.",
      "A real physical attack by several people, or a rumor about one at school."
    ],
    "example": "“the door slammed and I jumped” / “people are saying someone got jumped after school”",
    "contextClues": "Surprise, noises, cars, or game contexts are usually exactly what they sound like. Talk about a specific place, time, or named people—or about needing to avoid somewhere—is worth taking seriously and supporting.",
    "opener": "“Tell me what happened there—was that a scare, or something you’re worried about?”",
    "category": "Sensitive Safety Topics",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "galaxy gas",
    "slug": "galaxy-gas",
    "aliases": [
      "galaxygas",
      "whippets",
      "whippits",
      "nitrous",
      "n2o"
    ],
    "plainMeaning": "Flavored nitrous oxide canisters sometimes inhaled to get a brief high.",
    "summary": "Nitrous oxide has everyday culinary uses (whipped cream chargers), but flavored brands like “galaxy gas” have circulated online in connection with recreational inhaling. Mentioning it can also just mean reacting to a viral video.",
    "interpretations": [
      "Talking about or reacting to viral videos and news about the trend.",
      "Referring to someone inhaling it at a party or with friends.",
      "Plain kitchen use of whipped-cream chargers."
    ],
    "example": "“did you see that galaxy gas video lol”",
    "contextClues": "Reacting to a trend is very different from making plans to buy or use it. Inhalants carry real health risks, so a calm conversation is worthwhile even if the mention seems casual.",
    "opener": "“I keep hearing about galaxy gas—what are people at school saying about it?”",
    "category": "Substances & Party Culture",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "geek bar",
    "slug": "geek-bar",
    "aliases": [
      "geekbar",
      "geek bars",
      "geekbars"
    ],
    "plainMeaning": "A popular brand of disposable nicotine vape.",
    "summary": "Some models have small screens showing battery and liquid levels, which makes them a frequent topic of conversation. A mention may be about someone else's vape, advertising, or a teen's own use.",
    "interpretations": [
      "Naming a specific vape someone has or wants.",
      "Talking about a friend or classmate who vapes.",
      "Joking about vape culture or memes."
    ],
    "example": "“my geek bar is almost dead”",
    "contextClues": "Possessive wording or talk about flavors, charging, or getting another one suggests personal use; secondhand mentions are common too. Nicotine dependence can build quickly, so curiosity helps more than punishment.",
    "opener": "“How common are Geek Bars at school? What do you think about them?”",
    "category": "Substances & Party Culture",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "addy",
    "slug": "addy",
    "aliases": [
      "addys",
      "addies",
      "the addy",
      "drop the addy",
      "send me the addy",
      "adderall",
      "study drug",
      "study drugs"
    ],
    "plainMeaning": "Most often short for “address”—where to meet up. Much less often, short for Adderall.",
    "summary": "In everyday texting this almost always means a street address: where a party, hangout, or pickup is happening. In exam or party talk it can be short for Adderall, a prescription ADHD medication, which may be someone's own prescription or pills used or shared without one.",
    "interpretations": [
      "Asking where to go: “drop the addy and I’ll be there.”",
      "Sharing directions to a house or venue.",
      "A teen talking about their own prescribed medication.",
      "Someone asking for or offering pills around exams."
    ],
    "example": "“drop the addy, we’re leaving now” / “anyone have an addy for finals week”",
    "contextClues": "Words like drop, send, pull up, map, or a place name mean a street address—this is the common use by far. Pills, mg, doses, staying up, or finals-week focus talk point to the medication. Even then, exam pressure is often the underlying issue and worth talking about too.",
    "opener": "“Is that just the address for where everyone’s meeting, or does it mean something else?”",
    "category": "Substances & Party Culture",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "bars",
    "slug": "bars",
    "aliases": [
      "xans",
      "xanax",
      "xanax bars"
    ],
    "plainMeaning": "Slang for Xanax (alprazolam) pills—but also for good rap lyrics.",
    "summary": "In music talk, “bars” simply means impressive lyrics. In other contexts it refers to rectangular anti-anxiety pills, which appear in songs and online culture. Counterfeit pills can contain other dangerous substances.",
    "interpretations": [
      "Praising rap lyrics: “that verse was bars.”",
      "Referring to Xanax pills at a party or for sale.",
      "Quoting a song lyric."
    ],
    "example": "“that new verse is straight bars” / “someone has xans at the party”",
    "contextClues": "Music context almost always means lyrics. Mentions of “xans,” pills, taking, or buying suggest the medication meaning and are worth a calm check-in.",
    "opener": "“When people say ‘bars,’ is that about music, or something else sometimes?”",
    "category": "Substances & Party Culture",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "deepfake",
    "slug": "deepfake",
    "aliases": [
      "deepfakes",
      "ai deepfake",
      "deep fake",
      "ai nudes"
    ],
    "plainMeaning": "An AI-altered photo or video showing a real person in a fabricated situation.",
    "summary": "Deepfakes range from harmless face-swap jokes to fake intimate images used to embarrass, bully, or extort someone. Being targeted is never the victim's fault.",
    "interpretations": [
      "Funny face-swap or celebrity parody content.",
      "Fake images of a classmate being shared to humiliate them.",
      "Threats to spread fake images unless someone pays or complies."
    ],
    "example": "“someone made a deepfake of her and it's going around”",
    "contextClues": "Mentions of a real classmate, sharing, or threats suggest harm rather than a joke. A teen who is targeted needs reassurance that they won't be in trouble for asking for help.",
    "opener": "“If something like that ever happened to you or a friend, you could come to me—have you seen it going around?”",
    "category": "Sensitive Safety Topics",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "beamed",
    "slug": "beamed",
    "aliases": [
      "got beamed",
      "getting beamed"
    ],
    "plainMeaning": "Had a game account hacked or tricked out of valuable items.",
    "summary": "Common in Roblox and similar games, usually after a phishing link, a fake trade, or sharing a login.",
    "interpretations": [
      "Someone's account was compromised and items or currency stolen.",
      "Exaggerating a bad trade.",
      "Warning friends about a scam."
    ],
    "example": "“bro i got beamed, all my limiteds are gone”",
    "contextClues": "Usually a frustrating but low-risk loss. Useful moments to talk about passwords, two-factor login, and not clicking trade links.",
    "opener": "“That's really annoying—do you know how they got in? Want to secure the account together?”",
    "category": "Gaming & Streaming",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "fight page",
    "slug": "fight-page",
    "aliases": [
      "fight pages",
      "school fight page",
      "fights page"
    ],
    "plainMeaning": "A social media account that posts videos of fights, often from local schools.",
    "summary": "Students may watch these pages out of curiosity. Being filmed, posted, or pressured into a fight for views is a more serious situation.",
    "interpretations": [
      "Casually mentioning a video everyone has seen.",
      "Someone being recorded and posted without consent.",
      "Planning or hyping a fight to get it posted."
    ],
    "example": "“it's already on the fight page”",
    "contextClues": "Watching is common. Being the person in the video, or talk of an upcoming fight, is worth a supportive conversation.",
    "opener": "“Are those fight pages a big thing at your school? How do people feel about being posted?”",
    "category": "Sensitive Safety Topics",
    "concern": "attention",
    "reviewed": "September 2026"
  },
  {
    "term": "ghost ping",
    "slug": "ghost-ping",
    "aliases": [
      "ghostping",
      "ghost pinged",
      "ghost pinging"
    ],
    "plainMeaning": "Tagging someone in a message, then deleting it before they see it.",
    "summary": "Most common on Discord. The person gets a notification but finds nothing there, which is usually a prank or mild annoyance.",
    "interpretations": [
      "A prank to confuse a friend.",
      "An accidental mention quickly deleted.",
      "Mild annoyance when it's repeated."
    ],
    "example": "“who ghost pinged me”",
    "contextClues": "Typically playful. Only notable if it's part of repeated targeting by a group.",
    "opener": "“Ha, what's a ghost ping—is that a prank thing?”",
    "category": "Gaming & Streaming",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "bop",
    "slug": "bop",
    "aliases": [
      "bops",
      "such a bop"
    ],
    "plainMeaning": "Usually a catchy, great song; sometimes an insult for a girl.",
    "summary": "Most often praise for music. On some social platforms it has also been used as a slut-shaming label, so context matters.",
    "interpretations": [
      "“This song is a bop” — it's catchy.",
      "A derogatory label aimed at a girl's reputation.",
      "Quoting a meme or trend."
    ],
    "example": "“this song is such a bop”",
    "contextClues": "About music, it's harmless. Aimed at a person—especially in comments or group chats—it may be part of rumors or bullying.",
    "opener": "“When people call a person a ‘bop,’ what does that mean? Is it mean?”",
    "category": "General slang",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "chopped",
    "slug": "chopped",
    "aliases": [
      "looking chopped",
      "chopped chin"
    ],
    "plainMeaning": "Unattractive or looking bad.",
    "summary": "A blunt teasing word about appearance, often used among friends and in memes.",
    "interpretations": [
      "Playful roasting between friends.",
      "Harsh comments about someone's looks.",
      "Self-deprecating jokes."
    ],
    "example": "“nah i look chopped in this pic”",
    "contextClues": "Usually banter. Repeated use against one person, or a teen using it about themselves often, may connect to appearance worries.",
    "opener": "“Do people say ‘chopped’ as a joke, or does it ever sting?”",
    "category": "General slang",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "tweaking",
    "slug": "tweaking",
    "aliases": [
      "tweakin",
      "you're tweaking",
      "ur tweaking"
    ],
    "plainMeaning": "Acting irrational, overreacting, or saying something ridiculous.",
    "summary": "Common everyday slang, like “you're crazy.” It originally related to drug use, but teens almost always use it to mean overreacting.",
    "interpretations": [
      "“You're tweaking” — you're being unreasonable.",
      "Describing someone acting strangely.",
      "Rarely, a literal drug-related meaning."
    ],
    "example": "“you're tweaking, it was not that bad”",
    "contextClues": "Almost always casual. Only consider other meanings if paired with clear substance references.",
    "opener": "“Who was tweaking—what happened?”",
    "category": "General slang",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "say less",
    "slug": "say-less",
    "aliases": [
      "sayless",
      "say no more"
    ],
    "plainMeaning": "Got it; no need to explain further—I'm in.",
    "summary": "An enthusiastic agreement or acknowledgment.",
    "interpretations": [
      "Agreeing to a plan.",
      "Signaling understanding."
    ],
    "example": "“wanna get food after?” “say less”",
    "contextClues": "Friendly and positive.",
    "opener": "“Sounds like plans got made fast—where are you heading?”",
    "category": "General slang",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "standing on business",
    "slug": "standing-on-business",
    "aliases": [
      "stand on business",
      "on business"
    ],
    "plainMeaning": "Following through, keeping your word, or backing up what you said.",
    "summary": "Praise for someone who does what they said they'd do or holds firm to their principles.",
    "interpretations": [
      "Keeping a promise or commitment.",
      "Holding a firm position.",
      "Occasionally hype before a confrontation."
    ],
    "example": "“she said she'd finish it and she did—standing on business”",
    "contextClues": "Usually admiring. Only look closer if it's tied to a threatened fight.",
    "opener": "“Who was standing on business? Sounds like they came through.”",
    "category": "General slang",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "motion",
    "slug": "motion",
    "aliases": [
      "got motion",
      "having motion",
      "no motion"
    ],
    "plainMeaning": "Momentum, success, or social influence—often with money or dating.",
    "summary": "Someone with “motion” is doing well; “no motion” means nothing's happening for them.",
    "interpretations": [
      "Social popularity or dating success.",
      "Making money or progress.",
      "Teasing a friend with “no motion.”"
    ],
    "example": "“he got motion since the video blew up”",
    "contextClues": "Casual praise or teasing.",
    "opener": "“What does having motion look like these days?”",
    "category": "General slang",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "mb",
    "slug": "mb",
    "aliases": [
      "my bad"
    ],
    "plainMeaning": "My bad—a quick apology.",
    "summary": "A casual way to admit a small mistake.",
    "interpretations": [
      "Apologizing for a typo, lateness, or misunderstanding."
    ],
    "example": "“mb i didn't see ur text”",
    "contextClues": "Everyday and friendly.",
    "opener": "“No worries—what happened?”",
    "category": "Abbreviations",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "ofc",
    "slug": "ofc",
    "aliases": [
      "of course"
    ],
    "plainMeaning": "Of course.",
    "summary": "Texting shorthand for agreement or reassurance.",
    "interpretations": [
      "Friendly agreement.",
      "Sometimes sarcastic, depending on tone."
    ],
    "example": "“can u come?” “ofc”",
    "contextClues": "Everyday usage.",
    "opener": "“Sounds like you're in—what's the plan?”",
    "category": "Abbreviations",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "lmk",
    "slug": "lmk",
    "aliases": [
      "let me know"
    ],
    "plainMeaning": "Let me know.",
    "summary": "Asking someone to follow up with an answer or update.",
    "interpretations": [
      "Requesting a reply about plans or information."
    ],
    "example": "“lmk if you're coming”",
    "contextClues": "Everyday usage.",
    "opener": "“Are you waiting to hear back from someone?”",
    "category": "Abbreviations",
    "concern": "harmless",
    "reviewed": "September 2026"
  },
  {
    "term": "tw / cw",
    "slug": "tw",
    "aliases": [
      "tw",
      "cw",
      "trigger warning",
      "content warning"
    ],
    "plainMeaning": "Trigger warning / content warning.",
    "summary": "A courtesy label placed before posts discussing difficult topics such as self-harm, abuse, or violence. It signals care, though it is also sometimes used jokingly.",
    "interpretations": [
      "A genuine warning before sensitive content.",
      "A joking warning before something mildly cringey."
    ],
    "example": "“tw: talking about some heavy stuff”",
    "contextClues": "Using warnings is a considerate habit. What follows the warning matters more—if it's about their own struggles, a gentle check-in helps.",
    "opener": "“I noticed that warning—is the post about something you've been dealing with?”",
    "category": "Abbreviations",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "leaf emoji (🍃)",
    "slug": "leaf-emoji",
    "aliases": [
      "🍃",
      "leaf emoji",
      "leaves emoji"
    ],
    "plainMeaning": "Nature and fresh vibes—or coded shorthand for cannabis.",
    "summary": "Frequently decorative (spring, calm, aesthetics). In some contexts it hints at weed.",
    "interpretations": [
      "Nature, relaxing, or aesthetic decoration.",
      "A hint about smoking cannabis."
    ],
    "example": "“chill night 🍃”",
    "contextClues": "Look at the rest of the message. Paired with smoke 💨, plans, or other substance terms, the cannabis meaning is more likely.",
    "opener": "“Chill night sounds nice—what are you up to?”",
    "category": "Emojis & Symbols",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "plug emoji (🔌)",
    "slug": "plug-emoji",
    "aliases": [
      "🔌",
      "plug emoji"
    ],
    "plainMeaning": "A connection or supplier—sometimes a drug dealer; also literal electronics.",
    "summary": "Echoes the slang “plug”: someone who can get you things, from concert tickets and sneakers to drugs.",
    "interpretations": [
      "Someone with good connections for tickets, merch, or deals.",
      "A supplier of substances.",
      "Literally about charging or electronics."
    ],
    "example": "“he's the 🔌 for sneakers”",
    "contextClues": "What's being supplied matters. Mentions of vapes, pills, or weed alongside the emoji suggest the substance meaning.",
    "opener": "“What is he the plug for?”",
    "category": "Emojis & Symbols",
    "concern": "discuss",
    "reviewed": "September 2026"
  },
  {
    "term": "shush and point emojis (🤫🧏)",
    "slug": "shush-and-point-emojis",
    "aliases": [
      "🤫🧏",
      "🤫🧏‍♂️",
      "🤫🧏‍♀️",
      "mewing emojis"
    ],
    "plainMeaning": "The “mewing” gesture meme—a silly way to avoid answering.",
    "summary": "Mimics students pressing a finger to their lips and pointing at their jaw to show they're “mewing” and can't talk. Mostly a joke dodge.",
    "interpretations": [
      "Playfully refusing to answer a question.",
      "Referencing the jawline “mewing” meme."
    ],
    "example": "“did u do the homework?” “🤫🧏”",
    "contextClues": "Playful meme. Only worth noticing if paired with appearance anxiety.",
    "opener": "“Is that the mewing thing? Show me how it goes.”",
    "category": "Emojis & Symbols",
    "concern": "harmless",
    "reviewed": "September 2026"
  }
]

terms.push(...expansionTerms)

export const categories: Array<'All terms' | Category> = [
  'All terms',
  'General slang',
  'Abbreviations',
  'Emojis & Symbols',
  'Gaming & Streaming',
  'Social Media Culture',
  'Relationships & Dating',
  'Substances & Party Culture',
  'Mental Well-being',
  'Sensitive Safety Topics',
]

export const concernLabel: Record<Concern, string> = {
  harmless: 'Usually harmless',
  discuss: 'Worth discussing',
  attention: 'May need attention',
}

export const findTerm = (slug?: string) => terms.find((item) => item.slug === slug)

export function searchTerms(query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return terms
  return terms.filter((item) =>
    [item.term, ...item.aliases, item.plainMeaning, item.summary, item.category]
      .join(' ')
      .toLowerCase()
      .includes(q),
  )
}

export function decodeMessage(message: string) {
  const text = message.toLowerCase()
  return terms
    .filter((item) => [item.term, ...item.aliases].some((alias) => {
      const a = alias.toLowerCase()
      if (!a) return false
      if (/[^a-z0-9\s]/i.test(a) && !/[a-z0-9]/i.test(a)) return text.includes(a)
      return new RegExp(`(^|[^a-z0-9])${a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`, 'i').test(text)
    }))
    .sort((a, b) => text.indexOf(a.term.toLowerCase()) - text.indexOf(b.term.toLowerCase()))
}
