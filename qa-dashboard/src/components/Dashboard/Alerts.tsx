"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
    id: string | number;
    message: string;
    type: "critical" | "warning" | "success";
    timestamp: string;
}

interface AlertsSectionProps {
    alerts: Alert[];
}

export function AlertsSection({ alerts }: AlertsSectionProps) {
    if (alerts.length === 0) {
        return (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-3 mb-8 shadow-sm">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                <div>
                    <h3 className="text-emerald-900 font-bold">All Systems Normal</h3>
                    <p className="text-emerald-700 text-sm">No critical issues detected in the last 24 hours.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3 mb-8">
            {alerts.map((alert) => (
                <div
                    key={alert.id}
                    className={cn(
                        "p-4 rounded-xl border flex items-start gap-3 shadow-md transition-all animate-in fade-in slide-in-from-top-4",
                        alert.type === "critical" ? "bg-rose-50 border-rose-100" : "bg-amber-50 border-amber-100"
                    )}
                >
                    <AlertTriangle className={cn("w-6 h-6 shrink-0", alert.type === "critical" ? "text-rose-500" : "text-amber-500")} />
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h3 className={cn("font-bold", alert.type === "critical" ? "text-rose-900" : "text-amber-900")}>
                                {alert.type === "critical" ? "CRITICAL ALERT" : "SYSTEM WARNING"}
                            </h3>
                            <span className="text-xs font-mono text-gray-400">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className={cn("text-sm mt-0.5", alert.type === "critical" ? "text-rose-700" : "text-amber-700")}>
                            {alert.message}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
