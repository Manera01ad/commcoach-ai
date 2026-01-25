import React from 'react';
import { Mentor } from '../../../types';
import { Home, Search, Library, Plus } from 'lucide-react';

interface MentorsSidebarProps {
    mentors: Mentor[];
    selectedMentorId: string;
    setSelectedMentorId: (id: string) => void;
    subscribedChannels: Set<string>;
    onShowAddChannel: () => void;
}

const MentorsSidebar: React.FC<MentorsSidebarProps> = ({
    mentors,
    selectedMentorId,
    setSelectedMentorId,
    subscribedChannels,
    onShowAddChannel
}) => {
    return (
        <aside className="hidden lg:flex flex-col w-72 p-2 gap-2 bg-black shrink-0 border-r border-white/5">
            <div className="bg-[#121212] rounded-lg p-5 space-y-4">
                <button className="flex items-center gap-4 text-slate-400 hover:text-white transition-all w-full font-bold text-sm group">
                    <Home className="w-6 h-6 group-hover:scale-110 transition-transform" /> Dashboard
                </button>
                <button className="flex items-center gap-4 text-white transition-all w-full font-bold text-sm group">
                    <Search className="w-6 h-6 group-hover:scale-110 transition-transform" /> Browse Library
                </button>
            </div>

            <div className="flex-1 bg-[#121212] rounded-lg p-2 flex flex-col gap-4 overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 px-3 pt-2">
                    <div className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest">
                        <Library className="w-5 h-5" /> Subscriptions
                    </div>
                    <button onClick={onShowAddChannel} className="hover:text-white hover:scale-110 transition-all text-xl p-1">+</button>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar px-1 space-y-1">
                    {mentors.map(mentor => (
                        <button
                            key={mentor.id}
                            onClick={() => setSelectedMentorId(mentor.id)}
                            className={`flex items-center gap-3 p-2.5 rounded-xl w-full transition-all hover:bg-white/5 ${selectedMentorId === mentor.id ? 'bg-white/10' : ''}`}
                        >
                            <img src={mentor.thumbnail} className="w-10 h-10 rounded-lg object-cover shadow-xl" alt={mentor.name} />
                            <div className="text-left truncate">
                                <div className={`text-sm font-black ${selectedMentorId === mentor.id ? 'text-green-500' : 'text-white'}`}>{mentor.name}</div>
                                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">
                                    {subscribedChannels.has(mentor.id) && <span className="text-blue-500 mr-1 text-[7px]">●</span>}
                                    {mentor.category}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default MentorsSidebar;
