import React, { useState, useMemo } from 'react';
import { Mentor, Message, MentorPlaylist } from '../types';
import MentorsSidebar from './mentors/MentorsSidebar';
import MentorsMainContent from './mentors/MentorsMainContent';
import MentorsRightPanel from './mentors/MentorsRightPanel';
import MentorsModals from './mentors/MentorsModals';

interface MentorsLabProps {
  onSendMessage: (text: string, thinking?: boolean, search?: boolean) => void;
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

  return (
    <div className="flex h-full w-full bg-black text-white font-['Inter'] overflow-hidden">
      <MentorsSidebar
        mentors={mentors}
        selectedMentorId={selectedMentorId}
        setSelectedMentorId={setSelectedMentorId}
        subscribedChannels={subscribedChannels}
        onShowAddChannel={() => setShowAddChannelModal(true)}
      />

      <MentorsMainContent
        selectedMentor={selectedMentor}
        subscribedChannels={subscribedChannels}
        onToggleSubscription={toggleSubscription}
        moduleSearch={moduleSearch}
        setModuleSearch={setModuleSearch}
        onShowAddContent={() => setShowAddContentModal(true)}
        filteredModules={filteredModules}
        activePlaylist={activePlaylist}
        onPlaylistPlay={handlePlaylistPlay}
        onDeleteModule={deleteModule}
        onEditModule={(e, p) => { e.stopPropagation(); setEditingModule(p); }}
      />

      <MentorsRightPanel
        activePlaylist={activePlaylist}
        selectedMentor={selectedMentor}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        messages={messages}
        onSendMessage={onSendMessage}
        onAddManualMessage={onAddManualMessage}
        isThinking={isThinking}
      />

      <MentorsModals
        showAddChannelModal={showAddChannelModal}
        setShowAddChannelModal={setShowAddChannelModal}
        showAddContentModal={showAddContentModal}
        setShowAddContentModal={setShowAddContentModal}
        editingModule={editingModule}
        setEditingModule={setEditingModule}
        newChannel={newChannel}
        setNewChannel={setNewChannel}
        newContent={newContent}
        setNewContent={setNewContent}
        onAddChannel={handleAddChannel}
        onAddContent={handleAddContent}
        onSaveModuleEdit={saveModuleEdit}
      />
    </div>
  );
};

export default MentorsLab;
