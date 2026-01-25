import React from 'react';
import { Mentor, MentorPlaylist } from '../../types';
import {
    Youtube, TrendingUp, UserMinus, UserPlus, Bell, Plus, Settings, Search, Filter, Volume2, Play, ExternalLink, Edit3, Trash2
} from 'lucide-react';

interface MentorsMainContentProps {
    selectedMentor: Mentor;
    subscribedChannels: Set<string>;
    onToggleSubscription: (id: string) => void;
    moduleSearch: string;
    setModuleSearch: (text: string) => void;
    onShowAddContent: () => void;
    filteredModules: MentorPlaylist[];
    activePlaylist: MentorPlaylist | null;
    onPlaylistPlay: (playlist: MentorPlaylist) => void;
    onDeleteModule: (e: React.MouseEvent, id: string) => void;
    onEditModule: (e: React.MouseEvent, module: MentorPlaylist) => void;
}

const MentorsMainContent: React.FC<MentorsMainContentProps> = ({
    selectedMentor,
    subscribedChannels,
    onToggleSubscription,
    moduleSearch,
    setModuleSearch,
    onShowAddContent,
    filteredModules,
    activePlaylist,
    onPlaylistPlay,
    onDeleteModule,
    onEditModule
}) => {
    const getYouTubeChannelUrl = (handle: string) => {
        const cleanHandle = handle.startsWith('@') ? handle : `@${handle}`;
        return `https://www.youtube.com/${cleanHandle}`;
    };

    return (
        <main className="flex-1 flex flex-col min-w-0 bg-[#121212] overflow-y-auto custom-scrollbar relative">
            {/* Hero Section */}
            <section className="relative h-[440px] px-8 flex flex-col justify-end pb-12">
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <img src={selectedMentor.thumbnail} className="w-full h-full object-cover opacity-20 blur-3xl scale-125" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/30" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-10">
                    <div className="relative group">
                        <img src={selectedMentor.thumbnail} className="w-52 h-52 md:w-64 md:h-64 rounded-3xl shadow-2xl object-cover border-4 border-white/5 transition-transform group-hover:scale-[1.02] duration-500" alt={selectedMentor.name} />
                        <div className="absolute inset-0 rounded-3xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Youtube className="w-12 h-12 text-white" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-6 text-center md:text-left">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-center md:justify-start gap-2">
                                <TrendingUp className="w-4 h-4 text-blue-500" />
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500">Official Channel Library</span>
                            </div>
                            <h1 className="text-6xl lg:text-9xl font-black tracking-tighter leading-none mb-2">{selectedMentor.name}</h1>
                        </div>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <button
                                onClick={() => onToggleSubscription(selectedMentor.id)}
                                className={`px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-[0.15em] transition-all flex items-center gap-2 shadow-2xl ${subscribedChannels.has(selectedMentor.id) ? 'bg-slate-800 text-slate-300' : 'bg-white text-black hover:scale-105 active:scale-95'}`}
                            >
                                {subscribedChannels.has(selectedMentor.id) ? <><UserMinus className="w-4 h-4" /> Unsubscribe</> : <><UserPlus className="w-4 h-4" /> Subscribe</>}
                            </button>

                            <a
                                href={getYouTubeChannelUrl(selectedMentor.handle)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3.5 bg-red-600/15 border border-red-500/20 rounded-full hover:bg-red-600/30 transition-all flex items-center gap-3 px-6 group"
                                title="Open Channel on YouTube"
                            >
                                <Youtube className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-red-500">{selectedMentor.handle}</span>
                            </a>

                            <button className="p-3.5 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-all">
                                <Bell className="w-5 h-5 text-slate-400" />
                            </button>

                            <div className="px-6 py-3.5 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 text-slate-300">
                                {selectedMentor.category}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Management Bar */}
            <section className="px-8 py-8 flex items-center justify-between sticky top-0 bg-[#121212]/95 backdrop-blur-md z-20 border-b border-white/5">
                <div className="flex items-center gap-6">
                    <button
                        onClick={onShowAddContent}
                        className="flex items-center gap-2 bg-green-500 text-black px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-green-500/20"
                    >
                        <Plus className="w-4 h-4" /> Add Video Content
                    </button>
                    <button className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                        <Settings className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            value={moduleSearch}
                            onChange={e => setModuleSearch(e.target.value)}
                            placeholder="Search within library..."
                            className="bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-8 text-xs font-bold w-72 outline-none focus:bg-white/10 focus:border-white/20 transition-all"
                        />
                    </div>
                    <button className="p-3 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-all">
                        <Filter className="w-5 h-5 text-slate-400" />
                    </button>
                </div>
            </section>

            {/* Video Management List */}
            <section className="px-8 pb-40">
                <div className="bg-[#181818]/40 rounded-[2.5rem] overflow-hidden border border-white/5 mt-8 shadow-2xl">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead className="border-b border-white/5 text-slate-500 text-[10px] font-black uppercase tracking-[0.25em] bg-white/5">
                            <tr>
                                <th className="px-10 py-6 w-16">#</th>
                                <th className="px-10 py-6">Training Module Details</th>
                                <th className="px-10 py-6 hidden md:table-cell">Neural Scores</th>
                                <th className="px-10 py-6 text-right pr-14">Management Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredModules.map((pl, idx) => (
                                <tr
                                    key={pl.id}
                                    onClick={() => onPlaylistPlay(pl)}
                                    className={`group hover:bg-white/5 transition-all cursor-pointer relative ${activePlaylist?.id === pl.id ? 'bg-white/10' : ''}`}
                                >
                                    <td className={`px-10 py-7 font-black ${activePlaylist?.id === pl.id ? 'text-green-500' : 'text-slate-600'}`}>
                                        {activePlaylist?.id === pl.id ? <Volume2 className="w-5 h-5 animate-pulse" /> : idx + 1}
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner group/icon relative overflow-hidden shrink-0">
                                                <Youtube className={`w-8 h-8 transition-transform group-hover/icon:scale-110 ${activePlaylist?.id === pl.id ? 'text-green-500' : 'text-red-600'}`} />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/icon:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Play className="w-5 h-5 fill-white text-white" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className={`text-base font-black mb-1.5 transition-colors ${activePlaylist?.id === pl.id ? 'text-green-500' : 'text-white'}`}>{pl.title}</div>
                                                <div className="text-[11px] text-slate-500 font-bold uppercase tracking-widest line-clamp-1 opacity-80">{pl.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7 hidden md:table-cell">
                                        <div className="flex items-center gap-6">
                                            <div className="text-center">
                                                <div className="text-sm font-black text-slate-300">1.2M</div>
                                                <div className="text-[9px] text-slate-500 uppercase font-black tracking-tighter">Views</div>
                                            </div>
                                            <div className="w-px h-8 bg-white/10" />
                                            <div className="text-center">
                                                <div className="text-sm font-black text-green-500">96.8</div>
                                                <div className="text-[9px] text-slate-500 uppercase font-black tracking-tighter">Impact</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7 text-right pr-12">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                            <a
                                                href={pl.url.replace('embed/', 'watch?v=')}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white border border-white/5 hover:bg-red-600/10 hover:border-red-600/20"
                                                title="Open Original Video on YouTube"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onEditModule(e, pl); }}
                                                className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white border border-white/5"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={e => onDeleteModule(e, pl.id)}
                                                className="p-3 bg-red-500/10 rounded-xl text-slate-400 hover:text-red-500 border border-red-500/10"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
};

export default MentorsMainContent;
