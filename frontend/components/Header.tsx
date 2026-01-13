
import React from 'react';
import { SessionPhase } from '../types';
import { Target, Users, Mic2, Briefcase, Eye } from 'lucide-react';

interface HeaderProps {
  phase: SessionPhase;
  isVoiceMode: boolean;
  onReset: () => void;
  onSwitchPhase: (phase: SessionPhase) => void;
}

const Header: React.FC<HeaderProps> = ({ phase, isVoiceMode, onReset, onSwitchPhase }) => {
  return (
    <header className="h-16 lg:h-20 border-b bg-white flex items-center justify-between px-4 lg:px-8 shadow-sm z-40 relative">
      <div className="flex items-center space-x-4 lg:space-x-12">
        <button onClick={onReset} className="flex items-center space-x-2 group shrink-0">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-slate-900 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Target className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
          </div>
          <h1 className="font-black text-base lg:text-xl text-slate-800 tracking-tighter italic hidden xs:block">CommCoach.</h1>
        </button>

        <nav className="flex items-center bg-slate-50 p-1 rounded-xl lg:rounded-2xl border border-slate-100 overflow-x-auto no-scrollbar max-w-[180px] sm:max-w-none">
          {[
            { id: SessionPhase.CHAT, label: 'Diag', icon: <Target className="w-3 h-3" /> },
            { id: SessionPhase.MENTORS, label: 'Ment', icon: <Users className="w-3 h-3" /> },
            { id: SessionPhase.AGENT, label: 'Meet', icon: <Briefcase className="w-3 h-3" /> },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => onSwitchPhase(item.id)}
              className={`px-3 lg:px-5 py-1.5 lg:py-2 rounded-lg lg:rounded-xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-all flex items-center space-x-1 lg:space-x-2 shrink-0 ${
                phase === item.id ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {item.icon}
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center space-x-2 lg:space-x-6">
        <button 
          onClick={() => onSwitchPhase(SessionPhase.PROFILE)}
          className={`group flex items-center space-x-2 lg:space-x-3 p-1.5 lg:p-2 rounded-xl lg:rounded-2xl transition-all ${phase === SessionPhase.PROFILE ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-50 border border-transparent'}`}
        >
          <div className="hidden sm:block text-right">
             <div className="text-[8px] lg:text-[9px] font-black text-slate-800 uppercase tracking-widest leading-none">Level 12</div>
             <div className="text-[7px] lg:text-[8px] font-bold text-indigo-400 uppercase tracking-[0.2em]">Profile</div>
          </div>
          <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-lg lg:rounded-xl bg-slate-900 flex items-center justify-center text-[9px] lg:text-[11px] font-black text-white">JD</div>
        </button>
      </div>
    </header>
  );
};

export default Header;
