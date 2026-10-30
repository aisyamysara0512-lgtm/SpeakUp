import React, { useState } from 'react';
import {
  SPEECH_LANGUAGE_SUPPORT_GUIDE,
  GROUPED_LEARNING_GOALS,
  OUT_OF_SCOPE_SPECIALIST_REMINDERS,
  generateExplainableRecommendations
} from '../data/clinicalSupportGuideData';

export default function TeacherWorkspacePortal({
  appState,
  setAppState,
  activeStudent,
  teacherTab,
  setTeacherTab,
  coreVocabulary,
  sharedVocabEntry,
  handleSelectSharedVocab,
  toggleStudentGoalId,
  toggleStudentSupport,
  handleUpdateStudentProfile,
  onPreviewAsStudent,
  playRealTTS,
  showToast
}) {
  const [selectedGuideCategoryId, setSelectedGuideCategoryId] = useState(
    SPEECH_LANGUAGE_SUPPORT_GUIDE[0].id
  );
  const [studentSubTab, setStudentSubTab] = useState('overview-ilp');
  const [editingRecIndex, setEditingRecIndex] = useState(null);
  const [recDraft, setRecDraft] = useState(null);
  const [newLogEntry, setNewLogEntry] = useState({
    module: 'Think & Discover',
    activity: '',
    detail: ''
  });
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentDraft, setNewStudentDraft] = useState({
    name: '',
    ageBand: '6-8 years (Grade 2)',
    learningNeedsSummary: '',
    strengths: '',
    communicationPreferences: ''
  });

  const allStudents = Object.values(appState.students || {});
  const exhibitionProfiles = allStudents
    .filter((s) => s.isExhibitionProfile)
    .sort((a, b) => (a.exhibitionNumber || 99) - (b.exhibitionNumber || 99));

  // Generate explainable recommendations for activeStudent
  const generatedBundle = generateExplainableRecommendations(activeStudent);
  const activeRecommendations =
    Array.isArray(activeStudent.customRecommendations) &&
    activeStudent.customRecommendations.length > 0
      ? activeStudent.customRecommendations
      : generatedBundle.recommendations;

  const updateActiveStudentField = (field, value) => {
    setAppState((prev) => ({
      ...prev,
      students: {
        ...prev.students,
        [activeStudent.id]: {
          ...prev.students[activeStudent.id],
          [field]: value
        }
      }
    }));
  };

  const updateActiveStudentILP = (ilpField, value) => {
    setAppState((prev) => ({
      ...prev,
      students: {
        ...prev.students,
        [activeStudent.id]: {
          ...prev.students[activeStudent.id],
          individualLearningPlan: {
            ...(prev.students[activeStudent.id]?.individualLearningPlan || {}),
            [ilpField]: value
          }
        }
      }
    }));
  };

  const toggleOutOfScopeFlag = (flagKey) => {
    const currentFlags = activeStudent.outOfScopeFlags || [];
    const exists = currentFlags.includes(flagKey);
    const updated = exists
      ? currentFlags.filter((k) => k !== flagKey)
      : [...currentFlags, flagKey];
    updateActiveStudentField('outOfScopeFlags', updated);
  };

  const handleSaveEditedRec = (idx) => {
    if (!recDraft) return;
    const baseList = [...activeRecommendations];
    baseList[idx] = { ...recDraft, teacherEdited: true };
    updateActiveStudentField('customRecommendations', baseList);
    setEditingRecIndex(null);
    setRecDraft(null);
    if (showToast) showToast('Updated activity recommendation saved to student record.');
  };

  const handleResetRecommendations = () => {
    updateActiveStudentField('customRecommendations', null);
    setEditingRecIndex(null);
    if (showToast) showToast('Reset recommendations to goal-based defaults.');
  };

  const handleAddActivityHistoryEntry = (e) => {
    e.preventDefault();
    if (!newLogEntry.activity.trim() || !newLogEntry.detail.trim()) return;
    const activeSupportsList = Object.entries(activeStudent.supports || {})
      .filter(([, v]) => v)
      .map(([k]) => k.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()));

    const entry = {
      id: 'ah-' + Date.now(),
      date: new Date().toISOString().slice(0, 10),
      module: newLogEntry.module,
      activity: newLogEntry.activity.trim(),
      detail: newLogEntry.detail.trim(),
      supportsUsed: activeSupportsList,
      category: 'custom'
    };
    const currentHistory = activeStudent.activityHistory || [];
    updateActiveStudentField('activityHistory', [entry, ...currentHistory]);
    setNewLogEntry({ module: 'Think & Discover', activity: '', detail: '' });
    if (showToast) showToast('Recorded observation in student activity history.');
  };

  const handleCreateFictionalStudent = (e) => {
    e.preventDefault();
    if (!newStudentDraft.name.trim()) return;
    const slug =
      newStudentDraft.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .slice(0, 12) +
      '_' +
      Math.floor(Math.random() * 90 + 10);

    const newProfile = {
      ...activeStudent,
      id: slug,
      name: newStudentDraft.name.trim(),
      nickname: newStudentDraft.name.trim().split(' ')[0],
      studentCode: `SPK-2026-0${allStudents.length + 1}`,
      avatar: '🧒🏽',
      ageBand: newStudentDraft.ageBand,
      isExhibitionProfile: false,
      exhibitionRoleTitle: 'Custom Fictional Student Record',
      learningNeedsSummary:
        newStudentDraft.learningNeedsSummary.trim() ||
        'Documented classroom speech, language, or functional communication learning goals.',
      strengths:
        newStudentDraft.strengths.trim() ||
        'Engages well with visual picture cues and interactive games.',
      communicationPreferences:
        newStudentDraft.communicationPreferences.trim() ||
        'Prefers unhurried audio models and visual supports.',
      limitationStatement:
        'SpeakUp supports educational practice and functional communication alongside classroom and specialist guidance.',
      selectedGoalIds: ['everyday-vocab', 'wh-questions'],
      customRecommendations: null,
      activityHistory: []
    };

    setAppState((prev) => ({
      ...prev,
      currentStudentId: slug,
      students: {
        ...prev.students,
        [slug]: newProfile
      }
    }));
    setShowAddStudentModal(false);
    setNewStudentDraft({
      name: '',
      ageBand: '6-8 years (Grade 2)',
      learningNeedsSummary: '',
      strengths: '',
      communicationPreferences: ''
    });
    setTeacherTab('students');
    if (showToast) showToast(`Created fictional record for ${newProfile.name}!`);
  };

  const selectedGuideCategory =
    SPEECH_LANGUAGE_SUPPORT_GUIDE.find((c) => c.id === selectedGuideCategoryId) ||
    SPEECH_LANGUAGE_SUPPORT_GUIDE[0];

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', paddingBottom: '64px' }}>
      {/* TOP EDUCATIONAL DISCLAIMER BANNER */}
      <div
        style={{
          background: 'linear-gradient(90deg, #0E2338 0%, #1B3B5A 100%)',
          color: '#FFFFFF',
          borderRadius: '20px',
          padding: '18px 24px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
          boxShadow: '0 8px 24px rgba(14,35,56,0.12)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 520px' }}>
          <span
            style={{
              fontSize: '28px',
              background: 'rgba(255,255,255,0.12)',
              width: '50px',
              height: '50px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            🩺
          </span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  background: '#2BB6A8',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 900,
                  padding: '3px 10px',
                  borderRadius: '999px',
                  letterSpacing: '0.6px',
                  textTransform: 'uppercase'
                }}
              >
                Educational Support & Activity-Recommendation System
              </span>
              <span style={{ fontSize: '12px', color: '#A3E4DB', fontWeight: 700 }}>
                • Grounded in ASHA Practice Portal Guidance
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: '#E2E8F0', lineHeight: 1.45 }}>
              SpeakUp helps teachers match existing learning modules to a student’s documented learning goals and communication preferences.{' '}
              <strong style={{ color: '#FDE68A' }}>
                It is NOT a clinical diagnostic tool and does not replace assessment or therapy by a qualified Speech-Language Pathologist (SLP).
              </strong>
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setTeacherTab('guide')}
            style={{
              background: teacherTab === 'guide' ? '#F5B82E' : 'rgba(255,255,255,0.14)',
              color: teacherTab === 'guide' ? '#0E2338' : '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.25)',
              padding: '10px 16px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            📘 Open Speech & Language Guide
          </button>
          <button
            onClick={() => onPreviewAsStudent && onPreviewAsStudent(activeStudent.id)}
            style={{
              background: '#2BB6A8',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            👦🏽 Launch {activeStudent.nickname}’s Student View →
          </button>
        </div>
      </div>

      {/* MAIN TEACHER WORKSPACE NAVIGATION TABS */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          marginBottom: '24px',
          background: '#FFFFFF',
          padding: '10px',
          borderRadius: '18px',
          border: '2px solid #E2E8F0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}
      >
        {[
          { id: 'dashboard', label: '📊 Workspace Overview', badge: `${allStudents.length} Students` },
          { id: 'exhibition', label: '🎓 4 Exhibition Demo Profiles', badge: 'Requirement 6' },
          { id: 'students', label: '📁 Student Records, ILP & Recommendations', badge: activeStudent.nickname },
          { id: 'guide', label: '📘 Speech & Language Support Guide', badge: '7 Categories + ASHA' },
          { id: 'planner', label: '📅 Curriculum & Educator Profile', badge: '4 Weeks' }
        ].map((tab) => {
          const isActive = teacherTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTeacherTab(tab.id)}
              style={{
                flex: '1 1 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 16px',
                borderRadius: '12px',
                border: isActive ? '2px solid #2BB6A8' : '2px solid transparent',
                background: isActive ? '#EBF8F6' : 'transparent',
                color: isActive ? '#0E2338' : '#475569',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  background: isActive ? '#2BB6A8' : '#F1F5F9',
                  color: isActive ? '#FFFFFF' : '#64748B',
                  fontSize: '11px',
                  fontWeight: 900,
                  padding: '2px 8px',
                  borderRadius: '999px'
                }}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* =====================================================================
          TAB 1: WORKSPACE OVERVIEW (TEACHER DASHBOARD)
         ===================================================================== */}
      {teacherTab === 'dashboard' && (
        <div>
          {/* TOP SUMMARY METRIC CARDS */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}
          >
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                padding: '20px',
                border: '2px solid #E2E8F0',
                borderTop: '5px solid #2BB6A8'
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 900, color: '#64748B', textTransform: 'uppercase' }}>
                Active Learning Plans (ILPs)
              </div>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#0E2338', margin: '6px 0' }}>
                {allStudents.length} / {allStudents.length}
              </div>
              <div style={{ fontSize: '13px', color: '#1F8A7E', fontWeight: 700 }}>
                All students have goal-linked ILPs & supports
              </div>
            </div>

            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                padding: '20px',
                border: '2px solid #E2E8F0',
                borderTop: '5px solid #F5B82E'
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 900, color: '#64748B', textTransform: 'uppercase' }}>
                Shared Cross-Module Vocabulary
              </div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#0E2338', margin: '6px 0' }}>
                {sharedVocabEntry?.emoji} {sharedVocabEntry?.word}
              </div>
              <div style={{ fontSize: '13px', color: '#B45309', fontWeight: 700 }}>
                Pattern: "{sharedVocabEntry?.soundPattern}" ({sharedVocabEntry?.category})
              </div>
            </div>

            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                padding: '20px',
                border: '2px solid #E2E8F0',
                borderTop: '5px solid #6366F1'
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 900, color: '#64748B', textTransform: 'uppercase' }}>
                Next ILP Review Window
              </div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#0E2338', margin: '6px 0' }}>
                Nov 10 – Nov 20
              </div>
              <div style={{ fontSize: '13px', color: '#4338CA', fontWeight: 700 }}>
                Daniel (Nov 10) • Aarav (Nov 12) • Kuhendra (Nov 15)
              </div>
            </div>

            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                padding: '20px',
                border: '2px solid #E2E8F0',
                borderTop: '5px solid #EB655B'
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 900, color: '#64748B', textTransform: 'uppercase' }}>
                Exhibition Demo Profiles
              </div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#0E2338', margin: '6px 0' }}>
                4 Core Pathways
              </div>
              <button
                onClick={() => setTeacherTab('exhibition')}
                style={{
                  background: '#FFF5F5',
                  color: '#C53030',
                  border: '1px solid #FEB2B2',
                  borderRadius: '8px',
                  padding: '4px 10px',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Explore 4 Demo Profiles →
              </button>
            </div>
          </div>

          {/* STUDENT ROSTER & ACTIVE LEARNING PLANS OVERVIEW */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '24px',
              border: '2px solid #E2E8F0',
              marginBottom: '24px'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '18px'
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', color: '#0E2338', fontWeight: 900 }}>
                  👩‍🏫 Student Overview & Active Learning Plans
                </h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#64748B' }}>
                  Select any student to inspect their Individual Learning Plan (ILP), explainable activity recommendations, classroom observations, or SLP notes.
                </p>
              </div>
              <button
                onClick={() => setShowAddStudentModal(true)}
                style={{
                  background: '#0E2338',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                + Add Fictional Student Record
              </button>
            </div>

            <div style={{ display: 'grid', gap: '14px' }}>
              {allStudents.map((stu) => {
                const isSelected = stu.id === activeStudent.id;
                const ilp = stu.individualLearningPlan || {};
                const stuRecs = generateExplainableRecommendations(stu).recommendations;
                return (
                  <div
                    key={stu.id}
                    style={{
                      background: isSelected ? '#F0FDFB' : '#F8FAFC',
                      border: isSelected ? '2px solid #2BB6A8' : '2px solid #E2E8F0',
                      borderRadius: '18px',
                      padding: '18px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '16px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: '1 1 420px' }}>
                      <div
                        style={{
                          fontSize: '34px',
                          background: '#FFFFFF',
                          width: '56px',
                          height: '56px',
                          borderRadius: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px solid #E2E8F0',
                          flexShrink: 0
                        }}
                      >
                        {stu.avatar}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <strong style={{ fontSize: '17px', color: '#0E2338', fontWeight: 900 }}>
                            {stu.name}
                          </strong>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 800,
                              background: '#E2E8F0',
                              color: '#334155',
                              padding: '2px 8px',
                              borderRadius: '6px'
                            }}
                          >
                            {stu.studentCode || stu.id.toUpperCase()} • {stu.ageBand}
                          </span>
                          {stu.isExhibitionProfile && (
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: 900,
                                background: '#FEF3C7',
                                color: '#B45309',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                border: '1px solid #FDE68A'
                              }}
                            >
                              ⭐ Exhibition Profile #{stu.exhibitionNumber}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '13.5px', color: '#334155', marginTop: '4px', fontWeight: 700 }}>
                          🎯 ILP Goal: <span style={{ fontWeight: 600 }}>{ilp.learningGoal || stu.targetFocus}</span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            gap: '12px',
                            flexWrap: 'wrap',
                            marginTop: '8px',
                            fontSize: '12.5px',
                            color: '#64748B'
                          }}
                        >
                          <span>
                            📌 <strong>Assigned Word:</strong> {stu.assignedEmoji} {stu.assignedWord}
                          </span>
                          <span>
                            🧩 <strong>Recommended Activities:</strong> {stuRecs.length} modules matched
                          </span>
                          <span>
                            📅 <strong>Target Review:</strong> {ilp.targetReviewDate || '2026-11-15'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => {
                          setAppState((prev) => ({ ...prev, currentStudentId: stu.id }));
                          setStudentSubTab('overview-ilp');
                          setTeacherTab('students');
                        }}
                        style={{
                          background: '#2BB6A8',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          fontWeight: 800,
                          fontSize: '13px',
                          cursor: 'pointer'
                        }}
                      >
                        📋 Open Record & ILP
                      </button>
                      <button
                        onClick={() => {
                          setAppState((prev) => ({ ...prev, currentStudentId: stu.id }));
                          setStudentSubTab('recommendations');
                          setTeacherTab('students');
                        }}
                        style={{
                          background: '#FFFFFF',
                          color: '#0E2338',
                          border: '2px solid #CBD5E1',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          fontWeight: 800,
                          fontSize: '13px',
                          cursor: 'pointer'
                        }}
                      >
                        💡 Recommendations ({stuRecs.length})
                      </button>
                      <button
                        onClick={() => onPreviewAsStudent && onPreviewAsStudent(stu.id)}
                        style={{
                          background: '#FEF3C7',
                          color: '#92400E',
                          border: '1px solid #FDE68A',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          fontWeight: 800,
                          fontSize: '13px',
                          cursor: 'pointer'
                        }}
                      >
                        👦🏽 Student View
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RECENT ACTIVITY SUMMARIES & UPCOMING REVIEWS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '22px',
                padding: '22px',
                border: '2px solid #E2E8F0'
              }}
            >
              <h3 style={{ margin: '0 0 12px 0', fontSize: '17px', color: '#0E2338', fontWeight: 900 }}>
                🕒 Recent Classroom & Module Activity Summaries
              </h3>
              <div style={{ display: 'grid', gap: '10px' }}>
                {allStudents
                  .flatMap((s) =>
                    (s.activityHistory || []).slice(0, 2).map((entry) => ({
                      ...entry,
                      studentName: s.nickname,
                      studentAvatar: s.avatar,
                      studentId: s.id
                    }))
                  )
                  .slice(0, 6)
                  .map((item) => (
                    <div
                      key={item.id}
                      style={{
                        background: '#F8FAFC',
                        borderRadius: '12px',
                        padding: '12px 14px',
                        border: '1px solid #E2E8F0'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748B', fontWeight: 800 }}>
                        <span>
                          {item.studentAvatar} {item.studentName} • <strong>{item.module}</strong>
                        </span>
                        <span>{item.date}</span>
                      </div>
                      <div style={{ fontSize: '13.5px', color: '#0E2338', fontWeight: 700, marginTop: '4px' }}>
                        {item.activity}: <span style={{ fontWeight: 500, color: '#334155' }}>{item.detail}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '22px',
                padding: '22px',
                border: '2px solid #E2E8F0'
              }}
            >
              <h3 style={{ margin: '0 0 12px 0', fontSize: '17px', color: '#0E2338', fontWeight: 900 }}>
                📅 Upcoming ILP Review Dates & Next Steps
              </h3>
              <div style={{ display: 'grid', gap: '10px' }}>
                {allStudents.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      background: '#F8FAFC',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 900, color: '#0E2338' }}>
                        {s.avatar} {s.name}
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#475569', marginTop: '2px' }}>
                        {s.individualLearningPlan?.reviewOutcome || 'In Progress'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div
                        style={{
                          background: '#EEF2FF',
                          color: '#4338CA',
                          fontWeight: 900,
                          fontSize: '12px',
                          padding: '4px 10px',
                          borderRadius: '8px'
                        }}
                      >
                        Review: {s.individualLearningPlan?.targetReviewDate || '2026-11-15'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: 4 EXHIBITION DEMONSTRATION PROFILES (SECTION 6)
         ===================================================================== */}
      {teacherTab === 'exhibition' && (
        <div>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '24px',
              border: '2px solid #E2E8F0',
              marginBottom: '24px'
            }}
          >
            <span
              style={{
                background: '#FEF3C7',
                color: '#B45309',
                fontWeight: 900,
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: '999px',
                textTransform: 'uppercase'
              }}
            >
              Exhibition Showcase • Fictional Demonstration Profiles
            </span>
            <h2 style={{ margin: '10px 0 6px 0', fontSize: '22px', color: '#0E2338', fontWeight: 900 }}>
              🎓 How Different Learning Goals Lead to Personalized SpeakUp Pathways
            </h2>
            <p style={{ margin: 0, fontSize: '14.5px', color: '#475569', lineHeight: 1.55 }}>
              These four fictional student profiles demonstrate how SpeakUp adapts module recommendations, visual/audio scaffolds, and AAC access based on a learner’s documented goals, strengths, and communication preferences — while clearly stating clinical scope limitations.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(520px, 1fr))', gap: '20px' }}>
            {exhibitionProfiles.map((stu) => {
              const bundle = generateExplainableRecommendations(stu);
              const activeSupports = Object.entries(stu.supports || {})
                .filter(([, v]) => v)
                .map(([k]) => k.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()));

              return (
                <div
                  key={stu.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    padding: '24px',
                    border: '2px solid #CBD5E1',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 6px 20px rgba(14,35,56,0.05)'
                  }}
                >
                  <div>
                    {/* Header */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '12px',
                        marginBottom: '14px'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span
                          style={{
                            fontSize: '36px',
                            background: '#F0FDFB',
                            width: '60px',
                            height: '60px',
                            borderRadius: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid #99F6E4'
                          }}
                        >
                          {stu.avatar}
                        </span>
                        <div>
                          <div
                            style={{
                              fontSize: '11px',
                              fontWeight: 900,
                              color: '#1F8A7E',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}
                          >
                            {stu.exhibitionRoleTitle}
                          </div>
                          <h3 style={{ margin: '2px 0', fontSize: '20px', color: '#0E2338', fontWeight: 900 }}>
                            {stu.name} <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 700 }}>({stu.ageBand})</span>
                          </h3>
                          <span
                            style={{
                              fontSize: '11px',
                              background: '#F1F5F9',
                              color: '#475569',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontWeight: 700
                            }}
                          >
                            Fictional Demo Record • {stu.studentCode}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Respectful Learning Needs & Strengths */}
                    <div
                      style={{
                        background: '#F8FAFC',
                        borderRadius: '16px',
                        padding: '14px 16px',
                        border: '1px solid #E2E8F0',
                        marginBottom: '14px',
                        fontSize: '13.5px',
                        lineHeight: 1.5,
                        color: '#334155'
                      }}
                    >
                      <div style={{ marginBottom: '6px' }}>
                        <strong style={{ color: '#0E2338' }}>📋 Learning Needs Description:</strong> {stu.learningNeedsSummary}
                      </div>
                      <div style={{ marginBottom: '6px' }}>
                        <strong style={{ color: '#1F8A7E' }}>🌟 Strengths:</strong> {stu.strengths}
                      </div>
                      <div>
                        <strong style={{ color: '#4338CA' }}>💬 Communication Preferences:</strong> {stu.communicationPreferences}
                      </div>
                    </div>

                    {/* Selected Learning Goals */}
                    <div style={{ marginBottom: '14px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>
                        🎯 Documented Learning Goals
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {(stu.selectedGoalIds || []).map((gId) => (
                          <span
                            key={gId}
                            style={{
                              background: '#EBF8F6',
                              color: '#0F766E',
                              border: '1px solid #99F6E4',
                              padding: '4px 10px',
                              borderRadius: '999px',
                              fontSize: '12px',
                              fontWeight: 800
                            }}
                          >
                            ✓ {gId.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Explainable Recommended SpeakUp Activities */}
                    <div style={{ marginBottom: '14px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>
                        💡 Recommended SpeakUp Modules & Why Relevant
                      </div>
                      <div style={{ display: 'grid', gap: '8px' }}>
                        {bundle.recommendations.slice(0, 3).map((rec) => (
                          <div
                            key={rec.goalId}
                            style={{
                              background: '#FFFBEB',
                              border: '1px solid #FDE68A',
                              borderRadius: '12px',
                              padding: '10px 12px',
                              fontSize: '12.5px'
                            }}
                          >
                            <div style={{ fontWeight: 900, color: '#92400E' }}>
                              {rec.recommendedModule} → {rec.specificActivity}
                            </div>
                            <div style={{ color: '#475569', marginTop: '3px', lineHeight: 1.4 }}>
                              <strong>Why relevant:</strong> {rec.whyRelevant}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Available Supports */}
                    <div style={{ marginBottom: '14px', fontSize: '12.5px', color: '#334155' }}>
                      <strong>🛠️ Active Scaffolds & Supports:</strong> {activeSupports.join(' • ')}
                    </div>

                    {/* Clear Scope Limitation Statement */}
                    <div
                      style={{
                        background: '#FFF5F5',
                        border: '1px solid #FEB2B2',
                        borderRadius: '12px',
                        padding: '10px 12px',
                        fontSize: '12.5px',
                        color: '#9B2C2C',
                        lineHeight: 1.45,
                        marginBottom: '16px'
                      }}
                    >
                      <strong>⚠️ Scope & Specialist Limitation Statement:</strong> {stu.limitationStatement}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => {
                        setAppState((prev) => ({ ...prev, currentStudentId: stu.id }));
                        setStudentSubTab('overview-ilp');
                        setTeacherTab('students');
                      }}
                      style={{
                        flex: 1,
                        background: '#0E2338',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '11px 14px',
                        borderRadius: '12px',
                        fontWeight: 800,
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      📁 Inspect Full Record & ILP
                    </button>
                    <button
                      onClick={() => onPreviewAsStudent && onPreviewAsStudent(stu.id)}
                      style={{
                        flex: 1,
                        background: '#2BB6A8',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '11px 14px',
                        borderRadius: '12px',
                        fontWeight: 800,
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      👦🏽 Try {stu.nickname}’s Student Experience →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: STUDENT RECORDS, ILP & RECOMMENDATIONS (SECTIONS 4 & 5)
         ===================================================================== */}
      {teacherTab === 'students' && (
        <div>
          {/* STUDENT SWITCHER BAR */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '16px 20px',
              border: '2px solid #E2E8F0',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', fontWeight: 900, color: '#64748B', textTransform: 'uppercase' }}>
                Select Student Record:
              </span>
              {allStudents.map((stu) => {
                const isSelected = stu.id === activeStudent.id;
                return (
                  <button
                    key={stu.id}
                    onClick={() => setAppState((prev) => ({ ...prev, currentStudentId: stu.id }))}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '999px',
                      border: isSelected ? '2px solid #2BB6A8' : '2px solid #E2E8F0',
                      background: isSelected ? '#EBF8F6' : '#F8FAFC',
                      color: isSelected ? '#0E2338' : '#475569',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{stu.avatar}</span>
                    <span>{stu.nickname}</span>
                    {stu.isExhibitionProfile && (
                      <span style={{ fontSize: '10px', color: '#B45309', fontWeight: 900 }}>
                        (#{stu.exhibitionNumber})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setShowAddStudentModal(true)}
              style={{
                background: '#0E2338',
                color: '#FFFFFF',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '12.5px',
                cursor: 'pointer'
              }}
            >
              + New Fictional Record
            </button>
          </div>

          {/* ACTIVE STUDENT HEADER CARD */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '22px',
              padding: '22px 24px',
              border: '2px solid #2BB6A8',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1 1 480px' }}>
              <div
                style={{
                  fontSize: '42px',
                  background: '#F0FDFB',
                  width: '72px',
                  height: '72px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #99F6E4'
                }}
              >
                {activeStudent.avatar}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <h2 style={{ margin: 0, fontSize: '22px', color: '#0E2338', fontWeight: 900 }}>
                    {activeStudent.name}
                  </h2>
                  <span
                    style={{
                      background: '#F1F5F9',
                      color: '#334155',
                      fontSize: '12px',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: '8px'
                    }}
                  >
                    ID: {activeStudent.studentCode || activeStudent.id.toUpperCase()} • {activeStudent.ageBand}
                  </span>
                  {activeStudent.isExhibitionProfile && (
                    <span
                      style={{
                        background: '#FEF3C7',
                        color: '#92400E',
                        fontSize: '12px',
                        fontWeight: 900,
                        padding: '3px 10px',
                        borderRadius: '8px'
                      }}
                    >
                      {activeStudent.exhibitionRoleTitle}
                    </span>
                  )}
                </div>
                <p style={{ margin: '6px 0 0 0', fontSize: '13.5px', color: '#475569', lineHeight: 1.45 }}>
                  <strong>Learning Support Summary:</strong> {activeStudent.learningNeedsSummary}
                </p>
              </div>
            </div>

            {/* SUB-NAVIGATION WITHIN STUDENT RECORD */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { id: 'overview-ilp', label: '📋 Profile & Individual Learning Plan (ILP)' },
                { id: 'goals-assign', label: '🎯 Learning Goals & Activity Assignment' },
                { id: 'recommendations', label: `💡 Explainable Recommendations (${activeRecommendations.length})` },
                { id: 'collab-history', label: '🩺 SLP Collaboration & Activity History' }
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setStudentSubTab(st.id)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: studentSubTab === st.id ? '2px solid #0E2338' : '2px solid #E2E8F0',
                    background: studentSubTab === st.id ? '#0E2338' : '#F8FAFC',
                    color: studentSubTab === st.id ? '#FFFFFF' : '#334155',
                    fontWeight: 800,
                    fontSize: '12.5px',
                    cursor: 'pointer'
                  }}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* -----------------------------------------------------------------
              SUB-TAB A: PROFILE & INDIVIDUAL LEARNING PLAN (ILP)
             ----------------------------------------------------------------- */}
          {studentSubTab === 'overview-ilp' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '20px' }}>
              {/* Left Column: Student Profile, Strengths & Communication Preferences */}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '22px',
                  padding: '24px',
                  border: '2px solid #E2E8F0'
                }}
              >
                <h3 style={{ margin: '0 0 14px 0', fontSize: '18px', color: '#0E2338', fontWeight: 900 }}>
                  👤 Student Profile, Strengths & Communication Preferences
                </h3>

                <div style={{ display: 'grid', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 900, color: '#475569', marginBottom: '4px' }}>
                      PREFERRED NAME / STUDENT IDENTIFIER
                    </label>
                    <input
                      type="text"
                      value={activeStudent.name || ''}
                      onChange={(e) => updateActiveStudentField('name', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '2px solid #CBD5E1',
                        fontSize: '14px',
                        fontWeight: 700
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 900, color: '#475569', marginBottom: '4px' }}>
                      RELEVANT LEARNING-SUPPORT INFORMATION (RESPECTFUL, EDUCATIONAL)
                    </label>
                    <textarea
                      rows={3}
                      value={activeStudent.learningNeedsSummary || ''}
                      onChange={(e) => updateActiveStudentField('learningNeedsSummary', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '2px solid #CBD5E1',
                        fontSize: '13.5px',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 900, color: '#1F8A7E', marginBottom: '4px' }}>
                      🌟 COMMUNICATION STRENGTHS
                    </label>
                    <textarea
                      rows={2}
                      value={activeStudent.strengths || ''}
                      onChange={(e) => updateActiveStudentField('strengths', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '2px solid #99F6E4',
                        background: '#F0FDFB',
                        fontSize: '13.5px',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 900, color: '#4338CA', marginBottom: '4px' }}>
                      💬 COMMUNICATION PREFERENCES & PREFERRED MODALITIES
                    </label>
                    <textarea
                      rows={2}
                      value={activeStudent.communicationPreferences || ''}
                      onChange={(e) => updateActiveStudentField('communicationPreferences', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '2px solid #C7D2FE',
                        background: '#EEF2FF',
                        fontSize: '13.5px',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 900, color: '#9B2C2C', marginBottom: '4px' }}>
                      ⚠️ SCOPE LIMITATION STATEMENT FOR THIS LEARNER
                    </label>
                    <textarea
                      rows={2}
                      value={activeStudent.limitationStatement || ''}
                      onChange={(e) => updateActiveStudentField('limitationStatement', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '2px solid #FEB2B2',
                        background: '#FFF5F5',
                        fontSize: '13px',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Individual Learning Plan (ILP) Editor */}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '22px',
                  padding: '24px',
                  border: '2px solid #2BB6A8'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', color: '#0E2338', fontWeight: 900 }}>
                    📑 Individual Learning Plan (ILP)
                  </h3>
                  <span
                    style={{
                      background: '#EBF8F6',
                      color: '#0F766E',
                      fontSize: '11px',
                      fontWeight: 900,
                      padding: '4px 10px',
                      borderRadius: '999px'
                    }}
                  >
                    Auto-Saved to Student Record
                  </span>
                </div>

                <div style={{ display: 'grid', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 900, color: '#0E2338', marginBottom: '4px' }}>
                      1. PRIMARY LEARNING GOAL
                    </label>
                    <textarea
                      rows={2}
                      value={activeStudent.individualLearningPlan?.learningGoal || ''}
                      onChange={(e) => updateActiveStudentILP('learningGoal', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '2px solid #CBD5E1',
                        fontSize: '13.5px',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 900, color: '#0E2338', marginBottom: '4px' }}>
                      2. OBSERVED SKILL OR SUPPORT NEED
                    </label>
                    <textarea
                      rows={2}
                      value={activeStudent.individualLearningPlan?.observedSupportNeed || ''}
                      onChange={(e) => updateActiveStudentILP('observedSupportNeed', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '2px solid #CBD5E1',
                        fontSize: '13.5px',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 900, color: '#0E2338', marginBottom: '4px' }}>
                        3. TARGET REVIEW DATE
                      </label>
                      <input
                        type="date"
                        value={activeStudent.individualLearningPlan?.targetReviewDate || '2026-11-15'}
                        onChange={(e) => updateActiveStudentILP('targetReviewDate', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          border: '2px solid #CBD5E1',
                          fontSize: '13.5px',
                          fontWeight: 700
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 900, color: '#0E2338', marginBottom: '4px' }}>
                        4. ASSIGNED SHARED VOCABULARY
                      </label>
                      <div
                        style={{
                          padding: '10px 12px',
                          borderRadius: '10px',
                          background: '#FEF3C7',
                          border: '1px solid #FDE68A',
                          fontSize: '13.5px',
                          fontWeight: 800,
                          color: '#92400E'
                        }}
                      >
                        {activeStudent.assignedEmoji} {activeStudent.assignedWord} ("{activeStudent.assignedSentence}")
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 900, color: '#0E2338', marginBottom: '4px' }}>
                      5. TEACHER IMPLEMENTATION NOTES
                    </label>
                    <textarea
                      rows={2}
                      value={activeStudent.individualLearningPlan?.teacherNotes || ''}
                      onChange={(e) => updateActiveStudentILP('teacherNotes', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '2px solid #CBD5E1',
                        fontSize: '13.5px',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 900, color: '#0E2338', marginBottom: '4px' }}>
                      6. REVIEW OUTCOME & NEXT STEPS
                    </label>
                    <textarea
                      rows={2}
                      value={activeStudent.individualLearningPlan?.reviewOutcome || ''}
                      onChange={(e) => updateActiveStudentILP('reviewOutcome', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '2px solid #99F6E4',
                        background: '#F0FDFB',
                        fontSize: '13.5px',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* -----------------------------------------------------------------
              SUB-TAB B: GROUPED LEARNING GOALS & ACTIVITY ASSIGNMENT (5D & 5E)
             ----------------------------------------------------------------- */}
          {studentSubTab === 'goals-assign' && (
            <div style={{ display: 'grid', gap: '20px' }}>
              {/* Section 5D: Grouped Learning-Goal Selector (8 Skill Areas) */}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '22px',
                  padding: '24px',
                  border: '2px solid #E2E8F0'
                }}
              >
                <h3 style={{ margin: '0 0 6px 0', fontSize: '19px', color: '#0E2338', fontWeight: 900 }}>
                  🎯 Grouped Learning-Goal Selector (8 Skill Areas)
                </h3>
                <p style={{ margin: '0 0 18px 0', fontSize: '13.5px', color: '#64748B' }}>
                  Select one or more documented learning goals for {activeStudent.nickname}. SpeakUp uses these selected goals (alongside communication preferences and observations) to generate explainable activity recommendations.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                  {GROUPED_LEARNING_GOALS.map((group) => (
                    <div
                      key={group.groupId}
                      style={{
                        background: '#F8FAFC',
                        borderRadius: '16px',
                        padding: '16px',
                        border: '2px solid #E2E8F0'
                      }}
                    >
                      <div style={{ fontSize: '14px', fontWeight: 900, color: '#0E2338', marginBottom: '10px' }}>
                        {group.icon || group.groupIcon} {group.groupTitle}
                      </div>
                      <div style={{ display: 'grid', gap: '8px' }}>
                        {group.goals.map((g) => {
                          const isChecked = (activeStudent.selectedGoalIds || []).includes(g.id);
                          return (
                            <label
                              key={g.id}
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '10px',
                                background: isChecked ? '#EBF8F6' : '#FFFFFF',
                                border: isChecked ? '2px solid #2BB6A8' : '1px solid #CBD5E1',
                                borderRadius: '12px',
                                padding: '10px 12px',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: isChecked ? 800 : 600,
                                color: '#0E2338'
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleStudentGoalId(g.id)}
                                style={{ marginTop: '3px', accentColor: '#2BB6A8' }}
                              />
                              <div>
                                <div>{g.label}</div>
                                <div style={{ fontSize: '11px', color: '#1F8A7E', marginTop: '2px' }}>
                                  Skill Area: {g.skillArea || g.defaultModule || g.module}
                                </div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 5E: Activity, Vocabulary & Support Scaffolds Assignment */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '20px' }}>
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '22px',
                    padding: '24px',
                    border: '2px solid #E2E8F0'
                  }}
                >
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: '#0E2338', fontWeight: 900 }}>
                    🔗 Shared Cross-Module Vocabulary & Target Assignment
                  </h3>
                  <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#64748B' }}>
                    Assigning a core vocabulary word synchronizes {activeStudent.nickname}’s target word across Sound Garden, Think & Discover, Sentence Treehouse, What Do I Need?, and Speak & Practise.
                  </p>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
                    {(coreVocabulary || []).map((item) => {
                      const isCurrent = activeStudent.assignedWord?.toLowerCase() === item.word.toLowerCase();
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectSharedVocab(item.id)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '10px',
                            border: isCurrent ? '2px solid #2BB6A8' : '1px solid #CBD5E1',
                            background: isCurrent ? '#EBF8F6' : '#F8FAFC',
                            color: '#0E2338',
                            fontWeight: 800,
                            fontSize: '13px',
                            cursor: 'pointer'
                          }}
                        >
                          {item.emoji} {item.word}
                        </button>
                      );
                    })}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 900, color: '#475569', marginBottom: '4px' }}>
                        ASSIGNED WH QUESTION FOCUS
                      </label>
                      <input
                        type="text"
                        value={activeStudent.assignedWhCategory || 'What, Where & Why'}
                        onChange={(e) => updateActiveStudentField('assignedWhCategory', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: '10px',
                          border: '1px solid #CBD5E1',
                          fontSize: '13px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 900, color: '#475569', marginBottom: '4px' }}>
                        ASSIGNED AAC SCENARIO FOCUS
                      </label>
                      <input
                        type="text"
                        value={activeStudent.assignedAacScenario || 'Everyday Classroom Needs'}
                        onChange={(e) => updateActiveStudentField('assignedAacScenario', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: '10px',
                          border: '1px solid #CBD5E1',
                          fontSize: '13px'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Adjustable Learning Supports */}
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '22px',
                    padding: '24px',
                    border: '2px solid #E2E8F0'
                  }}
                >
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#0E2338', fontWeight: 900 }}>
                    🛠️ Adjustable Student Learning Supports
                  </h3>
                  <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#64748B' }}>
                    Configure which visual, audio, and choice-reduction scaffolds are active when {activeStudent.nickname} uses SpeakUp modules.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {[
                      { key: 'pictureCues', label: '🖼️ Picture Cues', desc: 'Visual illustrations on cards & tiles' },
                      { key: 'audioModels', label: '🔊 Audio Models', desc: 'Normal & slow TTS word/sentence models' },
                      { key: 'sentenceStarters', label: '🧩 Sentence Starters', desc: 'Pre-filled subject/verb scaffolds' },
                      { key: 'wordBanks', label: '📚 Word Banks', desc: 'Structured tile choices for building' },
                      { key: 'fewerChoices', label: '🎯 Fewer Choices (2–3)', desc: 'Reduces visual array to prevent overload' },
                      { key: 'independentResponses', label: '🚀 Independent Extension', desc: 'Unlocks sentence expansion & tense challenges' }
                    ].map((sup) => {
                      const active = !!activeStudent.supports?.[sup.key];
                      return (
                        <label
                          key={sup.key}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px',
                            padding: '10px 12px',
                            borderRadius: '12px',
                            border: active ? '2px solid #2BB6A8' : '1px solid #E2E8F0',
                            background: active ? '#F0FDFB' : '#F8FAFC',
                            cursor: 'pointer'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => toggleStudentSupport(sup.key)}
                            style={{ marginTop: '3px', accentColor: '#2BB6A8' }}
                          />
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 800, color: '#0E2338' }}>{sup.label}</div>
                            <div style={{ fontSize: '11.5px', color: '#64748B' }}>{sup.desc}</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* -----------------------------------------------------------------
              SUB-TAB C: EXPLAINABLE ACTIVITY-RECOMMENDATION SYSTEM (SECTION 4)
             ----------------------------------------------------------------- */}
          {studentSubTab === 'recommendations' && (
            <div style={{ display: 'grid', gap: '20px' }}>
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '22px',
                  padding: '24px',
                  border: '2px solid #E2E8F0'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginBottom: '16px'
                  }}
                >
                  <div>
                    <span
                      style={{
                        background: '#EBF8F6',
                        color: '#0F766E',
                        fontSize: '11px',
                        fontWeight: 900,
                        padding: '4px 10px',
                        borderRadius: '999px',
                        textTransform: 'uppercase'
                      }}
                    >
                      Explainable Recommendation Engine • Teacher-Editable
                    </span>
                    <h3 style={{ margin: '8px 0 4px 0', fontSize: '20px', color: '#0E2338', fontWeight: 900 }}>
                      💡 Goal-Linked Activity Recommendations for {activeStudent.name}
                    </h3>
                    <p style={{ margin: 0, fontSize: '13.5px', color: '#475569' }}>
                      Recommendations are derived from documented learning goals, teacher observations, SLP notes, and communication preferences — never from a diagnostic label alone. Teachers can edit any recommendation below.
                    </p>
                  </div>
                  {activeStudent.customRecommendations && (
                    <button
                      onClick={handleResetRecommendations}
                      style={{
                        background: '#F1F5F9',
                        color: '#475569',
                        border: '1px solid #CBD5E1',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      ↺ Reset to Goal-Generated Defaults
                    </button>
                  )}
                </div>

                {/* Recommendation Cards */}
                <div style={{ display: 'grid', gap: '16px' }}>
                  {activeRecommendations.map((rec, idx) => {
                    const isEditing = editingRecIndex === idx;
                    return (
                      <div
                        key={rec.goalId || idx}
                        style={{
                          background: '#F8FAFC',
                          borderRadius: '18px',
                          padding: '20px',
                          border: '2px solid #CBD5E1'
                        }}
                      >
                        {!isEditing ? (
                          <div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '10px',
                                marginBottom: '12px'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                <span
                                  style={{
                                    background: '#0E2338',
                                    color: '#FFFFFF',
                                    fontSize: '12px',
                                    fontWeight: 900,
                                    padding: '4px 12px',
                                    borderRadius: '8px'
                                  }}
                                >
                                  Module: {rec.recommendedModule}
                                </span>
                                <span
                                  style={{
                                    background: '#EBF8F6',
                                    color: '#0F766E',
                                    fontSize: '12.5px',
                                    fontWeight: 900,
                                    padding: '4px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid #99F6E4'
                                  }}
                                >
                                  Activity: {rec.specificActivity}
                                </span>
                                {rec.teacherEdited && (
                                  <span
                                    style={{
                                      background: '#FEF3C7',
                                      color: '#92400E',
                                      fontSize: '11px',
                                      fontWeight: 900,
                                      padding: '3px 8px',
                                      borderRadius: '6px'
                                    }}
                                  >
                                    ✎ Teacher Customized
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => {
                                  setEditingRecIndex(idx);
                                  setRecDraft({ ...rec });
                                }}
                                style={{
                                  background: '#FFFFFF',
                                  color: '#0E2338',
                                  border: '1px solid #94A3B8',
                                  padding: '6px 12px',
                                  borderRadius: '8px',
                                  fontSize: '12px',
                                  fontWeight: 800,
                                  cursor: 'pointer'
                                }}
                              >
                                ✎ Edit Recommendation
                              </button>
                            </div>

                            <div style={{ display: 'grid', gap: '8px', fontSize: '13.5px', color: '#334155', lineHeight: 1.5 }}>
                              <div>
                                <strong style={{ color: '#0E2338' }}>🎯 Related Learning Goal:</strong> {rec.relatedGoal}
                              </div>
                              <div>
                                <strong style={{ color: '#1F8A7E' }}>💡 Why This Activity Is Relevant:</strong> {rec.whyRelevant}
                              </div>
                              <div>
                                <strong style={{ color: '#4338CA' }}>🛠️ Recommended Optional Supports:</strong>{' '}
                                {(rec.optionalSupports || []).join(' • ')}
                              </div>
                              <div
                                style={{
                                  background: '#FFFBEB',
                                  border: '1px solid #FDE68A',
                                  borderRadius: '10px',
                                  padding: '8px 12px',
                                  color: '#92400E',
                                  fontSize: '12.5px',
                                  marginTop: '4px'
                                }}
                              >
                                <strong>🩺 Specialist & Scope Reminder:</strong> {rec.specialistReminder}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: 'grid', gap: '10px' }}>
                            <div style={{ fontWeight: 900, color: '#0E2338', fontSize: '14px' }}>
                              Editing Recommendation #{idx + 1}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                              <div>
                                <label style={{ fontSize: '11px', fontWeight: 900, color: '#475569' }}>RECOMMENDED MODULE</label>
                                <input
                                  type="text"
                                  value={recDraft?.recommendedModule || ''}
                                  onChange={(e) => setRecDraft({ ...recDraft, recommendedModule: e.target.value })}
                                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                                />
                              </div>
                              <div>
                                <label style={{ fontSize: '11px', fontWeight: 900, color: '#475569' }}>SPECIFIC ACTIVITY</label>
                                <input
                                  type="text"
                                  value={recDraft?.specificActivity || ''}
                                  onChange={(e) => setRecDraft({ ...recDraft, specificActivity: e.target.value })}
                                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                                />
                              </div>
                            </div>
                            <div>
                              <label style={{ fontSize: '11px', fontWeight: 900, color: '#475569' }}>WHY RELEVANT EXPLANATION</label>
                              <textarea
                                rows={2}
                                value={recDraft?.whyRelevant || ''}
                                onChange={(e) => setRecDraft({ ...recDraft, whyRelevant: e.target.value })}
                                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontFamily: 'inherit' }}
                              />
                            </div>
                            <div>
                              <label style={{ fontSize: '11px', fontWeight: 900, color: '#475569' }}>SPECIALIST REMINDER</label>
                              <textarea
                                rows={2}
                                value={recDraft?.specialistReminder || ''}
                                onChange={(e) => setRecDraft({ ...recDraft, specialistReminder: e.target.value })}
                                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontFamily: 'inherit' }}
                              />
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => handleSaveEditedRec(idx)}
                                style={{
                                  background: '#2BB6A8',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  padding: '8px 14px',
                                  borderRadius: '8px',
                                  fontWeight: 800,
                                  cursor: 'pointer'
                                }}
                              >
                                ✓ Save Changes
                              </button>
                              <button
                                onClick={() => {
                                  setEditingRecIndex(null);
                                  setRecDraft(null);
                                }}
                                style={{
                                  background: '#E2E8F0',
                                  color: '#334155',
                                  border: 'none',
                                  padding: '8px 14px',
                                  borderRadius: '8px',
                                  fontWeight: 800,
                                  cursor: 'pointer'
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Out-of-Scope Clinical Need Checker & Neutral Referral Guidance */}
              <div
                style={{
                  background: '#FFF5F5',
                  borderRadius: '22px',
                  padding: '22px 24px',
                  border: '2px solid #FEB2B2'
                }}
              >
                <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', color: '#9B2C2C', fontWeight: 900 }}>
                  🩺 Out-of-Scope Clinical Needs & Specialist Referral Guidance
                </h3>
                <p style={{ margin: '0 0 14px 0', fontSize: '13.5px', color: '#742A2A', lineHeight: 1.5 }}>
                  If a teacher or caregiver observes any of the following specialist clinical needs, check the box to record a neutral specialist referral reminder on {activeStudent.nickname}’s profile. SpeakUp explicitly states when needs fall outside its educational scope.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px', marginBottom: '14px' }}>
                  {Object.entries(OUT_OF_SCOPE_SPECIALIST_REMINDERS).map(([key, item]) => {
                    const checked = (activeStudent.outOfScopeFlags || []).includes(key);
                    return (
                      <label
                        key={key}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                          background: checked ? '#FED7D7' : '#FFFFFF',
                          border: checked ? '2px solid #C53030' : '1px solid #FEB2B2',
                          borderRadius: '12px',
                          padding: '10px 12px',
                          cursor: 'pointer',
                          fontSize: '12.5px',
                          color: '#742A2A',
                          fontWeight: 800
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleOutOfScopeFlag(key)}
                          style={{ marginTop: '3px', accentColor: '#C53030' }}
                        />
                        <span>{item.title}</span>
                      </label>
                    );
                  })}
                </div>

                {generatedBundle.outOfScopeNotices.length > 0 && (
                  <div style={{ display: 'grid', gap: '10px' }}>
                    {generatedBundle.outOfScopeNotices.map((notice, i) => (
                      <div
                        key={i}
                        style={{
                          background: '#FFFFFF',
                          border: '2px solid #C53030',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          fontSize: '13px',
                          color: '#742A2A'
                        }}
                      >
                        <div style={{ fontWeight: 900, marginBottom: '4px' }}>⚠️ {notice.title}</div>
                        <div style={{ marginBottom: '4px' }}>{notice.notice}</div>
                        <div style={{ fontSize: '12px', color: '#1F8A7E', fontWeight: 800 }}>
                          ✓ What SpeakUp Can Support Instead: {notice.whatSpeakUpCanDoInstead}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* -----------------------------------------------------------------
              SUB-TAB D: PROFESSIONAL SLP COLLABORATION & ACTIVITY HISTORY (5B, 5F, 5G)
             ----------------------------------------------------------------- */}
          {studentSubTab === 'collab-history' && (
            <div style={{ display: 'grid', gap: '20px' }}>
              {/* Clearly Separated Ordinary Classroom Observations vs. SLP Recommendations */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '20px' }}>
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '22px',
                    padding: '24px',
                    border: '2px solid #E2E8F0'
                  }}
                >
                  <span
                    style={{
                      background: '#EBF8F6',
                      color: '#0F766E',
                      fontSize: '11px',
                      fontWeight: 900,
                      padding: '3px 10px',
                      borderRadius: '999px'
                    }}
                  >
                    Educator Record • Non-Clinical
                  </span>
                  <h3 style={{ margin: '8px 0 8px 0', fontSize: '18px', color: '#0E2338', fontWeight: 900 }}>
                    🏫 Ordinary Classroom & Learning Observations
                  </h3>
                  <p style={{ margin: '0 0 10px 0', fontSize: '12.5px', color: '#64748B' }}>
                    Record everyday classroom observations (e.g., which visual cues helped during morning circle, how the student used the AAC board or word tiles).
                  </p>
                  <textarea
                    rows={4}
                    value={activeStudent.classroomObservations || ''}
                    onChange={(e) => updateActiveStudentField('classroomObservations', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '12px',
                      border: '2px solid #CBD5E1',
                      fontSize: '13.5px',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '22px',
                    padding: '24px',
                    border: '2px solid #6366F1'
                  }}
                >
                  <span
                    style={{
                      background: '#EEF2FF',
                      color: '#4338CA',
                      fontSize: '11px',
                      fontWeight: 900,
                      padding: '3px 10px',
                      borderRadius: '999px'
                    }}
                  >
                    Section 5G • Professional Collaboration (Optional)
                  </span>
                  <h3 style={{ margin: '8px 0 8px 0', fontSize: '18px', color: '#0E2338', fontWeight: 900 }}>
                    🩺 Qualified Speech-Language Pathologist (SLP) Recommendations
                  </h3>
                  <p style={{ margin: '0 0 10px 0', fontSize: '12.5px', color: '#64748B' }}>
                    Separate space to record guidance provided by a qualified SLP or specialist (target sounds, pacing, AAC modelling) and agreed follow-up actions.
                  </p>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, color: '#4338CA', marginBottom: '4px' }}>
                    DOCUMENTED SLP GUIDANCE / TARGETS:
                  </label>
                  <textarea
                    rows={3}
                    value={activeStudent.slpRecommendations || ''}
                    onChange={(e) => updateActiveStudentField('slpRecommendations', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '2px solid #C7D2FE',
                      background: '#F8FAFF',
                      fontSize: '13px',
                      fontFamily: 'inherit',
                      marginBottom: '10px'
                    }}
                  />
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, color: '#4338CA', marginBottom: '4px' }}>
                    AGREED FOLLOW-UP ACTIONS & REFERRAL NOTES:
                  </label>
                  <textarea
                    rows={2}
                    value={activeStudent.slpFollowUpActions || ''}
                    onChange={(e) => updateActiveStudentField('slpFollowUpActions', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '2px solid #C7D2FE',
                      background: '#F8FAFF',
                      fontSize: '13px',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>

              {/* Section 5F: Skill-Specific Progress & Review (Non-Diagnostic) */}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '22px',
                  padding: '24px',
                  border: '2px solid #E2E8F0'
                }}
              >
                <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', color: '#0E2338', fontWeight: 900 }}>
                  📈 Skill-Specific Activity Progress & Observations
                </h3>
                <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748B' }}>
                  Tracks concrete activity engagement across SpeakUp modules (never claiming clinical mastery or cure of a speech or language disorder).
                </p>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                    gap: '12px',
                    marginBottom: '22px'
                  }}
                >
                  {[
                    {
                      label: 'WH Questions Answered',
                      val: activeStudent.skillObservations?.receptiveWh || 0,
                      sub: 'Think & Discover (Receptive)',
                      color: '#2BB6A8'
                    },
                    {
                      label: 'Phonics & Spelling Words',
                      val: activeStudent.skillObservations?.phonicsSpelling || 0,
                      sub: 'Sound Garden Flipbook',
                      color: '#F5B82E'
                    },
                    {
                      label: 'Sentences Constructed',
                      val: activeStudent.skillObservations?.sentenceFormulation || 0,
                      sub: 'Sentence Treehouse & Tenses',
                      color: '#6366F1'
                    },
                    {
                      label: 'AAC Messages Assembled',
                      val: activeStudent.skillObservations?.aacCommunication || 0,
                      sub: 'What Do I Need? & Talking Board',
                      color: '#EB655B'
                    },
                    {
                      label: 'Target Word Model Practice',
                      val: activeStudent.skillObservations?.speechModelPractice || 0,
                      sub: 'Speak & Practise (Self-Paced)',
                      color: '#0EA5E9'
                    }
                  ].map((m, i) => (
                    <div
                      key={i}
                      style={{
                        background: '#F8FAFC',
                        borderRadius: '14px',
                        padding: '14px',
                        border: '1px solid #E2E8F0',
                        borderLeft: `5px solid ${m.color}`
                      }}
                    >
                      <div style={{ fontSize: '24px', fontWeight: 900, color: '#0E2338' }}>{m.val} sessions</div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#334155', marginTop: '2px' }}>{m.label}</div>
                      <div style={{ fontSize: '11.5px', color: '#64748B' }}>{m.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Chronological Activity History & Teacher Observation Logger */}
                <h4 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#0E2338', fontWeight: 900 }}>
                  🗂️ Recorded Activity History & Supports Used ({activeStudent.nickname})
                </h4>

                <form
                  onSubmit={handleAddActivityHistoryEntry}
                  style={{
                    display: 'flex',
                    gap: '10px',
                    flexWrap: 'wrap',
                    marginBottom: '16px',
                    background: '#F8FAFC',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid #CBD5E1'
                  }}
                >
                  <select
                    value={newLogEntry.module}
                    onChange={(e) => setNewLogEntry({ ...newLogEntry, module: e.target.value })}
                    style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontWeight: 700 }}
                  >
                    <option value="Think & Discover">Think & Discover</option>
                    <option value="Sound Garden">Sound Garden</option>
                    <option value="Sentence Treehouse">Sentence Treehouse</option>
                    <option value="What Do I Need? (AAC Board)">What Do I Need? (AAC Board)</option>
                    <option value="Speak & Practise">Speak & Practise</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Activity name (e.g., Free AAC Board)"
                    value={newLogEntry.activity}
                    onChange={(e) => setNewLogEntry({ ...newLogEntry, activity: e.target.value })}
                    style={{ flex: '1 1 180px', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  />
                  <input
                    type="text"
                    placeholder="Observation detail (e.g., Built 'I want water' with picture cues)"
                    value={newLogEntry.detail}
                    onChange={(e) => setNewLogEntry({ ...newLogEntry, detail: e.target.value })}
                    style={{ flex: '2 1 260px', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: '#2BB6A8',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    + Log Observation
                  </button>
                </form>

                <div style={{ display: 'grid', gap: '10px' }}>
                  {(activeStudent.activityHistory || []).map((item) => (
                    <div
                      key={item.id}
                      style={{
                        background: '#F8FAFC',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        border: '1px solid #E2E8F0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '10px'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 900, color: '#0E2338' }}>
                          [{item.date}] {item.module} — <span style={{ color: '#1F8A7E' }}>{item.activity}</span>
                        </div>
                        <div style={{ fontSize: '13px', color: '#334155', marginTop: '2px' }}>{item.detail}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {(item.supportsUsed || []).map((sup, idx) => (
                          <span
                            key={idx}
                            style={{
                              background: '#E2E8F0',
                              color: '#334155',
                              fontSize: '11px',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '999px'
                            }}
                          >
                            🛠️ {sup}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 4: SPEECH & LANGUAGE SUPPORT GUIDE (SECTIONS 2 & 3, CATEGORIES A-G)
         ===================================================================== */}
      {teacherTab === 'guide' && (
        <div>
          {/* Guide Introduction & Overlapping Categories Notice */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '24px',
              border: '2px solid #E2E8F0',
              marginBottom: '20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <span
                style={{
                  background: '#EBF8F6',
                  color: '#0F766E',
                  fontSize: '11px',
                  fontWeight: 900,
                  padding: '4px 10px',
                  borderRadius: '999px',
                  textTransform: 'uppercase'
                }}
              >
                Credible Reference Guide • ASHA Practice Portal Aligned
              </span>
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 700 }}>
                Plain-English resource for teachers, caregivers & exhibition visitors
              </span>
            </div>
            <h2 style={{ margin: '4px 0 8px 0', fontSize: '22px', color: '#0E2338', fontWeight: 900 }}>
              📘 Speech, Language & Communication Support Guide (Categories A – G)
            </h2>
            <p style={{ margin: 0, fontSize: '14px', color: '#334155', lineHeight: 1.55 }}>
              This guide explains seven recognized areas of speech, language, and communication needs in plain English, clarifies how they differ (and where they can overlap), and shows what SpeakUp’s four core modules <strong>can</strong> and <strong>cannot</strong> do.{' '}
              <em>
                Note: This classification is not an exhaustive list of all communication disorders. A student may experience more than one area of difficulty, and two students with the same clinical diagnosis may require different classroom learning activities.
              </em>
            </p>
          </div>

          {/* Category Selector Pills (A through G) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '10px',
              marginBottom: '22px'
            }}
          >
            {SPEECH_LANGUAGE_SUPPORT_GUIDE.map((cat) => {
              const active = cat.id === selectedGuideCategory.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedGuideCategoryId(cat.id)}
                  style={{
                    textAlign: 'left',
                    padding: '14px 16px',
                    borderRadius: '16px',
                    border: active ? '2px solid #0E2338' : '2px solid #E2E8F0',
                    background: active ? '#0E2338' : '#FFFFFF',
                    color: active ? '#FFFFFF' : '#0E2338',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{cat.icon}</span>
                  <div>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 900,
                        color: active ? '#A3E4DB' : '#2BB6A8',
                        textTransform: 'uppercase'
                      }}
                    >
                      Category {cat.code}
                    </div>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, lineHeight: 1.25 }}>
                      {(cat.title || cat.categoryName || '').replace(/^[A-G]\.\s*/, '')}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Category Detailed View */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '28px',
              border: '2px solid #CBD5E1',
              boxShadow: '0 8px 24px rgba(14,35,56,0.04)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <span
                style={{
                  fontSize: '36px',
                  background: '#F0FDFB',
                  width: '64px',
                  height: '64px',
                  borderRadius: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #99F6E4'
                }}
              >
                {selectedGuideCategory.icon}
              </span>
              <div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 900,
                    background: '#EBF8F6',
                    color: '#0F766E',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    textTransform: 'uppercase'
                  }}
                >
                  Category {selectedGuideCategory.code} • {selectedGuideCategory.badge || 'Plain-Language Educational Reference'}
                </span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', color: '#0E2338', fontWeight: 900 }}>
                  {selectedGuideCategory.title || selectedGuideCategory.categoryName}
                </h3>
              </div>
            </div>

            {/* 1. Plain-Language Explanation & Sub-distinctions */}
            <div
              style={{
                background: '#F8FAFC',
                borderRadius: '16px',
                padding: '18px 20px',
                border: '1px solid #E2E8F0',
                marginBottom: '20px'
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 900, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Plain-Language Explanation
              </div>
              <p style={{ margin: '0 0 10px 0', fontSize: '14.5px', color: '#0E2338', lineHeight: 1.6, fontWeight: 600 }}>
                {selectedGuideCategory.plainExplanation || selectedGuideCategory.plainLanguageExplanation}
              </p>
              {(selectedGuideCategory.keyDistinction || selectedGuideCategory.badge) && (
                <div
                  style={{
                    background: '#FFFFFF',
                    borderLeft: '4px solid #2BB6A8',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '13.5px',
                    color: '#334155',
                    lineHeight: 1.55
                  }}
                >
                  <strong>Key Clinical Focus:</strong> {selectedGuideCategory.keyDistinction || selectedGuideCategory.badge}
                </div>
              )}
            </div>

            {/* 2. Examples of Student Difficulties & Relevant Learning Goals */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
                gap: '18px',
                marginBottom: '20px'
              }}
            >
              <div
                style={{
                  background: '#FFFBEB',
                  borderRadius: '16px',
                  padding: '18px',
                  border: '1px solid #FDE68A'
                }}
              >
                <h4 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#92400E', fontWeight: 900 }}>
                  🔍 Examples of Difficulties a Student Might Experience
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13.5px', color: '#78350F', lineHeight: 1.6 }}>
                  {(selectedGuideCategory.studentDifficulties || selectedGuideCategory.examplesOfDifficulties || []).map((item, i) => (
                    <li key={i} style={{ marginBottom: '6px' }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                style={{
                  background: '#F0FDFB',
                  borderRadius: '16px',
                  padding: '18px',
                  border: '1px solid #99F6E4'
                }}
              >
                <h4 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#0F766E', fontWeight: 900 }}>
                  🎯 Examples of Relevant Educational Learning Goals
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13.5px', color: '#115E59', lineHeight: 1.6 }}>
                  {(selectedGuideCategory.relevantLearningGoals || []).map((item, i) => (
                    <li key={i} style={{ marginBottom: '6px' }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 3. Which Existing SpeakUp Modules May Support Those Goals & What They CAN and CANNOT Do */}
            <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#0E2338', fontWeight: 900 }}>
              🧩 Relevant SpeakUp Modules: What Each Module CAN and CANNOT Do
            </h4>
            <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
              {(selectedGuideCategory.speakUpModules || selectedGuideCategory.relevantModules || []).map((mod, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#F8FAFC',
                    borderRadius: '16px',
                    padding: '16px 18px',
                    border: '2px solid #E2E8F0'
                  }}
                >
                  <div style={{ fontSize: '15px', fontWeight: 900, color: '#0E2338', marginBottom: '4px' }}>
                    {mod.moduleName}
                  </div>
                  {mod.activity && (
                    <div style={{ fontSize: '13px', color: '#475569', marginBottom: '8px', fontWeight: 600 }}>
                      Activity Focus: {mod.activity}
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
                    <div
                      style={{
                        background: '#F0FDF4',
                        border: '1px solid #BBF7D0',
                        borderRadius: '10px',
                        padding: '10px 12px',
                        fontSize: '13px',
                        color: '#166534'
                      }}
                    >
                      <strong>✅ What It CAN Do:</strong> {mod.canDo}
                    </div>
                    <div
                      style={{
                        background: '#FFF5F5',
                        border: '1px solid #FEB2B2',
                        borderRadius: '10px',
                        padding: '10px 12px',
                        fontSize: '13px',
                        color: '#9B2C2C'
                      }}
                    >
                      <strong>🚫 What It CANNOT Do:</strong> {mod.cannotDo}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 4. When Specialist Assessment Is Necessary */}
            <div
              style={{
                background: '#FFF5F5',
                border: '1px solid #FEB2B2',
                borderRadius: '14px',
                padding: '14px 16px',
                fontSize: '13.5px',
                color: '#742A2A',
                lineHeight: 1.5,
                marginBottom: '20px'
              }}
            >
              <strong>🩺 When Specialist Assessment or Guidance Is Necessary:</strong>
              <div style={{ marginTop: '4px' }}>
                {selectedGuideCategory.specialistGuidanceNote || selectedGuideCategory.whenSpecialistAssessmentNeeded}
              </div>
            </div>

            {/* 5. Verified Professional Sources (ASHA Practice Portal Links) */}
            <div
              style={{
                background: '#0E2338',
                color: '#FFFFFF',
                borderRadius: '16px',
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div>
                <div style={{ fontSize: '11px', fontWeight: 900, color: '#A3E4DB', textTransform: 'uppercase' }}>
                  Verified Clinical & Professional Sources
                </div>
                <div style={{ fontSize: '13.5px', color: '#E2E8F0', marginTop: '2px' }}>
                  Consult the American Speech-Language-Hearing Association (ASHA) Practice Portal for full clinical guidelines:
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {(selectedGuideCategory.sources || []).map((src, i) => (
                  <a
                    key={i}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: '#2BB6A8',
                      color: '#FFFFFF',
                      textDecoration: 'none',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      fontSize: '12.5px',
                      fontWeight: 800
                    }}
                  >
                    🔗 {src.label || src.title} ↗
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 5: CURRICULUM LESSON PLANNER & EDUCATOR PROFILE
         ===================================================================== */}
      {teacherTab === 'planner' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '20px' }}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '22px',
              padding: '24px',
              border: '2px solid #E2E8F0'
            }}
          >
            <h3 style={{ margin: '0 0 14px 0', fontSize: '18px', color: '#0E2338', fontWeight: 900 }}>
              📅 4-Week Cross-Module Curriculum Plan
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {(appState.lessonPlans || []).map((plan) => (
                <div
                  key={plan.id}
                  style={{
                    background: plan.completed ? '#F0FDFB' : '#F8FAFC',
                    border: plan.completed ? '2px solid #2BB6A8' : '1px solid #E2E8F0',
                    borderRadius: '14px',
                    padding: '14px 16px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '15px', color: '#0E2338' }}>
                      {plan.week}: {plan.title}
                    </strong>
                    <button
                      onClick={() => {
                        setAppState((prev) => ({
                          ...prev,
                          lessonPlans: prev.lessonPlans.map((lp) =>
                            lp.id === plan.id ? { ...lp, completed: !lp.completed } : lp
                          )
                        }));
                      }}
                      style={{
                        background: plan.completed ? '#2BB6A8' : '#E2E8F0',
                        color: plan.completed ? '#FFFFFF' : '#334155',
                        border: 'none',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '11.5px',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      {plan.completed ? '✓ Completed' : 'Mark Complete'}
                    </button>
                  </div>
                  <div style={{ fontSize: '13px', color: '#475569', marginTop: '6px' }}>
                    <strong>Objective:</strong> {plan.objectives}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#1F8A7E', marginTop: '4px', fontWeight: 700 }}>
                    <strong>SpeakUp Activities:</strong> {plan.activities}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '22px',
              padding: '24px',
              border: '2px solid #E2E8F0'
            }}
          >
            <h3 style={{ margin: '0 0 14px 0', fontSize: '18px', color: '#0E2338', fontWeight: 900 }}>
              👩‍🏫 Educator & Specialist Collaboration Profile
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 900, color: '#475569', marginBottom: '4px' }}>
                  EDUCATOR NAME
                </label>
                <input
                  type="text"
                  value={appState.teacher?.name || ''}
                  onChange={(e) =>
                    setAppState((prev) => ({
                      ...prev,
                      teacher: { ...prev.teacher, name: e.target.value }
                    }))
                  }
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontWeight: 700 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 900, color: '#475569', marginBottom: '4px' }}>
                  ROLE / DEPARTMENT
                </label>
                <input
                  type="text"
                  value={appState.teacher?.role || ''}
                  onChange={(e) =>
                    setAppState((prev) => ({
                      ...prev,
                      teacher: { ...prev.teacher, role: e.target.value }
                    }))
                  }
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 900, color: '#475569', marginBottom: '4px' }}>
                  EDUCATIONAL PHILOSOPHY & SCOPE COMMITMENT
                </label>
                <textarea
                  rows={4}
                  value={appState.teacher?.bio || ''}
                  onChange={(e) =>
                    setAppState((prev) => ({
                      ...prev,
                      teacher: { ...prev.teacher, bio: e.target.value }
                    }))
                  }
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontFamily: 'inherit' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FOR ADDING A NEW FICTIONAL STUDENT RECORD */}
      {showAddStudentModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(14,35,56,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '28px',
              maxWidth: '520px',
              width: '100%',
              border: '2px solid #2BB6A8'
            }}
          >
            <h3 style={{ margin: '0 0 6px 0', fontSize: '20px', color: '#0E2338', fontWeight: 900 }}>
              + Add Fictional Student Record
            </h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748B' }}>
              Create a fictional student profile to demonstrate personalized learning goals, supports, and activity recommendations.
            </p>
            <form onSubmit={handleCreateFictionalStudent} style={{ display: 'grid', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 900, color: '#475569', marginBottom: '4px' }}>
                  PREFERRED STUDENT NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Maya Tan"
                  value={newStudentDraft.name}
                  onChange={(e) => setNewStudentDraft({ ...newStudentDraft, name: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 900, color: '#475569', marginBottom: '4px' }}>
                  AGE BAND / GRADE
                </label>
                <input
                  type="text"
                  value={newStudentDraft.ageBand}
                  onChange={(e) => setNewStudentDraft({ ...newStudentDraft, ageBand: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 900, color: '#475569', marginBottom: '4px' }}>
                  LEARNING NEEDS SUMMARY
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Working on expanding everyday vocabulary and answering WH questions."
                  value={newStudentDraft.learningNeedsSummary}
                  onChange={(e) => setNewStudentDraft({ ...newStudentDraft, learningNeedsSummary: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontFamily: 'inherit' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 900, color: '#475569', marginBottom: '4px' }}>
                  STRENGTHS & COMMUNICATION PREFERENCES
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Responds well to picture cues and slow audio models."
                  value={newStudentDraft.communicationPreferences}
                  onChange={(e) => setNewStudentDraft({ ...newStudentDraft, communicationPreferences: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontFamily: 'inherit' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  style={{
                    background: '#E2E8F0',
                    color: '#334155',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '10px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#2BB6A8',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '10px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Create Student Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
