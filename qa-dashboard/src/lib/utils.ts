import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDateTime(date: string | Date) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    }).format(new Date(date));
}

export function getScoreColor(score: number | null) {
    if (score === null) return "bg-gray-100 text-gray-500";
    if (score >= 90) return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (score >= 80) return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-rose-100 text-rose-700 border-rose-200";
}

export function getStatusText(score: number | null) {
    if (score === null) return "Pending";
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Good";
    return "Attention";
}
