"use client";

import { AlertTriangle, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Alert {
    id: string | number;
    message: string;
    type: "critical" | "warning" | "success";
    timestamp: string;
}

interface AlertsTickerProps {
    alerts: Alert[];
}

export function AlertsTicker({ alerts }: AlertsTickerProps) {
    const [dismissedIds, setDismissedIds] = useState<Set<string | number>>(new Set());

    const dismissAlert = (id: string | number) => {
        setDismissedIds(prev => new Set([...prev, id]));
    };

    const visibleAlerts = alerts.filter(a => !dismissedIds.has(a.id));

    if (visibleAlerts.length === 0) {
        return (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-6 py-3 mb-6">
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <p className="text-sm font-medium text-emerald-800">
                        ✓ All systems operational - No active alerts
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-6 overflow-hidden">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
                <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Live Alerts
                        </h3>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                        {visibleAlerts.length} active
                    </span>
                </div>

                <div className="relative overflow-hidden">
                    {/* Scrolling container */}
                    <div className="flex gap-3 py-3 px-4 animate-scroll-left hover:pause-animation">
                        {/* Duplicate alerts for seamless loop */}
                        {[...visibleAlerts, ...visibleAlerts].map((alert, index) => (
                            <div
                                key={`${alert.id}-${index}`}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-2 rounded-lg border shrink-0 min-w-[300px] max-w-[400px] group relative",
                                    alert.type === "critical"
                                        ? "bg-rose-50 border-rose-200"
                                        : alert.type === "warning"
                                            ? "bg-amber-50 border-amber-200"
                                            : "bg-emerald-50 border-emerald-200"
                                )}
                            >
                                <AlertTriangle
                                    className={cn(
                                        "w-4 h-4 shrink-0",
                                        alert.type === "critical" ? "text-rose-600" :
                                            alert.type === "warning" ? "text-amber-600" :
                                                "text-emerald-600"
                                    )}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className={cn(
                                        "text-xs font-medium truncate",
                                        alert.type === "critical" ? "text-rose-900" :
                                            alert.type === "warning" ? "text-amber-900" :
                                                "text-emerald-900"
                                    )}>
                                        {alert.message}
                                    </p>
                                    <p className="text-[10px] text-slate-500 font-mono">
                                        {new Date(alert.timestamp).toLocaleTimeString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => dismissAlert(alert.id)}
                                    className={cn(
                                        "opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white",
                                        alert.type === "critical" ? "text-rose-600" :
                                            alert.type === "warning" ? "text-amber-600" :
                                                "text-emerald-600"
                                    )}
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }

        .pause-animation:hover {
          animation-play-state: paused;
        }
      `}</style>
        </div>
    );
}
