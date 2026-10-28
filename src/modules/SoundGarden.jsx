import React, { useState, useEffect } from 'react';
import ActivityShell from '../components/ActivityShell';
import PipCompanion from '../components/PipCompanion';
import { soundEngine } from '../utils/soundEngine';
import './SoundGardenFlipbook.css';

// Eager load the 26 learning material diagrams for articulation placement
const imageModules = import.meta.glob('../assets/learning-material-*.jpeg', { eager: true, import: 'default' });
const learningImages = Object.values(imageModules);

/**
 * ============================================================================
 * SOUND GARDEN & ARTICULATION — UNIFIED FLIPBOOK DESK EXPERIENCE
 * ----------------------------------------------------------------------------
 * A warm, uncluttered, Montessori-inspired learning easel with zero harsh green.
 * Features:
 * - Natural birchwood / warm cream tabletop easel stand with golden rings
 * - Picture card + individual letter cards with soft pastel category pills
 * - Integrated spelling shelf and tactile letter tiles
 * - 4 Structured pathways (Letter Sounds, Build a Word, Blends, Vowel Patterns)
 * - Activity levels: Full Word Builder & First Sound focus
 * - Speech therapy articulation diagrams & phonetic audio models
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
        imgIndex: 0,
        distractors: ['d', 'a', 'p', 't'],
        hint: 'Where you sleep comfortably at night.'
      }
    ]
  },

  // Pathway 2: Build a Word
  'build-a-word': {
    name: '🧩 Build a Word',
    description: 'Assemble multi-letter familiar words and everyday vocabulary.',
    words: [
      {
        id: 'ball',
        word: 'ball',
        letters: ['b', 'a', 'l', 'l'],
        letterColors: ['#0B847F', '#FF7A5C', '#0B847F', '#0B847F'],
        tabs: ['Consonant', 'Vowel', 'Consonant', 'Consonant'],
        tabColors: ['teal', 'blue', 'teal', 'teal'],
        emoji: '⚽',
        label: 'Ball',
        imgIndex: 0,
        distractors: ['d', 'o', 't', 's'],
        hint: 'Bounces high and round! Starts with /b/.'
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
        imgIndex: 2,
        distractors: ['p', 'l', 'u', 'd'],
        hint: 'Ribbit! Hops on lily pads in the pond.'
      },
      {
        id: 'star',
        word: 'star',
        letters: ['s', 't', 'a', 'r'],
        letterColors: ['#0B847F', '#0B847F', '#FF7A5C', '#0B847F'],
        tabs: ['Consonant', 'Consonant', 'Vowel', 'Consonant'],
        tabColors: ['teal', 'teal', 'blue', 'teal'],
        emoji: '⭐',
        label: 'Star',
        imgIndex: 5,
        distractors: ['c', 'u', 'p', 'm'],
        hint: 'Twinkles in the evening sky!'
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
        imgIndex: 7,
        distractors: ['v', 'e', 'p', 't'],
        hint: 'Swims gently in the clean water.'
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
        imgIndex: 8,
        distractors: ['ph', 'wh', 'o', 'p'],
        hint: 'Give a big thumbs up! Tongue between teeth for /th/.'
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
        imgIndex: 11,
        distractors: ['b', 'a', 'sh', 't'],
        hint: 'Quack quack! Ends with the /ck/ blend.'
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
        imgIndex: 22,
        distractors: ['d', 'ee', 'ai', 'p'],
        hint: 'Floats on the lake! "oa" makes the long /o/ sound.'
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
        imgIndex: 12,
        distractors: ['ch', 'oo', 'ea', 't'],
        hint: 'Baa baa! "ee" makes the smiling long /e/ sound.'
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
        imgIndex: 20,
        distractors: ['d', 'ay', 'ou', 'p'],
        hint: 'Young child having fun playing!'
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
  onExploreSound = () => {}
}) {
  // Active Pathway
  const [activePathway, setActivePathway] = useState('letter-sounds');
  const currentPathway = FLIPBOOK_CURRICULUM[activePathway];

  // Active Word Index within current pathway
  const [wordIndex, setWordIndex] = useState(0);
  const currentWordData = currentPathway.words[wordIndex] || currentPathway.words[0];

  // Stand Theme: 'theme-birch' (warm natural wood) | 'theme-teal' (calm teal) | 'theme-cream' (soft cream)
  const [standTheme, setStandTheme] = useState('theme-birch');

  // Activity Mode: 'builder' (all slots empty) | 'first-sound' (first letter missing)
  const [activityMode, setActivityMode] = useState('builder');

  // Spelling Workspace State
  const [placedSlots, setPlacedSlots] = useState([]);
  const [letterBank, setLetterBank] = useState([]);
  const [usedBankIndices, setUsedBankIndices] = useState(new Set());
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedbackError, setFeedbackError] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Articulation diagram modal
  const [selectedPlacementImg, setSelectedPlacementImg] = useState(null);

  // Pip speech message
  const [pipMessage, setPipMessage] = useState(
    "Welcome to the Flipbook! Tap letter cards from the tray to build the word! 📖"
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
    setPipState('idle');

    if (activityMode === 'first-sound') {
      // First sound missing mode: fill all letters except the first
      const initialPlaced = targetWord.letters.map((ltr, idx) => (idx === 0 ? null : ltr));
      setPlacedSlots(initialPlaced);

      const targetMissing = targetWord.letters[0];
      const bankItems = shuffleArray([targetMissing, ...targetWord.distractors.slice(0, 3)]);
      setLetterBank(bankItems);
      setUsedBankIndices(new Set());
      setPipMessage(`Find the starting sound for "${targetWord.label}"! Which card goes first? 🔍`);
    } else {
      // Full Word Builder: all slots empty
      setPlacedSlots(new Array(targetWord.letters.length).fill(null));

      const bankItems = shuffleArray([...targetWord.letters, ...targetWord.distractors.slice(0, 3)]);
      setLetterBank(bankItems);
      setUsedBankIndices(new Set());
      setPipMessage(`Build the word "${targetWord.label}"! Look at the picture and tap the cards below. ✨`);
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

  // Handle switching pathways
  const handleSelectPathway = (pKey) => {
    soundEngine.playClick();
    setActivePathway(pKey);
    setWordIndex(0);
  };

  // Play word audio
  const handlePlayWord = () => {
    soundEngine.playClick();
    onPlayAudio(currentWordData.word);
    setPipState('speaking');
    setPipMessage(`Pip says: "${currentWordData.word}"! Listen to the clear sounds. 🗣️`);
    onExploreSound(currentWordData.word);
  };

  // Sound out letter by letter
  const handleSoundOut = async () => {
    soundEngine.playClick();
    setPipState('speaking');
    setPipMessage(`Let's sound it out together: ${currentWordData.letters.join(' — ')}!`);

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

  // Placing a letter from the desk letter bank into the first available empty slot
  const handleSelectBankCard = (letter, bankIdx) => {
    if (usedBankIndices.has(bankIdx) || isSuccess) return;

    soundEngine.playClick();
    onPlayAudio(letter);

    // Find first empty slot index
    const nextEmptyIdx = placedSlots.findIndex(s => s === null);
    if (nextEmptyIdx === -1) return; // All slots filled

    const nextPlaced = [...placedSlots];
    nextPlaced[nextEmptyIdx] = letter;
    setPlacedSlots(nextPlaced);

    const nextUsed = new Set(usedBankIndices);
    nextUsed.add(bankIdx);
    setUsedBankIndices(nextUsed);

    // If all slots are filled, check spelling
    if (nextPlaced.every(s => s !== null)) {
      validateSpelling(nextPlaced);
    }
  };

  // Removing a letter from a slot back to the bank
  const handleRemoveSlot = (slotIdx) => {
    if (isSuccess || placedSlots[slotIdx] === null) return;
    if (activityMode === 'first-sound' && slotIdx !== 0) return; // Only target slot is mutable in first-sound mode

    soundEngine.playClick();
    const letterToRemove = placedSlots[slotIdx];

    const nextPlaced = [...placedSlots];
    nextPlaced[slotIdx] = null;
    setPlacedSlots(nextPlaced);

    // Un-use from letter bank
    const nextUsed = new Set(usedBankIndices);
    const bankIndexToFree = letterBank.findIndex((ltr, idx) => ltr === letterToRemove && nextUsed.has(idx));
    if (bankIndexToFree !== -1) {
      nextUsed.delete(bankIndexToFree);
      setUsedBankIndices(nextUsed);
    }

    setFeedbackError(false);
  };

  // Clear all mutable slots
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

  // Validate the spelled word against target letters
  const validateSpelling = (slotsToCheck) => {
    const isCorrect = slotsToCheck.every((ltr, idx) => ltr === currentWordData.letters[idx]);

    if (isCorrect) {
      soundEngine.playTing();
      setIsSuccess(true);
      setFeedbackError(false);
      setShowHint(false);
      setPipState('celebrating');
      setPipMessage(`Hooray! You spelled "${currentWordData.label}" perfectly on the stand! 🌟`);

      setTimeout(() => {
        onPlayAudio(currentWordData.word);
      }, 400);

      onExploreSound(currentWordData.word);
    } else {
      soundEngine.playError();
      setFeedbackError(true);
      setPipState('try-again');
      setPipMessage(`Almost there! Check the order of the cards, or tap "💡 Need a Hint?"! 💛`);
    }
  };

  // Next and previous word navigation
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
      title="Sound Garden & Articulation Flipbook"
      moduleName="Sound Garden"
      stepIndex={wordIndex + 1}
      totalSteps={currentPathway.words.length}
      pipState={pipState}
      pipMessage={pipMessage}
      onBack={onBack}
      onHome={onHome}
    >
      <div className="flipbook-module-container">

        {/* ------------------------------------------------------------------ */}
        {/* 1. TOP CONTROL BAR (CLEAN, COMPACT, INTUITIVE)                     */}
        {/* ------------------------------------------------------------------ */}
        <div className="flipbook-topbar">
          {/* Pathway Selector Tabs */}
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

          {/* Stepper & Stand Theme Options */}
          <div className="topbar-right-controls">
            {/* Word Stepper Navigation */}
            <div className="word-stepper-pill">
              <button className="stepper-nav-btn" onClick={handlePrevWord} title="Previous word">‹</button>
              <span className="stepper-label">{currentWordData.emoji} {currentWordData.label}</span>
              <button className="stepper-nav-btn" onClick={handleNextWord} title="Next word">›</button>
            </div>

            {/* Stand Appearance Selector (No harsh green, warm Montessori finishes) */}
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

        {/* ------------------------------------------------------------------ */}
        {/* 2. THE INTEGRATED FLIPBOOK EASEL STAND (HERO COMPONENT)           */}
        {/* ------------------------------------------------------------------ */}
        <div className={`flipbook-stand-container ${standTheme}`}>

          {/* Stand Top Ribbon */}
          <div className="stand-top-ribbon">
            <div className="stand-brand-label">
              <span>📖</span>
              <span>Spelling Flipbook Stand</span>
            </div>

            <div className="stand-pip-clue-pill">
              <span>🎯</span>
              <span>Target: <strong>"{currentWordData.label}"</strong></span>
            </div>
          </div>

          {/* Upper Section: The Flashcards on Golden Binder Rings */}
          <div className="stand-cards-row">

            {/* CARD 1: PICTURE CARD */}
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
                  Picture Card
                </div>
              </div>
            </div>

            {/* CARDS 2+: INDIVIDUAL LETTER CARDS (c - a - t) */}
            {currentWordData.letters.map((ltr, colIdx) => {
              const tabLabel = currentWordData.tabs[colIdx] || (colIdx === 1 ? 'Vowel' : 'Consonant');
              const tabTheme = currentWordData.tabColors[colIdx] || 'teal';
              const ltrColor = currentWordData.letterColors[colIdx] || '#0B847F';

              // In builder mode before completion, card shows gentle placeholder
              let displayedLetter = ltr;
              if (activityMode === 'builder' && !isSuccess) {
                displayedLetter = '?';
              } else if (activityMode === 'first-sound' && !isSuccess && colIdx === 0) {
                displayedLetter = '_';
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
                    style={{ cursor: 'pointer' }}
                    title={`Letter card for sound: ${ltr}`}
                  >
                    <div className="card-hole-cutout"></div>

                    <div className="letter-card-inner">
                      <span 
                        className="letter-glyph-large"
                        style={{ color: displayedLetter === '?' ? '#94A3B8' : ltrColor }}
                      >
                        {displayedLetter}
                      </span>
                    </div>

                    <div className={`card-category-pill cat-pill-${tabTheme}`}>
                      {tabLabel}
                    </div>
                  </div>
                </div>
              );
            })}

          </div>

          {/* Integrated Mid-Stand Toolbar (Audio, Phonics & Articulation) */}
          <div className="stand-embedded-toolbar">
            <div className="toolbar-audio-group">
              <button className="stand-audio-btn" onClick={handlePlayWord} title="Hear the full word pronunciation">
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
                title="View speech therapist tongue & lip placement diagram"
              >
                <span>👄</span> Mouth Placement Guide
              </button>
            </div>

            <div className="mode-toggle-pill">
              <span style={{ fontSize: '0.82rem', color: 'var(--color-navy-muted)' }}>Level:</span>
              <button
                className={`theme-pill-btn ${activityMode === 'builder' ? 'active' : ''}`}
                onClick={() => { soundEngine.playClick(); setActivityMode('builder'); }}
              >
                All Letters
              </button>
              <button
                className={`theme-pill-btn ${activityMode === 'first-sound' ? 'active' : ''}`}
                onClick={() => { soundEngine.playClick(); setActivityMode('first-sound'); }}
              >
                First Sound
              </button>
            </div>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 3. INTEGRATED LOWER SPELLING TRAY (SLOTS & LETTER BANK)            */}
          {/* ------------------------------------------------------------------ */}
          <div className="stand-spelling-tray">

            <div className="tray-section-title">
              <span>🧩 Word Building Slots:</span>
              <span style={{ fontSize: '0.85rem' }}>Tap a card to place or remove</span>
            </div>

            {/* Slots Row where cards snap in */}
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
                🗂️ Tap a letter card to slide it into the slot:
              </span>

              <div className="desk-letter-tiles-row">
                {letterBank.map((letter, bIdx) => {
                  const isUsed = usedBankIndices.has(bIdx);
                  const isVowel = ['a', 'e', 'i', 'o', 'u', 'ee', 'oa', 'ai', 'ow', 'oy'].includes(letter);
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
                        {isVowel ? 'Vowel' : 'Consonant'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Success Celebration Banner */}
            {isSuccess && (
              <div className="spelling-success-banner">
                <div className="success-banner-content">
                  <PipCompanion size="sm" state="celebrating" />
                  <div>
                    <h3 style={{ margin: '0 0 0.15rem 0', color: '#15803D', fontWeight: 900 }}>
                      Word Complete! 🌟
                    </h3>
                    <p style={{ margin: 0, color: '#166534', fontSize: '0.92rem' }}>
                      You built <strong>{currentWordData.word.toUpperCase()}</strong> with Pip!
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                  <span className="success-word-highlight">
                    {currentWordData.emoji} {currentWordData.word}
                  </span>
                  <button
                    className="btn-primary"
                    onClick={handleNextWord}
                    style={{ padding: '0.75rem 1.6rem', fontSize: '1rem', fontWeight: 900 }}
                  >
                    Next Word ➔
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons Row */}
            <div className="tray-action-controls">
              <div className="action-left-buttons">
                <button
                  className="btn-secondary"
                  onClick={handleClearSlots}
                  disabled={isSuccess || placedSlots.every(s => s === null)}
                  style={{ padding: '0.55rem 1.1rem', fontSize: '0.88rem' }}
                >
                  🔄 Reset
                </button>

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
                {!isSuccess && (
                  <button
                    className="btn-primary"
                    onClick={() => validateSpelling(placedSlots)}
                    disabled={placedSlots.some(s => s === null)}
                    style={{ padding: '0.75rem 2rem', fontSize: '1.02rem', fontWeight: 900 }}
                  >
                    ✨ Check Word
                  </button>
                )}

                <button
                  className="btn-secondary"
                  onClick={handleNextWord}
                  style={{ padding: '0.55rem 1.2rem', fontSize: '0.88rem' }}
                >
                  Skip / Next ➔
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
                  <strong>Almost there!</strong> Tap any card to replace it and try again!
                </div>
              </div>
            )}

          </div>

        </div>

        {/* ------------------------------------------------------------------ */}
        {/* 4. MODAL: LIP & TONGUE PLACEMENT GUIDE (26 CLINICAL DIAGRAMS)      */}
        {/* ------------------------------------------------------------------ */}
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
                👄 Articulation Placement Guide
              </h2>
              <p style={{ color: 'var(--color-navy-muted, #55657E)', fontSize: '0.92rem', margin: 0 }}>
                Observe the lip and tongue positioning for <strong>{currentWordData.label}</strong> sounds.
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
                🗣️ <strong>Therapy Note:</strong> Watch how the lips and tongue shape before the air flows out. Practice saying the sound gently with Pip in front of a mirror!
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
