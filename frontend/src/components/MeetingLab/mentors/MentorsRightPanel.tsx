import React from 'react';
import { Mentor, MentorPlaylist, Message, SessionPhase } from '../../../types';
import ChatWindow from '../ChatWindow';
import {
    Youtube, Play, Info, BarChart2
} from 'lucide-react';

interface MentorsRightPanelProps {
    activePlaylist: MentorPlaylist | null;
    selectedMentor: Mentor;
    activeTab: 'shadowing' | 'analytics' | 'comments';
    setActiveTab: (tab: 'shadowing' | 'analytics' | 'comments') => void;
    messages: Message[];
    onSendMessage: (text: string) => void;
    onAddManualMessage: (role: 'user' | 'assistant', content: string) => void;
    isThinking?: boolean;
}

const MentorsRightPanel: React.FC<MentorsRightPanelProps> = ({
    activePlaylist,
    selectedMentor,
    activeTab,
    setActiveTab,
    messages,
    onSendMessage,
    onAddManualMessage,
    isThinking
}) => {
    const getEmbedUrl = (baseUrl: string) => {
        try {
            const url = new URL(baseUrl);
            url.searchParams.set('autoplay', '1');
            return url.toString();
        } catch {
            return baseUrl;
        }
    };

    return (
        <aside className="hidden xl:flex flex-col w-[440px] bg-[#121212] border-l border-white/5 p-6 shrink-0 overflow-hidden mb-24 z-10 shadow-2xl relative">
            {activePlaylist ? (
                <div className="h-full flex flex-col gap-8 animate-in slide-in-from-right duration-500">
                    <div className="space-y-4">
                        <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/10 relative group">
                            <iframe
                                className="w-full h-full"
                                src={getEmbedUrl(activePlaylist.url)}
                                title={activePlaylist.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                        <div className="flex items-center justify-between px-2">
                            <div className="flex flex-col">
                                <span className="text-xs font-black tracking-tight line-clamp-1">{activePlaylist.title}</span>
                                <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">{selectedMentor.name}</span>
                            </div>
                            <a
                                href={activePlaylist.url.replace('embed/', 'watch?v=')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500 transition-all shadow-lg shadow-red-600/20"
                            >
                                <Youtube className="w-4 h-4" /> View Original
                            </a>
                        </div>
                    </div>

                    <div className="flex bg-white/5 p-1.5 rounded-[1.5rem] border border-white/5">
                        {(['shadowing', 'analytics', 'comments'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === tab ? 'bg-white text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-hidden bg-black/40 rounded-[2.5rem] border border-white/5 shadow-inner backdrop-blur-sm">
                        {activeTab === 'shadowing' && (
                            <ChatWindow
                                messages={messages}
                                onSend={(text) => onSendMessage(`[SHADOWING: ${selectedMentor.name}] ${text}`)}
                                onAddManualMessage={onAddManualMessage}
                                isVoiceMode={false}
                                phase={SessionPhase.CHAT}
                                isThinking={isThinking}
                            />
                        )}
                        {activeTab === 'analytics' && (
                            <div className="p-10 space-y-12 animate-in fade-in">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-8 bg-white/5 rounded-3xl border border-white/5 text-center group hover:bg-white/10 transition-colors">
                                        <div className="text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Neural Impact</div>
                                        <div className="text-4xl font-black text-indigo-400 tracking-tighter">94%</div>
                                    </div>
                                    <div className="p-8 bg-white/5 rounded-3xl border border-white/5 text-center group hover:bg-white/10 transition-colors">
                                        <div className="text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Retention</div>
                                        <div className="text-4xl font-black text-emerald-500">82%</div>
                                    </div>
                                </div>
                                <div className="space-y-8">
                                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-3"><BarChart2 className="w-4 h-4" /> Library Analytics</h4>
                                    <div className="space-y-6">
                                        {['Communication Clarity', 'Tone Consistency', 'Strategic Pausing'].map(metric => (
                                            <div key={metric} className="space-y-3">
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                                    <span className="text-slate-300">{metric}</span>
                                                    <span className="text-indigo-500">88%</span>
                                                </div>
                                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-indigo-600 w-[88%] rounded-full shadow-[0_0_10px_rgba(79,70,229,0.4)]" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'comments' && (
                            <div className="h-full flex flex-col p-8 overflow-hidden">
                                <div className="flex-1 overflow-y-auto space-y-8 mb-6 no-scrollbar">
                                    {[
                                        { user: 'Sanjeev K', text: 'This specific module on Spoken English Flow is the best in the library.', time: '2d ago' },
                                        { user: 'Maria G', text: 'Watching directly from YouTube helps with captioning sometimes.', time: '4h ago' },
                                        { user: 'Kevin P', text: 'Synced this to my favorites list.', time: 'Just now' }
                                    ].map((comment, i) => (
                                        <div key={i} className="flex gap-5 animate-in slide-in-from-right duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                                            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-[11px] font-black shrink-0 shadow-lg">{comment.user[0]}</div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-sm font-black text-white">{comment.user}</span>
                                                    <span className="text-[10px] text-slate-600 font-black uppercase tracking-tighter">{comment.time}</span>
                                                </div>
                                                <p className="text-xs text-slate-400 leading-relaxed font-bold tracking-tight">{comment.text}</p>
                                                <div className="flex gap-4 mt-3">
                                                    <button className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Reply</button>
                                                    <button className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Like</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Add comment to library..."
                                        className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-4 px-6 text-xs font-bold outline-none focus:bg-white/10 focus:border-white/20 transition-all pr-20"
                                    />
                                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-400 transition-colors">Post</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-center px-12 animate-in fade-in duration-700">
                    <div className="w-32 h-32 bg-white/5 rounded-[3rem] flex items-center justify-center text-slate-800 mb-10 border border-white/5 shadow-inner">
                        <Play className="w-12 h-12" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-4 tracking-tighter">Shadowing Idle.</h3>
                    <p className="text-xs font-black text-slate-600 leading-relaxed uppercase tracking-[0.25em] italic">
                        Initialize practice by selecting a training module from the {selectedMentor.name} library.
                    </p>
                    <div className="mt-10 p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center gap-4 text-left">
                        <Info className="w-6 h-6 text-indigo-500 shrink-0" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            You can add any YouTube URL to your personal library using the 'Add Video Content' tool.
                        </p>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default MentorsRightPanel;
