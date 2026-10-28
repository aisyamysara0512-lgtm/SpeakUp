import React, { useState } from 'react';
import ActivityShell from '../components/ActivityShell';
import { CONNECT_THE_SENTENCE_ITEMS } from '../data/curriculumData';
import { soundEngine } from '../utils/soundEngine';

/**
 * Connect the Sentence activity
 * With clear visual error indication, Retry button, and Pip's gentle Hint
 */
export default function ConnectTheSentence({
  onBack = () => {},
  onHome = () => {},
  onCompleteItem = () => {},
  onPlayAudio = () => {}
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedbackState, setFeedbackState] = useState(null); // 'correct' | 'retry' | null
  const [showHint, setShowHint] = useState(false);
  const [pipMessage, setPipMessage] = useState("Pick the connecting word that makes the most sense!");
  const [pipState, setPipState] = useState("idle");

  const item = CONNECT_THE_SENTENCE_ITEMS[currentIndex];
  const isFinished = currentIndex >= CONNECT_THE_SENTENCE_ITEMS.length;

  const handleSelectOption = (opt) => {
    setSelectedOption(opt);
    if (opt.toLowerCase() === item.answer.toLowerCase()) {
      soundEngine.playTing();
      setFeedbackState('correct');
      setShowHint(false);
      setPipState('celebrating');
      setPipMessage(`Hooray! "${item.fullSentence}" sounds wonderful! 🌟`);
      onPlayAudio(item.fullSentence);
      onCompleteItem(3, 'Sentence connected!');
    } else {
      soundEngine.playError();
      setFeedbackState('retry');
      setPipState('try-again');
      setPipMessage(`Not quite yet! Tap "💡 Need a Hint?" or "🔄 Try Again"! 💛`);
    }
  };

  const handleRetry = () => {
    setSelectedOption(null);
    setFeedbackState(null);
    setPipState('idle');
    setPipMessage("Take your time and pick again! You can do it! 🦜");
  };

  const handleNext = () => {
    setSelectedOption(null);
    setFeedbackState(null);
    setShowHint(false);
    setPipState('idle');
    setPipMessage("Ready for the next connecting sentence? Let's go! 🦜");
    setCurrentIndex(prev => prev + 1);
  };

  if (isFinished) {
    return (
      <ActivityShell
        title="Sentence Connect Complete!"
        moduleName="Sentence Treehouse"
        stepIndex={CONNECT_THE_SENTENCE_ITEMS.length}
        totalSteps={CONNECT_THE_SENTENCE_ITEMS.length}
        pipState="celebrating"
        pipMessage="Magnificent work connecting all 9 sentences with Pip!"
        onBack={onBack}
        onHome={onHome}
      >
        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <div style={{ fontSize: '4.5rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--color-navy)', marginBottom: '0.8rem' }}>
            All Connected Sentences Practiced!
          </h2>
          <p style={{ color: 'var(--color-navy-muted)', fontSize: '1.1rem', maxWidth: '480px', margin: '0 auto 2rem auto', fontWeight: 600 }}>
            You discovered how words like <strong>to</strong>, <strong>when</strong>, and <strong>because</strong> help explain our reasons and daily routines!
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn-secondary" onClick={() => { setCurrentIndex(0); setFeedbackState(null); setShowHint(false); }}>
              🔄 Practice Again
            </button>
            <button className="btn-primary" onClick={onHome}>
              Return to Treehouse ➔
            </button>
          </div>
        </div>
      </ActivityShell>
    );
  }

  // Display incomplete sentence with blank replaced if correct
  const displaySentence = feedbackState === 'correct' 
    ? item.incomplete.replace('___', `[ ${item.answer} ]`)
    : item.incomplete;

  return (
    <ActivityShell
      title={`Target: ${item.category}`}
      moduleName="Sentence Treehouse"
      stepIndex={currentIndex + 1}
      totalSteps={CONNECT_THE_SENTENCE_ITEMS.length}
      pipState={pipState}
      pipMessage={pipMessage}
      onBack={onBack}
      onHome={onHome}
      onSpeakModel={onPlayAudio}
      modelText={feedbackState === 'correct' ? item.fullSentence : item.prompt}
      hint={showHint ? item.hint : null}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
        
        {/* Situation Picture & Context Card */}
        <div style={{
          background: 'var(--bg-canvas)',
          border: '2px solid var(--border-soft)',
          borderRadius: '24px',
          padding: '2rem',
          width: '100%',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ fontSize: '4.5rem', marginBottom: '0.8rem' }}>{item.icon}</div>
          <p style={{ color: 'var(--color-navy-muted)', fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            {item.situation}
          </p>
          <h3 style={{
            fontSize: '1.8rem',
            fontWeight: 900,
            color: 'var(--color-navy)',
            lineHeight: 1.4,
            padding: '1rem',
            background: 'var(--bg-card)',
            borderRadius: '16px',
            border: '2px dashed var(--border-strong)',
            marginTop: '1rem'
          }}>
            {displaySentence}
          </h3>
        </div>

        {/* Choice Options */}
        <div style={{
          display: 'flex',
          gap: '1.2rem',
          justifyContent: 'center',
          width: '100%',
          flexWrap: 'wrap'
        }}>
          {item.options.map((opt) => {
            const isSelected = selectedOption === opt;
            const isCorrect = isSelected && feedbackState === 'correct';
            const isWrong = isSelected && feedbackState === 'retry';

            return (
              <button
                key={opt}
                onClick={() => handleSelectOption(opt)}
                style={{
                  minWidth: '130px',
                  padding: '1.1rem 2rem',
                  fontSize: '1.4rem',
                  fontWeight: 900,
                  borderRadius: '24px',
                  cursor: 'pointer',
                  border: isCorrect 
                    ? '3px solid var(--color-green)' 
                    : isWrong 
                    ? '3px solid var(--color-coral)' 
                    : '2px solid var(--border-soft)',
                  background: isCorrect 
                    ? 'var(--color-green-light)' 
                    : isWrong 
                    ? 'var(--color-coral-light)' 
                    : 'var(--bg-card)',
                  color: isWrong ? 'var(--color-coral-strong)' : 'var(--color-navy)',
                  boxShadow: isWrong ? '0 0 0 4px var(--color-coral-border)' : 'var(--shadow-sm)',
                  transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                {opt} {isWrong && '❌'} {isCorrect && '✅'}
              </button>
            );
          })}
        </div>

        {/* 1. SUCCESS FEEDBACK */}
        {feedbackState === 'correct' && (
          <div className="feedback-alert success" style={{ width: '100%', maxWidth: '620px' }}>
            <span style={{ fontSize: '2.4rem' }}>🎉</span>
            <div>
              <h4 style={{ fontWeight: 900, fontSize: '1.2rem' }}>Wonderful Answer!</h4>
              <p style={{ fontSize: '1.05rem', fontWeight: 600 }}>"{item.fullSentence}"</p>
            </div>
          </div>
        )}

        {/* 2. CLEAR ERROR FEEDBACK WITH RETRY & HINT BUTTONS */}
        {feedbackState === 'retry' && (
          <div style={{
            width: '100%',
            maxWidth: '620px',
            background: 'var(--color-coral-light)',
            border: '2px solid var(--color-coral)',
            borderRadius: '24px',
            padding: '1.5rem 1.8rem',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.2rem' }}>
              <span style={{ fontSize: '2.5rem' }}>❌</span>
              <div>
                <h4 style={{ color: 'var(--color-coral-strong)', fontSize: '1.25rem', fontWeight: 900 }}>
                  Not quite the right connecting word!
                </h4>
                <p style={{ color: 'var(--color-navy)', fontWeight: 600, fontSize: '0.98rem' }}>
                  "{selectedOption}" doesn't fit the sentence situation. Don't worry, you can try again!
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
              <button 
                className="btn-coral"
                onClick={handleRetry}
                style={{ padding: '0.7rem 1.4rem', fontSize: '0.95rem' }}
              >
                🔄 Try Again
              </button>
              <button 
                className="btn-secondary"
                onClick={() => setShowHint(true)}
                style={{ padding: '0.7rem 1.4rem', fontSize: '0.95rem', background: 'var(--color-yellow-light)', borderColor: 'var(--color-yellow-border)', color: 'var(--color-yellow-deep)' }}
              >
                💡 Need a Hint?
              </button>
            </div>

            {showHint && (
              <div style={{
                marginTop: '1.2rem',
                padding: '1rem',
                background: '#fff',
                borderRadius: '16px',
                border: '1.5px solid var(--color-yellow-border)',
                color: 'var(--color-yellow-deep)',
                fontWeight: 700,
                fontSize: '0.95rem'
              }}>
                <strong>Pip's Clue:</strong> {item.hint}
              </div>
            )}
          </div>
        )}

        {/* Actions Row */}
        <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'space-between', marginTop: '1rem' }}>
          <button 
            className="btn-secondary" 
            onClick={() => onPlayAudio(item.incomplete.replace('___', 'blank'))}
          >
            🔊 Hear Incomplete Sentence
          </button>

          {feedbackState === 'correct' && (
            <button className="btn-primary" onClick={handleNext}>
              Next Sentence ➔
            </button>
          )}
        </div>

      </div>
    </ActivityShell>
  );
}
