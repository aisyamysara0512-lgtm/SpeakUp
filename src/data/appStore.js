/**
 * Central State Store for SpeakUp with localStorage persistence.
 * Synchronizes:
 * - Active Role & Profile Selection
 * - Fictional Student Profiles, Individual Learning Goals & Adjustable Supports
 * - Mood Tracking history (recorded per student, non-blocking)
 * - Stars, Streak, and Badges
 * - Skill-Specific Practice Observations (separating receptive selection, spelling, syntax, AAC, and optional speech practice)
 * - Custom AAC phrases
 * - Teacher assignments & Lesson Plans
 */

const STORAGE_KEY = 'speakup_app_state_v2';

export const LEARNING_GOAL_CATALOG = [
  { id: 'speech-sounds', label: 'Practising selected speech sounds', module: 'speak-practise', icon: '🎙️' },
  { id: 'letter-sounds', label: 'Connecting letters and sounds', module: 'sound-garden', icon: '🔤' },
  { id: 'sentence-construction', label: 'Constructing sentences', module: 'sentence-treehouse', icon: '🌳' },
  { id: 'everyday-vocab', label: 'Expanding everyday vocabulary', module: 'think-discover', icon: '📚' },
  { id: 'wh-questions', label: 'Understanding WH questions', module: 'think-discover', icon: '🔍' },
  { id: 'aac-needs', label: 'Communicating everyday needs through AAC', module: 'what-do-i-need', icon: '⛵' },
  { id: 'event-sequencing', label: 'Sequencing and describing events', module: 'tenses-adventure', icon: '⏳' }
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
    avatar: '👦🏽',
    ageBand: '7-9 years (Grade 3)',
    targetFocus: '/r/ and /th/ sound awareness & sentence formulation',
    currentSound: '/r/',
    assignedWord: 'Umbrella',
    assignedEmoji: '☂️',
    assignedPhrase: 'my big umbrella',
    assignedSentence: 'I use an umbrella when it rains.',
    selectedGoalIds: ['speech-sounds', 'letter-sounds', 'sentence-construction', 'wh-questions'],
    assignedModules: ['think-discover', 'sound-garden', 'speak-practise', 'sentence-treehouse', 'what-do-i-need'],
    supports: { ...DEFAULT_STUDENT_SUPPORTS },
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
    avatar: '👦🏽',
    ageBand: '6-8 years (Grade 2)',
    targetFocus: 'Speech Sound /s/ & /sh/ digraphs',
    currentSound: '/s/',
    assignedWord: 'Ship',
    assignedEmoji: '🚢',
    assignedPhrase: 'a big blue ship',
    assignedSentence: 'The ship sails across the water.',
    selectedGoalIds: ['speech-sounds', 'letter-sounds', 'everyday-vocab'],
    assignedModules: ['sound-garden', 'speak-practise', 'think-discover'],
    supports: { ...DEFAULT_STUDENT_SUPPORTS },
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
    avatar: '👧🏽',
    ageBand: '7-9 years (Grade 3)',
    targetFocus: 'Sentence Formulation, Conjunctions & Tenses',
    currentSound: 'Sentence Flow',
    assignedWord: 'Jacket',
    assignedEmoji: '🧥',
    assignedPhrase: 'a warm jacket',
    assignedSentence: 'I wear a jacket because I feel cold.',
    selectedGoalIds: ['sentence-construction', 'event-sequencing', 'wh-questions'],
    assignedModules: ['sentence-treehouse', 'tenses-adventure', 'think-discover'],
    supports: { ...DEFAULT_STUDENT_SUPPORTS },
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
    avatar: '👦🏿',
    ageBand: '5-7 years (Grade 1)',
    targetFocus: 'Functional AAC Communication & Everyday Vocabulary',
    currentSound: 'Functional AAC',
    assignedWord: 'Water',
    assignedEmoji: '🥛',
    assignedPhrase: 'I want water',
    assignedSentence: 'I want water because I am thirsty.',
    selectedGoalIds: ['aac-needs', 'everyday-vocab', 'wh-questions'],
    assignedModules: ['what-do-i-need', 'think-discover', 'sound-garden'],
    supports: { ...DEFAULT_STUDENT_SUPPORTS, fewerChoices: true },
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
    avatar: '👧🏻',
    ageBand: '6-8 years (Grade 2)',
    targetFocus: 'Phonological Blends (/br/, /sh/, /ch/) & Spelling Patterns',
    currentSound: 'Blends',
    assignedWord: 'Broom',
    assignedEmoji: '🧹',
    assignedPhrase: 'use a broom',
    assignedSentence: 'I use a broom to sweep the floor.',
    selectedGoalIds: ['letter-sounds', 'speech-sounds', 'sentence-construction'],
    assignedModules: ['sound-garden', 'speak-practise', 'sentence-treehouse'],
    supports: { ...DEFAULT_STUDENT_SUPPORTS },
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
        mergedStudents[k] = {
          ...(INITIAL_STUDENT_PROFILES[k] || {}),
          ...parsed.students[k],
          supports: {
            ...DEFAULT_STUDENT_SUPPORTS,
            ...(INITIAL_STUDENT_PROFILES[k]?.supports || {}),
            ...(parsed.students[k]?.supports || {})
          },
          skillObservations: {
            ...(INITIAL_STUDENT_PROFILES[k]?.skillObservations || {
              receptiveWh: 2,
              phonicsSpelling: 2,
              sentenceFormulation: 2,
              aacCommunication: 2,
              speechModelPractice: 1
            }),
            ...(parsed.students[k]?.skillObservations || {})
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
