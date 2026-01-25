import React from 'react';
import { MentorPlaylist } from '../../../types';
import { Plus, X, Youtube } from 'lucide-react';

interface MentorsModalsProps {
    showAddChannelModal: boolean;
    setShowAddChannelModal: (show: boolean) => void;
    showAddContentModal: boolean;
    setShowAddContentModal: (show: boolean) => void;
    editingModule: MentorPlaylist | null;
    setEditingModule: (module: MentorPlaylist | null) => void;
    newChannel: { name: string; category: string; handle: string; thumbnail: string };
    setNewChannel: (channel: any) => void;
    newContent: { title: string; url: string; description: string; tags: string };
    setNewContent: (content: any) => void;
    onAddChannel: () => void;
    onAddContent: () => void;
    onSaveModuleEdit: () => void;
}

const MentorsModals: React.FC<MentorsModalsProps> = ({
    showAddChannelModal,
    setShowAddChannelModal,
    showAddContentModal,
    setShowAddContentModal,
    editingModule,
    setEditingModule,
    newChannel,
    setNewChannel,
    newContent,
    setNewContent,
    onAddChannel,
    onAddContent,
    onSaveModuleEdit
}) => {
    return (
        <>
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
                                    onChange={e => setNewChannel({ ...newChannel, name: e.target.value })}
                                    placeholder="e.g., Boardroom Performance Hub"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-sm font-bold focus:border-green-500 outline-none transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] block mb-4">Vertical</label>
                                    <select
                                        value={newChannel.category}
                                        onChange={e => setNewChannel({ ...newChannel, category: e.target.value })}
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
                                        onChange={e => setNewChannel({ ...newChannel, handle: e.target.value })}
                                        placeholder="@handle"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-xs font-bold outline-none focus:border-indigo-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onAddChannel}
                            disabled={!newChannel.name}
                            className="w-full py-6 bg-white text-black rounded-[2.5rem] font-black uppercase text-[11px] tracking-[0.2em] hover:scale-105 disabled:opacity-30 transition-all shadow-2xl shadow-white/5"
                        >
                            Initialize Channel Library
                        </button>
                    </div>
                </div>
            )}

            {/* Add Content Modal */}
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
                                        onChange={e => setNewContent({ ...newContent, url: e.target.value })}
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
                                    onChange={e => setNewContent({ ...newContent, title: e.target.value })}
                                    placeholder="e.g., Assertive Feedback Drill"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-sm font-bold focus:border-green-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] block mb-4">Metadata / Tags</label>
                                <textarea
                                    value={newContent.description}
                                    onChange={e => setNewContent({ ...newContent, description: e.target.value })}
                                    placeholder="Add key objectives or focus areas for this drill..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm font-medium focus:border-green-500 outline-none h-28 resize-none"
                                />
                            </div>
                        </div>
                        <button
                            onClick={onAddContent}
                            disabled={!newContent.title || !newContent.url}
                            className="w-full py-6 bg-green-500 text-black rounded-[2.5rem] font-black uppercase text-[11px] tracking-[0.2em] hover:scale-105 disabled:opacity-30 transition-all shadow-2xl shadow-green-500/10"
                        >
                            Verify & Add to Library
                        </button>
                    </div>
                </div>
            )}

            {/* Edit Details Modal */}
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
                                    onChange={e => setEditingModule({ ...editingModule, title: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-sm font-bold focus:border-indigo-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] block mb-4">Update Description</label>
                                <textarea
                                    value={editingModule.description}
                                    onChange={e => setEditingModule({ ...editingModule, description: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm font-medium focus:border-indigo-500 outline-none h-40 resize-none"
                                />
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <button onClick={() => setEditingModule(null)} className="flex-1 py-6 bg-white/5 text-slate-400 rounded-[2.5rem] font-black uppercase text-[10px] tracking-[0.2em] border border-white/5 hover:bg-white/10 transition-all">Discard</button>
                            <button
                                onClick={onSaveModuleEdit}
                                className="flex-1 py-6 bg-indigo-600 text-white rounded-[2.5rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all"
                            >
                                Apply Metadata
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MentorsModals;
