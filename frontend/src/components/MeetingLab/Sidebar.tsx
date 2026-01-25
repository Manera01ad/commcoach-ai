import React, { useRef, useEffect } from 'react';
import { SessionState } from '../types';
import { ASSESSMENT_QUESTIONS } from '../constants';

interface SidebarProps {
  session: SessionState;
  isOpen: boolean;
  onToggle: () => void;
  onJumpToStep: (step: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ session, isOpen, onToggle, onJumpToStep }) => {
  const { metrics, assessmentStep } = session;
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      const activeElement = listRef.current.children[assessmentStep] as HTMLElement;
      if (activeElement) {
        listRef.current.scrollTo({
          top: activeElement.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    }
  }, [assessmentStep]);

  const getStageName = (idx: number) => {
    if (idx < 15) return "Assessment";
    if (idx < 48) return "Practice";
    if (idx < 52) return "Check-in";
    if (idx < 60) return "Evaluation";
    if (idx < 65) return "Recommendations";
    if (idx < 70) return "Planning";
    if (idx < 75) return "Metadata";
    return "Rapid Fire";
  };

  return (
    <aside className={`${isOpen ? 'w-80' : 'w-0'} bg-[#0f172a] text-slate-300 transition-all duration-500 flex flex-col overflow-hidden relative border-r border-slate-800 shadow-[20px_0_40px_rgba(0,0,0,0.3)] z-30 shrink-0`}>
      <div className="p-7 h-full flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-8 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_15px_#6366f1]" />
            <h3 className="font-black text-white text-[11px] tracking-[0.2em] uppercase">Adaptive Lab</h3>
          </div>
          <div className="px-2.5 py-1 bg-indigo-600/20 text-indigo-400 rounded-md text-[9px] font-black border border-indigo-500/40">
            STEP {assessmentStep + 1}/80
          </div>
        </div>

        <div className="mb-8 shrink-0">
          <div className="flex justify-between items-end mb-3">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Clarity Index</span>
            <div className="flex items-center space-x-2">
               <span className="text-2xl font-black text-white">{metrics.clarityScore}%</span>
            </div>
          </div>
          <div className="h-1.5 w-full bg-slate-800/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all duration-1000 ease-out" 
              style={{ width: `${metrics.clarityScore}%` }} 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8 shrink-0">
          <div className="p-4 bg-slate-900/40 rounded-[1.5rem] border border-slate-800 flex flex-col">
            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Tone</div>
            <div className="text-sm font-black text-white truncate">{metrics.emotionalTone}</div>
          </div>
          <div className="p-4 bg-slate-900/40 rounded-[1.5rem] border border-slate-800 flex flex-col">
            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Hesitation</div>
            <div className="text-sm font-black text-indigo-400">{metrics.hesitationPatterns}/10</div>
          </div>
        </div>

        <div className="flex-1 min-h-0 flex flex-col mb-6">
           <div className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-[0.25em] flex justify-between items-center shrink-0">
              <span>Session Map</span>
              <span className="text-indigo-400 text-[9px]">{getStageName(assessmentStep)}</span>
           </div>
           <div ref={listRef} className="flex-1 overflow-y-auto custom-scrollbar-dark pr-2 space-y-2 min-h-0 scroll-container">
              {ASSESSMENT_QUESTIONS.map((q, idx) => {
                const isFirstInStage = idx === 0 || getStageName(idx) !== getStageName(idx - 1);
                const isActive = idx === assessmentStep;
                const isCompleted = idx < assessmentStep;

                return (
                  <React.Fragment key={idx}>
                    {isFirstInStage && (
                      <div className="pt-4 pb-2 border-b border-slate-800/50 mb-2">
                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em]">{getStageName(idx)}</span>
                      </div>
                    )}
                    <button 
                      onClick={() => onJumpToStep(idx)}
                      className={`w-full flex items-start group text-left p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-indigo-600/10' : 'hover:bg-slate-800/40'}`}
                    >
                      <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mr-4 mt-0.5 text-[9px] font-black transition-all ${
                        isCompleted ? 'bg-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 
                        isActive ? 'bg-white text-slate-950 ring-[4px] ring-indigo-500/20' : 'bg-slate-800 text-slate-600'
                      }`}>
                        {isCompleted ? '✓' : idx + 1}
                      </div>
                      <span className={`text-[11px] leading-tight transition-all pr-2 mt-1 ${isActive ? 'text-white font-black' : 'text-slate-500 font-bold group-hover:text-slate-400'}`}>
                        {q.length > 60 ? q.substring(0, 60) + '...' : q}
                      </span>
                    </button>
                  </React.Fragment>
                );
              })}
           </div>
        </div>

        <div className="p-5 bg-indigo-500/5 border border-indigo-500/20 rounded-[1.8rem] backdrop-blur-sm mt-auto shrink-0">
           <p className="text-[10px] text-slate-400 leading-relaxed font-bold">
             Analyzing <span className="text-white">{getStageName(assessmentStep).toLowerCase()}</span> engagement patterns.
           </p>
        </div>
      </div>
      
      <button onClick={onToggle} className="absolute -right-3 top-1/2 -translate-y-1/2 bg-indigo-600 text-white rounded-full p-1.5 shadow-2xl z-50">
        <svg className={`w-4 h-4 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </aside>
  );
};

export default Sidebar;