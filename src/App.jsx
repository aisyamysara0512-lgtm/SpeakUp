import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import heroImg from './assets/hero.png';
import PipCompanion from './components/PipCompanion';
import StudentAdventureDashboard from './components/StudentAdventureDashboard';
import LearningQuest from './components/LearningQuest';

// Store & Screens
import { loadAppState, saveAppState } from './data/appStore';
import StudentProfilePicker from './screens/StudentProfilePicker';
import MoodCheckerScreen from './screens/MoodCheckerScreen';

// Core 4 Learning Modules + Pip's Adventure
import ConnectTheSentence from './modules/ConnectTheSentence';
import StructuredSentenceBuilder from './modules/StructuredSentenceBuilder';
import ThinkAndDiscover from './modules/ThinkAndDiscover';
import SoundGarden from './modules/SoundGarden';
import WhatDoINeed from './modules/WhatDoINeed';
import PipsAdventure from './modules/PipsAdventure';
import { soundEngine } from './utils/soundEngine';
import ConfettiCelebrationModal from './components/ConfettiCelebrationModal';
import InactivitySessionSummaryModal from './components/InactivitySessionSummaryModal';

export default function App() {
  // App persistent state
  const [appState, setAppState] = useState(loadAppState);

  // Top level navigation state:
  // 'role-selection' | 'student-login' | 'teacher-login' | 'student-profile-picker' | 'mood-checker' | 'student-dashboard' | 'teacher-dashboard'
  const [currentView, setCurrentView] = useState('role-selection');
  const [selectedRole, setSelectedRole] = useState(null);

  // Active student ID & data
  const [activeStudentId, setActiveStudentId] = useState(appState.currentStudentId || 'kuhendra');
  const activeStudent = appState.students[activeStudentId] || appState.students.kuhendra;

  // Student feature navigation
  // 'home' | 'sentence-treehouse' | 'sentence-connect' | 'sentence-builder' | 'think-discover' | 'sound-garden' | 'speak-practise' | 'what-do-i-need' | 'pips-adventure' | 'aac-board' | 'lessons' | 'online-meeting' | 'daily-goals' | 'progress' | 'student-profile'
  const [activeStudentFeature, setActiveStudentFeature] = useState('home');

  // Teacher navigation & state
  const [activeTeacherFeature, setActiveTeacherFeature] = useState('students');
  const [selectedStudentForTeacher, setSelectedStudentForTeacher] = useState(null);
  const [teacherFeedbackInputs, setTeacherFeedbackInputs] = useState({});
  const [newAssignmentInput, setNewAssignmentInput] = useState('');
  const [showAssignSuccess, setShowAssignSuccess] = useState(false);

  // Auth mock state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [user, setUser] = useState(null);

  // Practice & recording state
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState(null);
  const recognitionRef = useRef(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Webcam state
  const [isCameraOn, setIsCameraOn] = useState(false);
  const studentVideoRef = useRef(null);
  const streamRef = useRef(null);

  // Reward banner popup
  const [rewardPopup, setRewardPopup] = useState(null);

  // Practice session time tracking & celebration
  const [sessionStartTime] = useState(Date.now());
  const [showCelebration, setShowCelebration] = useState(false);
  const [completedActivitiesCount, setCompletedActivitiesCount] = useState(0);

  // Distinct learning modules explored during this session
  // e.g. ['sentence-connect', 'think-discover', 'what-do-i-need']
  const [modulesTried, setModulesTried] = useState([]);
  const lastCelebratedMilestoneRef = useRef(0);

  // Inactivity Detection: triggers congratulatory summary when student is idle
  const [showInactivitySummary, setShowInactivitySummary] = useState(false);
  const lastActivityTimeRef = useRef(Date.now());
  const hasTriggeredInactivityRef = useRef(false);

  // Save changes to localStorage whenever appState updates
  useEffect(() => {
    saveAppState(appState);
  }, [appState]);

  // Clean camera on unmount or navigation away from meeting
  useEffect(() => {
    if (activeStudentFeature !== 'online-meeting') {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        setIsCameraOn(false);
      }
    }
  }, [activeStudentFeature]);

  // Global button & interactive element click sound listener:
  // Adds a crisp, subtle UI tap/pop noise whenever clicking buttons, cards, or pills
  useEffect(() => {
    const handleGlobalClick = (e) => {
      const target = e.target.closest('button, [role="button"], .t-card, .aac-button, .choice-card, .role-card, .btn-primary, .btn-secondary, .icon-btn-round');
      if (target) {
        soundEngine.playClick();
      }
    };

    window.addEventListener('click', handleGlobalClick, true);
    return () => window.removeEventListener('click', handleGlobalClick, true);
  }, []);

  // Strict 7-Minute practice session milestone requirement (7 * 60 * 1000 ms)
  const MIN_SESSION_DURATION_MS = 7 * 60 * 1000;

  // Inactivity detection listener:
  // Listens to user interactions (clicks, touches, keypresses) to update lastActivityTime.
  // Triggers the celebratory summary ONLY after 7 full minutes of practice and a 3-minute pause!
  useEffect(() => {
    const handleUserInteraction = () => {
      lastActivityTimeRef.current = Date.now();
    };

    window.addEventListener('pointerdown', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);

    const idleInterval = setInterval(() => {
      if (hasTriggeredInactivityRef.current || currentView !== 'student-dashboard') return;

      const idleDuration = Date.now() - lastActivityTimeRef.current;
      const elapsedSessionMs = Date.now() - sessionStartTime;

      // STRICT RULE: Must be at least 7 minutes of practice session + 3 minutes of idle pause
      const hasPracticed7Minutes = elapsedSessionMs >= MIN_SESSION_DURATION_MS;
      const hasSufficientProgress = modulesTried.length >= 2 || completedActivitiesCount >= 3;
      const idleThreshold = 180000; // 3 minutes pause

      if (hasPracticed7Minutes && hasSufficientProgress && idleDuration >= idleThreshold) {
        hasTriggeredInactivityRef.current = true;
        setShowInactivitySummary(true);
      }
    }, 10000); // Check every 10 seconds

    return () => {
      window.removeEventListener('pointerdown', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      clearInterval(idleInterval);
    };
  }, [currentView, modulesTried.length, completedActivitiesCount, sessionStartTime]);

  // Practice Milestone Monitor: checks when the student reaches 7 minutes of practice
  useEffect(() => {
    const milestoneInterval = setInterval(() => {
      if (lastCelebratedMilestoneRef.current || currentView !== 'student-dashboard') return;
      const elapsedSessionMs = Date.now() - sessionStartTime;
      if (elapsedSessionMs >= MIN_SESSION_DURATION_MS && (modulesTried.length >= 2 || completedActivitiesCount >= 3)) {
        lastCelebratedMilestoneRef.current = true;
        setShowInactivitySummary(true);
      }
    }, 15000);

    return () => clearInterval(milestoneInterval);
  }, [currentView, modulesTried.length, completedActivitiesCount, sessionStartTime]);

  // Audio speech synthesis helper using the natural soundEngine
  const speakText = (text, personaOrRate = 'teacher') => {
    soundEngine.speak(text, personaOrRate);
  };

  // Base reward granting (plays chime, awards stars, shows toast without modal interruptions)
  const grantReward = (amount, message) => {
    soundEngine.playChime('success');
    setAppState(prev => {
      const student = prev.students[activeStudentId] || prev.students.kuhendra;
      const updated = {
        ...prev,
        students: {
          ...prev.students,
          [activeStudentId]: {
            ...student,
            stars: (student.stars || 0) + amount
          }
        }
      };
      return updated;
    });

    setRewardPopup(`+${amount} ⭐ ${message}`);
    setTimeout(() => setRewardPopup(null), 2500);

    setCompletedActivitiesCount(prev => prev + 1);
  };

  // Record an activity completion in a specific module.
  // The celebratory dashboard pops up ONLY after 7 full minutes of practice and 2/3 modules tried!
  const recordModuleActivity = (moduleId, amount = 2, message = 'Great job!') => {
    grantReward(amount, message);

    setModulesTried(prev => {
      const updated = prev.includes(moduleId) ? prev : [...prev, moduleId];
      const distinctCount = updated.length;
      const elapsedSessionMs = Date.now() - sessionStartTime;

      // STRICT 7-MINUTE RULE:
      // Must have practiced for at least 7 minutes (420,000ms) before popping up!
      if (
        elapsedSessionMs >= MIN_SESSION_DURATION_MS &&
        distinctCount >= 2 &&
        !lastCelebratedMilestoneRef.current
      ) {
        lastCelebratedMilestoneRef.current = true;
        setTimeout(() => {
          setShowInactivitySummary(true);
        }, 1200);
      }

      return updated;
    });
  };

  // --------------------------------------------------------------------------
  // AUTH & ENTRY FLOW
  // --------------------------------------------------------------------------
  const handleAuth = (e) => {
    e.preventDefault();
    setUser({ email });
    if (selectedRole === 'student') {
      setCurrentView('student-profile-picker');
    } else {
      setCurrentView('teacher-dashboard');
    }
  };

  const bypassLogin = () => {
    setUser({ email: selectedRole === 'student' ? 'student@speakup.com' : 'teacher@speakup.com' });
    if (selectedRole === 'student') {
      setCurrentView('student-profile-picker');
    } else {
      setCurrentView('teacher-dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('role-selection');
    setSelectedRole(null);
  };

  // --------------------------------------------------------------------------
  // WEBCAM MEETING
  // --------------------------------------------------------------------------
  const toggleCamera = async () => {
    if (isCameraOn) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (studentVideoRef.current) studentVideoRef.current.srcObject = null;
      setIsCameraOn(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (studentVideoRef.current) studentVideoRef.current.srcObject = stream;
        setIsCameraOn(true);
      } catch (err) {
        alert("Camera access denied or unavailable.");
      }
    }
  };

  // --------------------------------------------------------------------------
  // AUDIO RECORDING (SPEAK & PRACTISE)
  // --------------------------------------------------------------------------
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsSubmitted(false);
      setTranscript('');
      setFeedback(null);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
      };

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.onresult = (event) => {
          const spokenText = event.results[0][0].transcript.replace(/[.,]/g, '');
          setTranscript(spokenText);
          const target = activeStudent?.assignedWord || 'Ball';
          if (spokenText.toLowerCase().includes(target.toLowerCase())) {
            setFeedback('success');
            grantReward(5, "Speech practice step complete!");
          } else {
            setFeedback('try-again');
            grantReward(1, "Gentle practice step recorded!");
          }
        };
        recognitionRef.current = recognition;
        recognition.start();
      }

      mediaRecorder.start();
      setIsRecording(true);
    } catch (e) {
      alert("Microphone access denied or unavailable.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (recognitionRef.current) recognitionRef.current.stop();
  };

  const submitToTeacher = () => {
    const newRecording = {
      id: Date.now(),
      studentId: activeStudentId,
      studentName: activeStudent.name,
      targetWord: activeStudent.assignedWord,
      transcript,
      feedback,
      audioURL,
      date: new Date().toLocaleDateString()
    };
    setAppState(prev => ({
      ...prev,
      audioRecordings: [newRecording, ...(prev.audioRecordings || [])]
    }));
    setIsSubmitted(true);
    recordModuleActivity('speak-practise', 3, "Practice sent to teacher!");
  };

  // --------------------------------------------------------------------------
  // SCREENS RENDERING
  // --------------------------------------------------------------------------

  // 1. Role Selection
  const renderRoleSelection = () => (
    <div className="auth-container">
      <div className="auth-card role-selection">
        <h1 className="logo-text">🦜 SpeakUp</h1>
        <p className="description">
          A personalised, gamified speech & language practice adventure guided by Pip the parrot.
        </p>
        <div className="role-cards">
          <div 
            className="role-card" 
            style={{ borderColor: 'var(--color-yellow-border)', background: 'var(--bg-card)' }}
            onClick={() => { setSelectedRole('student'); setCurrentView('student-profile-picker'); }}
          >
            <div className="role-icon">👧👦</div>
            <h2>I am a Student</h2>
            <p>Practice sounds, build sentences, and explore with Pip!</p>
          </div>
          <div 
            className="role-card" 
            style={{ borderColor: 'var(--color-teal-border)', background: 'var(--bg-card)' }}
            onClick={() => { setSelectedRole('teacher'); setCurrentView('teacher-login'); }}
          >
            <div className="role-icon">👩‍🏫</div>
            <h2>I am a Teacher / SLP</h2>
            <p>Manage student targets, review recordings, and assign lesson plans.</p>
          </div>
        </div>
      </div>
    </div>
  );

  // 2. Login Screen
  const renderLogin = () => (
    <div className="auth-container">
      <div className="auth-card login-form">
        <div className="back-btn" onClick={() => setCurrentView('role-selection')}>← Back</div>
        <div className="profile-icon">👤</div>
        <h2>{selectedRole === 'student' ? 'Student Sign In' : 'Teacher / SLP Portal'}</h2>
        <form onSubmit={handleAuth}>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@speakup.com" required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn-primary full-width">
            Sign In ➔
          </button>
        </form>
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button type="button" onClick={bypassLogin} style={{ background: 'none', border: 'none', color: 'var(--color-teal)', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}>
            Quick Demo Entry (Bypass) ➔
          </button>
        </div>
      </div>
    </div>
  );

  // 3. Student Dashboard
  const renderStudentDashboard = () => (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span>🦜</span> SpeakUp
        </div>

        <div className="sidebar-stats" onClick={() => setActiveStudentFeature('progress')} title="Your earned Stars and gentle Streak">
          <div className="s-stat">⭐ <strong>{activeStudent.stars || 18}</strong></div>
          <div className="s-stat">🔥 <strong>{activeStudent.streak || 3}</strong></div>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-heading">MENU</p>
          <ul>
            <li className={activeStudentFeature === 'home' ? 'active' : ''} onClick={() => setActiveStudentFeature('home')}>
              <span>🏡</span> Adventure Hub
            </li>
            <li className={activeStudentFeature === 'pips-adventure' ? 'active' : ''} onClick={() => setActiveStudentFeature('pips-adventure')}>
              <span>🦜</span> Pip's Adventure
            </li>
          </ul>

          <p className="nav-heading">CORE LEARNING PATH</p>
          <ul>
            <li className={activeStudentFeature === 'sentence-treehouse' || activeStudentFeature === 'sentence-connect' || activeStudentFeature === 'sentence-builder' ? 'active' : ''} onClick={() => setActiveStudentFeature('sentence-treehouse')}>
              <span>🌳</span> Sentence Treehouse
            </li>
            <li className={activeStudentFeature === 'think-discover' ? 'active' : ''} onClick={() => setActiveStudentFeature('think-discover')}>
              <span>🔍</span> Think & Discover
            </li>
            <li className={activeStudentFeature === 'sound-garden' ? 'active' : ''} onClick={() => setActiveStudentFeature('sound-garden')}>
              <span>🔤</span> Sound Garden
            </li>
            <li className={activeStudentFeature === 'speak-practise' ? 'active' : ''} onClick={() => setActiveStudentFeature('speak-practise')}>
              <span>🎙️</span> Speak & Practise
            </li>
            <li className={activeStudentFeature === 'what-do-i-need' ? 'active' : ''} onClick={() => setActiveStudentFeature('what-do-i-need')}>
              <span>⛵</span> What Do I Need? (AAC)
            </li>
          </ul>

          <p className="nav-heading">SUPPORT & TOOLS</p>
          <ul>
            <li className={activeStudentFeature === 'aac-board' ? 'active' : ''} onClick={() => setActiveStudentFeature('aac-board')}>
              <span>🧸</span> My Talking Board
            </li>
            <li className={activeStudentFeature === 'lessons' ? 'active' : ''} onClick={() => setActiveStudentFeature('lessons')}>
              <span>📅</span> Lesson Plans
            </li>
            <li className={activeStudentFeature === 'online-meeting' ? 'active' : ''} onClick={() => setActiveStudentFeature('online-meeting')}>
              <span>🎥</span> Live Teletherapy
            </li>
            <li className={activeStudentFeature === 'progress' ? 'active' : ''} onClick={() => setActiveStudentFeature('progress')}>
              <span>📈</span> My Growth & Badges
            </li>
            <li className={activeStudentFeature === 'student-profile' ? 'active' : ''} onClick={() => setActiveStudentFeature('student-profile')}>
              <span>🌸</span> Learner Profile
            </li>
            <li onClick={() => setCurrentView('student-profile-picker')}>
              <span>🔄</span> Switch Student
            </li>
            <li onClick={handleLogout}>
              <span>🚪</span> Log Out
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {activeStudentFeature === 'home' && (
          <StudentAdventureDashboard 
            user={{ email: activeStudent.name }}
            stars={activeStudent.stars || 18}
            onNavigate={(f) => {
              if (f === 'record-play') setActiveStudentFeature('speak-practise');
              else if (f === 'learning-materials') setActiveStudentFeature('sound-garden');
              else if (f === 'vocabulary') setActiveStudentFeature('think-discover');
              else setActiveStudentFeature(f);
            }}
            onStartQuest={() => setActiveStudentFeature('pips-adventure')}
            onOpenSettings={() => setActiveStudentFeature('student-profile')}
            onTriggerCelebration={() => setShowInactivitySummary(true)}
          />
        )}

        {/* 1. Sentence Treehouse Hub */}
        {activeStudentFeature === 'sentence-treehouse' && (
          <div className="materials-view">
            <div className="materials-header">
              <h2>🌳 Sentence Treehouse</h2>
              <p>Formulate sentences and connect your thoughts with structured visual cards.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              <div 
                className="t-card" 
                onClick={() => setActiveStudentFeature('sentence-connect')}
                style={{ textAlign: 'left', padding: '2.5rem' }}
              >
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔗</div>
                <h3>Connect the Sentence</h3>
                <p style={{ margin: '0.5rem 0 1.5rem 0' }}>
                  Practice target words: <strong>to</strong> (purpose), <strong>when</strong> (time), and <strong>because</strong> (reason).
                </p>
                <button className="btn-primary" style={{ width: '100%' }}>Play 9 Scenarios ➔</button>
              </div>

              <div 
                className="t-card" 
                onClick={() => setActiveStudentFeature('sentence-builder')}
                style={{ textAlign: 'left', padding: '2.5rem' }}
              >
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🧩</div>
                <h3>4-Part Sentence Builder</h3>
                <p style={{ margin: '0.5rem 0 1.5rem 0' }}>
                  Build sentences with <strong>Who?</strong> + <strong>Doing?</strong> + <strong>What?</strong> + <strong>With what?</strong>
                </p>
                <button className="btn-primary" style={{ width: '100%' }}>Build Sentences ➔</button>
              </div>
            </div>
          </div>
        )}

        {activeStudentFeature === 'sentence-connect' && (
          <ConnectTheSentence 
            onBack={() => setActiveStudentFeature('sentence-treehouse')}
            onHome={() => setActiveStudentFeature('home')}
            onCompleteItem={(pts, msg) => recordModuleActivity('sentence-connect', pts, msg)}
            onPlayAudio={speakText}
          />
        )}

        {activeStudentFeature === 'sentence-builder' && (
          <StructuredSentenceBuilder 
            onBack={() => setActiveStudentFeature('sentence-treehouse')}
            onHome={() => setActiveStudentFeature('home')}
            onPlayAudio={speakText}
            onSaveSentence={(s) => recordModuleActivity('sentence-builder', 3, 'Sentence saved!')}
          />
        )}

        {/* 2. Think & Discover */}
        {activeStudentFeature === 'think-discover' && (
          <ThinkAndDiscover 
            onBack={() => setActiveStudentFeature('home')}
            onHome={() => setActiveStudentFeature('home')}
            onCompleteQuestion={(pts, msg) => recordModuleActivity('think-discover', pts, msg)}
            onPlayAudio={speakText}
          />
        )}

        {/* 3. Sound Garden */}
        {activeStudentFeature === 'sound-garden' && (
          <SoundGarden 
            onBack={() => setActiveStudentFeature('home')}
            onHome={() => setActiveStudentFeature('home')}
            onPlayAudio={speakText}
            onOpenSpeakPractice={() => setActiveStudentFeature('speak-practise')}
            onExploreSound={(sound) => recordModuleActivity('sound-garden', 1, `Sound /${sound}/ explored!`)}
          />
        )}

        {/* 4. Speak & Practise Studio */}
        {activeStudentFeature === 'speak-practise' && (
          <div className="materials-view">
            <div className="materials-header">
              <h2>🎙️ Speak & Practise Studio</h2>
              <p>Listen to Pip's clear pronunciation model, then practice recording your own speech attempt.</p>
            </div>

            <div className="target-word-card">
              <p>Target Practice Target</p>
              <h1>{activeStudent.assignedWord} {activeStudent.assignedEmoji}</h1>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                <button className="btn-secondary" onClick={() => speakText(activeStudent.assignedWord, 1.0)}>
                  🔊 Normal (1.0x)
                </button>
                <button className="btn-secondary" onClick={() => speakText(activeStudent.assignedWord, 0.65)}>
                  🐢 Slow & Articulated (0.65x)
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <PipCompanion 
                size="lg"
                state={isRecording ? 'listening' : (feedback === 'success' ? 'celebrating' : 'idle')}
                message={isRecording ? "Pip is listening to your gentle attempt! 👂" : "Tap the microphone when you are ready!"}
              />
            </div>

            <div className="record-container">
              <div className={`mic-circle ${isRecording ? 'recording pulse' : ''}`} onClick={isRecording ? stopRecording : startRecording}>
                <span>{isRecording ? '⏹' : '🎤'}</span>
              </div>
              <h3 className="record-status">{isRecording ? "Listening... Tap to Stop" : "Tap the Mic and say the word"}</h3>

              {audioURL && !isRecording && (
                <div className="evaluation-panel">
                  {transcript && <div className="transcript-box"><p><strong>Observed speech:</strong> "{transcript}"</p></div>}
                  {feedback === 'success' && (
                    <div className="feedback-alert success">
                      <span>🌟</span>
                      <div><h4>Kind Effort!</h4><p>You practiced saying "{activeStudent.assignedWord}" with Pip!</p></div>
                    </div>
                  )}
                  <div className="audio-playback">
                    <p>Listen back to your attempt:</p>
                    <audio controls src={audioURL} className="audio-player"></audio>
                    {!isSubmitted ? (
                      <button className="btn-primary full-width" onClick={submitToTeacher} style={{ marginTop: '1rem' }}>
                        📤 Share Practice Observation with Teacher (+3 ⭐)
                      </button>
                    ) : (
                      <div className="success-badge">✅ Saved to your practice records!</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. What Do I Need? (Helper Harbour) */}
        {activeStudentFeature === 'what-do-i-need' && (
          <WhatDoINeed 
            onBack={() => setActiveStudentFeature('home')}
            onHome={() => setActiveStudentFeature('home')}
            onOpenBoard={() => setActiveStudentFeature('aac-board')}
            onPlayAudio={speakText}
            onCompleteScenario={(pts, msg) => recordModuleActivity('what-do-i-need', pts, msg)}
          />
        )}

        {/* 6. Pip's Adventure */}
        {activeStudentFeature === 'pips-adventure' && (
          <PipsAdventure 
            student={activeStudent}
            stars={activeStudent.stars || 18}
            onBack={() => setActiveStudentFeature('home')}
            onHome={() => setActiveStudentFeature('home')}
            onGrantReward={(pts, msg) => recordModuleActivity('pips-adventure', pts, msg)}
            onPlayAudio={speakText}
          />
        )}

        {/* 7. Flexible AAC Board */}
        {activeStudentFeature === 'aac-board' && (
          <div className="aac-container">
            <div className="aac-header">
              <button className="btn-back" onClick={() => setActiveStudentFeature('home')}>← Back to Adventure Hub</button>
              <h2>My Talking Board</h2>
              <p>Tap any button to express your feelings and needs out loud.</p>
            </div>
            <div className="aac-grid">
              {appState.aacPhrases.map(phrase => (
                <button key={phrase.id} className={`aac-button theme-${phrase.color}`} onClick={() => speakText(phrase.text)}>
                  <span className="aac-icon">{phrase.icon}</span>
                  <span className="aac-text">{phrase.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 8. Lesson Plans */}
        {activeStudentFeature === 'lessons' && (
          <div className="materials-view">
            <div className="materials-header">
              <h2>📅 My Weekly Lesson Plans</h2>
              <p>Objectives and recommendations set by your speech therapist.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {appState.lessonPlans.map(plan => (
                <div key={plan.id} style={{ background: 'var(--bg-card)', padding: '1.8rem', borderRadius: '24px', border: '1.5px solid var(--border-soft)' }}>
                  <span className="status-badge success" style={{ marginBottom: '0.5rem' }}>{plan.week}</span>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--color-navy)', margin: '0.3rem 0' }}>{plan.title}</h3>
                  <p style={{ color: 'var(--color-navy-muted)', fontWeight: 600, marginTop: '0.5rem' }}><strong>Objectives:</strong> {plan.objectives}</p>
                  <p style={{ color: 'var(--color-teal)', fontWeight: 700, marginTop: '0.4rem' }}><strong>Activities:</strong> {plan.activities}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. Live Teletherapy Session */}
        {activeStudentFeature === 'online-meeting' && (
          <div className="meeting-view">
            <div className="meeting-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2>Live Teletherapy Room</h2>
                <span className="live-indicator">🔴 CONNECTED</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className={`btn-secondary ${isCameraOn ? 'active-cam' : ''}`} onClick={toggleCamera}>
                  {isCameraOn ? '📷 Turn Camera Off' : '📷 Turn Camera On'}
                </button>
                <button className="btn-coral" onClick={() => setActiveStudentFeature('home')}>
                  ❌ Leave Room
                </button>
              </div>
            </div>

            <div className="meeting-layout" style={{ marginTop: '2rem' }}>
              <div className="main-video">
                <div className="therapist-placeholder">
                  <span className="t-avatar">👩‍⚕️</span>
                  <p>Ms. Aisya Mysara (SLP)</p>
                </div>
                <div className="pip-video">
                  <video ref={studentVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', display: isCameraOn ? 'block' : 'none' }} />
                  {!isCameraOn && <div className="avatar large">{activeStudent.avatar}</div>}
                </div>
              </div>
              <div className="meeting-aac-sidebar">
                <h3>Quick AAC Phrases</h3>
                <div className="aac-grid-small" style={{ marginTop: '1rem' }}>
                  {appState.aacPhrases.map(p => (
                    <button key={p.id} className="aac-button-small" onClick={() => speakText(p.text)}>
                      <span>{p.icon}</span> <span>{p.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 10. Growth & Badges */}
        {activeStudentFeature === 'progress' && (
          <div className="materials-view">
            <div className="materials-header">
              <h2>📈 My Growth & Milestones</h2>
              <p>Kind milestones recognizing your consistent effort and practice.</p>
            </div>
            <div className="gamification-hero">
              <div className="stars-display">
                <span className="star-icon">⭐</span>
                <div className="star-text">
                  <h3>{activeStudent.stars || 18} Stars Earned</h3>
                  <p>Every practice effort helps Pip fly higher!</p>
                </div>
              </div>
              <div className="streak-display">
                <span className="streak-icon">🌱</span>
                <div className="streak-text">
                  <h3>{activeStudent.growth?.sproutTitle || 'Growing Sprout'}</h3>
                  <p>{activeStudent.growth?.sproutDesc || 'Great consistency this week!'}</p>
                </div>
              </div>
            </div>

            <div className="section-header"><h3>Practice Badges</h3></div>
            <div className="badges-grid">
              {appState.badges.map(b => (
                <div key={b.id} className={`badge-card ${b.unlocked ? 'unlocked' : 'locked'}`}>
                  <div className="badge-icon">{b.icon}</div>
                  <h4>{b.title}</h4>
                  <p>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 11. Learner Profile */}
        {activeStudentFeature === 'student-profile' && (
          <div className="materials-view">
            <div className="materials-header">
              <h2>🌸 Learner Profile: {activeStudent.name}</h2>
              <p>Personal practice targets and speech support preferences.</p>
            </div>
            <div style={{ background: 'var(--bg-card)', padding: '2.5rem', borderRadius: '32px', border: '1.5px solid var(--border-soft)' }}>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ fontSize: '4rem', background: 'var(--color-teal-light)', width: '90px', height: '90px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {activeStudent.avatar}
                </div>
                <div>
                  <h2 style={{ fontSize: '2rem', color: 'var(--color-navy)' }}>{activeStudent.name}</h2>
                  <p style={{ color: 'var(--color-navy-muted)', fontWeight: 700 }}>{activeStudent.ageBand}</p>
                  <span style={{ display: 'inline-block', marginTop: '0.4rem', background: 'var(--color-teal-light)', color: 'var(--color-teal-hover)', padding: '0.3rem 0.9rem', borderRadius: '9999px', fontWeight: 800 }}>
                    🎯 Focus: {activeStudent.targetFocus}
                  </span>
                </div>
              </div>

              <div className="section-header"><h3>Active Assigned Targets</h3></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2rem' }}>
                {activeStudent.goals.map(g => (
                  <div key={g.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-canvas)', borderRadius: '16px' }}>
                    <span style={{ fontWeight: 700 }}>{g.text}</span>
                    <span style={{ color: 'var(--color-teal)', fontWeight: 800 }}>{g.progress}</span>
                  </div>
                ))}
              </div>

              <button className="btn-secondary" onClick={() => setCurrentView('student-profile-picker')} style={{ width: '100%' }}>
                Switch to Another Student Profile ➔
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Celebratory Reward Popup */}
      {rewardPopup && <div className="reward-popup">{rewardPopup}</div>}

      {/* Confetti & Session Work Completion Modal */}
      {showCelebration && (
        <ConfettiCelebrationModal
          studentName={activeStudent.nickname || 'Champion'}
          sessionMinutes={Math.max(1, Math.round((Date.now() - sessionStartTime) / 60000))}
          tasksCount={completedActivitiesCount}
          starsEarned={activeStudent.stars || 18}
          onClose={() => setShowCelebration(false)}
          onContinueAdventure={() => {
            setShowCelebration(false);
            setActiveStudentFeature('pips-adventure');
          }}
        />
      )}

      {/* Automatic Milestone & Inactivity Celebration Summary Modal */}
      {showInactivitySummary && (
        <InactivitySessionSummaryModal
          studentName={activeStudent.nickname || 'Champion'}
          activeMinutes={Math.max(1, Math.round((Date.now() - sessionStartTime) / 60000))}
          modulesTriedCount={modulesTried.length}
          completedTasks={[
            { id: 't1', title: 'Connect the Sentence practice', completed: modulesTried.includes('sentence-connect') },
            { id: 't2', title: 'Think & Discover clue exploration', completed: modulesTried.includes('think-discover') },
            { id: 't3', title: '4-Part Sentence Builder formulation', completed: modulesTried.includes('sentence-builder') },
            { id: 't4', title: 'What Do I Need? everyday scenario', completed: modulesTried.includes('what-do-i-need') },
            { id: 't5', title: 'Sound Garden phonics & articulation', completed: modulesTried.includes('sound-garden') },
            { id: 't6', title: 'Speak & Practise voice recording', completed: modulesTried.includes('speak-practise') },
            { id: 't7', title: "Pip's Adventure Echo Canyon", completed: modulesTried.includes('pips-adventure') },
            { id: 't8', title: 'Daily Mood check-in', completed: !!activeStudent.currentMood }
          ]}
          nextUpcomingQuest="Whispering Woods: Sound Bubble Pop"
          starsEarned={activeStudent.stars || 18}
          onClose={() => setShowInactivitySummary(false)}
          onContinuePracticing={() => {
            setShowInactivitySummary(false);
            lastActivityTimeRef.current = Date.now();
            hasTriggeredInactivityRef.current = false;
          }}
        />
      )}
    </div>
  );

  // 4. Teacher Dashboard
  const renderTeacherDashboard = () => (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-logo"><span>🦜</span> SpeakUp</div>
        <nav className="sidebar-nav">
          <p className="nav-heading">EDUCATOR MENU</p>
          <ul>
            <li className={activeTeacherFeature === 'students' ? 'active' : ''} onClick={() => { setActiveTeacherFeature('students'); setSelectedStudentForTeacher(null); }}>
              <span>📚</span> My Students
            </li>
            <li className={activeTeacherFeature === 'planner' ? 'active' : ''} onClick={() => { setActiveTeacherFeature('planner'); setSelectedStudentForTeacher(null); }}>
              <span>📅</span> Lesson Planner
            </li>
            <li className={activeTeacherFeature === 'reports' ? 'active' : ''} onClick={() => { setActiveTeacherFeature('reports'); setSelectedStudentForTeacher(null); }}>
              <span>📊</span> Practice Observations
            </li>
            <li className={activeTeacherFeature === 'profile' ? 'active' : ''} onClick={() => { setActiveTeacherFeature('profile'); setSelectedStudentForTeacher(null); }}>
              <span>👤</span> SLP Profile
            </li>
          </ul>
          <p className="nav-heading">ACCOUNT</p>
          <ul>
            <li onClick={handleLogout}><span>🚪</span> Log Out</li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <div>
            <h1>Educator & Therapist Portal</h1>
            <p>Manage individual learning goals, review practice attempts, and plan lessons.</p>
          </div>
          <div className="user-profile">
            <div className="avatar">A</div>
            <span>{appState.teacher.name}<br /><small>{appState.teacher.role}</small></span>
          </div>
        </header>

        {activeTeacherFeature === 'students' && !selectedStudentForTeacher && (
          <div>
            <div className="section-header"><h3>Active Student Roster</h3></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              {Object.values(appState.students).map(st => (
                <div key={st.id} className="student-roster-card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>{st.avatar}</div>
                  <h4 style={{ fontSize: '1.3rem', color: 'var(--color-navy)', fontWeight: 900 }}>{st.name}</h4>
                  <p style={{ color: 'var(--color-navy-muted)', fontSize: '0.85rem', fontWeight: 700 }}>{st.targetFocus}</p>
                  <div style={{ margin: '0.5rem 0 1rem 0', fontSize: '0.85rem', color: 'var(--color-teal)', fontWeight: 800 }}>
                    Target Word: {st.assignedWord} {st.assignedEmoji}
                  </div>
                  <button className="btn-secondary" style={{ width: '100%' }} onClick={() => setSelectedStudentForTeacher(st.id)}>
                    View & Assign ➔
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Student Detail View for Teacher */}
        {activeTeacherFeature === 'students' && selectedStudentForTeacher && (
          <div className="student-profile-view">
            <button className="btn-back" onClick={() => setSelectedStudentForTeacher(null)}>
              ← Back to Student Roster
            </button>
            {(() => {
              const st = appState.students[selectedStudentForTeacher];
              return (
                <div>
                  <div className="profile-header-card theme-teal-border">
                    <div style={{ fontSize: '4rem' }}>{st.avatar}</div>
                    <div>
                      <h2>{st.name}'s Support Profile</h2>
                      <p>Age Band: {st.ageBand} • Target Focus: {st.targetFocus}</p>
                    </div>
                  </div>

                  <div className="section-header"><h3>Assign Practice Target</h3></div>
                  <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '24px', border: '1.5px solid var(--border-soft)', marginBottom: '2rem' }}>
                    <p style={{ color: 'var(--color-navy-muted)', marginBottom: '1rem', fontWeight: 600 }}>
                      Current Practice Target: <strong style={{ color: 'var(--color-teal)' }}>{st.assignedWord} {st.assignedEmoji}</strong>
                    </p>
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newAssignmentInput.trim()) return;
                        setAppState(prev => ({
                          ...prev,
                          students: {
                            ...prev.students,
                            [st.id]: {
                              ...st,
                              assignedWord: newAssignmentInput.trim(),
                              assignedEmoji: '⭐'
                            }
                          }
                        }));
                        setNewAssignmentInput('');
                        setShowAssignSuccess(true);
                        setTimeout(() => setShowAssignSuccess(false), 3000);
                      }}
                      style={{ display: 'flex', gap: '1rem' }}
                    >
                      <input 
                        type="text" 
                        value={newAssignmentInput} 
                        onChange={e => setNewAssignmentInput(e.target.value)} 
                        placeholder="e.g. Umbrella, Lion, Spoon..." 
                        style={{ flex: 1, padding: '1rem', borderRadius: '16px', border: '1.5px solid var(--border-soft)', outline: 'none' }}
                      />
                      <button type="submit" className="btn-primary">
                        Assign New Word
                      </button>
                    </form>
                    {showAssignSuccess && (
                      <div className="status-badge success" style={{ marginTop: '1rem', width: '100%', textAlign: 'center', padding: '0.8rem' }}>
                        ✅ Target word updated for {st.nickname}'s device!
                      </div>
                    )}
                  </div>

                  <div className="section-header"><h3>Practice Observations & Submissions</h3></div>
                  {appState.audioRecordings.filter(r => r.studentId === st.id).length === 0 ? (
                    <p style={{ color: 'var(--color-navy-muted)' }}>No recordings submitted yet for {st.nickname}.</p>
                  ) : (
                    <div className="inbox-grid">
                      {appState.audioRecordings.filter(r => r.studentId === st.id).map(rec => (
                        <div key={rec.id} className="inbox-card">
                          <div className="inbox-card-header">
                            <span className="target-badge">Target: {rec.targetWord}</span>
                            <span className="date-badge">{rec.date}</span>
                          </div>
                          <p style={{ fontSize: '0.9rem', color: 'var(--color-navy-muted)' }}>
                            <strong>Learner utterance:</strong> "{rec.transcript}"
                          </p>
                          <audio controls src={rec.audioURL} className="audio-player small" style={{ width: '100%' }}></audio>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* Lesson Planner */}
        {activeTeacherFeature === 'planner' && (
          <div className="materials-view">
            <div className="materials-header">
              <h2>📅 Lesson Planner</h2>
              <p>Weekly therapeutic goals and recommended activity sequences.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {appState.lessonPlans.map(plan => (
                <div key={plan.id} style={{ background: 'var(--bg-card)', padding: '1.8rem', borderRadius: '24px', border: '1.5px solid var(--border-soft)' }}>
                  <span className="status-badge success" style={{ marginBottom: '0.5rem' }}>{plan.week}</span>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--color-navy)', margin: '0.3rem 0' }}>{plan.title}</h3>
                  <p style={{ color: 'var(--color-navy-muted)', fontWeight: 600 }}><strong>Objectives:</strong> {plan.objectives}</p>
                  <p style={{ color: 'var(--color-teal)', fontWeight: 700, marginTop: '0.4rem' }}><strong>Activities:</strong> {plan.activities}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Practice Observations & Reports */}
        {activeTeacherFeature === 'reports' && (
          <div className="materials-view">
            <div className="materials-header">
              <h2>📊 Practice Observations & Reports</h2>
              <p>Practice data is gathered for session notes and encouragement, not formal diagnostic classification.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {Object.values(appState.students).map(st => (
                <div key={st.id} style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '24px', border: '1.5px solid var(--border-soft)' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '2.5rem' }}>{st.avatar}</span>
                    <div>
                      <h4 style={{ fontWeight: 900, color: 'var(--color-navy)' }}>{st.name}</h4>
                      <small style={{ color: 'var(--color-navy-muted)' }}>Focus: {st.targetFocus}</small>
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border-soft)', paddingTop: '0.8rem', fontSize: '0.9rem' }}>
                    <p><strong>Stars Earned:</strong> {st.stars || 18} ⭐</p>
                    <p><strong>Kind Streak:</strong> {st.streak || 3} days</p>
                    <p><strong>Sprout Growth:</strong> {st.growth?.sproutTitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Teacher Profile */}
        {activeTeacherFeature === 'profile' && (
          <div className="teacher-profile-view">
            <div className="profile-header-card theme-teal-border">
              <div className="avatar large" style={{ width: '80px', height: '80px', fontSize: '2.5rem' }}>A</div>
              <div>
                <h2>{appState.teacher.name}</h2>
                <p>{appState.teacher.role} • {appState.teacher.email}</p>
                <div style={{ marginTop: '0.5rem' }}>
                  <span className="status-badge success">🟢 Available for Teletherapy</span>
                </div>
              </div>
            </div>
            <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '24px', border: '1.5px solid var(--border-soft)' }}>
              <h4 style={{ fontWeight: 900, color: 'var(--color-navy)', marginBottom: '0.5rem' }}>Professional Bio</h4>
              <p style={{ color: 'var(--color-navy-muted)', lineHeight: 1.6 }}>{appState.teacher.bio}</p>
            </div>
          </div>
        )}

      </main>
    </div>
  );

  // --------------------------------------------------------------------------
  // TOP ROUTING SWITCH
  // --------------------------------------------------------------------------
  if (currentView === 'role-selection') {
    return renderRoleSelection();
  }

  if (currentView === 'teacher-login') {
    return renderLogin();
  }

  if (currentView === 'student-profile-picker') {
    return (
      <StudentProfilePicker 
        onSelectStudent={(stId) => {
          setActiveStudentId(stId);
          setAppState(prev => ({ ...prev, currentStudentId: stId }));
          setCurrentView('mood-checker');
        }}
        onBackToRole={() => setCurrentView('role-selection')}
      />
    );
  }

  if (currentView === 'mood-checker') {
    return (
      <MoodCheckerScreen 
        student={activeStudent}
        onRecordMood={(moodStr) => {
          setAppState(prev => ({
            ...prev,
            students: {
              ...prev.students,
              [activeStudentId]: {
                ...activeStudent,
                currentMood: moodStr,
                moodHistory: [moodStr, ...(activeStudent.moodHistory || [])]
              }
            }
          }));
          grantReward(1, "Thanks for sharing your mood!");
          setCurrentView('student-dashboard');
          setActiveStudentFeature('home');
        }}
        onSkip={() => {
          setCurrentView('student-dashboard');
          setActiveStudentFeature('home');
        }}
      />
    );
  }

  if (currentView === 'student-dashboard') {
    return renderStudentDashboard();
  }

  if (currentView === 'teacher-dashboard') {
    return renderTeacherDashboard();
  }

  return renderRoleSelection();
}
