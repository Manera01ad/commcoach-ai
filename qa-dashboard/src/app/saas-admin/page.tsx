"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Dashboard/Header";
import { HealthCard } from "@/components/Dashboard/HealthCard";
import { TrendsChart } from "@/components/Dashboard/TrendsChart";
import { SummaryList } from "@/components/Dashboard/SummaryList";
import { AIRecommendations } from "@/components/Dashboard/AIRecommendations";
import { AlertsSidebar } from "@/components/Dashboard/AlertsSidebar";
import {
  DollarSign,
  Users,
  Coins,
  Ticket,
  ShieldBan,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  AlertCircle
} from "lucide-react";

export default function SaasAdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Loading SaaS Control Plane</h2>
        <p className="text-slate-500 mt-2">Aggregating revenue and usage metrics...</p>
      </div>
    );
  }

  // Mock SaaS Data
  const saasData = {
    mrr: 12400,
    mrrGrowth: 12.5,
    activeUsers: 1054,
    totalUsers: 1240,
    tokenSpend: 1140,
    revenuePerToken: 10.8,
    openTickets: 12,
    bannedUsers: 5,
    overallHealth: 94.2,
    trends: [
      { date: "Jan 26", infrastructure: 8200, therapy: 850, journey: 900, performance: 750, security: 92 },
      { date: "Jan 27", infrastructure: 8400, therapy: 880, journey: 910, performance: 780, security: 93 },
      { date: "Jan 28", infrastructure: 8900, therapy: 920, journey: 930, performance: 810, security: 91 },
      { date: "Jan 29", infrastructure: 9500, therapy: 950, journey: 950, performance: 850, security: 94 },
      { date: "Jan 30", infrastructure: 10200, therapy: 1050, journey: 980, performance: 890, security: 95 },
      { date: "Jan 31", infrastructure: 11500, therapy: 1100, journey: 1020, performance: 920, security: 96 },
      { date: "Feb 01", infrastructure: 12400, therapy: 1140, journey: 1054, performance: 950, security: 97 }
    ],
    alerts: [
      { id: "1", message: "New Enterprise signup: Acme Corp ($2,500/mo)", type: "success" as const, timestamp: new Date().toISOString() },
      { id: "2", message: "High token usage warning: User #405 (85% limit)", type: "warning" as const, timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: "3", message: "Failed payment: Organization 'StartupX'", type: "critical" as const, timestamp: new Date(Date.now() - 7200000).toISOString() }
    ],
    summaries: [
      { type: 'Pro Plan', count: 850, passRate: 12, lastRun: new Date().toISOString() },
      { type: 'Enterprise', count: 42, passRate: 25, lastRun: new Date().toISOString() },
      { type: 'Free Tier', count: 348, passRate: 5, lastRun: new Date().toISOString() }
    ],
    recommendations: [
      { priority: 'High', action: 'Upsell Acme Corp', rationale: 'Usage consistently hitting 95% of current plan limits' },
      { priority: 'Medium', action: 'Review Churn Risk: StartupX', rationale: 'Three failed payment attempts in the last 48 hours' },
      { priority: 'Low', action: 'Optimize Token Cost', rationale: 'Switching to GPT-4o-mini for summaries could save $200/mo' }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* SaaS Custom Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-6 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              SaaS Control Plane
            </h1>
            <p className="text-gray-500 flex items-center gap-2">
              Platform Viability & Unit Economics <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-400 uppercase tracking-wider">Viability Score</div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-gray-900">{saasData.overallHealth.toFixed(1)}</span>
                <span className="text-lg font-bold text-emerald-500">Healthy</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-[1400px] mx-auto">
            
            {/* SaaS Metrics Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-6 bg-emerald-600 rounded-full" />
                <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Financials & Growth</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <HealthCard
                  title="Monthly Revenue"
                  icon={DollarSign}
                  score={saasData.mrr / 150} // Normalized for the score indicator
                  status={`$${saasData.mrr.toLocaleString()}`}
                  metric={`+${saasData.mrrGrowth}% from last month`}
                />
                <HealthCard
                  title="User Base"
                  icon={Users}
                  score={(saasData.activeUsers / saasData.totalUsers) * 100}
                  status={`${saasData.activeUsers} Active`}
                  metric={`${saasData.totalUsers} total registered`}
                />
                <HealthCard
                  title="AI Token Cost"
                  icon={Coins}
                  score={90}
                  status={`$${saasData.tokenSpend}`}
                  metric={`Margin: ${saasData.revenuePerToken}x per $ spend`}
                />
                <HealthCard
                  title="Support Load"
                  icon={Ticket}
                  score={85}
                  status={`${saasData.openTickets} Open`}
                  metric="Avg response time: 2.4h"
                />
              </div>
            </div>

            {/* Growth Chart */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm mb-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Revenue & Usage Velocity</h3>
                  <p className="text-gray-500 text-sm">MRR (Lines) vs AI Consumption (Points)</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">
                    <TrendingUp className="w-3 h-3" /> Revenue
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">
                    <Activity className="w-3 h-3" /> Usage
                  </div>
                </div>
              </div>
              <div className="h-[350px]">
                <TrendsChart data={saasData.trends} />
              </div>
            </div>

            {/* Intelligence Section */}
            <div className="flex flex-col lg:flex-row gap-8 items-stretch mt-8">
              <div className="flex-1 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ArrowUpRight className="w-5 h-5 text-emerald-500" /> Subscription Breakdown
                </h3>
                <SummaryList summaries={saasData.summaries} />
              </div>
              <div className="flex-1">
                <AIRecommendations recommendations={saasData.recommendations} />
              </div>
            </div>

            <footer className="py-12 text-center text-slate-400 text-sm">
              &copy; 2026 CommCoach AI SaaS Admin Panel. Proprietary & Confidential.
            </footer>
          </div>
        </main>

        <aside className="w-80 shrink-0 hidden xl:block shadow-2xl z-10 border-l border-slate-200">
          <AlertsSidebar alerts={saasData.alerts as any} title="Sales & Risk Feed" />
        </aside>
      </div>
    </div>
  );
}
