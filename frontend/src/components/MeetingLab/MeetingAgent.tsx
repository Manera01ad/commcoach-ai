import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MeetingSpeaker } from '../../types';
import { geminiApi } from '../../services/api';
import { decode, decodeAudioData, createPcmBlob } from '../../audioUtils';
import { marked } from 'marked';
import {
  Zap,
  Shield,
  Target,
  Brain,
  Play,
  Square,
  ChevronRight,
  Activity,
  MessageSquare,
  BarChart3,
  Lightbulb,
  ClipboardCheck,
  Loader2,
  Mic,
  Settings,
  AlertCircle,
  Globe,
  Ghost,
  ShieldCheck,
  ZapOff,
  Briefcase,
  X,
  History,
  ClipboardList
} from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';

const MEETING_SYSTEM_INSTRUCTION = `You are the Meeting Lab Intelligence Agent. 
Your primary role is to act as a HIGH-FIDELITY SILENT TRANSCRIBER AND OBSERVER.

STRICT TRANSCRIPTION RULES:
1. TRANSCRIBE IN ENGLISH ONLY: If any participant speaks in another language (e.g., Hindi, Spanish, etc.), translate it to professional English immediately. 
2. NO NON-ENGLISH SCRIPT: Never output Hindi, Arabic, or any other non-Latin script. Use ONLY standard English Latin characters.
3. SILENT MODE: Do NOT speak or generate any audio output. Remain completely silent.
4. NO REPETITION OR STUTTERING: Provide a clean, readable English transcript of the intended meaning. Do not split words into fragments.
5. MULTI-SPEAKER CONTEXT: Capture the dialogue of all participants as a single, cohesive stream labeled 'PARTICIPANTS'.

Your goal is to provide a clean, professional English record for later tactical analysis.`;

interface TranscriptEntry {
  speakerId: string;
  name: string;
  text: string;
  time: string;
  lastUpdated: number;
}

interface IntakeData {
  goal: string;
  participants: string;
}

const MeetingAgent: React.FC = () => {
  const { user } = useAuth();
  // Removed 'setup' step from the state cycle
  const [currentStep, setCurrentStep] = useState<'splash' | 'active' | 'summary'>('splash');
  const [intake] = useState<IntakeData>({
    goal: 'General Strategic Alignment and Tactical Efficiency',
    participants: 'Multiple Meeting Participants'
  });
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeTab, setActiveTab] = useState<'briefing' | 'probes' | 'chat'>('briefing');
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [actionPlan, setActionPlan] = useState<string | null>(null);
  const [improvementPlan, setImprovementPlan] = useState<string | null>(null);
  const [probes, setProbes] = useState<string[]>([]);
  const [finalJson, setFinalJson] = useState<string | null>(null);

  const [qaInput, setQaInput] = useState('');
  const [qaHistory, setQaHistory] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const qaEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (transcriptEndRef.current) transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  useEffect(() => {
    if (qaEndRef.current) qaEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [qaHistory]);

  const generateMeetingIntelligence = async (isFinal: boolean = false) => {
    if (transcript.length === 0 || isAnalyzing) return;
    setIsAnalyzing(true);
    if (!isFinal) setActiveTab('briefing');

    try {
      // Replaced with backend proxy
      const conversation = transcript.map(t => `${t.name}: ${t.text}`).join('\n');

      const systemPrompt = isFinal ? `
        Analyze this meeting transcript and produce a final wrap-up.
        Output MUST include:
        1. [HUMAN SUMMARY]: Key topics, decisions, open questions.
        2. [ACTION ITEMS]: Per-speaker tasks.
        3. [METRICS_JSON]: A structured JSON block for archival.
      ` : `
        Analyze this meeting transcript and provide a tactical briefing.
        CONVERSATION: ${conversation}
        Format output strictly with headings: [ACTION PLAN], [IMPROVEMENT PLAN], [STRATEGIC PROBES].
      `;

      // Using geminiApi proxy
      const responseText = await geminiApi.generateContent(
        'gemini-1.5-pro',
        isFinal ? `TRANSCRIPT:\n${conversation}` : `TRANSCRIPT:\n${conversation}`,
        {
          // systemInstruction is passed in content for now or needs to be handled by backend config
          // simpler to append to prompt for MVP
        }
      );

      // Hack to prepend instructions if backend doesn't support them well yet via config
      const fullPrompt = `${systemPrompt}\n\nTRANSCRIPT:\n${conversation}`;
      const text = await geminiApi.generateContent('gemini-1.5-pro', fullPrompt);

      if (isFinal) {
        setFinalJson(text);
      } else {
        setActionPlan(text.split('[ACTION PLAN]')[1]?.split('[IMPROVEMENT PLAN]')[0]?.trim() || "Synthesis in progress.");
        setImprovementPlan(text.split('[IMPROVEMENT PLAN]')[1]?.split('[STRATEGIC PROBES]')[0]?.trim() || "Maintaining standard executive presence.");

        const probesPart = text.split('[STRATEGIC PROBES]')[1] || "";
        const probeList = probesPart.split('\n').filter(p => p.trim().startsWith('-') || p.match(/^\d+\./)).map(p => p.replace(/^[- \d.]*/, '').trim());
        setProbes(probeList.length > 0 ? probeList : ["What is the primary bottleneck currently?", "How does this align with long-term strategy?"]);
      }

    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const recognitionRef = useRef<any>(null);

  const startMeeting = async () => {
    if (isActive || isConnecting) return;
    setIsConnecting(true);
    try {
      // 1. Request Microphone Access
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

      // 2. Initialize Web Speech API
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error('Speech Recognition not supported in this browser.');
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          setTranscript(prev => [
            ...prev,
            {
              speakerId: 'user',
              name: user?.full_name || 'You',
              text: finalTranscript,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              lastUpdated: Date.now()
            }
          ]);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech Recognition Error:', event.error);
        stopMeeting();
      };

      recognition.start();
      recognitionRef.current = recognition;

      setIsActive(true);
      setCurrentStep('active');
    } catch (err) {
      console.error(err);
      alert('Failed to initialize meeting: ' + (err as Error).message);
    } finally {
      setIsConnecting(false);
    }
  };

  const stopMeeting = useCallback(async () => {
    setIsActive(false);
    setIsConnecting(false);

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }

    // Cleaning up other refs if any
    if (processorRef.current) {
      try { processorRef.current.disconnect(); } catch (e) { }
      processorRef.current = null;
    }

    if (transcript.length > 0) {
      setCurrentStep('summary');
      generateMeetingIntelligence(true);
    } else {
      setCurrentStep('splash');
    }
  }, [transcript, user?.full_name]);

  const handleQa = async (queryText?: string) => {
    const text = queryText || qaInput;
    if (!text.trim() || isThinking) return;
    setQaInput('');
    setQaHistory(prev => [...prev, { role: 'user', text }]);
    setIsThinking(true);
    try {
      const context = transcript.slice(-15).map(t => `${t.name}: ${t.text}`).join('\n');

      // Using geminiApi proxy
      const responseText = await geminiApi.generateContent(
        'gemini-1.5-pro',
        `Context:\n${context}\n\nQuestion: ${text}`,
        {
          // thinking config not fully supported in simple proxy yet
        }
      );

      setQaHistory(prev => [...prev, { role: 'assistant', text: responseText || "Analyzing current dynamics..." }]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsThinking(false);
    }
  };

  if (currentStep === 'splash') {
    return (
      <div className="h-full w-full bg-[#f8fafc] flex items-center justify-center p-6 md:p-12 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl w-full bg-white rounded-[4rem] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-700">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="bg-slate-900 p-16 text-white flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center mb-10 shadow-lg shadow-indigo-600/20">
                  <Briefcase className="w-8 h-8" />
                </div>
                <h2 className="text-5xl font-black mb-6 tracking-tighter leading-tight italic text-white">Meeting Intelligence Lab.</h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Observer Protocol v2.1</p>
              </div>
              <div className="space-y-6 mt-20">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-slate-900 transition-all"><Globe className="w-5 h-5" /></div>
                  <p className="text-xs font-black uppercase tracking-widest">English-Only Neural Feed</p>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-slate-900 transition-all"><ZapOff className="w-5 h-5" /></div>
                  <p className="text-xs font-black uppercase tracking-widest">Zero Repetition Protocol</p>
                </div>
              </div>
            </div>
            <div className="p-16 flex flex-col justify-center space-y-12">
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Silent Shadow</h3>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                  Deploy an English-only observer. All languages are translated in real-time. Fragments are stitched for maximum readability. No configuration required.
                </p>
              </div>
              <div className="space-y-6">
                <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 flex gap-5">
                  <AlertCircle className="w-6 h-6 text-indigo-500 shrink-0" />
                  <p className="text-[11px] font-bold text-indigo-800 leading-relaxed uppercase tracking-widest italic">
                    Observer Mode: One-Click Initialization.
                  </p>
                </div>
                <button
                  onClick={startMeeting}
                  disabled={isConnecting}
                  className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50"
                >
                  {isConnecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Play className="w-5 h-5" /> Initialize Intelligence Session</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'summary') {
    return (
      <div className="h-full w-full bg-white overflow-y-auto custom-scrollbar p-10 md:p-20 flex flex-col items-center">
        <div className="max-w-5xl w-full space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className="flex flex-col md:flex-row items-center justify-between border-b border-slate-100 pb-10">
            <h2 className="text-6xl font-black text-slate-900 tracking-tighter italic leading-none">Shadow Archive.</h2>
            <button onClick={() => { setCurrentStep('splash'); setTranscript([]); setFinalJson(null); }} className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all">New Lab</button>
          </div>
          {isAnalyzing ? (
            <div className="py-32 flex flex-col items-center space-y-6">
              <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Synthesizing Final Markers...</p>
            </div>
          ) : (
            <div className="prose prose-slate max-w-none bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-sm" dangerouslySetInnerHTML={{ __html: marked.parse(finalJson || "No data captured.") }} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col md:flex-row bg-white overflow-hidden font-['Inter'] relative">
      <div className="flex-1 flex flex-col bg-white border-r border-slate-100 relative min-w-0">
        <div className="h-24 px-10 flex items-center justify-between border-b border-slate-100 shrink-0 bg-white/95 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center space-x-8">
            <div className={`w-4 h-4 rounded-full ${isActive ? 'bg-red-500 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.7)]' : 'bg-slate-300'}`} />
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-slate-900 uppercase tracking-[0.25em] leading-none flex items-center gap-3"><Globe className="w-4 h-4 text-indigo-600" /> English Intelligence Feed</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Active Multi-Speaker Neural Logic</span>
            </div>
          </div>
          {isActive && (
            <button onClick={stopMeeting} className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100 flex items-center gap-2 group">
              <Square className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" /> Terminate Signal
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-10 md:p-20 custom-scrollbar bg-[#fdfdfe]">
          <div className="max-w-5xl mx-auto">
            {transcript.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-56">
                <Mic className="w-12 h-12 text-slate-300 mb-6" />
                <h3 className="text-xl font-black uppercase tracking-[0.4em] text-slate-900">Awaiting Professional Context...</h3>
              </div>
            ) : (
              <div className="space-y-20">
                {transcript.map((line, idx) => (
                  <div key={idx} className="flex animate-in fade-in slide-in-from-left duration-700 group">
                    <div className="flex flex-col items-center mr-10 shrink-0">
                      <div className="w-16 h-16 rounded-[2rem] flex items-center justify-center text-white text-[12px] font-black shadow-2xl bg-slate-900 group-hover:scale-110 transition-transform">{line.name[0]}</div>
                      <div className="h-full w-px bg-slate-100 mt-8" />
                    </div>
                    <div className="flex-1 pb-20">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-4">
                          <span className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">{line.name}</span>
                          <span className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-tighter">EN-TRANSCRIPT</span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-tighter">{line.time}</span>
                      </div>
                      <p className="text-3xl leading-[1.6] font-medium text-slate-800 tracking-tight max-w-4xl">{line.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div ref={transcriptEndRef} />
          </div>
        </div>
      </div>

      <div className="w-full md:w-[550px] flex flex-col bg-slate-50 border-l border-slate-200 shadow-2xl overflow-hidden shrink-0 z-20">
        <div className="p-12 bg-white border-b border-slate-100 shrink-0">
          <button onClick={() => generateMeetingIntelligence(false)} disabled={transcript.length === 0 || isAnalyzing} className="w-full bg-slate-900 text-white py-8 rounded-[2.5rem] font-black uppercase text-[12px] tracking-[0.3em] shadow-2xl hover:bg-black disabled:opacity-30 transition-all flex items-center justify-center gap-5 group">
            {isAnalyzing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 text-amber-400 group-hover:scale-125 transition-transform" />} Briefing Report
          </button>
        </div>

        <div className="flex bg-white border-b border-slate-100 px-8 py-4 shrink-0">
          {(['briefing', 'probes', 'chat'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-2xl' : 'text-slate-400 hover:text-slate-600'}`}>{tab}</button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar bg-[#f8fafc]">
          {activeTab === 'briefing' && (
            <div className="space-y-12">
              {actionPlan ? (
                <>
                  <div className="space-y-6"><h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-indigo-600 flex items-center gap-4"><ClipboardCheck className="w-6 h-6" /> Action Plan</h4><div className="bg-white p-12 rounded-[3.5rem] prose prose-sm max-w-none text-slate-700 leading-relaxed font-medium shadow-sm border border-indigo-100" dangerouslySetInnerHTML={{ __html: marked.parse(actionPlan) }} /></div>
                  <div className="space-y-6"><h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-600 flex items-center gap-4"><Activity className="w-6 h-6" /> Behavior</h4><div className="bg-white p-12 rounded-[3.5rem] prose prose-sm max-w-none text-slate-700 leading-relaxed font-medium shadow-sm border border-emerald-100" dangerouslySetInnerHTML={{ __html: marked.parse(improvementPlan || "") }} /></div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-32 opacity-30">
                  <Ghost className="w-20 h-20 mb-10 text-slate-300" />
                  <p className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-900">Awaiting Analysis Synthesis</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2 italic">Press 'Briefing Report' to generate insights</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'probes' && (
            <div className="space-y-12">
              <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-amber-600 flex items-center gap-4"><Lightbulb className="w-6 h-6" /> Inquiry List</h4>
              <div className="space-y-8">
                {probes.map((probe, i) => (
                  <button key={i} onClick={() => handleQa(`Phrase professionally: "${probe}"`)} className="w-full text-left p-10 bg-white border border-slate-200 rounded-[3rem] hover:border-indigo-400 transition-all shadow-sm group hover:shadow-xl"><p className="text-lg font-black text-slate-800 group-hover:text-indigo-600 transition-colors">"{probe}"</p></button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="space-y-12">
              {qaHistory.length === 0 && (
                <div className="p-10 bg-indigo-50 border border-indigo-100 rounded-[3rem] flex gap-6">
                  <AlertCircle className="w-8 h-8 text-indigo-500 shrink-0" />
                  <p className="text-[12px] font-bold text-indigo-700 leading-relaxed">Ask for tactical coaching or response drafting based on the current room energy.</p>
                </div>
              )}
              {qaHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-10 rounded-[3rem] text-sm shadow-xl ${msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-white text-slate-800 border border-slate-100'}`}><div className="prose prose-sm max-w-none font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) }} /></div>
                </div>
              ))}
              <div ref={qaEndRef} />
            </div>
          )}
        </div>

        <div className="p-12 bg-white border-t border-slate-100 shrink-0">
          <form onSubmit={(e) => { e.preventDefault(); handleQa(); }} className="relative">
            <input type="text" value={qaInput} onChange={e => setQaInput(e.target.value)} placeholder="Ask for advice..." className="w-full bg-slate-50 border-2 border-slate-100 rounded-[3rem] py-8 px-12 pr-32 text-base font-bold outline-none focus:border-indigo-500 transition-all" />
            <button type="submit" disabled={isThinking || !qaInput.trim()} className="absolute right-5 top-1/2 -translate-y-1/2 bg-slate-900 text-white p-6 rounded-full hover:bg-black shadow-2xl disabled:opacity-30 transition-all">{isThinking ? <Loader2 className="w-6 h-6 animate-spin" /> : <ChevronRight className="w-8 h-8" />}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MeetingAgent;
