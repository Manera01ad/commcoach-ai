import React, { useState } from 'react';
import { Brain, Search, Mic, StopCircle, Volume2, Settings, Send } from 'lucide-react';

interface ChatInputProps {
    onSend: (text: string) => void;
    isAnalyzing: boolean;
    isSessionActive: boolean;
    onStartVoiceSession: () => void;
    deepThinking: boolean;
    setDeepThinking: (val: boolean) => void;
    searchGrounding: boolean;
    setSearchGrounding: (val: boolean) => void;
    appIsThinking?: boolean;
    onShowKeySettings?: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
    onSend,
    isAnalyzing,
    isSessionActive,
    onStartVoiceSession,
    deepThinking,
    setDeepThinking,
    searchGrounding,
    setSearchGrounding,
    appIsThinking,
    onShowKeySettings
}) => {
    const [input, setInput] = useState('');

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || appIsThinking || isAnalyzing) return;
        onSend(input);
        setInput('');
    };

    return (
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
                <button type="button" onClick={() => setDeepThinking(!deepThinking)} title="Thinking Mode" className={`p-4 rounded-xl transition-all ${deepThinking ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-50 hover:text-indigo-600'}`}><Brain className="w-5 h-5" /></button>
                <button type="button" onClick={() => setSearchGrounding(!searchGrounding)} title="Web Search" className={`p-4 rounded-xl transition-all ${searchGrounding ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-50 hover:text-indigo-600'}`}><Search className="w-5 h-5" /></button>
                <button type="button" onClick={onShowKeySettings} title="AI Settings" className="p-4 rounded-xl text-slate-400 bg-slate-50 hover:text-indigo-600"><Settings className="w-5 h-5" /></button>

                <button
                    type="button"
                    onClick={onStartVoiceSession}
                    className={`p-4 rounded-xl transition-all ${isSessionActive ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-50 text-slate-400 hover:text-indigo-600'}`}
                >
                    {isSessionActive ? <StopCircle className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <button type="submit" disabled={!input.trim() || isAnalyzing} className="bg-slate-900 text-white p-4 rounded-xl hover:bg-black disabled:opacity-30">
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
};

export default ChatInput;
