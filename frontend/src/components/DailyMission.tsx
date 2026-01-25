/**
 * Daily Mission Component
 * Displays today's mission and handles completion
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MicroDrill {
    id: string;
    title: string;
    description: string;
    scenario: string;
    category: string;
    difficulty: number;
    duration_seconds: number;
    xp_reward: number;
}

interface Mission {
    id: string;
    date: string;
    completed: boolean;
    xp_earned: number;
    drill: MicroDrill;
}

// Update interface to match usage in Dashboard.tsx
export interface DailyMissionProps {
    id?: string;
    title?: string;
    description?: string;
    xpReward?: number;
    category?: string;
    difficulty?: string;
    status?: string;
}

export const DailyMission: React.FC<DailyMissionProps> = (props) => {
    const [mission, setMission] = useState<Mission | null>(null);
    const [loading, setLoading] = useState(!props.title);
    const [practicing, setPracticing] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [score, setScore] = useState(75);

    useEffect(() => {
        if (props.title) {
            // Construct mission object from props
            setMission({
                id: props.id || 'mock',
                date: new Date().toISOString(),
                completed: props.status === 'completed',
                xp_earned: 0,
                drill: {
                    id: props.id || 'mock',
                    title: props.title,
                    description: props.description || '',
                    scenario: 'Practice Scenario',
                    category: props.category || 'general',
                    difficulty: props.difficulty === 'hard' ? 7 : props.difficulty === 'medium' ? 5 : 3,
                    duration_seconds: 60,
                    xp_reward: props.xpReward || 100
                }
            });
            setLoading(false);
        } else {
            fetchTodaysMission();
        }
    }, [props.title]);

    useEffect(() => {
        if (practicing && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (practicing && timeLeft === 0) {
            handleComplete();
        }
    }, [practicing, timeLeft]);

    const fetchTodaysMission = async () => {
        try {
            const tokenObj = localStorage.getItem('supabase.auth.token');
            const token = tokenObj ? JSON.parse(tokenObj).access_token : '';

            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/missions/today`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setMission(data.mission);
            }
        } catch (error) {
            console.error('Error fetching mission:', error);
        } finally {
            setLoading(false);
        }
    };

    const startPractice = () => {
        if (mission) {
            setPracticing(true);
            setTimeLeft(mission.drill.duration_seconds);
        }
    };

    const handleComplete = async () => {
        if (!mission) return;

        try {
            const tokenObj = localStorage.getItem('supabase.auth.token');
            const token = tokenObj ? JSON.parse(tokenObj).access_token : '';

            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/missions/${mission.id}/complete`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    score,
                    durationSeconds: mission.drill.duration_seconds,
                    feedback: { completed: true }
                })
            });

            if (response.ok) {
                const data = await response.json();
                setMission({ ...mission, completed: true, xp_earned: data.xpEarned });
                setPracticing(false);
            }
        } catch (error) {
            console.error('Error completing mission:', error);
        }
    };

    const getCategoryIcon = (category: string) => {
        const icons: Record<string, string> = {
            negotiation: '🤝',
            empathy: '💝',
            assertiveness: '💪',
            conflict: '⚡',
            presentation: '🎤',
            feedback: '💬'
        };
        return icons[category] || '✨';
    };

    const getDifficultyColor = (difficulty: number) => {
        if (difficulty <= 3) return 'from-green-500 to-emerald-500';
        if (difficulty <= 6) return 'from-yellow-500 to-orange-500';
        return 'from-red-500 to-pink-500';
    };

    const getDifficultyLabel = (difficulty: number) => {
        if (difficulty <= 3) return 'Easy';
        if (difficulty <= 6) return 'Medium';
        return 'Hard';
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="bg-gray-800 rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
        );
    }

    if (!mission) {
        return (
            <div className="bg-gray-800 rounded-xl p-6 text-center">
                <p className="text-gray-400">No mission available today</p>
            </div>
        );
    }

    if (mission.completed) {
        return (
            <motion.div
                className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">✅</span>
                        <div>
                            <h3 className="font-bold text-xl">Mission Complete!</h3>
                            <p className="text-sm opacity-90">Great work today</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold">+{mission.xp_earned}</div>
                        <div className="text-sm opacity-90">XP Earned</div>
                    </div>
                </div>
                <p className="text-sm opacity-80">Come back tomorrow for a new challenge!</p>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-xl border border-neutral-100 dark:border-neutral-800 transition-all hover:shadow-2xl hover:shadow-indigo-500/10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
        >
            {/* Header */}
            <div className={`bg-gradient-to-r ${getDifficultyColor(mission.drill.difficulty)} p-5`}>
                <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl">
                            {getCategoryIcon(mission.drill.category)}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg tracking-tight">{mission.drill.title}</h3>
                            <p className="text-xs opacity-80 font-medium uppercase tracking-wider">{mission.drill.category} Mission</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] opacity-70 font-black uppercase tracking-widest">Difficulty</div>
                        <div className="font-black text-sm uppercase">{getDifficultyLabel(mission.drill.difficulty)}</div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {!practicing ? (
                    <>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-6 font-medium leading-relaxed">{mission.drill.description}</p>

                        <div className="bg-neutral-50 dark:bg-black p-5 rounded-2xl mb-6 border border-neutral-100 dark:border-neutral-800">
                            <div className="text-xs text-neutral-400 font-bold uppercase tracking-widest mb-2">Scenario</div>
                            <p className="text-neutral-900 dark:text-neutral-200 font-medium italic">"{mission.drill.scenario}"</p>
                        </div>

                        <div className="flex items-center justify-between mb-8 px-2">
                            <div className="flex gap-8">
                                <div>
                                    <div className="text-xs text-neutral-400 font-bold uppercase tracking-widest mb-1">Duration</div>
                                    <div className="text-neutral-900 dark:text-white font-black text-lg">
                                        {Math.floor(mission.drill.duration_seconds / 60)}:00
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-neutral-400 font-bold uppercase tracking-widest mb-1">Reward</div>
                                    <div className="text-indigo-600 dark:text-indigo-400 font-black text-lg">
                                        +{mission.drill.xp_reward} XP
                                    </div>
                                </div>
                            </div>
                        </div>

                        <motion.button
                            className="w-full bg-slate-900 dark:bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest text-xs"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={startPractice}
                        >
                            Start Mission →
                        </motion.button>
                    </>
                ) : (
                    <div className="text-center py-10">
                        <div className="relative inline-block mb-10">
                            <div className="absolute inset-0 bg-indigo-500 rounded-full blur-[40px] opacity-20 animate-pulse" />
                            <motion.div
                                className="relative text-7xl font-black text-neutral-900 dark:text-white"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                {formatTime(timeLeft)}
                            </motion.div>
                        </div>

                        <p className="text-neutral-500 font-medium mb-10">Capturing communication markers...</p>

                        <div className="max-w-xs mx-auto mb-10">
                            <div className="flex justify-between text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">
                                <span>Subjective Performance</span>
                                <span className="text-indigo-600">{score}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={score}
                                onChange={(e) => setScore(parseInt(e.target.value))}
                                className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full appearance-none cursor-pointer accent-indigo-600"
                            />
                        </div>

                        <motion.button
                            className="bg-emerald-600 text-white font-black py-4 px-12 rounded-2xl shadow-lg shadow-emerald-600/20 uppercase tracking-widest text-xs"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleComplete}
                        >
                            Finalize Mission
                        </motion.button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default DailyMission;
