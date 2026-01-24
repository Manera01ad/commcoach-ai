
import React from 'react';
import { Target, MessageSquare, ShieldAlert, Mic2, ChevronRight, Brain } from 'lucide-react';

interface CommCoachInfographicProps {
  onStartAssessment?: () => void;
  onStartMentorsLab?: () => void;
  onStartPracticeHub?: () => void;
  onStartMeetingIntelligence?: () => void;
}

const CommCoachInfographic: React.FC<CommCoachInfographicProps> = ({
  onStartAssessment,
  onStartMentorsLab,
  onStartPracticeHub,
  onStartMeetingIntelligence
}) => {
  const steps = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "30-Day Mastery",
      desc: "Begin your 60-step journey to forge your Communication DNA.",
      color: "bg-indigo-500",
      action: onStartAssessment
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Crafting the Message",
      desc: "Be a Well, not a Waterfall. Clear and concise.",
      color: "bg-emerald-500",
      action: onStartMentorsLab
    },
    {
      icon: <ShieldAlert className="w-6 h-6" />,
      title: "Navigating Challenges",
      desc: "Separate person from problem. Use 'What' not 'Why'.",
      color: "bg-rose-500",
      action: onStartMeetingIntelligence
    },
    {
      icon: <Mic2 className="w-6 h-6" />,
      title: "Delivering with Presence",
      desc: "Vocal power, strategic pauses, and body language.",
      color: "bg-amber-500",
      action: onStartPracticeHub
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-4 md:py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {steps.map((step, idx) => (
          <button
            key={idx}
            onClick={step.action}
            className="relative flex md:flex-col items-center md:items-start p-5 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-200 hover:-translate-y-1 transition-all group overflow-hidden text-left focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${step.color} opacity-[0.03] -mr-8 -mt-8 rounded-full group-hover:scale-150 transition-transform duration-700`} />

            <div className={`w-12 h-12 ${step.color} text-white rounded-2xl flex items-center justify-center mb-0 md:mb-5 mr-4 md:mr-0 shrink-0 shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform`}>
              {step.icon}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-900 mb-1 uppercase tracking-tight leading-tight">{step.title}</h4>
                <ChevronRight className="w-4 h-4 md:hidden text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-[11px] text-slate-500 leading-tight font-medium pr-4">{step.desc}</p>
            </div>

            <div className="hidden md:block absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all text-indigo-500">
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-6 md:gap-8">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confidence Mindset</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-100" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Well-like Delivery</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse delay-200" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vocal Power Drills</span>
        </div>
      </div>
    </div>
  );
};

export default CommCoachInfographic;
