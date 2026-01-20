/**
 * Streak Counter Component
 * Displays user's current streak with animations
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StreakStats {
    currentStreak: number;
    longestStreak: number;
    totalPoints: number;
    nextMilestone: number;
}

export const StreakCounter: React.FC = () => {
    const [stats, setStats] = useState<StreakStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [celebrating, setCelebrating] = useState(false);

    useEffect(() => {
        fetchStreakStats();
    }, []);

    const fetchStreakStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/streak/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Error fetching streak stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStreakEmoji = (streak: number) => {
        if (streak >= 365) return '🏆';
        if (streak >= 100) return '💎';
        if (streak >= 30) return '⭐';
        if (streak >= 7) return '🔥';
        return '✨';
    };

    const getProgressToNextMilestone = () => {
        if (!stats) return 0;
        const milestones = [7, 30, 100, 365];
        const nextMilestone = milestones.find(m => m > stats.currentStreak) || 365;
        const prevMilestone = milestones.filter(m => m < stats.currentStreak).pop() || 0;
        const progress = ((stats.currentStreak - prevMilestone) / (nextMilestone - prevMilestone)) * 100;
        return Math.min(progress, 100);
    };

    if (loading) {
        return (
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full animate-pulse">
                <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
                <div className="w-8 h-4 bg-gray-700 rounded"></div>
            </div>
        );
    }

    if (!stats || stats.currentStreak === 0) {
        return (
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full opacity-50">
                <span className="text-xl">✨</span>
                <span className="text-white text-sm">Start your streak!</span>
            </div>
        );
    }

    return (
        <div className="relative">
            <motion.div
                className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCelebrating(!celebrating)}
            >
                {/* Streak Emoji */}
                <motion.span
                    className="text-2xl"
                    animate={{
                        rotate: celebrating ? [0, -10, 10, -10, 10, 0] : 0,
                        scale: celebrating ? [1, 1.2, 1] : 1
                    }}
                    transition={{ duration: 0.5 }}
                >
                    {getStreakEmoji(stats.currentStreak)}
                </motion.span>

                {/* Streak Count */}
                <div className="flex flex-col">
                    <motion.span
                        className="text-white font-bold text-lg leading-none"
                        key={stats.currentStreak}
                        initial={{ scale: 1.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        {stats.currentStreak}
                    </motion.span>
                    <span className="text-white text-xs opacity-80">day streak</span>
                </div>

                {/* Progress Ring */}
                <svg className="w-8 h-8 -rotate-90">
                    <circle
                        cx="16"
                        cy="16"
                        r="14"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="2"
                        fill="none"
                    />
                    <motion.circle
                        cx="16"
                        cy="16"
                        r="14"
                        stroke="white"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 14}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 14 }}
                        animate={{
                            strokeDashoffset: 2 * Math.PI * 14 * (1 - getProgressToNextMilestone() / 100)
                        }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    />
                </svg>
            </motion.div>

            {/* Celebration Particles */}
            <AnimatePresence>
                {celebrating && (
                    <>
                        {[...Array(12)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute top-1/2 left-1/2 text-2xl pointer-events-none"
                                initial={{ scale: 0, x: 0, y: 0 }}
                                animate={{
                                    scale: [0, 1, 0],
                                    x: Math.cos((i / 12) * Math.PI * 2) * 60,
                                    y: Math.sin((i / 12) * Math.PI * 2) * 60,
                                    opacity: [0, 1, 0]
                                }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.8, delay: i * 0.05 }}
                            >
                                {['🎉', '✨', '⭐', '🔥'][i % 4]}
                            </motion.div>
                        ))}
                    </>
                )}
            </AnimatePresence>

            {/* Tooltip */}
            <AnimatePresence>
                {celebrating && (
                    <motion.div
                        className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl whitespace-nowrap z-50"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <div className="text-sm font-semibold mb-1">🔥 You're on fire!</div>
                        <div className="text-xs opacity-80">
                            Longest: {stats.longestStreak} days | Points: {stats.totalPoints}
                        </div>
                        <div className="text-xs opacity-60 mt-1">
                            Next milestone: {stats.nextMilestone} days
                        </div>
                        {/* Arrow */}
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StreakCounter;
