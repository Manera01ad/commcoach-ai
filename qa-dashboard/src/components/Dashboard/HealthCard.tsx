"use client";

import { LucideIcon } from "lucide-react";
import { cn, getScoreColor } from "@/lib/utils";

interface HealthCardProps {
    title: string;
    icon: LucideIcon;
    score: number | null;
    status: string;
    metric: string;
    isLoading?: boolean;
}

export function HealthCard({ title, icon: Icon, score, status, metric, isLoading }: HealthCardProps) {
    if (isLoading) {
        return (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm animate-pulse">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <div className="w-16 h-8 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 w-20 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 w-32 bg-gray-200 rounded"></div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                </div>
                <div className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase border", getScoreColor(score))}>
                    {status}
                </div>
            </div>

            <div className="space-y-1">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-gray-900">
                        {score !== null ? score.toFixed(0) : "N/A"}
                    </span>
                    <span className="text-xs text-gray-400 font-bold">%</span>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="text-sm text-gray-600 font-medium truncate">{metric}</span>
            </div>

            {/* Decorative background score indicator */}
            <div
                className={cn(
                    "absolute -bottom-6 -right-6 text-9xl font-black opacity-[0.03] select-none",
                    score !== null && score < 80 ? "text-rose-600" : "text-gray-900"
                )}
            >
                {score !== null ? Math.round(score) : ""}
            </div>
        </div>
    );
}
