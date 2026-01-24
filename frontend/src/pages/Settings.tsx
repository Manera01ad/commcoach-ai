import React, { useState, useEffect } from 'react';
import { Settings, Key, Shield, Info, ExternalLink, Save, CheckCircle2, BrainCircuit } from 'lucide-react';

const SettingsPage: React.FC = () => {
    const [geminiKey, setGeminiKey] = useState(localStorage.getItem('user_gemini_key') || '');
    const [openaiKey, setOpenaiKey] = useState(localStorage.getItem('user_openai_key') || '');
    const [preferredModel, setPreferredModel] = useState(localStorage.getItem('user_chat_model') || 'gemini-2.0-flash-exp');
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        localStorage.setItem('user_gemini_key', geminiKey);
        localStorage.setItem('user_openai_key', openaiKey);
        localStorage.setItem('user_chat_model', preferredModel);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                        <Settings className="w-10 h-10 text-indigo-600" />
                        Platform Settings
                    </h1>
                    <p className="text-slate-500 font-medium">Configure your AI environment and connect your preferred models.</p>
                </div>

                {/* API Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                                <Key className="w-6 h-6" />
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${geminiKey ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                {geminiKey ? 'Connected' : 'Missing Key'}
                            </span>
                        </div>
                        <h3 className="text-xl font-black text-slate-800">Google Gemini</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">Required for real-time voice coaching and deep behavioral analysis.</p>
                        <input
                            type="password"
                            placeholder="Enter Gemini API Key..."
                            value={geminiKey}
                            onChange={(e) => setGeminiKey(e.target.value)}
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm font-bold focus:border-indigo-500 outline-none"
                        />
                        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline inline-flex items-center gap-1">
                            Get Free Key <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="p-3 bg-slate-50 text-slate-600 rounded-2xl">
                                <Shield className="w-6 h-6" />
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${openaiKey ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                {openaiKey ? 'Connected' : 'Optional'}
                            </span>
                        </div>
                        <h3 className="text-xl font-black text-slate-800">OpenAI (Optional)</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">Backup provider for advanced reasoning and meeting intelligence.</p>
                        <input
                            type="password"
                            placeholder="Enter OpenAI API Key..."
                            value={openaiKey}
                            onChange={(e) => setOpenaiKey(e.target.value)}
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm font-bold focus:border-indigo-500 outline-none"
                        />
                    </div>
                </div>

                {/* Model Configuration */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                            <BrainCircuit className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black text-slate-800">Primary Language Model</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Model</label>
                            <select
                                value={preferredModel}
                                onChange={(e) => setPreferredModel(e.target.value)}
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm font-bold focus:border-indigo-500 outline-none appearance-none cursor-pointer"
                            >
                                <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash (Fastest)</option>
                                <option value="gemini-2.0-flash-thinking-exp-01-21">Gemini 2.0 Thinking (Experimental)</option>
                                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Balanced)</option>
                                <option value="gpt-4o">GPT-4o (OpenAI)</option>
                                <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Legacy)</option>
                            </select>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-xs text-slate-500 leading-relaxed font-medium italic">
                                "Flash" models are recommended for real-time voice sessions due to their low latency. "Thinking" models provide deeper coaching but may have higher turn-around times.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Info Box */}
                <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white flex gap-6 items-start shadow-2xl">
                    <div className="p-3 bg-white/20 rounded-2xl shrink-0">
                        <Info className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-lg font-black tracking-tight">Large Audience Mode (BYOK)</h4>
                        <p className="text-sm text-indigo-100 leading-relaxed max-w-2xl">
                            By adding your own free Gemini API key, you bypass global platform limits. Your key is stored locally in your browser and is only sent to the AI service to process your requests. No one else has access to it.
                        </p>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-6">
                    <button
                        onClick={handleSave}
                        disabled={isSaved}
                        className={`flex items-center gap-3 px-12 py-5 rounded-2xl font-black uppercase text-sm tracking-widest transition-all shadow-2xl active:scale-95 ${isSaved ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-black'}`}
                    >
                        {isSaved ? (
                            <><CheckCircle2 className="w-5 h-5" /> Environment Updated</>
                        ) : (
                            <><Save className="w-5 h-5" /> Save Configuration</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
