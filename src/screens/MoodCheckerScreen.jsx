import React from 'react';
import PipCompanion from '../components/PipCompanion';

/**
 * Dedicated Mood Checker Screen (Step 2 of the student journey)
 * Meets Blueprint Section 4 & Appendix A:
 * - Student Profile -> Mood Checker Screen -> SpeakUp Home
 * - Accepts learner response and saves it to their profile practice history
 * - Includes a clear, kind "Skip for now" option to continue directly to Home
 */
export default function MoodCheckerScreen({
  student = null,
  onRecordMood = () => {},
  onSkip = () => {}
}) {
  const moods = [
    { id: 'happy', emoji: '😊', label: 'Happy', message: "Hooray! Pip is feeling happy and energized with you! 🌟" },
    { id: 'calm', emoji: '😌', label: 'Calm', message: "Peaceful and calm is a wonderful way to listen and learn. 🍃" },
    { id: 'excited', emoji: '🤩', label: 'Excited', message: "Pip can't wait to play speech adventures together today! 🦜" },
    { id: 'tired', emoji: '🥱', label: 'Tired', message: "That's okay. We will take slow, gentle steps today. 🛋️" },
    { id: 'frustrated', emoji: '😤', label: 'Frustrated', message: "Pip is right beside you. No rush, no pressure at all. 💛" }
  ];

  const handleSelect = (m) => {
    onRecordMood(`${m.emoji} ${m.label}`);
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '680px', textAlign: 'center', padding: '3.5rem 2.5rem' }}>
        
        {/* Pip Friendly Prompt */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <PipCompanion 
            size="md"
            state="idle"
            message={`Hi ${student?.nickname || 'friend'}! How are you feeling before we start today?`}
          />
        </div>

        <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.4rem' }}>🌈</span>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
          How are you feeling today?
        </h1>
        <p style={{ color: 'var(--color-navy-muted)', fontSize: '1.05rem', fontWeight: 600, maxWidth: '480px', margin: '0 auto 2.5rem auto' }}>
          Let Pip and your teacher know your energy before our speech practice. Every mood is welcome!
        </p>

        {/* Mood Selection Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1.1rem',
          flexWrap: 'wrap',
          marginBottom: '2.5rem'
        }}>
          {moods.map((m) => (
            <button
              key={m.id}
              onClick={() => handleSelect(m)}
              className="mood-btn"
              style={{
                flex: '1 1 100px',
                maxWidth: '120px',
                padding: '1.4rem 0.8rem',
                border: '2px solid var(--border-soft)',
                borderRadius: '24px',
                background: 'var(--bg-card)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <span className="emoji" style={{ fontSize: '2.8rem' }}>{m.emoji}</span>
              <span className="label" style={{ fontWeight: 800, marginTop: '0.4rem', color: 'var(--color-navy)' }}>{m.label}</span>
            </button>
          ))}
        </div>

        {/* Skip Action */}
        <div style={{ borderTop: '1.5px solid var(--border-soft)', paddingTop: '1.5rem' }}>
          <button 
            className="btn-secondary" 
            onClick={onSkip}
            style={{ padding: '0.8rem 2rem', fontSize: '0.95rem' }}
          >
            Skip for now & go to Home ➔
          </button>
        </div>

      </div>
    </div>
  );
}
