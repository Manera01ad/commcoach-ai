"use client";

import { Bot, Lightbulb, Zap, AlertCircle } from "lucide-react";

interface Recommendation {
    priority: 'High' | 'Medium' | 'Low';
    action: string;
    rationale: string;
}

interface AIRecommendationsProps {
    recommendations: Recommendation[];
    isLoading?: boolean;
}

export function AIRecommendations({ recommendations, isLoading }: AIRecommendationsProps) {
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High': return 'text-rose-600 bg-rose-50 border-rose-100';
            case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-100';
            case 'Low': return 'text-blue-600 bg-blue-50 border-blue-100';
            default: return 'text-gray-600 bg-gray-50 border-gray-100';
        }
    };

    return (
        <div className="bg-gradient-to-br from-blue-900 to-indigo-950 border border-blue-800 rounded-2xl p-6 shadow-xl flex-1 text-white overflow-hidden relative">
            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Bot className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold">🤖 AI Recommendations</h2>
            </div>

            <div className="space-y-4 relative z-10">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="animate-pulse flex gap-3">
                            <div className="w-1 h-12 bg-blue-500/20 rounded-full shrink-0"></div>
                            <div className="space-y-2 flex-1">
                                <div className="h-4 w-3/4 bg-blue-500/10 rounded"></div>
                                <div className="h-3 w-full bg-blue-500/5 rounded"></div>
                            </div>
                        </div>
                    ))
                ) : (
                    recommendations.map((rec, i) => (
                        <div key={i} className="group flex gap-4 transition-all hover:translate-x-1">
                            <div className="flex flex-col items-center">
                                <div className="w-2 h-2 rounded-full bg-blue-400 group-hover:scale-150 transition-transform"></div>
                                <div className="w-[1px] h-full bg-blue-800 my-1"></div>
                            </div>
                            <div className="flex-1 pb-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase border ${getPriorityColor(rec.priority)}`}>
                                        {rec.priority}
                                    </span>
                                    <p className="font-bold text-sm text-blue-100">{rec.action}</p>
                                </div>
                                <p className="text-xs text-blue-300 italic pl-1 leading-relaxed">
                                    Rationale: {rec.rationale}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Futuristic decorative elements */}
            <div className="absolute -bottom-10 -right-10 opacity-10">
                <Zap className="w-40 h-40 text-blue-400" strokeWidth={1} />
            </div>
        </div>
    );
}
