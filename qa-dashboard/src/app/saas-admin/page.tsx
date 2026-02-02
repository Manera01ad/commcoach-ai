"use client";

import Link from "next/link";
import { useSaasMetrics } from "@/hooks/useSaasMetrics";
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
  TrendingUp,
  Activity,
  ArrowUpRight,
  Loader2,
  AlertCircle,
  ArrowLeft
} from "lucide-react";

export default function SaasAdminDashboard() {
  const { data, isLoading, isRefreshing, error, lastUpdated } = useSaasMetrics();

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Loading SaaS Control Plane</h2>
        <p className="text-slate-500 mt-2">Connecting to Supabase and aggregating metrics...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Failed to Load SaaS Metrics</h2>
        <p className="text-slate-500 mt-2 max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const saasData = data || {
    mrr: 0,
    mrrGrowth: 0,
    activeUsers: 0,
    totalUsers: 0,
    tokenSpend: 0,
    revenuePerToken: 0,
    openTickets: 0,
    bannedUsers: 0,
    overallHealth: 0,
    trends: [],
    alerts: [],
    summaries: [],
    recommendations: []
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* SaaS Custom Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-6 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to QA Dashboard</span>
            </Link>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                SaaS Control Plane
              </h1>
              <p className="text-gray-500 flex items-center gap-2">
                Platform Viability & Unit Economics <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-400 uppercase tracking-wider">Viability Score</div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-gray-900">{saasData.overallHealth.toFixed(1)}</span>
                <span className="text-lg font-bold text-emerald-500">
                  {saasData.overallHealth >= 80 ? 'Healthy' : saasData.overallHealth >= 60 ? 'Stable' : 'At Risk'}
                </span>
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
          <AlertsSidebar alerts={saasData.alerts} />
        </aside>
      </div>
    </div>
  );
}
