"use client";

import { formatDateTime } from "@/lib/utils";

interface TestSummary {
    type: string;
    count: number;
    passRate: number;
    lastRun: string;
}

interface SummaryListProps {
    summaries: TestSummary[];
    isLoading?: boolean;
}

export function SummaryList({ summaries, isLoading }: SummaryListProps) {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm overflow-hidden flex-1">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Tests Run (24h)</h2>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-50">
                            <th className="pb-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Test Type</th>
                            <th className="pb-4 font-semibold text-gray-400 text-xs uppercase tracking-wider text-center">Count</th>
                            <th className="pb-4 font-semibold text-gray-400 text-xs uppercase tracking-wider text-center">Pass Rate</th>
                            <th className="pb-4 font-semibold text-gray-400 text-xs uppercase tracking-wider text-right">Last Run</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="py-4"><div className="h-4 w-24 bg-gray-100 rounded"></div></td>
                                    <td className="py-4 text-center"><div className="h-4 w-8 bg-gray-100 rounded mx-auto"></div></td>
                                    <td className="py-4 text-center"><div className="h-4 w-12 bg-gray-100 rounded mx-auto"></div></td>
                                    <td className="py-4 text-right"><div className="h-4 w-32 bg-gray-100 rounded ml-auto"></div></td>
                                </tr>
                            ))
                        ) : (
                            summaries.map((test) => (
                                <tr key={test.type} className="hover:bg-gray-50 transition-colors group">
                                    <td className="py-4 font-bold text-gray-700">{test.type}</td>
                                    <td className="py-4 text-center font-mono text-gray-600">{test.count}</td>
                                    <td className="py-4 text-center">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${test.passRate >= 90 ? "bg-emerald-50 text-emerald-600" :
                                                test.passRate >= 80 ? "bg-amber-50 text-amber-600" :
                                                    "bg-rose-50 text-rose-600"
                                            }`}>
                                            {test.passRate.toFixed(1)}%
                                        </span>
                                    </td>
                                    <td className="py-4 text-right text-xs text-gray-400 font-medium">
                                        {formatDateTime(test.lastRun)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
