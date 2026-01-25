
import React, { useState, useMemo } from 'react';
import { UserProfile, AvatarCloneConfig } from '../types';
import { Brain, Cpu, Zap, Activity, Shield, Sparkles, Sliders, MessageSquare, Target, Award } from 'lucide-react';

interface ProfileDashboardProps {
  profile: UserProfile;
  onUpdateProfile: (p: UserProfile) => void;
}

const ProfileDashboard: React.FC<ProfileDashboardProps> = ({ profile, onUpdateProfile }) => {
  const [clone, setClone] = useState<AvatarCloneConfig>({
    ...profile.cloneConfig,
    humorLevel: profile.cloneConfig.humorLevel || 40,
    analyticalDepth: profile.cloneConfig.analyticalDepth || 70,
    formality: profile.cloneConfig.formality || 80,
    trainingContext: profile.cloneConfig.trainingContext || "Focus on delivering high-impact executive summaries."
  });

  const handleCloneUpdate = (key: keyof AvatarCloneConfig, value: any) => {
    const updated = { ...clone, [key]: value };
    setClone(updated);
    onUpdateProfile({ ...profile, cloneConfig: updated });
  };

  const themeColors = {
    Indigo: 'from-indigo-600 to-blue-500',
    Crimson: 'from-rose-600 to-red-500',
    Emerald: 'from-emerald-600 to-teal-500',
    Amber: 'from-amber-600 to-orange-500',
    Slate: 'from-slate-700 to-slate-900'
  };

  const personaBio = useMemo(() => {
    const { directness, empathy, vocabularyComplexity, formality } = clone;
    let bio = "This avatar is engineered to be ";
    if (directness > 75) bio += "decisive and high-efficiency, ";
    else if (directness < 30) bio += "nuanced and consultative, ";
    else bio += "adaptable in its delivery, ";

    if (empathy > 75) bio += "utilizing emotional resonance as a primary tool. ";
    else bio += "optimizing for objective factual integrity. ";

    if (formality > 70) bio += "It maintains a rigorous professional standard, ";
    else bio += "It operates with a conversational, accessible vibe, ";

    if (vocabularyComplexity > 80) bio += "utilizing advanced rhetoric to project mastery.";
    else bio += "ensuring maximum clarity for diverse audiences.";

    return bio;
  }, [clone]);

  const RadarChart = ({ data, labels }: { data: number[], labels: string[] }) => {
    const size = 220;
    const center = size / 2;
    const radius = 85;
    const angles = data.map((_, i) => (i * 2 * Math.PI) / data.length);
    
    const points = data.map((val, i) => {
      const r = (val / 100) * radius;
      const x = center + r * Math.cos(angles[i] - Math.PI / 2);
      const y = center + r * Math.sin(angles[i] - Math.PI / 2);
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
          {[0.2, 0.4, 0.6, 0.8, 1.0].map(scale => {
            const path = angles.map(angle => {
              const r = scale * radius;
              return `${center + r * Math.cos(angle - Math.PI / 2)},${center + r * Math.sin(angle - Math.PI / 2)}`;
            }).join(' ');
            return <polygon key={scale} points={path} className="fill-none stroke-slate-200 stroke-[0.5]" />;
          })}
          {angles.map((angle, i) => (
            <line 
              key={i} 
              x1={center} y1={center} 
              x2={center + radius * Math.cos(angle - Math.PI / 2)} 
              y2={center + radius * Math.sin(angle - Math.PI / 2)} 
              className="stroke-slate-200 stroke-[0.5]"
            />
          ))}
          <polygon 
            points={points} 
            className="fill-indigo-500/20 stroke-indigo-600 stroke-2 transition-all duration-1000 ease-in-out" 
          />
          {data.map((val, i) => {
            const r = (val / 100) * radius;
            const x = center + r * Math.cos(angles[i] - Math.PI / 2);
            const y = center + r * Math.sin(angles[i] - Math.PI / 2);
            return <circle key={i} cx={x} cy={y} r="4" className="fill-indigo-600" />;
          })}
        </svg>
        {labels.map((label, i) => {
          const x = center + (radius + 25) * Math.cos(angles[i] - Math.PI / 2);
          const y = center + (radius + 20) * Math.sin(angles[i] - Math.PI / 2);
          return (
            <div key={label} className="absolute text-[8px] font-black uppercase tracking-widest text-slate-400 text-center w-20" style={{ left: x - 40, top: y - 10 }}>
              {label}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-full w-full bg-[#f8fafc] overflow-y-auto px-6 py-8 lg:px-12 lg:py-16 custom-scrollbar animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Stats */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-8 bg-white p-8 lg:p-12 rounded-[4rem] border border-slate-100 shadow-sm">
          <div className="flex items-center space-x-10">
            <div className="relative group">
              <div className="w-32 h-32 bg-slate-900 rounded-[3.5rem] flex items-center justify-center text-5xl text-white font-black shadow-2xl relative z-10 border-4 border-white overflow-hidden group-hover:rotate-6 transition-transform">
                {profile.name[0]}
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white border-4 border-white shadow-lg animate-pulse">
                 <Award className="w-6 h-6" />
              </div>
            </div>
            <div>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter italic">{profile.name}.</h2>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                 <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest rounded-xl border border-indigo-100 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" /> Level {profile.level} Communicator
                 </span>
                 <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{profile.totalSessions} Protocols Completed</span>
              </div>
            </div>
          </div>
          <div className="flex divide-x divide-slate-100 bg-slate-50 p-6 rounded-3xl">
            <div className="px-8 flex flex-col items-center">
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Elo Power</div>
               <div className="text-4xl font-black text-slate-900 tracking-tighter">{profile.eloScore}</div>
            </div>
            <div className="px-8 flex flex-col items-center">
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Synch Streak</div>
               <div className="text-4xl font-black text-indigo-600 tracking-tighter">{profile.streak}d</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Personality Definition Lab */}
          <div className="lg:col-span-5 space-y-10">
            <section className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Sliders className="w-24 h-24" />
              </div>
              <div className="mb-10 relative z-10">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <Cpu className="w-6 h-6 text-indigo-600" /> Behavioral Blueprint.
                </h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Configure the Shadow Personality</p>
              </div>
              
              <div className="space-y-8 relative z-10">
                {[
                  { label: 'Directness', key: 'directness', icon: <Target className="w-3 h-3" /> },
                  { label: 'Empathy', key: 'empathy', icon: <Sparkles className="w-3 h-3" /> },
                  { label: 'Formality', key: 'formality', icon: <Shield className="w-3 h-3" /> },
                  { label: 'Analytical Depth', key: 'analyticalDepth', icon: <Brain className="w-3 h-3" /> },
                  { label: 'Humor Level', key: 'humorLevel', icon: <Zap className="w-3 h-3" /> }
                ].map(trait => (
                  <div key={trait.key} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">{trait.icon}</span>
                        <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{trait.label}</label>
                      </div>
                      <span className="text-[10px] font-black text-indigo-600">{(clone as any)[trait.key]}%</span>
                    </div>
                    <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="absolute h-full bg-indigo-600 transition-all duration-500 ease-out" 
                        style={{ width: `${(clone as any)[trait.key]}%` }}
                      />
                      <input 
                        type="range" 
                        value={(clone as any)[trait.key]} 
                        onChange={e => handleCloneUpdate(trait.key as any, Number(e.target.value))} 
                        className="absolute inset-0 w-full opacity-0 cursor-pointer" 
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-10 border-t border-slate-50">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Ideal Training Context</label>
                <textarea 
                  value={clone.trainingContext}
                  onChange={e => handleCloneUpdate('trainingContext', e.target.value)}
                  placeholder="Describe the persona's ultimate goal..."
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 text-sm font-medium focus:border-indigo-500 outline-none h-32 resize-none transition-all"
                />
              </div>
            </section>

            <section className="bg-slate-900 p-12 rounded-[3.5rem] text-white overflow-hidden">
               <div className="flex items-center justify-between mb-10">
                  <h3 className="text-xl font-black italic flex items-center gap-3">
                    <Activity className="w-5 h-5 text-emerald-400" /> Equilibrium Map.
                  </h3>
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Scientific Analysis</span>
               </div>
               <div className="flex justify-center py-6">
                  <RadarChart 
                    data={[clone.directness, clone.empathy, clone.formality, clone.analyticalDepth, clone.humorLevel]} 
                    labels={['Direct', 'Empathy', 'Formal', 'Analytical', 'Humor']}
                  />
               </div>
               <div className="grid grid-cols-2 gap-4 mt-10">
                  <div className="text-center p-5 bg-white/5 rounded-3xl border border-white/5">
                     <div className="text-[8px] font-black text-slate-500 uppercase mb-1">Persona Tone</div>
                     <div className="text-xs font-black uppercase tracking-tighter text-indigo-400">{clone.visualArchetype}</div>
                  </div>
                  <div className="text-center p-5 bg-white/5 rounded-3xl border border-white/5">
                     <div className="text-[8px] font-black text-slate-500 uppercase mb-1">Neural Sync</div>
                     <div className="text-xs font-black">96.8%</div>
                  </div>
               </div>
            </section>
          </div>

          {/* Visual & Mastery Engine */}
          <div className="lg:col-span-7 space-y-10">
            <section className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm relative overflow-hidden">
               <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                      <Zap className="w-8 h-8 text-amber-500" /> Best-Clone Synthesis.
                    </h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Realizing your communication potential</p>
                  </div>
                  <div className="flex gap-2">
                    {Object.keys(themeColors).map(theme => (
                      <button 
                        key={theme}
                        onClick={() => handleCloneUpdate('visualTheme', theme)}
                        className={`w-10 h-10 rounded-full border-4 transition-all ${clone.visualTheme === theme ? 'border-white ring-4 ring-indigo-100 scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                        style={{ background: `linear-gradient(135deg, ${(themeColors as any)[theme].split(' ')[1]}, ${(themeColors as any)[theme].split(' ')[3]})` }}
                      />
                    ))}
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="relative group">
                     <div className="absolute inset-0 bg-indigo-500/5 rounded-full blur-[100px] animate-pulse" />
                     <div className="relative z-10 w-full aspect-square bg-slate-50/50 backdrop-blur-2xl border-2 border-dashed border-slate-200 rounded-[5rem] flex flex-col items-center justify-center p-12 group-hover:border-indigo-500 transition-colors">
                        <div className={`w-36 h-36 bg-gradient-to-br ${(themeColors as any)[clone.visualTheme]} rounded-[3rem] mb-8 flex items-center justify-center text-white shadow-2xl relative transition-all duration-700 group-hover:scale-110`}>
                          <Sparkles className="w-16 h-16 opacity-30 absolute animate-spin-slow" />
                          <Brain className="w-16 h-16 relative z-10" />
                        </div>
                        <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-2 uppercase italic">{clone.visualArchetype}</h4>
                        <div className="flex gap-2">
                           <span className="text-[9px] font-black px-3 py-1 bg-slate-900 text-white rounded-lg uppercase tracking-tighter">AI AGENT v2</span>
                           <span className="text-[9px] font-black px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg uppercase tracking-tighter">CALIBRATED</span>
                        </div>
                        <div className="mt-8 pt-8 border-t border-slate-100 w-full text-center">
                           <p className="text-[11px] text-slate-500 leading-relaxed italic font-medium">"{personaBio}"</p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-10">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-6">Visual Archetype Selection</label>
                      <div className="grid grid-cols-2 gap-3">
                        {(['Professional', 'Academic', 'Stoic', 'Warm', 'High-Energy'] as const).map(arch => (
                          <button 
                            key={arch}
                            onClick={() => handleCloneUpdate('visualArchetype', arch)}
                            className={`px-5 py-4 rounded-[1.8rem] text-[9px] font-black uppercase tracking-widest border-2 transition-all ${clone.visualArchetype === arch ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-100'}`}
                          >
                            {arch}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                       <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Complexity Bias</label>
                            <span className="text-[9px] font-black text-indigo-600">{clone.vocabularyComplexity}%</span>
                          </div>
                          <input 
                            type="range" 
                            value={clone.vocabularyComplexity} 
                            onChange={e => handleCloneUpdate('vocabularyComplexity', Number(e.target.value))} 
                            className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600" 
                          />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Neural Vocal Signature</label>
                          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                             {(['low', 'medium', 'high'] as const).map(p => (
                               <button 
                                 key={p}
                                 onClick={() => handleCloneUpdate('vocalPitch', p)}
                                 className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${clone.vocalPitch === p ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                               >
                                 {p}
                               </button>
                             ))}
                          </div>
                       </div>
                    </div>

                    <div className="pt-6">
                       <button className="w-full py-6 bg-indigo-600 text-white rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group">
                          <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" /> Sync Avatar DNA
                       </button>
                    </div>
                  </div>
               </div>
            </section>

            {/* Scientific Mastery Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="bg-indigo-600 p-8 rounded-[3.5rem] text-white shadow-xl flex flex-col items-center text-center group hover:-translate-y-2 transition-all">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                    <MessageSquare className="w-7 h-7" />
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-widest mb-1">Rhetoric Master</h4>
                  <div className="text-[9px] font-bold opacity-70 mb-4">5/5 Sessions Comp.</div>
                  <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-full" />
                  </div>
               </div>
               <div className="bg-slate-900 p-8 rounded-[3.5rem] text-white shadow-xl flex flex-col items-center text-center group hover:-translate-y-2 transition-all">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/20 text-emerald-400">
                    <Activity className="w-7 h-7" />
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-widest mb-1">Neuro-Velocity</h4>
                  <div className="text-[9px] font-bold opacity-70 mb-4">Elite 0.4s Lag Time</div>
                  <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 w-[90%]" />
                  </div>
               </div>
               <div className="bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:-translate-y-2 transition-all">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 border border-slate-100 text-indigo-600">
                    <Target className="w-7 h-7" />
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-widest mb-1">Impact Accuracy</h4>
                  <div className="text-[9px] font-bold text-slate-400 mb-4">88% Sentiment Sync</div>
                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 w-[88%]" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
