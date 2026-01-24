import React from 'react';
import { Brain, Sparkles } from 'lucide-react';

interface ArchetypeBadgeProps {
    archetype: string;
    confidence: number;
}

export const ArchetypeBadge: React.FC<ArchetypeBadgeProps> = ({ archetype, confidence }) => (
    <div className="relative group inline-block">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full blur-xl opacity-0 group-hover:opacity-75 transition-opacity duration-500" />

        <div className="relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600/90 to-indigo-600/90 backdrop-blur-xl rounded-full border border-purple-400/30 shadow-lg shadow-purple-500/25">
            <div className="relative">
                <Brain className="w-5 h-5 text-white" />
                <div className="absolute inset-0 bg-white rounded-full blur-md opacity-50 animate-ping" />
            </div>

            <span className="text-white font-semibold tracking-wide">
                {archetype}
            </span>

            <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-300" />
                <span className="text-xs text-purple-200">{confidence}%</span>
            </div>
        </div>
    </div>
);
