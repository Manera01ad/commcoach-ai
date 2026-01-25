import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import AuthRouter from './pages/auth/AuthRouter';
import ProtectedRoute from './components/ProtectedRoute';
import { SessionPhase, Message, SessionState, UserProfile } from './types';
import ChatWindow from './components/MeetingLab/ChatWindow';
import Header from './components/MeetingLab/Header';
import RecapScreen from './components/MeetingLab/RecapScreen';
import MentorsLab from './components/MeetingLab/MentorsLab';
import MeetingAgent from './components/MeetingLab/MeetingAgent';
import ProfileDashboard from './components/MeetingLab/ProfileDashboard';
import BrowserWindow from './components/AgentBrowser/BrowserWindow';
import { getGenerativeModelProxy } from './services/apiClient';
import Dashboard from './pages/Dashboard';
import TherapyDashboard from './pages/TherapyDashboard';
import { SYSTEM_INSTRUCTION, ASSESSMENT_QUESTIONS } from './constants';
import LandingPage from './pages/LandingPage';


// Adapter for legacy geminiApi usage
const geminiApi = getGenerativeModelProxy();

const DEFAULT_PROFILE: UserProfile = {
  name: 'User One',
  level: 12,
  currentXP: 4500,
  nextLevelXP: 5000,
  streak: 5,
  totalSessions: 42,
  eloScore: 1450,
  skills: { clarity: 82, persuasion: 65, empathy: 74, publicSpeaking: 58 },
  cloneConfig: {
    assertiveness: 70,
    empathy: 85,
    openness: 60,
    stability: 90,
    vocabularyComplexity: 60,
    vocalPitch: 'medium',
    pacing: 80,
    fillerTolerance: 5,
    idealPersona: 'Executive Leader',
    directness: 80,
    riskAppetite: 40,
    structurePreference: 90,
    visualArchetype: 'Professional',
    visualTheme: 'Indigo',
    humorLevel: 40,
    analyticalDepth: 70,
    formality: 80
  },
  growthGoals: ['Public Speaking', 'Clarity', 'Empathy', 'Persuasion']
};

/**
 * Main Application Component
 * Handles routing and authentication flow
 */
const MainApp: React.FC = () => {
  const [session, setSession] = useState<SessionState>({
    sessionId: `sess_${Math.random().toString(36).substring(2, 11)}`,
    phase: SessionPhase.CHAT,
    assessmentStep: 0,
    data: { skillLevel: 1 },
    messages: [],
    metrics: { clarityScore: 70, confidenceLevel: 3, fillerWordCount: 0, fillersPer100: 0, pacingScore: 0, emotionalTone: 'Neutral', emotionalValence: 0, topicRelevance: 0, engagementQuality: 0, hesitationPatterns: 0, complexityScore: 0 },
    userProfile: DEFAULT_PROFILE,
    historyTrends: { previousClarity: [65, 72, 68, 75, 70], previousConfidence: [2, 3, 3, 4, 3], pacingHistory: [120, 140, 135, 145, 138], fillerHistory: [8, 6, 9, 5, 4] }
  });

  const [isThinking, setIsThinking] = useState(false);
  const [showBrowser, setShowBrowser] = useState(false);
  const [browserStep, setBrowserStep] = useState<any>(null);
  const [browserLogs, setBrowserLogs] = useState<string[]>([]);

  const switchPhase = (newPhase: SessionPhase) => {
    if (newPhase === SessionPhase.CHAT) {
      setSession(prev => ({
        ...prev,
        phase: newPhase,
        messages: [],
        assessmentStep: 0
      }));
      return;
    }

    setSession(prev => ({ ...prev, phase: newPhase }));

    if (newPhase === SessionPhase.ASSESSMENT) {
      const firstQuestion = ASSESSMENT_QUESTIONS[0];
      setSession(prev => ({
        ...prev,
        messages: [{
          id: 'assessment_start',
          role: 'assistant',
          content: `### 30-Day Communication Mastery\n\nWelcome to Day 1. We will begin with two foundational protocols to map your current Communication DNA.\n\n**Day 1, Protocol 1:** ${firstQuestion}`,
          timestamp: new Date()
        }],
        assessmentStep: 0
      }));
    }
  };

  const generateAIResponse = async (userText: string, instruction: string, useThinking: boolean = false, useSearch: boolean = false, model?: string) => {
    setIsThinking(true);
    const messageId = Date.now().toString();
    setSession(prev => ({
      ...prev,
      messages: [...prev.messages, { id: messageId, role: 'assistant', content: '', timestamp: new Date() }]
    }));

    try {
      let fullContent = "";

      const config: any = {};
      if (useThinking) config.model = 'gemini-2.0-flash-thinking-exp-01-21';
      if (model) config.model = model;
      if (useSearch) {
        // Force research agent in orchestrator via a specific prefix or config
        userText = `RESEARCH: ${userText}`;
      }

      await geminiApi.streamContent(userText, session.sessionId, (chunk: string) => {
        if (chunk.startsWith('[BROWSER_EVENT]')) {
          try {
            const eventData = JSON.parse(chunk.replace('[BROWSER_EVENT]', ''));
            setShowBrowser(true);
            setBrowserStep(eventData);
            if (eventData.description) {
              setBrowserLogs(prev => [...prev, eventData.description]);
            }

            if (eventData.type === 'think' && eventData.description.includes('Synthesizing')) {
              setTimeout(() => setShowBrowser(false), 5000);
            }
          } catch (e) {
            console.error("Failed to parse browser event", e);
          }
        } else {
          fullContent += chunk;
          setSession(prev => ({
            ...prev,
            messages: prev.messages.map(m =>
              m.id === messageId ? { ...m, content: fullContent } : m
            )
          }));
        }
      }, config);

    } catch (err) {
      console.error(err);
      setSession(prev => ({
        ...prev,
        messages: [...prev.messages, {
          id: Date.now().toString(),
          role: 'assistant',
          content: "⚠️ Connection Error: Please make sure the backend is running.",
          timestamp: new Date()
        }]
      }));
    } finally {
      setIsThinking(false);
    }
  };

  const handleSendMessage = (text: string, useThinking: boolean = false, useSearch: boolean = false, model?: string) => {
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() };

    if (session.phase === SessionPhase.ASSESSMENT) {
      const nextStep = session.assessmentStep + 1;
      const isComplete = nextStep >= ASSESSMENT_QUESTIONS.length;

      setSession(prev => ({
        ...prev,
        messages: [...prev.messages, userMsg],
        assessmentStep: nextStep
      }));

      if (!isComplete) {
        // Check if we just finished 2 steps (a full day)
        const currentDaySteps = nextStep % 2;
        if (currentDaySteps === 0) {
          // Day completed!
          const dayNumber = nextStep / 2;
          setTimeout(() => {
            setSession(prev => ({
              ...prev,
              messages: [...prev.messages, {
                id: Date.now().toString(),
                role: 'assistant',
                content: `🚀 **Day ${dayNumber} Complete!** You've fortified your Communication DNA today. Your streak has been updated.\n\nSee you tomorrow for Day ${dayNumber + 1}!`,
                timestamp: new Date()
              }]
            }));
            // Report activity to backend for streak/XP
            geminiApi.reportActivity(2);
          }, 600);
          return;
        }

        const nextQuestion = ASSESSMENT_QUESTIONS[nextStep];
        setTimeout(() => {
          setSession(prev => ({
            ...prev,
            messages: [...prev.messages, {
              id: Date.now().toString(),
              role: 'assistant',
              content: `**Day ${Math.floor(nextStep / 2) + 1}, Protocol ${nextStep + 1}:** ${nextQuestion}`,
              timestamp: new Date()
            }]
          }));
        }, 600);
      } else {
        switchPhase(SessionPhase.RECAP);
      }
    } else {
      setSession(prev => ({ ...prev, messages: [...prev.messages, userMsg] }));

      let currentInstruction = SYSTEM_INSTRUCTION;
      if (text.includes('[LIBRARY SEARCH')) {
        currentInstruction += "\n\nYou are helping the user find specific training videos from the mentioned YouTube channel. Use Google Search to find direct video links, titles, and brief descriptions from that channel. Focus on Aleena Rais Live content if requested.";
      }

      generateAIResponse(text, currentInstruction, useThinking, useSearch, model);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 font-['Inter'] overflow-hidden transition-colors duration-300">
      <Header
        phase={session.phase}
        isVoiceMode={false}
        onReset={() => switchPhase(SessionPhase.CHAT)}
        onSwitchPhase={switchPhase}
      />
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        <main className="flex-1 flex flex-col min-h-0 relative h-full">
          {session.phase === SessionPhase.RECAP && (
            <RecapScreen session={session} onDone={() => switchPhase(SessionPhase.CHAT)} />
          )}
          {session.phase === SessionPhase.MENTORS && (
            <MentorsLab
              messages={session.messages}
              onSendMessage={handleSendMessage}
              onAddManualMessage={(r, c) => setSession(p => ({ ...p, messages: [...p.messages, { id: Date.now().toString(), role: r, content: c, timestamp: new Date() }] }))}
              isThinking={isThinking}
            />
          )}
          {session.phase === SessionPhase.AGENT && (
            <MeetingAgent />
          )}
          {session.phase === SessionPhase.PROFILE && (
            <Dashboard />
          )}
          {session.phase === (SessionPhase as any).THERAPY_DASHBOARD && (
            <TherapyDashboard />
          )}
          {(session.phase === SessionPhase.CHAT || session.phase === SessionPhase.ASSESSMENT) && (
            <ChatWindow
              messages={session.messages}
              onSend={handleSendMessage}
              onAddManualMessage={(r, c) => setSession(p => ({ ...p, messages: [...p.messages, { id: Date.now().toString(), role: r, content: c, timestamp: new Date() }] }))}
              isVoiceMode={false}
              phase={session.phase}
              isThinking={isThinking}
              onStartAssessment={() => switchPhase(SessionPhase.ASSESSMENT)}
              onStartMentorsLab={() => switchPhase(SessionPhase.MENTORS)}
              onStartMeetingAgent={() => switchPhase(SessionPhase.AGENT)}
              setSession={setSession}
            />
          )}

          <BrowserWindow
            isVisible={showBrowser}
            onClose={() => setShowBrowser(false)}
            currentStep={browserStep}
            logs={browserLogs}
          />
        </main>
      </div>
    </div>
  );
};

/**
 * App Component with Router
 * Handles authentication routing
 */

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthRouter />} />

        {/* Protected Routes - Require Authentication */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainApp />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
