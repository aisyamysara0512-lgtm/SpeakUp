import React, { useState } from 'react';
import ActivityShell from '../components/ActivityShell';
import { TENSES_ADVENTURE_DATA } from '../data/curriculumData';
import { soundEngine } from '../utils/soundEngine';

/**
 * Tenses Adventure — Separate Additional Section in Sentence Treehouse
 * Does NOT replace Sentence Builder or Connect the Sentence.
 * Includes:
 * 1. The Time Tree: Yesterday, Today, Tomorrow
 * 2. Verb Adventures: Selecting verb forms using picture and time clues
 * 3. Story Sequencer: Ordering events and constructing sentences
 *    (e.g. Yesterday: Pip played. Today: Pip plays. Tomorrow: Pip will play.)
 * 4. Pause the Scene (Optional Extension): Present Continuous (e.g. "Pip is playing.")
 */
export default function TensesAdventure({
  onBack = () => {},
  onHome = () => {},
  onPlayAudio = () => {},
  onCompleteActivity = () => {}
}) {
  // Sub-activities: 'time-tree' | 'verb-adventures' | 'story-sequencer' | 'pause-scene'
  const [activeTab, setActiveTab] = useState('time-tree');
  const [pipState, setPipState] = useState('idle');
  const [pipMessage, setPipMessage] = useState('Welcome to Tenses Adventure! Explore how words travel through Yesterday, Today, and Tomorrow! ⏳');

  // 1. Time Tree state
  const [selectedBranchId, setSelectedBranchId] = useState('present');

  // 2. Verb Adventures state
  const [verbIdx, setVerbIdx] = useState(0);
  const [verbChoice, setVerbChoice] = useState(null);
  const [verbFeedback, setVerbFeedback] = useState(null);
  const [showVerbHint, setShowVerbHint] = useState(false);

  // 3. Story Sequencer state
  const [storyIdx, setStoryIdx] = useState(0);
  const [placedOrder, setPlacedOrder] = useState([]); // array of step objects placed by student
  const [sequenceComplete, setSequenceComplete] = useState(false);

  // 4. Pause the Scene (Present Continuous Optional Extension) state
  const [sceneIdx, setSceneIdx] = useState(0);
  const [sceneChoice, setSceneChoice] = useState(null);
  const [sceneFeedback, setSceneFeedback] = useState(null);

  const currentBranch = TENSES_ADVENTURE_DATA.timeTree.find(b => b.id === selectedBranchId) || TENSES_ADVENTURE_DATA.timeTree[1];
  const currentVerbItem = TENSES_ADVENTURE_DATA.verbAdventures[verbIdx % TENSES_ADVENTURE_DATA.verbAdventures.length];
  const currentStory = TENSES_ADVENTURE_DATA.storySequences[storyIdx % TENSES_ADVENTURE_DATA.storySequences.length];
  const currentScene = TENSES_ADVENTURE_DATA.pauseTheScene[sceneIdx % TENSES_ADVENTURE_DATA.pauseTheScene.length];

  // Shuffled cards for Story Sequencer (deterministic order: Tomorrow, Yesterday, Today so child orders them 1->2->3)
  const unplacedSteps = [currentStory.steps[2], currentStory.steps[0], currentStory.steps[1]].filter(
    st => !placedOrder.some(p => p.order === st.order)
  );

  const handleSelectVerbOption = (opt) => {
    setVerbChoice(opt);
    onPlayAudio(opt);
    if (opt === currentVerbItem.answer) {
      soundEngine.playTing();
      setVerbFeedback('correct');
      setShowVerbHint(false);
      setPipState('celebrating');
      setPipMessage(`Great time detective work! "${currentVerbItem.fullSentence}" 🌟`);
      setTimeout(() => onPlayAudio(currentVerbItem.fullSentence), 400);
      onCompleteActivity(3, 'Verb Adventure solved!');
    } else {
      soundEngine.playError();
      setVerbFeedback('retry');
      setPipState('try-again');
      setPipMessage(`Check the time clue "${currentVerbItem.timeClue}" and try again! 💛`);
    }
  };

  const handlePlaceStoryStep = (stepObj) => {
    const expectedOrder = placedOrder.length + 1;
    if (stepObj.order === expectedOrder) {
      soundEngine.playTing();
      const nextPlaced = [...placedOrder, stepObj];
      setPlacedOrder(nextPlaced);
      onPlayAudio(stepObj.sentence);
      if (nextPlaced.length === currentStory.steps.length) {
        setSequenceComplete(true);
        setPipState('celebrating');
        setPipMessage('Hooray! You sequenced Yesterday, Today, and Tomorrow in order! 🎉');
        onCompleteActivity(4, 'Story Sequencer completed!');
      } else {
        setPipState('speaking');
        setPipMessage(`Nice! "${stepObj.sentence}" is in place. What comes next?`);
      }
    } else {
      soundEngine.playError();
      setPipState('try-again');
      const neededName = expectedOrder === 1 ? 'Yesterday (First)' : expectedOrder === 2 ? 'Today (Second)' : 'Tomorrow (Third)';
      setPipMessage(`Let's put them in time order! Look for the card for ${neededName} first. 💡`);
    }
  };

  const handleSelectSceneOption = (opt) => {
    setSceneChoice(opt);
    onPlayAudio(opt);
    if (opt === currentScene.targetSentence) {
      soundEngine.playTing();
      setSceneFeedback('correct');
      setPipState('celebrating');
      setPipMessage(`Wonderful! "${currentScene.expandedSentence}" 🌟`);
      setTimeout(() => onPlayAudio(currentScene.expandedSentence), 450);
      onCompleteActivity(3, 'Pause the Scene described!');
    } else {
      soundEngine.playError();
      setSceneFeedback('retry');
      setPipState('try-again');
      setPipMessage(`Look closely at what is happening right now ("is + -ing") and try again! 💛`);
    }
  };

  return (
    <ActivityShell
      title="⏳ Tenses Adventure: Yesterday, Today & Tomorrow"
      moduleName="Sentence Treehouse"
      stepIndex={activeTab === 'time-tree' ? 1 : activeTab === 'verb-adventures' ? 2 : activeTab === 'story-sequencer' ? 3 : 4}
      totalSteps={4}
      pipState={pipState}
      pipMessage={pipMessage}
      onBack={onBack}
      onHome={onHome}
      onSpeakModel={onPlayAudio}
      modelText="Yesterday Pip played. Today Pip plays. Tomorrow Pip will play."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>

        {/* Top Activity Switcher */}
        <div style={{
          display: 'flex',
          gap: '0.6rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          borderBottom: '2px solid var(--border-soft)',
          paddingBottom: '1rem'
        }}>
          {[
            { id: 'time-tree', label: '🌳 1. The Time Tree', badge: 'Explore' },
            { id: 'verb-adventures', label: '⚡ 2. Verb Adventures', badge: 'Time Clues' },
            { id: 'story-sequencer', label: '🎬 3. Story Sequencer', badge: 'Order Events' },
            { id: 'pause-scene', label: '⏸️ 4. Pause the Scene (-ing)', badge: 'Optional Extension' }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab(tab.id);
                  setPipState('idle');
                }}
                style={{
                  padding: '0.65rem 1.15rem',
                  borderRadius: '9999px',
                  border: isActive ? '2px solid var(--color-teal)' : '1.5px solid var(--border-soft)',
                  background: isActive ? 'var(--color-teal)' : 'var(--bg-card)',
                  color: isActive ? '#FFFFFF' : 'var(--color-navy)',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem'
                }}
              >
                <span>{tab.label}</span>
                <span style={{
                  fontSize: '0.7rem',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '9999px',
                  background: isActive ? 'rgba(255,255,255,0.22)' : 'var(--bg-canvas)',
                  color: isActive ? '#fff' : 'var(--color-navy-muted)'
                }}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* ================================================================== */}
        {/* 1. THE TIME TREE: YESTERDAY, TODAY, TOMORROW                       */}
        {/* ================================================================== */}
        {activeTab === 'time-tree' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            <div style={{
              background: 'var(--bg-canvas)',
              borderRadius: '24px',
              padding: '1.5rem',
              border: '2px solid var(--border-soft)',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 0.4rem 0', color: 'var(--color-navy)', fontWeight: 900 }}>
                🌳 The Time Tree: How Actions Change Across Time
              </h3>
              <p style={{ margin: '0 0 1.2rem 0', color: 'var(--color-navy-muted)', fontWeight: 600 }}>
                Tap a branch on the Time Tree to hear how Pip talks about <strong>Yesterday</strong>, <strong>Today</strong>, and <strong>Tomorrow</strong>:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
                {TENSES_ADVENTURE_DATA.timeTree.map(branch => {
                  const isSelected = branch.id === selectedBranchId;
                  return (
                    <button
                      key={branch.id}
                      onClick={() => {
                        soundEngine.playClick();
                        setSelectedBranchId(branch.id);
                        onPlayAudio(`${branch.timeLabel}. ${branch.examples[0].sentence}`);
                      }}
                      style={{
                        padding: '1.3rem 1rem',
                        borderRadius: '20px',
                        border: isSelected ? '3px solid var(--color-teal)' : '1.5px solid var(--border-soft)',
                        background: isSelected ? 'var(--color-teal-light)' : '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <span style={{ fontSize: '2.6rem' }}>{branch.icon}</span>
                      <strong style={{ fontSize: '1.15rem', color: 'var(--color-navy)', fontWeight: 900 }}>
                        {branch.timeLabel}
                      </strong>
                      <span style={{
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        color: 'var(--color-teal-hover)',
                        background: '#fff',
                        padding: '0.2rem 0.65rem',
                        borderRadius: '9999px'
                      }}>
                        {branch.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Examples for the Selected Branch */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '1.5rem',
              border: '1.5px solid var(--border-soft)'
            }}>
              <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-navy)', fontWeight: 900 }}>
                {currentBranch.icon} Examples for {currentBranch.timeLabel}:
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.9rem' }}>
                {currentBranch.examples.map((ex, i) => (
                  <div
                    key={i}
                    onClick={() => onPlayAudio(ex.sentence)}
                    style={{
                      background: 'var(--bg-canvas)',
                      padding: '1rem 1.2rem',
                      borderRadius: '18px',
                      border: '1.5px solid var(--border-soft)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.8rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '2rem' }}>{ex.emoji}</span>
                      <div>
                        <div style={{ fontWeight: 800, color: 'var(--color-navy)', fontSize: '1rem' }}>
                          {ex.sentence}
                        </div>
                        <small style={{ color: 'var(--color-teal-hover)', fontWeight: 900 }}>
                          Action word: "{ex.highlight}"
                        </small>
                      </div>
                    </div>
                    <span style={{ fontSize: '1.2rem' }}>🔊</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* 2. VERB ADVENTURES: PICTURE & TIME CLUES                           */}
        {/* ================================================================== */}
        {activeTab === 'verb-adventures' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem', alignItems: 'center' }}>
            <div style={{
              background: 'var(--bg-canvas)',
              borderRadius: '24px',
              padding: '2rem',
              border: '2px solid var(--border-soft)',
              width: '100%',
              textAlign: 'center'
            }}>
              <span style={{
                background: 'var(--color-teal-light)',
                color: 'var(--color-teal-hover)',
                padding: '0.35rem 0.9rem',
                borderRadius: '9999px',
                fontWeight: 900,
                fontSize: '0.88rem'
              }}>
                {currentVerbItem.timeIcon} Time Clue: {currentVerbItem.timeClue}
              </span>
              <div style={{ fontSize: '4rem', margin: '0.8rem 0' }}>{currentVerbItem.sceneEmoji}</div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-navy)', margin: '0.5rem 0' }}>
                {verbFeedback === 'correct' ? currentVerbItem.fullSentence : currentVerbItem.prompt}
              </h3>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {currentVerbItem.options.map(opt => {
                const isSelected = verbChoice === opt;
                const isCorrect = isSelected && verbFeedback === 'correct';
                const isWrong = isSelected && verbFeedback === 'retry';
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelectVerbOption(opt)}
                    style={{
                      padding: '1rem 1.8rem',
                      borderRadius: '20px',
                      fontSize: '1.25rem',
                      fontWeight: 900,
                      cursor: 'pointer',
                      border: isCorrect ? '3px solid var(--color-green)' : isWrong ? '3px solid var(--color-coral)' : '2px solid var(--border-soft)',
                      background: isCorrect ? 'var(--color-green-light)' : isWrong ? 'var(--color-coral-light)' : '#FFFFFF',
                      color: 'var(--color-navy)'
                    }}
                  >
                    {opt} {isCorrect && '✅'} {isWrong && '❌'}
                  </button>
                );
              })}
            </div>

            {verbFeedback === 'correct' && (
              <div className="feedback-alert success" style={{ width: '100%', maxWidth: '620px', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontWeight: 900 }}>Awesome Verb Choice! 🌟</h4>
                  <p style={{ margin: 0, fontWeight: 700 }}>"{currentVerbItem.fullSentence}"</p>
                </div>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setVerbIdx(i => i + 1);
                    setVerbChoice(null);
                    setVerbFeedback(null);
                    setShowVerbHint(false);
                  }}
                >
                  Next Verb Clue ➔
                </button>
              </div>
            )}

            {verbFeedback === 'retry' && (
              <div style={{
                background: 'var(--color-coral-light)',
                border: '2px solid var(--color-coral)',
                borderRadius: '20px',
                padding: '1.2rem 1.5rem',
                width: '100%',
                maxWidth: '620px'
              }}>
                <p style={{ margin: '0 0 0.8rem 0', fontWeight: 800, color: 'var(--color-navy)' }}>
                  💡 <strong>Clue:</strong> {currentVerbItem.hint}
                </p>
                <button
                  className="btn-coral"
                  onClick={() => { setVerbChoice(null); setVerbFeedback(null); }}
                >
                  🔄 Try Again
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================================================================== */}
        {/* 3. STORY SEQUENCER: YESTERDAY, TODAY, TOMORROW                     */}
        {/* ================================================================== */}
        {activeTab === 'story-sequencer' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            <div style={{
              background: 'var(--bg-canvas)',
              padding: '1.4rem',
              borderRadius: '22px',
              border: '2px solid var(--border-soft)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <h3 style={{ margin: 0, color: 'var(--color-navy)', fontWeight: 900 }}>
                  🎬 {currentStory.title}
                </h3>
                <p style={{ margin: '0.25rem 0 0 0', color: 'var(--color-navy-muted)', fontWeight: 600 }}>
                  Tap the story cards in time order: <strong>1. Yesterday</strong> → <strong>2. Today</strong> → <strong>3. Tomorrow</strong>
                </p>
              </div>
              <button
                className="btn-secondary"
                onClick={() => {
                  setStoryIdx(i => i + 1);
                  setPlacedOrder([]);
                  setSequenceComplete(false);
                }}
              >
                🔄 Switch Story
              </button>
            </div>

            {/* Ordered Timeline Slots */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {[1, 2, 3].map(slotNum => {
                const placedItem = placedOrder.find(p => p.order === slotNum);
                const slotLabel = slotNum === 1 ? '1. Yesterday (Past)' : slotNum === 2 ? '2. Today (Present)' : '3. Tomorrow (Future)';
                return (
                  <div
                    key={slotNum}
                    style={{
                      minHeight: '150px',
                      borderRadius: '20px',
                      border: placedItem ? '2.5px solid var(--color-green)' : '2.5px dashed var(--border-strong)',
                      background: placedItem ? 'var(--color-green-light)' : '#FFFFFF',
                      padding: '1.2rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <span style={{ fontSize: '0.78rem', fontWeight: 900, color: 'var(--color-teal-hover)', textTransform: 'uppercase' }}>
                      {slotLabel}
                    </span>
                    {placedItem ? (
                      <>
                        <span style={{ fontSize: '2.5rem' }}>{placedItem.emoji}</span>
                        <strong style={{ fontSize: '1.1rem', color: 'var(--color-navy)' }}>{placedItem.sentence}</strong>
                        <small style={{ color: 'var(--color-navy-muted)', fontWeight: 600 }}>{placedItem.detail}</small>
                        <button
                          className="btn-secondary"
                          onClick={() => onPlayAudio(`${placedItem.sentence} ${placedItem.detail}`)}
                          style={{ marginTop: '0.3rem', padding: '0.25rem 0.7rem', fontSize: '0.78rem' }}
                        >
                          🔊 Listen
                        </button>
                      </>
                    ) : (
                      <span style={{ color: 'var(--color-navy-muted)', fontWeight: 700, fontSize: '0.9rem' }}>
                        Tap the card for Step {slotNum} below
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Unplaced Story Cards */}
            {unplacedSteps.length > 0 && (
              <div>
                <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--color-navy)', fontWeight: 900 }}>
                  🃏 Tap the next event in time order:
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  {unplacedSteps.map(st => (
                    <button
                      key={st.order}
                      onClick={() => handlePlaceStoryStep(st)}
                      style={{
                        padding: '1.2rem',
                        borderRadius: '20px',
                        border: '2px solid var(--border-soft)',
                        background: 'var(--bg-card)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.4rem',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      <span style={{ fontSize: '2.4rem' }}>{st.emoji}</span>
                      <strong style={{ fontSize: '1.08rem', color: 'var(--color-navy)' }}>{st.sentence}</strong>
                      <span style={{ fontSize: '0.84rem', color: 'var(--color-navy-muted)', fontWeight: 600 }}>{st.detail}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {sequenceComplete && (
              <div className="feedback-alert success" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <div>
                  <h4 style={{ fontWeight: 900 }}>Story Sequence Complete! 🌟</h4>
                  <p style={{ margin: 0, fontWeight: 700 }}>
                    Yesterday: Pip played. → Today: Pip plays. → Tomorrow: Pip will play.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button
                    className="btn-secondary"
                    onClick={() => onPlayAudio(currentStory.steps.map(s => s.sentence).join(' '))}
                  >
                    🔊 Hear Full Story
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => {
                      setPlacedOrder([]);
                      setSequenceComplete(false);
                    }}
                  >
                    🔄 Replay Sequence
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================== */}
        {/* 4. PAUSE THE SCENE (OPTIONAL EXTENSION: PRESENT CONTINUOUS)        */}
        {/* ================================================================== */}
        {activeTab === 'pause-scene' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            <div style={{
              background: 'var(--color-yellow-light, #FFFBEB)',
              border: '2px solid var(--color-yellow-border, #FDE68A)',
              borderRadius: '20px',
              padding: '1rem 1.3rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.6rem'
            }}>
              <div>
                <span style={{
                  background: '#FFFFFF',
                  color: 'var(--color-yellow-deep)',
                  fontWeight: 900,
                  fontSize: '0.76rem',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '9999px',
                  textTransform: 'uppercase'
                }}>
                  🌟 Optional Extension
                </span>
                <h4 style={{ margin: '0.35rem 0 0.1rem 0', color: 'var(--color-navy)', fontWeight: 900 }}>
                  ⏸️ Pause the Scene: Actions Happening Right Now ("is + -ing")
                </h4>
                <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-navy-muted)', fontWeight: 600 }}>
                  For learners ready to practice ongoing actions (e.g., <strong>"Pip is playing"</strong>).
                </p>
              </div>
            </div>

            <div style={{
              background: 'var(--bg-canvas)',
              borderRadius: '24px',
              padding: '2rem',
              border: '2px solid var(--border-soft)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '4.4rem', marginBottom: '0.6rem' }}>{currentScene.emoji}</div>
              <h3 style={{ fontSize: '1.65rem', fontWeight: 900, color: 'var(--color-navy)', margin: '0.4rem 0' }}>
                {currentScene.question}
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {currentScene.choices.map(ch => {
                const isSelected = sceneChoice === ch;
                const isCorrect = isSelected && sceneFeedback === 'correct';
                const isWrong = isSelected && sceneFeedback === 'retry';
                return (
                  <button
                    key={ch}
                    onClick={() => handleSelectSceneOption(ch)}
                    style={{
                      padding: '1.2rem',
                      borderRadius: '20px',
                      fontSize: '1.15rem',
                      fontWeight: 900,
                      cursor: 'pointer',
                      border: isCorrect ? '3px solid var(--color-green)' : isWrong ? '3px solid var(--color-coral)' : '2px solid var(--border-soft)',
                      background: isCorrect ? 'var(--color-green-light)' : isWrong ? 'var(--color-coral-light)' : '#FFFFFF',
                      color: 'var(--color-navy)'
                    }}
                  >
                    {ch} {isCorrect && '✅'} {isWrong && '❌'}
                  </button>
                );
              })}
            </div>

            {sceneFeedback === 'correct' && (
              <div className="feedback-alert success" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <div>
                  <h4 style={{ fontWeight: 900 }}>Scene Described! 🎉</h4>
                  <p style={{ margin: 0, fontWeight: 700 }}>"{currentScene.expandedSentence}"</p>
                </div>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setSceneIdx(i => i + 1);
                    setSceneChoice(null);
                    setSceneFeedback(null);
                  }}
                >
                  Next Scene ➔
                </button>
              </div>
            )}

            {sceneFeedback === 'retry' && (
              <div style={{
                background: 'var(--color-coral-light)',
                border: '2px solid var(--color-coral)',
                borderRadius: '18px',
                padding: '1rem 1.4rem'
              }}>
                <p style={{ margin: '0 0 0.6rem 0', fontWeight: 800, color: 'var(--color-navy)' }}>
                  💡 {currentScene.hint}
                </p>
                <button className="btn-coral" onClick={() => { setSceneChoice(null); setSceneFeedback(null); }}>
                  🔄 Try Again
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </ActivityShell>
  );
}
