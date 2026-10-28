import React, { useState } from 'react';
import ActivityShell from '../components/ActivityShell';
import { THINK_AND_DISCOVER_DATA } from '../data/curriculumData';
import { soundEngine } from '../utils/soundEngine';

/**
 * Think & Discover (Word Forest) Module
 * Features 5 Question Pathways (WHAT, WHO, WHY, WHERE, WHEN)
 * With explicit incorrect indicator (❌), Retry button, and Pip's Hint
 */
export default function ThinkAndDiscover({
  onBack = () => {},
  onHome = () => {},
  onCompleteQuestion = () => {},
  onPlayAudio = () => {}
}) {
  const [activePathway, setActivePathway] = useState('WHAT');
  const [cardIndex, setCardIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'retry' | null
  const [showHint, setShowHint] = useState(false);
  const [pipState, setPipState] = useState('idle');
  const [pipMessage, setPipMessage] = useState('Explore the question clue and find the answer! 🔍');

  const currentCategory = THINK_AND_DISCOVER_DATA[activePathway];
  const currentCard = currentCategory.cards[cardIndex];

  const handleSelectPathway = (pKey) => {
    setActivePathway(pKey);
    setCardIndex(0);
    setSelectedChoice(null);
    setFeedback(null);
    setShowHint(false);
    setPipState('idle');
    setPipMessage(`Exploring ${pKey}? pathway! Look at the first clue.`);
  };

  const handleChoice = (choiceText) => {
    setSelectedChoice(choiceText);
    const isCorrect = choiceText.toLowerCase() === currentCard.answer.toLowerCase();

    if (isCorrect) {
      soundEngine.playTing();
      setFeedback('correct');
      setShowHint(false);
      setPipState('celebrating');
      setPipMessage(`Super thinking! "${currentCard.answer}" is correct! ⭐`);
      onPlayAudio(currentCard.answer);
      onCompleteQuestion(2, `Discovered: ${currentCard.answer}`);
    } else {
      soundEngine.playError();
      setFeedback('retry');
      setPipState('try-again');
      setPipMessage(`Not that one! Tap "💡 Need a Hint?" or "🔄 Try Again"! 💛`);
    }
  };

  const handleRetry = () => {
    setSelectedChoice(null);
    setFeedback(null);
    setPipState('idle');
    setPipMessage("Ready for another attempt! Pick the best card. 🦜");
  };

  const handleNextCard = () => {
    setSelectedChoice(null);
    setFeedback(null);
    setShowHint(false);
    setPipState('idle');
    if (cardIndex + 1 < currentCategory.cards.length) {
      setCardIndex(prev => prev + 1);
      setPipMessage("Next clue ready! What do you think?");
    } else {
      setPipState('celebrating');
      setPipMessage(`You finished all clues in the ${activePathway}? pathway! Excellent exploration! 🎉`);
    }
  };

  return (
    <ActivityShell
      title={currentCategory.title}
      moduleName="Think & Discover (Word Forest)"
      stepIndex={cardIndex + 1}
      totalSteps={currentCategory.cards.length}
      pipState={pipState}
      pipMessage={pipMessage}
      onBack={onBack}
      onHome={onHome}
      onSpeakModel={onPlayAudio}
      modelText={feedback === 'correct' ? currentCard.audioSentence : currentCard.question}
      hint={showHint ? currentCard.hint : null}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
        
        {/* Pathway Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.8rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          borderBottom: '2px solid var(--border-soft)',
          paddingBottom: '1rem'
        }}>
          {Object.keys(THINK_AND_DISCOVER_DATA).map(key => {
            const data = THINK_AND_DISCOVER_DATA[key];
            const isActive = activePathway === key;
            return (
              <button
                key={key}
                onClick={() => handleSelectPathway(key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.7rem 1.4rem',
                  borderRadius: '9999px',
                  fontWeight: 900,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  border: isActive ? '2px solid var(--color-teal)' : '1.5px solid var(--border-soft)',
                  background: isActive ? 'var(--color-teal)' : 'var(--bg-card)',
                  color: isActive ? '#fff' : 'var(--color-navy)',
                  boxShadow: isActive ? 'var(--shadow-teal)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{data.icon}</span> <span>{key}?</span>
              </button>
            );
          })}
        </div>

        {/* Question & Illustration Card */}
        <div style={{
          background: 'var(--bg-canvas)',
          borderRadius: '24px',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          border: '2px solid var(--border-soft)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ fontSize: '4.5rem', marginBottom: '1rem' }}>{currentCard.icon}</div>
          <span style={{
            fontSize: '0.85rem',
            fontWeight: 800,
            color: 'var(--color-teal)',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Question {cardIndex + 1} of 7
          </span>
          <h3 style={{
            fontSize: '1.9rem',
            fontWeight: 900,
            color: 'var(--color-navy)',
            marginTop: '0.5rem',
            lineHeight: 1.3
          }}>
            {currentCard.question}
          </h3>
        </div>

        {/* Visual & Word Choices */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          {currentCard.options.map(optionText => {
            const isSelected = selectedChoice === optionText;
            const isCorrect = isSelected && feedback === 'correct';
            const isWrong = isSelected && feedback === 'retry';

            return (
              <button
                key={optionText}
                onClick={() => handleChoice(optionText)}
                style={{
                  padding: '1.4rem 1.2rem',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  textAlign: 'center',
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
                  transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                {optionText} {isWrong && '❌'} {isCorrect && '✅'}
              </button>
            );
          })}
        </div>

        {/* 1. SUCCESS FEEDBACK */}
        {feedback === 'correct' && (
          <div className="feedback-alert success" style={{ width: '100%' }}>
            <span style={{ fontSize: '2.4rem' }}>🎉</span>
            <div>
              <h4 style={{ fontWeight: 900, fontSize: '1.2rem' }}>That's it! "{currentCard.answer}"</h4>
              <p style={{ fontSize: '1.05rem', fontWeight: 600 }}>{currentCard.audioSentence}</p>
            </div>
          </div>
        )}

        {/* 2. EXPLICIT INCORRECT NOTICE WITH RETRY & HINT BUTTONS */}
        {feedback === 'retry' && (
          <div style={{
            width: '100%',
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
                  Incorrect choice: "{selectedChoice}"
                </h4>
                <p style={{ color: 'var(--color-navy)', fontWeight: 600, fontSize: '0.98rem' }}>
                  That card does not answer this question. Try picking another card!
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
                <strong>Pip's Clue:</strong> {currentCard.hint}
              </div>
            )}
          </div>
        )}

        {/* Navigation / Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button 
            className="btn-secondary"
            onClick={() => onPlayAudio(currentCard.question)}
          >
            🔊 Hear Question
          </button>

          {feedback === 'correct' && (
            <button className="btn-primary" onClick={handleNextCard}>
              {cardIndex + 1 < currentCategory.cards.length ? 'Next Clue ➔' : 'Complete Pathway ⭐'}
            </button>
          )}
        </div>

      </div>
    </ActivityShell>
  );
}
