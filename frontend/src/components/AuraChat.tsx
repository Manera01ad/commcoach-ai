import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, X, Sparkles, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { marked } from 'marked';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface AuraChatProps {
    dnaProfile: any;
    isOpen: boolean;
    onClose: () => void;
}

const AuraChat: React.FC<AuraChatProps> = ({ dnaProfile, isOpen, onClose }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                role: 'assistant',
                content: `Greetings ${user?.full_name || 'Champion'}. I am **Aura**, your personalized communication architect. Based on your **${dnaProfile?.archetype || 'Diplomat'}** profile, I'm ready to help you refine your verbal impact. How shall we begin?`
            }]);
        }
    }, [isOpen, messages.length, user?.full_name, dnaProfile?.archetype]);

    useEffect(scrollToBottom, [messages]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            const tokenObj = localStorage.getItem('supabase.auth.token');
            const token = tokenObj ? JSON.parse(tokenObj).access_token : '';

            // Generate a sessionId if not present (simple mock for now)
            const sessionId = `session-${user?.id}-${Date.now()}`;

            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/agents/chat`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: userMsg,
                    sessionId: sessionId,
                    config: {
                        modelName: 'gemini-1.5-pro',
                        type: 'coach'
                    }
                })
            });

            const data = await response.json();
            if (data.content) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
            } else {
                throw new Error("Empty response from Aura");
            }
        } catch (error) {
            console.error("Aura Chat Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "I encountered a neural desync. Please retry your transmission." }]);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 w-full max-w-md h-[600px] bg-white dark:bg-neutral-900 shadow-2xl rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 flex flex-col overflow-hidden z-[60]"
        >
            {/* Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center animate-pulse shadow-lg shadow-indigo-600/30">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold tracking-tight">Aura Intelligence</h3>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Neural Link Active</span>
                        </div>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#f8fafc] dark:bg-neutral-950">
                {messages.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed ${msg.role === 'user'
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                                : 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-100 dark:border-neutral-700 shadow-sm'
                            }`}>
                            <div
                                className="prose prose-sm dark:prose-invert max-w-none font-medium"
                                dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) }}
                            />
                        </div>
                    </motion.div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white dark:bg-neutral-800 p-4 rounded-3xl shadow-sm border border-neutral-100 dark:border-neutral-700 flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Synthesizing...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800">
                <form onSubmit={handleSend} className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Project your message..."
                        className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl py-4 px-6 pr-14 text-sm font-medium outline-none focus:border-indigo-600 transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl flex items-center justify-center disabled:opacity-30 hover:scale-105 transition-all shadow-lg shadow-indigo-600/20"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </motion.div>
    );
};

export default AuraChat;
