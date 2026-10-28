/**
 * SpeakUp Curriculum & Activity Master Content
 * Derived directly from the REFINED MASTER BLUEPRINT
 * 
 * Includes:
 * 1. Sentence Treehouse:
 *    - Connect the Sentence (9 scenarios with to, when, because)
 *    - Structured Sentence Builder (Who? / Doing? / What? / With what?)
 * 2. Think & Discover (Word Forest):
 *    - 5 Pathways (WHAT, WHO, WHY, WHERE, WHEN) with 7 cards each = 35 total
 * 3. Sound Garden:
 *    - Letter Sounds, Consonants, Digraphs & Blends, Monophthongs, Diphthongs
 * 4. Helper Harbour (What Do I Need?):
 *    - 7 Functional communication scenarios + model sentences
 * 5. Pip's Mini-Games & Practice Adventure
 */

export const CONNECT_THE_SENTENCE_ITEMS = [
  // A. Purpose target: "to"
  {
    id: 'conn-to-1',
    target: 'to',
    category: 'Purpose ("to")',
    situation: 'Water spilled on a table; a child uses a cloth.',
    prompt: 'Look at the picture. Complete the sentence:',
    incomplete: 'I use a cloth ___ clean the water.',
    options: ['to', 'when', 'because'],
    answer: 'to',
    fullSentence: 'I use a cloth to clean the water.',
    hint: 'Think about what you want to do with the cloth: to clean!',
    icon: '🧽'
  },
  {
    id: 'conn-to-2',
    target: 'to',
    category: 'Purpose ("to")',
    situation: 'A child waters a thirsty potted plant.',
    prompt: 'Look at the plant. Complete the sentence:',
    incomplete: 'I use a watering can ___ give the plant water.',
    options: ['to', 'when', 'because'],
    answer: 'to',
    fullSentence: 'I use a watering can to give the plant water.',
    hint: 'What is the watering can for? To give water.',
    icon: '🪴'
  },
  {
    id: 'conn-to-3',
    target: 'to',
    category: 'Purpose ("to")',
    situation: 'A child sweeps bread crumbs from the kitchen floor.',
    prompt: 'Look at the broom. Complete the sentence:',
    incomplete: 'I use a broom ___ sweep the floor.',
    options: ['to', 'when', 'because'],
    answer: 'to',
    fullSentence: 'I use a broom to sweep the floor.',
    hint: 'Why do you pick up the broom? To sweep.',
    icon: '🧹'
  },

  // B. Time target: "when"
  {
    id: 'conn-when-1',
    target: 'when',
    category: 'Time ("when")',
    situation: 'Playtime has ended and toys need putting away.',
    prompt: 'What happens at cleanup time? Complete the sentence:',
    incomplete: 'I clean up when playtime is ___.',
    options: ['over', 'starting'],
    answer: 'over',
    fullSentence: 'I clean up when playtime is over.',
    hint: 'Do you clean up before you play, or when play is finished/over?',
    icon: '🧸'
  },
  {
    id: 'conn-when-2',
    target: 'when',
    category: 'Time ("when")',
    situation: 'A child washes hands at the sink before mealtime.',
    prompt: 'Look at the soap and water. Complete the sentence:',
    incomplete: 'I wash my hands when I am ___ to eat.',
    options: ['ready', 'sleeping'],
    answer: 'ready',
    fullSentence: 'I wash my hands when I am ready to eat.',
    hint: 'Are you washing hands while sleeping or when ready to eat?',
    icon: '🧼'
  },
  {
    id: 'conn-when-3',
    target: 'when',
    category: 'Time ("when")',
    situation: 'A child puts on a bright yellow raincoat outside.',
    prompt: 'Look at the weather clouds. Complete the sentence:',
    incomplete: 'I wear my raincoat when it ___.',
    options: ['rains', 'shines'],
    answer: 'rains',
    fullSentence: 'I wear my raincoat when it rains.',
    hint: 'A raincoat keeps you dry when raindrops fall!',
    icon: '🌧️'
  },

  // C. Reason target: "because"
  {
    id: 'conn-because-1',
    target: 'because',
    category: 'Reason ("because")',
    situation: 'A child asks for help with a big puzzle piece.',
    prompt: 'Why ask for help? Complete the sentence:',
    incomplete: 'I ask for help because I cannot do it ___.',
    options: ['alone', 'yesterday'],
    answer: 'alone',
    fullSentence: 'I ask for help because I cannot do it alone.',
    hint: 'Sometimes two people make a puzzle easier than doing it alone.',
    icon: '🧩'
  },
  {
    id: 'conn-because-2',
    target: 'because',
    category: 'Reason ("because")',
    situation: 'A child buttons up a warm winter jacket.',
    prompt: 'Brr, frosty air outside! Complete the sentence:',
    incomplete: 'I wear a jacket because I feel ___.',
    options: ['cold', 'hungry'],
    answer: 'cold',
    fullSentence: 'I wear a jacket because I feel cold.',
    hint: 'Jackets keep you warm when your hands feel chilly and cold!',
    icon: '🧥'
  },
  {
    id: 'conn-because-3',
    target: 'because',
    category: 'Reason ("because")',
    situation: 'A child drinks a glass of fresh cool water.',
    prompt: 'After running in the park. Complete the sentence:',
    incomplete: 'I ask for water because I am ___.',
    options: ['thirsty', 'sleepy'],
    answer: 'thirsty',
    fullSentence: 'I ask for water because I am thirsty.',
    hint: 'When your mouth is dry, you feel thirsty for fresh water.',
    icon: '🥛'
  }
];

export const STRUCTURED_SENTENCE_BANK = {
  subjects: [
    { label: 'The boy', icon: '👦' },
    { label: 'The girl', icon: '👧' },
    { label: 'Pip the parrot', icon: '🦜' },
    { label: 'My teacher', icon: '👩‍🏫' },
    { label: 'The cat', icon: '🐱' },
    { label: 'We', icon: '👥' }
  ],
  verbs: [
    { label: 'washes', icon: '🧼' },
    { label: 'eats', icon: '🍎' },
    { label: 'cleans', icon: '🧽' },
    { label: 'waters', icon: '🪴' },
    { label: 'reads', icon: '📖' },
    { label: 'kicks', icon: '⚽' }
  ],
  objects: [
    { label: 'the red apple', icon: '🍎' },
    { label: 'the tall plant', icon: '🪴' },
    { label: 'the wooden table', icon: '🪑' },
    { label: 'a story book', icon: '📚' },
    { label: 'the big ball', icon: '⚽' },
    { label: 'hands', icon: '🙌' }
  ],
  withWhat: [
    { label: 'with clean water', icon: '💧' },
    { label: 'with a soft cloth', icon: '🧽' },
    { label: 'with a smile', icon: '😊' },
    { label: 'with a watering can', icon: '🚿' },
    { label: 'with Pip', icon: '🦜' },
    { label: 'with friends', icon: '🤝' }
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
        question: 'What do you use when it is raining?',
        answer: 'Umbrella',
        options: ['Umbrella', 'Sunglasses', 'Spoon'],
        icon: '☂️',
        hint: 'It opens wide over your head to shield raindrops.',
        audioSentence: 'You use an umbrella to stay dry when it rains.'
      },
      {
        id: 'what-2',
        question: 'What do you use to brush your teeth?',
        answer: 'Toothbrush',
        options: ['Toothbrush', 'Hairbrush', 'Pencil'],
        icon: '🪥',
        hint: 'You put toothpaste on its soft bristles every morning.',
        audioSentence: 'You use a toothbrush to keep your teeth sparkling clean.'
      },
      {
        id: 'what-3',
        question: 'What do you use to cut paper?',
        answer: 'Scissors',
        options: ['Scissors', 'Ruler', 'Eraser'],
        icon: '✂️',
        hint: 'Two safe blades that snip craft paper neatly.',
        audioSentence: 'You use scissors carefully to cut paper shapes.'
      },
      {
        id: 'what-4',
        question: 'What do you use to tell the time?',
        answer: 'Clock',
        options: ['Clock', 'Mirror', 'Plate'],
        icon: '⏰',
        hint: 'It hangs on the wall with numbers and ticking hands.',
        audioSentence: 'You look at the clock to see what time it is.'
      },
      {
        id: 'what-5',
        question: 'What do you use to write in a notebook?',
        answer: 'Pencil',
        options: ['Pencil', 'Fork', 'Shoe'],
        icon: '✏️',
        hint: 'You hold it with your fingers to draw letters and numbers.',
        audioSentence: 'You use a pencil to write your words.'
      },
      {
        id: 'what-6',
        question: 'What do you use to dry your body after a bath?',
        answer: 'Towel',
        options: ['Towel', 'Blanket', 'Pillow'],
        icon: '🛁',
        hint: 'A soft fluffy cloth you wrap around yourself after washing.',
        audioSentence: 'You use a soft towel to dry off after bathing.'
      },
      {
        id: 'what-7',
        question: 'What do you use to carry books to school?',
        answer: 'Schoolbag',
        options: ['Schoolbag', 'Pencil case', 'Cup'],
        icon: '🎒',
        hint: 'A bag with two shoulder straps for your books and pencil case.',
        audioSentence: 'You pack your schoolbag with books every morning.'
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
        answer: 'Cleaner',
        options: ['Cleaner', 'Pilot', 'Astronaut'],
        icon: '🧹',
        hint: 'They keep our hallways, desks, and classrooms tidy and safe.',
        audioSentence: 'A cleaner helps keep our school clean and bright.'
      },
      {
        id: 'who-2',
        question: 'Who teaches children in a classroom?',
        answer: 'Teacher',
        options: ['Teacher', 'Chef', 'Mechanic'],
        icon: '👩‍🏫',
        hint: 'They guide you through books, numbers, and fun projects.',
        audioSentence: 'A teacher guides and encourages students in class.'
      },
      {
        id: 'who-3',
        question: 'Who puts out fires?',
        answer: 'Firefighter',
        options: ['Firefighter', 'Gardener', 'Librarian'],
        icon: '🚒',
        hint: 'They wear yellow helmets and drive bright red fire engines.',
        audioSentence: 'A brave firefighter helps put out fires safely.'
      },
      {
        id: 'who-4',
        question: 'Who helps sick people get better?',
        answer: 'Doctor',
        options: ['Doctor', 'Baker', 'Artist'],
        icon: '👩‍⚕️',
        hint: 'They listen to your heartbeat with a stethoscope.',
        audioSentence: 'A doctor helps check your health and medicine.'
      },
      {
        id: 'who-5',
        question: 'Who helps keep people safe in the community?',
        answer: 'Police officer',
        options: ['Police officer', 'Musician', 'Clown'],
        icon: '👮',
        hint: 'They help cross roads safely and look after neighborhood safety.',
        audioSentence: 'Police officers work to keep our neighborhoods safe.'
      },
      {
        id: 'who-6',
        question: 'Who delivers letters to your home?',
        answer: 'Postal worker',
        options: ['Postal worker', 'Dentist', 'Fisherman'],
        icon: '📮',
        hint: 'They carry postcards, letters, and packages to your front door.',
        audioSentence: 'A postal worker delivers letters and packages to our homes.'
      },
      {
        id: 'who-7',
        question: 'Who cooks food in a restaurant?',
        answer: 'Chef',
        options: ['Chef', 'Electrician', 'Sailor'],
        icon: '👨‍🍳',
        hint: 'They wear a tall white hat and prepare warm tasty meals.',
        audioSentence: 'A chef prepares delicious food in a kitchen.'
      }
    ]
  },
  WHY: {
    title: 'WHY? — Reasons & Purposes',
    icon: '💭',
    subtitle: 'Think about why we do healthy and helpful things.',
    cards: [
      {
        id: 'why-1',
        question: 'Why do you take medicine prescribed for you?',
        answer: 'To help you get better',
        options: ['To help you get better', 'Because it tastes like candy', 'To stay awake all night'],
        icon: '💊',
        hint: 'Medicine helps your body fight germs so you feel strong again.',
        audioSentence: 'You take prescribed medicine to help your body heal.'
      },
      {
        id: 'why-2',
        question: 'Why do you use an umbrella in the rain?',
        answer: 'To stay dry',
        options: ['To stay dry', 'To catch butterflies', 'To make loud thunder'],
        icon: '☔',
        hint: 'The fabric canopy catches raindrops so your clothes stay dry.',
        audioSentence: 'You hold an umbrella to stay nice and dry in the rain.'
      },
      {
        id: 'why-3',
        question: 'Why do you brush your teeth?',
        answer: 'To keep them clean',
        options: ['To keep them clean', 'To make them blue', 'To whistle louder'],
        icon: '🪥',
        hint: 'Brushing sweeps away food crumbs and protects healthy smiles.',
        audioSentence: 'You brush your teeth to keep them clean and healthy.'
      },
      {
        id: 'why-4',
        question: 'Why do you wear a seat belt in a car?',
        answer: 'To help keep you safe',
        options: ['To help keep you safe', 'To change the radio', 'To go faster'],
        icon: '🚗',
        hint: 'Clicking your belt keeps you securely sitting in your seat.',
        audioSentence: 'Wearing a seat belt protects you and keeps you safe.'
      },
      {
        id: 'why-5',
        question: 'Why do you wash your hands before eating?',
        answer: 'To remove dirt and germs',
        options: ['To remove dirt and germs', 'To make water splash', 'To blow bubbles'],
        icon: '🧼',
        hint: 'Soap washes away tiny germs from surfaces you touched.',
        audioSentence: 'Washing hands with soap washes away germs before meals.'
      },
      {
        id: 'why-6',
        question: 'Why do you drink water when you are thirsty?',
        answer: 'To quench your thirst',
        options: ['To quench your thirst', 'To paint a picture', 'To cool the room'],
        icon: '🥛',
        hint: 'Water refreshes your body and hydrates your mouth.',
        audioSentence: 'Drinking cool water satisfies your thirst.'
      },
      {
        id: 'why-7',
        question: 'Why do plants need water?',
        answer: 'To help them grow',
        options: ['To help them grow', 'To play games', 'To read stories'],
        icon: '🌱',
        hint: 'Plant roots drink water from soil to grow green leaves.',
        audioSentence: 'Plants need water and sunlight to grow strong and green.'
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
        answer: 'Fire station',
        options: ['Fire station', 'Bakery', 'Cinema'],
        icon: '🚒',
        hint: 'The building with red garage doors where fire engines rest.',
        audioSentence: 'Firefighters work and keep gear ready at the fire station.'
      },
      {
        id: 'where-2',
        question: 'Where do students learn with their teacher?',
        answer: 'School',
        options: ['School', 'Airport', 'Post office'],
        icon: '🏫',
        hint: 'A place full of classrooms, friends, storybooks, and a playground.',
        audioSentence: 'Students gather to learn and play together at school.'
      },
      {
        id: 'where-3',
        question: 'Where do you go to borrow books?',
        answer: 'Library',
        options: ['Library', 'Supermarket', 'Bank'],
        icon: '📚',
        hint: 'A quiet, cozy place with shelves of wonderful books you can borrow.',
        audioSentence: 'You can borrow exciting storybooks from the library.'
      },
      {
        id: 'where-4',
        question: 'Where can you see lions and giraffes?',
        answer: 'Zoo',
        options: ['Zoo', 'Train station', 'Pharmacy'],
        icon: '🦁',
        hint: 'A park home where animal caretakers look after wildlife.',
        audioSentence: 'You can see lions, giraffes, and colorful birds at the zoo.'
      },
      {
        id: 'where-5',
        question: 'Where do doctors often treat sick people?',
        answer: 'Hospital',
        options: ['Hospital', 'Bakery', 'Sports stadium'],
        icon: '🏥',
        hint: 'A healthcare building staffed with caring doctors and nurses.',
        audioSentence: 'Doctors and nurses care for patients at the hospital.'
      },
      {
        id: 'where-6',
        question: 'Where do you buy food and groceries?',
        answer: 'Supermarket',
        options: ['Supermarket', 'Museum', 'Bus stop'],
        icon: '🛒',
        hint: 'A store with aisles of fresh apples, milk, bread, and veggies.',
        audioSentence: 'Families buy fresh groceries and fruit at the supermarket.'
      },
      {
        id: 'where-7',
        question: 'Where do you swim in a swimming competition?',
        answer: 'Swimming pool',
        options: ['Swimming pool', 'Library', 'Car park'],
        icon: '🏊',
        hint: 'A clear blue basin with lane lines painted along the bottom.',
        audioSentence: 'Swimmers practice their strokes in the swimming pool.'
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
        options: ['At night', 'At breakfast', 'At noon'],
        icon: '✨',
        hint: 'When the sun sets and the dark sky turns deep blue.',
        audioSentence: 'Twinkling stars shine in the sky at night.'
      },
      {
        id: 'when-2',
        question: 'When do you eat breakfast?',
        answer: 'In the morning',
        options: ['In the morning', 'Before sleeping', 'In the afternoon'],
        icon: '🥞',
        hint: 'Your first meal when waking up to start a cheerful new day.',
        audioSentence: 'You eat breakfast in the morning to start your day.'
      },
      {
        id: 'when-3',
        question: 'When do you wear a raincoat?',
        answer: 'When it rains',
        options: ['When it rains', 'When it is hot and sunny', 'In bed'],
        icon: '🌧️',
        hint: 'You put it on before walking out into wet grey weather.',
        audioSentence: 'You slip into a raincoat when raindrops begin falling.'
      },
      {
        id: 'when-4',
        question: 'When do you brush your teeth before bed?',
        answer: 'Before sleeping',
        options: ['Before sleeping', 'During lunchtime', 'At recess'],
        icon: '🪥',
        hint: 'Right before putting your pajamas on and climbing under covers.',
        audioSentence: 'Brushing before sleeping keeps teeth clean overnight.'
      },
      {
        id: 'when-5',
        question: 'When do you use an umbrella?',
        answer: 'When it rains',
        options: ['When it rains', 'When it snows inside', 'While swimming'],
        icon: '☂️',
        hint: 'Whenever wet clouds sprinkle drops over the street.',
        audioSentence: 'You pop open your umbrella when rainfall starts.'
      },
      {
        id: 'when-6',
        question: 'When do you celebrate your birthday?',
        answer: 'On your birthday',
        options: ['On your birthday', 'Every Monday', 'Only in winter'],
        icon: '🎂',
        hint: 'On your special date each year with candles and a song!',
        audioSentence: 'We celebrate our age on our special birthday.'
      },
      {
        id: 'when-7',
        question: 'When do you eat lunch?',
        answer: 'Around midday',
        options: ['Around midday', 'At midnight', 'Early dawn'],
        icon: '🥪',
        hint: 'In the middle of the school day when the midday bell rings.',
        audioSentence: 'Students sit down for a nutritious lunch around midday.'
      }
    ]
  }
};

export const WHAT_DO_I_NEED_SCENARIOS = [
  {
    id: 'need-rain',
    title: 'Rain Outside',
    situation: 'It is raining outside and puddles are splashing.',
    prompt: 'It is raining. What can help keep me dry?',
    correctAnswer: 'Umbrella',
    modelSentence: 'I need an umbrella because it is raining.',
    icon: '🌧️',
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
    prompt: 'I am thirsty. What do I need?',
    correctAnswer: 'Water',
    modelSentence: 'I need water because I am thirsty.',
    icon: '🏃',
    choices: [
      { label: 'Water', icon: '🥛', isCorrect: true },
      { label: 'Pencil', icon: '✏️', isCorrect: false },
      { label: 'Jacket', icon: '🧥', isCorrect: false },
      { label: 'Clock', icon: '⏰', isCorrect: false }
    ],
    hint: 'A fresh, cool drink that quenches dry throats.'
  },
  {
    id: 'need-hunger',
    title: 'Tummy Rumbling',
    situation: 'It is lunchtime and you feel hungry.',
    prompt: 'I am hungry. What can I eat?',
    correctAnswer: 'Food',
    modelSentence: 'I need something to eat because I am hungry.',
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
    prompt: 'I feel cold. What should I wear?',
    correctAnswer: 'Jacket',
    modelSentence: 'I need a jacket because I feel cold.',
    icon: '❄️',
    choices: [
      { label: 'Jacket', icon: '🧥', isCorrect: true },
      { label: 'Swimsuit', icon: '🩱', isCorrect: false },
      { label: 'Spoon', icon: '🥄', isCorrect: false },
      { label: 'Fan', icon: '🪭', isCorrect: false }
    ],
    hint: 'A cozy zip-up coat that traps body warmth.'
  },
  {
    id: 'need-school',
    title: 'Going to School',
    situation: 'It is time for the morning school bus.',
    prompt: 'I need to carry my books. What do I need?',
    correctAnswer: 'Schoolbag',
    modelSentence: 'I need my schoolbag to carry my books.',
    icon: '🚌',
    choices: [
      { label: 'Schoolbag', icon: '🎒', isCorrect: true },
      { label: 'Toy train', icon: '🚂', isCorrect: false },
      { label: 'Fork', icon: '🍴', isCorrect: false },
      { label: 'Blanket', icon: '🛋️', isCorrect: false }
    ],
    hint: 'A handy backpack with straps that holds notebooks.'
  },
  {
    id: 'need-tired',
    title: 'Tired at Night',
    situation: 'Your eyes are heavy and you yawn.',
    prompt: 'I am tired. Where can I rest?',
    correctAnswer: 'Bed',
    modelSentence: 'I can rest on my bed because I am tired.',
    icon: '🥱',
    choices: [
      { label: 'Bed', icon: '🛏️', isCorrect: true },
      { label: 'Desk', icon: '🪵', isCorrect: false },
      { label: 'Bicycle', icon: '🚲', isCorrect: false },
      { label: 'Slide', icon: '🛝', isCorrect: false }
    ],
    hint: 'A cozy mattress with a soft pillow for sweet dreams.'
  },
  {
    id: 'need-cut',
    title: 'Small Scrape or Cut',
    situation: 'You scraped your knee while playing on the grass.',
    prompt: 'I have a small cut. What should I ask a trusted adult for?',
    correctAnswer: 'Adult help / First aid',
    modelSentence: 'I should ask a trusted adult for help.',
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
