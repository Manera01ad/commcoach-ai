
import React, { useState, useMemo } from 'react';
import { Mentor, Message, SessionPhase, MentorPlaylist } from '../types';
import ChatWindow from './ChatWindow';
import { 
  Play, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Youtube, 
  Clock, 
  Heart, 
  MoreHorizontal, 
  Library, 
  Home, 
  TrendingUp, 
  Compass,
  Volume2,
  Maximize2,
  Brain,
  Mic2,
  Plus,
  Trash2,
  Settings,
  Edit3,
  Filter,
  ArrowUpDown,
  BarChart2,
  MessageCircle,
  Tags,
  CheckCircle2,
  UserPlus,
  UserMinus,
  Bell,
  X,
  ExternalLink,
  Info
} from 'lucide-react';

interface MentorsLabProps {
  onSendMessage: (text: string) => void;
  messages: Message[];
  onAddManualMessage: (role: 'user' | 'assistant', content: string) => void;
  isThinking?: boolean;
}

const INITIAL_MENTORS: Mentor[] = [
  {
    id: 'aleena',
    name: 'Aleena Rais',
    handle: '@AleenaRaisLive',
    channelName: 'Aleena Rais Live',
    category: 'Communication Mastery',
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
    focus: ['Soft Skills', 'Spoken English', 'Confidence', 'Interview Prep'],
    playlists: [
      {
        id: 'p1',
        title: 'Spoken English Flow',
        description: '32 Lessons • Master natural fluency and effortless speech.',
        url: 'https://www.youtube.com/embed/videoseries?list=PLjXWkP1S-RMTW6-C_V8lO5X4VzH7yP6iF'
      },
      {
        id: 'p2',
        title: 'Interview & Career',
        description: '18 Lessons • Corporate advanced strategies and boardroom presence.',
        url: 'https://www.youtube.com/embed/videoseries?list=PLjXWkP1S-RMSTuXlHn6v1pM8gX6I9s1Jm'
      }
    ]
  },
  {
    id: 'simon',
    name: 'Simon Sinek',
    handle: '@SimonSinek',
    channelName: 'Simon Sinek Official',
    category: 'Leadership',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    focus: ['Leadership', 'Inspiration', 'Strategic Thinking'],
    playlists: [
      {
        id: 's1',
        title: 'The Infinite Game',
        description: 'Applying infinite mindset to leadership and career.',
        url: 'https://www.youtube.com/embed/u4ZoJKF_VuA'
      }
    ]
  }
];

const MentorsLab: React.FC<MentorsLabProps> = ({ onSendMessage, messages, onAddManualMessage, isThinking }) => {
  const [mentors, setMentors] = useState<Mentor[]>(INITIAL_MENTORS);
  const [selectedMentorId, setSelectedMentorId] = useState<string>(mentors[0].id);
  const [activePlaylist, setActivePlaylist] = useState<MentorPlaylist | null>(null);
  const [activeTab, setActiveTab] = useState<'shadowing' | 'analytics' | 'comments'>('shadowing');
  const [moduleSearch, setModuleSearch] = useState('');
  const [subscribedChannels, setSubscribedChannels] = useState<Set<string>>(new Set(['aleena']));
  
  // Modals
  const [showAddContentModal, setShowAddContentModal] = useState(false);
  const [showAddChannelModal, setShowAddChannelModal] = useState(false);
  const [editingModule, setEditingModule] = useState<MentorPlaylist | null>(null);

  // Form States
  const [newChannel, setNewChannel] = useState({ name: '', category: 'Communication', handle: '', thumbnail: '' });
  const [newContent, setNewContent] = useState({ title: '', url: '', description: '', tags: '' });

  const selectedMentor = useMemo(() => 
    mentors.find(m => m.id === selectedMentorId) || mentors[0], 
  [mentors, selectedMentorId]);

  const filteredModules = useMemo(() => {
    return selectedMentor.playlists.filter(pl => 
      pl.title.toLowerCase().includes(moduleSearch.toLowerCase())
    );
  }, [selectedMentor, moduleSearch]);

  const toggleSubscription = (mentorId: string) => {
    setSubscribedChannels(prev => {
      const next = new Set(prev);
      if (next.has(mentorId)) next.delete(mentorId);
      else next.add(mentorId);
      return next;
    });
  };

  const deleteModule = (e: React.MouseEvent, moduleId: string) => {
    e.stopPropagation();
    if (!confirm('Permanently delete this module from library?')) return;
    setMentors(prev => prev.map(m => {
      if (m.id === selectedMentorId) {
        return { ...m, playlists: m.playlists.filter(pl => pl.id !== moduleId) };
      }
      return m;
    }));
    if (activePlaylist?.id === moduleId) setActivePlaylist(null);
  };

  const handleAddChannel = () => {
    if (!newChannel.name) return;
    const mentor: Mentor = {
      id: `m_${Date.now()}`,
      name: newChannel.name,
      handle: newChannel.handle || '@new_channel',
      channelName: newChannel.name,
      category: newChannel.category,
      thumbnail: newChannel.thumbnail || 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=600',
      focus: [],
      playlists: []
    };
    setMentors([...mentors, mentor]);
    setSelectedMentorId(mentor.id);
    setShowAddChannelModal(false);
    setNewChannel({ name: '', category: 'Communication', handle: '', thumbnail: '' });
  };

  const handleAddContent = () => {
    if (!newContent.title || !newContent.url) return;
    const content: MentorPlaylist = {
      id: `p_${Date.now()}`,
      title: newContent.title,
      description: newContent.description,
      url: newContent.url
    };
    setMentors(prev => prev.map(m => {
      if (m.id === selectedMentorId) {
        return { ...m, playlists: [...m.playlists, content] };
      }
      return m;
    }));
    setShowAddContentModal(false);
    setNewContent({ title: '', url: '', description: '', tags: '' });
  };

  const saveModuleEdit = () => {
    if (!editingModule) return;
    setMentors(prev => prev.map(m => {
      if (m.id === selectedMentorId) {
        return { 
          ...m, 
          playlists: m.playlists.map(p => p.id === editingModule.id ? editingModule : p) 
        };
      }
      return m;
    }));
    setEditingModule(null);
  };

  const handlePlaylistPlay = (playlist: MentorPlaylist) => {
    setActivePlaylist(playlist);
  };

  const getEmbedUrl = (baseUrl: string) => {
    try {
      const url = new URL(baseUrl);
      url.searchParams.set('autoplay', '1');
      return url.toString();
    } catch {
      return baseUrl;
    }
  };

  const getYouTubeChannelUrl = (handle: string) => {
    const cleanHandle = handle.startsWith('@') ? handle : `@${handle}`;
    return `https://www.youtube.com/${cleanHandle}`;
  };

  return (
    <div className="flex h-full w-full bg-black text-white font-['Inter'] overflow-hidden">
      {/* Sidebar - Library & Channel Management */}
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
            <button onClick={() => setShowAddChannelModal(true)} className="hover:text-white hover:scale-110 transition-all text-xl p-1">+</button>
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

      {/* Main Content Area */}
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
                      onClick={() => toggleSubscription(selectedMentor.id)}
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
                onClick={() => setShowAddContentModal(true)}
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
                        onClick={() => handlePlaylistPlay(pl)}
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
                                 onClick={(e) => { e.stopPropagation(); setEditingModule(pl); }}
                                 className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white border border-white/5"
                               >
                                  <Edit3 className="w-4 h-4" />
                               </button>
                               <button 
                                 onClick={e => deleteModule(e, pl.id)}
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

      {/* Right Sidebar - Practice Intelligence & Player */}
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
                            <div key={i} className="flex gap-5 animate-in slide-in-from-right duration-300" style={{ animationDelay: `${i*100}ms` }}>
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

      {/* Modals - Mind Map Compliant Logic */}
      
      {/* Create New Channel Modal */}
      {showAddChannelModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
           <div className="bg-[#1a1a1a] w-full max-w-lg rounded-[3.5rem] border border-white/10 shadow-2xl p-12 space-y-12 animate-in zoom-in-95">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center border border-indigo-600/20">
                       <Plus className="w-6 h-6 text-indigo-500" />
                    </div>
                    <h3 className="text-3xl font-black tracking-tighter italic">New Channel.</h3>
                 </div>
                 <button onClick={() => setShowAddChannelModal(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X className="w-7 h-7 text-slate-500" /></button>
              </div>
              <div className="space-y-8">
                 <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] block mb-4">Channel Descriptor</label>
                    <input 
                      type="text" value={newChannel.name}
                      onChange={e => setNewChannel({...newChannel, name: e.target.value})}
                      placeholder="e.g., Boardroom Performance Hub"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-sm font-bold focus:border-green-500 outline-none transition-all"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div>
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] block mb-4">Vertical</label>
                       <select 
                         value={newChannel.category}
                         onChange={e => setNewChannel({...newChannel, category: e.target.value})}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-[10px] font-black uppercase tracking-widest outline-none"
                       >
                          <option>Communication</option>
                          <option>Leadership</option>
                          <option>Sales Mastery</option>
                          <option>Public Speaking</option>
                       </select>
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] block mb-4">YouTube Handle</label>
                       <input 
                         type="text" value={newChannel.handle}
                         onChange={e => setNewChannel({...newChannel, handle: e.target.value})}
                         placeholder="@handle"
                         className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-xs font-bold outline-none focus:border-indigo-500 transition-all"
                       />
                    </div>
                 </div>
              </div>
              <button 
                onClick={handleAddChannel}
                disabled={!newChannel.name}
                className="w-full py-6 bg-white text-black rounded-[2.5rem] font-black uppercase text-[11px] tracking-[0.2em] hover:scale-105 disabled:opacity-30 transition-all shadow-2xl shadow-white/5"
              >
                 Initialize Channel Library
              </button>
           </div>
        </div>
      )}

      {/* Add Content Modal - Mind Map: Add by URL Flow */}
      {showAddContentModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
           <div className="bg-[#1a1a1a] w-full max-w-xl rounded-[3.5rem] border border-white/10 shadow-2xl p-12 space-y-12 animate-in zoom-in-95">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center border border-green-500/20">
                       <Plus className="w-6 h-6 text-green-500" />
                    </div>
                    <h3 className="text-3xl font-black tracking-tighter italic">Sync Content.</h3>
                 </div>
                 <button onClick={() => setShowAddContentModal(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X className="w-7 h-7 text-slate-500" /></button>
              </div>
              <div className="space-y-8">
                 <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] block mb-4">YouTube URL (Paste & Verify)</label>
                    <div className="relative">
                      <input 
                        type="text" value={newContent.url}
                        onChange={e => setNewContent({...newContent, url: e.target.value})}
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-sm font-bold focus:border-green-500 outline-none transition-all pr-12"
                      />
                      <Youtube className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                    </div>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] block mb-4">Module Title (Library Label)</label>
                    <input 
                      type="text" value={newContent.title}
                      onChange={e => setNewContent({...newContent, title: e.target.value})}
                      placeholder="e.g., Assertive Feedback Drill"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-sm font-bold focus:border-green-500 outline-none transition-all"
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] block mb-4">Metadata / Tags</label>
                    <textarea 
                      value={newContent.description}
                      onChange={e => setNewContent({...newContent, description: e.target.value})}
                      placeholder="Add key objectives or focus areas for this drill..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm font-medium focus:border-green-500 outline-none h-28 resize-none"
                    />
                 </div>
              </div>
              <button 
                onClick={handleAddContent}
                disabled={!newContent.title || !newContent.url}
                className="w-full py-6 bg-green-500 text-black rounded-[2.5rem] font-black uppercase text-[11px] tracking-[0.2em] hover:scale-105 disabled:opacity-30 transition-all shadow-2xl shadow-green-500/10"
              >
                 Verify & Add to Library
              </button>
           </div>
        </div>
      )}

      {/* Edit Details Modal - Mind Map: Video Management branch */}
      {editingModule && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
           <div className="bg-[#1a1a1a] w-full max-w-xl rounded-[3.5rem] border border-white/10 shadow-2xl p-12 space-y-12 animate-in zoom-in-95">
              <div className="flex items-center justify-between">
                 <div>
                    <h3 className="text-3xl font-black tracking-tighter italic">Edit Metadata.</h3>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mt-2">Channel Management Engine</p>
                 </div>
                 <button onClick={() => setEditingModule(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X className="w-7 h-7 text-slate-500" /></button>
              </div>
              <div className="space-y-8">
                 <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] block mb-4">Update Title</label>
                    <input 
                      type="text" value={editingModule.title}
                      onChange={e => setEditingModule({...editingModule, title: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-sm font-bold focus:border-indigo-500 outline-none transition-all"
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] block mb-4">Update Description</label>
                    <textarea 
                      value={editingModule.description}
                      onChange={e => setEditingModule({...editingModule, description: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm font-medium focus:border-indigo-500 outline-none h-40 resize-none"
                    />
                 </div>
              </div>
              <div className="flex gap-6">
                 <button onClick={() => setEditingModule(null)} className="flex-1 py-6 bg-white/5 text-slate-400 rounded-[2.5rem] font-black uppercase text-[10px] tracking-[0.2em] border border-white/5 hover:bg-white/10 transition-all">Discard</button>
                 <button 
                   onClick={saveModuleEdit}
                   className="flex-1 py-6 bg-indigo-600 text-white rounded-[2.5rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all"
                 >
                    Apply Metadata
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default MentorsLab;
