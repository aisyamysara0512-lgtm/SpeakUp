import React, { useState } from 'react';
import ActivityShell from '../components/ActivityShell';
import { STRUCTURED_SENTENCE_BANK } from '../data/curriculumData';
import { soundEngine } from '../utils/soundEngine';

/**
 * 4-Part Structured Sentence Formulation Activity:
 * WHO? + DOES WHAT? + WHAT? + WITH WHAT?
 * Allows the learner to formulate, listen, clear, and save sentences.
 */
export default function StructuredSentenceBuilder({
  onBack = () => {},
  onHome = () => {},
  onPlayAudio = () => {},
  onSaveSentence = () => {}
}) {
  const [selectedWho, setSelectedWho] = useState(null);
  const [selectedDoes, setSelectedDoes] = useState(null);
  const [selectedWhat, setSelectedWhat] = useState(null);
  const [selectedWith, setSelectedWith] = useState(null);
  const [savedList, setSavedList] = useState([]);
  const [pipMessage, setPipMessage] = useState("Pick a card from each column to build your story sentence! 🧩");
  const [pipState, setPipState] = useState("idle");

  const assembledTokens = [
    selectedWho?.label,
    selectedDoes?.label,
    selectedWhat?.label,
    selectedWith?.label
  ].filter(Boolean);

  const fullSentence = assembledTokens.length > 0 
    ? assembledTokens.join(' ') + '.' 
    : '';

  const handlePlay = () => {
    if (!fullSentence) return;
    onPlayAudio(fullSentence);
    setPipState('speaking');
    setPipMessage(`Pip is reading: "${fullSentence}"! 🗣️`);
  };

  const handleSave = () => {
    if (assembledTokens.length < 2) return;
    soundEngine.playTing();
    if (!savedList.includes(fullSentence)) {
      setSavedList([fullSentence, ...savedList]);
      onSaveSentence(fullSentence);
    }
    setPipState('celebrating');
    setPipMessage("Awesome sentence built! Saved to your practice book! ⭐");
  };

  const handleClear = () => {
    setSelectedWho(null);
    setSelectedDoes(null);
    setSelectedWhat(null);
    setSelectedWith(null);
    setPipState('idle');
    setPipMessage("Board cleared. Ready for a brand new sentence!");
  };

  return (
    <ActivityShell
      title="Build a 4-Part Sentence"
      moduleName="Sentence Treehouse"
      stepIndex={assembledTokens.length}
      totalSteps={4}
      pipState={pipState}
      pipMessage={pipMessage}
      onBack={onBack}
      onHome={onHome}
      onSpeakModel={onPlayAudio}
      modelText={fullSentence}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Assembled Sentence Stage */}
        <div style={{
          background: 'var(--bg-canvas)',
          border: '3px dashed var(--color-teal-border)',
          borderRadius: '28px',
          padding: '2rem',
          textAlign: 'center',
          minHeight: '120px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem'
        }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-navy-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Your Assembled Sentence
          </span>

          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {assembledTokens.length === 0 ? (
              <span style={{ color: 'var(--color-navy-light)', fontSize: '1.2rem', fontWeight: 700 }}>
                Tap cards below: Who? → Does what? → What? → With what?
              </span>
            ) : (
              assembledTokens.map((token, idx) => (
                <span 
                  key={idx}
                  style={{
                    background: 'var(--color-teal)',
                    color: '#fff',
                    padding: '0.6rem 1.4rem',
                    borderRadius: '9999px',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                    boxShadow: 'var(--shadow-teal)'
                  }}
                >
                  {token}
                </span>
              ))
            )}
          </div>

          {assembledTokens.length > 0 && (
            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
              <button className="btn-primary" onClick={handlePlay}>
                🔊 Read Aloud
              </button>
              <button className="btn-secondary" onClick={handleSave}>
                💾 Save Sentence (+3 ⭐)
              </button>
              <button className="btn-secondary" onClick={handleClear}>
                🗑️ Clear
              </button>
            </div>
          )}
        </div>

        {/* 4 Interactive Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '1.2rem'
        }}>
          {/* Column 1: WHO */}
          <div className="card-panel" style={{ background: 'var(--bg-card)', padding: '1.2rem', borderRadius: '20px', border: '1.5px solid var(--border-soft)' }}>
            <h4 style={{ color: 'var(--color-teal)', fontWeight: 900, marginBottom: '0.8rem', textAlign: 'center' }}>
              👤 1. Who?
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {STRUCTURED_SENTENCE_BANK.subjects.map(item => (
                <button
                  key={item.label}
                  onClick={() => setSelectedWho(item)}
                  style={{
                    padding: '0.7rem 0.9rem',
                    borderRadius: '14px',
                    border: selectedWho?.label === item.label ? '2px solid var(--color-teal)' : '1px solid var(--border-soft)',
                    background: selectedWho?.label === item.label ? 'var(--color-teal-light)' : 'var(--bg-canvas)',
                    color: 'var(--color-navy)',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <span>{item.icon}</span> <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: DOES WHAT */}
          <div className="card-panel" style={{ background: 'var(--bg-card)', padding: '1.2rem', borderRadius: '20px', border: '1.5px solid var(--border-soft)' }}>
            <h4 style={{ color: 'var(--color-coral-strong)', fontWeight: 900, marginBottom: '0.8rem', textAlign: 'center' }}>
              ⚡ 2. Doing?
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {STRUCTURED_SENTENCE_BANK.verbs.map(item => (
                <button
                  key={item.label}
                  onClick={() => setSelectedDoes(item)}
                  style={{
                    padding: '0.7rem 0.9rem',
                    borderRadius: '14px',
                    border: selectedDoes?.label === item.label ? '2px solid var(--color-coral)' : '1px solid var(--border-soft)',
                    background: selectedDoes?.label === item.label ? 'var(--color-coral-light)' : 'var(--bg-canvas)',
                    color: 'var(--color-navy)',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <span>{item.icon}</span> <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Column 3: WHAT */}
          <div className="card-panel" style={{ background: 'var(--bg-card)', padding: '1.2rem', borderRadius: '20px', border: '1.5px solid var(--border-soft)' }}>
            <h4 style={{ color: 'var(--color-yellow-deep)', fontWeight: 900, marginBottom: '0.8rem', textAlign: 'center' }}>
              🎯 3. What?
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {STRUCTURED_SENTENCE_BANK.objects.map(item => (
                <button
                  key={item.label}
                  onClick={() => setSelectedWhat(item)}
                  style={{
                    padding: '0.7rem 0.9rem',
                    borderRadius: '14px',
                    border: selectedWhat?.label === item.label ? '2px solid var(--color-yellow-strong)' : '1px solid var(--border-soft)',
                    background: selectedWhat?.label === item.label ? 'var(--color-yellow-light)' : 'var(--bg-canvas)',
                    color: 'var(--color-navy)',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <span>{item.icon}</span> <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Column 4: WITH WHAT */}
          <div className="card-panel" style={{ background: 'var(--bg-card)', padding: '1.2rem', borderRadius: '20px', border: '1.5px solid var(--border-soft)' }}>
            <h4 style={{ color: 'var(--color-green-hover)', fontWeight: 900, marginBottom: '0.8rem', textAlign: 'center' }}>
              🛠️ 4. With what?
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {STRUCTURED_SENTENCE_BANK.withWhat.map(item => (
                <button
                  key={item.label}
                  onClick={() => setSelectedWith(item)}
                  style={{
                    padding: '0.7rem 0.9rem',
                    borderRadius: '14px',
                    border: selectedWith?.label === item.label ? '2px solid var(--color-green)' : '1px solid var(--border-soft)',
                    background: selectedWith?.label === item.label ? 'var(--color-green-light)' : 'var(--bg-canvas)',
                    color: 'var(--color-navy)',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <span>{item.icon}</span> <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Saved Sentences Section */}
        {savedList.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <h4 style={{ fontWeight: 800, color: 'var(--color-navy)', marginBottom: '0.8rem' }}>
              📝 Sentences You Formulated Today:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {savedList.map((sent, i) => (
                <div 
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'var(--bg-canvas)',
                    padding: '0.8rem 1.4rem',
                    borderRadius: '16px',
                    border: '1.5px solid var(--border-soft)'
                  }}
                >
                  <span style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '1.05rem' }}>"{sent}"</span>
                  <button 
                    className="btn-secondary" 
                    onClick={() => onPlayAudio(sent)}
                    style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                  >
                    🔊 Play
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </ActivityShell>
  );
}
