import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import PipCompanion from './components/PipCompanion';
import StudentAdventureDashboard from './components/StudentAdventureDashboard';
import SharedVocabularyBanner from './components/SharedVocabularyBanner';

// Store & Screens
import { loadAppState, saveAppState, LEARNING_GOAL_CATALOG } from './data/appStore';
import { SHARED_VOCABULARY_BRIDGE } from './data/curriculumData';
import StudentProfilePicker from './screens/StudentProfilePicker';
import MoodCheckerScreen from './screens/MoodCheckerScreen';

// Core Learning Modules + Tenses Adventure + Pip's Adventure
import ConnectTheSentence from './modules/ConnectTheSentence';
import StructuredSentenceBuilder from './modules/StructuredSentenceBuilder';
import TensesAdventure from './modules/TensesAdventure';
import ThinkAndDiscover from './modules/ThinkAndDiscover';
import SoundGarden from './modules/SoundGarden';
import SpeakAndPractice from './modules/SpeakAndPractice';
import WhatDoINeed from './modules/WhatDoINeed';
import PipsAdventure from './modules/PipsAdventure';
import { soundEngine } from './utils/soundEngine';
import ConfettiCelebrationModal from './components/ConfettiCelebrationModal';
import InactivitySessionSummaryModal from './components/InactivitySessionSummaryModal';
import TeacherWorkspacePortal from './components/TeacherWorkspacePortal';

export default function App() {
  // App persistent state
  const [appState, setAppState] = useState(loadAppState);

  // Top level navigation state:
  // 'role-selection' | 'student-login' | 'teacher-login' | 'student-profile-picker' | 'mood-checker' | 'student-dashboard' | 'teacher-dashboard'
  const [currentView, setCurrentView] = useState('role-selection');
  const [selectedRole, setSelectedRole] = useState(null);

  // Active student ID & data
  const [activeStudentId, setActiveStudentId] = useState(appState.currentStudentId || 'kuhendra');
  const resolvedStudentId = appState.currentStudentId || activeStudentId || 'kuhendra';
  const activeStudent = appState.students[resolvedStudentId] || appState.students.kuhendra;

  // Shared vocabulary word ID connecting modules
  const sharedWordId = appState.sharedVocabularyWordId || 'umbrella';

  // Student feature navigation
  // 'home' | 'sentence-treehouse' | 'sentence-connect' | 'sentence-builder' | 'tenses-adventure' | 'think-discover' | 'sound-garden' | 'speak-practise' | 'what-do-i-need' | 'pips-adventure' | 'aac-board' | 'lessons' | 'online-meeting' | 'progress' | 'student-profile'
  const [activeStudentFeature, setActiveStudentFeature] = useState('home');

  // Teacher navigation & state
  const [activeTeacherFeature, setActiveTeacherFeature] = useState('dashboard');
  const [selectedStudentForTeacher, setSelectedStudentForTeacher] = useState(null);
  const [newAssignmentInput, setNewAssignmentInput] = useState('');
  const [newPhraseInput, setNewPhraseInput] = useState('');
  const [newSentenceInput, setNewSentenceInput] = useState('');
  const [showAssignSuccess, setShowAssignSuccess] = useState(false);

  // Auth mock state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  // Practice & recording state (for the clean Speak & Practise Studio)
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState(null);
  const recognitionRef = useRef(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Simple AAC sentence strip tokens for My Talking Board
  const [aacStripTokens, setAacStripTokens] = useState([]);

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

  // Global button & interactive element click sound listener
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

  // Inactivity detection listener
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

      const hasPracticed7Minutes = elapsedSessionMs >= MIN_SESSION_DURATION_MS;
      const hasSufficientProgress = modulesTried.length >= 2 || completedActivitiesCount >= 3;
      const idleThreshold = 180000; // 3 minutes pause

      if (hasPracticed7Minutes && hasSufficientProgress && idleDuration >= idleThreshold) {
        hasTriggeredInactivityRef.current = true;
        setShowInactivitySummary(true);
      }
    }, 10000);

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

  // Audio speech synthesis helper
  const speakText = (text, personaOrRate = 'teacher') => {
    if (activeStudent?.supports?.audioModels === false) return;
    soundEngine.speak(text, personaOrRate);
  };

  // Select shared vocabulary word
  const handleSelectSharedWord = (wordId) => {
    setAppState(prev => ({
      ...prev,
      sharedVocabularyWordId: wordId
    }));
  };

  // Jump across modules using Shared Vocabulary Bridge
  const handleNavigateSharedModule = (targetModuleKey, wordId) => {
    if (wordId) handleSelectSharedWord(wordId);
    setActiveStudentFeature(targetModuleKey);
  };

  // Base reward granting + skill-specific observation logging
  const grantReward = (amount, message, skillDomain = null) => {
    soundEngine.playChime('success');
    setAppState(prev => {
      const student = prev.students[activeStudentId] || prev.students.kuhendra;
      const currentObs = student.skillObservations || {
        receptiveWh: 2,
        phonicsSpelling: 2,
        sentenceFormulation: 2,
        aacCommunication: 2,
        speechModelPractice: 1
      };
      const updatedObs = skillDomain
        ? { ...currentObs, [skillDomain]: (currentObs[skillDomain] || 0) + 1 }
        : currentObs;

      return {
        ...prev,
        students: {
          ...prev.students,
          [activeStudentId]: {
            ...student,
            stars: (student.stars || 0) + amount,
            skillObservations: updatedObs
          }
        }
      };
    });

    setRewardPopup(`+${amount} ⭐ ${message}`);
    setTimeout(() => setRewardPopup(null), 2500);

    setCompletedActivitiesCount(prev => prev + 1);
  };

  // Record an activity completion in a specific module and map to distinct skill domain
  const recordModuleActivity = (moduleId, amount = 2, message = 'Great job!') => {
    const domainMap = {
      'think-discover': 'receptiveWh',
      'sound-garden': 'phonicsSpelling',
      'sentence-connect': 'sentenceFormulation',
      'sentence-builder': 'sentenceFormulation',
      'tenses-adventure': 'sentenceFormulation',
      'what-do-i-need': 'aacCommunication',
      'speak-practise': 'speechModelPractice'
    };
    const moduleLabelMap = {
      'think-discover': 'Think & Discover',
      'sound-garden': 'Sound Garden',
      'sentence-connect': 'Sentence Treehouse (Conjunctions)',
      'sentence-builder': 'Sentence Treehouse (Sentence Builder)',
      'tenses-adventure': 'Sentence Treehouse (Tenses Adventure)',
      'what-do-i-need': 'What Do I Need? (AAC Board)',
      'speak-practise': 'Speak & Practise'
    };
    grantReward(amount, message, domainMap[moduleId] || null);

    setAppState(prev => {
      const targetId = prev.currentStudentId || activeStudentId || 'kuhendra';
      const student = prev.students[targetId] || prev.students.kuhendra;
      const activeSupportsList = Object.entries(student.supports || {})
        .filter(([, v]) => v)
        .map(([k]) => k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()));
      const newEntry = {
        id: 'ah-' + Date.now(),
        date: new Date().toISOString().slice(0, 10),
        module: moduleLabelMap[moduleId] || moduleId,
        activity: 'Interactive Practice Step',
        detail: message,
        supportsUsed: activeSupportsList,
        category: domainMap[moduleId] || 'general'
      };
      return {
        ...prev,
        students: {
          ...prev.students,
          [targetId]: {
            ...student,
            activityHistory: [newEntry, ...(student.activityHistory || [])]
          }
        }
      };
    });

    setModulesTried(prev => {
      const updated = prev.includes(moduleId) ? prev : [...prev, moduleId];
      const distinctCount = updated.length;
      const elapsedSessionMs = Date.now() - sessionStartTime;

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
  // AUDIO RECORDING (CLEAN SPEAK & PRACTISE STUDIO)
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
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        stream.getTracks().forEach(t => t.stop());
      };

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.onresult = (event) => {
          const spokenText = event.results[0][0].transcript.replace(/[.,]/g, '');
          setTranscript(spokenText);
          setFeedback('success');
          grantReward(5, "Speech practice step complete!", 'speechModelPractice');
        };
        recognition.onerror = () => {};
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
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setFeedback('success');
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
  };

  const submitToTeacher = () => {
    const newRecording = {
      id: Date.now(),
      studentId: activeStudentId,
      studentName: activeStudent.name,
      targetWord: activeStudent.assignedWord,
      transcript: transcript || 'Practised with Pip',
      feedback: 'success',
      audioURL,
      date: new Date().toLocaleDateString()
    };
    setAppState(prev => ({
      ...prev,
      audioRecordings: [newRecording, ...(prev.audioRecordings || [])]
    }));
    setIsSubmitted(true);
    recordModuleActivity('speak-practise', 3, "Practice saved!");
  };

  // Save a practice observation from SpeakAndPractice
  const handleSaveSpeakPracticeObservation = ({ targetWord, level, audioURL, transcript }) => {
    const newRecord = {
      id: Date.now(),
      studentId: activeStudentId,
      studentName: activeStudent.name,
      targetWord: `${targetWord} (${level})`,
      transcript: transcript || 'Self-paced practice completed',
      audioURL: audioURL || null,
      date: new Date().toLocaleDateString()
    };
    setAppState(prev => ({
      ...prev,
      audioRecordings: [newRecord, ...(prev.audioRecordings || [])]
    }));
    recordModuleActivity('speak-practise', 3, 'Speech practice step recorded!');
  };

  // Toggle a teacher-selected learning goal for a student
  const handleToggleStudentGoal = (studentId, goalId) => {
    setAppState(prev => {
      const st = prev.students[studentId];
      const currentGoals = st.selectedGoalIds || [];
      const nextGoals = currentGoals.includes(goalId)
        ? currentGoals.filter(g => g !== goalId)
        : [...currentGoals, goalId];
      return {
        ...prev,
        students: {
          ...prev.students,
          [studentId]: {
            ...st,
            selectedGoalIds: nextGoals
          }
        }
      };
    });
  };

  // Toggle an adjustable student support setting
  const handleToggleStudentSupport = (studentId, supportKey) => {
    setAppState(prev => {
      const st = prev.students[studentId];
      const currentSupports = st.supports || {};
      return {
        ...prev,
        students: {
          ...prev.students,
          [studentId]: {
            ...st,
            supports: {
              ...currentSupports,
              [supportKey]: !currentSupports[supportKey]
            }
          }
        }
      };
    });
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
            <p>Manage learning goals, customize supports, and review practice observations.</p>
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
            <li
              className={
                activeStudentFeature === 'sentence-treehouse' ||
                activeStudentFeature === 'sentence-connect' ||
                activeStudentFeature === 'sentence-builder' ||
                activeStudentFeature === 'tenses-adventure'
                  ? 'active'
                  : ''
              }
              onClick={() => setActiveStudentFeature('sentence-treehouse')}
            >
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '2rem' }}>
              <div
                className="t-card"
                onClick={() => setActiveStudentFeature('sentence-connect')}
                style={{ textAlign: 'left', padding: '2.5rem', cursor: 'pointer' }}
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
                style={{ textAlign: 'left', padding: '2.5rem', cursor: 'pointer' }}
              >
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🧩</div>
                <h3>4-Part Sentence Builder</h3>
                <p style={{ margin: '0.5rem 0 1.5rem 0' }}>
                  Build sentences with <strong>Who?</strong> + <strong>Doing?</strong> + <strong>What?</strong> + <strong>Extra</strong>
                </p>
                <button className="btn-primary" style={{ width: '100%' }}>Build Sentences ➔</button>
              </div>

              <div
                className="t-card"
                onClick={() => setActiveStudentFeature('tenses-adventure')}
                style={{ textAlign: 'left', padding: '2.5rem', cursor: 'pointer' }}
              >
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>⏳</div>
                <h3>Tenses Adventure</h3>
                <p style={{ margin: '0.5rem 0 1.5rem 0' }}>
                  Explore <strong>Yesterday, Today, and Tomorrow</strong> with Pip's Time Tree and Story Sequencer!
                </p>
                <button className="btn-primary" style={{ width: '100%' }}>Explore Tenses ➔</button>
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
            onSaveSentence={() => recordModuleActivity('sentence-builder', 3, 'Sentence saved!')}
          />
        )}

        {activeStudentFeature === 'tenses-adventure' && (
          <TensesAdventure
            onBack={() => setActiveStudentFeature('sentence-treehouse')}
            onHome={() => setActiveStudentFeature('home')}
            onPlayAudio={speakText}
            onCompleteActivity={(pts, msg) => recordModuleActivity('tenses-adventure', pts, msg)}
          />
        )}

        {/* 2. Think & Discover */}
        {activeStudentFeature === 'think-discover' && (
          <ThinkAndDiscover
            onBack={() => setActiveStudentFeature('home')}
            onHome={() => setActiveStudentFeature('home')}
            onCompleteQuestion={(pts, msg) => recordModuleActivity('think-discover', pts, msg)}
            onPlayAudio={speakText}
            studentSupports={activeStudent.supports}
          />
        )}

        {/* 3. Sound Garden */}
        {activeStudentFeature === 'sound-garden' && (
          <SoundGarden
            onBack={() => setActiveStudentFeature('home')}
            onHome={() => setActiveStudentFeature('home')}
            onPlayAudio={speakText}
            onOpenSpeakPractice={() => setActiveStudentFeature('speak-practise')}
            onExploreSound={(sound) => recordModuleActivity('sound-garden', 2, `Sound /${sound}/ explored!`)}
          />
        )}

        {/* 4. Speak & Practise Studio (Restored Beloved Clean Kid-Friendly Layout) */}
        {activeStudentFeature === 'speak-practise' && (
          <div className="materials-view">
            <div className="materials-header">
              <h2>🎙️ Speak & Practise Studio</h2>
              <p>Listen to Pip's clear pronunciation model, then practice at your own pace.</p>
            </div>

            <div className="target-word-card">
              <p>Target Practice Word</p>
              <h1>{activeStudent.assignedWord} {activeStudent.assignedEmoji}</h1>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
                <button className="btn-secondary" onClick={() => speakText(activeStudent.assignedWord, 1.0)}>
                  🔊 Normal (1.0x)
                </button>
                <button className="btn-secondary" onClick={() => speakText(activeStudent.assignedWord, 0.65)}>
                  🐢 Slow & Articulated (0.65x)
                </button>
                {activeStudent.assignedSentence && (
                  <button className="btn-secondary" onClick={() => speakText(activeStudent.assignedSentence, 0.9)}>
                    💬 Hear in a Sentence
                  </button>
                )}
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
                    <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                      {!isSubmitted ? (
                        <button className="btn-primary" style={{ flex: 1 }} onClick={submitToTeacher}>
                          📤 Save Practice (+3 ⭐)
                        </button>
                      ) : (
                        <div className="success-badge" style={{ flex: 1 }}>✅ Saved to your practice records!</div>
                      )}
                      <button
                        className="btn-secondary"
                        onClick={() => { setAudioURL(null); setTranscript(''); setFeedback(null); setIsSubmitted(false); }}
                      >
                        🗑️ Clear
                      </button>
                    </div>
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

        {/* 7. Clean Kid-Friendly My Talking Board (AAC) */}
        {activeStudentFeature === 'aac-board' && (
          <div className="aac-container">
            <div className="aac-header">
              <button className="btn-back" onClick={() => setActiveStudentFeature('home')}>← Back to Adventure Hub</button>
              <h2>🧸 My Talking Board</h2>
              <p>Tap any button to speak out loud and build your message.</p>
            </div>

            {/* Simple, Clean Message Bar */}
            <div style={{
              background: 'var(--bg-card)',
              border: '2px solid var(--color-teal)',
              borderRadius: '24px',
              padding: '1.2rem 1.5rem',
              marginBottom: '1.8rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {aacStripTokens.length === 0 ? (
                  <span style={{ color: 'var(--color-navy-muted)', fontWeight: 700, fontSize: '1.1rem' }}>
                    Tap buttons below to talk...
                  </span>
                ) : (
                  aacStripTokens.map((item, idx) => (
                    <span
                      key={idx}
                      onClick={() => setAacStripTokens(prev => prev.filter((_, i) => i !== idx))}
                      style={{
                        background: 'var(--color-teal-light)',
                        color: 'var(--color-navy)',
                        padding: '0.5rem 1rem',
                        borderRadius: '9999px',
                        fontWeight: 900,
                        fontSize: '1.1rem',
                        cursor: 'pointer'
                      }}
                      title="Tap to remove"
                    >
                      {item.icon} {item.text} ✕
                    </span>
                  ))
                )}
              </div>

              {aacStripTokens.length > 0 && (
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button
                    className="btn-primary"
                    onClick={() => speakText(aacStripTokens.map(t => t.text).join(' '))}
                  >
                    🔊 Speak All
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => setAacStripTokens([])}
                  >
                    🗑️ Clear
                  </button>
                </div>
              )}
            </div>

            <div className="aac-grid">
              {[
                ...appState.aacPhrases,
                { id: 10, text: "I want water.", icon: "🥛", color: "teal" },
                { id: 11, text: "I want food.", icon: "🥪", color: "amber" },
                { id: 12, text: "I feel happy.", icon: "😊", color: "teal" },
                { id: 13, text: "I feel tired.", icon: "🥱", color: "indigo" }
              ].map(phrase => (
                <button
                  key={phrase.id}
                  className={`aac-button theme-${phrase.color}`}
                  onClick={() => {
                    speakText(phrase.text);
                    setAacStripTokens(prev => [...prev, phrase]);
                  }}
                >
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
              <p>Objectives and recommendations set by your educator / speech therapist.</p>
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

        {/* 10. Growth, Skill Observations & Badges */}
        {activeStudentFeature === 'progress' && (
          <div className="materials-view">
            <div className="materials-header">
              <h2>📈 My Growth & Skill Observations</h2>
              <p>Supportive milestones recognizing practice across comprehension, phonics, sentence building, AAC, and listening.</p>
            </div>
            <div className="gamification-hero">
              <div className="stars-display">
                <span className="star-icon">⭐</span>
                <div className="star-text">
                  <h3>{activeStudent.stars || 18} Stars Earned</h3>
                  <p>Every practice step helps Pip fly higher!</p>
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

            {/* Skill-Specific Practice Breakdown */}
            <div className="section-header" style={{ marginTop: '1.8rem' }}>
              <h3>Skill-Specific Practice Summary (Distinct Learning Domains)</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { key: 'receptiveWh', title: 'WH Comprehension', desc: 'Picture & word selection in Think & Discover', icon: '🔍' },
                { key: 'phonicsSpelling', title: 'Letters & Spelling Patterns', desc: 'Word building & sound position in Sound Garden', icon: '🔤' },
                { key: 'sentenceFormulation', title: 'Sentence & Tenses Building', desc: 'Clauses, conjunctions & time sequencing', icon: '🌳' },
                { key: 'aacCommunication', title: 'Functional AAC Messages', desc: 'Everyday requests & communication strip', icon: '⛵' },
                { key: 'speechModelPractice', title: 'Audio Model & Speech Practice', desc: 'Listening to models & optional speaking', icon: '🎙️' }
              ].map(skill => (
                <div key={skill.key} style={{ background: 'var(--bg-card)', padding: '1.3rem', borderRadius: '20px', border: '1.5px solid var(--border-soft)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.3rem' }}>{skill.icon}</div>
                  <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--color-navy)', fontWeight: 900 }}>{skill.title}</h4>
                  <p style={{ margin: '0 0 0.6rem 0', fontSize: '0.82rem', color: 'var(--color-navy-muted)', fontWeight: 600 }}>{skill.desc}</p>
                  <span style={{ background: 'var(--color-teal-light)', color: 'var(--color-teal-hover)', padding: '0.25rem 0.7rem', borderRadius: '9999px', fontWeight: 900, fontSize: '0.82rem' }}>
                    {activeStudent.skillObservations?.[skill.key] || 2} Practice Steps
                  </span>
                </div>
              ))}
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
              <p>Teacher-selected learning goals and adjustable learning supports.</p>
            </div>
            <div style={{ background: 'var(--bg-card)', padding: '2.2rem', borderRadius: '32px', border: '1.5px solid var(--border-soft)' }}>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '1.8rem', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '4rem', background: 'var(--color-teal-light)', width: '90px', height: '90px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {activeStudent.avatar}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.9rem', color: 'var(--color-navy)', margin: 0 }}>{activeStudent.name}</h2>
                  <p style={{ color: 'var(--color-navy-muted)', fontWeight: 700, margin: '0.2rem 0' }}>{activeStudent.ageBand}</p>
                  <span style={{ display: 'inline-block', marginTop: '0.3rem', background: 'var(--color-teal-light)', color: 'var(--color-teal-hover)', padding: '0.3rem 0.9rem', borderRadius: '9999px', fontWeight: 800 }}>
                    🎯 Focus: {activeStudent.targetFocus}
                  </span>
                </div>
              </div>

              <div className="section-header"><h3>Teacher-Selected Learning Goals</h3></div>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.8rem' }}>
                {LEARNING_GOAL_CATALOG.filter(g => (activeStudent.selectedGoalIds || []).includes(g.id)).map(g => (
                  <button
                    key={g.id}
                    onClick={() => setActiveStudentFeature(g.module)}
                    style={{
                      padding: '0.55rem 1rem',
                      borderRadius: '14px',
                      background: 'var(--bg-canvas)',
                      border: '1.5px solid var(--color-teal-border)',
                      color: 'var(--color-navy)',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    {g.icon} {g.label} ➔
                  </button>
                ))}
              </div>

              <div className="section-header"><h3>Active Assigned Steps</h3></div>
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
            { id: 't3', title: 'Sentence Builder & Expansion', completed: modulesTried.includes('sentence-builder') },
            { id: 't4', title: 'What Do I Need? AAC communication', completed: modulesTried.includes('what-do-i-need') },
            { id: 't5', title: 'Sound Garden phonics & spelling', completed: modulesTried.includes('sound-garden') },
            { id: 't6', title: 'Speak & Practise audio model step', completed: modulesTried.includes('speak-practise') },
            { id: 't7', title: 'Tenses Adventure sequencing', completed: modulesTried.includes('tenses-adventure') },
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

  // 4. Teacher Dashboard (Speech & Language Classification Guide, Personalisation & Teacher Workspace)
  const sharedVocabEntry = SHARED_VOCABULARY_BRIDGE.find(w => w.id === sharedWordId) || SHARED_VOCABULARY_BRIDGE[0];

  const handleAssignSharedVocabToActiveStudent = (wordId) => {
    const sw = SHARED_VOCABULARY_BRIDGE.find(w => w.id === wordId);
    if (!sw) return;
    setAppState(prev => {
      const targetId = prev.currentStudentId || activeStudentId || 'kuhendra';
      const st = prev.students[targetId] || prev.students.kuhendra;
      return {
        ...prev,
        sharedVocabularyWordId: sw.id,
        students: {
          ...prev.students,
          [targetId]: {
            ...st,
            assignedWord: sw.word,
            assignedEmoji: sw.emoji,
            assignedPhrase: sw.phrase,
            assignedSentence: sw.modelSentence
          }
        }
      };
    });
    setRewardPopup(`Assigned "${sw.word}" ${sw.emoji} to ${activeStudent.nickname}!`);
    setTimeout(() => setRewardPopup(null), 2500);
  };

  const renderTeacherDashboard = () => (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-logo"><span>🦜</span> SpeakUp</div>
        <nav className="sidebar-nav">
          <p className="nav-heading">TEACHER WORKSPACE</p>
          <ul>
            <li className={activeTeacherFeature === 'dashboard' ? 'active' : ''} onClick={() => setActiveTeacherFeature('dashboard')}>
              <span>📊</span> Workspace Overview
            </li>
            <li className={activeTeacherFeature === 'exhibition' ? 'active' : ''} onClick={() => setActiveTeacherFeature('exhibition')}>
              <span>🎓</span> 4 Exhibition Profiles
            </li>
            <li className={activeTeacherFeature === 'students' ? 'active' : ''} onClick={() => setActiveTeacherFeature('students')}>
              <span>📁</span> Student Records & ILPs
            </li>
            <li className={activeTeacherFeature === 'guide' ? 'active' : ''} onClick={() => setActiveTeacherFeature('guide')}>
              <span>📘</span> Speech & Language Guide
            </li>
            <li className={activeTeacherFeature === 'planner' ? 'active' : ''} onClick={() => setActiveTeacherFeature('planner')}>
              <span>📅</span> Curriculum & Profile
            </li>
          </ul>
          <p className="nav-heading">ACCOUNT & PREVIEW</p>
          <ul>
            <li onClick={() => {
              setActiveStudentId(resolvedStudentId);
              setCurrentView('student-dashboard');
              setActiveStudentFeature('home');
            }}>
              <span>👦🏽</span> Preview Student View
            </li>
            <li onClick={handleLogout}><span>🚪</span> Log Out</li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <div>
            <h1>Teacher Learning Management & Speech-Language Support Workspace</h1>
            <p>Understand speech, language & communication needs, manage Individual Learning Plans (ILPs), and review explainable activity recommendations.</p>
          </div>
          <div className="user-profile">
            <div className="avatar">A</div>
            <span>{appState.teacher.name}<br /><small>{appState.teacher.role}</small></span>
          </div>
        </header>

        <TeacherWorkspacePortal
          appState={appState}
          setAppState={setAppState}
          activeStudent={activeStudent}
          teacherTab={activeTeacherFeature}
          setTeacherTab={setActiveTeacherFeature}
          coreVocabulary={SHARED_VOCABULARY_BRIDGE}
          sharedVocabEntry={sharedVocabEntry}
          handleSelectSharedVocab={handleAssignSharedVocabToActiveStudent}
          toggleStudentGoalId={(goalId) => handleToggleStudentGoal(activeStudent.id, goalId)}
          toggleStudentSupport={(supKey) => handleToggleStudentSupport(activeStudent.id, supKey)}
          onPreviewAsStudent={(stuId) => {
            setActiveStudentId(stuId);
            setAppState(prev => ({ ...prev, currentStudentId: stuId }));
            setCurrentView('student-dashboard');
            setActiveStudentFeature('home');
          }}
          playRealTTS={speakText}
          showToast={(msg) => {
            setRewardPopup(msg);
            setTimeout(() => setRewardPopup(null), 2600);
          }}
        />

        {rewardPopup && <div className="reward-popup">{rewardPopup}</div>}
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
