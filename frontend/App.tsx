import React, { useState } from 'react';
import { useAuth } from './src/contexts/AuthContext';
import AuthRouter from './src/pages/auth/AuthRouter';
import { SessionPhase, Message, SessionState, UserProfile } from './types';
import ChatWindow from './components/ChatWindow';
import Header from './components/Header';
import RecapScreen from './components/RecapScreen';
import MentorsLab from './components/MentorsLab';
import MeetingAgent from './components/MeetingAgent';
import ProfileDashboard from './components/ProfileDashboard';
import VisionLab from './components/VisionLab';
import BrowserWindow from './src/components/AgentBrowser/BrowserWindow'; // Import Browser Window
import { getGenerativeModelProxy } from './src/services/apiClient'; // Updated import
import { SYSTEM_INSTRUCTION, ASSESSMENT_QUESTIONS } from './src/constants'; // This file needs to exist

// Adapter for legacy geminiApi usage
const geminiApi = getGenerativeModelProxy();

const DEFAULT_PROFILE: UserProfile = {
  name: 'User One',
  level: 12,
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

const App: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

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

  // New State for Agent Browser
  const [showBrowser, setShowBrowser] = useState(false);
  const [browserStep, setBrowserStep] = useState<any>(null);
  const [browserLogs, setBrowserLogs] = useState<string[]>([]);

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth pages if not authenticated
  if (!isAuthenticated) {
    return <AuthRouter />;
  }

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
          content: `### Diagnostic Lab: Entry Protocol\n\nWelcome to your performance evaluation. I will run a series of communication drills to identify your hidden gaps.\n\n**Protocol 1:** ${firstQuestion}`,
          timestamp: new Date()
        }],
        assessmentStep: 0
      }));
    }
  };

  const generateAIResponse = async (userText: string, instruction: string, useThinking: boolean = false, useSearch: boolean = false) => {
    setIsThinking(true);
    // Create a placeholder message for the stream
    const messageId = Date.now().toString();
    setSession(prev => ({
      ...prev,
      messages: [...prev.messages, { id: messageId, role: 'assistant', content: '', timestamp: new Date() }]
    }));

    try {
      let fullContent = "";

      // Use Streaming API
      await geminiApi.streamContent(userText, (chunk: string) => {
        // Check for Browser Events
        if (chunk.startsWith('[BROWSER_EVENT]')) {
          try {
            const eventData = JSON.parse(chunk.replace('[BROWSER_EVENT]', ''));
            setShowBrowser(true);
            setBrowserStep(eventData);
            if (eventData.description) {
              setBrowserLogs(prev => [...prev, eventData.description]);
            }

            // Auto-hide browser after 'think' event (logic can be refined)
            if (eventData.type === 'think' && eventData.description.includes('Synthesizing')) {
              setTimeout(() => setShowBrowser(false), 5000);
            }
          } catch (e) {
            console.error("Failed to parse browser event", e);
          }
        } else {
          // Normal Text Content
          fullContent += chunk;
          setSession(prev => ({
            ...prev,
            messages: prev.messages.map(m =>
              m.id === messageId ? { ...m, content: fullContent } : m
            )
          }));
        }
      });

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

  const handleSendMessage = (text: string) => {
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
        const nextQuestion = ASSESSMENT_QUESTIONS[nextStep];
        setTimeout(() => {
          setSession(prev => ({
            ...prev,
            messages: [...prev.messages, {
              id: Date.now().toString(),
              role: 'assistant',
              content: `**Protocol ${nextStep + 1}:** ${nextQuestion}`,
              timestamp: new Date()
            }]
          }));
        }, 600);
      } else {
        switchPhase(SessionPhase.RECAP);
      }
    } else {
      setSession(prev => ({ ...prev, messages: [...prev.messages, userMsg] }));

      // We rely on backend intent classification for research now
      let currentInstruction = SYSTEM_INSTRUCTION;
      if (text.includes('[LIBRARY SEARCH')) {
        currentInstruction += "\n\nYou are helping the user find specific training videos from the mentioned YouTube channel. Use Google Search to find direct video links, titles, and brief descriptions from that channel. Focus on Aleena Rais Live content if requested.";
      }

      generateAIResponse(text, currentInstruction);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 font-['Inter'] overflow-hidden transition-colors duration-300">
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
          {session.phase === SessionPhase.VISION && (
            <VisionLab />
          )}
          {session.phase === SessionPhase.PROFILE && (
            <ProfileDashboard
              profile={session.userProfile}
              onUpdateProfile={(p) => setSession(prev => ({ ...prev, userProfile: p }))}
            />
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
            />
          )}

          {/* Agent Browser Overlay */}
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

export default App;
