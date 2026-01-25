
import React from 'react';

interface WelcomeScreenProps {
  onStart: (mode: 'assessment' | 'chat') => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col items-center justify-center text-center px-6">
      <div className="mb-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        <div className="inline-block px-4 py-1.5 mb-6 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black tracking-widest uppercase border border-indigo-100">
          Powered by Gemini 3 Pro
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
          Master the Art of <span className="text-indigo-600">Communication.</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
          Choose between a deep-dive performance assessment or get immediate strategic advice from your AI coach.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full">
        {/* Assessment Path */}
        <button 
          onClick={() => onStart('assessment')}
          className="group relative p-10 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm hover:border-indigo-500 hover:shadow-2xl transition-all duration-500 text-left flex flex-col h-full"
        >
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-3">Structured Assessment</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow font-medium">A systematic 10-step diagnostic of your current skills, confidence, and specific growth challenges.</p>
          <div className="text-xs font-black text-indigo-600 flex items-center tracking-widest uppercase">
            Start Diagnostic <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" strokeWidth={3}/></svg>
          </div>
        </button>

        {/* Strategic Chat Path */}
        <button 
          onClick={() => onStart('chat')}
          className="group relative p-10 bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-xl hover:shadow-2xl hover:border-indigo-500 transition-all duration-500 text-left flex flex-col h-full"
        >
          <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-500/20">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-white mb-3">Strategic Chat</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow font-medium">Skip the setup. Draft scripts, analyze emails, or get instant feedback on specific communication hurdles.</p>
          <div className="text-xs font-black text-indigo-400 flex items-center tracking-widest uppercase">
            Launch Assistant <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" strokeWidth={3}/></svg>
          </div>
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
