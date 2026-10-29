/**
 * SpeakUp Curriculum & Activity Master Content
 * Derived directly from the REFINED MASTER BLUEPRINT
 *
 * Includes:
 * 1. Shared Vocabulary Bridge (connects target words across all 5 modules)
 * 2. Sentence Treehouse:
 *    - Connect the Sentence (Purpose "to", Time "when", Reason "because" + expansion)
 *    - Structured Sentence Builder (2-part, 3-part, and 4-part flexible structures + expansion)
 *    - Tenses Adventure (Time Tree, Verb Adventures, Story Sequencer, Pause the Scene)
 * 3. Think & Discover (Word Forest):
 *    - 5 Pathways (WHAT, WHO, WHY, WHERE, WHEN) with picture cues, context sentences, and starter prompts
 * 4. Sound Garden:
 *    - Integrated Flipbook words + Sound Position activities
 * 5. What Do I Need? (Helper Harbour & Free AAC Communication Board):
 *    - Core & everyday symbols + scenario activities
 */

export const SHARED_VOCABULARY_BRIDGE = [
  {
    id: 'umbrella',
    word: 'Umbrella',
    emoji: '☂️',
    soundFocus: '/ʌ/ & /br/ blend',
    meaning: 'A canopy you hold over your head to stay dry when it rains.',
    phrase: 'my big umbrella',
    modelSentence: 'I use an umbrella when it rains.',
    modules: {
      thinkDiscover: { pathway: 'WHAT', cardId: 'what-1', prompt: 'What do we use when it is raining?' },
      soundGarden: { pathway: 'build-a-word', wordId: 'umbrella', pattern: 'um' },
      speakPractice: { word: 'Umbrella', phrase: 'my big umbrella', sentence: 'I use an umbrella when it rains.' },
      sentenceTreehouse: { who: 'I', verb: 'use', object: 'an umbrella', expansion: 'when it rains' },
      whatDoINeed: { scenarioId: 'need-rain', aacSymbols: ['I', 'need', 'umbrella'] }
    }
  },
  {
    id: 'water',
    word: 'Water',
    emoji: '🥛',
    soundFocus: '/w/ initial sound',
    meaning: 'A clear, refreshing drink we need when we are thirsty or washing.',
    phrase: 'cool clean water',
    modelSentence: 'I drink water because I am thirsty.',
    modules: {
      thinkDiscover: { pathway: 'WHY', cardId: 'why-6', prompt: 'Why do you drink water when you are thirsty?' },
      soundGarden: { pathway: 'build-a-word', wordId: 'water', pattern: 'wa' },
      speakPractice: { word: 'Water', phrase: 'cool clean water', sentence: 'I ask for water because I am thirsty.' },
      sentenceTreehouse: { who: 'The boy', verb: 'drinks', object: 'clean water', expansion: 'because I am thirsty' },
      whatDoINeed: { scenarioId: 'need-thirst', aacSymbols: ['I', 'want', 'water'] }
    }
  },
  {
    id: 'jacket',
    word: 'Jacket',
    emoji: '🧥',
    soundFocus: '/dʒ/ & /k/ sounds',
    meaning: 'A warm coat with sleeves that keeps your body cozy on cold days.',
    phrase: 'a warm jacket',
    modelSentence: 'I wear a jacket because I feel cold.',
    modules: {
      thinkDiscover: { pathway: 'WHAT', cardId: 'what-1', prompt: 'What keeps us warm on a chilly day?' },
      soundGarden: { pathway: 'blends', wordId: 'duck', pattern: 'ck' },
      speakPractice: { word: 'Jacket', phrase: 'a warm jacket', sentence: 'I wear a jacket because I feel cold.' },
      sentenceTreehouse: { who: 'I', verb: 'wear', object: 'a warm jacket', expansion: 'because I feel cold' },
      whatDoINeed: { scenarioId: 'need-cold', aacSymbols: ['I', 'need', 'jacket'] }
    }
  },
  {
    id: 'ship',
    word: 'Ship',
    emoji: '🚢',
    soundFocus: '/ʃ/ ("sh" digraph)',
    meaning: 'A large boat that sails across deep water and oceans.',
    phrase: 'a big blue ship',
    modelSentence: 'The ship sails across the water.',
    modules: {
      thinkDiscover: { pathway: 'WHERE', cardId: 'where-7', prompt: 'Where does a ship sail?' },
      soundGarden: { pathway: 'blends', wordId: 'ship', pattern: 'sh' },
      speakPractice: { word: 'Ship', phrase: 'a big ship', sentence: 'The ship sails on the water.' },
      sentenceTreehouse: { who: 'We', verb: 'see', object: 'the big ship', expansion: 'with friends' },
      whatDoINeed: { scenarioId: 'need-school', aacSymbols: ['I', 'want', 'help'] }
    }
  },
  {
    id: 'broom',
    word: 'Broom',
    emoji: '🧹',
    soundFocus: '/br/ blend & /uː/ vowel',
    meaning: 'A brush with a long handle used for sweeping the floor clean.',
    phrase: 'use a broom',
    modelSentence: 'I use a broom to sweep the floor.',
    modules: {
      thinkDiscover: { pathway: 'WHO', cardId: 'who-1', prompt: 'Who helps clean the school?' },
      soundGarden: { pathway: 'vowels', wordId: 'moon', pattern: 'oo' },
      speakPractice: { word: 'Broom', phrase: 'use a broom', sentence: 'I use a broom to sweep the floor.' },
      sentenceTreehouse: { who: 'I', verb: 'use', object: 'a broom', expansion: 'to sweep the floor' },
      whatDoINeed: { scenarioId: 'need-cut', aacSymbols: ['I', 'want', 'to help'] }
    }
  }
];

export const CONNECT_THE_SENTENCE_ITEMS = [
  // A. Purpose target: "to"
  {
    id: 'conn-to-1',
    target: 'to',
    category: 'Purpose ("to")',
    situation: 'A child sweeps bread crumbs from the kitchen floor.',
    prompt: 'Look at the broom. Complete the sentence:',
    incomplete: 'I use a broom ___ sweep the floor.',
    baseClause: 'I use a broom',
    connector: 'to',
    expansionClause: 'sweep the floor',
    options: ['to', 'when', 'because'],
    optionIcons: { to: '🎯', when: '⏰', because: '💡' },
    answer: 'to',
    fullSentence: 'I use a broom to sweep the floor.',
    hint: 'Why do you pick up the broom? For the purpose of sweeping: to sweep!',
    icon: '🧹',
    sharedWordId: 'broom'
  },
  {
    id: 'conn-to-2',
    target: 'to',
    category: 'Purpose ("to")',
    situation: 'Water spilled on a table; a child uses a soft cloth.',
    prompt: 'Look at the picture. Complete the sentence:',
    incomplete: 'I use a cloth ___ clean the water.',
    baseClause: 'I use a cloth',
    connector: 'to',
    expansionClause: 'clean the water',
    options: ['to', 'when', 'because'],
    optionIcons: { to: '🎯', when: '⏰', because: '💡' },
    answer: 'to',
    fullSentence: 'I use a cloth to clean the water.',
    hint: 'Think about what you want to do with the cloth: to clean!',
    icon: '🧽',
    sharedWordId: 'water'
  },
  {
    id: 'conn-to-3',
    target: 'to',
    category: 'Purpose ("to")',
    situation: 'A child waters a thirsty potted plant.',
    prompt: 'Look at the plant. Complete the sentence:',
    incomplete: 'I use a watering can ___ give the plant water.',
    baseClause: 'I use a watering can',
    connector: 'to',
    expansionClause: 'give the plant water',
    options: ['to', 'when', 'because'],
    optionIcons: { to: '🎯', when: '⏰', because: '💡' },
    answer: 'to',
    fullSentence: 'I use a watering can to give the plant water.',
    hint: 'What is the watering can for? To give water.',
    icon: '🪴',
    sharedWordId: 'water'
  },

  // B. Time target: "when"
  {
    id: 'conn-when-1',
    target: 'when',
    category: 'Time ("when")',
    situation: 'A child finishes playing outside and goes to the sink.',
    prompt: 'Look at the soap and water. Complete the sentence:',
    incomplete: 'I wash my hands ___ I finish playing.',
    baseClause: 'I wash my hands',
    connector: 'when',
    expansionClause: 'I finish playing',
    options: ['when', 'to', 'because'],
    optionIcons: { when: '⏰', to: '🎯', because: '💡' },
    answer: 'when',
    fullSentence: 'I wash my hands when I finish playing.',
    hint: 'This tells us the time you wash your hands: when you finish playing!',
    icon: '🧼',
    sharedWordId: 'water'
  },
  {
    id: 'conn-when-2',
    target: 'when',
    category: 'Time ("when")',
    situation: 'Raindrops start falling and a child opens an umbrella.',
    prompt: 'Look at the rain clouds. Complete the sentence:',
    incomplete: 'I use an umbrella ___ it rains.',
    baseClause: 'I use an umbrella',
    connector: 'when',
    expansionClause: 'it rains',
    options: ['when', 'to', 'hungry'],
    optionIcons: { when: '🌧️', to: '🎯', hungry: '🥪' },
    answer: 'when',
    fullSentence: 'I use an umbrella when it rains.',
    hint: 'An umbrella keeps you dry at the time raindrops fall: when it rains!',
    icon: '☂️',
    sharedWordId: 'umbrella'
  },
  {
    id: 'conn-when-3',
    target: 'when',
    category: 'Time ("when")',
    situation: 'Playtime has ended and toys need putting away.',
    prompt: 'What happens at cleanup time? Complete the sentence:',
    incomplete: 'I clean up when playtime is ___.',
    baseClause: 'I clean up',
    connector: 'when',
    expansionClause: 'playtime is over',
    options: ['over', 'starting', 'sleeping'],
    optionIcons: { over: '✅', starting: '▶️', sleeping: '😴' },
    answer: 'over',
    fullSentence: 'I clean up when playtime is over.',
    hint: 'Do you clean up before you play, or when play is finished/over?',
    icon: '🧸'
  },

  // C. Reason target: "because"
  {
    id: 'conn-because-1',
    target: 'because',
    category: 'Reason ("because")',
    situation: 'A child buttons up a warm winter jacket on a chilly day.',
    prompt: 'Brr, frosty air outside! Complete the sentence:',
    incomplete: 'I wear a jacket ___ I feel cold.',
    baseClause: 'I wear a jacket',
    connector: 'because',
    expansionClause: 'I feel cold',
    options: ['because', 'to', 'tomorrow'],
    optionIcons: { because: '💡', to: '🎯', tomorrow: '📅' },
    answer: 'because',
    fullSentence: 'I wear a jacket because I feel cold.',
    hint: 'Why wear a jacket? The reason is because you feel cold!',
    icon: '🧥',
    sharedWordId: 'jacket'
  },
  {
    id: 'conn-because-2',
    target: 'because',
    category: 'Reason ("because")',
    situation: 'A child asks for help with a tricky puzzle piece.',
    prompt: 'Why ask for help? Complete the sentence:',
    incomplete: 'I ask for help because I cannot do it ___.',
    baseClause: 'I ask for help',
    connector: 'because',
    expansionClause: 'I cannot do it alone',
    options: ['alone', 'yesterday', 'loudly'],
    optionIcons: { alone: '🧩', yesterday: '⏳', loudly: '📢' },
    answer: 'alone',
    fullSentence: 'I ask for help because I cannot do it alone.',
    hint: 'Sometimes two people make a puzzle easier than doing it alone.',
    icon: '🧩'
  },
  {
    id: 'conn-because-3',
    target: 'because',
    category: 'Reason ("because")',
    situation: 'A child drinks a glass of fresh cool water after running.',
    prompt: 'After running in the park. Complete the sentence:',
    incomplete: 'I ask for water because I am ___.',
    baseClause: 'I ask for water',
    connector: 'because',
    expansionClause: 'I am thirsty',
    options: ['thirsty', 'sleepy', 'angry'],
    optionIcons: { thirsty: '🥛', sleepy: '😴', angry: '😠' },
    answer: 'thirsty',
    fullSentence: 'I ask for water because I am thirsty.',
    hint: 'When your mouth is dry, you feel thirsty for fresh water.',
    icon: '🥛',
    sharedWordId: 'water'
  }
];

export const STRUCTURED_SENTENCE_BANK = {
  starters: [
    { id: 'st-i-use', label: 'I use an umbrella when it rains.', who: 'I', does: 'use', what: 'an umbrella', expansion: 'when it rains' },
    { id: 'st-broom', label: 'I use a broom to sweep the floor.', who: 'I', does: 'use', what: 'a broom', expansion: 'to sweep the floor' },
    { id: 'st-jacket', label: 'I wear a jacket because I feel cold.', who: 'I', does: 'wear', what: 'a warm jacket', expansion: 'because I feel cold' },
    { id: 'st-pip', label: 'Pip the parrot reads a story book.', who: 'Pip the parrot', does: 'reads', what: 'a story book', expansion: '' }
  ],
  subjects: [
    { label: 'I', icon: '🙋', grammarPerson: 'first' },
    { label: 'The boy', icon: '👦', grammarPerson: 'third' },
    { label: 'The girl', icon: '👧', grammarPerson: 'third' },
    { label: 'Pip the parrot', icon: '🦜', grammarPerson: 'third' },
    { label: 'My teacher', icon: '👩‍🏫', grammarPerson: 'third' },
    { label: 'The cat', icon: '🐱', grammarPerson: 'third' },
    { label: 'We', icon: '👥', grammarPerson: 'plural' }
  ],
  verbs: [
    { label: 'use', thirdPerson: 'uses', icon: '🤲', intransitiveOk: false },
    { label: 'wear', thirdPerson: 'wears', icon: '🧥', intransitiveOk: false },
    { label: 'wash', thirdPerson: 'washes', icon: '🧼', intransitiveOk: true },
    { label: 'eat', thirdPerson: 'eats', icon: '🍎', intransitiveOk: true },
    { label: 'clean', thirdPerson: 'cleans', icon: '🧽', intransitiveOk: true },
    { label: 'water', thirdPerson: 'waters', icon: '🪴', intransitiveOk: false },
    { label: 'read', thirdPerson: 'reads', icon: '📖', intransitiveOk: true },
    { label: 'play', thirdPerson: 'plays', icon: '⚽', intransitiveOk: true },
    { label: 'give', thirdPerson: 'gives', icon: '🎁', intransitiveOk: false, supportsIndirect: true }
  ],
  objects: [
    { label: 'an umbrella', icon: '☂️' },
    { label: 'a broom', icon: '🧹' },
    { label: 'a warm jacket', icon: '🧥' },
    { label: 'the red apple', icon: '🍎' },
    { label: 'the tall plant', icon: '🪴' },
    { label: 'a story book', icon: '📚' },
    { label: 'the big ball', icon: '⚽' },
    { label: 'my hands', icon: '🙌' }
  ],
  withWhatOrToWhom: [
    { label: 'with clean water', icon: '💧', type: 'instrument' },
    { label: 'with a soft cloth', icon: '🧽', type: 'instrument' },
    { label: 'with a watering can', icon: '🚿', type: 'instrument' },
    { label: 'to the girl', icon: '👧', type: 'indirect-object' },
    { label: 'to Pip', icon: '🦜', type: 'indirect-object' },
    { label: 'with friends', icon: '🤝', type: 'companion' }
  ],
  expansions: [
    { label: 'when it rains', icon: '🌧️', type: 'Time (when)' },
    { label: 'when I finish playing', icon: '🧸', type: 'Time (when)' },
    { label: 'to sweep the floor', icon: '🧹', type: 'Purpose (to)' },
    { label: 'to stay dry', icon: '☂️', type: 'Purpose (to)' },
    { label: 'because I feel cold', icon: '❄️', type: 'Reason (because)' },
    { label: 'because I am thirsty', icon: '🥛', type: 'Reason (because)' }
  ]
};

export const TENSES_ADVENTURE_DATA = {
  timeTree: [
    {
      id: 'past',
      timeLabel: 'Yesterday (Past)',
      badge: 'Already Happened',
      icon: '🍂',
      color: 'coral',
      clueWord: 'Yesterday',
      examples: [
        { verbBase: 'play', sentence: 'Yesterday, Pip played with the ball.', highlight: 'played', emoji: '⚽' },
        { verbBase: 'walk', sentence: 'Yesterday, the girl walked to school.', highlight: 'walked', emoji: '🏫' },
        { verbBase: 'wash', sentence: 'Yesterday, I washed my hands.', highlight: 'washed', emoji: '🧼' },
        { verbBase: 'rain', sentence: 'Yesterday, it rained outside.', highlight: 'rained', emoji: '🌧️' }
      ]
    },
    {
      id: 'present',
      timeLabel: 'Today (Present)',
      badge: 'Happens Every Day / Today',
      icon: '🌿',
      color: 'teal',
      clueWord: 'Today',
      examples: [
        { verbBase: 'play', sentence: 'Today, Pip plays with the ball.', highlight: 'plays', emoji: '⚽' },
        { verbBase: 'walk', sentence: 'Today, the girl walks to school.', highlight: 'walks', emoji: '🏫' },
        { verbBase: 'wash', sentence: 'Today, I wash my hands.', highlight: 'wash', emoji: '🧼' },
        { verbBase: 'use', sentence: 'Today, I use an umbrella.', highlight: 'use', emoji: '☂️' }
      ]
    },
    {
      id: 'future',
      timeLabel: 'Tomorrow (Future)',
      badge: 'Going to Happen Next',
      icon: '🌱',
      color: 'yellow',
      clueWord: 'Tomorrow',
      examples: [
        { verbBase: 'play', sentence: 'Tomorrow, Pip will play with the ball.', highlight: 'will play', emoji: '⚽' },
        { verbBase: 'walk', sentence: 'Tomorrow, the girl will walk to school.', highlight: 'will walk', emoji: '🏫' },
        { verbBase: 'wash', sentence: 'Tomorrow, I will wash my hands.', highlight: 'will wash', emoji: '🧼' },
        { verbBase: 'use', sentence: 'Tomorrow, I will use an umbrella.', highlight: 'will use', emoji: '☂️' }
      ]
    }
  ],
  verbAdventures: [
    {
      id: 'va-1',
      timeClue: 'Yesterday',
      timeIcon: '🍂',
      sceneEmoji: '⚽',
      prompt: 'Yesterday, Pip ___ with the big ball.',
      options: ['played', 'plays', 'will play'],
      answer: 'played',
      fullSentence: 'Yesterday, Pip played with the big ball.',
      hint: '"Yesterday" already happened in the past, so we add -ed: played!'
    },
    {
      id: 'va-2',
      timeClue: 'Today',
      timeIcon: '🌿',
      sceneEmoji: '🦜',
      prompt: 'Today, Pip ___ in the green treehouse.',
      options: ['plays', 'played', 'will play'],
      answer: 'plays',
      fullSentence: 'Today, Pip plays in the green treehouse.',
      hint: '"Today" is happening now/every day for Pip: Pip plays!'
    },
    {
      id: 'va-3',
      timeClue: 'Tomorrow',
      timeIcon: '🌱',
      sceneEmoji: '🪴',
      prompt: 'Tomorrow, Pip ___ the garden plants.',
      options: ['will water', 'watered', 'waters'],
      answer: 'will water',
      fullSentence: 'Tomorrow, Pip will water the garden plants.',
      hint: '"Tomorrow" has not happened yet, so we use "will": will water!'
    },
    {
      id: 'va-4',
      timeClue: 'Yesterday',
      timeIcon: '🍂',
      sceneEmoji: '🧹',
      prompt: 'Yesterday, I ___ the kitchen floor.',
      options: ['cleaned', 'clean', 'will clean'],
      answer: 'cleaned',
      fullSentence: 'Yesterday, I cleaned the kitchen floor.',
      hint: 'Look at the clue word "Yesterday". Choose the past verb ending in -ed!'
    }
  ],
  storySequences: [
    {
      id: 'seq-pip-play',
      title: "Pip's Playtime Story",
      description: 'See how Pip plays across Yesterday, Today, and Tomorrow!',
      steps: [
        { order: 1, time: 'Yesterday', icon: '🍂', emoji: '⚽', sentence: 'Yesterday: Pip played.', detail: 'Yesterday, Pip played soccer in the yard.' },
        { order: 2, time: 'Today', icon: '🌿', emoji: '🦜', sentence: 'Today: Pip plays.', detail: 'Today, Pip plays with blocks in the treehouse.' },
        { order: 3, time: 'Tomorrow', icon: '🌱', emoji: '🪁', sentence: 'Tomorrow: Pip will play.', detail: 'Tomorrow, Pip will play with a kite in the park.' }
      ]
    },
    {
      id: 'seq-garden-seed',
      title: 'Growing a Sunflower',
      description: 'Order the steps from planting a seed to seeing it bloom!',
      steps: [
        { order: 1, time: 'Yesterday', icon: '🍂', emoji: '🌱', sentence: 'Yesterday: Pip planted a seed.', detail: 'First, Pip put a tiny seed into the warm soil.' },
        { order: 2, time: 'Today', icon: '🌿', emoji: '🚿', sentence: 'Today: Pip waters the sprout.', detail: 'Next, Pip gives the green sprout fresh water.' },
        { order: 3, time: 'Tomorrow', icon: '🌱', emoji: '🌻', sentence: 'Tomorrow: The flower will bloom.', detail: 'Soon, a bright yellow sunflower will open up!' }
      ]
    }
  ],
  pauseTheScene: [
    {
      id: 'pts-1',
      title: 'Pause the Scene: Park Play',
      emoji: '🦜⚽',
      question: 'What is happening right now in this picture?',
      baseVerb: 'play',
      targetSentence: 'Pip is playing.',
      expandedSentence: 'Pip is playing with the ball right now.',
      choices: ['Pip is playing.', 'Pip played yesterday.', 'Pip will sleep tomorrow.'],
      hint: 'When an action is happening right now in front of us, we say "is + verb-ing": Pip is playing!'
    },
    {
      id: 'pts-2',
      title: 'Pause the Scene: Rainy Walk',
      emoji: '👧☂️',
      question: 'Look at the girl in the rain right now. What is she doing?',
      baseVerb: 'hold',
      targetSentence: 'The girl is holding an umbrella.',
      expandedSentence: 'The girl is holding an umbrella because it is raining.',
      choices: ['The girl is holding an umbrella.', 'The girl held a spoon.', 'The girl will eat lunch.'],
      hint: 'Right now, she has the umbrella in her hand: is holding!'
    },
    {
      id: 'pts-3',
      title: 'Pause the Scene: Snack Time',
      emoji: '👦🍎',
      question: 'Look at the boy at the table right now. What is he doing?',
      baseVerb: 'eat',
      targetSentence: 'The boy is eating an apple.',
      expandedSentence: 'The boy is eating a crunchy red apple.',
      choices: ['The boy is eating an apple.', 'The boy washed the car.', 'The boy will ride a bike.'],
      hint: 'He is taking a bite right now: is eating!'
    }
  ]
};

export const THINK_AND_DISCOVER_DATA = {
  WHAT: {
    title: 'WHAT? — Objects & Functions',
    icon: '💡',
    subtitle: 'Think about what tools and everyday things are used for.',
    cards: [
      {
        id: 'what-1',
        question: 'What do we use when it is raining?',
        answer: 'An umbrella',
        wordOnly: 'umbrella',
        starter: 'We use...',
        options: ['An umbrella', 'Sunglasses', 'A spoon'],
        optionIcons: { 'An umbrella': '☂️', 'Sunglasses': '🕶️', 'A spoon': '🥄' },
        icon: '☂️',
        hint: 'It opens wide over your head to shield raindrops.',
        audioSentence: 'I use an umbrella when it rains.',
        sharedWordId: 'umbrella'
      },
      {
        id: 'what-2',
        question: 'What do you use to brush your teeth?',
        answer: 'A toothbrush',
        wordOnly: 'toothbrush',
        starter: 'I use...',
        options: ['A toothbrush', 'A hairbrush', 'A pencil'],
        optionIcons: { 'A toothbrush': '🪥', 'A hairbrush': '🪮', 'A pencil': '✏️' },
        icon: '🪥',
        hint: 'You put toothpaste on its soft bristles every morning.',
        audioSentence: 'I use a toothbrush to keep my teeth sparkling clean.'
      },
      {
        id: 'what-3',
        question: 'What do you use to cut paper?',
        answer: 'Scissors',
        wordOnly: 'scissors',
        starter: 'I use...',
        options: ['Scissors', 'A ruler', 'An eraser'],
        optionIcons: { 'Scissors': '✂️', 'A ruler': '📏', 'An eraser': '🧼' },
        icon: '✂️',
        hint: 'Two safe blades that snip craft paper neatly.',
        audioSentence: 'I use scissors carefully to cut paper shapes.'
      },
      {
        id: 'what-4',
        question: 'What do you use to tell the time?',
        answer: 'A clock',
        wordOnly: 'clock',
        starter: 'I look at...',
        options: ['A clock', 'A mirror', 'A plate'],
        optionIcons: { 'A clock': '⏰', 'A mirror': '🪞', 'A plate': '🍽️' },
        icon: '⏰',
        hint: 'It hangs on the wall with numbers and ticking hands.',
        audioSentence: 'I look at the clock to see what time it is.'
      },
      {
        id: 'what-5',
        question: 'What do you use to write in a notebook?',
        answer: 'A pencil',
        wordOnly: 'pencil',
        starter: 'I write with...',
        options: ['A pencil', 'A fork', 'A shoe'],
        optionIcons: { 'A pencil': '✏️', 'A fork': '🍴', 'A shoe': '👟' },
        icon: '✏️',
        hint: 'You hold it with your fingers to draw letters and numbers.',
        audioSentence: 'I use a pencil to write my words in a notebook.'
      },
      {
        id: 'what-6',
        question: 'What do you use to dry your body after a bath?',
        answer: 'A towel',
        wordOnly: 'towel',
        starter: 'I dry with...',
        options: ['A towel', 'A blanket', 'A pillow'],
        optionIcons: { 'A towel': '🛁', 'A blanket': '🛋️', 'A pillow': '🛏️' },
        icon: '🛁',
        hint: 'A soft fluffy cloth you wrap around yourself after washing.',
        audioSentence: 'I use a soft towel to dry off after a bath.'
      },
      {
        id: 'what-7',
        question: 'What do you use to carry books to school?',
        answer: 'A schoolbag',
        wordOnly: 'schoolbag',
        starter: 'I carry...',
        options: ['A schoolbag', 'A cup', 'A hat'],
        optionIcons: { 'A schoolbag': '🎒', 'A cup': '☕', 'A hat': '🧢' },
        icon: '🎒',
        hint: 'A bag with two shoulder straps for your books and pencil case.',
        audioSentence: 'I pack my schoolbag with books every morning.'
      }
    ]
  },
  WHO: {
    title: 'WHO? — People & Community Roles',
    icon: '👥',
    subtitle: 'Discover the helpers and friendly faces in our community.',
    cards: [
      {
        id: 'who-1',
        question: 'Who helps clean the school?',
        answer: 'A cleaner',
        wordOnly: 'cleaner',
        starter: 'The person who helps is...',
        options: ['A cleaner', 'A pilot', 'An astronaut'],
        optionIcons: { 'A cleaner': '🧹', 'A pilot': '✈️', 'An astronaut': '🚀' },
        icon: '🧹',
        hint: 'They keep our hallways, desks, and classrooms tidy and safe.',
        audioSentence: 'A cleaner helps keep our school clean and bright.',
        sharedWordId: 'broom'
      },
      {
        id: 'who-2',
        question: 'Who teaches children in a classroom?',
        answer: 'A teacher',
        wordOnly: 'teacher',
        starter: 'The person who teaches is...',
        options: ['A teacher', 'A chef', 'A mechanic'],
        optionIcons: { 'A teacher': '👩‍🏫', 'A chef': '👨‍🍳', 'A mechanic': '🔧' },
        icon: '👩‍🏫',
        hint: 'They guide you through books, numbers, and fun projects.',
        audioSentence: 'A teacher guides and encourages students in class.'
      },
      {
        id: 'who-3',
        question: 'Who puts out fires?',
        answer: 'A firefighter',
        wordOnly: 'firefighter',
        starter: 'The helper is...',
        options: ['A firefighter', 'A gardener', 'A librarian'],
        optionIcons: { 'A firefighter': '🚒', 'A gardener': '🌱', 'A librarian': '📚' },
        icon: '🚒',
        hint: 'They wear yellow helmets and drive bright red fire engines.',
        audioSentence: 'A brave firefighter helps put out fires safely.'
      },
      {
        id: 'who-4',
        question: 'Who helps sick people get better?',
        answer: 'A doctor',
        wordOnly: 'doctor',
        starter: 'The helper is...',
        options: ['A doctor', 'A baker', 'An artist'],
        optionIcons: { 'A doctor': '👩‍⚕️', 'A baker': '🥖', 'An artist': '🎨' },
        icon: '👩‍⚕️',
        hint: 'They listen to your heartbeat with a stethoscope.',
        audioSentence: 'A doctor helps check your health and medicine.'
      },
      {
        id: 'who-5',
        question: 'Who helps keep people safe in the community?',
        answer: 'A police officer',
        wordOnly: 'police officer',
        starter: 'The community helper is...',
        options: ['A police officer', 'A musician', 'A clown'],
        optionIcons: { 'A police officer': '👮', 'A musician': '🎸', 'A clown': '🤡' },
        icon: '👮',
        hint: 'They help cross roads safely and look after neighborhood safety.',
        audioSentence: 'Police officers work to keep our neighborhoods safe.'
      },
      {
        id: 'who-6',
        question: 'Who delivers letters to your home?',
        answer: 'A postal worker',
        wordOnly: 'postal worker',
        starter: 'Letters are delivered by...',
        options: ['A postal worker', 'A dentist', 'A sailor'],
        optionIcons: { 'A postal worker': '📮', 'A dentist': '🦷', 'A sailor': '⛵' },
        icon: '📮',
        hint: 'They carry postcards, letters, and packages to your front door.',
        audioSentence: 'A postal worker delivers letters and packages to our homes.'
      },
      {
        id: 'who-7',
        question: 'Who cooks food in a restaurant?',
        answer: 'A chef',
        wordOnly: 'chef',
        starter: 'The person who cooks is...',
        options: ['A chef', 'An electrician', 'A driver'],
        optionIcons: { 'A chef': '👨‍🍳', 'An electrician': '💡', 'A driver': '🚌' },
        icon: '👨‍🍳',
        hint: 'They wear a tall white hat and prepare warm tasty meals.',
        audioSentence: 'A chef prepares delicious food in a kitchen.'
      }
    ]
  },
  WHY: {
    title: 'WHY? — Reasons & Meaningful Phrases',
    icon: '💭',
    subtitle: 'Answer "Why" questions using meaningful reasons and short phrases.',
    cards: [
      {
        id: 'why-1',
        question: 'Why do you take medicine prescribed for you?',
        answer: 'To help my body get better',
        wordOnly: 'to get better',
        starter: 'I take medicine...',
        options: ['To help my body get better', 'Because it is a toy', 'To stay awake all night'],
        optionIcons: { 'To help my body get better': '💊', 'Because it is a toy': '🧸', 'To stay awake all night': '🌙' },
        icon: '💊',
        hint: 'Medicine helps your body heal so you feel strong again.',
        audioSentence: 'I take prescribed medicine to help my body get better.'
      },
      {
        id: 'why-2',
        question: 'Why do we use an umbrella in the rain?',
        answer: 'To stay dry when it rains',
        wordOnly: 'to stay dry',
        starter: 'We use an umbrella...',
        options: ['To stay dry when it rains', 'To catch butterflies', 'To make loud thunder'],
        optionIcons: { 'To stay dry when it rains': '☂️', 'To catch butterflies': '🦋', 'To make loud thunder': '⚡' },
        icon: '☔',
        hint: 'The umbrella canopy catches raindrops so your clothes stay dry.',
        audioSentence: 'I use an umbrella to stay dry when it rains.',
        sharedWordId: 'umbrella'
      },
      {
        id: 'why-3',
        question: 'Why do you brush your teeth?',
        answer: 'Because it keeps my teeth clean and healthy',
        wordOnly: 'to keep teeth clean',
        starter: 'I brush my teeth...',
        options: ['Because it keeps my teeth clean and healthy', 'To make them blue', 'To whistle louder'],
        optionIcons: { 'Because it keeps my teeth clean and healthy': '🪥', 'To make them blue': '🎨', 'To whistle louder': '🎵' },
        icon: '🪥',
        hint: 'Brushing sweeps away food crumbs and protects healthy smiles.',
        audioSentence: 'I brush my teeth because it keeps them clean and healthy.'
      },
      {
        id: 'why-4',
        question: 'Why do you wear a seat belt in a car?',
        answer: 'To keep me safe while riding',
        wordOnly: 'to stay safe',
        starter: 'I wear a seat belt...',
        options: ['To keep me safe while riding', 'To change the radio', 'To make the car go faster'],
        optionIcons: { 'To keep me safe while riding': '🚗', 'To change the radio': '📻', 'To make the car go faster': '🏎️' },
        icon: '🚗',
        hint: 'Clicking your belt keeps you securely sitting in your seat.',
        audioSentence: 'I wear a seat belt to keep me safe in the car.'
      },
      {
        id: 'why-5',
        question: 'Why do you wash your hands before eating?',
        answer: 'To wash away dirt and germs',
        wordOnly: 'to wash away germs',
        starter: 'I wash my hands...',
        options: ['To wash away dirt and germs', 'To make water splash everywhere', 'To paint my fingers'],
        optionIcons: { 'To wash away dirt and germs': '🧼', 'To make water splash everywhere': '💦', 'To paint my fingers': '🎨' },
        icon: '🧼',
        hint: 'Soap washes away tiny germs from surfaces you touched.',
        audioSentence: 'I wash my hands with soap to wash away dirt and germs.'
      },
      {
        id: 'why-6',
        question: 'Why do you drink water after running?',
        answer: 'Because I feel thirsty',
        wordOnly: 'because I am thirsty',
        starter: 'I drink water...',
        options: ['Because I feel thirsty', 'To paint a picture', 'Because my shoes are untied'],
        optionIcons: { 'Because I feel thirsty': '🥛', 'To paint a picture': '🖌️', 'Because my shoes are untied': '👟' },
        icon: '🥛',
        hint: 'Water refreshes your body and hydrates your dry mouth.',
        audioSentence: 'I drink cool water because I feel thirsty.',
        sharedWordId: 'water'
      },
      {
        id: 'why-7',
        question: 'Why do we wear a warm jacket on a cold day?',
        answer: 'Because we feel chilly and cold',
        wordOnly: 'because I feel cold',
        starter: 'I wear a jacket...',
        options: ['Because we feel chilly and cold', 'To go swimming in the pool', 'To read a storybook'],
        optionIcons: { 'Because we feel chilly and cold': '🧥', 'To go swimming in the pool': '🏊', 'To read a storybook': '📖' },
        icon: '🧥',
        hint: 'A cozy jacket keeps body warmth inside when the wind is cold.',
        audioSentence: 'I wear a jacket because I feel cold.',
        sharedWordId: 'jacket'
      }
    ]
  },
  WHERE: {
    title: 'WHERE? — Places in Our World',
    icon: '🗺️',
    subtitle: 'Explore the different places we visit to learn, play, and heal.',
    cards: [
      {
        id: 'where-1',
        question: 'Where do firefighters work?',
        answer: 'At the fire station',
        wordOnly: 'fire station',
        starter: 'Firefighters work...',
        options: ['At the fire station', 'At the bakery', 'At the cinema'],
        optionIcons: { 'At the fire station': '🚒', 'At the bakery': '🥐', 'At the cinema': '🍿' },
        icon: '🚒',
        hint: 'The building with red garage doors where fire engines rest.',
        audioSentence: 'Firefighters work and keep gear ready at the fire station.'
      },
      {
        id: 'where-2',
        question: 'Where do students learn with their teacher?',
        answer: 'At school',
        wordOnly: 'school',
        starter: 'Students learn...',
        options: ['At school', 'At the airport', 'At the post office'],
        optionIcons: { 'At school': '🏫', 'At the airport': '✈️', 'At the post office': '📯' },
        icon: '🏫',
        hint: 'A place full of classrooms, friends, storybooks, and a playground.',
        audioSentence: 'Students gather to learn and play together at school.'
      },
      {
        id: 'where-3',
        question: 'Where do you go to borrow books?',
        answer: 'The library',
        wordOnly: 'library',
        starter: 'I borrow books from...',
        options: ['The library', 'The supermarket', 'The car wash'],
        optionIcons: { 'The library': '📚', 'The supermarket': '🛒', 'The car wash': '🚗' },
        icon: '📚',
        hint: 'A quiet, cozy place with shelves of wonderful books you can borrow.',
        audioSentence: 'I can borrow exciting storybooks from the library.'
      },
      {
        id: 'where-4',
        question: 'Where can you see lions and giraffes?',
        answer: 'At the zoo',
        wordOnly: 'zoo',
        starter: 'You can see them...',
        options: ['At the zoo', 'At the train station', 'At the pharmacy'],
        optionIcons: { 'At the zoo': '🦁', 'At the train station': '🚂', 'At the pharmacy': '💊' },
        icon: '🦁',
        hint: 'A park home where animal caretakers look after wildlife.',
        audioSentence: 'We can see lions, giraffes, and colorful birds at the zoo.'
      },
      {
        id: 'where-5',
        question: 'Where do doctors and nurses care for sick patients?',
        answer: 'At the hospital',
        wordOnly: 'hospital',
        starter: 'Doctors work...',
        options: ['At the hospital', 'At the bakery', 'At the bowling alley'],
        optionIcons: { 'At the hospital': '🏥', 'At the bakery': '🧁', 'At the bowling alley': '🎳' },
        icon: '🏥',
        hint: 'A healthcare building staffed with caring doctors and nurses.',
        audioSentence: 'Doctors and nurses care for patients at the hospital.'
      },
      {
        id: 'where-6',
        question: 'Where do families buy food and groceries?',
        answer: 'At the supermarket',
        wordOnly: 'supermarket',
        starter: 'We buy groceries...',
        options: ['At the supermarket', 'At the museum', 'At the bus stop'],
        optionIcons: { 'At the supermarket': '🛒', 'At the museum': '🏛️', 'At the bus stop': '🚏' },
        icon: '🛒',
        hint: 'A store with aisles of fresh apples, milk, bread, and veggies.',
        audioSentence: 'Families buy fresh groceries and fruit at the supermarket.'
      },
      {
        id: 'where-7',
        question: 'Where does a big ship sail?',
        answer: 'Across the ocean and sea',
        wordOnly: 'ocean',
        starter: 'A ship sails...',
        options: ['Across the ocean and sea', 'Inside a bedroom', 'Up a tall tree'],
        optionIcons: { 'Across the ocean and sea': '🌊', 'Inside a bedroom': '🛏️', 'Up a tall tree': '🌳' },
        icon: '🚢',
        hint: 'Deep blue water where boats and ships float and travel.',
        audioSentence: 'A big ship sails across the deep blue ocean.',
        sharedWordId: 'ship'
      }
    ]
  },
  WHEN: {
    title: 'WHEN? — Times & Daily Routines',
    icon: '⏳',
    subtitle: 'Think about when things happen during the day and night.',
    cards: [
      {
        id: 'when-1',
        question: 'When do you usually see stars in the sky?',
        answer: 'At night',
        wordOnly: 'at night',
        starter: 'We see stars...',
        options: ['At night', 'At breakfast time', 'At noon'],
        optionIcons: { 'At night': '🌙', 'At breakfast time': '🥞', 'At noon': '☀️' },
        icon: '✨',
        hint: 'When the sun sets and the dark sky turns deep blue.',
        audioSentence: 'Twinkling stars shine in the sky at night.'
      },
      {
        id: 'when-2',
        question: 'When do you eat breakfast?',
        answer: 'In the morning',
        wordOnly: 'in the morning',
        starter: 'I eat breakfast...',
        options: ['In the morning', 'Right before sleeping', 'At midnight'],
        optionIcons: { 'In the morning': '🌅', 'Right before sleeping': '🛌', 'At midnight': '🌌' },
        icon: '🥞',
        hint: 'Your first meal when waking up to start a cheerful new day.',
        audioSentence: 'I eat breakfast in the morning to start my day.'
      },
      {
        id: 'when-3',
        question: 'When do you wear a raincoat?',
        answer: 'When it rains',
        wordOnly: 'when it rains',
        starter: 'I wear a raincoat...',
        options: ['When it rains', 'When it is hot and sunny', 'While sleeping in bed'],
        optionIcons: { 'When it rains': '🌧️', 'When it is hot and sunny': '☀️', 'While sleeping in bed': '🛏️' },
        icon: '🌧️',
        hint: 'You put it on before walking out into wet rainy weather.',
        audioSentence: 'I wear a raincoat when it rains outside.'
      },
      {
        id: 'when-4',
        question: 'When do you brush your teeth at night?',
        answer: 'Before going to sleep',
        wordOnly: 'before sleeping',
        starter: 'At night, I brush...',
        options: ['Before going to sleep', 'During soccer practice', 'While riding a bike'],
        optionIcons: { 'Before going to sleep': '🪥', 'During soccer practice': '⚽', 'While riding a bike': '🚲' },
        icon: '🪥',
        hint: 'Right before putting your pajamas on and climbing under covers.',
        audioSentence: 'I brush my teeth before going to sleep at night.'
      },
      {
        id: 'when-5',
        question: 'When do you open an umbrella?',
        answer: 'When it is raining',
        wordOnly: 'when it rains',
        starter: 'I use an umbrella...',
        options: ['When it is raining', 'When eating soup indoors', 'While swimming underwater'],
        optionIcons: { 'When it is raining': '☂️', 'When eating soup indoors': '🥣', 'While swimming underwater': '🏊' },
        icon: '☂️',
        hint: 'Whenever wet clouds sprinkle drops over the street.',
        audioSentence: 'I use an umbrella when it rains.',
        sharedWordId: 'umbrella'
      },
      {
        id: 'when-6',
        question: 'When do you blow out birthday candles?',
        answer: 'On your birthday',
        wordOnly: 'on my birthday',
        starter: 'I celebrate...',
        options: ['On your birthday', 'Every single morning', 'When brushing teeth'],
        optionIcons: { 'On your birthday': '🎂', 'Every single morning': '⏰', 'When brushing teeth': '🪥' },
        icon: '🎂',
        hint: 'On your special date each year with cake and a happy song!',
        audioSentence: 'We celebrate with cake and candles on our birthday.'
      },
      {
        id: 'when-7',
        question: 'When do you eat lunch?',
        answer: 'In the middle of the day',
        wordOnly: 'at midday',
        starter: 'We eat lunch...',
        options: ['In the middle of the day', 'Late at midnight', 'At early dawn'],
        optionIcons: { 'In the middle of the day': '🥪', 'Late at midnight': '🌙', 'At early dawn': '🐓' },
        icon: '🥪',
        hint: 'Around noon when the school lunch bell rings.',
        audioSentence: 'Students sit down for a healthy lunch in the middle of the day.'
      }
    ]
  }
};

export const AAC_CORE_BOARD_CATEGORIES = [
  {
    id: 'starters',
    name: '🗣️ Starters & Actions',
    symbols: [
      { id: 'sym-i', label: 'I', speech: 'I', icon: '🙋', color: 'teal' },
      { id: 'sym-want', label: 'want', speech: 'want', icon: '🤲', color: 'teal' },
      { id: 'sym-need', label: 'need', speech: 'need', icon: '💡', color: 'teal' },
      { id: 'sym-help', label: 'help', speech: 'need help', icon: '🤝', color: 'coral' },
      { id: 'sym-please', label: 'please', speech: 'please', icon: '💛', color: 'amber' },
      { id: 'sym-open', label: 'open this', speech: 'open this', icon: '📦', color: 'indigo' },
      { id: 'sym-more', label: 'more', speech: 'more', icon: '➕', color: 'teal' }
    ]
  },
  {
    id: 'needs',
    name: '🥛 Everyday Needs & Objects',
    symbols: [
      { id: 'sym-water', label: 'water', speech: 'water', icon: '🥛', color: 'teal' },
      { id: 'sym-food', label: 'food', speech: 'food', icon: '🥪', color: 'amber' },
      { id: 'sym-bathroom', label: 'bathroom', speech: 'to go to the bathroom', icon: '🚻', color: 'indigo' },
      { id: 'sym-break', label: 'a break', speech: 'a break', icon: '⏸️', color: 'coral' },
      { id: 'sym-umbrella', label: 'an umbrella', speech: 'an umbrella', icon: '☂️', color: 'teal' },
      { id: 'sym-jacket', label: 'a jacket', speech: 'a jacket', icon: '🧥', color: 'orange' },
      { id: 'sym-book', label: 'a book', speech: 'a book', icon: '📖', color: 'indigo' }
    ]
  },
  {
    id: 'controls',
    name: '🛑 Quick Responses',
    symbols: [
      { id: 'sym-yes', label: 'Yes', speech: 'Yes', icon: '✅', color: 'teal' },
      { id: 'sym-no', label: 'No', speech: 'No', icon: '❌', color: 'coral' },
      { id: 'sym-stop', label: 'Stop', speech: 'Stop please', icon: '🛑', color: 'coral' },
      { id: 'sym-finished', label: 'Finished', speech: 'I am finished', icon: '🏁', color: 'amber' },
      { id: 'sym-wait', label: 'More time', speech: 'I need more time', icon: '⏳', color: 'indigo' }
    ]
  },
  {
    id: 'feelings',
    name: '😊 Feelings & Body States',
    symbols: [
      { id: 'sym-feel', label: 'I feel', speech: 'I feel', icon: '💭', color: 'indigo' },
      { id: 'sym-happy', label: 'happy', speech: 'happy', icon: '😊', color: 'teal' },
      { id: 'sym-tired', label: 'tired', speech: 'tired', icon: '🥱', color: 'amber' },
      { id: 'sym-thirsty', label: 'thirsty', speech: 'thirsty', icon: '💧', color: 'teal' },
      { id: 'sym-hungry', label: 'hungry', speech: 'hungry', icon: '🍎', color: 'orange' },
      { id: 'sym-cold', label: 'cold', speech: 'cold', icon: '❄️', color: 'indigo' },
      { id: 'sym-frustrated', label: 'frustrated', speech: 'frustrated', icon: '😣', color: 'coral' }
    ]
  }
];

export const WHAT_DO_I_NEED_SCENARIOS = [
  {
    id: 'need-rain',
    title: 'It Is Raining',
    situation: 'It is raining outside and puddles are splashing.',
    prompt: 'It is raining: what do I need?',
    correctAnswer: 'Umbrella',
    modelSentence: 'I need an umbrella because it is raining.',
    suggestedAacTokens: ['I', 'need', 'an umbrella'],
    icon: '🌧️',
    sharedWordId: 'umbrella',
    choices: [
      { label: 'Umbrella', icon: '☂️', isCorrect: true },
      { label: 'Sunhat', icon: '👒', isCorrect: false },
      { label: 'Sandals', icon: '🩴', isCorrect: false },
      { label: 'Sunglasses', icon: '🕶️', isCorrect: false }
    ],
    hint: 'Look for the item that catches raindrops from above.'
  },
  {
    id: 'need-thirst',
    title: 'Feeling Thirsty',
    situation: 'After running in the warm sun, your throat feels dry.',
    prompt: 'I am thirsty: what do I need?',
    correctAnswer: 'Water',
    modelSentence: 'I want water because I am thirsty.',
    suggestedAacTokens: ['I', 'want', 'water'],
    icon: '🏃',
    sharedWordId: 'water',
    choices: [
      { label: 'Water', icon: '🥛', isCorrect: true },
      { label: 'Pencil', icon: '✏️', isCorrect: false },
      { label: 'Jacket', icon: '🧥', isCorrect: false },
      { label: 'Clock', icon: '⏰', isCorrect: false }
    ],
    hint: 'A fresh, cool drink that quenches dry throats.'
  },
  {
    id: 'need-open',
    title: 'Tricky Container',
    situation: 'Your lunch box lid is stuck tight and will not open.',
    prompt: 'I cannot open this: what can I communicate?',
    correctAnswer: 'I need help',
    modelSentence: 'I need help to open this, please.',
    suggestedAacTokens: ['I', 'need', 'help', 'please'],
    icon: '🍱',
    choices: [
      { label: 'I need help', icon: '🤝', isCorrect: true },
      { label: 'Go to sleep', icon: '😴', isCorrect: false },
      { label: 'Wear a hat', icon: '🧢', isCorrect: false },
      { label: 'Throw it away', icon: '🗑️', isCorrect: false }
    ],
    hint: 'You can politely ask a teacher or friend: "I need help, please!"'
  },
  {
    id: 'need-tired-break',
    title: 'Feeling Tired',
    situation: 'You have been working hard for a long time and feel tired.',
    prompt: 'I feel tired: how can I ask for a break?',
    correctAnswer: 'I want a break',
    modelSentence: 'I feel tired. I want a break, please.',
    suggestedAacTokens: ['I', 'want', 'a break', 'please'],
    icon: '🥱',
    choices: [
      { label: 'I want a break', icon: '⏸️', isCorrect: true },
      { label: 'Run faster', icon: '🏃', isCorrect: false },
      { label: 'Shout loudly', icon: '📢', isCorrect: false },
      { label: 'Scissors', icon: '✂️', isCorrect: false }
    ],
    hint: 'When you feel tired during work, you can communicate: "I want a break."'
  },
  {
    id: 'need-hunger',
    title: 'Tummy Rumbling',
    situation: 'It is lunchtime and you feel hungry.',
    prompt: 'I am hungry: what do I need?',
    correctAnswer: 'Food',
    modelSentence: 'I want food because I am hungry.',
    suggestedAacTokens: ['I', 'want', 'food'],
    icon: '🥪',
    choices: [
      { label: 'Food', icon: '🥪', isCorrect: true },
      { label: 'Scissors', icon: '✂️', isCorrect: false },
      { label: 'Pillow', icon: '🛏️', isCorrect: false },
      { label: 'Towel', icon: '🛁', isCorrect: false }
    ],
    hint: 'A yummy healthy sandwich or apple gives you energy.'
  },
  {
    id: 'need-cold',
    title: 'Cold Weather',
    situation: 'The wind is blowing and you feel chilly.',
    prompt: 'I feel cold: what do I need?',
    correctAnswer: 'Jacket',
    modelSentence: 'I need a jacket because I feel cold.',
    suggestedAacTokens: ['I', 'need', 'a jacket'],
    icon: '❄️',
    sharedWordId: 'jacket',
    choices: [
      { label: 'Jacket', icon: '🧥', isCorrect: true },
      { label: 'Swimsuit', icon: '🩱', isCorrect: false },
      { label: 'Spoon', icon: '🥄', isCorrect: false },
      { label: 'Fan', icon: '🪭', isCorrect: false }
    ],
    hint: 'A cozy zip-up coat that traps body warmth.'
  },
  {
    id: 'need-cut',
    title: 'Small Scrape or Cut',
    situation: 'You scraped your knee while playing on the grass.',
    prompt: 'I have a small cut: what can I communicate to an adult?',
    correctAnswer: 'Adult help',
    modelSentence: 'I need help from a trusted adult.',
    suggestedAacTokens: ['I', 'need', 'help'],
    icon: '🩹',
    choices: [
      { label: 'Adult help', icon: '🙋', isCorrect: true },
      { label: 'Ice cream', icon: '🍦', isCorrect: false },
      { label: 'Book', icon: '📖', isCorrect: false },
      { label: 'Football', icon: '⚽', isCorrect: false }
    ],
    hint: 'Telling a parent, teacher, or nurse keeps you comfortable and safe.'
  }
];

export const PIP_MINI_GAMES = [
  {
    id: 'game-mimic',
    title: "Pip's Echo Canyon",
    desc: 'Listen to Pip make a sound and match it with the correct visual feather.',
    icon: '🦜',
    reward: 5
  },
  {
    id: 'game-bubble',
    title: 'Sound Bubble Pop',
    desc: 'Pop the bubble carrying the sound you hear before it reaches the cloud!',
    icon: '🫧',
    reward: 5
  },
  {
    id: 'game-forest',
    title: "Pip's Treasure Nest",
    desc: 'Pick word treasures to decorate Pip cozy tree branch sanctuary.',
    icon: '🪴',
    reward: 3
  }
];
