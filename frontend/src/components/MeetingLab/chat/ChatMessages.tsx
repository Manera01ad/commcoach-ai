import React, { useRef, useEffect } from 'react';
import { Brain, Volume2, Youtube, ExternalLink, BarChart2, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Message, SessionPhase } from '../../types';
import { marked } from 'marked';
import { ArchetypeBadge } from '../../src/components/Aura/ArchetypeBadge';
import { TherapyMessage } from '../../src/components/Aura/TherapyMessage';
import { ConfidenceMeter } from '../../src/components/Aura/ConfidenceMeter';
import { ExerciseCard } from '../../src/components/Aura/ExerciseCard';
import '../../src/styles/aura.css';

// Define Interface locally or import if exported
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

interface ChatMessagesProps {
    messages: Message[];
    phase: SessionPhase;
    isPlayingAudio: string | null;
    onTts: (text: string, id: string) => void;
    isAnalyzing: boolean;
    analysisResult: AssessmentStructuredData | null;
    analysisError: string | null;
    appIsThinking: boolean;
    onAssessmentComplete: () => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
    messages,
    phase,
    isPlayingAudio,
    onTts,
    isAnalyzing,
    analysisResult,
    analysisError,
    appIsThinking,
    onAssessmentComplete
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            setTimeout(() => {
                scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
            }, 100);
        }
    }, [messages, appIsThinking, isAnalyzing, analysisResult]);

    return (
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 scroll-smooth custom-scrollbar">
            <div className="max-w-5xl mx-auto w-full pb-24">
                {messages.map((msg) => (
                    <div key={msg.id} className="mb-12">
                        <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in`}>
                            {msg.role === 'assistant' && <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mr-3 mt-1 shadow-sm border border-slate-100 text-indigo-500 shrink-0"><Brain className="w-5 h-5" /></div>}
                            <div className={`max-w-[85%] p-6 rounded-2xl relative ${msg.role === 'user' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-800 border border-slate-100 shadow-sm'} ${msg.metadata?.therapyResult ? 'border-purple-500/30 bg-gradient-to-br from-white to-purple-50/30' : ''}`}>
                                {msg.metadata?.therapyResult && (
                                    <div className="mb-4">
                                        <ArchetypeBadge
                                            archetype={msg.metadata.therapyResult.archetype}
                                            confidence={msg.metadata.therapyResult.confidence}
                                        />
                                    </div>
                                )}

                                {msg.metadata?.therapyResult ? (
                                    <div className="space-y-2">
                                        {/* Split content by sections if they exist */}
                                        {msg.content.includes('### The Mirror') ? (
                                            <>
                                                <TherapyMessage
                                                    section="mirror"
                                                    content={msg.content.split('### The Prescription')[0].replace('### The Mirror', '').trim()}
                                                />
                                                <TherapyMessage
                                                    section="prescription"
                                                    content={msg.content.split('### The Prescription')[1]?.trim() || ''}
                                                />
                                                <div className="pt-2">
                                                    <ExerciseCard
                                                        exercise={msg.content.split('### The Prescription')[1]?.split('\n')[0]?.trim() || 'CBT Grounding Exercise'}
                                                    />
                                                </div>
                                                <ConfidenceMeter score={msg.metadata.therapyResult.confidence} />
                                            </>
                                        ) : (
                                            <div className="prose-sm" dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) }} />
                                        )}
                                    </div>
                                ) : (
                                    <div className="prose-sm" dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) }} />
                                )}
                                {msg.role === 'assistant' && (
                                    <button
                                        onClick={() => onTts(msg.content, msg.id)}
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
                            onClick={onAssessmentComplete}
                            className="group flex items-center space-x-3 bg-slate-900 text-white px-8 py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-black hover:scale-[1.02] transition-all"
                        >
                            <BarChart2 className="w-5 h-5 text-indigo-400" />
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
                                <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><BarChart2 className="w-6 h-6" /></div>
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
                        <button onClick={onAssessmentComplete} className="ml-auto text-[10px] font-black uppercase underline decoration-2 underline-offset-4">Retry</button>
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
    );
};

export default ChatMessages;
