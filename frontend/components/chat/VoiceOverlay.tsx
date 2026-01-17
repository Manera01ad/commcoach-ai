import React from 'react';
import { Waves, Mic, Brain, StopCircle, Loader2, AlertCircle, X } from 'lucide-react';

interface VoiceOverlayProps {
    isSessionActive: boolean;
    onStopVoiceSession: () => void;
    isConnectingVoice: boolean;
    voiceError: string | null;
    setVoiceError: (err: string | null) => void;
    inputFeedback: string;
    outputFeedback: string;
}

const VoiceOverlay: React.FC<VoiceOverlayProps> = ({
    isSessionActive,
    onStopVoiceSession,
    isConnectingVoice,
    voiceError,
    setVoiceError,
    inputFeedback,
    outputFeedback
}) => {
    return (
        <>
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
                            onClick={onStopVoiceSession}
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
        </>
    );
};

export default VoiceOverlay;
