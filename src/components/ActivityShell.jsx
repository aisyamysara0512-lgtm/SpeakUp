import React from 'react';
import './ActivityShell.css';
import PipCompanion from './PipCompanion';

/**
 * Shared Activity Shell adhering to Blueprint Section 7:
 * - Consistent Top Bar: Back / Home control, Activity Title, Visual Progress indicator
 * - Pip / Friendly Mascot prompt with audio speech model
 * - Visual Context Area
 * - Standardized Feedback & Supportive Audio controls
 * - Predictable Return & Continue path
 */
export default function ActivityShell({
  title = "Learning Activity",
  moduleName = "SpeakUp Module",
  stepIndex = 1,
  totalSteps = 1,
  pipState = "idle",
  pipMessage = "Let's practice together!",
  onBack = () => {},
  onHome = () => {},
  onSpeakModel = null,
  modelText = "",
  hint = null,
  children
}) {
  const progressPercent = totalSteps > 0 ? Math.round((stepIndex / totalSteps) * 100) : 100;

  return (
    <div className="activity-shell-container">
      {/* 1. TOP HEADER & PROGRESS */}
      <header className="activity-shell-topbar">
        <div className="activity-nav-actions">
          <button className="shell-btn-back" onClick={onBack} title="Go back to previous screen">
            <span>←</span> Back
          </button>
          <button className="shell-btn-home" onClick={onHome} title="Return to SpeakUp Home">
            <span>🏡</span> Home
          </button>
        </div>

        <div className="activity-meta-center">
          <span className="activity-module-tag">{moduleName}</span>
          <h2 className="activity-title-text">{title}</h2>
        </div>

        <div className="activity-progress-col">
          <div className="activity-step-label">
            Step <strong>{stepIndex}</strong> of <strong>{totalSteps}</strong>
          </div>
          <div className="activity-progress-track">
            <div 
              className="activity-progress-fill" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* 2. PIP COMPANION BANNER & AUDIO PROMPT */}
      <section className="activity-pip-strip">
        <PipCompanion 
          size="md"
          state={pipState}
          message={pipMessage}
        />

        {onSpeakModel && modelText && (
          <div className="activity-model-audio-card">
            <button 
              className="shell-audio-btn"
              onClick={() => onSpeakModel(modelText, 0.9)}
              title="Hear the phrase spoken clearly"
            >
              <span>🔊</span> Hear Model Sentence
            </button>
            <button 
              className="shell-audio-btn slow"
              onClick={() => onSpeakModel(modelText, 0.65)}
              title="Hear articulated at slow speed"
            >
              <span>🐢</span> Slow (0.65x)
            </button>
          </div>
        )}
      </section>

      {/* 3. MAIN INTERACTIVE CONTENT */}
      <main className="activity-shell-body">
        {children}
      </main>

      {/* 4. OPTIONAL GENTLE HINT FOOTER */}
      {hint && (
        <footer className="activity-shell-hint">
          <span className="hint-bulb">💡</span>
          <span className="hint-text"><strong>Pip's Hint:</strong> {hint}</span>
        </footer>
      )}
    </div>
  );
}
