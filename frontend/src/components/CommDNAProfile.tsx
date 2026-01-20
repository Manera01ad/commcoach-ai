import React from 'react';
import { motion } from 'framer-motion';
import { Share2, Settings, RefreshCw, Zap, Award, Target } from 'lucide-react';

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

const CommDNAProfile: React.FC<DNAProfileProps> = ({ data, onRetake }) => {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Hero Section */}
            <div className={`
                relative overflow-hidden rounded-3xl p-8 text-center text-white shadow-2xl
                ${data.archetype.includes('Diplomat') ? 'bg-gradient-to-br from-blue-500 to-cyan-600' : ''}
                ${data.archetype.includes('Commander') ? 'bg-gradient-to-br from-red-500 to-orange-600' : ''}
                ${data.archetype.includes('Analyst') ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : ''}
                ${data.archetype.includes('Storyteller') ? 'bg-gradient-to-br from-amber-400 to-pink-500' : ''}
                ${!['Diplomat', 'Commander', 'Analyst', 'Storyteller'].some(t => data.archetype.includes(t))
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : ''}
            `}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

                <h3 className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2">Your Communication Archetype</h3>
                <h1 className="text-5xl font-extrabold mb-4 drop-shadow-md">{data.archetype}</h1>
                <p className="text-lg opacity-90 max-w-xl mx-auto">
                    Based on your assessment, your communication style is primarily driven by {data.archetype.split(' ')[1] || data.archetype}.
                    We recommend a <strong>{data.recommendedTone}</strong> coaching tone to maximize your growth.
                </p>

                <div className="flex justify-center gap-4 mt-8">
                    <button className="flex items-center gap-2 px-6 py-2 bg-white/20 backdrop-blur-md rounded-full font-medium hover:bg-white/30 transition-colors">
                        <Share2 className="w-4 h-4" /> Share Profile
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 bg-white text-black rounded-full font-bold hover:bg-neutral-100 transition-colors shadow-lg">
                        <Settings className="w-4 h-4" /> Apply Tone Settings
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Trait Graph (Simple Bars for now) */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500" /> Trait Analysis
                    </h3>
                    <div className="space-y-6">
                        {Object.entries(data.traits).map(([trait, score]) => (
                            <div key={trait}>
                                <div className="flex justify-between mb-1">
                                    <span className="capitalize font-medium text-neutral-700 dark:text-neutral-300">{trait}</span>
                                    <span className="font-bold text-neutral-900 dark:text-white">{score}/100</span>
                                </div>
                                <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${score}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                        className={`h-full rounded-full ${score > 80 ? 'bg-green-500' : score > 60 ? 'bg-blue-500' : 'bg-amber-500'
                                            }`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SWOT */}
                <div className="space-y-4">
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-green-600">
                            <Award className="w-5 h-5" /> Key Strengths
                        </h3>
                        <ul className="space-y-2">
                            {data.strengths.map((s, i) => (
                                <li key={i} className="flex items-start gap-2 text-neutral-600 dark:text-neutral-300">
                                    <span className="mt-1.5 w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-red-500">
                            <Target className="w-5 h-5" /> Focus Areas
                        </h3>
                        <ul className="space-y-2">
                            {data.weaknesses.map((w, i) => (
                                <li key={i} className="flex items-start gap-2 text-neutral-600 dark:text-neutral-300">
                                    <span className="mt-1.5 w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
                                    {w}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="text-center pt-8">
                <button
                    onClick={onRetake}
                    className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white text-sm flex items-center gap-2 mx-auto transition-colors"
                >
                    <RefreshCw className="w-4 h-4" /> Retake Assessment
                </button>
            </div>
        </div>
    );
};

export default CommDNAProfile;
