import React from 'react';
import { INITIAL_STUDENT_PROFILES } from '../data/appStore';

/**
 * Student Profile Selection Screen
 * Lets the learner or facilitator pick their profile card before moving to the Mood Checker.
 */
export default function StudentProfilePicker({
  onSelectStudent = () => {},
  onBackToRole = () => {}
}) {
  const students = Object.values(INITIAL_STUDENT_PROFILES);

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '880px', textAlign: 'center', padding: '3.5rem 2.5rem' }}>
        <button className="back-btn" onClick={onBackToRole}>
          ← Back to Role Choice
        </button>

        <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.5rem' }}>🦜</span>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
          Who is practicing today?
        </h1>
        <p style={{ color: 'var(--color-navy-muted)', fontSize: '1.1rem', maxWidth: '520px', margin: '0 auto 2.5rem auto', fontWeight: 600 }}>
          Choose your profile card to pick up your targets, stars, and adventure with Pip!
        </p>

        {/* Student Profile Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {students.map((st) => (
            <div
              key={st.id}
              onClick={() => onSelectStudent(st.id)}
              style={{
                background: 'var(--bg-card)',
                borderRadius: '28px',
                padding: '2rem 1.5rem',
                border: '2px solid var(--border-soft)',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = 'var(--color-teal)';
                e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-soft)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div style={{
                fontSize: '3.5rem',
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                background: 'var(--color-teal-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                border: '3px solid var(--color-teal-border)'
              }}>
                {st.avatar}
              </div>

              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-navy)', marginBottom: '0.3rem' }}>
                {st.nickname}
              </h3>
              <p style={{ color: 'var(--color-navy-muted)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.8rem' }}>
                {st.ageBand}
              </p>

              <div style={{
                background: 'var(--bg-canvas)',
                padding: '0.4rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 800,
                color: 'var(--color-teal)',
                border: '1px solid var(--border-soft)',
                marginBottom: '1.2rem'
              }}>
                🎯 {st.targetFocus}
              </div>

              <button className="btn-primary" style={{ width: '100%', padding: '0.7rem' }}>
                Start Practice ➔
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
