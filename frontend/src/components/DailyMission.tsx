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
            const token = localStorage.getItem('token');
            const response = await fetch('/api/missions/today', {
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
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/missions/${mission.id}/complete`, {
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
            className="bg-gray-800 rounded-xl overflow-hidden shadow-xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
        >
            {/* Header */}
            <div className={`bg-gradient-to-r ${getDifficultyColor(mission.drill.difficulty)} p-4`}>
                <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{getCategoryIcon(mission.drill.category)}</span>
                        <div>
                            <h3 className="font-bold text-lg">{mission.drill.title}</h3>
                            <p className="text-sm opacity-90 capitalize">{mission.drill.category}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs opacity-90">Difficulty</div>
                        <div className="font-bold">{getDifficultyLabel(mission.drill.difficulty)}</div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {!practicing ? (
                    <>
                        <p className="text-gray-300 mb-4">{mission.drill.description}</p>

                        <div className="bg-gray-900 rounded-lg p-4 mb-6">
                            <div className="text-sm text-gray-400 mb-2">Scenario:</div>
                            <p className="text-white">{mission.drill.scenario}</p>
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            <div className="flex gap-4">
                                <div>
                                    <div className="text-xs text-gray-400">Duration</div>
                                    <div className="text-white font-semibold">
                                        {Math.floor(mission.drill.duration_seconds / 60)} min
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Reward</div>
                                    <div className="text-yellow-400 font-semibold">
                                        +{mission.drill.xp_reward} XP
                                    </div>
                                </div>
                            </div>
                        </div>

                        <motion.button
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-4 rounded-lg"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={startPractice}
                        >
                            Start Practice →
                        </motion.button>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <motion.div
                            className="text-6xl font-bold text-white mb-4"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            {formatTime(timeLeft)}
                        </motion.div>

                        <p className="text-gray-400 mb-6">Practice the scenario above</p>

                        <div className="mb-6">
                            <label className="text-sm text-gray-400 block mb-2">
                                How did you do? (Score: {score}%)
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={score}
                                onChange={(e) => setScore(parseInt(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        <motion.button
                            className="bg-green-500 text-white font-bold py-3 px-8 rounded-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleComplete}
                        >
                            Complete Mission
                        </motion.button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default DailyMission;
