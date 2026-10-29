import React from 'react';
import { SHARED_VOCABULARY_BRIDGE } from '../data/curriculumData';
import { soundEngine } from '../utils/soundEngine';

/**
 * Shared Vocabulary Bridge Banner
 * Connects a target word (e.g., "umbrella", "water", "jacket", "ship", "broom")
 * across all 5 SpeakUp learning modules without forcing a mandatory sequence.
 */
export default function SharedVocabularyBanner({
  activeWordId = 'umbrella',
  currentModule = '',
  onSelectWord = () => {},
  onNavigateModule = () => {},
  onPlayAudio = () => {}
}) {
  const currentWord = SHARED_VOCABULARY_BRIDGE.find(w => w.id === activeWordId) || SHARED_VOCABULARY_BRIDGE[0];

  const moduleButtons = [
    { key: 'think-discover', label: 'Think & Discover', icon: '🔍', desc: 'WH Question' },
    { key: 'sound-garden', label: 'Sound Garden', icon: '🔤', desc: 'Spell & Pattern' },
    { key: 'speak-practise', label: 'Speak & Practice', icon: '🎙️', desc: 'Audio Model' },
    { key: 'sentence-treehouse', label: 'Sentence Treehouse', icon: '🌳', desc: 'Build Sentence' },
    { key: 'what-do-i-need', label: 'What Do I Need?', icon: '⛵', desc: 'AAC & Scenario' }
  ];

  return (
    <div style={{
      background: 'var(--bg-card, #FFFFFF)',
      border: '2px solid var(--color-teal-border, rgba(11, 132, 127, 0.25))',
      borderRadius: '22px',
      padding: '1rem 1.25rem',
      marginBottom: '1.25rem',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <span style={{
            background: 'var(--color-teal-light, #DDF3F1)',
            color: 'var(--color-teal-hover, #096B67)',
            fontWeight: 900,
            fontSize: '0.78rem',
            padding: '0.28rem 0.7rem',
            borderRadius: '9999px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            🔗 Shared Vocabulary Bridge
          </span>
          <span style={{ fontWeight: 800, color: 'var(--color-navy, #1B2F4E)', fontSize: '0.95rem' }}>
            Explore one word across modules (optional):
          </span>
        </div>

        {/* Word Switcher Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {SHARED_VOCABULARY_BRIDGE.map(item => {
            const isSelected = item.id === currentWord.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundEngine.playClick();
                  onSelectWord(item.id);
                }}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '9999px',
                  border: isSelected ? '2px solid var(--color-teal, #0B847F)' : '1.5px solid var(--border-soft, #E2E8F0)',
                  background: isSelected ? 'var(--color-teal, #0B847F)' : 'var(--bg-canvas, #F9F6F0)',
                  color: isSelected ? '#FFFFFF' : 'var(--color-navy, #1B2F4E)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <span>{item.emoji}</span>
                <span>{item.word}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Shared Word Info & Module Jump Links */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.8rem',
        background: 'var(--bg-canvas, #F9F6F0)',
        padding: '0.75rem 1rem',
        borderRadius: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '2.1rem' }}>{currentWord.emoji}</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <strong style={{ fontSize: '1.1rem', color: 'var(--color-navy, #1B2F4E)', fontWeight: 900 }}>
                {currentWord.word}
              </strong>
              <button
                onClick={() => onPlayAudio(`${currentWord.word}. ${currentWord.modelSentence}`)}
                style={{
                  background: 'var(--color-teal-light, #DDF3F1)',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '0.2rem 0.6rem',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  color: 'var(--color-teal-hover, #096B67)',
                  cursor: 'pointer'
                }}
              >
                🔊 "{currentWord.modelSentence}"
              </button>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-navy-muted, #55657E)', fontWeight: 600 }}>
              {currentWord.meaning}
            </div>
          </div>
        </div>

        {/* Cross-Module Reinforcement Links */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {moduleButtons.map(mod => {
            const isHere = currentModule === mod.key;
            return (
              <button
                key={mod.key}
                onClick={() => {
                  soundEngine.playClick();
                  onNavigateModule(mod.key, currentWord.id);
                }}
                style={{
                  padding: '0.38rem 0.7rem',
                  borderRadius: '12px',
                  border: isHere ? '2px solid var(--color-teal, #0B847F)' : '1px solid var(--border-soft, #CBD5E1)',
                  background: isHere ? 'var(--color-teal-light, #DDF3F1)' : '#FFFFFF',
                  color: 'var(--color-navy, #1B2F4E)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
                title={`Reinforce "${currentWord.word}" in ${mod.label} (${mod.desc})`}
              >
                <span>{mod.icon}</span>
                <span>{mod.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
