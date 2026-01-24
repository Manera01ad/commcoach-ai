import React from 'react';

interface ConfidenceMeterProps {
    score: number;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ score }) => {
    const getColor = (s: number) => {
        if (s >= 80) return 'from-green-500 to-emerald-500';
        if (s >= 60) return 'from-blue-500 to-indigo-500';
        if (s >= 40) return 'from-amber-500 to-orange-500';
        return 'from-red-500 to-pink-500';
    };

    return (
        <div className="w-full max-w-xs my-4 p-4 bg-black/20 rounded-xl border border-white/5">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-neutral-400 font-medium">Analysis Confidence</span>
                <span className="text-sm font-bold text-purple-400">{score}%</span>
            </div>

            <div className="relative h-2 bg-neutral-800/50 rounded-full overflow-hidden border border-neutral-700/30">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10" />

                <div
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getColor(score)} shadow-lg transition-all duration-1000 ease-out`}
                    style={{ width: `${score}%` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_3s_infinite]" />
                </div>
            </div>

            <div className="flex justify-between mt-1 px-1">
                <span className="text-[10px] text-neutral-600">Low</span>
                <span className="text-[10px] text-neutral-600">High</span>
            </div>
        </div>
    );
};
