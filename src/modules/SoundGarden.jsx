import React, { useState, useEffect } from 'react';
import ActivityShell from '../components/ActivityShell';
import PipCompanion from '../components/PipCompanion';
import SharedVocabularyBanner from '../components/SharedVocabularyBanner';
import { soundEngine } from '../utils/soundEngine';
import './SoundGardenFlipbook.css';

// Eager load the 26 learning material diagrams for articulation placement
const imageModules = import.meta.glob('../assets/learning-material-*.jpeg', { eager: true, import: 'default' });
const learningImages = Object.values(imageModules);

/**
 * ============================================================================
 * SOUND GARDEN — UNIFIED MONTESSORI FLIPBOOK DESK EXPERIENCE
 * ----------------------------------------------------------------------------
 * Preserves the Birchwood / Teal / Cream flipbook easel, golden binder rings,
 * letter sounds, digraphs, blends, vowel patterns, and word illustrations.
 *
 * Enhanced with the consistent 7-step learning sequence:
 * 1. Display clear illustration of familiar word
 * 2. Display written target word or prompt
 * 3. Play the word's audio model
 * 4. Interact with letter cards to build or complete the word
 * 5. Highlight the relevant spelling pattern (e.g., "sh" in ship, "um" in umbrella)
 * 6. Provide supportive feedback and opportunity to retry
 * 7. Show the completed word, highlighted pattern, and its meaning
 * + Optional Sound Position activity (Beginning, Middle, End)
 * + Clear distinction between phonological/spelling awareness and spoken pronunciation.
 * ============================================================================
 */

export const FLIPBOOK_CURRICULUM = {
  // Pathway 1: Letter Recognition & Letter Sounds (Simple CVC)
  'letter-sounds': {
    name: '🔤 Letter Sounds',
    description: 'Explore individual letter sounds and build simple 3-letter words.',
    words: [
      {
        id: 'cat',
        word: 'cat',
        letters: ['c', 'a', 't'],
        letterColors: ['#0B847F', '#FF7A5C', '#0B847F'],
        tabs: ['Consonant', 'Vowel', 'Consonant'],
        tabColors: ['teal', 'blue', 'teal'],
        emoji: '🐱',
        label: 'Cat',
        highlightPattern: 'c',
        targetSoundLabel: '/k/ ("c")',
        soundPosition: 'beginning',
        meaning: 'A soft furry pet that purrs and meows.',
        imgIndex: 14,
        distractors: ['b', 'p', 's', 'o'],
        hint: 'Starts with the crunchy /k/ sound! Purrs and meows.'
      },
      {
        id: 'cap',
        word: 'cap',
        letters: ['c', 'a', 'p'],
        letterColors: ['#0B847F', '#FF7A5C', '#0B847F'],
        tabs: ['Consonant', 'Vowel', 'Consonant'],
        tabColors: ['teal', 'blue', 'teal'],
        emoji: '🧢',
        label: 'Cap',
        highlightPattern: 'p',
        targetSoundLabel: '/p/ ("p")',
        soundPosition: 'end',
        meaning: 'A soft hat with a visor that shades your eyes from the sun.',
        imgIndex: 14,
        distractors: ['t', 'd', 'm', 'u'],
        hint: 'You wear it on your head to block the sun!'
      },
      {
        id: 'dog',
        word: 'dog',
        letters: ['d', 'o', 'g'],
        letterColors: ['#0B847F', '#FF7A5C', '#0B847F'],
        tabs: ['Consonant', 'Vowel', 'Consonant'],
        tabColors: ['teal', 'blue', 'teal'],
        emoji: '🐶',
        label: 'Dog',
        highlightPattern: 'd',
        targetSoundLabel: '/d/ ("d")',
        soundPosition: 'beginning',
        meaning: 'A friendly animal companion that wags its tail and barks.',
        imgIndex: 1,
        distractors: ['b', 't', 'c', 'a'],
        hint: 'Friendly pup that barks /d/ /d/ dog!'
      },
      {
        id: 'sun',
        word: 'sun',
        letters: ['s', 'u', 'n'],
        letterColors: ['#0B847F', '#FF7A5C', '#0B847F'],
        tabs: ['Consonant', 'Vowel', 'Consonant'],
        tabColors: ['teal', 'blue', 'teal'],
        emoji: '☀️',
        label: 'Sun',
        highlightPattern: 's',
        targetSoundLabel: '/s/ ("s")',
        soundPosition: 'beginning',
        meaning: 'The bright star that gives us warm daylight.',
        imgIndex: 5,
        distractors: ['r', 'a', 't', 'p'],
        hint: 'Bright and sunny! Starts with the soft hissing /s/ sound.'
      },
      {
        id: 'cup',
        word: 'cup',
        letters: ['c', 'u', 'p'],
        letterColors: ['#0B847F', '#FF7A5C', '#0B847F'],
        tabs: ['Consonant', 'Vowel', 'Consonant'],
        tabColors: ['teal', 'blue', 'teal'],
        emoji: '☕',
        label: 'Cup',
        highlightPattern: 'u',
        targetSoundLabel: 'short /ʌ/ ("u")',
        soundPosition: 'middle',
        meaning: 'A small vessel with a handle used for drinking water or milk.',
        imgIndex: 16,
        distractors: ['k', 'o', 't', 'b'],
        hint: 'You drink warm cocoa or milk from it!'
      },
      {
        id: 'pig',
        word: 'pig',
        letters: ['p', 'i', 'g'],
        letterColors: ['#0B847F', '#FF7A5C', '#0B847F'],
        tabs: ['Consonant', 'Vowel', 'Consonant'],
        tabColors: ['teal', 'blue', 'teal'],
        emoji: '🐷',
        label: 'Pig',
        highlightPattern: 'p',
        targetSoundLabel: '/p/ ("p")',
        soundPosition: 'beginning',
        meaning: 'A pink farm animal with a curly tail.',
        imgIndex: 0,
        distractors: ['b', 'e', 'd', 't'],
        hint: 'Starts with a gentle popping /p/ sound!'
      },
      {
        id: 'fan',
        word: 'fan',
        letters: ['f', 'a', 'n'],
        letterColors: ['#0B847F', '#FF7A5C', '#0B847F'],
        tabs: ['Consonant', 'Vowel', 'Consonant'],
        tabColors: ['teal', 'blue', 'teal'],
        emoji: '🌬️',
        label: 'Fan',
        highlightPattern: 'f',
        targetSoundLabel: '/f/ ("f")',
        soundPosition: 'beginning',
        meaning: 'A device that spins or waves to move cool air.',
        imgIndex: 2,
        distractors: ['v', 'u', 'm', 't'],
        hint: 'Blows cool air! Teeth rest on your lower lip for /f/.'
      },
      {
        id: 'bed',
        word: 'bed',
        letters: ['b', 'e', 'd'],
        letterColors: ['#0B847F', '#FF7A5C', '#0B847F'],
        tabs: ['Consonant', 'Vowel', 'Consonant'],
        tabColors: ['teal', 'blue', 'teal'],
        emoji: '🛏️',
        label: 'Bed',
        highlightPattern: 'd',
        targetSoundLabel: '/d/ ("d")',
        soundPosition: 'end',
        meaning: 'Cozy furniture with a pillow and blanket where you sleep.',
        imgIndex: 0,
        distractors: ['p', 'a', 't', 'm'],
        hint: 'Where you sleep comfortably at night.'
      }
    ]
  },

  // Pathway 2: Build a Word (Includes Shared Vocabulary Bridge targets!)
  'build-a-word': {
    name: '🧩 Build a Word',
    description: 'Assemble multi-letter familiar words and shared everyday vocabulary.',
    words: [
      {
        id: 'umbrella',
        word: 'umbrella',
        letters: ['um', 'br', 'el', 'la'],
        letterColors: ['#FF7A5C', '#2563EB', '#0B847F', '#0B847F'],
        tabs: ['Start Chunk', 'Blend', 'Middle', 'Ending'],
        tabColors: ['yellow', 'blue', 'teal', 'teal'],
        emoji: '☂️',
        label: 'Umbrella',
        highlightPattern: 'um',
        targetSoundLabel: '/ʌm/ ("um")',
        soundPosition: 'beginning',
        meaning: 'A canopy you hold over your head to stay dry when it rains.',
        imgIndex: 16,
        distractors: ['in', 'sh', 'op'],
        hint: 'Keeps you dry in the rain! Starts with "um" + "br".'
      },
      {
        id: 'water',
        word: 'water',
        letters: ['w', 'a', 't', 'er'],
        letterColors: ['#0B847F', '#FF7A5C', '#0B847F', '#2563EB'],
        tabs: ['Consonant', 'Vowel', 'Consonant', 'Ending'],
        tabColors: ['teal', 'yellow', 'teal', 'blue'],
        emoji: '🥛',
        label: 'Water',
        highlightPattern: 'w',
        targetSoundLabel: '/w/ ("w")',
        soundPosition: 'beginning',
        meaning: 'A clear, refreshing drink we need when we feel thirsty.',
        imgIndex: 10,
        distractors: ['m', 'o', 'p'],
        hint: 'A cool drink when you are thirsty! Starts with /w/.'
      },
      {
        id: 'ball',
        word: 'ball',
        letters: ['b', 'a', 'l', 'l'],
        letterColors: ['#0B847F', '#FF7A5C', '#0B847F', '#0B847F'],
        tabs: ['Consonant', 'Vowel', 'Consonant', 'Consonant'],
        tabColors: ['teal', 'blue', 'teal', 'teal'],
        emoji: '⚽',
        label: 'Ball',
        highlightPattern: 'll',
        targetSoundLabel: '/l/ ("ll")',
        soundPosition: 'end',
        meaning: 'A round toy used for kicking, throwing, and bouncing in games.',
        imgIndex: 0,
        distractors: ['d', 'o', 't', 's'],
        hint: 'Bounces high and round! Starts with /b/ and ends with double l.'
      },
      {
        id: 'kite',
        word: 'kite',
        letters: ['k', 'i', 't', 'e'],
        letterColors: ['#0B847F', '#FF7A5C', '#0B847F', '#FF7A5C'],
        tabs: ['Consonant', 'Vowel', 'Consonant', 'Vowel'],
        tabColors: ['teal', 'blue', 'teal', 'blue'],
        emoji: '🪁',
        label: 'Kite',
        highlightPattern: 'i_e',
        targetSoundLabel: 'long /aɪ/ ("i")',
        soundPosition: 'middle',
        meaning: 'A light frame flown on a string high in the wind.',
        imgIndex: 3,
        distractors: ['c', 'a', 'p', 'l'],
        hint: 'Flies high in the windy sky!'
      },
      {
        id: 'moon',
        word: 'moon',
        letters: ['m', 'o', 'o', 'n'],
        letterColors: ['#0B847F', '#FF7A5C', '#FF7A5C', '#0B847F'],
        tabs: ['Consonant', 'Vowel', 'Vowel', 'Consonant'],
        tabColors: ['teal', 'blue', 'blue', 'teal'],
        emoji: '🌙',
        label: 'Moon',
        highlightPattern: 'oo',
        targetSoundLabel: 'long /uː/ ("oo")',
        soundPosition: 'middle',
        meaning: 'Glows softly in the dark sky at night.',
        imgIndex: 4,
        distractors: ['s', 'u', 'p', 't'],
        hint: 'Glows in the night sky! Lips press together for /m/.'
      },
      {
        id: 'frog',
        word: 'frog',
        letters: ['f', 'r', 'o', 'g'],
        letterColors: ['#0B847F', '#0B847F', '#FF7A5C', '#0B847F'],
        tabs: ['Consonant', 'Consonant', 'Vowel', 'Consonant'],
        tabColors: ['teal', 'teal', 'blue', 'teal'],
        emoji: '🐸',
        label: 'Frog',
        highlightPattern: 'fr',
        targetSoundLabel: '/fr/ blend',
        soundPosition: 'beginning',
        meaning: 'A small green amphibian that hops on lily pads.',
        imgIndex: 2,
        distractors: ['p', 'l', 'u', 'd'],
        hint: 'Ribbit! Hops on lily pads in the pond.'
      },
      {
        id: 'fish',
        word: 'fish',
        letters: ['f', 'i', 's', 'h'],
        letterColors: ['#0B847F', '#FF7A5C', '#2563EB', '#2563EB'],
        tabs: ['Consonant', 'Vowel', 'Digraph', 'Digraph'],
        tabColors: ['teal', 'blue', 'blue', 'blue'],
        emoji: '🐟',
        label: 'Fish',
        highlightPattern: 'sh',
        targetSoundLabel: '/ʃ/ ("sh")',
        soundPosition: 'end',
        meaning: 'A water animal with fins and scales that swims in rivers and seas.',
        imgIndex: 7,
        distractors: ['v', 'e', 'p', 't'],
        hint: 'Swims gently in the clean water. Ends with "sh"!'
      }
    ]
  },

  // Pathway 3: Digraphs & Consonant Blends
  'blends': {
    name: '🔗 Digraphs & Blends',
    description: 'Learn how two letters combine to make special sounds (sh, ch, th, ph, wh).',
    words: [
      {
        id: 'ship',
        word: 'ship',
        letters: ['sh', 'i', 'p'],
        letterColors: ['#2563EB', '#FF7A5C', '#0B847F'],
        tabs: ['Digraph', 'Vowel', 'Consonant'],
        tabColors: ['blue', 'yellow', 'teal'],
        emoji: '🚢',
        label: 'Ship',
        highlightPattern: 'sh',
        targetSoundLabel: '/ʃ/ ("sh")',
        soundPosition: 'beginning',
        meaning: 'A large boat that sails across deep water and oceans.',
        imgIndex: 7,
        distractors: ['ch', 'th', 'a', 't'],
        hint: 'Sails across the big blue ocean! Starts with /sh/.'
      },
      {
        id: 'chop',
        word: 'chop',
        letters: ['ch', 'o', 'p'],
        letterColors: ['#2563EB', '#FF7A5C', '#0B847F'],
        tabs: ['Digraph', 'Vowel', 'Consonant'],
        tabColors: ['blue', 'yellow', 'teal'],
        emoji: '🪓',
        label: 'Chop',
        highlightPattern: 'ch',
        targetSoundLabel: '/tʃ/ ("ch")',
        soundPosition: 'beginning',
        meaning: 'To cut vegetables or wood into smaller pieces.',
        imgIndex: 6,
        distractors: ['sh', 'th', 'i', 't'],
        hint: 'Cut vegetables or wood! Starts with the crisp /ch/ sound.'
      },
      {
        id: 'thumb',
        word: 'thumb',
        letters: ['th', 'u', 'm', 'b'],
        letterColors: ['#2563EB', '#FF7A5C', '#0B847F', '#0B847F'],
        tabs: ['Digraph', 'Vowel', 'Consonant', 'Consonant'],
        tabColors: ['blue', 'yellow', 'teal', 'teal'],
        emoji: '👍',
        label: 'Thumb',
        highlightPattern: 'th',
        targetSoundLabel: '/θ/ ("th")',
        soundPosition: 'beginning',
        meaning: 'The short, strong first finger on the side of your hand.',
        imgIndex: 8,
        distractors: ['ph', 'wh', 'o', 'p'],
        hint: 'Give a big thumbs up! Tongue gently between teeth for /th/.'
      },
      {
        id: 'duck',
        word: 'duck',
        letters: ['d', 'u', 'ck'],
        letterColors: ['#0B847F', '#FF7A5C', '#2563EB'],
        tabs: ['Consonant', 'Vowel', 'Ending Blend'],
        tabColors: ['teal', 'yellow', 'blue'],
        emoji: '🦆',
        label: 'Duck',
        highlightPattern: 'ck',
        targetSoundLabel: '/k/ ("ck")',
        soundPosition: 'end',
        meaning: 'A water bird with webbed feet and a flat bill that quacks.',
        imgIndex: 11,
        distractors: ['b', 'a', 'sh', 't'],
        hint: 'Quack quack! Ends with the /ck/ spelling pattern.'
      },
      {
        id: 'phone',
        word: 'phone',
        letters: ['ph', 'o', 'n', 'e'],
        letterColors: ['#2563EB', '#FF7A5C', '#0B847F', '#FF7A5C'],
        tabs: ['Digraph', 'Vowel', 'Consonant', 'Vowel'],
        tabColors: ['blue', 'yellow', 'teal', 'yellow'],
        emoji: '📱',
        label: 'Phone',
        highlightPattern: 'ph',
        targetSoundLabel: '/f/ ("ph")',
        soundPosition: 'beginning',
        meaning: 'A device used to talk to family and friends from far away.',
        imgIndex: 9,
        distractors: ['f', 'th', 'u', 't'],
        hint: 'Ring ring! "PH" sounds like /f/.'
      },
      {
        id: 'whale',
        word: 'whale',
        letters: ['wh', 'a', 'l', 'e'],
        letterColors: ['#2563EB', '#FF7A5C', '#0B847F', '#FF7A5C'],
        tabs: ['Digraph', 'Vowel', 'Consonant', 'Vowel'],
        tabColors: ['blue', 'yellow', 'teal', 'yellow'],
        emoji: '🐳',
        label: 'Whale',
        highlightPattern: 'wh',
        targetSoundLabel: '/w/ ("wh")',
        soundPosition: 'beginning',
        meaning: 'A giant ocean mammal that breathes air through a blowhole.',
        imgIndex: 10,
        distractors: ['w', 'sh', 'o', 'p'],
        hint: 'Huge friendly creature spouting water in the sea.'
      }
    ]
  },

  // Pathway 4: Vowels & Complex Sound Patterns
  'vowels-patterns': {
    name: '🎶 Vowel Patterns',
    description: 'Master long vowels, diphthongs, and vowel team spellings.',
    words: [
      {
        id: 'boat',
        word: 'boat',
        letters: ['b', 'oa', 't'],
        letterColors: ['#0B847F', '#FF7A5C', '#0B847F'],
        tabs: ['Consonant', 'Vowel Team', 'Consonant'],
        tabColors: ['teal', 'orange', 'teal'],
        emoji: '⛵',
        label: 'Boat',
        highlightPattern: 'oa',
        targetSoundLabel: 'long /oʊ/ ("oa")',
        soundPosition: 'middle',
        meaning: 'A small watercraft that floats on lakes and rivers.',
        imgIndex: 22,
        distractors: ['d', 'ee', 'ai', 'p'],
        hint: 'Floats on the lake! "oa" makes the long /o/ sound in the middle.'
      },
      {
        id: 'sheep',
        word: 'sheep',
        letters: ['sh', 'ee', 'p'],
        letterColors: ['#2563EB', '#FF7A5C', '#0B847F'],
        tabs: ['Digraph', 'Vowel Team', 'Consonant'],
        tabColors: ['blue', 'orange', 'teal'],
        emoji: '🐑',
        label: 'Sheep',
        highlightPattern: 'ee',
        targetSoundLabel: 'long /iː/ ("ee")',
        soundPosition: 'middle',
        meaning: 'A gentle farm animal with thick, curly wool.',
        imgIndex: 12,
        distractors: ['ch', 'oo', 'ea', 't'],
        hint: 'Baa baa! "ee" makes the smiling long /e/ sound in the middle.'
      },
      {
        id: 'cow',
        word: 'cow',
        letters: ['c', 'ow'],
        letterColors: ['#0B847F', '#FF7A5C'],
        tabs: ['Consonant', 'Diphthong'],
        tabColors: ['teal', 'orange'],
        emoji: '🐄',
        label: 'Cow',
        highlightPattern: 'ow',
        targetSoundLabel: '/aʊ/ ("ow")',
        soundPosition: 'end',
        meaning: 'A farm animal that eats grass and gives fresh milk.',
        imgIndex: 21,
        distractors: ['k', 'oy', 'aw', 't'],
        hint: 'Moo! Gives delicious milk.'
      },
      {
        id: 'boy',
        word: 'boy',
        letters: ['b', 'oy'],
        letterColors: ['#0B847F', '#FF7A5C'],
        tabs: ['Consonant', 'Diphthong'],
        tabColors: ['teal', 'orange'],
        emoji: '👦',
        label: 'Boy',
        highlightPattern: 'oy',
        targetSoundLabel: '/ɔɪ/ ("oy")',
        soundPosition: 'end',
        meaning: 'A young male child.',
        imgIndex: 20,
        distractors: ['d', 'ay', 'ou', 'p'],
        hint: 'Ends with the gliding "oy" vowel sound!'
      },
      {
        id: 'train',
        word: 'train',
        letters: ['t', 'r', 'ai', 'n'],
        letterColors: ['#0B847F', '#0B847F', '#FF7A5C', '#0B847F'],
        tabs: ['Consonant', 'Consonant', 'Vowel Team', 'Consonant'],
        tabColors: ['teal', 'teal', 'orange', 'teal'],
        emoji: '🚆',
        label: 'Train',
        highlightPattern: 'ai',
        targetSoundLabel: 'long /eɪ/ ("ai")',
        soundPosition: 'middle',
        meaning: 'Connected railway cars that travel fast along tracks.',
        imgIndex: 18,
        distractors: ['p', 'l', 'ee', 'd'],
        hint: 'Choo choo on the railway tracks!'
      }
    ]
  }
};

export default function SoundGarden({
  onBack = () => {},
  onHome = () => {},
  onPlayAudio = () => {},
  onOpenSpeakPractice = () => {},
  onExploreSound = () => {},
  sharedWordId = 'umbrella',
  onSelectSharedWord = () => {},
  onNavigateModule = () => {}
}) {
  // Active Pathway
  const [activePathway, setActivePathway] = useState('blends');
  const currentPathway = FLIPBOOK_CURRICULUM[activePathway];

  // Active Word Index within current pathway
  const [wordIndex, setWordIndex] = useState(0);
  const currentWordData = currentPathway.words[wordIndex] || currentPathway.words[0];

  // Stand Theme: 'theme-birch' | 'theme-teal' | 'theme-cream'
  const [standTheme, setStandTheme] = useState('theme-birch');

  // Activity Mode: 'builder' (all slots empty) | 'first-sound' (first letter missing) | 'sound-position' (beginning/middle/end)
  const [activityMode, setActivityMode] = useState('builder');

  // Spelling Workspace State
  const [placedSlots, setPlacedSlots] = useState([]);
  const [letterBank, setLetterBank] = useState([]);
  const [usedBankIndices, setUsedBankIndices] = useState(new Set());
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedbackError, setFeedbackError] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Sound Position Optional Activity State ('beginning' | 'middle' | 'end')
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [positionFeedback, setPositionFeedback] = useState(null);

  // Articulation diagram modal
  const [selectedPlacementImg, setSelectedPlacementImg] = useState(null);

  // Pip speech message
  const [pipMessage, setPipMessage] = useState(
    "Welcome to the Flipbook! Look at the picture, listen to the word, and tap letter cards to build it! 📖"
  );
  const [pipState, setPipState] = useState('idle');

  // Initialize or reset word when wordIndex or activePathway or activityMode changes
  useEffect(() => {
    resetWordState(currentWordData);
  }, [currentWordData, activityMode]);

  const resetWordState = (targetWord) => {
    setIsSuccess(false);
    setFeedbackError(false);
    setShowHint(false);
    setSelectedPosition(null);
    setPositionFeedback(null);
    setPipState('idle');

    if (activityMode === 'first-sound') {
      const initialPlaced = targetWord.letters.map((ltr, idx) => (idx === 0 ? null : ltr));
      setPlacedSlots(initialPlaced);

      const targetMissing = targetWord.letters[0];
      const bankItems = shuffleArray([targetMissing, ...targetWord.distractors.slice(0, 3)]);
      setLetterBank(bankItems);
      setUsedBankIndices(new Set());
      setPipMessage(`Find the starting sound for "${targetWord.label}"! Which card goes first? 🔍`);
    } else if (activityMode === 'sound-position') {
      setPlacedSlots([...targetWord.letters]);
      setLetterBank([]);
      setUsedBankIndices(new Set());
      setPipMessage(`Listen to "${targetWord.label}". Does the target sound ${targetWord.targetSoundLabel || targetWord.highlightPattern} happen at the Beginning, Middle, or End? 👂`);
    } else {
      setPlacedSlots(new Array(targetWord.letters.length).fill(null));
      const bankItems = shuffleArray([...targetWord.letters, ...targetWord.distractors.slice(0, 3)]);
      setLetterBank(bankItems);
      setUsedBankIndices(new Set());
      setPipMessage(`Step 1-4: Look at "${targetWord.label}", listen to the audio model, and build the word with the letter cards! ✨`);
    }
  };

  function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // Handle jumping to a word when user clicks a Shared Vocabulary Bridge pill
  const handleSelectSharedBridgeWord = (sWordId) => {
    onSelectSharedWord(sWordId);
    for (const pKey of Object.keys(FLIPBOOK_CURRICULUM)) {
      const idx = FLIPBOOK_CURRICULUM[pKey].words.findIndex(w => w.id === sWordId);
      if (idx !== -1) {
        setActivePathway(pKey);
        setWordIndex(idx);
        return;
      }
    }
  };

  const handleSelectPathway = (pKey) => {
    soundEngine.playClick();
    setActivePathway(pKey);
    setWordIndex(0);
  };

  const handlePlayWord = () => {
    soundEngine.playClick();
    onPlayAudio(currentWordData.word);
    setPipState('speaking');
    setPipMessage(`Pip says: "${currentWordData.word}"! Notice the "${currentWordData.highlightPattern}" spelling pattern. 🗣️`);
    onExploreSound(currentWordData.word);
  };

  const handleSoundOut = async () => {
    soundEngine.playClick();
    setPipState('speaking');
    setPipMessage(`Let's sound out the parts: ${currentWordData.letters.join(' — ')}!`);

    for (let i = 0; i < currentWordData.letters.length; i++) {
      const ltr = currentWordData.letters[i];
      await new Promise(res => {
        setTimeout(() => {
          onPlayAudio(ltr);
          res();
        }, i * 650);
      });
    }
  };

  const handleSelectBankCard = (letter, bankIdx) => {
    if (usedBankIndices.has(bankIdx) || isSuccess) return;

    soundEngine.playClick();
    onPlayAudio(letter);

    const nextEmptyIdx = placedSlots.findIndex(s => s === null);
    if (nextEmptyIdx === -1) return;

    const nextPlaced = [...placedSlots];
    nextPlaced[nextEmptyIdx] = letter;
    setPlacedSlots(nextPlaced);

    const nextUsed = new Set(usedBankIndices);
    nextUsed.add(bankIdx);
    setUsedBankIndices(nextUsed);

    if (nextPlaced.every(s => s !== null)) {
      validateSpelling(nextPlaced);
    }
  };

  const handleRemoveSlot = (slotIdx) => {
    if (isSuccess || placedSlots[slotIdx] === null) return;
    if (activityMode === 'first-sound' && slotIdx !== 0) return;

    soundEngine.playClick();
    const letterToRemove = placedSlots[slotIdx];

    const nextPlaced = [...placedSlots];
    nextPlaced[slotIdx] = null;
    setPlacedSlots(nextPlaced);

    const nextUsed = new Set(usedBankIndices);
    const bankIndexToFree = letterBank.findIndex((ltr, idx) => ltr === letterToRemove && nextUsed.has(idx));
    if (bankIndexToFree !== -1) {
      nextUsed.delete(bankIndexToFree);
      setUsedBankIndices(nextUsed);
    }

    setFeedbackError(false);
  };

  const handleClearSlots = () => {
    soundEngine.playClick();
    if (activityMode === 'first-sound') {
      const initialPlaced = currentWordData.letters.map((ltr, idx) => (idx === 0 ? null : ltr));
      setPlacedSlots(initialPlaced);
    } else {
      setPlacedSlots(new Array(currentWordData.letters.length).fill(null));
    }
    setUsedBankIndices(new Set());
    setFeedbackError(false);
  };

  const validateSpelling = (slotsToCheck) => {
    const isCorrect = slotsToCheck.every((ltr, idx) => ltr === currentWordData.letters[idx]);

    if (isCorrect) {
      soundEngine.playTing();
      setIsSuccess(true);
      setFeedbackError(false);
      setShowHint(false);
      setPipState('celebrating');
      setPipMessage(`Hooray! You built "${currentWordData.label}" and highlighted "${currentWordData.highlightPattern}"! 🌟`);

      setTimeout(() => {
        onPlayAudio(`${currentWordData.word}. ${currentWordData.meaning}`);
      }, 400);

      onExploreSound(currentWordData.word);
    } else {
      soundEngine.playError();
      setFeedbackError(true);
      setPipState('try-again');
      setPipMessage(`Almost there! Tap any letter card in the slot to swap it, or tap "💡 Need a Hint?"! 💛`);
    }
  };

  const handleSelectPosition = (pos) => {
    setSelectedPosition(pos);
    onPlayAudio(pos);
    if (pos === currentWordData.soundPosition) {
      soundEngine.playTing();
      setPositionFeedback('correct');
      setIsSuccess(true);
      setPipState('celebrating');
      setPipMessage(`Spot on! The sound ${currentWordData.targetSoundLabel || currentWordData.highlightPattern} is at the ${pos.toUpperCase()} of "${currentWordData.word}"! 🌟`);
      onExploreSound(`${currentWordData.word} (${pos})`);
    } else {
      soundEngine.playError();
      setPositionFeedback('retry');
      setPipState('try-again');
      setPipMessage(`Listen closely to "${currentWordData.word}" where ${currentWordData.highlightPattern} appears, and try again! 💛`);
    }
  };

  const handleNextWord = () => {
    soundEngine.playClick();
    if (wordIndex + 1 < currentPathway.words.length) {
      setWordIndex(prev => prev + 1);
    } else {
      setWordIndex(0);
    }
  };

  const handlePrevWord = () => {
    soundEngine.playClick();
    if (wordIndex > 0) {
      setWordIndex(prev => prev - 1);
    } else {
      setWordIndex(currentPathway.words.length - 1);
    }
  };

  return (
    <ActivityShell
      title="Sound Garden — Letters, Speech Sounds & Spelling Flipbook"
      moduleName="Sound Garden"
      stepIndex={wordIndex + 1}
      totalSteps={currentPathway.words.length}
      pipState={pipState}
      pipMessage={pipMessage}
      onBack={onBack}
      onHome={onHome}
      onSpeakModel={onPlayAudio}
      modelText={currentWordData.word}
    >
      <div className="flipbook-module-container">

        {/* 1. TOP CONTROL BAR */}
        <div className="flipbook-topbar">
          <div className="pathway-selector-group">
            {Object.keys(FLIPBOOK_CURRICULUM).map(pKey => {
              const p = FLIPBOOK_CURRICULUM[pKey];
              const isActive = activePathway === pKey;
              return (
                <button
                  key={pKey}
                  className={`pathway-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelectPathway(pKey)}
                >
                  <span>{p.name}</span>
                </button>
              );
            })}
          </div>

          <div className="topbar-right-controls">
            <div className="word-stepper-pill">
              <button className="stepper-nav-btn" onClick={handlePrevWord} title="Previous word">‹</button>
              <span className="stepper-label">{currentWordData.emoji} {currentWordData.label}</span>
              <button className="stepper-nav-btn" onClick={handleNextWord} title="Next word">›</button>
            </div>

            <div className="stand-theme-selector" title="Choose flipbook stand finish">
              <button
                className={`theme-pill-btn ${standTheme === 'theme-birch' ? 'active' : ''}`}
                onClick={() => { soundEngine.playClick(); setStandTheme('theme-birch'); }}
              >
                🪵 Wood
              </button>
              <button
                className={`theme-pill-btn ${standTheme === 'theme-teal' ? 'active' : ''}`}
                onClick={() => { soundEngine.playClick(); setStandTheme('theme-teal'); }}
              >
                🌊 Teal
              </button>
              <button
                className={`theme-pill-btn ${standTheme === 'theme-cream' ? 'active' : ''}`}
                onClick={() => { soundEngine.playClick(); setStandTheme('theme-cream'); }}
              >
                🍦 Cream
              </button>
            </div>
          </div>
        </div>

        {/* 2. THE INTEGRATED FLIPBOOK EASEL STAND */}
        <div className={`flipbook-stand-container ${standTheme}`}>

          {/* Stand Top Ribbon with Target Word & Highlighted Pattern */}
          <div className="stand-top-ribbon" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
            <div className="stand-brand-label">
              <span>📖</span>
              <span>Spelling & Pattern Flipbook</span>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div className="stand-pip-clue-pill">
                <span>🎯</span>
                <span>Target Word: <strong>"{currentWordData.label}"</strong></span>
              </div>
              <div className="stand-pip-clue-pill" style={{ background: '#DBEAFE', color: '#1E40AF' }}>
                <span>✨</span>
                <span>Pattern Highlight: <strong>"{currentWordData.highlightPattern}"</strong></span>
              </div>
            </div>
          </div>

          {/* Upper Section: The Flashcards on Golden Binder Rings */}
          <div className="stand-cards-row">

            {/* STEP 1 & 2: PICTURE CARD + WRITTEN TARGET WORD */}
            <div className="stand-card-column">
              <div className="golden-binder-ring" title="Golden spiral binder ring"></div>

              <div
                className="flipbook-card"
                onClick={handlePlayWord}
                style={{ cursor: 'pointer' }}
                title={`Click to listen to "${currentWordData.word}"`}
              >
                <div className="card-hole-cutout"></div>

                <div className="picture-card-inner">
                  <span className="picture-emoji-large">{currentWordData.emoji}</span>
                  <h3 className="picture-word-heading">{currentWordData.label}</h3>
                </div>

                <div className="card-category-pill cat-pill-pink">
                  1. Picture & Word
                </div>
              </div>
            </div>

            {/* CARDS 2+: INDIVIDUAL LETTER / PATTERN CARDS */}
            {currentWordData.letters.map((ltr, colIdx) => {
              const tabLabel = currentWordData.tabs[colIdx] || (colIdx === 1 ? 'Vowel' : 'Consonant');
              const tabTheme = currentWordData.tabColors[colIdx] || 'teal';
              const ltrColor = currentWordData.letterColors[colIdx] || '#0B847F';
              const isHighlightedPattern = ltr === currentWordData.highlightPattern || currentWordData.highlightPattern?.includes(ltr);

              let displayedLetter = ltr;
              if (activityMode === 'builder' && !isSuccess) {
                displayedLetter = placedSlots[colIdx] || '?';
              } else if (activityMode === 'first-sound' && !isSuccess && colIdx === 0) {
                displayedLetter = placedSlots[0] || '_';
              }

              return (
                <div key={colIdx} className="stand-card-column">
                  <div className="golden-binder-ring" title="Golden spiral binder ring"></div>

                  <div
                    className="flipbook-card"
                    onClick={() => {
                      soundEngine.playClick();
                      onPlayAudio(ltr);
                    }}
                    style={{
                      cursor: 'pointer',
                      outline: isSuccess && isHighlightedPattern ? '3px solid #2563EB' : 'none',
                      boxShadow: isSuccess && isHighlightedPattern ? '0 0 0 4px rgba(37, 99, 235, 0.2)' : undefined
                    }}
                    title={`Letter card for sound: ${ltr}`}
                  >
                    <div className="card-hole-cutout"></div>

                    <div className="letter-card-inner">
                      <span
                        className="letter-glyph-large"
                        style={{ color: displayedLetter === '?' || displayedLetter === '_' ? '#94A3B8' : ltrColor }}
                      >
                        {displayedLetter}
                      </span>
                    </div>

                    <div className={`card-category-pill cat-pill-${tabTheme}`}>
                      {isSuccess && isHighlightedPattern ? `★ ${tabLabel}` : tabLabel}
                    </div>
                  </div>
                </div>
              );
            })}

          </div>

          {/* Integrated Mid-Stand Toolbar (Step 3 Audio Model + Activity Level Switcher) */}
          <div className="stand-embedded-toolbar">
            <div className="toolbar-audio-group">
              <button className="stand-audio-btn" onClick={handlePlayWord} title="Step 3: Hear the full word audio model">
                <span>🔊</span> Listen Word
              </button>
              <button className="stand-audio-btn" onClick={handleSoundOut} title="Hear letter sounds one by one">
                <span>🔤</span> Sound Out
              </button>
              <button
                className="stand-mouth-guide-btn"
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedPlacementImg(learningImages[currentWordData.imgIndex || 0]);
                }}
                title="View optional lip & tongue placement guide"
              >
                <span>👄</span> Mouth Guide
              </button>
            </div>

            <div className="mode-toggle-pill">
              <span style={{ fontSize: '0.82rem', color: 'var(--color-navy-muted)' }}>Activity:</span>
              <button
                className={`theme-pill-btn ${activityMode === 'builder' ? 'active' : ''}`}
                onClick={() => { soundEngine.playClick(); setActivityMode('builder'); }}
              >
                Build Word
              </button>
              <button
                className={`theme-pill-btn ${activityMode === 'first-sound' ? 'active' : ''}`}
                onClick={() => { soundEngine.playClick(); setActivityMode('first-sound'); }}
              >
                First Sound
              </button>
              <button
                className={`theme-pill-btn ${activityMode === 'sound-position' ? 'active' : ''}`}
                onClick={() => { soundEngine.playClick(); setActivityMode('sound-position'); }}
              >
                🔍 Sound Position
              </button>
            </div>
          </div>

          {/* 3. LOWER TRAY: SPELLING BUILDER OR OPTIONAL SOUND POSITION ACTIVITY */}
          <div className="stand-spelling-tray">

            {activityMode === 'sound-position' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', alignItems: 'center', padding: '0.5rem 0' }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{
                    background: '#DBEAFE',
                    color: '#1E40AF',
                    padding: '0.28rem 0.85rem',
                    borderRadius: '9999px',
                    fontWeight: 900,
                    fontSize: '0.78rem',
                    textTransform: 'uppercase'
                  }}>
                    Optional Phonological Awareness Activity
                  </span>
                  <h4 style={{ margin: '0.5rem 0 0.2rem 0', fontSize: '1.3rem', color: 'var(--color-navy)', fontWeight: 900 }}>
                    Where do you hear or see <strong>"{currentWordData.highlightPattern}"</strong> ({currentWordData.targetSoundLabel}) in <strong>"{currentWordData.word.toUpperCase()}"</strong>?
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-navy-muted)', fontWeight: 600 }}>
                    Tap Beginning, Middle, or End:
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {[
                    { id: 'beginning', label: '🟢 Beginning (Start)', icon: '⬅️' },
                    { id: 'middle', label: '🟡 Middle (Inside)', icon: '↔️' },
                    { id: 'end', label: '🔵 End (Last)', icon: '➡️' }
                  ].map(pos => {
                    const isPicked = selectedPosition === pos.id;
                    const isRight = isPicked && positionFeedback === 'correct';
                    const isWrong = isPicked && positionFeedback === 'retry';
                    return (
                      <button
                        key={pos.id}
                        onClick={() => handleSelectPosition(pos.id)}
                        style={{
                          padding: '1rem 1.6rem',
                          borderRadius: '18px',
                          fontWeight: 900,
                          fontSize: '1.05rem',
                          cursor: 'pointer',
                          border: isRight ? '3px solid #22C55E' : isWrong ? '3px solid #EF4444' : '2px solid var(--border-soft)',
                          background: isRight ? '#DCFCE7' : isWrong ? '#FEE2E2' : '#FFFFFF',
                          color: 'var(--color-navy)'
                        }}
                      >
                        {pos.icon} {pos.label} {isRight && '✅'} {isWrong && '❌'}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <>
                <div className="tray-section-title">
                  <span>🧩 Step 4: Word Building Slots</span>
                  <span style={{ fontSize: '0.85rem' }}>Tap a letter card below to place it, or tap a filled slot to remove it</span>
                </div>

                {/* Slots Row */}
                <div className="spelling-slots-row">
                  {placedSlots.map((slotLetter, idx) => {
                    const isFilled = slotLetter !== null;
                    const tabColor = currentWordData.tabColors[idx] || 'teal';
                    const ltrColor = currentWordData.letterColors[idx] || '#0B847F';

                    return (
                      <div
                        key={idx}
                        className={`spelling-slot-card ${isFilled ? 'filled' : 'empty-placeholder'}`}
                        onClick={() => handleRemoveSlot(idx)}
                        title={isFilled ? `Tap to return '${slotLetter}' to tray` : `Slot ${idx + 1}`}
                      >
                        {isFilled ? (
                          <>
                            <div className="card-hole-cutout" style={{ width: '8px', height: '8px', marginBottom: '0.2rem' }}></div>
                            <span className="desk-tile-glyph" style={{ color: ltrColor }}>
                              {slotLetter}
                            </span>
                            <span className={`desk-tile-tag cat-pill-${tabColor}`}>
                              {currentWordData.tabs[idx] || 'Letter'}
                            </span>
                            {!isSuccess && <span className="slot-delete-cross" title="Remove">✕</span>}
                          </>
                        ) : (
                          <span>•</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Letter Cards on the Shelf */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-navy-muted, #55657E)' }}>
                    🗂️ Tap a letter card to slide it into the word:
                  </span>

                  <div className="desk-letter-tiles-row">
                    {letterBank.map((letter, bIdx) => {
                      const isUsed = usedBankIndices.has(bIdx);
                      const isVowel = ['a', 'e', 'i', 'o', 'u', 'ee', 'oa', 'ai', 'ow', 'oy', 'um'].includes(letter);
                      const letterColor = isVowel ? '#FF7A5C' : '#0B847F';
                      const tabTheme = isVowel ? 'cat-pill-blue' : 'cat-pill-teal';

                      return (
                        <div
                          key={bIdx}
                          className={`desk-tile ${isUsed ? 'used' : ''}`}
                          onClick={() => handleSelectBankCard(letter, bIdx)}
                          title={isUsed ? `'${letter}' is already placed` : `Place '${letter}'`}
                        >
                          <div className="card-hole-cutout" style={{ width: '8px', height: '8px', marginBottom: '0.15rem' }}></div>
                          <span className="desk-tile-glyph" style={{ color: letterColor }}>
                            {letter}
                          </span>
                          <span className={`desk-tile-tag ${tabTheme}`}>
                            {letter.length > 1 ? 'Pattern' : isVowel ? 'Vowel' : 'Consonant'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* STEP 5, 6 & 7: COMPLETED WORD, HIGHLIGHTED SPELLING PATTERN & MEANING */}
            {isSuccess && (
              <div className="spelling-success-banner" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div className="success-banner-content">
                    <PipCompanion size="sm" state="celebrating" />
                    <div>
                      <h3 style={{ margin: '0 0 0.15rem 0', color: '#15803D', fontWeight: 900 }}>
                        Step 7: Completed Word & Meaning! 🌟
                      </h3>
                      <p style={{ margin: 0, color: '#166534', fontSize: '0.96rem', fontWeight: 700 }}>
                        <strong>{currentWordData.label}</strong> ({currentWordData.word}) — {currentWordData.meaning}
                      </p>
                      <p style={{ margin: '0.2rem 0 0 0', color: '#1E40AF', fontSize: '0.86rem', fontWeight: 800 }}>
                        ✨ Highlighted Spelling Pattern: <strong>"{currentWordData.highlightPattern}"</strong> ({currentWordData.targetSoundLabel} at the <strong>{currentWordData.soundPosition}</strong>)
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.7rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                      className="btn-secondary"
                      onClick={() => onPlayAudio(`${currentWordData.word}. ${currentWordData.meaning}`)}
                      style={{ background: '#fff', padding: '0.6rem 1rem', fontSize: '0.86rem' }}
                    >
                      🔊 Hear Word & Meaning
                    </button>
                    <button
                      className="btn-primary"
                      onClick={handleNextWord}
                      style={{ padding: '0.7rem 1.4rem', fontSize: '0.95rem', fontWeight: 900 }}
                    >
                      Next Word ➔
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons Row */}
            <div className="tray-action-controls">
              <div className="action-left-buttons">
                {activityMode !== 'sound-position' && (
                  <button
                    className="btn-secondary"
                    onClick={handleClearSlots}
                    disabled={isSuccess || placedSlots.every(s => s === null)}
                    style={{ padding: '0.55rem 1.1rem', fontSize: '0.88rem' }}
                  >
                    🔄 Reset Cards
                  </button>
                )}

                <button
                  className="btn-secondary"
                  onClick={() => {
                    soundEngine.playClick();
                    setShowHint(true);
                    setPipState('speaking');
                    setPipMessage(`💡 Pip's Clue: ${currentWordData.hint}`);
                  }}
                  disabled={isSuccess}
                  style={{ padding: '0.55rem 1.1rem', fontSize: '0.88rem' }}
                >
                  💡 Need a Hint?
                </button>
              </div>

              <div className="action-right-buttons">
                {!isSuccess && activityMode !== 'sound-position' && (
                  <button
                    className="btn-primary"
                    onClick={() => validateSpelling(placedSlots)}
                    disabled={placedSlots.some(s => s === null)}
                    style={{ padding: '0.75rem 1.8rem', fontSize: '0.98rem', fontWeight: 900 }}
                  >
                    ✨ Check Word
                  </button>
                )}

                <button
                  className="btn-secondary"
                  onClick={onOpenSpeakPractice}
                  style={{ padding: '0.55rem 1.1rem', fontSize: '0.86rem' }}
                >
                  🎙️ Optional: Listen & Practise Speech
                </button>

                <button
                  className="btn-secondary"
                  onClick={handleNextWord}
                  style={{ padding: '0.55rem 1.2rem', fontSize: '0.88rem' }}
                >
                  Next Word ➔
                </button>
              </div>
            </div>

            {/* Hint Notice */}
            {showHint && !isSuccess && (
              <div style={{
                background: 'var(--color-yellow-light, #FFF4D1)',
                border: '1.5px solid var(--color-yellow-border, rgba(245, 174, 10, 0.4))',
                borderRadius: '16px',
                padding: '0.9rem 1.3rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                color: 'var(--color-yellow-deep, #7A5200)',
                fontSize: '0.92rem'
              }}>
                <span style={{ fontSize: '1.5rem' }}>💡</span>
                <div>
                  <strong>Pip's Hint:</strong> {currentWordData.hint}
                </div>
              </div>
            )}

            {/* Gentle Error Notice */}
            {feedbackError && !isSuccess && (
              <div style={{
                background: '#FEE2E2',
                border: '1.5px solid #FCA5A5',
                borderRadius: '16px',
                padding: '0.9rem 1.3rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                color: '#991B1B',
                fontSize: '0.92rem'
              }}>
                <span style={{ fontSize: '1.5rem' }}>🔄</span>
                <div>
                  <strong>Gentle Retry:</strong> Tap any letter card in the slot to swap it and try again!
                </div>
              </div>
            )}

          </div>

        </div>

        {/* 4. MODAL: LIP & TONGUE PLACEMENT GUIDE */}
        {selectedPlacementImg && (
          <div className="lightbox" onClick={() => setSelectedPlacementImg(null)}>
            <div className="placement-modal-card" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setSelectedPlacementImg(null)}
                style={{
                  position: 'absolute',
                  top: '1.2rem',
                  right: '1.2rem',
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  fontWeight: 900
                }}
              >
                ✕
              </button>

              <h2 style={{ color: 'var(--color-navy, #1B2F4E)', margin: '0 0 0.4rem 0' }}>
                👄 Optional Mouth & Tongue Visual Cue
              </h2>
              <p style={{ color: 'var(--color-navy-muted, #55657E)', fontSize: '0.92rem', margin: 0 }}>
                Visual reference for <strong>{currentWordData.label}</strong> ({currentWordData.targetSoundLabel}).
              </p>

              <img
                src={selectedPlacementImg}
                alt="Speech Articulation Diagram"
                className="placement-diagram-img"
              />

              <div style={{
                background: 'var(--color-teal-light, #DDF3F1)',
                padding: '0.9rem 1.2rem',
                borderRadius: '16px',
                color: 'var(--color-teal-hover, #096B67)',
                fontWeight: 700,
                fontSize: '0.88rem',
                textAlign: 'left'
              }}>
                🗣️ <strong>Supportive Visual Cue:</strong> This diagram offers a general visual reference for lip and tongue placement during educator-guided practice.
              </div>

              <button
                className="btn-primary"
                onClick={() => setSelectedPlacementImg(null)}
                style={{ marginTop: '1.2rem', width: '100%', padding: '0.8rem' }}
              >
                Back to Flipbook
              </button>
            </div>
          </div>
        )}

      </div>
    </ActivityShell>
  );
}
