import React, { useState, useEffect } from 'react';
import './PipCompanion.css';
import defaultAiPip from '../assets/pip-ai.png';
import { soundEngine } from '../utils/soundEngine';

/**
 * ============================================================================
 * PIP DEFAULT MESSAGES BY STATE
 * ----------------------------------------------------------------------------
 * These messages are automatically used when no explicit `message` prop is given.
 * You can edit, add, or customize these phrases anytime!
 * ============================================================================
 */
export const PIP_DEFAULT_MESSAGES = {
  idle: "Ready to try that word? 🦜",
  listening: "Let's listen together! 👂",
  speaking: "Listen closely: repeat after me! 🗣️",
  celebrating: "You kept trying, well done! 🎉",
  'try-again': "Let's practice one more time! 💛",
  resting: "Great job today! Time to rest. 🌙"
};

/**
 * ============================================================================
 * PIP THE PARROT COMPANION COMPONENT
 * ============================================================================
 * 
 * PROPS & HOW TO CUSTOMIZE:
 * - artwork: Image source (defaults to our custom AI Pip: `pip-ai.png`)
 * - state: 'idle' | 'listening' | 'speaking' | 'celebrating' | 'try-again' | 'resting'
 * - message: Explicit message string (overrides the automatic state message)
 * - size: 'sm' (64px) | 'md' (100px) | 'lg' (140px) | 'hero' (180px)
 * - vertical: Stacks the speech bubble vertically below Pip
 * - showBubble: Toggle speech bubble visibility (default: true)
 * - allowVoice: If true, tapping Pip speaks his message out loud
 * - onPipClick: Custom callback function when clicked
 */
export default function PipCompanion({
  artwork = defaultAiPip,
  state = 'idle',
  message = null,
  size = 'md',
  vertical = false,
  showBubble = true,
  allowVoice = true,
  onPipClick = null
}) {
  const [internalState, setInternalState] = useState(state);
  
  // Decide which message to display: explicit prop or automatic state message
  const getActiveMessage = (currentState, explicitMsg) => {
    if (explicitMsg !== null && explicitMsg !== undefined) {
      return explicitMsg;
    }
    return PIP_DEFAULT_MESSAGES[currentState] || PIP_DEFAULT_MESSAGES.idle;
  };

  const [currentMessage, setCurrentMessage] = useState(getActiveMessage(state, message));
  const [clickCount, setClickCount] = useState(0);

  // Sync internal state when parent component changes `state`
  useEffect(() => {
    setInternalState(state);
    setCurrentMessage(getActiveMessage(state, message));
  }, [state, message]);

  // Encouraging phrases Pip cycles through when clicked
  const tapQuotes = [
    "Ready to try that word? 🦜",
    "Let's listen together! 👂",
    "You kept trying, well done! 🎉",
    "Let's practice one more time! 💛",
    "I'm right here with you! Take your time. 🌟",
    "Every sound you make makes me proud! ❤️"
  ];

  const handleCompanionClick = () => {
    if (onPipClick) {
      onPipClick();
      return;
    }

    // Cycle to next quote on tap
    const nextIndex = (clickCount + 1) % tapQuotes.length;
    setClickCount(nextIndex);
    const tappedMessage = tapQuotes[nextIndex];
    setCurrentMessage(tappedMessage);

    // Briefly trigger speaking / bobbing animation
    setInternalState('speaking');
    setTimeout(() => {
      setInternalState(state);
    }, 1400);

    // Speak Pip's line using natural persona voice
    if (allowVoice) {
      soundEngine.speak(tappedMessage, 'pip');
    }
  };

  return (
    <div className={`pip-companion-container ${vertical ? 'vertical' : ''} pip-state-${internalState}`}>
      {/* Pip Avatar with Interactive Animation States */}
      <div 
        className={`pip-wrapper size-${size}`} 
        onClick={handleCompanionClick}
        title="Tap Pip to hear encouragement!"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCompanionClick(); }}
      >
        <div className="pip-glow" />
        
        {/* Pip's 3D AI Artwork */}
        <img 
          src={artwork} 
          alt="Pip the Baby Parrot Companion" 
          className="pip-image" 
        />

        {/* State-specific visual indicators */}
        {internalState === 'listening' && <div className="pip-sound-waves" />}
        {internalState === 'celebrating' && (
          <div className="pip-celebrate-sparkles">
            <span>✨</span><span>⭐</span><span>🎉</span>
          </div>
        )}
        {internalState === 'resting' && (
          <div className="pip-zzz">
            <span>Zzz</span>
          </div>
        )}

        <div className="pip-tap-hint">Tap me!</div>
      </div>

      {/* Pip's Interactive Speech Bubble */}
      {showBubble && currentMessage && (
        <div className="pip-speech-bubble" onClick={handleCompanionClick}>
          <div className="pip-bubble-title">
            <span>🦜</span> Pip says:
          </div>
          <p className="pip-bubble-text">{currentMessage}</p>
        </div>
      )}
    </div>
  );
}
