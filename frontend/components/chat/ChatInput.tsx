import React, { useState } from 'react';
import { StopCircle, Settings, Send, ChevronDown, Sparkles, AudioLines, Brain } from 'lucide-react';

interface ChatInputProps {
    onSend: (text: string) => void;
    isAnalyzing: boolean;
    isSessionActive: boolean;
    onStartVoiceSession: () => void;
    appIsThinking?: boolean;
    onShowKeySettings?: () => void;
    selectedModel: string;
    onModelChange: (model: string) => void;
    therapyMode: boolean;
    onToggleTherapy: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
    onSend,
    isAnalyzing,
    isSessionActive,
    onStartVoiceSession,
    appIsThinking,
    onShowKeySettings,
    selectedModel,
    onModelChange,
    therapyMode,
    onToggleTherapy
}) => {
    const [input, setInput] = useState('');
    const [showModels, setShowModels] = useState(false);

    const availableModels = [
        { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash' },
        { id: 'gemini-2.0-flash-thinking-exp-01-21', name: 'Gemini 2.0 Thinking' },
        { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
        { id: 'gpt-4o', name: 'GPT-4o' }
    ];

    const currentModelName = availableModels.find(m => m.id === selectedModel)?.name || 'Gemini 2.0 Flash';

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || appIsThinking || isAnalyzing) return;
        onSend(input);
        setInput('');
    };

    return (
        <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] shrink-0 z-10">
            <form onSubmit={handleSend} className="max-w-4xl mx-auto">
                <div className="relative bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] focus-within:border-indigo-500/50 transition-all p-2">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder={isAnalyzing ? "Synthesizing analysis..." : "Ask anything, @ for context"}
                        disabled={isAnalyzing}
                        className="w-full bg-transparent py-4 px-6 text-sm font-medium outline-none disabled:opacity-50 text-slate-700 placeholder:text-slate-400"
                    />

                    {/* Integrated Toolbar */}
                    <div className="flex items-center justify-between px-4 pb-2 pt-1 border-t border-slate-200/50 mt-2">
                        <div className="flex items-center gap-2">
                            {/* Model Switcher */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowModels(!showModels)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all text-slate-500 hover:text-indigo-600"
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span className="text-[11px] font-bold tracking-tight">{currentModelName}</span>
                                    <ChevronDown className={`w-3 h-3 opacity-50 transition-transform ${showModels ? 'rotate-180' : ''}`} />
                                </button>

                                {showModels && (
                                    <div className="absolute bottom-full left-0 mb-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl py-2 z-[100] animate-in slide-in-from-bottom-2 duration-200">
                                        <div className="px-4 py-2 border-b border-slate-50">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Select Intelligence</span>
                                        </div>
                                        {availableModels.map(model => (
                                            <button
                                                key={model.id}
                                                type="button"
                                                disabled={isAnalyzing}
                                                onClick={() => {
                                                    onModelChange(model.id);
                                                    setShowModels(false);
                                                }}
                                                className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center justify-between ${selectedModel === model.id ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-600 hover:bg-slate-50'}`}
                                            >
                                                {model.name}
                                                {selectedModel === model.id && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.5)]" />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Therapy Mode Toggle */}
                            <button
                                type="button"
                                onClick={onToggleTherapy}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${therapyMode
                                    ? 'bg-purple-600/10 border-purple-500/30 text-purple-600 font-bold shadow-sm'
                                    : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                <Brain className={`w-3.5 h-3.5 ${therapyMode ? 'animate-pulse' : ''}`} />
                                <span className="text-[11px] tracking-tight">
                                    {therapyMode ? 'Therapy Mode ON' : 'Enable Therapy'}
                                </span>
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={onStartVoiceSession}
                                className={`p-2 rounded-xl transition-all ${isSessionActive ? 'bg-red-500 text-white animate-pulse' : 'bg-teal-600/90 text-white hover:bg-teal-700 shadow-sm'}`}
                                title="Start Voice Conversation"
                            >
                                {isSessionActive ? <StopCircle className="w-5 h-5" /> : <AudioLines className="w-5 h-5" />}
                            </button>

                            <button
                                type="submit"
                                disabled={!input.trim() || isAnalyzing}
                                className="bg-slate-900 text-white p-2.5 rounded-xl hover:bg-black disabled:opacity-20 transition-all shadow-lg shadow-black/10"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ChatInput;
