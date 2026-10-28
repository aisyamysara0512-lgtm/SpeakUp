/**
 * Central State Store for SpeakUp with localStorage persistence.
 * Synchronizes:
 * - Active Role & Profile Selection
 * - Student Profiles & Targets
 * - Mood Tracking history (recorded per student, not blocking across sessions)
 * - Stars, Streak, and Badges
 * - Attempt History (Observation records for activities)
 * - Custom AAC phrases
 * - Teacher assignments & Lesson Plans
 */

const STORAGE_KEY = 'speakup_app_state_v1';

export const INITIAL_STUDENT_PROFILES = {
  kuhendra: {
    id: 'kuhendra',
    name: 'Kuhendra Kumar',
    nickname: 'Kuhendra',
    avatar: '👦🏽',
    ageBand: '7-9 years (Grade 3)',
    targetFocus: '/r/ and /th/ pronunciation',
    currentSound: '/r/',
    assignedWord: 'Rabbit',
    assignedEmoji: '🐰',
    goals: [
      { id: 'g1', text: 'Practice words with the /r/ sound', progress: '2 of 3 words', done: false },
      { id: 'g2', text: 'Listen to the slow audio model with Pip', progress: 'Complete ✅', done: true },
      { id: 'g3', text: 'Build a sentence with "Rabbit"', progress: 'Upcoming', done: false }
    ],
    todayQuest: {
      id: 'quest-kuhendra',
      title: 'Hop to the Rabbit!',
      word: 'Rabbit',
      emoji: '🐰',
      description: 'Listen to the gentle /r/ sound, practice saying "Rabbit", and help Pip hop along the path.',
      actionType: 'sound-garden',
      stepName: 'Step 2: Say "Rabbit" with Pip',
      badge: 'HOPPING SPROUT'
    },
    learningPath: [
      { id: 'lp1', step: 'Step 1', title: 'Listen to the /r/ Sound', status: 'completed', icon: '🎧', action: 'sound-garden' },
      { id: 'lp2', step: 'Step 2', title: 'Say "Rabbit" with Pip', status: 'current', icon: '🎙️', action: 'speak-practise' },
      { id: 'lp3', step: 'Step 3', title: 'Sentence Treehouse: Rabbit', status: 'upcoming', icon: '🧩', action: 'sentence-builder' }
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
    targetFocus: 'Speech Sound /s/',
    currentSound: '/s/',
    assignedWord: 'Sun',
    assignedEmoji: '☀️',
    goals: [
      { id: 'g1', text: 'Practice 4 words with the sunny /s/ sound', progress: '3 of 4 words', done: false },
      { id: 'g2', text: 'Match the sun card in Picture Lab', progress: 'Complete ✅', done: true }
    ],
    todayQuest: {
      id: 'quest-aarav',
      title: 'Catch the Sunny Sound!',
      word: 'Sun',
      emoji: '☀️',
      description: 'Find the picture of the bright sun and practise the crisp /s/ sound with Pip.',
      actionType: 'sound-garden',
      stepName: 'Step 2: Say "Sun" with Pip',
      badge: 'SUNNY SPROUT'
    },
    learningPath: [
      { id: 'lp1', step: 'Step 1', title: 'Listen to /s/ in Sun', status: 'completed', icon: '🎧', action: 'sound-garden' },
      { id: 'lp2', step: 'Step 2', title: 'Say "Sun" with Pip', status: 'current', icon: '🎙️', action: 'speak-practise' },
      { id: 'lp3', step: 'Step 3', title: 'Find /s/ words in Word Forest', status: 'upcoming', icon: '🌳', action: 'think-discover' }
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
    targetFocus: 'Language Development (3-4 word sentences)',
    currentSound: 'Sentence Flow',
    assignedWord: 'Apple',
    assignedEmoji: '🍎',
    goals: [
      { id: 'g1', text: 'Build 2 sentences with "I see..."', progress: '1 of 2 done', done: false },
      { id: 'g2', text: 'Say your built sentence aloud', progress: 'Upcoming', done: false }
    ],
    todayQuest: {
      id: 'quest-siti',
      title: 'Build a Story Sentence!',
      word: 'Apple',
      emoji: '🍎',
      description: 'Connect Mia + kicks + the ball, then practice speaking your sentence step-by-step.',
      actionType: 'sentence-builder',
      stepName: 'Step 1: Pick Subject & Verb',
      badge: 'STORY BUILDER'
    },
    learningPath: [
      { id: 'lp1', step: 'Step 1', title: 'Think & Discover: Question Clues', status: 'completed', icon: '🔍', action: 'think-discover' },
      { id: 'lp2', step: 'Step 2', title: 'Build Mia Kicks the Ball', status: 'current', icon: '🧩', action: 'sentence-builder' },
      { id: 'lp3', step: 'Step 3', title: 'Connect with "because"', status: 'upcoming', icon: '🔗', action: 'sentence-connect' }
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
    targetFocus: 'Listening & Word Recognition',
    currentSound: 'Word Recognition',
    assignedWord: 'Dog',
    assignedEmoji: '🐶',
    goals: [
      { id: 'g1', text: 'Listen to 3 animal sounds in Word Forest', progress: '2 of 3 done', done: false },
      { id: 'g2', text: 'Express needs in Helper Harbour', progress: 'Upcoming', done: false }
    ],
    todayQuest: {
      id: 'quest-daniel',
      title: 'Find the Friendly Dog!',
      word: 'Dog',
      emoji: '🐶',
      description: 'Listen to the audio, find the dog flashcard, and say "Dog" alongside Pip.',
      actionType: 'think-discover',
      stepName: 'Step 1: Card Recognition',
      badge: 'LISTENING BUDDY'
    },
    learningPath: [
      { id: 'lp1', step: 'Step 1', title: 'Listen to Dog Sounds', status: 'completed', icon: '🎧', action: 'sound-garden' },
      { id: 'lp2', step: 'Step 2', title: 'Explore WHO is in the Yard', status: 'current', icon: '🔍', action: 'think-discover' },
      { id: 'lp3', step: 'Step 3', title: 'Tell Pip what you need', status: 'upcoming', icon: '🧸', action: 'what-do-i-need' }
    ],
    growth: {
      wordsExplored: 5,
      kindStreak: 2,
      sproutTitle: 'Budding Sprout: Roots taking hold!',
      sproutIcon: '🌱',
      sproutDesc: 'You listened attentively to 5 sound clues today.'
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
    targetFocus: 'Phonological Blends (/ch/, /sh/, /bl/)',
    currentSound: 'Blends',
    assignedWord: 'Butterfly',
    assignedEmoji: '🦋',
    goals: [
      { id: 'g1', text: 'Practice the /bl/ sound in Butterfly', progress: '1 of 3 words', done: false },
      { id: 'g2', text: 'Listen to slow playback in Studio', progress: 'Complete ✅', done: true }
    ],
    todayQuest: {
      id: 'quest-meilin',
      title: 'The Butterfly Flutter!',
      word: 'Butterfly',
      emoji: '🦋',
      description: 'Practice the gentle blend sounds in "Butterfly" with Pip modeling the rhythm.',
      actionType: 'sound-garden',
      stepName: 'Step 2: Say "Butterfly" with Pip',
      badge: 'FLUTTER SPROUT'
    },
    learningPath: [
      { id: 'lp1', step: 'Step 1', title: 'Sound Garden: Blends & Digraphs', status: 'completed', icon: '🔤', action: 'sound-garden' },
      { id: 'lp2', step: 'Step 2', title: 'Record "Butterfly" with Pip', status: 'current', icon: '🎙️', action: 'speak-practise' },
      { id: 'lp3', step: 'Step 3', title: 'Sentence Treehouse: Flutter', status: 'upcoming', icon: '🧩', action: 'sentence-builder' }
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
  { id: 'w1', week: 'Week 1', title: 'English Consonants & Early Sounds', objectives: 'Introduction to English consonant sounds, basic consonant articulation, listen and repeat exercises.', activities: 'Use the Sound Garden tab to practice /b/, /d/, and /m/.', completed: false },
  { id: 'w2', week: 'Week 2', title: 'Vowel Exploration & Monophthongs', objectives: 'Short vowels, long vowels, receptive listening exercises.', activities: 'Listen to the Monophthongs section with slow audio replay.', completed: false },
  { id: 'w3', week: 'Week 3', title: 'Common Consonant Blends', objectives: 'Word level practice and self-reflection audio recording.', activities: 'Record 3 words in Speak & Practise tab.', completed: false },
  { id: 'w4', week: 'Week 4', title: 'Functional Sentence Expansion', objectives: 'Build 3-part sentences using Who + Doing + What + Purpose targets (to, when, because).', activities: 'Complete 2 Sentence Treehouse activities.', completed: false }
];

export const INITIAL_AAC_PHRASES = [
  { id: 1, text: "I need help.", icon: "🙋", color: "coral" },
  { id: 2, text: "Could you repeat that?", icon: "🔁", color: "teal" },
  { id: 3, text: "I don't understand.", icon: "❓", color: "amber" },
  { id: 4, text: "Can I answer?", icon: "✋", color: "orange" },
  { id: 5, text: "I need more time.", icon: "⏳", color: "indigo" },
  { id: 6, text: "Can I take a break?", icon: "⏸️", color: "coral" },
  { id: 7, text: "Yes.", icon: "✅", color: "teal" },
  { id: 8, text: "No.", icon: "❌", color: "orange" },
];

/**
 * Load persisted state or fallback to defaults
 */
export function loadAppState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed = JSON.parse(raw);
    return {
      ...getDefaultState(),
      ...parsed,
      students: { ...INITIAL_STUDENT_PROFILES, ...(parsed.students || {}) }
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
    students: INITIAL_STUDENT_PROFILES,
    teacher: {
      name: 'Ms. Aisya Mysara',
      role: 'Senior Speech-Language Pathologist',
      email: 'aisya.mysara@speakup.com',
      bio: 'Dedicated speech therapist specializing in pediatric speech sound delay, functional AAC communication, and supportive early childhood teletherapy.'
    },
    lessonPlans: INITIAL_LESSON_PLANS,
    aacPhrases: INITIAL_AAC_PHRASES,
    activityAttempts: [],
    audioRecordings: [],
    badges: [
      { id: 'b1', icon: '🌱', title: 'First Words', desc: 'Used the communication board', unlocked: true },
      { id: 'b2', icon: '🎙️', title: 'Brave Speaker', desc: 'Practiced a sound with Pip', unlocked: true },
      { id: 'b3', icon: '🔥', title: 'Kind Streak', desc: 'Practiced 3 days in a row', unlocked: true },
      { id: 'b4', icon: '🌟', title: 'Sentence Builder', desc: 'Assembled a complete sentence', unlocked: false },
      { id: 'b5', icon: '🌳', title: 'Word Explorer', desc: 'Explored 10 words in Think & Discover', unlocked: false }
    ]
  };
}
