/**
 * Central State Store for SpeakUp with localStorage persistence.
 * Synchronizes:
 * - Active Role & Profile Selection
 * - Fictional Student Profiles (including 4 Exhibition Demonstration Profiles)
 * - Individual Learning Plans (ILPs), Grouped Learning Goals & Adjustable Supports
 * - Ordinary Classroom Observations (separated from Optional Clinical/SLP Recommendations)
 * - Mood Tracking history (recorded per student, non-blocking)
 * - Stars, Streak, and Badges
 * - Skill-Specific Practice Observations & Activity History
 * - Custom AAC phrases
 * - Teacher assignments & Lesson Plans
 */

const STORAGE_KEY = 'speakup_app_state_v3';

export const LEARNING_GOAL_CATALOG = [
  { id: 'speech-sounds', label: 'Practising selected speech sounds', module: 'speak-practise', icon: '🎙️' },
  { id: 'letter-sounds', label: 'Connecting letters and sounds', module: 'sound-garden', icon: '🔤' },
  { id: 'sentence-construction', label: 'Constructing sentences', module: 'sentence-treehouse', icon: '🌳' },
  { id: 'everyday-vocab', label: 'Expanding everyday vocabulary', module: 'think-discover', icon: '📚' },
  { id: 'wh-questions', label: 'Understanding WH questions', module: 'think-discover', icon: '🔍' },
  { id: 'aac-needs', label: 'Communicating everyday needs through AAC', module: 'what-do-i-need', icon: '⛵' },
  { id: 'event-sequencing', label: 'Sequencing and describing events', module: 'tenses-adventure', icon: '⏳' },
  { id: 'functional-communication', label: 'Expressing everyday choices, requests & feelings', module: 'what-do-i-need', icon: '💬' }
];

export const DEFAULT_STUDENT_SUPPORTS = {
  pictureCues: true,
  audioModels: true,
  sentenceStarters: true,
  wordBanks: true,
  fewerChoices: false,
  independentResponses: true
};

export const INITIAL_STUDENT_PROFILES = {
  kuhendra: {
    id: 'kuhendra',
    name: 'Kuhendra Kumar',
    nickname: 'Kuhendra',
    studentCode: 'SPK-2026-01',
    avatar: '👦🏽',
    ageBand: '7-9 years (Grade 3)',
    isExhibitionProfile: true,
    exhibitionNumber: 4,
    exhibitionRoleTitle: 'Profile 4: Understanding WH Questions & Expressing Ideas',
    learningNeedsSummary: 'Experiences receptive and expressive spoken language challenges when answering "When" and "Why" questions and organizing multi-word responses in classroom discussions.',
    strengths: 'Strong visual memory, enthusiastic participant when supported by picture cues, enjoys interactive stories with Pip.',
    communicationPreferences: 'Prefers hearing an audio model and seeing visual story cards before answering questions or building a sentence.',
    limitationStatement: 'SpeakUp supports receptive WH comprehension and structured sentence building with visual scaffolds, but does not replace a comprehensive language assessment or individualized clinical language therapy.',
    targetFocus: 'Understanding WH questions & multi-word idea expression',
    currentSound: '/r/',
    assignedWord: 'Umbrella',
    assignedEmoji: '☂️',
    assignedPhrase: 'my big umbrella',
    assignedSentence: 'I use an umbrella when it rains.',
    assignedWhCategory: 'When & Why',
    assignedAacScenario: 'Rainy Day Needs',
    selectedGoalIds: ['wh-questions', 'everyday-vocab', 'sentence-construction', 'speech-sounds'],
    assignedModules: ['think-discover', 'sentence-treehouse', 'sound-garden', 'speak-practise', 'what-do-i-need'],
    supports: { ...DEFAULT_STUDENT_SUPPORTS },
    classroomObservations: 'Kuhendra accurately answers "What" and "Where" questions when picture cues are visible, and is beginning to use "when" and "because" to explain everyday events.',
    slpRecommendations: 'School SLP recommended visual WH sorting (Who/What/Where/When/Why) paired with sentence starters ("I use ___ when ___") and optional, low-pressure listening models for /r/ vocabulary.',
    slpFollowUpActions: 'Review "When" vs. "Why" comprehension accuracy with classroom teacher on 2026-11-15; continue providing visual sentence frames during morning circle.',
    outOfScopeFlags: [],
    individualLearningPlan: {
      learningGoal: 'Understand WH questions (especially When and Why) and express connected ideas using structured sentence frames.',
      observedSupportNeed: 'Needs visual cues and audio models to process "When" and "Why" questions before formulating a complete sentence.',
      selectedModules: ['Think & Discover (WH Questions)', 'Sentence Treehouse (Builder & Conjunctions)', 'Sound Garden (Umbrella vocabulary)'],
      recommendedSupports: ['Picture cues', 'Audio models', 'Sentence starters', 'Word banks'],
      targetReviewDate: '2026-11-15',
      teacherNotes: 'Responds well when the same core vocabulary word ("Umbrella") is previewed in Think & Discover before building a sentence in Sentence Treehouse.',
      reviewOutcome: 'In Progress — Consistently answering What/Where; gaining confidence with When/Why clues.'
    },
    activityHistory: [
      { id: 'ah-k1', date: '2026-10-29', module: 'Think & Discover', activity: 'WH Question Explorer (What & When)', detail: 'Answered 4 WH questions using picture cues and audio models ("Umbrella", "Raincoat").', supportsUsed: ['Picture cues', 'Audio models'], category: 'wh' },
      { id: 'ah-k2', date: '2026-10-28', module: 'Sentence Treehouse', activity: 'Connect the Sentence (Time)', detail: 'Constructed: "I use an umbrella when it rains."', supportsUsed: ['Sentence starters', 'Word banks'], category: 'sentence' },
      { id: 'ah-k3', date: '2026-10-26', module: 'Speak & Practise', activity: 'Target Word Listening', detail: 'Listened to normal and slow audio models for "Umbrella" (2 optional practice recordings saved).', supportsUsed: ['Audio models'], category: 'speech' }
    ],
    customRecommendations: null,
    skillObservations: {
      receptiveWh: 4,
      phonicsSpelling: 3,
      sentenceFormulation: 3,
      aacCommunication: 2,
      speechModelPractice: 2
    },
    goals: [
      { id: 'g1', text: 'Identify "Umbrella" in Think & Discover WH questions', progress: 'Complete ✅', done: true },
      { id: 'g2', text: 'Listen to the slow audio model in Speak & Practice', progress: 'Complete ✅', done: true },
      { id: 'g3', text: 'Build "I use an umbrella when it rains" in Sentence Treehouse', progress: 'In Progress', done: false }
    ],
    todayQuest: {
      id: 'quest-kuhendra',
      title: 'Rainy Day Umbrella Quest!',
      word: 'Umbrella',
      emoji: '☂️',
      description: 'Explore "Umbrella" across WH questions, letter patterns, sentence building, and optional voice practice with Pip.',
      actionType: 'sound-garden',
      stepName: 'Step 2: Explore Umbrella with Pip',
      badge: 'HOPPING SPROUT'
    },
    learningPath: [
      { id: 'lp1', step: 'Step 1', title: 'Think & Discover: Rainy Day Clue', status: 'completed', icon: '🔍', action: 'think-discover' },
      { id: 'lp2', step: 'Step 2', title: 'Sound Garden: Build "Umbrella"', status: 'current', icon: '🔤', action: 'sound-garden' },
      { id: 'lp3', step: 'Step 3', title: 'Sentence Treehouse: Expand Sentence', status: 'upcoming', icon: '🌳', action: 'sentence-builder' }
    ],
    growth: {
      wordsExplored: 6,
      kindStreak: 4,
      sproutTitle: 'Little Sprout: Growing nicely!',
      sproutIcon: '🌱',
      sproutDesc: 'You took 4 practice steps this week. Your sprout is growing strong leaves!'
    },
    stars: 18,
    streak: 4,
    moodHistory: []
  },
  aarav: {
    id: 'aarav',
    name: 'Aarav Sharma',
    nickname: 'Aarav',
    studentCode: 'SPK-2026-02',
    avatar: '👦🏽',
    ageBand: '6-8 years (Grade 2)',
    isExhibitionProfile: true,
    exhibitionNumber: 1,
    exhibitionRoleTitle: 'Profile 1: Practising Selected Speech Sounds & Letter-Sound Links',
    learningNeedsSummary: 'Working on speech sound awareness and production for fricatives and digraphs (/s/ and /sh/) alongside phonological pattern recognition in early literacy.',
    strengths: 'Curious learner who enjoys hands-on letter tiles, flipbook word building, and self-paced listening playback.',
    communicationPreferences: 'Likes listening to the slow audio model twice before attempting optional spoken recording; prefers zero time pressure.',
    limitationStatement: 'Literacy and phonological awareness activities in Sound Garden do not automatically resolve speech production difficulties. SpeakUp does not acoustically score pronunciation accuracy; target words are selected with SLP guidance.',
    targetFocus: 'Speech Sound /s/ & /sh/ digraphs',
    currentSound: '/s/',
    assignedWord: 'Ship',
    assignedEmoji: '🚢',
    assignedPhrase: 'a big blue ship',
    assignedSentence: 'The ship sails across the water.',
    assignedWhCategory: 'Where & What',
    assignedAacScenario: 'Classroom Tools',
    selectedGoalIds: ['speech-sounds', 'letter-sounds', 'everyday-vocab'],
    assignedModules: ['sound-garden', 'speak-practise', 'think-discover'],
    supports: { ...DEFAULT_STUDENT_SUPPORTS },
    classroomObservations: 'Aarav reliably identifies the "sh" spelling pattern in Sound Garden and enjoys comparing Beginning vs. Ending sound positions.',
    slpRecommendations: 'Focus on auditory bombardment and slow-model listening for initial /sh/ words ("Ship", "Shell", "Shoe") before optional self-monitored spoken attempts.',
    slpFollowUpActions: 'Share Aarav’s saved self-practice audio clips from Speak & Practise during next fortnightly SLP check-in.',
    outOfScopeFlags: [],
    individualLearningPlan: {
      learningGoal: 'Identify /sh/ and /s/ letter-sound patterns in familiar words and practise teacher-selected target words with slow audio models.',
      observedSupportNeed: 'Benefits from clear visual pattern highlighting (digraph "sh") and unhurried, repeatable audio models.',
      selectedModules: ['Sound Garden (Flipbook & Sound Positions)', 'Speak & Practise (Slow Audio Model & Self-Listening)', 'Think & Discover (Vocabulary Context)'],
      recommendedSupports: ['Picture cues', 'Audio models', 'Word banks'],
      targetReviewDate: '2026-11-12',
      teacherNotes: 'Keep spoken recording strictly optional; celebrate listening and pattern identification equally.',
      reviewOutcome: 'On Track — Completed 6 phonics pattern words and 4 self-paced listening sessions.'
    },
    activityHistory: [
      { id: 'ah-a1', date: '2026-10-29', module: 'Sound Garden', activity: 'Interactive Word Flipbook', detail: 'Built "Ship" and "Brush", highlighted the "sh" digraph pattern in beginning and ending positions.', supportsUsed: ['Picture cues', 'Audio models'], category: 'phonics' },
      { id: 'ah-a2', date: '2026-10-28', module: 'Speak & Practise', activity: 'Target Word Audio Model & Recording', detail: 'Listened to slow model for "Ship" and recorded 2 self-monitored practice clips.', supportsUsed: ['Audio models'], category: 'speech' },
      { id: 'ah-a3', date: '2026-10-25', module: 'Think & Discover', activity: 'Everyday Vocabulary Check', detail: 'Matched "Ship" and "Water" in Where-question context.', supportsUsed: ['Picture cues'], category: 'wh' }
    ],
    customRecommendations: null,
    skillObservations: {
      receptiveWh: 5,
      phonicsSpelling: 6,
      sentenceFormulation: 2,
      aacCommunication: 2,
      speechModelPractice: 4
    },
    goals: [
      { id: 'g1', text: 'Highlight the "sh" pattern in Ship (Sound Garden)', progress: '3 of 4 words', done: false },
      { id: 'g2', text: 'Listen to slow model in Speak & Practice', progress: 'Complete ✅', done: true }
    ],
    todayQuest: {
      id: 'quest-aarav',
      title: 'Sail the Sunny Ship!',
      word: 'Ship',
      emoji: '🚢',
      description: 'Build the word "Ship", highlight the "sh" digraph, and listen to Pip model the sound.',
      actionType: 'sound-garden',
      stepName: 'Step 2: Build "Ship" in Sound Garden',
      badge: 'SUNNY SPROUT'
    },
    learningPath: [
      { id: 'lp1', step: 'Step 1', title: 'Listen to /sh/ in Ship', status: 'completed', icon: '🎧', action: 'sound-garden' },
      { id: 'lp2', step: 'Step 2', title: 'Practice "Ship" at your pace', status: 'current', icon: '🎙️', action: 'speak-practise' },
      { id: 'lp3', step: 'Step 3', title: 'Find WHERE ships sail', status: 'upcoming', icon: '🌳', action: 'think-discover' }
    ],
    growth: {
      wordsExplored: 8,
      kindStreak: 5,
      sproutTitle: 'Sunny Sprout: Blooming bright!',
      sproutIcon: '🌻',
      sproutDesc: 'Wonderful consistency! You explored 8 words with Pip this week.'
    },
    stars: 24,
    streak: 5,
    moodHistory: []
  },
  siti: {
    id: 'siti',
    name: 'Siti Nurhaliza',
    nickname: 'Siti',
    studentCode: 'SPK-2026-03',
    avatar: '👧🏽',
    ageBand: '7-9 years (Grade 3)',
    isExhibitionProfile: true,
    exhibitionNumber: 2,
    exhibitionRoleTitle: 'Profile 2: Expanding Vocabulary & Constructing Sentences',
    learningNeedsSummary: 'Working on combining everyday vocabulary into grammatically complete sentences, linking clauses with conjunctions (purpose, time, reason), and sequencing past/present/future events.',
    strengths: 'Imaginative storyteller who enjoys sequencing picture scenes and expanding basic sentences once she has a visual word bank.',
    communicationPreferences: 'Benefits from colour-coded sentence slots (Subject + Verb + Object) before transitioning to independent sentence construction.',
    limitationStatement: 'Sentence Treehouse provides structured grammar and conjunction practice for familiar classroom contexts, but does not assess spontaneous conversational syntax or diagnose spoken language disorders.',
    targetFocus: 'Sentence Formulation, Conjunctions & Tenses',
    currentSound: 'Sentence Flow',
    assignedWord: 'Jacket',
    assignedEmoji: '🧥',
    assignedPhrase: 'a warm jacket',
    assignedSentence: 'I wear a jacket because I feel cold.',
    assignedWhCategory: 'Why & When',
    assignedAacScenario: 'Weather & Clothing',
    selectedGoalIds: ['everyday-vocab', 'sentence-construction', 'event-sequencing'],
    assignedModules: ['sentence-treehouse', 'tenses-adventure', 'think-discover'],
    supports: { ...DEFAULT_STUDENT_SUPPORTS },
    classroomObservations: 'Siti builds Subject-Verb-Object sentences confidently with picture cues and is now practising optional sentence expansion using "because", "when", and "to".',
    slpRecommendations: 'Encourage Siti to build a core sentence first ("I wear a jacket") and then add a reason clause ("because I feel cold"). Use Tenses Adventure to contrast Yesterday, Today, and Tomorrow.',
    slpFollowUpActions: 'Gradually fade sentence starters on familiar items so Siti can test independent word-bank construction.',
    outOfScopeFlags: [],
    individualLearningPlan: {
      learningGoal: 'Construct grammatically appropriate sentences, expand them with functional conjunctions (to, when, because), and sequence Yesterday/Today/Tomorrow verb forms.',
      observedSupportNeed: 'Requires colour-coded phrase slots and visual time clues when shifting between past, present, and future verb forms.',
      selectedModules: ['Sentence Treehouse (Structured Sentence Builder & Conjunctions)', 'Sentence Treehouse: Tenses Adventure', 'Think & Discover (Vocabulary & Why Questions)'],
      recommendedSupports: ['Picture cues', 'Sentence starters', 'Word banks', 'Independent responses'],
      targetReviewDate: '2026-11-18',
      teacherNotes: 'Do not force indirect objects in sentences where Subject + Verb + Direct Object is most natural.',
      reviewOutcome: 'Progressing Well — Assembled 7 complete sentences and 3 expanded conjunction clauses this week.'
    },
    activityHistory: [
      { id: 'ah-s1', date: '2026-10-30', module: 'Sentence Treehouse', activity: 'Structured Sentence Builder & Expansion', detail: 'Built "I wear a jacket" and expanded with reason: "I wear a jacket because I feel cold."', supportsUsed: ['Picture cues', 'Sentence starters', 'Word banks'], category: 'sentence' },
      { id: 'ah-s2', date: '2026-10-28', module: 'Sentence Treehouse', activity: 'Tenses Adventure (Time Tree)', detail: 'Sequenced Yesterday ("Pip played"), Today ("Pip plays"), and Tomorrow ("Pip will play").', supportsUsed: ['Picture cues', 'Word banks'], category: 'sentence' },
      { id: 'ah-s3', date: '2026-10-27', module: 'Think & Discover', activity: 'Why Question Reasoning', detail: 'Answered 3 Why questions connecting everyday items to their purpose.', supportsUsed: ['Audio models'], category: 'wh' }
    ],
    customRecommendations: null,
    skillObservations: {
      receptiveWh: 6,
      phonicsSpelling: 4,
      sentenceFormulation: 7,
      aacCommunication: 3,
      speechModelPractice: 3
    },
    goals: [
      { id: 'g1', text: 'Expand sentences with "to", "when", and "because"', progress: '1 of 2 done', done: false },
      { id: 'g2', text: 'Sequence Yesterday, Today, Tomorrow in Tenses Adventure', progress: 'Upcoming', done: false }
    ],
    todayQuest: {
      id: 'quest-siti',
      title: 'Build & Expand a Story Sentence!',
      word: 'Jacket',
      emoji: '🧥',
      description: 'Construct "I wear a jacket" and expand it with a reason ("because I feel cold").',
      actionType: 'sentence-builder',
      stepName: 'Step 1: Pick Subject & Verb',
      badge: 'STORY BUILDER'
    },
    learningPath: [
      { id: 'lp1', step: 'Step 1', title: 'Think & Discover: WHY Questions', status: 'completed', icon: '🔍', action: 'think-discover' },
      { id: 'lp2', step: 'Step 2', title: 'Build & Expand Sentence', status: 'current', icon: '🧩', action: 'sentence-builder' },
      { id: 'lp3', step: 'Step 3', title: 'Tenses Adventure: Time Tree', status: 'upcoming', icon: '⏳', action: 'tenses-adventure' }
    ],
    growth: {
      wordsExplored: 12,
      kindStreak: 3,
      sproutTitle: 'Story Sapling: Expanding leaves!',
      sproutIcon: '🌿',
      sproutDesc: 'Every sentence helps Pip understand stories better. Keep it up!'
    },
    stars: 30,
    streak: 3,
    moodHistory: []
  },
  daniel: {
    id: 'daniel',
    name: 'Daniel Brooks',
    nickname: 'Daniel',
    studentCode: 'SPK-2026-04',
    avatar: '👦🏿',
    ageBand: '5-7 years (Grade 1)',
    isExhibitionProfile: true,
    exhibitionNumber: 3,
    exhibitionRoleTitle: 'Profile 3: Communicating Everyday Needs through AAC',
    learningNeedsSummary: 'Benefits from Augmentative and Alternative Communication (AAC) symbols and speech output to express everyday needs, requests, feelings, and classroom choices without pressure to speak.',
    strengths: 'Quickly locates core symbols on the visual communication board and initiates clear requests ("I want water", "I need help", "I want a break").',
    communicationPreferences: 'Uses the Free AAC Communication Board and My Talking Board with Text-to-Speech output; prefers fewer visual distractors when answering scenario questions.',
    limitationStatement: 'AAC supports communication and does not prevent speech development. SpeakUp’s AAC board supports classroom learning and immediate communication needs, but does not replace a customized clinical SGD/AAC evaluation.',
    targetFocus: 'Functional AAC Communication & Everyday Vocabulary',
    currentSound: 'Functional AAC',
    assignedWord: 'Water',
    assignedEmoji: '🥛',
    assignedPhrase: 'I want water',
    assignedSentence: 'I want water because I am thirsty.',
    assignedWhCategory: 'What & Feelings',
    assignedAacScenario: 'Thirsty, Tired & Asking for Help',
    selectedGoalIds: ['aac-needs', 'functional-communication', 'everyday-vocab'],
    assignedModules: ['what-do-i-need', 'think-discover', 'sound-garden'],
    supports: { ...DEFAULT_STUDENT_SUPPORTS, fewerChoices: true },
    classroomObservations: 'Daniel independently selects "I want" + "water" and "I need" + "break" on the Free Choice Communication Board and uses the Speak Message button to share with peers.',
    slpRecommendations: 'Ensure immediate, unrestricted access to the Free AAC Communication Board without requiring quiz completion or spoken repetition first. Model 2- to 3-symbol combinations during daily routines.',
    slpFollowUpActions: 'Coordinate with family and assistive technology specialist to ensure consistent core symbol vocabulary across home and school.',
    outOfScopeFlags: [],
    individualLearningPlan: {
      learningGoal: 'Use symbol-based AAC and Text-to-Speech to communicate everyday requests, feelings, and refusal/break needs independently.',
      observedSupportNeed: 'Needs direct access to core and fringe symbols with fewer visual choices during structured scenarios and zero demand for spoken output.',
      selectedModules: ['What Do I Need? (Free Choice AAC Board & Scenarios)', 'My Talking Board (Quick Phrases)', 'Think & Discover (Everyday Vocabulary with Fewer Choices)'],
      recommendedSupports: ['Picture cues', 'Audio models', 'Fewer answer choices'],
      targetReviewDate: '2026-11-10',
      teacherNotes: 'Never withhold AAC access until spoken speech is attempted. Honour all symbol, gesture, and TTS communications immediately.',
      reviewOutcome: 'Active & Effective — Assembled 6 functional multi-symbol messages across classroom routines.'
    },
    activityHistory: [
      { id: 'ah-d1', date: '2026-10-30', module: 'What Do I Need? (AAC Board)', activity: 'Free Choice Communication Board', detail: 'Assembled and spoke: "I want water" and "I need a break" using symbol strip + TTS.', supportsUsed: ['Picture cues', 'Audio models'], category: 'aac' },
      { id: 'ah-d2', date: '2026-10-29', module: 'What Do I Need? (AAC Board)', activity: 'Everyday Scenario Communication', detail: 'Completed "I am thirsty — what do I need?" and "I cannot open this — what can I communicate?"', supportsUsed: ['Picture cues', 'Fewer choices'], category: 'aac' },
      { id: 'ah-d3', date: '2026-10-27', module: 'Think & Discover', activity: 'Receptive Vocabulary Identification', detail: 'Selected everyday classroom and self-care items with reduced choice array.', supportsUsed: ['Picture cues', 'Fewer choices'], category: 'wh' }
    ],
    customRecommendations: null,
    skillObservations: {
      receptiveWh: 4,
      phonicsSpelling: 2,
      sentenceFormulation: 2,
      aacCommunication: 6,
      speechModelPractice: 1
    },
    goals: [
      { id: 'g1', text: 'Assemble 2 messages on the Free AAC Communication Board', progress: '1 of 2 done', done: false },
      { id: 'g2', text: 'Explore everyday needs in What Do I Need?', progress: 'In Progress', done: false }
    ],
    todayQuest: {
      id: 'quest-daniel',
      title: 'Communicate Everyday Needs!',
      word: 'Water',
      emoji: '🥛',
      description: 'Use the communication board symbols to assemble messages like "I want water" or "I need help".',
      actionType: 'what-do-i-need',
      stepName: 'Step 1: Free Communication Board',
      badge: 'LISTENING BUDDY'
    },
    learningPath: [
      { id: 'lp1', step: 'Step 1', title: 'Free AAC Communication Board', status: 'completed', icon: '🧸', action: 'what-do-i-need' },
      { id: 'lp2', step: 'Step 2', title: 'Explore WHAT & WHY Clues', status: 'current', icon: '🔍', action: 'think-discover' },
      { id: 'lp3', step: 'Step 3', title: 'Sound Garden: Letter Sounds', status: 'upcoming', icon: '🔤', action: 'sound-garden' }
    ],
    growth: {
      wordsExplored: 5,
      kindStreak: 2,
      sproutTitle: 'Budding Sprout: Roots taking hold!',
      sproutIcon: '🌱',
      sproutDesc: 'You communicated your needs clearly today.'
    },
    stars: 14,
    streak: 2,
    moodHistory: []
  },
  meilin: {
    id: 'meilin',
    name: 'Mei Lin Chen',
    nickname: 'Mei Lin',
    studentCode: 'SPK-2026-05',
    avatar: '👧🏻',
    ageBand: '6-8 years (Grade 2)',
    isExhibitionProfile: false,
    exhibitionNumber: 5,
    exhibitionRoleTitle: 'Additional Classroom Profile: Blends & Purpose Sentences',
    learningNeedsSummary: 'Developing phonological awareness of consonant blends (/br/, /fl/, /tr/) and connecting everyday objects to their purpose using "to" clauses.',
    strengths: 'Strong spelling pattern recognition and high engagement with Sound Garden flipbooks.',
    communicationPreferences: 'Enjoys building words with letter cards first and then using the same word in Sentence Treehouse.',
    limitationStatement: 'SpeakUp supports classroom phonics and sentence formulation goals as an educational supplement.',
    targetFocus: 'Phonological Blends (/br/, /sh/, /ch/) & Spelling Patterns',
    currentSound: 'Blends',
    assignedWord: 'Broom',
    assignedEmoji: '🧹',
    assignedPhrase: 'use a broom',
    assignedSentence: 'I use a broom to sweep the floor.',
    assignedWhCategory: 'What & Why',
    assignedAacScenario: 'Classroom Helpers',
    selectedGoalIds: ['letter-sounds', 'speech-sounds', 'sentence-construction'],
    assignedModules: ['sound-garden', 'speak-practise', 'sentence-treehouse'],
    supports: { ...DEFAULT_STUDENT_SUPPORTS },
    classroomObservations: 'Mei Lin accurately spots initial blends ("br" in Broom, "tr" in Tree) and links purpose clauses in Sentence Treehouse.',
    slpRecommendations: 'Continue linking Sound Garden target words directly into Sentence Treehouse purpose ("to") sentences.',
    slpFollowUpActions: 'Review blend generalization in classroom reading next month.',
    outOfScopeFlags: [],
    individualLearningPlan: {
      learningGoal: 'Recognize consonant blends in familiar vocabulary and construct purpose sentences ("I use a ___ to ___").',
      observedSupportNeed: 'Benefits from highlighted blend patterns and structured conjunction prompts.',
      selectedModules: ['Sound Garden', 'Sentence Treehouse (Conjunctions)', 'Speak & Practise'],
      recommendedSupports: ['Picture cues', 'Audio models', 'Word banks'],
      targetReviewDate: '2026-11-20',
      teacherNotes: 'Ready for optional sentence expansion challenges.',
      reviewOutcome: 'On Track — High engagement across Sound Garden and Sentence Treehouse.'
    },
    activityHistory: [
      { id: 'ah-m1', date: '2026-10-29', module: 'Sound Garden', activity: 'Blend Pattern Flipbook', detail: 'Completed "Broom" and "Tree", identifying initial blends.', supportsUsed: ['Picture cues', 'Audio models'], category: 'phonics' },
      { id: 'ah-m2', date: '2026-10-28', module: 'Sentence Treehouse', activity: 'Connect the Sentence (Purpose)', detail: 'Completed: "I use a broom to sweep the floor."', supportsUsed: ['Word banks'], category: 'sentence' }
    ],
    customRecommendations: null,
    skillObservations: {
      receptiveWh: 5,
      phonicsSpelling: 7,
      sentenceFormulation: 4,
      aacCommunication: 3,
      speechModelPractice: 5
    },
    goals: [
      { id: 'g1', text: 'Identify sound positions (beginning, middle, end) in Sound Garden', progress: '2 of 3 words', done: false },
      { id: 'g2', text: 'Connect purpose sentences with "to" in Sentence Treehouse', progress: 'Complete ✅', done: true }
    ],
    todayQuest: {
      id: 'quest-meilin',
      title: 'Sound Patterns & Helpers!',
      word: 'Broom',
      emoji: '🧹',
      description: 'Spot spelling patterns in Sound Garden and connect "I use a broom to sweep the floor."',
      actionType: 'sound-garden',
      stepName: 'Step 2: Sound Garden Patterns',
      badge: 'FLUTTER SPROUT'
    },
    learningPath: [
      { id: 'lp1', step: 'Step 1', title: 'Sound Garden: Blends & Digraphs', status: 'completed', icon: '🔤', action: 'sound-garden' },
      { id: 'lp2', step: 'Step 2', title: 'Listen & Practise "Broom"', status: 'current', icon: '🎙️', action: 'speak-practise' },
      { id: 'lp3', step: 'Step 3', title: 'Sentence Treehouse: Purpose ("to")', status: 'upcoming', icon: '🧩', action: 'sentence-connect' }
    ],
    growth: {
      wordsExplored: 9,
      kindStreak: 6,
      sproutTitle: 'Flourishing Sprout: Growing strong!',
      sproutIcon: '🌳',
      sproutDesc: '6 days of mindful practice! Your confidence is blooming.'
    },
    stars: 28,
    streak: 6,
    moodHistory: []
  }
};

export const INITIAL_LESSON_PLANS = [
  { id: 'w1', week: 'Week 1', title: 'Letter-Sound Links & Spelling Patterns', objectives: 'Connect letters, digraphs (sh, ch, th), and vowel patterns with illustrated words in Sound Garden.', activities: 'Complete 3 words in Sound Garden Flipbook and identify beginning/ending sound positions.', completed: false },
  { id: 'w2', week: 'Week 2', title: 'Everyday WH Comprehension & Vocabulary', objectives: 'Develop comprehension across Who, What, When, Where, and Why questions with meaningful context sentences.', activities: 'Explore What and Why pathways in Think & Discover using picture and audio models.', completed: false },
  { id: 'w3', week: 'Week 3', title: 'Functional AAC Communication', objectives: 'Assemble functional multi-symbol requests ("I want water", "I need help", "I want a break") on the communication board.', activities: 'Use the Free AAC Board and complete 3 everyday scenarios in What Do I Need?.', completed: false },
  { id: 'w4', week: 'Week 4', title: 'Sentence Expansion & Tenses Adventure', objectives: 'Formulate grammatically appropriate sentences, expand with purpose/time/reason (to, when, because), and sequence Yesterday, Today, Tomorrow.', activities: 'Complete Sentence Builder, Connect the Sentence, and Tenses Adventure.', completed: false }
];

export const INITIAL_AAC_PHRASES = [
  { id: 1, text: "I need help.", icon: "🙋", color: "coral" },
  { id: 2, text: "I want water.", icon: "🥛", color: "teal" },
  { id: 3, text: "I want a break.", icon: "⏸️", color: "amber" },
  { id: 4, text: "I need the bathroom.", icon: "🚻", color: "indigo" },
  { id: 5, text: "I need more time.", icon: "⏳", color: "indigo" },
  { id: 6, text: "Stop, please.", icon: "🛑", color: "coral" },
  { id: 7, text: "I am finished.", icon: "🏁", color: "amber" },
  { id: 8, text: "Yes.", icon: "✅", color: "teal" },
  { id: 9, text: "No.", icon: "❌", color: "orange" }
];

/**
 * Load persisted state or fallback to defaults
 */
export function loadAppState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed = JSON.parse(raw);
    const mergedStudents = { ...INITIAL_STUDENT_PROFILES };
    if (parsed.students) {
      Object.keys(parsed.students).forEach(k => {
        const base = INITIAL_STUDENT_PROFILES[k] || {};
        const saved = parsed.students[k] || {};
        mergedStudents[k] = {
          ...base,
          ...saved,
          supports: {
            ...DEFAULT_STUDENT_SUPPORTS,
            ...(base.supports || {}),
            ...(saved.supports || {})
          },
          individualLearningPlan: {
            ...(base.individualLearningPlan || {}),
            ...(saved.individualLearningPlan || {})
          },
          activityHistory: Array.isArray(saved.activityHistory) && saved.activityHistory.length > 0
            ? saved.activityHistory
            : (base.activityHistory || []),
          skillObservations: {
            ...(base.skillObservations || {
              receptiveWh: 2,
              phonicsSpelling: 2,
              sentenceFormulation: 2,
              aacCommunication: 2,
              speechModelPractice: 1
            }),
            ...(saved.skillObservations || {})
          }
        };
      });
    }
    return {
      ...getDefaultState(),
      ...parsed,
      students: mergedStudents
    };
  } catch (e) {
    console.warn("Could not load SpeakUp state from storage, using defaults", e);
    return getDefaultState();
  }
}

export function saveAppState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Could not save SpeakUp state", e);
  }
}

function getDefaultState() {
  return {
    currentStudentId: 'kuhendra',
    sharedVocabularyWordId: 'umbrella',
    students: INITIAL_STUDENT_PROFILES,
    teacher: {
      name: 'Ms. Aisya Mysara',
      role: 'Speech-Language Educator & Teletherapy Specialist',
      email: 'aisya.mysara@speakup.com',
      bio: 'Dedicated educator supporting pediatric communication, literacy-phonics awareness, functional AAC expression, and structured sentence formulation.'
    },
    lessonPlans: INITIAL_LESSON_PLANS,
    aacPhrases: INITIAL_AAC_PHRASES,
    activityAttempts: [],
    audioRecordings: [],
    badges: [
      { id: 'b1', icon: '🌱', title: 'First Words', desc: 'Used the communication board', unlocked: true },
      { id: 'b2', icon: '🎙️', title: 'Mindful Listener', desc: 'Listened to audio models with Pip', unlocked: true },
      { id: 'b3', icon: '🔥', title: 'Kind Streak', desc: 'Practiced 3 days in a row', unlocked: true },
      { id: 'b4', icon: '🌟', title: 'Sentence Builder', desc: 'Assembled and expanded a sentence', unlocked: false },
      { id: 'b5', icon: '🌳', title: 'Word Explorer', desc: 'Explored WH clues in Think & Discover', unlocked: false }
    ]
  };
}
