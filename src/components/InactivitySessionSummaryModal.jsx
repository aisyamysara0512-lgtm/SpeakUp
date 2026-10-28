import React, { useEffect } from 'react';
import PipCompanion from './PipCompanion';
import { soundEngine } from '../utils/soundEngine';

/**
 * InactivitySessionSummaryModal
 * Automatically pops up when a learner has tried 2/3 modules or has been practicing and pauses.
 * Features:
 * - Festive floating confetti ribbons animation
 * - Animated checklist automatically ticking and crossing out completed tasks
 * - Practice time record and modules tried count
 * - "What to look forward to next time" teaser
 * - Warm Pip congratulatory encouragement
 */
export default function InactivitySessionSummaryModal({
  studentName = 'Champion',
  activeMinutes = 15,
  modulesTriedCount = 2,
  completedTasks = [
    { id: 't1', title: 'Connect the Sentence practice', completed: true },
    { id: 't2', title: 'Think & Discover clue exploration', completed: true },
    { id: 't3', title: 'Check in with daily mood', completed: true },
    { id: 't4', title: 'Sound Garden articulation', completed: false }
  ],
  nextUpcomingQuest = 'Whispering Woods: Sound Bubble Pop',
  starsEarned = 18,
  onClose = () => {},
  onContinuePracticing = () => {}
}) {
  useEffect(() => {
    soundEngine.playChime('celebrate');
  }, []);

  // Generate 40 vibrant floating confetti ribbons
  const confettiPieces = Array.from({ length: 40 }).map((_, i) => {
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
          opacity: 0.85,
          transform: `rotate(${Math.random() * 360}deg)`,
          animation: `confettiFall ${animDuration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${animDelay}s infinite`,
          pointerEvents: 'none',
          zIndex: 10001
        }}
      />
    );
  });

  const totalCompleted = completedTasks.filter(t => t.completed).length;

  return (
    <div className="lightbox" style={{ zIndex: 10000, overflow: 'hidden', animation: 'fadeIn 0.4s ease-out' }} onClick={onClose}>
      {/* 1. Confetti Rain Layer */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {confettiPieces}
      </div>

      <div 
        className="auth-card" 
        style={{
          maxWidth: '680px',
          width: '92%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '3rem 2.5rem',
          textAlign: 'center',
          position: 'relative',
          borderRadius: '32px',
          border: '3px solid var(--color-teal-border)',
          boxShadow: '0 25px 60px rgba(11, 132, 127, 0.3)',
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
          title="Close summary"
        >
          ✕
        </button>

        {/* Mascot & Header */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.8rem' }}>
          <PipCompanion 
            size="lg"
            state="celebrating"
            message={`You did wonderful today, ${studentName}! Look how much you explored! 🌟`}
          />
        </div>

        <span style={{
          display: 'inline-block',
          background: 'var(--color-yellow-light)',
          color: 'var(--color-yellow-deep)',
          padding: '0.35rem 1.3rem',
          borderRadius: '9999px',
          fontWeight: 800,
          fontSize: '0.85rem',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '0.6rem'
        }}>
          ✨ Learning Milestone Dashboard
        </span>

        <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--color-navy)', margin: '0 0 0.5rem 0' }}>
          Congratulations, {studentName}!
        </h1>
        <p style={{ color: 'var(--color-navy-muted)', fontSize: '1.05rem', fontWeight: 600, maxWidth: '540px', margin: '0 auto 1.8rem auto', lineHeight: 1.5 }}>
          You've tried <strong>{modulesTriedCount} learning modules</strong> and practiced attentively for <strong>{activeMinutes} minutes</strong> today. Look at your amazing progress!
        </p>

        {/* Practice Stats Pill Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1.2rem',
          flexWrap: 'wrap',
          marginBottom: '1.8rem'
        }}>
          <div style={{
            background: 'var(--color-teal-light)',
            border: '1.5px solid var(--color-teal-border)',
            padding: '0.6rem 1.4rem',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 800,
            color: 'var(--color-teal)'
          }}>
            <span>⏱️</span>
            <span>{activeMinutes} Min Active</span>
          </div>

          <div style={{
            background: 'var(--color-yellow-light)',
            border: '1.5px solid var(--color-yellow-border)',
            padding: '0.6rem 1.4rem',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 800,
            color: 'var(--color-yellow-deep)'
          }}>
            <span>⭐</span>
            <span>{starsEarned} Stars Earned</span>
          </div>

          <div style={{
            background: 'var(--color-green-light)',
            border: '1.5px solid var(--color-green-border)',
            padding: '0.6rem 1.4rem',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 800,
            color: 'var(--color-green-hover)'
          }}>
            <span>🎯</span>
            <span>{totalCompleted} Quests Completed</span>
          </div>
        </div>

        {/* Completed Tasks Checklist with Automatic Ticks & Strike-throughs */}
        <div style={{
          background: 'var(--bg-canvas)',
          borderRadius: '24px',
          padding: '1.6rem 1.8rem',
          border: '1.5px solid var(--border-soft)',
          marginBottom: '1.8rem',
          textAlign: 'left'
        }}>
          <h4 style={{
            fontSize: '1.05rem',
            fontWeight: 900,
            color: 'var(--color-navy)',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>📋</span> What you completed today:
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {completedTasks.map((task) => (
              <div 
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.9rem 1.2rem',
                  borderRadius: '16px',
                  background: task.completed ? 'var(--color-green-light)' : 'var(--bg-card)',
                  border: task.completed ? '1.5px solid var(--color-green-border)' : '1px solid var(--border-soft)',
                  opacity: task.completed ? 0.95 : 0.8
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: task.completed ? 'var(--color-green)' : 'var(--border-strong)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  flexShrink: 0
                }}>
                  {task.completed ? '✓' : '•'}
                </div>

                <span style={{
                  flex: 1,
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: task.completed ? 'var(--color-green-hover)' : 'var(--color-navy)',
                  textDecoration: task.completed ? 'line-through' : 'none'
                }}>
                  {task.title}
                </span>

                {task.completed ? (
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    color: 'var(--color-green-hover)',
                    background: '#fff',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '8px'
                  }}>
                    Done ✅
                  </span>
                ) : (
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: 'var(--color-navy-muted)',
                    background: 'var(--bg-canvas)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '8px'
                  }}>
                    Up next ✨
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* What to look forward to next time card */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-sky-light) 0%, var(--color-yellow-light) 100%)',
          borderRadius: '24px',
          padding: '1.4rem 1.8rem',
          border: '1.5px solid var(--color-sky-border)',
          marginBottom: '2rem',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          gap: '1.2rem'
        }}>
          <span style={{ fontSize: '3rem' }}>🧭</span>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--color-navy)', margin: '0 0 0.2rem 0' }}>
              Next Time You Return:
            </h4>
            <p style={{ color: 'var(--color-navy-muted)', fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>
              Look forward to continuing <strong>"{nextUpcomingQuest}"</strong> and unlocking new decorations for Pip's nest!
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            className="btn-primary" 
            onClick={onContinuePracticing}
            style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}
          >
            I'm Ready to Practice More! ➔
          </button>
          <button 
            className="btn-secondary" 
            onClick={onClose}
            style={{ padding: '0.9rem 1.8rem' }}
          >
            Rest for Now 🛋️
          </button>
        </div>

      </div>

      {/* Confetti Keyframe Animation */}
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
