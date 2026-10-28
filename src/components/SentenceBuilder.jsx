import React, { useState, useEffect } from 'react';
import './SentenceBuilder.css';

/**
 * SentenceBuilder – a lightweight, configurable activity.
 *
 * Props
 * -----
 *   sentenceConfig: {
 *     id: string,                    // unique identifier for the activity
 *     targetSequence: string[],      // ordered list of tile ids that form the correct sentence
 *     tiles: { id: string, label: string, img?: string }[] // pool of selectable tiles (text or picture)
 *   }
 *   onComplete: (reward: number) => void   // called when the sentence is assembled correctly
 */
export default function SentenceBuilder({ sentenceConfig, onComplete }) {
  const { targetSequence, tiles } = sentenceConfig;

  // ---- State ---------------------------------------------------------------
  // pool of tiles that are still available for selection
  const [availableTiles, setAvailableTiles] = useState(tiles);
  // ordered list of tiles the child has placed
  const [selectedTiles, setSelectedTiles] = useState([]);
  // UI feedback
  const [feedback, setFeedback] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  // ---- Helpers --------------------------------------------------------------
  const isCompleted = selectedTiles.map(t => t.id).join('') === targetSequence.join('');

  // Assemble the current sentence as a plain string for TTS
  const assembledSentence = selectedTiles.map(t => t.label).join(' ');

  // ---- Event Handlers -------------------------------------------------------
  const handleAddTile = tile => {
    setSelectedTiles(prev => [...prev, tile]);
    setAvailableTiles(prev => prev.filter(t => t.id !== tile.id));
    setFeedback('');
  };

  const handleRemoveTile = index => {
    const tile = selectedTiles[index];
    setAvailableTiles(prev => [...prev, tile]);
    setSelectedTiles(prev => prev.filter((_, i) => i !== index));
    setFeedback('');
  };

  const handleMoveTile = (index, direction) => {
    const newIdx = direction === 'left' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= selectedTiles.length) return;
    const newOrder = [...selectedTiles];
    [newOrder[index], newOrder[newIdx]] = [newOrder[newIdx], newOrder[index]];
    setSelectedTiles(newOrder);
  };

  const handlePlaySentence = () => {
    if (!('speechSynthesis' in window)) return;
    const utter = new SpeechSynthesisUtterance(assembledSentence);
    utter.lang = 'en-US';
    utter.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  const handleCheckCompletion = () => {
    if (isCompleted) {
      setFeedback('✅ Great job! Sentence complete.');
      // reward – you can decide how many stars to grant
      onComplete(5);
    } else {
      setFeedback('❌ That’s not the right order yet. Try again or tap the help button.');
    }
  };

  // ---- Gentle Help ----------------------------------------------------------
  // Show a short prompt after 10 seconds of inactivity
  useEffect(() => {
    if (selectedTiles.length === 0) return;
    const timer = setTimeout(() => setShowHelp(true), 10000);
    return () => clearTimeout(timer);
  }, [selectedTiles]);

  return (
    <div className="sentence-builder">
      <h2 className="sb-title">Build the sentence</h2>

      {/* Available tiles */}
      <div className="sb-tiles-pool">
        {availableTiles.map(tile => (
          <button
            key={tile.id}
            className="sb-tile btn-primary"
            onClick={() => handleAddTile(tile)}
          >
            {tile.img ? <img src={tile.img} alt={tile.label} /> : tile.label}
          </button>
        ))}
      </div>

      {/* Assembled sentence area */}
      <div className="sb-selected-area" aria-label="Assembled sentence">
        {selectedTiles.map((tile, idx) => (
          <div key={tile.id} className="sb-selected-tile">
            <span>{tile.img ? <img src={tile.img} alt={tile.label} /> : tile.label}</span>
            <div className="sb-tile-controls">
              <button onClick={() => handleMoveTile(idx, 'left')} title="Move left">←</button>
              <button onClick={() => handleMoveTile(idx, 'right')} title="Move right">→</button>
              <button onClick={() => handleRemoveTile(idx)} title="Remove">✕</button>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="sb-actions">
        <button className="btn-primary" onClick={handlePlaySentence}>🔊 Play Sentence</button>
        <button className="btn-secondary" onClick={handleCheckCompletion}>Check</button>
        {showHelp && (
          <button className="btn-help" onClick={() => setShowHelp(false)} title="Help">
            💡 Need help? Try arranging the tiles as: {targetSequence.join(' ')}
          </button>
        )}
      </div>

      {feedback && <p className="sb-feedback">{feedback}</p>}
    </div>
  );
}
