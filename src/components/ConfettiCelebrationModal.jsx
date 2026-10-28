import React, { useEffect } from 'react';
import PipCompanion from './PipCompanion';
import { soundEngine } from '../utils/soundEngine';

/**
 * ConfettiCelebrationModal
 * - Celebratory full-screen confetti animation
 * - Practice time tracking ("In the past 24 minutes...")
 * - Encouraging summary of completed tasks
 * - Celebratory audio fanfare chime
 * - Next step suggestion
 */
export default function ConfettiCelebrationModal({
  studentName = 'Learner',
  sessionMinutes = 15,
  tasksCount = 4,
  starsEarned = 15,
  onClose = () => {},
  onContinueAdventure = () => {}
}) {
  useEffect(() => {
    soundEngine.playChime('celebrate');
  }, []);

  // Generate 45 vibrant floating confetti ribbons using pure CSS
  const confettiPieces = Array.from({ length: 45 }).map((_, i) => {
    const colors = ['#0B847F', '#FFC83D', '#FF7A5C', '#1F78B4', '#4CB86A', '#B8A6E8'];
    const color = colors[i % colors.length];
    const left = Math.random() * 100;
    const animDelay = Math.random() * 1.5;
    const animDuration = 2.5 + Math.random() * 2;
    const size = 8 + Math.random() * 8;
    const isRound = i % 3 === 0;

    return (
      <span
        key={i}
        style={{
          position: 'absolute',
          top: '-20px',
          left: `${left}%`,
          width: `${size}px`,
          height: isRound ? `${size}px` : `${size * 2}px`,
          backgroundColor: color,
          borderRadius: isRound ? '50%' : '3px',
          opacity: 0.9,
          transform: `rotate(${Math.random() * 360}deg)`,
          animation: `confettiFall ${animDuration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${animDelay}s infinite`,
          pointerEvents: 'none',
          zIndex: 10001
        }}
      />
    );
  });

  return (
    <div className="lightbox" style={{ zIndex: 10000, overflow: 'hidden' }} onClick={onClose}>
      {/* 1. Confetti Rain Layer */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {confettiPieces}
      </div>

      {/* 2. Celebration Card */}
      <div 
        className="auth-card" 
        style={{
          maxWidth: '640px',
          textAlign: 'center',
          padding: '3rem 2.5rem',
          position: 'relative',
          border: '3px solid var(--color-yellow-border)',
          boxShadow: '0 20px 50px rgba(11, 132, 127, 0.25)',
          background: 'var(--bg-card)',
          zIndex: 10002
        }}
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            fontWeight: 900,
            color: 'var(--color-navy-muted)'
          }}
          title="Close celebration"
        >
          ✕
        </button>

        {/* Mascot & Crown */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <PipCompanion 
            size="lg"
            state="celebrating"
            message={`Incredible job, ${studentName}! You completed all your speech targets today! 🦜🎉`}
          />
        </div>

        <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.4rem' }}>🏆</span>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--color-navy)', margin: '0 0 0.5rem 0' }}>
          Practice Session Complete!
        </h1>
        <p style={{ color: 'var(--color-navy-muted)', fontSize: '1.05rem', fontWeight: 600, maxWidth: '480px', margin: '0 auto 1.8rem auto' }}>
          Consistent practice helps your speech confidence flourish every single day.
        </p>

        {/* Practice Time & Progress Record Card */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          background: 'var(--bg-canvas)',
          padding: '1.5rem 1rem',
          borderRadius: '24px',
          border: '1.5px solid var(--border-soft)',
          marginBottom: '2rem'
        }}>
          <div>
            <span style={{ fontSize: '2rem' }}>⏱️</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-navy)', marginTop: '0.2rem' }}>
              {sessionMinutes} mins
            </div>
            <small style={{ color: 'var(--color-navy-muted)', fontWeight: 700 }}>Practice Time</small>
          </div>

          <div>
            <span style={{ fontSize: '2rem' }}>🎯</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-teal)', marginTop: '0.2rem' }}>
              {tasksCount} Done
            </div>
            <small style={{ color: 'var(--color-navy-muted)', fontWeight: 700 }}>Tasks Finished</small>
          </div>

          <div>
            <span style={{ fontSize: '2rem' }}>⭐</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-yellow-deep)', marginTop: '0.2rem' }}>
              +{starsEarned}
            </div>
            <small style={{ color: 'var(--color-navy-muted)', fontWeight: 700 }}>Stars Earned</small>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            className="btn-primary" 
            onClick={onContinueAdventure}
            style={{ padding: '0.9rem 2.2rem', fontSize: '1.05rem' }}
          >
            Visit Pip's Sanctuary ➔
          </button>
          <button 
            className="btn-secondary" 
            onClick={onClose}
            style={{ padding: '0.9rem 1.8rem' }}
          >
            Back to Dashboard
          </button>
        </div>

      </div>

      {/* Confetti Keyframe Injection */}
      <style>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(105vh) rotate(720deg);
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
}
