/**
 * SpeakUp Credible Speech, Language & Communication Support Guide
 * and Explainable Activity-Recommendation Engine.
 *
 * Grounded in the American Speech-Language-Hearing Association (ASHA) Practice Portal.
 * Designed as an educational support and activity-recommendation reference for teachers,
 * caregivers, and exhibition visitors — NOT a diagnostic or clinical treatment tool.
 */

export const ASHA_PORTAL_MAIN_URL = 'https://www.asha.org/practice-portal/';

export const SPEECH_LANGUAGE_SUPPORT_GUIDE = [
  {
    id: 'speech-sound-disorders',
    code: 'A',
    title: 'Speech Sound Disorders (Articulation & Phonology)',
    icon: '🔤',
    badge: 'Articulation vs. Phonological Patterns',
    plainExplanation:
      'Speech sound difficulties affect how a person produces or organises speech sounds so others can understand them. Clinical practice distinguishes between two main types that can also overlap: (1) Articulation difficulties involve physically making a specific speech sound (such as producing a clear /r/, /s/, or /l/ with the tongue and lips). (2) Phonological difficulties involve predictable, rule-based patterns of sound errors across groups of sounds (for example, leaving off the final consonant of words like saying "ca" for "cat", or replacing back sounds like /k/ and /g/ with front sounds like /t/ and /d/).',
    studentDifficulties: [
      'Difficulty physically shaping the tongue, lips, or airflow for specific sounds (articulation).',
      'Substituting one class of sounds for another or simplifying consonant blends like "sp" or "tr" (phonological patterns).',
      'Being harder for unfamiliar listeners to understand in classroom conversations.'
    ],
    relevantLearningGoals: [
      'Recognise how letters and spelling patterns connect to speech sounds (phonological and phonics awareness).',
      'Listen to clear spoken models of teacher-selected target words.',
      'Practise selected target words or use them in familiar phrases and sentences when recommended by a specialist.'
    ],
    speakUpModules: [
      {
        moduleName: 'Sound Garden',
        moduleKey: 'sound-garden',
        activity: 'Flipbook word building, digraph/blend highlights (sh, ch, th), and beginning/middle/end sound position awareness.',
        canDo: 'Builds letter-sound awareness, visual spelling pattern recognition, and listening discrimination.',
        cannotDo: 'Completing a spelling card does not prove a student can physically pronounce the sound, and literacy activities do not automatically resolve speech sound disorders.'
      },
      {
        moduleName: 'Speak & Practise',
        moduleKey: 'speak-practise',
        activity: 'Listening to normal (1.0x) and slow (0.65x) audio models of teacher-assigned target words, with optional self-paced practice.',
        canDo: 'Provides consistent auditory models and optional, low-pressure voice replay.',
        cannotDo: 'Cannot clinically score articulation placement or replace individualised phonetic placement cues from a Speech-Language Pathologist (SLP).'
      },
      {
        moduleName: 'Sentence Treehouse',
        moduleKey: 'sentence-treehouse',
        activity: 'Using target vocabulary words inside meaningful 2- to 4-part sentences.',
        canDo: 'Helps bridge familiar target words into broader sentence formulation when relevant.',
        cannotDo: 'Does not evaluate conversational speech intelligibility.'
      }
    ],
    specialistGuidanceNote:
      'A qualified Speech-Language Pathologist (SLP) is needed to assess whether errors are developmental, articulation-based, phonological, or motor-based, and to select appropriate target sounds.',
    sources: [
      {
        label: 'ASHA Practice Portal: Speech Sound Disorders — Articulation and Phonology',
        url: 'https://www.asha.org/practice-portal/clinical-topics/articulation-and-phonology/'
      },
      {
        label: 'ASHA Practice Portal Main Directory',
        url: 'https://www.asha.org/practice-portal/'
      }
    ]
  },
  {
    id: 'fluency-disorders',
    code: 'B',
    title: 'Fluency Disorders (Stuttering & Cluttering)',
    icon: '🌊',
    badge: 'Flow, Timing & Rate of Speech',
    plainExplanation:
      'Fluency difficulties involve differences in the continuity, smoothness, rate, or effort of speech. Stuttering may include repetitions of sounds, syllables, or words, sound prolongations, or blocks where airflow or voicing temporarily stops, sometimes accompanied by physical tension or speaking anxiety. Cluttering involves a perceived rapid or irregular speech rate, collapsed or omitted syllables, and disorganised phrasing or language formulation that can reduce clarity.',
    studentDifficulties: [
      'Repeating sounds or syllables, stretching out sounds, or experiencing silent blocks when trying to speak.',
      'Feeling rushed, anxious, or frustrated when called on to answer quickly aloud.',
      'Speaking in rapid bursts where words or ideas run together (cluttering).'
    ],
    relevantLearningGoals: [
      'Formulate and organise thoughts visually into structured sentences at an unhurried pace.',
      'Expand everyday vocabulary and comprehension without time pressure.',
      'Use multi-modal or AAC communication options whenever speaking feels tiring or high-pressure.'
    ],
    speakUpModules: [
      {
        moduleName: 'Sentence Treehouse',
        moduleKey: 'sentence-treehouse',
        activity: 'Visual sentence construction (Who + Doing + What) and conjunction linking at the student’s own pace.',
        canDo: 'Supports calm language organisation and sentence planning without countdown timers.',
        cannotDo: 'Does not provide fluency shaping, stuttering modification therapy, or speech-rate training.'
      },
      {
        moduleName: 'Think & Discover',
        moduleKey: 'think-discover',
        activity: 'Exploring WH questions and everyday vocabulary using visual card selection.',
        canDo: 'Allows students to demonstrate comprehension and vocabulary knowledge without requiring timed verbal responses.',
        cannotDo: 'Does not assess or treat fluency disorders.'
      },
      {
        moduleName: 'What Do I Need? & My Talking Board',
        moduleKey: 'what-do-i-need',
        activity: 'Symbol-based communication board and functional scenarios.',
        canDo: 'Offers a supportive, zero-pressure communication channel whenever helpful.',
        cannotDo: 'Is a supplementary communication support, not clinical fluency intervention.'
      }
    ],
    specialistGuidanceNote:
      'SpeakUp never uses speed challenges, countdown timers, or fluency scoring. Students experiencing stuttering or cluttering should be supported by a qualified SLP for individualised fluency strategies and supportive classroom accommodations.',
    sources: [
      {
        label: 'ASHA Practice Portal: Fluency Disorders (Stuttering & Cluttering)',
        url: 'https://www.asha.org/practice-portal/clinical-topics/fluency-disorders/'
      }
    ]
  },
  {
    id: 'voice-resonance-disorders',
    code: 'C',
    title: 'Voice and Resonance Disorders',
    icon: '🔔',
    badge: 'Vocal Quality, Pitch, Loudness & Nasal Airflow',
    plainExplanation:
      'Voice and resonance difficulties concern how sound is generated by the vocal folds (voice) or how sound vibrates and travels through the throat, mouth, and nasal passages (resonance)—rather than incorrect word pronunciation. Voice disorders may involve hoarseness, breathiness, vocal strain, vocal fatigue, or inappropriate pitch/loudness. Resonance disorders involve too much sound/airflow entering the nasal cavity (hypernasality), too little nasal resonance (hyponasality), or trapped airflow (cul-de-sac resonance), sometimes related to structural differences such as velopharyngeal dysfunction or cleft palate.',
    studentDifficulties: [
      'A raspy, hoarse, breathy, or strained voice, or losing voice quality after talking.',
      'Difficulty projecting the voice comfortably in a noisy classroom.',
      'Speech that sounds overly nasal or muffled due to resonance differences.'
    ],
    relevantLearningGoals: [
      'Communicate needs and participate in class using AAC or visual choices when resting the voice.',
      'Build receptive vocabulary and sentence structure without vocal strain.'
    ],
    speakUpModules: [
      {
        moduleName: 'What Do I Need? & My Talking Board',
        moduleKey: 'what-do-i-need',
        activity: 'Tap-to-speak AAC communication board and everyday need scenarios.',
        canDo: 'Lets students communicate everyday needs and classroom messages using text-to-speech when vocal rest is needed or speaking is effortful.',
        cannotDo: 'Does not treat vocal fold health, vocal hygiene, or resonance mechanics.'
      },
      {
        moduleName: 'Think & Discover & Sentence Treehouse',
        moduleKey: 'think-discover',
        activity: 'Non-vocal vocabulary comprehension and visual sentence assembly.',
        canDo: 'Allows full participation in language and literacy learning without requiring loud or repeated vocalisation.',
        cannotDo: 'Does not provide voice therapy or resonance treatment.'
      }
    ],
    specialistGuidanceNote:
      'SpeakUp does NOT recommend generic vocal exercises and does NOT treat voice or resonance disorders. Persistent hoarseness, vocal strain, or resonance differences require evaluation by an ear, nose, and throat physician (otolaryngologist/ENT) and a qualified SLP before any vocal exercises are attempted.',
    sources: [
      {
        label: 'ASHA Practice Portal: Voice Disorders',
        url: 'https://www.asha.org/practice-portal/clinical-topics/voice-disorders/'
      },
      {
        label: 'ASHA Practice Portal: Resonance Disorders',
        url: 'https://www.asha.org/practice-portal/clinical-topics/resonance-disorders/'
      }
    ]
  },
  {
    id: 'motor-speech-disorders',
    code: 'D',
    title: 'Motor Speech Disorders (Childhood Apraxia of Speech & Dysarthria)',
    icon: '⚙️',
    badge: 'Motor Planning/Programming vs. Neuromuscular Execution',
    plainExplanation:
      'Motor speech disorders affect the neurological planning, programming, coordination, or muscular execution of speech movements. Two distinct conditions should not be treated as interchangeable: (1) Childhood Apraxia of Speech (CAS) is a motor planning and programming disorder where the brain has difficulty coordinating the precise, timing-sensitive movement sequences of the lips, jaw, and tongue needed for speech, even though the muscles themselves are not weak. (2) Dysarthria is a group of motor speech disorders caused by impaired muscle strength, tone, range of motion, or coordination (affecting respiration, phonation, resonance, prosody, or articulation) due to neurological differences.',
    studentDifficulties: [
      'Inconsistent errors on consonants and vowels across repeated attempts, or difficulty transitioning smoothly between sounds and syllables (characteristic of CAS).',
      'Slurred, slow, quiet, or physically effortful speech due to muscle weakness or altered muscle tone (characteristic of dysarthria).',
      'High fatigue when asked to repeat spoken words many times.'
    ],
    relevantLearningGoals: [
      'Communicate everyday needs, feelings, and classroom choices reliably using AAC.',
      'Build receptive vocabulary and visual sentence structures without physical speech fatigue.',
      'Where explicitly recommended by the student’s SLP, listen to slow, clear word models.'
    ],
    speakUpModules: [
      {
        moduleName: 'What Do I Need? & My Talking Board',
        moduleKey: 'what-do-i-need',
        activity: 'Symbol-based AAC communication board and everyday helper scenarios.',
        canDo: 'Provides immediate, reliable functional communication so the student can express wants, needs, and feelings without motor fatigue.',
        cannotDo: 'Does not replace a personalised, comprehensive AAC system evaluated by an specialist team.'
      },
      {
        moduleName: 'Speak & Practise (SLP-Guided Only)',
        moduleKey: 'speak-practise',
        activity: 'Listening to slow (0.65x) audio models of functional words, only when judged appropriate for the student’s individual goal.',
        canDo: 'Allows calm listening to an audio model without forcing microphone recording or repeated drill.',
        cannotDo: 'Does NOT prescribe non-speech oral-motor exercises, does NOT treat CAS or dysarthria, and must never assume repeated word imitation is suitable for every student.'
      }
    ],
    specialistGuidanceNote:
      'Differential diagnosis and motor-speech intervention for CAS or dysarthria require a qualified Speech-Language Pathologist using specialised motor-learning principles. SpeakUp does not prescribe oral-motor exercises or automated speech drills.',
    sources: [
      {
        label: 'ASHA Practice Portal: Childhood Apraxia of Speech (CAS)',
        url: 'https://www.asha.org/practice-portal/clinical-topics/childhood-apraxia-of-speech/'
      },
      {
        label: 'ASHA Practice Portal: Dysarthria',
        url: 'https://www.asha.org/practice-portal/clinical-topics/dysarthria/'
      }
    ]
  },
  {
    id: 'spoken-language-difficulties',
    code: 'E',
    title: 'Spoken Language Difficulties (Receptive & Expressive)',
    icon: '🌳',
    badge: 'Understanding, Vocabulary, Grammar & Storytelling',
    plainExplanation:
      'Spoken language difficulties affect how a student understands language (receptive language) and/or how they put words together to share ideas (expressive language). Receptive difficulties may involve trouble understanding vocabulary, following multi-step directions, or comprehending Who, What, Where, When, and Why questions. Expressive difficulties may involve limited vocabulary, short or incomplete sentences, difficulty with grammar (such as verb tenses or conjunctions like "because" and "when"), or trouble sequencing events into a clear story.',
    studentDifficulties: [
      'Difficulty understanding or answering WH questions (Who, What, Where, When, Why).',
      'Using single words or short fragments instead of complete sentences, or omitting grammatical markers like past tense "-ed".',
      'Finding it hard to explain reasons ("because"), purposes ("to"), or event sequences (Yesterday, Today, Tomorrow).'
    ],
    relevantLearningGoals: [
      'Understand and answer Who, What, Where, When, and Why questions using visual and audio cues.',
      'Construct 2-, 3-, and 4-part sentences and expand them with purpose ("to"), time ("when"), and reason ("because").',
      'Sequence events across Yesterday, Today, and Tomorrow using appropriate verb forms.'
    ],
    speakUpModules: [
      {
        moduleName: 'Sentence Treehouse',
        moduleKey: 'sentence-treehouse',
        activity: '4-Part Sentence Builder, Connect the Sentence (to, when, because), and Tenses Adventure (Time Tree, Verb Adventures, Story Sequencer).',
        canDo: 'Scaffolds sentence formulation, conjunction relationships, and verb tense sequencing with visual word tiles and audio models.',
        cannotDo: 'Selecting tiles on screen does not guarantee spontaneous grammatical carry-over in real-world conversation.'
      },
      {
        moduleName: 'Think & Discover',
        moduleKey: 'think-discover',
        activity: '5 WH-question pathways (What, Who, Why, Where, When) with illustrated choices and spoken context sentences.',
        canDo: 'Supports everyday vocabulary comprehension and models complete answer sentences (including short-phrase reasons for Why questions).',
        cannotDo: 'Selecting a picture card demonstrates receptive recognition, which is distinct from independent word retrieval or spoken expression.'
      },
      {
        moduleName: 'What Do I Need?',
        moduleKey: 'what-do-i-need',
        activity: 'Everyday functional scenarios and symbol-based message building.',
        canDo: 'Reinforces practical vocabulary in meaningful daily situations.',
        cannotDo: 'Does not replace formal clinical language evaluation.'
      }
    ],
    specialistGuidanceNote:
      'Comprehensive assessment of receptive and expressive language disorders (including Developmental Language Disorder) should be conducted by a qualified SLP in collaboration with classroom educators and families.',
    sources: [
      {
        label: 'ASHA Practice Portal: Spoken Language Disorders',
        url: 'https://www.asha.org/practice-portal/clinical-topics/spoken-language-disorders/'
      }
    ]
  },
  {
    id: 'orofacial-myofunctional-disorders',
    code: 'F',
    title: 'Orofacial Myofunctional Disorders (OMD)',
    icon: '👄',
    badge: 'Oral & Facial Muscle Patterns & Posture',
    plainExplanation:
      'Orofacial Myofunctional Disorders (OMDs) involve atypical movement patterns or resting postures of the muscles of the mouth, jaw, lips, and face. These may include an anterior or lateral tongue thrust during swallowing or speaking, an open-mouth resting posture, chronic mouth breathing, or prolonged oral habits (such as thumb sucking), which can sometimes co-occur with dental malocclusion or fronted speech sounds (like a lisp on /s/ and /z/).',
    studentDifficulties: [
      'Tongue pushing forward against or between the teeth during swallowing or during sounds like /s/, /z/, /t/, /d/, /n/, or /l/.',
      'Habitual open-mouth resting posture or difficulty maintaining lip closure at rest.',
      'Co-occurring dental, orthodontic, airway, or feeding/swallowing considerations.'
    ],
    relevantLearningGoals: [
      'Participate in general classroom vocabulary, comprehension, or AAC communication activities where relevant to school goals.'
    ],
    speakUpModules: [
      {
        moduleName: 'What Do I Need? & My Talking Board',
        moduleKey: 'what-do-i-need',
        activity: 'Functional classroom communication support when helpful.',
        canDo: 'Supports general everyday communication in the classroom.',
        cannotDo: 'SpeakUp is NOT an orofacial myofunctional treatment programme. None of SpeakUp’s modules assess or treat resting tongue/lip posture, swallowing patterns, breathing, or myofunctional conditions.'
      }
    ],
    specialistGuidanceNote:
      'Any targeted assessment or intervention for Orofacial Myofunctional Disorders falls outside the scope of SpeakUp and must be guided by an appropriately qualified SLP, dentist, orthodontist, or medical specialist.',
    sources: [
      {
        label: 'ASHA Practice Portal: Orofacial Myofunctional Disorders',
        url: 'https://www.asha.org/practice-portal/clinical-topics/orofacial-myofunctional-disorders/'
      }
    ]
  },
  {
    id: 'aac-functional-communication',
    code: 'G',
    title: 'Functional Communication and AAC Needs',
    icon: '🧸',
    badge: 'Multi-Modal & Symbol-Supported Communication',
    plainExplanation:
      'Augmentative and Alternative Communication (AAC) encompasses all tools and strategies used to express thoughts, needs, wants, and ideas alongside spoken speech (augmentative) or in place of spoken speech (alternative). AAC includes unaided methods (gestures, facial expressions, manual signs) and aided systems (picture communication boards, symbol strips, and speech-generating devices). AAC benefits learners with a wide variety of communication profiles—it is NOT restricted to people who cannot speak at all, and using AAC does not prevent or delay spoken speech development.',
    studentDifficulties: [
      'Difficulty communicating urgent everyday needs (water, food, bathroom, break, help, stop) reliably through speech alone.',
      'Frustration when spoken attempts are not understood by peers or adults.',
      'Needing visual symbol support to initiate requests, answer questions, or build multi-word messages.'
    ],
    relevantLearningGoals: [
      'Communicate everyday needs and requests independently using AAC symbols and text-to-speech.',
      'Respond to everyday situational prompts (rainy day, feeling thirsty, needing help or a break).',
      'Combine symbols and visual cards to build multi-concept messages.'
    ],
    speakUpModules: [
      {
        moduleName: 'What Do I Need? & My Talking Board',
        moduleKey: 'aac-board',
        activity: 'Free-choice AAC communication grid with message bar and 7 illustrated everyday need scenarios.',
        canDo: 'Allows students to select core and everyday symbols ("I need help", "I want water", "Can I take a break?") and play them aloud via text-to-speech without having to pass a quiz or speak aloud first.',
        cannotDo: 'Is an introductory classroom board and does not replace a customised, robust high-tech SGD/AAC vocabulary system configured by an AAC specialist.'
      },
      {
        moduleName: 'Think & Discover',
        moduleKey: 'think-discover',
        activity: 'Visual picture and word card selection across Who, What, Where, When, and Why questions.',
        canDo: 'Validates receptive understanding through point/tap selection without requiring spoken answers.',
        cannotDo: 'Does not evaluate physical access needs (such as eye-gaze or switch scanning).'
      },
      {
        moduleName: 'Sentence Treehouse',
        moduleKey: 'sentence-treehouse',
        activity: 'Visual card-based sentence construction (Who + Doing + What).',
        canDo: 'Supports transitioning from single symbols to structured multi-symbol messages.',
        cannotDo: 'Does not replace personalised AAC linguistic navigation.'
      }
    ],
    specialistGuidanceNote:
      'AAC should never be withheld until a student attempts spoken speech. An SLP and assistive technology team should guide the selection and customisation of a student’s primary AAC system.',
    sources: [
      {
        label: 'ASHA Practice Portal: Augmentative and Alternative Communication (AAC)',
        url: 'https://www.asha.org/practice-portal/professional-issues/augmentative-and-alternative-communication/'
      }
    ]
  }
];

/**
 * Grouped Learning-Goal Selector (Section 5D)
 * Grouped by skill area — never equates a skill goal with a clinical diagnosis.
 */
export const GROUPED_LEARNING_GOALS = [
  {
    groupId: 'grp-speech-sounds',
    groupTitle: '1. Speech Sound Practice',
    icon: '🎙️',
    goals: [
      {
        id: 'goal-speech-target-words',
        label: 'Practise listening to and optionally producing selected target words',
        defaultModule: 'speak-practise',
        skillArea: 'Speech sound practice'
      },
      {
        id: 'goal-speech-phrase-sentence',
        label: 'Use teacher-selected target words in short phrases or familiar sentences',
        defaultModule: 'speak-practise',
        skillArea: 'Speech sound practice'
      }
    ]
  },
  {
    groupId: 'grp-phonics-awareness',
    groupTitle: '2. Letter-Sound Relationships & Phonological Awareness',
    icon: '🔤',
    goals: [
      {
        id: 'goal-letter-sound-links',
        label: 'Connect letters, digraphs (sh, ch, th), and vowel patterns to illustrated words',
        defaultModule: 'sound-garden',
        skillArea: 'Letter-sound relationships'
      },
      {
        id: 'goal-sound-position',
        label: 'Identify whether a target sound occurs at the beginning, middle, or end of a word',
        defaultModule: 'sound-garden',
        skillArea: 'Phonological awareness'
      }
    ]
  },
  {
    groupId: 'grp-everyday-vocab',
    groupTitle: '3. Everyday Vocabulary',
    icon: '📚',
    goals: [
      {
        id: 'goal-vocab-objects-roles',
        label: 'Improve understanding and recognition of everyday objects, people, and places',
        defaultModule: 'think-discover',
        skillArea: 'Everyday vocabulary'
      }
    ]
  },
  {
    groupId: 'grp-comprehension-wh',
    groupTitle: '4. Listening & Language Comprehension',
    icon: '🔍',
    goals: [
      {
        id: 'goal-wh-questions',
        label: 'Understand and answer Who, What, Where, When, and Why questions with context models',
        defaultModule: 'think-discover',
        skillArea: 'Listening & language comprehension'
      }
    ]
  },
  {
    groupId: 'grp-sentence-grammar',
    groupTitle: '5. Sentence Construction & Grammar',
    icon: '🌳',
    goals: [
      {
        id: 'goal-sentence-builder',
        label: 'Construct structured sentences (Who + Doing + What) using visual word tiles',
        defaultModule: 'sentence-builder',
        skillArea: 'Sentence construction & grammar'
      },
      {
        id: 'goal-sentence-conjunctions',
        label: 'Connect and expand sentences using purpose ("to"), time ("when"), and reason ("because")',
        defaultModule: 'sentence-connect',
        skillArea: 'Sentence construction & grammar'
      }
    ]
  },
  {
    groupId: 'grp-sequencing-events',
    groupTitle: '6. Sequencing & Describing Events',
    icon: '⏳',
    goals: [
      {
        id: 'goal-tenses-sequencing',
        label: 'Sequence events and select verb forms across Yesterday, Today, and Tomorrow',
        defaultModule: 'tenses-adventure',
        skillArea: 'Sequencing & describing events'
      }
    ]
  },
  {
    groupId: 'grp-functional-comm',
    groupTitle: '7. Functional Communication',
    icon: '⛵',
    goals: [
      {
        id: 'goal-functional-scenarios',
        label: 'Identify and communicate helpful solutions in everyday situations (rain, thirst, tired, help)',
        defaultModule: 'what-do-i-need',
        skillArea: 'Functional communication'
      }
    ]
  },
  {
    groupId: 'grp-aac-comm',
    groupTitle: '8. AAC-Supported Communication',
    icon: '🧸',
    goals: [
      {
        id: 'goal-aac-board',
        label: 'Communicate everyday needs, feelings, and requests independently using AAC symbols',
        defaultModule: 'aac-board',
        skillArea: 'AAC-supported communication'
      }
    ]
  }
];

/**
 * Explainable Activity-Recommendation Engine (Section 4)
 * Generates transparent, teacher-editable recommendations based on:
 * - Documented learning goals
 * - Teacher classroom observations
 * - Professional SLP recommendations (where provided)
 * - Student communication preferences & strengths
 * - Completed activity history
 * Never diagnoses a student or recommends solely from a disorder label.
 */
export const OUT_OF_SCOPE_SPECIALIST_REMINDERS = {
  voiceResonance: {
    title: 'Voice or Resonance Concerns (Hoarseness, Vocal Strain, Hyper/Hyponasality)',
    notice:
      'SpeakUp cannot assess vocal fold health or velopharyngeal resonance and does not provide vocal exercises. Medical/ENT and SLP evaluation is required before any vocal exercise programme.',
    whatSpeakUpCanDoInstead:
      'Provide AAC communication (What Do I Need?) and non-vocal language/comprehension activities (Think & Discover, Sentence Treehouse) to reduce vocal load.'
  },
  fluencyDisorders: {
    title: 'Fluency Concerns (Stuttering Blocks, Prolongations, Cluttering)',
    notice:
      'SpeakUp is not a dedicated fluency shaping or stuttering modification treatment programme. Never introduce speed challenges or pressure to speak fluently.',
    whatSpeakUpCanDoInstead:
      'Offer unhurried, timer-free language preparation in Sentence Treehouse and optional AAC alternatives in What Do I Need?.'
  },
  motorSpeechCasDysarthria: {
    title: 'Motor Speech Considerations (Childhood Apraxia of Speech [CAS] or Dysarthria)',
    notice:
      'SpeakUp does not provide motor speech programming therapy, tactile-kinesthetic cueing, or non-speech oral-motor exercises. Target words should only be assigned under direct SLP guidance.',
    whatSpeakUpCanDoInstead:
      'Provide immediate, reliable AAC communication (What Do I Need?) and SLP-selected slow audio listening models without forced repetition.'
  },
  orofacialMyofunctional: {
    title: 'Orofacial Myofunctional Disorders (OMD — Swallowing, Tongue Thrust, Resting Posture)',
    notice:
      'SpeakUp is NOT an orofacial myofunctional treatment programme and cannot evaluate oral rest posture, breathing, or swallowing patterns.',
    whatSpeakUpCanDoInstead:
      'Support concurrent classroom vocabulary, literacy, or sentence goals if co-occurring speech/language targets are identified by an SLP.'
  }
};

export function generateExplainableRecommendations(student) {
  if (!student) return { recommendations: [], outOfScopeNotice: null, outOfScopeNotices: [] };

  const goalIds = student.selectedGoalIds || [];
  const prefs = (student.communicationPreferences || '').toLowerCase();
  const slpNotes = (student.slpRecommendations || '').toLowerCase();
  const obsNotes = (student.classroomObservations || '').toLowerCase();
  const combinedNotes = `${prefs} ${slpNotes} ${obsNotes}`;

  const recommendations = [];

  // 1. Speech Sound & Letter-Sound Goals
  if (
    goalIds.includes('speech-sounds') ||
    goalIds.includes('letter-sounds') ||
    goalIds.includes('goal-speech-target-words') ||
    goalIds.includes('goal-letter-sound-links') ||
    goalIds.includes('goal-sound-position')
  ) {
    recommendations.push({
      id: 'rec-sound-garden',
      moduleName: 'Sound Garden',
      moduleKey: 'sound-garden',
      icon: '🔤',
      activityType: `Flipbook Word Building & Sound Position (Target focus: ${student.assignedWord || 'Ship / Umbrella'})`,
      relatedGoal: 'Connect letters, speech sounds, and spelling patterns in familiar illustrated words.',
      whyRelevant:
        'Supports phonological awareness and visual letter-sound mapping (including initial/medial/final sound position). Note: Completing spelling cards builds literacy and sound awareness, which is distinct from physical speech production.',
      recommendedSupports: ['Picture cues on flipbook cards', 'Audio word & phoneme models', 'Mouth placement visual reference'],
      specialistReminder:
        'Target speech sounds should follow the Speech-Language Pathologist’s developmental sequence rather than classroom spelling lists alone.'
    });

    // Only recommend Speak & Practise if AAC-only preference is not strict, or as listen-first
    recommendations.push({
      id: 'rec-speak-practice',
      moduleName: 'Speak & Practise',
      moduleKey: 'speak-practise',
      icon: '🎙️',
      activityType: `Audio Model Listening & Optional Self-Paced Practice ("${student.assignedWord || 'Rabbit'}")`,
      relatedGoal: 'Practise identifying and listening to selected speech sounds in familiar words.',
      whyRelevant:
        'Allows the student to listen to normal (1.0x) and slow (0.65x) audio models before optionally practising at their own pace. These activities provide supplementary listening and word practice; they do not independently diagnose or treat a speech sound or motor speech disorder.',
      recommendedSupports: ['Replayable slow audio model (0.65x)', 'Optional recording (never mandatory)', 'No automated pronunciation pass/fail scoring'],
      specialistReminder:
        'Repeated spoken imitation is not suitable for every learner. Consult the SLP if the student shows vocal strain, frustration, or motor fatigue.'
    });
  }

  // 2. Spoken Language, Sentence Construction & Sequencing Goals
  if (
    goalIds.includes('sentence-construction') ||
    goalIds.includes('event-sequencing') ||
    goalIds.includes('goal-sentence-builder') ||
    goalIds.includes('goal-sentence-conjunctions') ||
    goalIds.includes('goal-tenses-sequencing')
  ) {
    recommendations.push({
      id: 'rec-sentence-treehouse',
      moduleName: 'Sentence Treehouse',
      moduleKey: 'sentence-treehouse',
      icon: '🌳',
      activityType: '4-Part Sentence Builder & Connect the Sentence (to, when, because)',
      relatedGoal: 'Construct grammatical sentences and connect ideas using purpose, time, and reason.',
      whyRelevant:
        'Provides structured visual tiles (Who + Doing + What + Optional Expansion) so the student can organise language step-by-step and hear the completed sentence model.',
      recommendedSupports: ['Visual picture cues on word tiles', 'Spoken audio model playback', 'Flexible 2- to 4-part sentence length'],
      specialistReminder:
        'Classroom carryover should be supported with natural conversation opportunities alongside digital practice.'
    });
  }

  if (goalIds.includes('event-sequencing') || goalIds.includes('goal-tenses-sequencing')) {
    recommendations.push({
      id: 'rec-tenses-adventure',
      moduleName: 'Sentence Treehouse — Tenses Adventure',
      moduleKey: 'tenses-adventure',
      icon: '⏳',
      activityType: 'The Time Tree & 3-Step Story Sequencer (Yesterday, Today, Tomorrow)',
      relatedGoal: 'Sequence events and select appropriate past, present, and future verb forms.',
      whyRelevant:
        'Uses explicit time clues (Yesterday: Pip played, Today: Pip plays, Tomorrow: Pip will play) to help the student connect event order with verb grammar.',
      recommendedSupports: ['Time clue badges (Yesterday / Today / Tomorrow)', 'Audio playback of sequenced story'],
      specialistReminder:
        'Present continuous ("is playing") is available as an optional extension when the student is ready.'
    });
  }

  // 3. Everyday Vocabulary & WH Comprehension Goals
  if (
    goalIds.includes('everyday-vocab') ||
    goalIds.includes('wh-questions') ||
    goalIds.includes('goal-vocab-objects-roles') ||
    goalIds.includes('goal-wh-questions')
  ) {
    recommendations.push({
      id: 'rec-think-discover',
      moduleName: 'Think & Discover',
      moduleKey: 'think-discover',
      icon: '🔍',
      activityType: 'WH Question Pathways (What, Who, Why, Where, When) with Spoken Context Sentences',
      relatedGoal: 'Improve understanding of everyday vocabulary and WH questions.',
      whyRelevant:
        'Presents clear illustrations and concise WH questions, followed by a complete spoken context sentence (e.g., "An umbrella. I use an umbrella when it rains."). Selecting a picture card tracks receptive comprehension without requiring spoken output.',
      recommendedSupports: [
        student.supports?.fewerChoices ? 'Reduced answer choices (2 cards)' : '3 visual answer cards',
        'Question audio replay',
        'Gentle hint & retry prompts'
      ],
      specialistReminder:
        'Receptive card selection does not automatically mean the student can independently retrieve or pronounce the word in conversation.'
    });
  }

  // 4. Functional Communication & AAC Goals (or when preferences mention AAC / non-speaking support)
  if (
    goalIds.includes('aac-needs') ||
    goalIds.includes('goal-functional-scenarios') ||
    goalIds.includes('goal-aac-board') ||
    prefs.includes('aac') ||
    prefs.includes('symbol')
  ) {
    recommendations.push({
      id: 'rec-aac-needs',
      moduleName: 'What Do I Need? & My Talking Board',
      moduleKey: 'what-do-i-need',
      icon: '⛵',
      activityType: 'Free AAC Communication Board & Everyday Need Scenarios (Rain, Thirst, Help, Break)',
      relatedGoal: 'Communicate everyday needs and requests more independently.',
      whyRelevant:
        'Supports functional vocabulary recognition and multi-symbol message construction with text-to-speech output. The student does not need to speak aloud or complete a quiz first to communicate successfully.',
      recommendedSupports: ['Always-accessible Talking Board', 'Spoken TTS output on tap', 'Clear & undo message strip'],
      specialistReminder:
        'AAC should never be withheld until a student attempts speech. Coordinate with the student’s SLP to align board symbols with their primary AAC system.'
    });
  }

  // Check if notes mention clinical areas outside SpeakUp's direct treatment scope (e.g. OMD, Voice, Swallowing, Motor Speech)
  let outOfScopeNotice = null;
  if (
    combinedNotes.includes('myofunctional') ||
    combinedNotes.includes('swallow') ||
    combinedNotes.includes('tongue thrust') ||
    combinedNotes.includes('voice') ||
    combinedNotes.includes('hoarse') ||
    combinedNotes.includes('apraxia') ||
    combinedNotes.includes('dysarthria') ||
    combinedNotes.includes('stutter')
  ) {
    outOfScopeNotice =
      'Specialist Scope Notice: This student’s record notes considerations involving motor speech, fluency, voice/resonance, or orofacial myofunctional patterns. SpeakUp modules provide supplementary language, literacy, or AAC communication support only and do not diagnose or clinically treat these underlying conditions. Please follow the qualified Speech-Language Pathologist’s guidance.';
  }

  const normalizedRecommendations = recommendations.map((r) => ({
    ...r,
    goalId: r.id,
    recommendedModule: r.moduleName,
    specificActivity: r.activityType,
    optionalSupports: r.recommendedSupports
  }));

  const outOfScopeNotices = (student.outOfScopeFlags || [])
    .map((flagKey) => OUT_OF_SCOPE_SPECIALIST_REMINDERS[flagKey])
    .filter(Boolean);

  if (outOfScopeNotice && outOfScopeNotices.length === 0) {
    outOfScopeNotices.push({
      title: 'Specialist Clinical Scope Notice',
      notice: outOfScopeNotice,
      whatSpeakUpCanDoInstead:
        'Provide supplementary classroom vocabulary, structured sentence building, and AAC communication alongside SLP guidance.'
    });
  }

  return {
    recommendations: normalizedRecommendations,
    outOfScopeNotice,
    outOfScopeNotices
  };
}
