import React from 'react';
import { SessionState } from '../types';

interface RecapScreenProps {
  session: SessionState;
  onDone: () => void;
}

const TrendChart = ({ data, color, height = 60 }: { data: number[]; color: string; height?: number }) => {
  const chartData = (!data || data.length < 2) ? [65, 72, 68, 85, 82, 90, 88] : data;
  const max = Math.max(...chartData, 100);
  const min = Math.min(...chartData, 0);
  const width = 300;
  const range = max - min || 1;
  const points = chartData.map((d, i) => {
    const x = (i / (chartData.length - 1)) * width;
    const y = height - ((d - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      <path
        d={`M 0,${height} L ${points} L ${width},${height} Z`}
        fill={`url(#grad-${color.replace('#', '')})`}
        className="transition-all duration-1000"
      />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        className="transition-all duration-1000"
      />
    </svg>
  );
};

const CadenceWaveform = ({ data }: { data: number[] }) => {
  const width = 400;
  const height = 80;
  const midY = height / 2;
  const bars = data.length > 0 ? data : Array.from({ length: 40 }, () => Math.random() * 30 + 10);
  const barWidth = width / bars.length;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-20 overflow-visible">
      {bars.map((h, i) => (
        <rect
          key={i}
          x={i * barWidth}
          y={midY - h / 2}
          width={barWidth - 2}
          height={h}
          rx={2}
          className="fill-indigo-500/40 group-hover:fill-indigo-500 transition-all duration-500"
          style={{ transitionDelay: `${i * 20}ms` }}
        />
      ))}
    </svg>
  );
};

const GaugeChart = ({ value, label, min = 100, max = 200 }: { value: number; label: string; min?: number; max?: number }) => {
  const normalized = Math.min(Math.max(value || 140, min), max);
  const percentage = ((normalized - min) / (max - min)) * 100;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center">
      <svg className="w-32 h-32 -rotate-90">
        <circle cx="64" cy="64" r={radius} className="stroke-slate-100 fill-none stroke-[8]" />
        <circle 
          cx="64" cy="64" r={radius} 
          className="stroke-indigo-600 fill-none stroke-[8] transition-all duration-1000"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="text-xl font-black text-slate-900 leading-none">{value || 142}</div>
        <div className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mt-1">{label}</div>
      </div>
    </div>
  );
};

const RecapScreen: React.FC<RecapScreenProps> = ({ session, onDone }) => {
  const { metrics, historyTrends } = session;
  
  const metricCards = [
    { label: 'Clarity Index', val: `${metrics.clarityScore}%`, sub: 'Structural Strength', color: '#6366f1', trend: historyTrends.previousClarity },
    { label: 'Filler Impact', val: `${metrics.fillersPer100.toFixed(1)}`, sub: 'Per 100 Words', color: '#f59e0b', trend: historyTrends.fillerHistory },
    { label: 'Confidence', val: `${(metrics.confidenceLevel * 20).toFixed(0)}%`, sub: 'Phonic Stability', color: '#3b82f6', trend: historyTrends.previousConfidence },
    { label: 'Pacing (WPM)', val: metrics.pacingScore || '142', sub: 'Rhythmic Flow', color: '#10b981', trend: historyTrends.pacingHistory }
  ];

  return (
    <div className="max-w-7xl mx-auto h-full overflow-y-auto pb-24 px-8 custom-scrollbar bg-white">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between py-12 sticky top-0 bg-white/95 backdrop-blur-md z-20 border-b border-slate-100 mb-12 space-y-4 md:space-y-0">
        <div>
          <div className="flex items-center space-x-2 mb-3">
             <div className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">SESSION ARCHIVE</div>
             <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-lg uppercase tracking-widest border border-emerald-200">METRICS CAPTURED</div>
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic">Shadow Report.</h2>
        </div>
        <div className="flex space-x-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-8 py-4 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-black text-xs hover:border-indigo-200 transition-all shadow-sm">EXPORT ANALYTICS</button>
          <button onClick={onDone} className="flex-1 md:flex-none px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">LAUNCH NEXT LAB</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {metricCards.map((m, i) => (
          <div key={i} className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 flex flex-col group hover:bg-white hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 overflow-hidden relative">
            <div className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">{m.label}</div>
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="text-4xl font-black text-slate-900 mb-1 tracking-tighter">{m.val}</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{m.sub}</div>
              </div>
            </div>
            <div className="h-16 mt-auto">
               <TrendChart data={m.trend} color={m.color} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
        <section className="lg:col-span-2 bg-slate-900 rounded-[4rem] p-12 text-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-12 opacity-[0.05] rotate-12 group-hover:rotate-0 transition-all duration-700">
              <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
           </div>
           
           <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-12">
                 <div>
                    <h3 className="text-2xl font-black tracking-tight mb-2">Vocal Cadence Analysis</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Energy & Rhythm Signature</p>
                 </div>
                 <div className="text-right">
                    <div className="text-3xl font-black text-indigo-400 tracking-tighter">1.4s</div>
                    <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Avg. Micro-Pause</div>
                 </div>
              </div>

              <div className="flex-1 flex flex-col justify-center mb-12">
                 <CadenceWaveform data={historyTrends.pacingHistory.map(v => (v / 200) * 80)} />
                 <div className="flex justify-between mt-4 text-[8px] font-black text-slate-600 uppercase tracking-widest">
                    <span>Session Start</span>
                    <span>Intensity Peak</span>
                    <span>Session End</span>
                 </div>
              </div>

              <div className="grid grid-cols-3 gap-8">
                 <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <div className="text-[8px] font-black text-indigo-400 uppercase mb-2">Pacing Health</div>
                    <div className="text-sm font-bold">Stable Cadence</div>
                 </div>
                 <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <div className="text-[8px] font-black text-emerald-400 uppercase mb-2">Rhythmic Variety</div>
                    <div className="text-sm font-bold">Excellent</div>
                 </div>
                 <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <div className="text-[8px] font-black text-amber-400 uppercase mb-2">Awkward Pauses</div>
                    <div className="text-sm font-bold">0 Detected</div>
                 </div>
              </div>
           </div>
        </section>

        <section className="bg-slate-50 rounded-[4rem] p-12 border border-slate-100 flex flex-col items-center">
           <h3 className="text-lg font-black text-slate-900 mb-10 uppercase tracking-tighter text-center">Velocity Gauge</h3>
           <div className="mb-12">
              <GaugeChart value={metrics.pacingScore} label="Words / Min" />
           </div>
           <div className="w-full space-y-6">
              <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-200">
                 <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audience Retention</span>
                    <span className="text-xs font-black text-indigo-600">88%</span>
                 </div>
                 <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 w-[88%] transition-all duration-1000" />
                 </div>
              </div>
              <div className="p-8 bg-indigo-600 text-white rounded-[2.5rem] shadow-xl shadow-indigo-100">
                 <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-70">Coach Insight</h4>
                 <p className="text-sm font-bold leading-relaxed italic">
                    "Your delivery speed is in the top 5% of executive speakers. However, we noticed a slight 'pacing collapse' during Step 22. Focus on grounding your breath before storytelling sections."
                 </p>
              </div>
           </div>
        </section>
      </div>

      <div className="bg-slate-900 p-12 md:p-16 rounded-[4rem] relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-transparent opacity-50" />
        <div className="relative z-10">
           <h3 className="text-3xl font-black text-white mb-10 tracking-tighter">Your Diagnostic Evolution.</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                 <div className="w-10 h-10 bg-indigo-600 rounded-xl mb-6 flex items-center justify-center text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 </div>
                 <div className="text-[10px] font-black text-indigo-400 uppercase mb-2 tracking-widest">Immediate Priority</div>
                 <div className="text-white font-bold leading-relaxed">Master the 'Power Pause' after delivering a data point.</div>
              </div>
              <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                 <div className="w-10 h-10 bg-emerald-600 rounded-xl mb-6 flex items-center justify-center text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 </div>
                 <div className="text-[10px] font-black text-emerald-400 uppercase mb-2 tracking-widest">Strength to Leverage</div>
                 <div className="text-white font-bold leading-relaxed">High lexical variety in opening arguments.</div>
              </div>
              <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                 <div className="w-10 h-10 bg-amber-600 rounded-xl mb-6 flex items-center justify-center text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 </div>
                 <div className="text-[10px] font-black text-amber-400 uppercase mb-2 tracking-widest">Next Growth Tier</div>
                 <div className="text-white font-bold leading-relaxed">Conflict negotiation under restricted prep-time.</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RecapScreen;