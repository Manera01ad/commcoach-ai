import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Settings, Zap, Activity, Target, MessageSquare, Brain } from 'lucide-react';

interface DNAProfileProps {
    data: {
        archetype: string;
        traits: {
            clarity: number;
            empathy: number;
            confidence: number;
            persuasion: number;
        };
        strengths: string[];
        weaknesses: string[];
        recommendedTone: string;
    };
    onRetake: () => void;
}

// Helper for Radar Chart
const RadarChart = ({ traits }: { traits: number[] }) => {
    // 5 axes for: Direct, Empathy, Formal, Analytical, Humor
    // We normalize data to 0-100 scale
    const size = 200;
    const center = size / 2;
    const radius = size * 0.4;
    const angleStep = (Math.PI * 2) / 5;

    const points = traits.map((value, i) => {
        const angle = i * angleStep - Math.PI / 2; // Start from top
        const r = (value / 100) * radius;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return `${x},${y}`;
    }).join(' ');

    // Axis lines
    const axes = Array.from({ length: 5 }).map((_, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />;
    });

    return (
        <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
            {/* Background Polygon */}
            <polygon points={Array.from({ length: 5 }).map((_, i) => {
                const angle = i * angleStep - Math.PI / 2;
                const x = center + radius * Math.cos(angle);
                const y = center + radius * Math.sin(angle);
                return `${x},${y}`;
            }).join(' ')} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />

            {/* Axes */}
            {axes}

            {/* Data Polygon */}
            <motion.polygon
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                points={points}
                fill="rgba(99, 102, 241, 0.3)" // Indigo-500 equivalent
                stroke="#6366f1"
                strokeWidth="2"
            />

            {/* Labels */}
            {['DIRECT', 'EMPATHY', 'FORMAL', 'ANALYTICAL', 'HUMOR'].map((label, i) => {
                const angle = i * angleStep - Math.PI / 2;
                const r = radius + 20;
                const x = center + r * Math.cos(angle);
                const y = center + r * Math.sin(angle);
                return (
                    <text key={i} x={x} y={y} fontSize="8" fill="#9ca3af" textAnchor="middle" alignmentBaseline="middle">
                        {label}
                    </text>
                );
            })}
        </svg>
    );
};

const CommDNAProfile: React.FC<DNAProfileProps> = ({ data, onRetake }) => {
    // Map existing core traits to the UI's expanded trait set
    // Directness ~ Clarity
    // Empathy ~ Empathy
    // Formality ~ Confidence (approx)
    // Analytical ~ Persuasion (approx)
    // Humor ~ Derived
    const traits = {
        Directness: data.traits.clarity,
        Empathy: data.traits.empathy,
        Formality: data.traits.confidence,
        Analytical: data.traits.persuasion,
        Humor: Math.max(20, 100 - data.traits.confidence) // Inverse of formality usually
    };

    const radarData = [
        traits.Directness,
        traits.Empathy,
        traits.Formality,
        traits.Analytical,
        traits.Humor
    ];

    const [activeArchetype, setActiveArchetype] = useState(data.recommendedTone.toUpperCase() || 'PROFESSIONAL');
    const [complexity, setComplexity] = useState(60);
    const [vocalSig, setVocalSig] = useState('MEDIUM');

    return (
        <div className="space-y-6 font-sans">
            {/* 1. Header Card */}
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-sm border border-neutral-100 dark:border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-neutral-900 text-white flex items-center justify-center text-3xl font-bold pb-1 relative">
                        U
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-500 rounded-full border-4 border-white dark:border-neutral-900" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-1">User One.</h1>
                        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-full w-fit">
                            <Zap className="w-3 h-3" /> LEVEL 12 COMMUNICATOR
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-8 bg-neutral-50 dark:bg-neutral-800/50 px-8 py-4 rounded-2xl">
                    <div className="text-center">
                        <div className="text-xs font-bold text-neutral-400 tracking-wider mb-1">ELO POWER</div>
                        <div className="text-2xl font-extrabold text-neutral-900 dark:text-white">1450</div>
                    </div>
                    <div className="w-px h-8 bg-neutral-200 dark:bg-neutral-700" />
                    <div className="text-center">
                        <div className="text-xs font-bold text-neutral-400 tracking-wider mb-1">SYNCH STREAK</div>
                        <div className="text-2xl font-extrabold text-indigo-500">5d</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* 2. Behavioral Blueprint (Left Col) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-sm border border-neutral-100 dark:border-neutral-800"
                >
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Activity className="w-5 h-5 text-indigo-500" />
                                <h2 className="text-xl font-bold">Behavioral Blueprint.</h2>
                            </div>
                            <p className="text-xs text-neutral-400 tracking-wider font-semibold">CONFIGURE THE SHADOW PERSONALITY</p>
                        </div>
                        {/* Audio mixer icon visual */}
                        <div className="flex gap-1">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex flex-col gap-1">
                                    <div className={`w-1 h-3 rounded-full ${i === 2 ? 'bg-indigo-500' : 'bg-neutral-200 dark:bg-neutral-700'}`} />
                                    <div className={`w-1 h-6 rounded-full ${i === 1 ? 'bg-indigo-500' : 'bg-neutral-200 dark:bg-neutral-700'}`} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        {[
                            { label: 'DIRECTNESS', value: traits.Directness },
                            { label: 'EMPATHY', value: traits.Empathy },
                            { label: 'FORMALITY', value: traits.Formality },
                            { label: 'ANALYTICAL DEPTH', value: traits.Analytical },
                            { label: 'HUMOR LEVEL', value: traits.Humor },
                        ].map((trait) => (
                            <div key={trait.label}>
                                <div className="flex justify-between text-xs font-bold text-neutral-500 mb-2">
                                    <span>{trait.label}</span>
                                    <span>{trait.value}%</span>
                                </div>
                                <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${trait.value}%` }}
                                        className="h-full bg-indigo-500 rounded-full"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 bg-neutral-50 dark:bg-neutral-800/30 p-6 rounded-2xl">
                        <div className="text-xs font-bold text-neutral-400 mb-2">IDEAL TRAINING CONTEXT</div>
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Based on your {data.archetype} profile, focus on delivering high-impact executive summaries to balance your natural empathy.
                        </p>
                    </div>
                </motion.div>

                {/* 3. Best-Clone Synthesis (Right Col) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-sm border border-neutral-100 dark:border-neutral-800"
                >
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-1">
                            <Zap className="w-5 h-5 text-amber-500" />
                            <h2 className="text-xl font-bold">Best-Clone Synthesis.</h2>
                        </div>
                        <p className="text-xs text-neutral-400 tracking-wider font-semibold">REALIZING YOUR COMMUNICATION POTENTIAL</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Avatar Visual */}
                        <div className="bg-neutral-50 dark:bg-neutral-800/20 rounded-full p-8 border-2 border-dashed border-neutral-200 dark:border-neutral-700 flex flex-col items-center justify-center text-center w-full md:w-1/2 aspect-[3/4]">
                            <div className="w-24 h-24 bg-indigo-500 rounded-3xl shadow-lg shadow-indigo-500/30 flex items-center justify-center text-white mb-4">
                                <Brain className="w-12 h-12" />
                            </div>
                            <h3 className="font-extrabold text-lg mb-1">{activeArchetype}</h3>
                            <div className="flex gap-2 mb-6">
                                <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded">AI AGENT V2</span>
                                <span className="text-[10px] text-indigo-500 font-bold px-2 py-0.5 border border-indigo-200 rounded">CALIBRATED</span>
                            </div>
                            <p className="text-xs text-neutral-400 leading-relaxed italic">
                                "This avatar is engineered to be decisive and high-efficiency, utilizing emotional resonance as a primary tool."
                            </p>
                        </div>

                        {/* Controls */}
                        <div className="flex-1 space-y-6">
                            <div>
                                <div className="text-xs font-bold text-neutral-400 mb-3">VISUAL ARCHETYPE SELECTION</div>
                                <div className="flex flex-wrap gap-2">
                                    {['PROFESSIONAL', 'ACADEMIC', 'STOIC', 'WARM', 'HIGH-ENERGY'].map(arch => (
                                        <button
                                            key={arch}
                                            onClick={() => setActiveArchetype(arch)}
                                            className={`
                                                text-[10px] font-bold px-4 py-2 rounded-full border transition-all
                                                ${activeArchetype === arch
                                                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-md'
                                                    : 'bg-white text-neutral-500 border-neutral-100 hover:border-neutral-300'}
                                            `}
                                        >
                                            {arch}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs font-bold text-neutral-400 mb-2">
                                    <span>COMPLEXITY BIAS</span>
                                    <span className="text-indigo-500">{complexity}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0" max="100"
                                    value={complexity}
                                    onChange={(e) => setComplexity(parseInt(e.target.value))}
                                    className="w-full h-1 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                            </div>

                            <div>
                                <div className="text-xs font-bold text-neutral-400 mb-3">NEURAL VOCAL SIGNATURE</div>
                                <div className="flex bg-neutral-50 dark:bg-neutral-800 p-1 rounded-full">
                                    {['LOW', 'MEDIUM', 'HIGH'].map(sig => (
                                        <button
                                            key={sig}
                                            onClick={() => setVocalSig(sig)}
                                            className={`
                                                flex-1 text-[10px] font-bold py-2 rounded-full transition-all
                                                ${vocalSig === sig ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-400'}
                                            `}
                                        >
                                            {sig}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 mt-4 transition-all">
                                <Zap className="w-4 h-4" /> SYNC AVATAR DNA
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* 4. Bottom Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Equilibrium Map */}
                <div className="bg-[#0f172a] text-white rounded-3xl p-8 relative overflow-hidden aspect-square md:aspect-auto">
                    <div className="absolute top-0 right-0 p-6 text-[10px] font-mono opacity-50">SCIENTIFIC ANALYSIS</div>
                    <div className="flex items-center gap-2 mb-6">
                        <Activity className="w-5 h-5 text-green-400" />
                        <h3 className="font-bold italic">Equilibrium Map.</h3>
                    </div>

                    <div className="w-full aspect-square max-w-[250px] mx-auto relative">
                        <RadarChart traits={radarData} />
                    </div>

                    <div className="flex gap-4 mt-8">
                        <div className="flex-1 bg-white/5 rounded-xl p-3 text-center border border-white/10">
                            <div className="text-[10px] opacity-50 mb-1">PERSONA TONE</div>
                            <div className="text-xs font-bold text-indigo-400">{activeArchetype}</div>
                        </div>
                        <div className="flex-1 bg-white/5 rounded-xl p-3 text-center border border-white/10">
                            <div className="text-[10px] opacity-50 mb-1">NEURAL SYNC</div>
                            <div className="text-xs font-bold">96.8%</div>
                        </div>
                    </div>
                </div>

                {/* Rhetoric Master */}
                <div className="bg-indigo-600 rounded-3xl p-8 text-white flex flex-col items-center justify-center text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm group-hover:scale-110 transition-transform">
                        <MessageSquare className="w-8 h-8" />
                    </div>
                    <div className="text-sm font-bold tracking-widest uppercase mb-2">Rhetoric Master</div>
                    <div className="text-[10px] opacity-70">5/5 Sessions Comp.</div>
                    <div className="w-16 h-1 bg-white/30 rounded-full mt-6 overflow-hidden">
                        <div className="h-full bg-white w-full" />
                    </div>
                </div>

                {/* Neuro-Velocity & Impact */}
                <div className="grid grid-rows-2 gap-6">
                    <div className="bg-neutral-900 text-white rounded-3xl p-6 flex flex-col items-center justify-center text-center border border-neutral-800">
                        <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-3">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div className="text-xs font-bold tracking-widest uppercase mb-1">Neuro-Velocity</div>
                        <div className="text-[10px] opacity-50">Elite 0.4s Lag Time</div>
                        <div className="w-24 h-1 bg-neutral-800 rounded-full mt-3 overflow-hidden">
                            <div className="h-full bg-green-500 w-3/4" />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 flex flex-col items-center justify-center text-center border border-neutral-100 dark:border-neutral-800">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-500 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-3">
                            <Target className="w-6 h-6" />
                        </div>
                        <div className="text-xs font-bold tracking-widest uppercase mb-1">Impact Accuracy</div>
                        <div className="text-[10px] opacity-50">88% Sentiment Sync</div>
                        <div className="w-24 h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full mt-3 overflow-hidden">
                            <div className="h-full bg-indigo-500 w-[88%]" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CommDNAProfile;
