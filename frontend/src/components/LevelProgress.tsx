import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, ChevronUp, Zap } from 'lucide-react';

interface LevelProgressProps {
    currentLevel: number;
    currentXP: number;
    nextLevelXP: number;
    recentXP?: number; // For animating XP gains
}

const LevelProgress: React.FC<LevelProgressProps> = ({
    currentLevel,
    currentXP,
    nextLevelXP,
    recentXP = 0
}) => {
    const [showGain, setShowGain] = useState(false);

    // Calculate percentage
    const progress = Math.min(100, Math.max(0, (currentXP / nextLevelXP) * 100));

    useEffect(() => {
        if (recentXP > 0) {
            setShowGain(true);
            const timer = setTimeout(() => setShowGain(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [recentXP]);

    return (
        <div className="w-full bg-white dark:bg-neutral-900 rounded-xl p-4 shadow-sm border border-neutral-200 dark:border-neutral-800 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="absolute -right-4 -top-10 w-32 h-32 bg-indigo-500 rounded-full blur-3xl" />
                <div className="absolute -left-4 -bottom-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
                {/* Header Stats */}
                <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
                                {currentLevel}
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-neutral-900 rounded-full p-0.5">
                                <Trophy className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            </div>
                        </div>
                        <div>
                            <div className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 tracking-wider uppercase mb-0.5">
                                Current Level
                            </div>
                            <div className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                                Communicator
                                <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-medium border border-indigo-100 dark:border-indigo-800">
                                    Tier {Math.ceil(currentLevel / 5)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">
                            <span className="font-medium text-neutral-900 dark:text-white">{currentXP}</span>
                            <span className="mx-1">/</span>
                            {nextLevelXP} XP
                        </div>
                        <div className="text-xs font-medium text-green-500 flex items-center justifying-end gap-1">
                            {nextLevelXP - currentXP} XP to Level {currentLevel + 1}
                        </div>
                    </div>
                </div>

                {/* Progress Bar Container */}
                <div className="relative h-4 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden mb-2 ring-1 ring-inset ring-black/5 dark:ring-white/5">
                    {/* Background Striping Effect */}
                    <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBMODAgMEg0MEwwIDQweiIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] animate-[slide_1s_linear_infinite]" />

                    {/* Main Progress Bar */}
                    <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 relative"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]" />

                        {/* Glow at tip */}
                        <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px]" />
                    </motion.div>
                </div>

                {/* XP Gain Animation */}
                <AnimatePresence>
                    {showGain && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.8 }}
                            className="flex items-center justify-center gap-1.5 text-sm font-bold text-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-neutral-800 px-3 py-1.5 rounded-full shadow-lg border border-amber-100 dark:border-amber-900/30 z-20"
                        >
                            <Zap className="w-4 h-4 fill-amber-500" />
                            +{recentXP} XP
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Quick Stats/Milestones */}
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800/50">
                    <div className="flex -space-x-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 border-2 border-white dark:border-neutral-900 flex items-center justify-center text-[10px] text-neutral-400">
                                <Star className="w-3 h-3" />
                            </div>
                        ))}
                    </div>
                    <div className="text-xs text-neutral-500 flex items-center gap-1 cursor-pointer hover:text-indigo-500 transition-colors">
                        View Achievements <ChevronUp className="w-3 h-3 rotate-90" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LevelProgress;
