import React, { useState, useEffect, useRef } from 'react';
import './LearningQuest.css';
import PipCompanion from './PipCompanion';

/**
 * ============================================================================
 * SPEAKUP LEARNING QUEST: STEP A (LISTEN) & STEP B (CHOOSE)
 * ----------------------------------------------------------------------------
 * A demonstration quest where Pip helps the child find the red ball:
 * - Step A (Listen): Hear the word "Ball", look at the picture, mouth cues.
 * - Step B (Choose): Identify the red ball among plausible picture distractors.
 * ============================================================================
 */
export default function LearningQuest({
  targetWord = "Ball",
  targetEmoji = "🔴",
  onCompleteQuest = () => {},
  onExitQuest = () => {}
}) {
  const [currentStep, setCurrentStep] = useState('A'); // 'A' (Listen) | 'B' (Choose) | 'DONE'
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [hasListenedAtLeastOnce, setHasListenedAtLeastOnce] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(0.85);

  // Step B choices state
  const [selectedChoiceId, setSelectedChoiceId] = useState(null);
  const [choiceFeedback, setChoiceFeedback] = useState(null); // 'correct' | 'retry' | null
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Pip companion message & state for this quest
  const [pipState, setPipState] = useState('idle');
  const [pipMessage, setPipMessage] = useState(`Let's find the red ball together! Tap the speaker to listen.`);

  // 4 Picture Choices for Step B (Matching the reference mockup)
  const choices = [
    { id: 'ball', label: 'Red Ball', icon: '🔴', isTarget: true, hint: 'Round and red' },
    { id: 'car', label: 'Yellow Car', icon: '🚗', isTarget: false, hint: 'Vehicle that drives' },
    { id: 'cat', label: 'Cute Cat', icon: '🐱', isTarget: false, hint: 'Furry animal' },
    { id: 'tree', label: 'Green Tree', icon: '🌳', isTarget: false, hint: 'Tall plant with leaves' },
  ];

  /**
   * AUDIO ENGINE WITH INSPECTION & GRACEFUL FALLBACK
   * 1. Checks for local audio file: `/audio/ball.mp3`.
   * 2. If not found or unsupported, gracefully falls back to browser Web Speech Synthesis
   *    with clear pitch, articulated rate, and visual soundwave playing state.
   */
  const playTargetWordAudio = (speed = playbackSpeed) => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    setPipState('speaking');
    setPipMessage(`Listen closely to how "${targetWord}" sounds! 🗣️`);

    const audioUrl = `/audio/${targetWord.toLowerCase()}.mp3`;
    const audio = new Audio(audioUrl);
    audio.playbackRate = speed;

    const onAudioEnd = () => {
      setIsPlayingAudio(false);
      setHasListenedAtLeastOnce(true);
      setPipState('idle');
      if (currentStep === 'A') {
        setPipMessage(`Great listening! Ready to choose the picture? Tap Next! 🦜`);
      }
    };

    // Try playing local audio file first
    audio.play()
      .then(() => {
        audio.onended = onAudioEnd;
      })
      .catch(() => {
        // Graceful Fallback: Browser Text-to-Speech (Web Speech API)
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(targetWord);
          utterance.lang = 'en-US';
          utterance.pitch = 1.15; // Friendly, clear speech therapy pitch
          utterance.rate = speed;
          utterance.onend = onAudioEnd;
          utterance.onerror = () => {
            setIsPlayingAudio(false);
            setPipState('idle');
          };
          window.speechSynthesis.speak(utterance);
        } else {
          setIsPlayingAudio(false);
          setPipState('idle');
        }
      });
  };

  // Play word on first load of Step A
  useEffect(() => {
    const timer = setTimeout(() => {
      playTargetWordAudio(0.85);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Handle choice selection in Step B
  const handleSelectChoice = (choice) => {
    setSelectedChoiceId(choice.id);

    if (choice.isTarget) {
      // Correct target selected!
      setChoiceFeedback('correct');
      setFeedbackMessage('🎉 Wonderful! You found the red ball!');
      setPipState('celebrating');
      setPipMessage(`Hooray! You found the red ball! Super listening! ⭐`);

      // Play cheerful completion chime via Speech or audio
      if ('speechSynthesis' in window) {
        const cheer = new SpeechSynthesisUtterance("Yes! Red ball!");
        cheer.pitch = 1.3;
        cheer.rate = 1.0;
        window.speechSynthesis.speak(cheer);
      }
    } else {
      // Distractor selected (Supportive retry)
      setChoiceFeedback('retry');
      setFeedbackMessage(`That's the ${choice.label.toLowerCase()}! Look for the round red ball! 💛`);
      setPipState('try-again');
      setPipMessage(`Good try! That's the ${choice.label.toLowerCase()}. Look for the red ball! 🦜`);
    }
  };

  const handleFinishStepB = () => {
    setCurrentStep('DONE');
    onCompleteQuest(5); // Grant +5 stars reward
  };

  return (
    <div className="quest-container">
      {/* 1. TOP QUEST NAVIGATION & PROGRESS STEPS */}
      <div className="quest-top-header">
        <button className="quest-back-btn" onClick={onExitQuest}>
          <span>←</span> Back to Adventure Hub
        </button>

        <div className="quest-steps-indicator">
          <div className={`step-pill ${currentStep === 'A' ? 'active' : (currentStep === 'B' || currentStep === 'DONE' ? 'completed' : '')}`}>
            <span>1. Listen</span> {currentStep !== 'A' && '✓'}
          </div>
          <span style={{ color: 'var(--color-navy-muted)', fontWeight: 800 }}>➔</span>
          <div className={`step-pill ${currentStep === 'B' ? 'active' : (currentStep === 'DONE' ? 'completed' : '')}`}>
            <span>2. Choose</span> {currentStep === 'DONE' && '✓'}
          </div>
        </div>
      </div>

      {/* Pip the Parrot Companion guiding the quest */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <PipCompanion 
          size="md"
          state={pipState}
          message={pipMessage}
        />
      </div>

      {/* ======================================================================
          STEP A: LISTEN VIEW
          ====================================================================== */}
      {currentStep === 'A' && (
        <div className="quest-card-stage">
          <span className="quest-instruction-badge">
            🎧 STEP 1: LISTEN
          </span>
          <h2 className="quest-instruction-title">Listen to the word</h2>
          <p className="quest-instruction-sub">
            Tap the speaker button to hear the sound, then look at the picture.
          </p>

          <div className="listen-stage-body">
            {/* Focal Target Card with Image & Word */}
            <div className="focal-target-card">
              <div className="focal-image-display">
                {targetEmoji}
              </div>
              <div className="focal-word-text">
                {targetWord}
              </div>

              {/* Optional Mouth Cue / Phonics Prompt */}
              <div className="phonics-visual-cue" title="Speech Therapy Articulation Cue">
                <span>👄</span>
                <span><strong>Lip Cue:</strong> Press lips for <em>/b/</em>, round open for <em>-all</em></span>
              </div>
            </div>

            {/* Large Audio Play Button with Soundwave Ring Indicator */}
            <button 
              className={`listen-audio-btn ${isPlayingAudio ? 'playing' : ''}`}
              onClick={() => playTargetWordAudio(playbackSpeed)}
              title="Tap to hear pronunciation"
              aria-label="Play audio"
            >
              {isPlayingAudio ? '🔊' : '▶️'}
            </button>

            {/* Replay & Speed Controls */}
            <div className="audio-controls-subrow">
              <button 
                className="btn-secondary"
                onClick={() => playTargetWordAudio(1.0)}
                disabled={isPlayingAudio}
                style={{ padding: '0.6rem 1.2rem', fontSize: '0.88rem' }}
              >
                🔊 Normal (1.0x)
              </button>
              <button 
                className="btn-secondary"
                onClick={() => playTargetWordAudio(0.65)}
                disabled={isPlayingAudio}
                style={{ padding: '0.6rem 1.2rem', fontSize: '0.88rem', background: 'var(--color-sky-light)', color: 'var(--color-sky-hover)', borderColor: 'var(--color-sky-border)' }}
              >
                🐢 Slow (0.65x)
              </button>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="quest-nav-footer">
            <button 
              className="btn-secondary" 
              onClick={() => setCurrentStep('B')}
            >
              Skip
            </button>

            <button 
              className="btn-primary"
              onClick={() => {
                setCurrentStep('B');
                setPipState('idle');
                setPipMessage(`Which picture matches "ball"? Find the red ball! 🔴`);
              }}
            >
              Next Step (Choose) →
            </button>
          </div>
        </div>
      )}

      {/* ======================================================================
          STEP B: CHOOSE VIEW
          ====================================================================== */}
      {currentStep === 'B' && (
        <div className="quest-card-stage">
          <span className="quest-instruction-badge" style={{ background: 'var(--color-green-light)', color: 'var(--color-green-hover)', borderColor: 'var(--color-green-border)' }}>
            🎯 STEP 2: CHOOSE
          </span>
          <h2 className="quest-instruction-title">Which picture matches the word?</h2>
          <p className="quest-instruction-sub">
            Look closely at the pictures and tap the one matching the word you heard.
          </p>

          {/* Replay Target Word Strip */}
          <div className="choose-replay-strip">
            <button 
              className="icon-btn-round"
              onClick={() => playTargetWordAudio(playbackSpeed)}
              disabled={isPlayingAudio}
              style={{ width: '36px', height: '36px', fontSize: '1rem' }}
              title="Hear the word again"
            >
              🔊
            </button>
            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-navy)' }}>
              Hear word again: <strong>"{targetWord}"</strong>
            </span>
          </div>

          {/* 4 Picture Choice Grid */}
          <div className="choose-grid">
            {choices.map((choice) => {
              const isSelected = selectedChoiceId === choice.id;
              const isCorrectSelection = isSelected && choiceFeedback === 'correct';
              const isIncorrectSelection = isSelected && choiceFeedback === 'retry';

              return (
                <div 
                  key={choice.id}
                  className={`choice-card-btn ${isCorrectSelection ? 'correct' : ''} ${isIncorrectSelection ? 'incorrect' : ''}`}
                  onClick={() => handleSelectChoice(choice)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="choice-icon">{choice.icon}</div>
                  <span className="choice-label">{choice.label}</span>
                  {isCorrectSelection && <div className="choice-check-badge">✓</div>}
                </div>
              );
            })}
          </div>

          {/* Supportive Selection Feedback Banner */}
          {choiceFeedback && (
            <div className={`choose-feedback-banner ${choiceFeedback === 'correct' ? 'success' : 'retry'}`}>
              <span>{choiceFeedback === 'correct' ? '🌟' : '💡'}</span>
              <span>{feedbackMessage}</span>
            </div>
          )}

          {/* Bottom Navigation */}
          <div className="quest-nav-footer">
            <button 
              className="btn-secondary" 
              onClick={() => {
                setCurrentStep('A');
                setSelectedChoiceId(null);
                setChoiceFeedback(null);
              }}
            >
              ← Back to Listen
            </button>

            {choiceFeedback === 'correct' ? (
              <button 
                className="btn-primary"
                onClick={handleFinishStepB}
              >
                Complete Quest Step ⭐
              </button>
            ) : (
              <button 
                className="btn-secondary" 
                onClick={() => playTargetWordAudio(playbackSpeed)}
              >
                🔊 Replay Sound
              </button>
            )}
          </div>
        </div>
      )}

      {/* ======================================================================
          STEP DONE: CELEBRATION & COMPLETION
          ====================================================================== */}
      {currentStep === 'DONE' && (
        <div className="quest-card-stage" style={{ background: 'linear-gradient(135deg, var(--bg-canvas) 0%, var(--color-green-light) 100%)' }}>
          <div style={{ fontSize: '4.5rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ fontSize: '2.4rem', fontWeight: '900', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
            Quest Step Complete!
          </h2>
          <p style={{ color: 'var(--color-navy-muted)', fontSize: '1.1rem', fontWeight: '600', maxWidth: '440px', marginBottom: '2rem' }}>
            You and Pip found the red ball together! Your careful listening earned you <strong>+5 ⭐ Star Coins</strong> and helped your sprout grow.
          </p>

          <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '380px' }}>
            <button 
              className="btn-primary" 
              style={{ flex: 1 }}
              onClick={onExitQuest}
            >
              Return to Adventure Hub ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
