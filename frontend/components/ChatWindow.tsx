import React, { useState, useRef, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message, SessionPhase } from '../types';
import CommCoachInfographic from './CommCoachInfographic';
import ChatMessages from './chat/ChatMessages';
import ChatInput from './chat/ChatInput';
import VoiceOverlay from './chat/VoiceOverlay';
import { createPcmBlob } from '../audioUtils';
import {
  Brain,
  Search,
  Mic,
  StopCircle,
  Volume2
} from 'lucide-react';

interface AssessmentStructuredData {
  skillFocus: string;
  confidenceLevel: number;
  challenges: string;
  practiceTime: string;
  contentConsumed: {
    type: string;
    source: string;
    title: string;
    actionability: number;
  };
  metadata: {
    role: string;
    industry: string;
    feedbackPreference: string;
  };
}

interface ChatWindowProps {
  messages: Message[];
  onSend: (text: string, useThinking?: boolean, useSearch?: boolean) => void;
  onAddManualMessage: (role: 'user' | 'assistant', content: string) => void;
  isVoiceMode: boolean;
  phase: SessionPhase;
  onStartAssessment?: () => void;
  onStartMentorsLab?: () => void;
  onStartMeetingAgent?: () => void;
  isThinking?: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSend,
  onAddManualMessage,
  phase,
  onStartAssessment,
  onStartMentorsLab,
  onStartMeetingAgent,
  isThinking: appIsThinking
}) => {
  const [input, setInput] = useState('');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isConnectingVoice, setIsConnectingVoice] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [deepThinking, setDeepThinking] = useState(false);
  const [searchGrounding, setSearchGrounding] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);
  const [showKeySettings, setShowKeySettings] = useState(false);
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('user_gemini_key') || '');
  const [autoSpeak, setAutoSpeak] = useState(localStorage.getItem('user_auto_speak') === 'true');

  // Antigravity State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AssessmentStructuredData | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Transcription Buffers
  const [inputFeedback, setInputFeedback] = useState('');
  const [outputFeedback, setOutputFeedback] = useState('');
  const inputFeedbackRef = useRef('');
  const outputFeedbackRef = useRef('');

  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);

  const isInitialChat = (phase === SessionPhase.CHAT) && messages.length === 0;

  const sendToAntigravity = async (transcript: string): Promise<AssessmentStructuredData | null> => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_BASE}/api/antigravity/analyze-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          userId: 'user_current',
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const data: AssessmentStructuredData = await response.json();
      return data;
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error during analysis';
      setAnalysisError(msg);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAssessmentComplete = async () => {
    if (messages.length === 0) return;
    const transcript = messages
      .map((msg) => `${msg.role === 'user' ? 'USER' : 'COACH'}: ${msg.content}`)
      .join('\n');

    const result = await sendToAntigravity(transcript);
    if (result) {
      setAnalysisResult(result);
    }
  };

  const handleTts = async (text: string, msgId: string) => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(msgId);
    try {
      // TTS requires backend audio proxy implementation
      console.warn("TTS temporarily disabled for security refactor");
      setIsPlayingAudio(null);
    } catch (e) {
      console.error(e);
      setIsPlayingAudio(null);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || appIsThinking || isAnalyzing) return;

    // We need to support the initial chat view's input as well
    const text = input;
    setInput('');
    onSend(text, deepThinking, searchGrounding);
  };

  const recognitionRef = useRef<any>(null);

  const initRecognition = (socket: Socket) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
        else interimTranscript += event.results[i][0].transcript;
      }
      const currentText = finalTranscript || interimTranscript;
      if (currentText) {
        console.log('[Voice] Transcribed:', currentText);
        setInputFeedback(currentText);
        inputFeedbackRef.current = currentText;
        if (socket?.connected) {
          socket.emit('speech-text', {
            text: currentText,
            isFinal: !!finalTranscript,
            userId: 'user_current',
            userApiKey: geminiKey
          });
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error('STT Error:', event.error);
      if (event.error === 'not-allowed') setVoiceError('Microphone access denied.');
    };

    recognition.onend = () => {
      if (sessionRef.current?.connected) {
        try { recognition.start(); } catch (e) { }
      }
    };

    recognitionRef.current = recognition;
    return recognition;
  };




  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;

    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.pitch = 1.0;

    // Find a good voice (preferably a professional sounding one)
    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Premium')) || voices[0];
    if (premiumVoice) utterance.voice = premiumVoice;

    window.speechSynthesis.speak(utterance);
  };

  const startVoiceSession = async () => {
    if (isSessionActive) {
      stopVoiceSession();
      return;
    }
    setVoiceError(null);
    setIsConnectingVoice(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const SOCKET_BASE = API_URL.replace('/api', '');
      const socket: Socket = io(SOCKET_BASE);
      sessionRef.current = socket;

      socket.on('connect', async () => {
        console.log('[Voice] Socket connected');
        const recognition = initRecognition(socket);
        if (recognition) {
          try { recognition.start(); } catch (e) {
            console.error("Failed to start STT:", e);
          }
        }
        socket.emit('start-voice', { userId: 'user_current' });
        setIsSessionActive(true);
        setIsConnectingVoice(false);
      });

      socket.on('voice-error', (data: { code: string, message: string }) => {
        if (data.code === 'KEY_REQUIRED') {
          setVoiceError(data.message);
          setShowKeySettings(true);
          stopVoiceSession();
        }
      });

      socket.on('voice-response', (data: { text: string; shouldSpeak?: boolean }) => {
        setOutputFeedback(data.text);
        if (data.shouldSpeak !== false || autoSpeak) {
          speakText(data.text);
          onAddManualMessage('assistant', data.text);
        }
      });

      socket.on('connect_error', (err) => {
        console.error('[Voice] Connection error:', err);
        setVoiceError('Failed to connect to Voice Server.');
        setIsConnectingVoice(false);
      });

    } catch (err) {
      console.error(err);
      setVoiceError('Failed to access microphone or connect to AI.');
      setIsConnectingVoice(false);
    }
  };

  const stopVoiceSession = () => {
    setIsSessionActive(false);
    setIsConnectingVoice(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch (e) { }
      recognitionRef.current = null;
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    if (sessionRef.current) {
      try { sessionRef.current.close(); } catch (e) { }
      sessionRef.current = null;
    }

    // Clear feedbacks
    inputFeedbackRef.current = '';
    outputFeedbackRef.current = '';
    setInputFeedback('');
    setOutputFeedback('');
  };

  if (isInitialChat) {
    return (
      <div className="relative flex-1 flex flex-col items-center bg-[#f8fafc] overflow-y-auto px-4 md:px-6 custom-scrollbar scroll-smooth">
        <div className="w-full max-w-4xl pt-12 md:pt-24 pb-6 text-center animate-in fade-in slide-in-from-bottom-6 duration-700 z-10">
          <div className="flex items-center justify-center space-x-2 mb-4 md:mb-6">
            <div className="text-indigo-600 bg-white/60 p-2 md:p-3 rounded-xl backdrop-blur-md border border-white/60">
              <Brain className="w-6 h-6" />
            </div>
            <h2 className="text-2xl md:text-4xl font-light tracking-tight text-slate-400">Hello, <span className="font-semibold text-slate-900">Communicator</span></h2>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-800 tracking-tight leading-tight">
            How can I refine your<br />expression today?
          </h1>
        </div>

        <CommCoachInfographic
          onStartAssessment={onStartAssessment}
          onStartMentorsLab={onStartMentorsLab}
          onStartPracticeHub={startVoiceSession}
          onStartMeetingIntelligence={onStartMeetingAgent}
        />

        <div className="w-full max-w-3xl pb-12 z-20 mt-8">
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 space-y-8">
            <form onSubmit={handleSend} className="space-y-6">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask for advice or start a drill..."
                className="w-full h-24 bg-transparent border-none outline-none focus:ring-0 text-xl font-medium text-slate-800 placeholder-slate-300 resize-none"
              />
              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <div className="flex space-x-4">
                  <button type="button" onClick={() => setDeepThinking(!deepThinking)} className={`p-3 rounded-xl flex items-center space-x-2 transition-all ${deepThinking ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
                    <Brain className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase">Thinking Mode</span>
                  </button>
                  <button type="button" onClick={() => setSearchGrounding(!searchGrounding)} className={`p-3 rounded-xl flex items-center space-x-2 transition-all ${searchGrounding ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
                    <Search className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase">Search</span>
                  </button>
                </div>
                <div className="flex space-x-3">
                  <button type="button" onClick={startVoiceSession} className={`p-4 rounded-full transition-all ${isSessionActive ? 'bg-red-500 text-white animate-pulse' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}>
                    {isSessionActive ? <StopCircle className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const newVal = !autoSpeak;
                      setAutoSpeak(newVal);
                      localStorage.setItem('user_auto_speak', String(newVal));
                    }}
                    title="Auto-Speak Responses"
                    className={`p-4 rounded-full transition-all ${autoSpeak ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
                  >
                    <Volume2 className="w-6 h-6" />
                  </button>
                  <button type="submit" disabled={!input.trim()} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black disabled:opacity-30">Send</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-[#fcfdfe] relative overflow-hidden">
      <VoiceOverlay
        isSessionActive={isSessionActive}
        onStopVoiceSession={stopVoiceSession}
        isConnectingVoice={isConnectingVoice}
        voiceError={voiceError}
        setVoiceError={setVoiceError}
        inputFeedback={inputFeedback}
        outputFeedback={outputFeedback}
      />

      <ChatMessages
        messages={messages}
        phase={phase}
        isPlayingAudio={isPlayingAudio}
        onTts={handleTts}
        isAnalyzing={isAnalyzing}
        analysisResult={analysisResult}
        analysisError={analysisError}
        appIsThinking={!!appIsThinking}
        onAssessmentComplete={handleAssessmentComplete}
      />

      <ChatInput
        onSend={onSend}
        isAnalyzing={isAnalyzing}
        isSessionActive={isSessionActive}
        onStartVoiceSession={startVoiceSession}
        deepThinking={deepThinking}
        setDeepThinking={setDeepThinking}
        searchGrounding={searchGrounding}
        setSearchGrounding={setSearchGrounding}
        appIsThinking={appIsThinking}
        onShowKeySettings={() => setShowKeySettings(true)}
      />

      {/* Key Settings Modal */}
      {showKeySettings && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black text-slate-900 mb-2">Gemini API Key Required</h3>
            <p className="text-sm text-slate-500 mb-6">To support a larger audience, please provide your own free Gemini API key from Google AI Studio.</p>

            <input
              type="password"
              placeholder="AIza..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm font-bold focus:border-indigo-500 outline-none mb-6"
            />

            <div className="flex gap-4">
              <button
                onClick={() => {
                  localStorage.setItem('user_gemini_key', geminiKey);
                  setShowKeySettings(false);
                }}
                className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black"
              >
                Save Key
              </button>
              <button
                onClick={() => setShowKeySettings(false)}
                className="px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest text-slate-400 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>

            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="block text-center mt-6 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
            >
              Get Free Key from AI Studio →
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
