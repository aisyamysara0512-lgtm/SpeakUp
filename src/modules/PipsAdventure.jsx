import React, { useState } from 'react';
import PipCompanion from '../components/PipCompanion';
import { PIP_MINI_GAMES } from '../data/curriculumData';
import { soundEngine } from '../utils/soundEngine';

/**
 * Pip's Personalised Practice Adventure Screen
 * - Centers the child's assigned target sound/word
 * - Mini-games: Pip's Echo Canyon, Sound Bubble Pop, Treasure Nest
 * - Immediate celebratory feedback and stars
 */
export default function PipsAdventure({
  student = null,
  stars = 0,
  onBack = () => {},
  onHome = () => {},
  onGrantReward = () => {},
  onPlayAudio = () => {}
}) {
  const [activeGame, setActiveGame] = useState(null);
  const [echoStep, setEchoStep] = useState(0);
  const [echoScore, setEchoScore] = useState(0);
  const [pipMessage, setPipMessage] = useState(`Welcome to my Adventure Land, ${student?.nickname || 'friend'}! 🦜`);
  const [pipState, setPipState] = useState('idle');

  const targetWord = student?.assignedWord || 'Ball';
  const targetEmoji = student?.assignedEmoji || '🔴';

  // Mini-Game 1: Echo Canyon (Hear Pip, select feather that echoes)
  const echoRounds = [
    { target: targetWord, emoji: targetEmoji, distractors: ['Sun ☀️', 'Dog 🐶'] },
    { target: 'Star', emoji: '⭐', distractors: ['Cup ☕', 'Boat ⛵'] },
    { target: 'Apple', emoji: '🍎', distractors: ['Fan 🌬️', 'Tree 🌳'] }
  ];

  const handleEchoChoice = (choice) => {
    const isTarget = choice.includes(echoRounds[echoStep].target);
    if (isTarget) {
      soundEngine.playTing();
      setEchoScore(prev => prev + 1);
      setPipState('celebrating');
      setPipMessage("Echo matched perfectly! You have sharp ears! 🌟");
      onPlayAudio(echoRounds[echoStep].target);
      onGrantReward(2, "Echo matched!");
      if (echoStep + 1 < echoRounds.length) {
        setTimeout(() => {
          setEchoStep(prev => prev + 1);
          setPipState('idle');
          setPipMessage("Here comes the next echo clue!");
        }, 1200);
      } else {
        setTimeout(() => {
          setActiveGame('echo-complete');
          onGrantReward(5, "Echo Canyon Explored!");
        }, 1200);
      }
    } else {
      soundEngine.playError();
      setPipState('try-again');
      setPipMessage("Listen closely to Pip's echo and try the other feather! 💛");
    }
  };

  return (
    <div className="materials-view" style={{ maxWidth: '960px', margin: '0 auto' }}>
      
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-sky-light) 0%, var(--color-yellow-light) 60%, var(--color-peach-light) 100%)',
        borderRadius: '32px',
        padding: '2.5rem',
        border: '2px solid var(--border-soft)',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div>
          <button className="btn-back" onClick={onHome} style={{ marginBottom: '0.8rem' }}>
            ← Back to Adventure Hub
          </button>
          <span style={{
            fontSize: '0.85rem',
            fontWeight: 800,
            color: 'var(--color-teal)',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Pip's Story World
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--color-navy)', margin: '0.3rem 0' }}>
            Pip's Practice Adventure 🦜
          </h1>
          <p style={{ color: 'var(--color-navy-muted)', fontSize: '1.05rem', fontWeight: 600 }}>
            Personalised mini-games featuring your target: <strong>{targetWord} {targetEmoji}</strong>
          </p>
        </div>

        <PipCompanion 
          size="lg"
          state={pipState}
          message={pipMessage}
        />
      </div>

      {/* Main Content: Game Selector OR Active Mini-Game */}
      {!activeGame ? (
        <div>
          <div className="section-header">
            <h3>Choose a Mini-Game Adventure</h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2.5rem'
          }}>
            {PIP_MINI_GAMES.map(game => (
              <div
                key={game.id}
                onClick={() => {
                  setActiveGame(game.id);
                  setEchoStep(0);
                  setEchoScore(0);
                  setPipState('speaking');
                  setPipMessage(`Let's play ${game.title}! Ready?`);
                }}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '24px',
                  padding: '2rem',
                  border: '2px solid var(--border-soft)',
                  boxShadow: 'var(--shadow-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.8rem'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderColor = 'var(--color-teal)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border-soft)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div style={{ fontSize: '3.5rem' }}>{game.icon}</div>
                <h4 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-navy)' }}>
                  {game.title}
                </h4>
                <p style={{ color: 'var(--color-navy-muted)', fontSize: '0.95rem', fontWeight: 600, flex: 1 }}>
                  {game.desc}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <span style={{
                    background: 'var(--color-yellow-light)',
                    color: 'var(--color-yellow-deep)',
                    padding: '0.3rem 0.9rem',
                    borderRadius: '9999px',
                    fontWeight: 800,
                    fontSize: '0.85rem'
                  }}>
                    +{game.reward} ⭐ Bonus
                  </span>
                  <span style={{ color: 'var(--color-teal)', fontWeight: 800 }}>
                    Play Game →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeGame === 'game-mimic' ? (
        /* MINI GAME 1: ECHO CANYON */
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '32px',
          padding: '2.5rem',
          border: '2px solid var(--border-soft)',
          boxShadow: 'var(--shadow-md)',
          textAlign: 'center'
        }}>
          <button className="btn-back" onClick={() => setActiveGame(null)}>
            ← Back to Mini-Games
          </button>
          <span style={{
            fontSize: '0.85rem',
            fontWeight: 800,
            color: 'var(--color-teal)',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Echo Round {echoStep + 1} of 3
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-navy)', margin: '0.5rem 0 1.5rem 0' }}>
            Pip's Echo: Listen & Match
          </h2>

          <div style={{ marginBottom: '2rem' }}>
            <button 
              className="btn-primary"
              onClick={() => onPlayAudio(echoRounds[echoStep].target)}
              style={{ fontSize: '1.2rem', padding: '1.2rem 2.5rem' }}
            >
              🔊 Play Echo Sound
            </button>
          </div>

          <p style={{ color: 'var(--color-navy-muted)', fontWeight: 700, fontSize: '1.05rem', marginBottom: '1.5rem' }}>
            Which feather matches the word you heard?
          </p>

          <div style={{
            display: 'flex',
            gap: '1.2rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {[
              `${echoRounds[echoStep].target} ${echoRounds[echoStep].emoji}`,
              ...echoRounds[echoStep].distractors
            ].sort().map((choice, idx) => (
              <button
                key={idx}
                onClick={() => handleEchoChoice(choice)}
                style={{
                  padding: '1.5rem 2.2rem',
                  borderRadius: '24px',
                  border: '2px solid var(--border-soft)',
                  background: 'var(--bg-canvas)',
                  color: 'var(--color-navy)',
                  fontWeight: 900,
                  fontSize: '1.3rem',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                🪶 {choice}
              </button>
            ))}
          </div>
        </div>
      ) : activeGame === 'echo-complete' ? (
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '32px',
          padding: '3rem',
          textAlign: 'center',
          border: '2px solid var(--border-soft)'
        }}>
          <div style={{ fontSize: '4.5rem', marginBottom: '1rem' }}>🏆</div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--color-navy)' }}>
            Echo Canyon Mastered!
          </h2>
          <p style={{ color: 'var(--color-navy-muted)', fontSize: '1.1rem', margin: '0.8rem 0 2rem 0', fontWeight: 600 }}>
            You listened with great focus and matched all 3 speech sound echoes with Pip!
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn-secondary" onClick={() => setActiveGame('game-mimic')}>
              🔄 Play Again
            </button>
            <button className="btn-primary" onClick={() => setActiveGame(null)}>
              Return to Mini-Games ➔
            </button>
          </div>
        </div>
      ) : (
        /* Mini Game 2 or 3 fallback */
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '32px',
          padding: '3rem',
          textAlign: 'center',
          border: '2px solid var(--border-soft)'
        }}>
          <div style={{ fontSize: '4.5rem', marginBottom: '1rem' }}>🪴</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-navy)' }}>
            Pip's Sanctuary Game
          </h2>
          <p style={{ color: 'var(--color-navy-muted)', fontSize: '1.05rem', margin: '0.8rem 0 2rem 0', fontWeight: 600 }}>
            Every activity you complete in SpeakUp brings a new decorative branch to Pip's nest!
          </p>
          <button className="btn-primary" onClick={() => setActiveGame(null)}>
            Return to Mini-Games
          </button>
        </div>
      )}

    </div>
  );
}
