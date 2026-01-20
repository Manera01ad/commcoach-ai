import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, ArrowUp, Minus } from 'lucide-react';

const Leaderboard: React.FC = () => {
    // Mock Data
    const users = [
        { id: 1, name: 'Alex M.', xp: 12500, level: 12, streak: 45, avatar: null },
        { id: 2, name: 'Sarah K.', xp: 11200, level: 11, streak: 32, avatar: null },
        { id: 3, name: 'You', xp: 9800, level: 10, streak: 14, avatar: null, isCurrentUser: true },
        { id: 4, name: 'James R.', xp: 9100, level: 9, streak: 8, avatar: null },
        { id: 5, name: 'Emily W.', xp: 8500, level: 9, streak: 21, avatar: null },
    ];

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Global Leaderboard
                </h3>
                <span className="text-xs font-medium text-neutral-500 px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-md">
                    Weekly Reset in 2d
                </span>
            </div>

            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {users.map((user, index) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 flex items-center gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors ${user.isCurrentUser ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}
                    >
                        {/* Rank */}
                        <div className="w-8 font-bold text-center text-neutral-500">
                            {index === 0 ? (
                                <Medal className="w-6 h-6 text-yellow-500 mx-auto" />
                            ) : index === 1 ? (
                                <Medal className="w-6 h-6 text-neutral-400 mx-auto" />
                            ) : index === 2 ? (
                                <Medal className="w-6 h-6 text-amber-600 mx-auto" />
                            ) : (
                                <span className="text-sm">#{index + 1}</span>
                            )}
                        </div>

                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                {user.name.charAt(0)}
                            </div>
                            {user.isCurrentUser && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-neutral-900 rounded-full" />
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-neutral-900 dark:text-white truncate flex items-center gap-2">
                                {user.name}
                                {user.isCurrentUser && (
                                    <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                                        YOU
                                    </span>
                                )}
                            </div>
                            <div className="text-xs text-neutral-500">
                                Lvl {user.level} • {user.streak} day streak
                            </div>
                        </div>

                        {/* XP */}
                        <div className="text-right">
                            <div className="font-bold text-sm text-indigo-600 dark:text-indigo-400">
                                {user.xp.toLocaleString()} XP
                            </div>
                            <div className="text-xs text-green-500 flex items-center justify-end gap-0.5">
                                <ArrowUp className="w-3 h-3" /> 12
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="p-3 text-center border-t border-neutral-100 dark:border-neutral-800">
                <button className="text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
                    View Complete Rankings
                </button>
            </div>
        </div>
    );
};

export default Leaderboard;
