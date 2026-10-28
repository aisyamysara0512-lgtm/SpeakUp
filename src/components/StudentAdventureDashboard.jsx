import React, { useState } from 'react';
import './StudentAdventureDashboard.css';
import PipCompanion from './PipCompanion';
import { soundEngine } from '../utils/soundEngine';

/**
 * ============================================================================
 * INDIVIDUALIZED STUDENT DEMONSTRATION DATA PROFILES
 * ----------------------------------------------------------------------------
 * Each student has their own unique learning goals, assigned sounds, custom
 * quest, learning path, and non-competitive growth milestones.
 * ============================================================================
 */
export const STUDENT_PROFILES = {
  kuhendra: {
    id: 'kuhendra',
    name: 'Kuhendra Kumar',
    nickname: 'Kuhendra',
    avatar: '👦🏽',
    targetFocus: '/r/ and /th/ pronunciation',
    currentSound: '/r/',
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
      actionType: 'record-play',
      stepName: 'Step 2: Say "Rabbit" with Pip',
      badge: 'HOPPING SPROUT'
    },
    learningPath: [
      { id: 'lp1', step: 'Step 1', title: 'Listen to the /r/ Sound', status: 'completed', icon: '🎧', action: 'record-play' },
      { id: 'lp2', step: 'Step 2', title: 'Say "Rabbit" with Pip', status: 'current', icon: '🎙️', action: 'record-play' },
      { id: 'lp3', step: 'Step 3', title: 'Make a sentence in Builder', status: 'upcoming', icon: '🧩', action: 'sentence-builder' }
    ],
    growth: {
      wordsExplored: 6,
      kindStreak: 4,
      sproutTitle: 'Little Sprout: Growing nicely!',
      sproutIcon: '🌱',
      sproutDesc: 'You took 4 practice steps this week. Your sprout is growing strong leaves!'
    }
  },
  aarav: {
    id: 'aarav',
    name: 'Aarav Sharma',
    nickname: 'Aarav',
    avatar: '👦🏽',
    targetFocus: 'Speech Sound /s/',
    currentSound: '/s/',
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
      actionType: 'record-play',
      stepName: 'Step 2: Say "Sun" with Pip',
      badge: 'SUNNY SPROUT'
    },
    learningPath: [
      { id: 'lp1', step: 'Step 1', title: 'Listen to /s/ in Sun', status: 'completed', icon: '🎧', action: 'record-play' },
      { id: 'lp2', step: 'Step 2', title: 'Say "Sun" with Pip', status: 'current', icon: '🎙️', action: 'record-play' },
      { id: 'lp3', step: 'Step 3', title: 'Find /s/ words in Word Lab', status: 'upcoming', icon: '🖼️', action: 'learning-materials' }
    ],
    growth: {
      wordsExplored: 8,
      kindStreak: 5,
      sproutTitle: 'Sunny Sprout: Blooming bright!',
      sproutIcon: '🌻',
      sproutDesc: 'Wonderful consistency! You explored 8 words with Pip this week.'
    }
  },
  siti: {
    id: 'siti',
    name: 'Siti Nurhaliza',
    nickname: 'Siti',
    avatar: '👧🏽',
    targetFocus: 'Language Development (3-4 word sentences)',
    currentSound: 'Sentence Flow',
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
      { id: 'lp1', step: 'Step 1', title: 'Explore Words in Lab', status: 'completed', icon: '🖼️', action: 'learning-materials' },
      { id: 'lp2', step: 'Step 2', title: 'Build Mia Kicks the Ball', status: 'current', icon: '🧩', action: 'sentence-builder' },
      { id: 'lp3', step: 'Step 3', title: 'Record the Whole Sentence', status: 'upcoming', icon: '🎙️', action: 'record-play' }
    ],
    growth: {
      wordsExplored: 10,
      kindStreak: 3,
      sproutTitle: 'Story Sapling: Expanding leaves!',
      sproutIcon: '🌿',
      sproutDesc: 'Every sentence helps Pip understand stories better. Keep it up!'
    }
  },
  daniel: {
    id: 'daniel',
    name: 'Daniel Brooks',
    nickname: 'Daniel',
    avatar: '👦🏿',
    targetFocus: 'Listening & Word Recognition',
    currentSound: 'Word Recognition',
    goals: [
      { id: 'g1', text: 'Listen to 3 animal sounds in Word Lab', progress: '2 of 3 done', done: false },
      { id: 'g2', text: 'Say "Dog" with gentle tone', progress: 'Upcoming', done: false }
    ],
    todayQuest: {
      id: 'quest-daniel',
      title: 'Find the Friendly Dog!',
      word: 'Dog',
      emoji: '🐶',
      description: 'Listen to the audio, find the dog flashcard, and say "Dog" alongside Pip.',
      actionType: 'learning-materials',
      stepName: 'Step 1: Card Recognition',
      badge: 'LISTENING BUDDY'
    },
    learningPath: [
      { id: 'lp1', step: 'Step 1', title: 'Listen to Dog Sounds', status: 'completed', icon: '🎧', action: 'learning-materials' },
      { id: 'lp2', step: 'Step 2', title: 'Flip the Animal Flashcard', status: 'current', icon: '🖼️', action: 'learning-materials' },
      { id: 'lp3', step: 'Step 3', title: 'Say "Dog" in Studio', status: 'upcoming', icon: '🎙️', action: 'record-play' }
    ],
    growth: {
      wordsExplored: 5,
      kindStreak: 2,
      sproutTitle: 'Budding Sprout: Roots taking hold!',
      sproutIcon: '🌱',
      sproutDesc: 'You listened attentively to 5 sound clues today.'
    }
  },
  meilin: {
    id: 'meilin',
    name: 'Mei Lin Chen',
    nickname: 'Mei Lin',
    avatar: '👧🏻',
    targetFocus: 'Phonological Blends (/ch/, /sh/, /bl/)',
    currentSound: 'Blends',
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
      actionType: 'record-play',
      stepName: 'Step 2: Say "Butterfly" with Pip',
      badge: 'FLUTTER SPROUT'
    },
    learningPath: [
      { id: 'lp1', step: 'Step 1', title: 'Listen to /b/ and /f/ Cues', status: 'completed', icon: '🎧', action: 'record-play' },
      { id: 'lp2', step: 'Step 2', title: 'Record "Butterfly" with Pip', status: 'current', icon: '🎙️', action: 'record-play' },
      { id: 'lp3', step: 'Step 3', title: 'Make a sentence in Builder', status: 'upcoming', icon: '🧩', action: 'sentence-builder' }
    ],
    growth: {
      wordsExplored: 9,
      kindStreak: 6,
      sproutTitle: 'Flourishing Sprout: Growing strong!',
      sproutIcon: '🌳',
      sproutDesc: '6 days of mindful practice! Your confidence is blooming.'
    }
  }
};

/**
 * ============================================================================
 * STUDENT ADVENTURE DASHBOARD COMPONENT
 * ============================================================================
 */
export default function StudentAdventureDashboard({
  user = null,
  stars = 12,
  onNavigate = () => {},
  onStartQuest = () => {},
  onOpenSettings = () => {},
  onTriggerCelebration = null
}) {
  // Determine default student based on logged in email or fallback to Kuhendra
  const getInitialStudentId = () => {
    if (user?.email) {
      const lower = user.email.toLowerCase();
      if (lower.includes('aarav')) return 'aarav';
      if (lower.includes('siti')) return 'siti';
      if (lower.includes('daniel')) return 'daniel';
      if (lower.includes('meilin') || lower.includes('mei')) return 'meilin';
    }
    return 'kuhendra';
  };

  const [activeStudentId, setActiveStudentId] = useState(getInitialStudentId());
  const student = STUDENT_PROFILES[activeStudentId] || STUDENT_PROFILES.kuhendra;

  // Modals state
  const [showWordvilleModal, setShowWordvilleModal] = useState(false);
  const [showPipsHomeModal, setShowPipsHomeModal] = useState(false);
  const [showAccessibilityModal, setShowAccessibilityModal] = useState(false);

  // Accessibility & voice state
  const [speechSpeed, setSpeechSpeed] = useState('0.9');
  const [highContrast, setHighContrast] = useState(false);
  const [selectedVoiceName, setSelectedVoiceName] = useState('');
  const availableVoices = soundEngine.getAvailableVoices();

  const handleQuestAction = () => {
    onStartQuest({
      word: student.todayQuest.word,
      emoji: student.todayQuest.emoji,
      actionType: student.todayQuest.actionType
    });
  };

  return (
    <div className={`adventure-dashboard ${highContrast ? 'high-contrast' : ''}`}>
      {/* 1. TOP BAR: Student Profile & Non-Competitive Balance */}
      <div className="adventure-topbar">
        <div className="adventure-student-info">
          <div className="student-avatar-badge">{student.avatar}</div>
          <div>
            <h2 className="adventure-student-name">Hi, {student.nickname}! 👋</h2>
            <div className="adventure-student-focus">
              <span>🎯 Focus:</span> {student.targetFocus}
            </div>
          </div>
        </div>

        <div className="adventure-topbar-actions">
          {/* Demonstration Profile Switcher */}
          <select 
            className="student-switcher-select"
            value={activeStudentId}
            onChange={(e) => setActiveStudentId(e.target.value)}
            title="Switch demo student profile"
          >
            <option value="kuhendra">Kuhendra Kumar (/r/ & /th/)</option>
            <option value="aarav">Aarav Sharma (/s/)</option>
            <option value="siti">Siti Nurhaliza (Sentences)</option>
            <option value="daniel">Daniel Brooks (Listening)</option>
            <option value="meilin">Mei Lin Chen (Blends)</option>
          </select>

          {/* Star Coin Balance */}
          <div className="coin-pill">
            <span>⭐</span>
            <span>{stars}</span>
          </div>

          {/* Practice Session Milestone Celebration Trigger */}
          {onTriggerCelebration && (
            <button 
              className="btn-secondary" 
              onClick={onTriggerCelebration}
              style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem', background: 'var(--color-yellow-light)', borderColor: 'var(--color-yellow-border)', color: 'var(--color-yellow-deep)', fontWeight: 800 }}
              title="View today's practice time & completed session summary"
            >
              🎉 Session Summary
            </button>
          )}

          {/* Accessibility & Settings Button */}
          <button 
            className="icon-btn-round" 
            onClick={() => setShowAccessibilityModal(true)}
            title="Accessibility & Audio Settings"
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* 2. PROMINENT TODAY'S QUEST HERO BANNER WITH PIP */}
      <div className="quest-hero-banner">
        <div className="quest-companion-pane">
          <PipCompanion 
            size="hero"
            state="idle"
            message={`Ready to practice "${student.todayQuest.word}", ${student.nickname}? 🦜`}
          />
        </div>

        <div className="quest-details-card">
          <span className="quest-tag">
            ⭐ TODAY'S QUEST • {student.todayQuest.badge}
          </span>
          <h3 className="quest-title">{student.todayQuest.title}</h3>
          <p className="quest-desc">{student.todayQuest.description}</p>
          
          <div className="quest-target-pill">
            <span>Target Sound: <strong>{student.currentSound}</strong></span>
            <span>• Word: <strong>{student.todayQuest.word} {student.todayQuest.emoji}</strong></span>
          </div>

          <div className="quest-action-row">
            <button 
              className="btn-primary" 
              onClick={handleQuestAction}
              style={{ flex: 1 }}
            >
              Start Quest →
            </button>
            <button 
              className="btn-secondary"
              onClick={() => onNavigate(student.todayQuest.actionType)}
              title="Resume at current step"
            >
              Resume Step 2
            </button>
          </div>
        </div>
      </div>

      {/* 3. TWO-COLUMN FOCUSED WORKSPACE */}
      <div className="adventure-main-grid">
        {/* LEFT COLUMN: The Child's Learning Path & Assigned Goals */}
        <div className="dashboard-card-panel">
          <div className="card-panel-header">
            <h3 className="card-panel-title">
              <span>🗺️</span> My Learning Path
            </h3>
            <span className="card-panel-subtitle">{student.todayQuest.stepName}</span>
          </div>

          <div className="learning-path-list">
            {student.learningPath.map((step) => (
              <div 
                key={step.id} 
                className={`path-step-card ${step.status}`}
                onClick={() => {
                  if (step.status !== 'upcoming') {
                    onNavigate(step.action);
                  }
                }}
                style={{ cursor: step.status !== 'upcoming' ? 'pointer' : 'default' }}
              >
                <div className="step-info-col">
                  <div className="step-icon-bubble">{step.icon}</div>
                  <div className="student-info-bubble">
                    <div className="step-meta-num">{step.step}</div>
                    <div className="step-title-text">{step.title}</div>
                  </div>
                </div>

                <div className="student-info-bubble">
                  {step.status === 'completed' && (
                    <span className="step-status-chip chip-done">Completed ✅</span>
                  )}
                  {step.status === 'current' && (
                    <span className="step-status-chip chip-now">Current 🎯</span>
                  )}
                  {step.status === 'upcoming' && (
                    <span className="step-status-chip chip-locked">Locked 🔒</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Child's Assigned Goals */}
          <div className="assigned-goals-section">
            <h4 className="assigned-goals-title">
              <span>📋</span> Current Assigned Goals
            </h4>
            <div className="goals-checklist">
              {student.goals.map((goal) => (
                <div key={goal.id} className="goal-item-row">
                  <span>{goal.done ? '✅' : '🌱'} {goal.text}</span>
                  <span className="goal-status-badge">{goal.progress}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Non-Competitive Progress, Wordville Preview, Pip's Home */}
        <div className="dashboard-card-panel" style={{ gap: '1.5rem' }}>
          {/* A. Non-Competitive Sprout Growth */}
          <div>
            <div className="card-panel-header" style={{ marginBottom: '1rem' }}>
              <h3 className="card-panel-title">
                <span>🌱</span> Personal Growth
              </h3>
              <span className="card-panel-subtitle">Effort & Practice</span>
            </div>

            <div className="sprout-growth-container">
              <div className="sprout-visual-icon">{student.growth.sproutIcon}</div>
              <div className="sprout-info">
                <h4>{student.growth.sproutTitle}</h4>
                <p>{student.growth.sproutDesc}</p>
              </div>
            </div>

            <div className="growth-metrics-row">
              <div className="metric-pill-card">
                <div className="metric-pill-num">{student.growth.wordsExplored}</div>
                <div className="metric-pill-label">Words Explored</div>
              </div>
              <div className="metric-pill-card">
                <div className="metric-pill-num">{student.growth.kindStreak} Days</div>
                <div className="metric-pill-label">Gentle Streak 🔥</div>
              </div>
            </div>
          </div>

          {/* B. Feature Previews: Wordville & Pip's Home */}
          <div className="feature-preview-grid">
            {/* Wordville Preview */}
            <div 
              className="feature-preview-card"
              onClick={() => setShowWordvilleModal(true)}
            >
              <div className="student-info-bubble">
                <div className="preview-icon">🏰</div>
                <h4>Wordville</h4>
                <p>Story-driven island map where words unlock new areas.</p>
              </div>
              <span className="preview-link">View World Map →</span>
            </div>

            {/* Pip's Home Sanctuary */}
            <div 
              className="feature-preview-card"
              onClick={() => setShowPipsHomeModal(true)}
            >
              <div className="student-info-bubble">
                <div className="preview-icon">🪴</div>
                <h4>Pip's Home</h4>
                <p>Decorate Pip's cozy room with items earned from practice.</p>
              </div>
              <span className="preview-link">Visit Sanctuary →</span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================================
          INTERACTIVE MODAL 1: WORDVILLE WORLD MAP PREVIEW
          ====================================================================== */}
      {showWordvilleModal && (
        <div className="adventure-modal-backdrop" onClick={() => setShowWordvilleModal(false)}>
          <div className="adventure-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowWordvilleModal(false)}>✕</button>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--color-navy)', marginBottom: '0.4rem' }}>
              🏰 Welcome to Wordville
            </h2>
            <p style={{ color: 'var(--color-navy-muted)', fontSize: '0.95rem', fontWeight: '600', marginBottom: '1.5rem' }}>
              An educational adventure world where every clear sound unlocks a new path!
            </p>

            {/* Interactive Island Path Diagram */}
            <div style={{
              background: 'linear-gradient(135deg, var(--color-sky-light) 0%, #CFEAFB 100%)',
              borderRadius: '24px',
              padding: '2rem',
              textAlign: 'center',
              border: '2px solid var(--color-sky-border)',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ background: 'white', padding: '1rem', borderRadius: '18px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '2.5rem' }}>🏰</div>
                  <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-navy)' }}>Sound Castle</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-green-hover)', fontWeight: '800' }}>Unlocked ✅</span>
                </div>
                <span style={{ fontSize: '1.5rem', color: 'var(--color-sky)' }}>➔</span>
                <div style={{ background: 'white', padding: '1rem', borderRadius: '18px', border: '2px solid var(--color-teal)', boxShadow: 'var(--shadow-md)' }}>
                  <div style={{ fontSize: '2.5rem' }}>🌲</div>
                  <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-navy)' }}>Whispering Woods</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-teal)', fontWeight: '800' }}>Current Quest 🎯</span>
                </div>
                <span style={{ fontSize: '1.5rem', color: 'var(--color-navy-light)' }}>➔</span>
                <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '18px', opacity: 0.7 }}>
                  <div style={{ fontSize: '2.5rem' }}>🌊</div>
                  <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-navy-muted)' }}>Rainbow Bay</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-navy-muted)', fontWeight: '800' }}>Locked 🔒</span>
                </div>
              </div>
            </div>

            <button 
              className="btn-primary" 
              style={{ width: '100%' }}
              onClick={() => {
                setShowWordvilleModal(false);
                handleQuestAction();
              }}
            >
              Continue Quest in Whispering Woods →
            </button>
          </div>
        </div>
      )}

      {/* ======================================================================
          INTERACTIVE MODAL 2: PIP'S COZY SANCTUARY
          ====================================================================== */}
      {showPipsHomeModal && (
        <div className="adventure-modal-backdrop" onClick={() => setShowPipsHomeModal(false)}>
          <div className="adventure-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowPipsHomeModal(false)}>✕</button>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--color-navy)', marginBottom: '0.4rem' }}>
              🪴 Pip's Sanctuary
            </h2>
            <p style={{ color: 'var(--color-navy-muted)', fontSize: '0.95rem', fontWeight: '600', marginBottom: '1.5rem' }}>
              Earn items and grow Pip's cozy room with each word you practice.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <PipCompanion size="lg" state="resting" message="So cozy in here! Thank you for practicing with me! 🛋️" />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ background: 'var(--bg-canvas)', padding: '1rem', borderRadius: '18px', textAlign: 'center', border: '1.5px solid var(--border-soft)' }}>
                <div style={{ fontSize: '2.2rem' }}>🛋️</div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--color-navy)', display: 'block' }}>Cozy Couch</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-green-hover)', fontWeight: '800' }}>Unlocked</span>
              </div>
              <div style={{ background: 'var(--bg-canvas)', padding: '1rem', borderRadius: '18px', textAlign: 'center', border: '1.5px solid var(--border-soft)' }}>
                <div style={{ fontSize: '2.2rem' }}>🪴</div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--color-navy)', display: 'block' }}>Water Sprout</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-green-hover)', fontWeight: '800' }}>Level 3</span>
              </div>
              <div style={{ background: 'var(--bg-canvas)', padding: '1rem', borderRadius: '18px', textAlign: 'center', border: '1.5px solid var(--border-soft)' }}>
                <div style={{ fontSize: '2.2rem' }}>🎁</div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--color-navy)', display: 'block' }}>Star Chest</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-yellow-deep)', fontWeight: '800' }}>{stars} Stars</span>
              </div>
            </div>

            <button className="btn-secondary" style={{ width: '100%' }} onClick={() => setShowPipsHomeModal(false)}>
              Close Sanctuary
            </button>
          </div>
        </div>
      )}

      {/* ======================================================================
          INTERACTIVE MODAL 3: ACCESSIBILITY & AUDIO SETTINGS
          ====================================================================== */}
      {showAccessibilityModal && (
        <div className="adventure-modal-backdrop" onClick={() => setShowAccessibilityModal(false)}>
          <div className="adventure-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowAccessibilityModal(false)}>✕</button>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--color-navy)', marginBottom: '0.4rem' }}>
              ⚙️ Accessibility & Speech Settings
            </h2>
            <p style={{ color: 'var(--color-navy-muted)', fontSize: '0.95rem', fontWeight: '600', marginBottom: '1.5rem' }}>
              Customize audio speed and visual contrast for a comfortable learning experience.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2rem' }}>
              {/* Natural Voice Persona Selector */}
              {availableVoices.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="student-info-bubble">
                    <strong style={{ display: 'block', color: 'var(--color-navy)' }}>AI Voice Tone (Alexa / Natural)</strong>
                    <small style={{ color: 'var(--color-navy-muted)' }}>Choose natural conversational assistant voice</small>
                  </div>
                  <select
                    value={selectedVoiceName}
                    onChange={(e) => {
                      setSelectedVoiceName(e.target.value);
                      soundEngine.setCustomVoice(e.target.value);
                      soundEngine.speak("Hi there! I am your natural speech practice voice.", 'teacher');
                    }}
                    style={{ padding: '0.6rem 1rem', borderRadius: '12px', border: '1.5px solid var(--border-soft)', fontWeight: '800', maxWidth: '200px' }}
                  >
                    <option value="">Auto Natural (Recommended)</option>
                    {availableVoices.map(v => (
                      <option key={v.voiceURI || v.name} value={v.name}>
                        {v.name.replace(/Microsoft |Google |Apple /g, '')}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="student-info-bubble">
                  <strong style={{ display: 'block', color: 'var(--color-navy)' }}>Audio Model Speed</strong>
                  <small style={{ color: 'var(--color-navy-muted)' }}>Choose how fast Pip & speech models speak</small>
                </div>
                <select 
                  value={speechSpeed} 
                  onChange={(e) => setSpeechSpeed(e.target.value)}
                  style={{ padding: '0.6rem 1rem', borderRadius: '12px', border: '1.5px solid var(--border-soft)', fontWeight: '800' }}
                >
                  <option value="1.0">Normal (1.0x)</option>
                  <option value="0.9">Gentle (0.9x - Recommended)</option>
                  <option value="0.6">Slow & Articulated (0.6x)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="student-info-bubble">
                  <strong style={{ display: 'block', color: 'var(--color-navy)' }}>High Contrast Visuals</strong>
                  <small style={{ color: 'var(--color-navy-muted)' }}>Enhance borders and text legibility</small>
                </div>
                <button 
                  className="btn-secondary"
                  onClick={() => setHighContrast(!highContrast)}
                  style={{ padding: '0.5rem 1.2rem' }}
                >
                  {highContrast ? 'ON ✅' : 'OFF'}
                </button>
              </div>
            </div>

            <button className="btn-primary" style={{ width: '100%' }} onClick={() => setShowAccessibilityModal(false)}>
              Save & Return
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
