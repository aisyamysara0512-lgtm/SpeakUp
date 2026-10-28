import React, { useState } from 'react';
import ActivityShell from '../components/ActivityShell';
import { WHAT_DO_I_NEED_SCENARIOS } from '../data/curriculumData';
import { soundEngine } from '../utils/soundEngine';

/**
 * Helper Harbour: What Do I Need?
 * Functional communication & AAC-inspired practice
 * With clear visual error indication (❌), Retry button, and Pip's Hint
 */
export default function WhatDoINeed({
  onBack = () => {},
  onHome = () => {},
  onOpenBoard = () => {},
  onPlayAudio = () => {},
  onCompleteScenario = () => {}
}) {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [pipState, setPipState] = useState('idle');
  const [pipMessage, setPipMessage] = useState("Look at what's happening. What would help you right now? 🧸");

  const current = WHAT_DO_I_NEED_SCENARIOS[scenarioIndex];
  const isFinished = scenarioIndex >= WHAT_DO_I_NEED_SCENARIOS.length;

  const handleSelectChoice = (choice) => {
    setSelectedChoice(choice);
    // Spoken vocabulary word immediately
    onPlayAudio(choice.label);

    if (choice.isCorrect) {
      soundEngine.playTing();
      setFeedback('correct');
      setShowHint(false);
      setPipState('celebrating');
      setPipMessage(`Pip says: "${current.modelSentence}" 🌟`);
      // Then play the full model sentence with a slight delay
      setTimeout(() => {
        onPlayAudio(current.modelSentence);
      }, 700);
      onCompleteScenario(3, `Functional Need: ${choice.label}`);
    } else {
      soundEngine.playError();
      setFeedback('retry');
      setPipState('try-again');
      setPipMessage(`That item wouldn't help here. Tap "💡 Need a Hint?" or "🔄 Try Again"! 💛`);
    }
  };

  const handleRetry = () => {
    setSelectedChoice(null);
    setFeedback(null);
    setPipState('idle');
    setPipMessage("Take another look at the picture and pick what you need! 🦜");
  };

  const handleNext = () => {
    setSelectedChoice(null);
    setFeedback(null);
    setShowHint(false);
    setPipState('idle');
    setPipMessage("Ready for the next situation? Let's help out! 🦜");
    setScenarioIndex(prev => prev + 1);
  };

  if (isFinished) {
    return (
      <ActivityShell
        title="Helper Harbour Complete!"
        moduleName="Helper Harbour (What Do I Need?)"
        stepIndex={WHAT_DO_I_NEED_SCENARIOS.length}
        totalSteps={WHAT_DO_I_NEED_SCENARIOS.length}
        pipState="celebrating"
        pipMessage="Wonderful job expressing your needs in every situation!"
        onBack={onBack}
        onHome={onHome}
      >
        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <div style={{ fontSize: '4.5rem', marginBottom: '1rem' }}>⛵</div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--color-navy)', marginBottom: '0.8rem' }}>
            Helper Harbour Journey Complete!
          </h2>
          <p style={{ color: 'var(--color-navy-muted)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 2rem auto', fontWeight: 600 }}>
            You practiced telling others what you need when you feel cold, thirsty, hungry, or need help from a trusted adult!
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn-secondary" onClick={() => { setScenarioIndex(0); setFeedback(null); setShowHint(false); }}>
              🔄 Practice Again
            </button>
            <button className="btn-secondary" onClick={onOpenBoard}>
              🧸 Open My Talking Board
            </button>
            <button className="btn-primary" onClick={onHome}>
              Return to Adventure Hub ➔
            </button>
          </div>
        </div>
      </ActivityShell>
    );
  }

  return (
    <ActivityShell
      title={current.title}
      moduleName="Helper Harbour (Functional Communication)"
      stepIndex={scenarioIndex + 1}
      totalSteps={WHAT_DO_I_NEED_SCENARIOS.length}
      pipState={pipState}
      pipMessage={pipMessage}
      onBack={onBack}
      onHome={onHome}
      onSpeakModel={onPlayAudio}
      modelText={feedback === 'correct' ? current.modelSentence : current.prompt}
      hint={showHint ? current.hint : null}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Situation Header */}
        <div style={{
          background: 'var(--bg-canvas)',
          border: '2px solid var(--border-soft)',
          borderRadius: '24px',
          padding: '2.2rem',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ fontSize: '4.5rem', marginBottom: '0.8rem' }}>{current.icon}</div>
          <span style={{
            fontSize: '0.85rem',
            fontWeight: 800,
            color: 'var(--color-teal)',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Situation {scenarioIndex + 1} of 7
          </span>
          <h3 style={{
            fontSize: '1.9rem',
            fontWeight: 900,
            color: 'var(--color-navy)',
            margin: '0.5rem 0'
          }}>
            {current.prompt}
          </h3>
          <p style={{ color: 'var(--color-navy-muted)', fontSize: '1.05rem', fontWeight: 600 }}>
            {current.situation}
          </p>
        </div>

        {/* 4 Picture + Label Choices */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '1.2rem'
        }}>
          {current.choices.map((c) => {
            const isSelected = selectedChoice?.label === c.label;
            const isCorrect = isSelected && feedback === 'correct';
            const isWrong = isSelected && feedback === 'retry';

            return (
              <button
                key={c.label}
                onClick={() => handleSelectChoice(c)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '1.8rem 1rem',
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
                  boxShadow: isWrong ? '0 0 0 4px var(--color-coral-border)' : 'var(--shadow-sm)',
                  transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                <span style={{ fontSize: '3.5rem' }}>{c.icon}</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 900, color: isWrong ? 'var(--color-coral-strong)' : 'var(--color-navy)' }}>
                  {c.label} {isWrong && '❌'} {isCorrect && '✅'}
                </span>
              </button>
            );
          })}
        </div>

        {/* 1. SUCCESS FEEDBACK */}
        {feedback === 'correct' && (
          <div className="feedback-alert success" style={{ width: '100%' }}>
            <span style={{ fontSize: '2.4rem' }}>🌟</span>
            <div>
              <h4 style={{ fontWeight: 900, fontSize: '1.2rem' }}>Spoken aloud with Pip:</h4>
              <p style={{ fontSize: '1.15rem', fontWeight: 700 }}>"{current.modelSentence}"</p>
            </div>
          </div>
        )}

        {/* 2. EXPLICIT INCORRECT FEEDBACK WITH RETRY & HINT */}
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
                  "{selectedChoice?.label}" is not what you need right now
                </h4>
                <p style={{ color: 'var(--color-navy)', fontWeight: 600, fontSize: '0.98rem' }}>
                  Think about what would solve this situation!
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
                <strong>Pip's Clue:</strong> {current.hint}
              </div>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <button className="btn-secondary" onClick={onOpenBoard}>
            🧸 Open Talking Board (Free AAC)
          </button>

          {feedback === 'correct' && (
            <button className="btn-primary" onClick={handleNext}>
              Next Situation ➔
            </button>
          )}
        </div>

      </div>
    </ActivityShell>
  );
}
