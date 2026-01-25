import React from 'react';
import { Trophy, Flame, Target, Brain, TrendingUp } from 'lucide-react';

export const TherapyDashboard: React.FC = () => {
    // For now, using mock data that would normally come from Supabase or global state
    const stats = {
        level: 3,
        streak: 7,
        xp: 450,
        nextXp: 1000,
        archetype: 'The Fortress',
        completed: 12
    };

    return (
        <div className="h-full bg-[#0A0A0B] text-white p-6 md:p-12 font-['Inter'] relative overflow-y-auto custom-scrollbar">
            {/* Aura Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 tracking-tight">
                        Therapy Progress.
                    </h1>
                    <p className="text-neutral-400 text-lg font-medium">Your communication evolution path.</p>
                </header>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Stats Card */}
                    <div className="lg:col-span-2 aura-card p-10 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-30 animate-pulse" />
                                    <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-3xl font-black border-2 border-purple-400/30">
                                        {stats.level}
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black">{stats.archetype}</h2>
                                    <p className="text-purple-400 font-bold tracking-widest uppercase text-xs">Level {stats.level} Communicator</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-4xl font-black text-white">{stats.xp}</div>
                                <div className="text-xs font-black text-neutral-500 uppercase tracking-widest">Mastery Points</div>
                            </div>
                        </div>

                        {/* XP Progress Bar */}
                        <div className="space-y-4">
                            <div className="flex justify-between text-xs font-black text-neutral-500 uppercase tracking-widest">
                                <span>Current Tier</span>
                                <span>{stats.nextXp - stats.xp} XP to next evolution</span>
                            </div>
                            <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 relative"
                                    style={{ width: `${(stats.xp / stats.nextXp) * 100}%` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Side Stats */}
                    <div className="space-y-6">
                        <div className="aura-card p-8 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-1">Consistency</p>
                                <h3 className="text-3xl font-black text-white">{stats.streak} Days</h3>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                                <Flame className="w-8 h-8 text-orange-500" />
                            </div>
                        </div>

                        <div className="aura-card p-8 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-1">Completed</p>
                                <h3 className="text-3xl font-black text-white">{stats.completed} Drills</h3>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                                <Target className="w-8 h-8 text-emerald-500" />
                            </div>
                        </div>

                        <div className="aura-card p-8 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-1">Archetype</p>
                                <h3 className="text-xl font-black text-white">Evolution</h3>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                                <TrendingUp className="w-8 h-8 text-indigo-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Grid */}
                <div className="mt-12 grid md:grid-cols-2 gap-8">
                    <div className="aura-card p-8 bg-gradient-to-br from-purple-600/10 to-transparent">
                        <div className="flex items-center gap-4 mb-6">
                            <Brain className="w-6 h-6 text-purple-400" />
                            <h3 className="text-xl font-black">Clinical Insights</h3>
                        </div>
                        <p className="text-neutral-400 text-sm leading-relaxed mb-8">
                            Based on your last 5 sessions, you are successfully moving from "The Fortress" towards shared vulnerability. Your confidence in emotional expression has increased by 14%.
                        </p>
                        <button className="text-xs font-black uppercase tracking-widest text-purple-400 hover:text-purple-300 underline decoration-2 underline-offset-8 transition-all">
                            View Detailed Archetype Analysis →
                        </button>
                    </div>

                    <div className="aura-card p-8 bg-gradient-to-br from-indigo-600/10 to-transparent">
                        <div className="flex items-center gap-4 mb-6">
                            <Trophy className="w-6 h-6 text-indigo-400" />
                            <h3 className="text-xl font-black">Next Milestone</h3>
                        </div>
                        <p className="text-neutral-400 text-sm leading-relaxed mb-8">
                            Complete 3 more "Active Listening" drills to unlock the <strong>"Empathy Architect"</strong> badge and reach Level 4.
                        </p>
                        <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
                            Go to Drills
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TherapyDashboard;
