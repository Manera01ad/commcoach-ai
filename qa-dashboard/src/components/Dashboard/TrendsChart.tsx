"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface TrendsData {
    date: string;
    infrastructure: number;
    therapy: number;
    journey: number;
    performance: number;
    security: number;
}

interface TrendsChartProps {
    data: TrendsData[];
    isLoading?: boolean;
}

export function TrendsChart({ data, isLoading }: TrendsChartProps) {
    if (isLoading) {
        return (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-8 h-[450px] animate-pulse">
                <div className="h-6 w-48 bg-gray-200 rounded mb-8"></div>
                <div className="w-full h-[350px] bg-gray-100 rounded"></div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-8 animate-in fade-in zoom-in-95 duration-500">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                📈 7-Day Trends
            </h2>

            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            domain={[0, 100]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                            itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                        />
                        <Legend verticalAlign="top" height={36} iconType="circle" />

                        <Line
                            name="Infrastructure"
                            type="monotone"
                            dataKey="infrastructure"
                            stroke="#10b981"
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                        <Line
                            name="Therapy"
                            type="monotone"
                            dataKey="therapy"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                        <Line
                            name="Journeys"
                            type="monotone"
                            dataKey="journey"
                            stroke="#f59e0b"
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                        <Line
                            name="Performance"
                            type="monotone"
                            dataKey="performance"
                            stroke="#8b5cf6"
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                        <Line
                            name="Security"
                            type="monotone"
                            dataKey="security"
                            stroke="#ef4444"
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
