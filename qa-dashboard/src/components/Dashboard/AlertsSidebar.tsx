"use client";

import { AlertTriangle, CheckCircle2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface Alert {
    id: string | number;
    message: string;
    type: "critical" | "warning" | "success";
    timestamp: string;
}

interface AlertsSidebarProps {
    alerts: Alert[];
}

export function AlertsSidebar({ alerts }: AlertsSidebarProps) {
    const [clearedIds, setClearedIds] = useState<Set<string | number>>(new Set());
    const [readIds, setReadIds] = useState<Set<string | number>>(new Set());

    // Load cleared/read states from localStorage
    useEffect(() => {
        const savedCleared = localStorage.getItem("cleared_alerts");
        const savedRead = localStorage.getItem("read_alerts");
        if (savedCleared) setClearedIds(new Set(JSON.parse(savedCleared)));
        if (savedRead) setReadIds(new Set(JSON.parse(savedRead)));
    }, []);

    const markAsRead = (id: string | number) => {
        const newRead = new Set(readIds);
        newRead.add(id);
        setReadIds(newRead);
        localStorage.setItem("read_alerts", JSON.stringify(Array.from(newRead)));
    };

    const clearAlert = (id: string | number) => {
        const newCleared = new Set(clearedIds);
        newCleared.add(id);
        setClearedIds(newCleared);
        localStorage.setItem("cleared_alerts", JSON.stringify(Array.from(newCleared)));
    };

    const clearAllRead = () => {
        const newCleared = new Set(clearedIds);
        readIds.forEach(id => newCleared.add(id));
        setClearedIds(newCleared);
        localStorage.setItem("cleared_alerts", JSON.stringify(Array.from(newCleared)));
    };

    const visibleAlerts = alerts.filter(a => !clearedIds.has(a.id));

    return (
        <div className="flex flex-col h-full bg-white border-l border-slate-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Log Alerts</h2>
                    <p className="text-[10px] text-slate-500 font-medium">REAL-TIME MONITORING</p>
                </div>
                {readIds.size > 0 && visibleAlerts.some(a => readIds.has(a.id)) && (
                    <button 
                        onClick={clearAllRead}
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-2 py-1 rounded transition-colors flex items-center gap-1"
                    >
                        <Trash2 className="w-3 h-3" />
                        CLEAR READ
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {visibleAlerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-3">
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        </div>
                        <p className="text-slate-500 text-sm">No active alerts</p>
                    </div>
                ) : (
                    visibleAlerts.map((alert) => {
                        const isRead = readIds.has(alert.id);
                        return (
                            <div
                                key={alert.id}
                                onClick={() => markAsRead(alert.id)}
                                className={cn(
                                    "p-4 rounded-xl border flex flex-col gap-2 shadow-sm transition-all cursor-pointer group relative overflow-hidden",
                                    alert.type === "critical" 
                                        ? "bg-rose-50 border-rose-100 hover:bg-rose-100/50" 
                                        : "bg-amber-50 border-amber-100 hover:bg-amber-100/50",
                                    isRead && "opacity-75 grayscale-[0.5]"
                                )}
                            >
                                {/* Alert Status Indicator */}
                                {!isRead && (
                                    <div className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-bl-lg animate-pulse" />
                                )}

                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className={cn("w-4 h-4", alert.type === "critical" ? "text-rose-500" : "text-amber-500")} />
                                        <h3 className={cn("text-xs font-black uppercase tracking-tight", alert.type === "critical" ? "text-rose-900" : "text-amber-900")}>
                                            {alert.type === "critical" ? "Critical Alert" : "Warning"}
                                        </h3>
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-400">
                                        {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </span>
                                </div>

                                <p className={cn("text-xs font-medium leading-relaxed", alert.type === "critical" ? "text-rose-800" : "text-amber-800")}>
                                    {alert.message}
                                </p>

                                {isRead && (
                                    <div className="mt-1 pt-2 border-t border-rose-200/50 flex justify-end">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                clearAlert(alert.id);
                                            }}
                                            className="text-[10px] font-bold text-rose-600 hover:bg-white px-2 py-0.5 rounded transition-all flex items-center gap-1"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                            CLEAR
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
