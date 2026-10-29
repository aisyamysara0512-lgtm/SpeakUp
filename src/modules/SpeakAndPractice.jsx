import React, { useState, useRef } from 'react';
import ActivityShell from '../components/ActivityShell';
import PipCompanion from '../components/PipCompanion';
import SharedVocabularyBanner from '../components/SharedVocabularyBanner';
import { SHARED_VOCABULARY_BRIDGE } from '../data/curriculumData';
import { soundEngine } from '../utils/soundEngine';

/**
 * Module Refinement: Speak & Practice Studio
 * Predictable, supportive sequence:
 * 1. Display the assigned word and a relevant picture
 * 2. Play the target word's audio model (with unlimited replays at normal & slow speeds)
 * 3. Optional progression from Individual Word -> Short Phrase -> Meaningful Sentence
 * 4. Allow self-paced practice (with or without microphone recording)
 * 5. Optional recording & replay with privacy safeguards (delete anytime)
 * 6. No automatic pronunciation scoring; never labels a child's speech "incorrect".
 */
export default function SpeakAndPractice({
  student = {},
  onBack = () => {},
  onHome = () => {},
  onPlayAudio = () => {},
  onSavePracticeObservation = () => {},
  sharedWordId = 'umbrella',
  onSelectSharedWord = () => {},
  onNavigateModule = () => {}
}) {
  // Practice target source: 'assigned' (from teacher) or 'shared' (from Shared Vocabulary Bridge)
  const [targetSource, setTargetSource] = useState('assigned');
  // Optional Progression Level: 'word' | 'phrase' | 'sentence'
  const [practiceLevel, setPracticeLevel] = useState('word');

  // Optional recording state
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [observedTranscript, setObservedTranscript] = useState('');
  const [practiceCompleted, setPracticeCompleted] = useState(false);
  const [hasListenedModel, setHasListenedModel] = useState(false);
  const [pipState, setPipState] = useState('idle');
  const [pipMessage, setPipMessage] = useState("Step 1: Listen to Pip say the word first! You can replay it as many times as you like. 🎧");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);

  const sharedEntry = SHARED_VOCABULARY_BRIDGE.find(w => w.id === sharedWordId) || SHARED_VOCABULARY_BRIDGE[0];

  const activeWord = targetSource === 'assigned'
    ? (student.assignedWord || 'Umbrella')
    : sharedEntry.word;

  const activeEmoji = targetSource === 'assigned'
    ? (student.assignedEmoji || '☂️')
    : sharedEntry.emoji;

  const activePhrase = targetSource === 'assigned'
    ? (student.assignedPhrase || `my ${activeWord.toLowerCase()}`)
    : sharedEntry.phrase;

  const activeSentence = targetSource === 'assigned'
    ? (student.assignedSentence || `I see ${activeWord.toLowerCase()}.`)
    : sharedEntry.modelSentence;

  const currentPracticeText = practiceLevel === 'word'
    ? activeWord
    : practiceLevel === 'phrase'
    ? activePhrase
    : activeSentence;

  const handlePlayModel = (rate = 0.9) => {
    soundEngine.playClick();
    setHasListenedModel(true);
    onPlayAudio(currentPracticeText, rate);
    setPipState('speaking');
    setPipMessage(`Playing model (${rate < 0.8 ? 'Slow & Clear' : 'Natural Pace'}): "${currentPracticeText}". Replay anytime or practice at your own pace! 🗣️`);
  };

  const startOptionalRecording = async () => {
    try {
      setPracticeCompleted(false);
      setObservedTranscript('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setPipState('listening');
      setPipMessage(`Pip is listening gently! Take your time and tap Stop when you are done. 👂`);

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        recognition.onresult = (event) => {
          const text = event.results[0][0].transcript;
          setObservedTranscript(text);
        };
        recognition.onerror = () => {
          // Never penalize or label a child's pronunciation incorrect if speech recognition fails!
        };
        recognition.start();
        recognitionRef.current = recognition;
      }
    } catch (err) {
      setPipState('idle');
      setPipMessage("Microphone is unavailable or turned off — and that's completely okay! You can practice aloud at your own pace without recording. 💛");
    }
  };

  const stopOptionalRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      soundEngine.playTing();
      setPipState('celebrating');
      setPipMessage("Recording finished! You can replay your voice, try again, delete it, or finish up! 🌟");
    }
  };

  const handleDeleteRecording = () => {
    soundEngine.playClick();
    if (audioURL) URL.revokeObjectURL(audioURL);
    setAudioURL(null);
    setObservedTranscript('');
    setPracticeCompleted(false);
    setPipState('idle');
    setPipMessage("Recording deleted for your privacy. You can listen to the audio model or practice anytime!");
  };

  const handleCompletePractice = (modeLabel) => {
    soundEngine.playTing();
    setPracticeCompleted(true);
    setPipState('celebrating');
    setPipMessage(`Wonderful effort practicing "${currentPracticeText}"! Saved to your practice log! ⭐`);
    onSavePracticeObservation({
      targetWord: currentPracticeText,
      level: practiceLevel,
      audioURL: audioURL || null,
      transcript: observedTranscript || modeLabel
    });
  };

  return (
    <ActivityShell
      title="🎙️ Speak & Practice Studio"
      moduleName="Speak & Practice (Audio Model & Self-Paced Practice)"
      stepIndex={practiceCompleted ? 4 : audioURL ? 3 : hasListenedModel ? 2 : 1}
      totalSteps={4}
      pipState={pipState}
      pipMessage={pipMessage}
      onBack={onBack}
      onHome={onHome}
      onSpeakModel={onPlayAudio}
      modelText={currentPracticeText}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>

        {/* Shared Vocabulary Bridge */}
        <SharedVocabularyBanner
          activeWordId={sharedWordId}
          currentModule="speak-practise"
          onSelectWord={(id) => {
            setTargetSource('shared');
            onSelectSharedWord(id);
          }}
          onNavigateModule={onNavigateModule}
          onPlayAudio={onPlayAudio}
        />

        {/* Source & Optional Progression Selector */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.8rem',
          background: 'var(--bg-canvas)',
          padding: '0.85rem 1.2rem',
          borderRadius: '18px',
          border: '1.5px solid var(--border-soft)'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 900, color: 'var(--color-navy-muted)' }}>Word Source:</span>
            <button
              onClick={() => { soundEngine.playClick(); setTargetSource('assigned'); }}
              style={{
                padding: '0.38rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                border: targetSource === 'assigned' ? '2px solid var(--color-teal)' : '1px solid var(--border-soft)',
                background: targetSource === 'assigned' ? 'var(--color-teal)' : '#fff',
                color: targetSource === 'assigned' ? '#fff' : 'var(--color-navy)'
              }}
            >
              🎯 Teacher Assigned ({student.assignedWord || 'Umbrella'})
            </button>
            <button
              onClick={() => { soundEngine.playClick(); setTargetSource('shared'); }}
              style={{
                padding: '0.38rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                border: targetSource === 'shared' ? '2px solid var(--color-teal)' : '1px solid var(--border-soft)',
                background: targetSource === 'shared' ? 'var(--color-teal)' : '#fff',
                color: targetSource === 'shared' ? '#fff' : 'var(--color-navy)'
              }}
            >
              🔗 Shared Bridge Word ({sharedEntry.word})
            </button>
          </div>

          {/* Optional Progression: Word -> Short Phrase -> Meaningful Sentence */}
          <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 900, color: 'var(--color-navy-muted)' }}>
              Optional Goal Level:
            </span>
            {[
              { id: 'word', label: '1. Single Word' },
              { id: 'phrase', label: '2. Short Phrase' },
              { id: 'sentence', label: '3. Full Sentence' }
            ].map(lvl => (
              <button
                key={lvl.id}
                onClick={() => {
                  soundEngine.playClick();
                  setPracticeLevel(lvl.id);
                }}
                style={{
                  padding: '0.36rem 0.8rem',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  border: practiceLevel === lvl.id ? '2px solid var(--color-coral)' : '1px solid var(--border-soft)',
                  background: practiceLevel === lvl.id ? 'var(--color-coral-light)' : '#fff',
                  color: 'var(--color-navy)'
                }}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>

        {/* ================================================================== */}
        {/* STEP 1 & 2: ASSIGNED WORD + PICTURE + AUDIO MODEL REPLAY           */}
        {/* ================================================================== */}
        <div style={{
          background: 'var(--bg-canvas)',
          border: '2px solid var(--border-soft)',
          borderRadius: '28px',
          padding: '2rem',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <span style={{
            background: 'var(--color-teal-light)',
            color: 'var(--color-teal-hover)',
            padding: '0.3rem 0.85rem',
            borderRadius: '9999px',
            fontWeight: 900,
            fontSize: '0.8rem',
            textTransform: 'uppercase'
          }}>
            Step 1 & 2: Look at the Picture & Listen to the Audio Model
          </span>

          <div style={{ fontSize: '4.6rem', margin: '0.8rem 0 0.4rem 0' }}>{activeEmoji}</div>

          <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--color-navy)', margin: '0.2rem 0' }}>
            {currentPracticeText}
          </h2>

          {practiceLevel !== 'word' && (
            <p style={{ color: 'var(--color-navy-muted)', fontWeight: 700, margin: '0.2rem 0 0 0' }}>
              Target Word: <strong>{activeWord}</strong>
            </p>
          )}

          {/* Audio Model Replay Controls */}
          <div style={{ display: 'flex', gap: '0.9rem', justifyContent: 'center', marginTop: '1.2rem', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              onClick={() => handlePlayModel(0.95)}
              style={{ padding: '0.8rem 1.5rem', fontSize: '1rem' }}
            >
              🔊 Listen to Audio Model (Replay Anytime)
            </button>
            <button
              className="btn-secondary"
              onClick={() => handlePlayModel(0.65)}
              style={{ padding: '0.8rem 1.5rem', fontSize: '1rem' }}
            >
              🐢 Listen Slow & Clear (0.65x)
            </button>
          </div>
        </div>

        {/* ================================================================== */}
        {/* STEP 3 & 4: SELF-PACED PRACTICE & OPTIONAL RECORDING               */}
        {/* ================================================================== */}
        <div style={{
          background: '#FFFFFF',
          border: '2px solid var(--border-soft)',
          borderRadius: '26px',
          padding: '1.8rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.1rem'
        }}>
          <span style={{
            background: 'var(--color-yellow-light)',
            color: 'var(--color-yellow-deep)',
            padding: '0.28rem 0.85rem',
            borderRadius: '9999px',
            fontWeight: 900,
            fontSize: '0.78rem',
            textTransform: 'uppercase'
          }}>
            Step 3: Practise at Your Own Pace (Recording Is Optional)
          </span>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
            {/* Option A: Self-Paced Practice Without Microphone */}
            <div style={{
              flex: '1 1 260px',
              background: 'var(--bg-canvas)',
              padding: '1.4rem',
              borderRadius: '20px',
              border: '1.5px solid var(--border-soft)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.4rem', marginBottom: '0.4rem' }}>🧘</div>
              <h4 style={{ margin: '0 0 0.35rem 0', color: 'var(--color-navy)', fontWeight: 900 }}>
                Listen & Practise Quietly or Aloud
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-navy-muted)', fontWeight: 600, marginBottom: '1rem' }}>
                You do not need to record to complete this step. Listen to the model and practise at your own comfortable pace.
              </p>
              <button
                className="btn-secondary"
                onClick={() => handleCompletePractice('Self-paced listening & practice (no recording)')}
                style={{ width: '100%', fontWeight: 900 }}
              >
                ✅ Finished Practising at My Pace (+3 ⭐)
              </button>
            </div>

            {/* Option B: Optional Voice Recording & Replay */}
            <div style={{
              flex: '1 1 260px',
              background: 'var(--bg-canvas)',
              padding: '1.4rem',
              borderRadius: '20px',
              border: '1.5px solid var(--border-soft)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div
                className={`mic-circle ${isRecording ? 'recording pulse' : ''}`}
                onClick={isRecording ? stopOptionalRecording : startOptionalRecording}
                style={{ width: '76px', height: '76px', fontSize: '2rem', marginBottom: '0.6rem', cursor: 'pointer' }}
              >
                <span>{isRecording ? '⏹' : '🎤'}</span>
              </div>
              <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--color-navy)', fontWeight: 900 }}>
                {isRecording ? 'Recording... Tap to Stop' : 'Optional: Record & Listen Back'}
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-navy-muted)', fontWeight: 600, margin: 0 }}>
                🔒 Private to this browser session. You can replay or delete your recording anytime.
              </p>
            </div>
          </div>

          {/* Recorded Audio Replay, Retry & Finish Controls */}
          {audioURL && !isRecording && (
            <div style={{
              width: '100%',
              background: 'var(--color-teal-light)',
              border: '2px solid var(--color-teal)',
              borderRadius: '20px',
              padding: '1.3rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.9rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
                <div>
                  <h4 style={{ margin: 0, color: 'var(--color-navy)', fontWeight: 900 }}>
                    🎧 Listen Back to Your Practice Attempt
                  </h4>
                  <small style={{ color: 'var(--color-navy-muted)', fontWeight: 700 }}>
                    Compare gently with Pip's model — no automatic pass/fail scoring is used.
                  </small>
                </div>
                <audio controls src={audioURL} style={{ height: '38px' }} />
              </div>

              <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
                <button
                  className="btn-secondary"
                  onClick={() => handlePlayModel(0.9)}
                  style={{ background: '#fff' }}
                >
                  🔊 Replay Pip's Model
                </button>
                <button
                  className="btn-secondary"
                  onClick={startOptionalRecording}
                  style={{ background: '#fff' }}
                >
                  🔄 Try Recording Again
                </button>
                <button
                  className="btn-secondary"
                  onClick={handleDeleteRecording}
                  style={{ background: '#FEE2E2', color: '#991B1B', borderColor: '#FCA5A5' }}
                >
                  🗑️ Delete Recording
                </button>
                {!practiceCompleted ? (
                  <button
                    className="btn-primary"
                    onClick={() => handleCompletePractice(observedTranscript || 'Recorded practice attempt')}
                  >
                    📤 Save Practice Note for Teacher (+3 ⭐)
                  </button>
                ) : (
                  <span className="status-badge success" style={{ alignSelf: 'center', padding: '0.5rem 1rem' }}>
                    ✅ Saved to Practice Observations!
                  </span>
                )}
              </div>
            </div>
          )}

          {practiceCompleted && !audioURL && (
            <div className="feedback-alert success" style={{ width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <div>
                <h4 style={{ fontWeight: 900 }}>Wonderful Self-Paced Practice! 🌟</h4>
                <p style={{ margin: 0, fontWeight: 700 }}>
                  You listened to and practised "{currentPracticeText}" at your own pace.
                </p>
              </div>
              <button className="btn-primary" onClick={onHome}>
                Finish & Return Home ➔
              </button>
            </div>
          )}
        </div>

      </div>
    </ActivityShell>
  );
}
