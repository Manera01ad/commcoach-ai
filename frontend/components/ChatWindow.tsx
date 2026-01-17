import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message, SessionPhase } from '../types';
// import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai'; // Removed for security
import { SYSTEM_INSTRUCTION, ASSESSMENT_QUESTIONS } from '../constants';
import { decode, decodeAudioData, createPcmBlob } from '../audioUtils';
import { marked } from 'marked';
import CommCoachInfographic from './CommCoachInfographic';
import {
  Brain,
  Search,
  Volume2,
  Mic,
  StopCircle,
  Loader2,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Youtube,
  X,
  Waves,
  MicOff
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
  onSend: (text: string) => void;
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

  // Antigravity State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AssessmentStructuredData | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Transcription Buffers
  const [inputFeedback, setInputFeedback] = useState('');
  const [outputFeedback, setOutputFeedback] = useState('');
  const inputFeedbackRef = useRef('');
  const outputFeedbackRef = useRef('');

  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const isInitialChat = (phase === SessionPhase.CHAT) && messages.length === 0;

  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }, 100);
    }
  }, [messages, inputFeedback, outputFeedback, appIsThinking, isAnalyzing, analysisResult]);

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
      /* 
      // LEGACY INSECURE CODE:
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say clearly: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } }
        }
      });
      // ... handling logic ...
      */
    } catch (e) {
      console.error(e);
      setIsPlayingAudio(null);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || appIsThinking || isAnalyzing) return;

    const text = input;
    setInput('');
    onSend(text);
  };

  const startVoiceSession = async () => {
    if (isSessionActive) {
      stopVoiceSession();
      return;
    }
    setVoiceError(null);
    setIsConnectingVoice(true);
    try {
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Voice Session requires backend WebSocket proxy implementation
      setVoiceError("Voice Mode disabled during security maintenance.");
      setIsConnectingVoice(false);

      /*
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const sessionPromise = ai.live.connect({
        // ... params ...
      });
      sessionRef.current = await sessionPromise;
      */
    } catch (err) {
      console.error(err);
      setVoiceError('Failed to access microphone or connect to AI.');
      setIsConnectingVoice(false);
    }
  };

  const stopVoiceSession = () => {
    setIsSessionActive(false);
    setIsConnectingVoice(false);
    if (processorRef.current) {
      try { processorRef.current.disconnect(); } catch (e) { }
      processorRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      if (audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => { });
      }
      audioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      if (outputAudioContextRef.current.state !== 'closed') {
        outputAudioContextRef.current.close().catch(() => { });
      }
      outputAudioContextRef.current = null;
    }
    if (sessionRef.current) {
      try { sessionRef.current.close(); } catch (e) { }
      sessionRef.current = null;
    }

    // Clear refs
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
      {/* Voice Active Overlay */}
      {isSessionActive && (
        <div className="absolute inset-0 z-[60] bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
          <div className="w-full max-w-2xl flex flex-col items-center space-y-12">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-[60px] animate-pulse" />
              <div className="w-32 h-32 bg-indigo-600 rounded-[3rem] flex items-center justify-center text-white shadow-2xl relative z-10 border-4 border-white/10 overflow-hidden">
                <Waves className="w-16 h-16 animate-pulse" />
              </div>
            </div>

            <div className="text-center space-y-4">
              <h3 className="text-2xl font-black text-white tracking-tight uppercase">Voice Practice Hub Active</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Live Coaching & Transcription Engine</p>
            </div>

            <div className="w-full space-y-8">
              {/* User Speech Bubble */}
              <div className="min-h-[100px] p-8 bg-white/5 rounded-[2.5rem] border border-white/10 flex flex-col">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Mic className="w-3 h-3" /> Listening for Input
                </span>
                <p className="text-xl font-medium text-slate-200 leading-relaxed italic">
                  {inputFeedback || "Begin speaking your strategic inquiry..."}
                </p>
              </div>

              {/* AI Response Bubble */}
              <div className="min-h-[100px] p-8 bg-indigo-600/20 rounded-[2.5rem] border border-indigo-500/20 flex flex-col">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Brain className="w-3 h-3" /> Assistant Response
                </span>
                <p className="text-xl font-medium text-white leading-relaxed">
                  {outputFeedback || "I am analyzing your delivery patterns..."}
                </p>
              </div>
            </div>

            <button
              onClick={stopVoiceSession}
              className="bg-white text-slate-900 px-12 py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-slate-100 active:scale-95 transition-all flex items-center gap-3"
            >
              <StopCircle className="w-5 h-5 text-red-500" /> End Practice Session
            </button>
          </div>
        </div>
      )}

      {/* Connection Loader */}
      {isConnectingVoice && (
        <div className="absolute inset-0 z-[70] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="w-16 h-16 bg-indigo-600 rounded-3xl shadow-2xl flex items-center justify-center mb-6">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Calibrating Neural Sync...</p>
        </div>
      )}

      {voiceError && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[80] bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-4 text-rose-600 shadow-2xl animate-in slide-in-from-top-4">
          <AlertCircle className="w-5 h-5" />
          <p className="text-xs font-black uppercase tracking-widest">{voiceError}</p>
          <button onClick={() => setVoiceError(null)} className="p-1 hover:bg-rose-100 rounded-lg"><X className="w-4 h-4" /></button>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 scroll-smooth custom-scrollbar">
        <div className="max-w-5xl mx-auto w-full pb-24">
          {messages.map((msg) => (
            <div key={msg.id} className="mb-12">
              <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in`}>
                {msg.role === 'assistant' && <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mr-3 mt-1 shadow-sm border border-slate-100 text-indigo-500 shrink-0"><Brain className="w-5 h-5" /></div>}
                <div className={`max-w-[85%] p-6 rounded-2xl relative ${msg.role === 'user' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-800 border border-slate-100 shadow-sm'}`}>
                  <div className="prose-sm" dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) }} />
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => handleTts(msg.content, msg.id)}
                      className={`absolute -bottom-10 right-0 p-2 rounded-lg transition-all ${isPlayingAudio === msg.id ? 'text-indigo-600' : 'text-slate-300 hover:text-slate-600'}`}
                    >
                      <Volume2 className={`w-4 h-4 ${isPlayingAudio === msg.id ? 'animate-pulse' : ''}`} />
                    </button>
                  )}
                </div>
              </div>
              {msg.groundingUrls && msg.groundingUrls.length > 0 && (
                <div className="mt-6 ml-14 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                  {msg.groundingUrls.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                          <Youtube className="w-4 h-4" />
                        </div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Video Resource</div>
                      </div>
                      <h4 className="text-xs font-black text-slate-800 line-clamp-2 mb-3 group-hover:text-indigo-600 transition-colors">{link.title}</h4>
                      <div className="mt-auto flex items-center text-[9px] font-black text-indigo-500 uppercase tracking-widest">
                        Watch on YouTube <ExternalLink className="w-3 h-3 ml-1" />
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Assessment Wrap-up Trigger */}
          {phase === SessionPhase.ASSESSMENT && !isAnalyzing && !analysisResult && messages.length > 5 && (
            <div className="flex justify-center py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <button
                onClick={handleAssessmentComplete}
                className="group flex items-center space-x-3 bg-slate-900 text-white px-8 py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-black hover:scale-[1.02] transition-all"
              >
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                <span>Analyze Diagnostic Lab</span>
              </button>
            </div>
          )}

          {/* Antigravity Loading State */}
          {isAnalyzing && (
            <div className="flex flex-col items-center justify-center space-y-4 py-12 animate-in fade-in">
              <div className="w-16 h-16 bg-white rounded-3xl shadow-xl flex items-center justify-center border border-indigo-100">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              </div>
              <div className="text-center">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Antigravity Synthesis</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Parsing transcript for behavioral markers...</p>
              </div>
            </div>
          )}

          {/* Antigravity Results Display */}
          {analysisResult && (
            <div className="max-w-3xl mx-auto bg-white rounded-[3.5rem] border border-indigo-100 shadow-2xl p-10 mt-8 mb-12 animate-in zoom-in-95 duration-700">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><BarChart3 className="w-6 h-6" /></div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Diagnostic Summary.</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Antigravity Engine Output</p>
                  </div>
                </div>
                <div className="bg-indigo-50 px-4 py-2 rounded-xl text-indigo-600 font-black text-[10px] uppercase tracking-widest border border-indigo-100">
                  Confidence: {analysisResult.confidenceLevel}/5
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Primary Focus</label>
                    <div className="text-lg font-black text-slate-800 tracking-tight">{analysisResult.skillFocus}</div>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Core Challenges</label>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">{analysisResult.challenges}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-indigo-600 text-white rounded-3xl shadow-xl">
                    <label className="text-[9px] font-black text-indigo-300 uppercase tracking-widest block mb-2">Top Recommendation</label>
                    <div className="text-sm font-black mb-1">{analysisResult.contentConsumed.title}</div>
                    <div className="text-[10px] font-bold opacity-70">Source: {analysisResult.contentConsumed.source}</div>
                    <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/10">
                      <span className="text-[9px] font-black uppercase tracking-widest">Actionability</span>
                      <span className="text-xs font-black">{analysisResult.contentConsumed.actionability}/5</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-700 space-x-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Data synced to Dashboard</span>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-10 border-t border-slate-100">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-[8px] font-black text-slate-400 uppercase mb-1">Role</div>
                    <div className="text-xs font-black text-slate-800">{analysisResult.metadata.role}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[8px] font-black text-slate-400 uppercase mb-1">Industry</div>
                    <div className="text-xs font-black text-slate-800">{analysisResult.metadata.industry}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[8px] font-black text-slate-400 uppercase mb-1">Practice</div>
                    <div className="text-xs font-black text-slate-800">{analysisResult.practiceTime}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {analysisError && (
            <div className="max-w-xl mx-auto p-6 bg-rose-50 border border-rose-100 rounded-3xl flex items-center space-x-4 text-rose-600 mb-8 animate-in shake duration-500">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest">Analysis Failure</h4>
                <p className="text-[10px] font-bold opacity-80">{analysisError}</p>
              </div>
              <button onClick={handleAssessmentComplete} className="ml-auto text-[10px] font-black uppercase underline decoration-2 underline-offset-4">Retry</button>
            </div>
          )}

          {appIsThinking && (
            <div className="flex justify-start items-center space-x-3 pb-12">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center animate-pulse"><Loader2 className="w-5 h-5 text-indigo-600 animate-spin" /></div>
              <div className="bg-white/60 p-4 rounded-2xl border border-dashed border-indigo-200 text-sm italic text-indigo-400">Assistant is refining strategy...</div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-white border-t border-slate-100 shadow-lg shrink-0 z-10">
        <form onSubmit={handleSend} className="max-w-5xl mx-auto flex items-center space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={isAnalyzing ? "Synthesizing analysis..." : "Refine your strategy..."}
              disabled={isAnalyzing}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-8 text-sm font-bold focus:border-indigo-500 outline-none disabled:opacity-50"
            />
          </div>
          <button type="button" onClick={() => setDeepThinking(!deepThinking)} className={`p-4 rounded-xl transition-all ${deepThinking ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-50'}`}><Brain className="w-5 h-5" /></button>

          <button
            type="button"
            onClick={startVoiceSession}
            className={`p-4 rounded-xl transition-all ${isSessionActive ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-50 text-slate-400 hover:text-indigo-600'}`}
          >
            {isSessionActive ? <StopCircle className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button type="submit" disabled={!input.trim() || isAnalyzing} className="bg-slate-900 text-white p-4 rounded-xl hover:bg-black disabled:opacity-30">
            <Volume2 className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
