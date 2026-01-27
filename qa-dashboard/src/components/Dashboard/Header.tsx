"use client";

import { Activity, RefreshCcw } from "lucide-react";
import { cn, formatDateTime } from "@/lib/utils";

interface HeaderProps {
    overallScore: number;
    lastUpdated: Date;
    isRefreshing: boolean;
}

export function Header({ overallScore, lastUpdated, isRefreshing }: HeaderProps) {
    const getStatus = (score: number) => {
        if (score >= 90) return { label: "Excellent", color: "text-emerald-500" };
        if (score >= 80) return { label: "Good", color: "text-amber-500" };
        return { label: "Critical", color: "text-rose-500" };
    };

    const status = getStatus(overallScore);

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-6 sticky top-0 z-30 shadow-sm">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        CommCoach AI Dashboard
                    </h1>
                    <p className="text-gray-500 flex items-center gap-2">
                        Real-time System Monitoring <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <div className="text-sm font-medium text-gray-400 uppercase tracking-wider">Overall Health</div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-gray-900">{overallScore.toFixed(1)}</span>
                            <span className={cn("text-lg font-bold", status.color)}>{status.label}</span>
                        </div>
                    </div>

                    <div className="h-12 w-[1px] bg-gray-200 hidden md:block" />

                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <RefreshCcw className={cn("w-3.5 h-3.5", isRefreshing && "animate-spin text-blue-500")} />
                            Last updated: {formatDateTime(lastUpdated)}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono mt-1">
                            AUTO-REFRESH: 30S
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
