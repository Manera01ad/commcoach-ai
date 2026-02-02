"use client";

import { useDashboardData } from "@/hooks/useDashboardData";
import { useSaasMetrics } from "@/hooks/useSaasMetrics";
import { Header } from "@/components/Dashboard/Header";
import { AlertsTicker } from "@/components/Dashboard/AlertsTicker";
import { HealthCard } from "@/components/Dashboard/HealthCard";
import { TrendsChart } from "@/components/Dashboard/TrendsChart";
import { SummaryList } from "@/components/Dashboard/SummaryList";
import { AIRecommendations } from "@/components/Dashboard/AIRecommendations";
import {
  ShieldCheck,
  Brain,
  UserSquare2,
  Zap,
  Lock,
  ShieldAlert,
  Scale,
  MessageSquare,
  AlertCircle,
  Loader2,
  Server,
  DollarSign,
  Users,
  Coins,
  Ticket
} from "lucide-react";

export default function DashboardPage() {
  const { data: qaData, backendHealth, isLoading: qaLoading, isRefreshing, error: qaError, lastUpdated } = useDashboardData();
  const { data: saasData, isLoading: saasLoading, error: saasError } = useSaasMetrics();

  const isLoading = qaLoading || saasLoading;
  const error = qaError || saasError;

  if (isLoading && !qaData && !saasData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Initializing Dashboard</h2>
        <p className="text-slate-500 mt-2">Connecting to CommCoach AI monitoring systems...</p>
      </div>
    );
  }

  if (error && !qaData && !saasData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">System Offline</h2>
        <p className="max-w-md text-slate-500 mt-2">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const { infra, therapy, journey, performance, security, safety, bias, quality, trends: qaTrends, alerts: qaAlerts, overallScore, summaries: qaSummaries, recommendations: qaRecommendations } = qaData || {};

  // Combine alerts from both QA and SaaS
  const allAlerts = [
    ...(qaAlerts || []),
    ...(saasData?.alerts || [])
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header
        overallScore={overallScore || 0}
        lastUpdated={lastUpdated}
        isRefreshing={isRefreshing}
      />

      <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-[1600px] mx-auto">

          {/* Horizontal Alerts Ticker */}
          <AlertsTicker alerts={allAlerts} />

          {/* ============================================ */}
          {/* QA & SECURITY SECTION */}
          {/* ============================================ */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full" />
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  QA & Security Monitoring
                </h2>
                <p className="text-sm text-slate-500">Real-time system health and security metrics</p>
              </div>
            </div>

            {/* Priority 1: Live Monitoring */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-6 bg-blue-600 rounded-full" />
                <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Priority 1: Live Monitoring</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <HealthCard
                  title="System Core"
                  icon={Server}
                  score={backendHealth?.status === 'healthy' ? 100 : 0}
                  status={backendHealth?.status === 'healthy' ? "Online" : "Offline"}
                  metric={backendHealth ? `RAM: ${backendHealth.system.memory.used}MB / DB: ${backendHealth.database}` : 'Connecting...'}
                  isLoading={qaLoading && !backendHealth}
                />
                <HealthCard
                  title="Infrastructure"
                  icon={ShieldCheck}
                  score={infra?.is_healthy ? 100 : 0}
                  status={infra?.is_healthy ? "Healthy" : "Critical"}
                  metric={`${infra?.frontend_response_time_ms}ms / ${infra?.backend_response_time_ms}ms`}
                  isLoading={qaLoading}
                />
                <HealthCard
                  title="Security"
                  icon={Lock}
                  score={security?.total_security_score || 0}
                  status={security?.total_security_score >= 95 ? "Hardened" : "Vulnerable"}
                  metric={`${security?.critical_issues_count || 0} critical findings`}
                  isLoading={qaLoading}
                />
                <HealthCard
                  title="User Journeys"
                  icon={UserSquare2}
                  score={journey?.success_rate || 0}
                  status={journey?.success_rate >= 85 ? "Stable" : "Regression"}
                  metric={`${journey?.passed_journeys}/${journey?.total_journeys} completed`}
                  isLoading={qaLoading}
                />
                <HealthCard
                  title="Safety"
                  icon={ShieldAlert}
                  score={safety?.prescription_safety_score || 0}
                  status={safety?.prescription_safety_score >= 90 ? "Protected" : "Violation"}
                  metric={safety?.boundary_maintained ? "Boundaries maintained" : "Issues detected"}
                  isLoading={qaLoading}
                />
                <HealthCard
                  title="Bias & Fairness"
                  icon={Scale}
                  score={bias?.overall_fairness_score || 0}
                  status={bias?.overall_fairness_score >= 90 ? "Equitable" : "Biased"}
                  metric={`${bias?.gender_fairness_score}% gender, ${bias?.age_fairness_score}% age`}
                  isLoading={qaLoading}
                />
              </div>
            </div>

            {/* Priority 2: System Calibration */}
            <div className="mb-8 opacity-70 grayscale-[0.3]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-6 bg-slate-400 rounded-full" />
                <h3 className="text-lg font-bold text-slate-500 uppercase tracking-tight">Priority 2: System Calibration (WIP)</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <HealthCard
                  title="Therapy Logic"
                  icon={Brain}
                  score={therapy?.archetype_accuracy || 0}
                  status={therapy?.archetype_accuracy > 0 ? (therapy?.archetype_accuracy >= 80 ? "Accurate" : "Investigation") : "Calibrating"}
                  metric={therapy?.total_tests ? `${therapy?.passed_tests}/${therapy?.total_tests} passed` : "Pending Logic Freeze"}
                  isLoading={qaLoading}
                />
                <HealthCard
                  title="Performance"
                  icon={Zap}
                  score={performance?.performance_score || 0}
                  status={performance?.performance_score > 0 ? (performance?.performance_score >= 80 ? "Fast" : "Latency") : "Sampling"}
                  metric={performance?.avg_response_time_ms ? `${performance?.avg_response_time_ms}ms average` : "Optimizing Infra"}
                  isLoading={qaLoading}
                />
                <HealthCard
                  title="Conversation Quality"
                  icon={MessageSquare}
                  score={quality?.overall_quality_score || 0}
                  status={quality?.overall_quality_score > 0 ? (quality?.overall_quality_score >= 80 ? "Elite" : "Sub-par") : "Training"}
                  metric={quality?.empathy_score ? `${quality?.empathy_score}% empathy, ${quality?.clarity_score}% clarity` : "Refining NLP"}
                  isLoading={qaLoading}
                />
              </div>
            </div>

            {/* QA Trends */}
            <TrendsChart data={qaTrends} isLoading={qaLoading} />
          </div>

          {/* ============================================ */}
          {/* SAAS METRICS SECTION */}
          {/* ============================================ */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-emerald-600 to-blue-600 rounded-full" />
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  SaaS Business Metrics
                </h2>
                <p className="text-sm text-slate-500">Platform viability and unit economics</p>
              </div>
              {saasData && (
                <div className="ml-auto flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-xl">
                  <span className="text-xs font-medium text-slate-600">Viability Score</span>
                  <span className="text-2xl font-black text-slate-900">{saasData.overallHealth.toFixed(1)}</span>
                  <span className={`text-sm font-bold ${saasData.overallHealth >= 80 ? 'text-emerald-600' :
                      saasData.overallHealth >= 60 ? 'text-amber-600' :
                        'text-rose-600'
                    }`}>
                    {saasData.overallHealth >= 80 ? 'Healthy' : saasData.overallHealth >= 60 ? 'Stable' : 'At Risk'}
                  </span>
                </div>
              )}
            </div>

            {/* SaaS Metrics Cards */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-6 bg-emerald-600 rounded-full" />
                <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Financials & Growth</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <HealthCard
                  title="Monthly Revenue"
                  icon={DollarSign}
                  score={saasData ? (saasData.mrr / 150) : 0}
                  status={saasData ? `$${saasData.mrr.toLocaleString()}` : 'Loading...'}
                  metric={saasData ? `+${saasData.mrrGrowth}% from last month` : '...'}
                  isLoading={saasLoading}
                />
                <HealthCard
                  title="User Base"
                  icon={Users}
                  score={saasData ? (saasData.activeUsers / saasData.totalUsers) * 100 : 0}
                  status={saasData ? `${saasData.activeUsers} Active` : 'Loading...'}
                  metric={saasData ? `${saasData.totalUsers} total registered` : '...'}
                  isLoading={saasLoading}
                />
                <HealthCard
                  title="AI Token Cost"
                  icon={Coins}
                  score={90}
                  status={saasData ? `$${saasData.tokenSpend}` : 'Loading...'}
                  metric={saasData ? `Margin: ${saasData.revenuePerToken.toFixed(1)}x per $ spend` : '...'}
                  isLoading={saasLoading}
                />
                <HealthCard
                  title="Support Load"
                  icon={Ticket}
                  score={85}
                  status={saasData ? `${saasData.openTickets} Open` : 'Loading...'}
                  metric="Avg response time: 2.4h"
                  isLoading={saasLoading}
                />
              </div>
            </div>

            {/* SaaS Trends Chart */}
            {saasData && saasData.trends.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm mb-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Revenue & Usage Velocity</h3>
                    <p className="text-gray-500 text-sm">MRR (Lines) vs AI Consumption (Points)</p>
                  </div>
                </div>
                <div className="h-[350px]">
                  <TrendsChart data={saasData.trends} />
                </div>
              </div>
            )}
          </div>

          {/* ============================================ */}
          {/* COMBINED INSIGHTS SECTION */}
          {/* ============================================ */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full" />
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  AI Insights & Recommendations
                </h2>
                <p className="text-sm text-slate-500">Intelligent analysis and actionable insights</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* QA Summaries */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  QA Test Summaries
                </h3>
                <SummaryList summaries={qaSummaries} isLoading={qaLoading} />
              </div>

              {/* SaaS Subscription Breakdown */}
              {saasData && saasData.summaries.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-600" />
                    Subscription Breakdown
                  </h3>
                  <SummaryList summaries={saasData.summaries} isLoading={saasLoading} />
                </div>
              )}
            </div>

            {/* AI Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <AIRecommendations recommendations={qaRecommendations} isLoading={qaLoading} />
              {saasData && saasData.recommendations.length > 0 && (
                <div className="bg-gradient-to-br from-emerald-900 to-teal-950 border border-emerald-800 rounded-2xl p-6 shadow-xl text-white overflow-hidden relative">
                  <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                      <DollarSign className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-bold">💰 SaaS Recommendations</h2>
                  </div>
                  <div className="space-y-4 relative z-10">
                    {saasData.recommendations.map((rec, i) => (
                      <div key={i} className="group flex gap-4 transition-all hover:translate-x-1">
                        <div className="flex flex-col items-center">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 group-hover:scale-150 transition-transform" />
                          <div className="w-[1px] h-full bg-emerald-800 my-1" />
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase border ${rec.priority === 'High' ? 'text-rose-600 bg-rose-50 border-rose-100' :
                                rec.priority === 'Medium' ? 'text-amber-600 bg-amber-50 border-amber-100' :
                                  'text-blue-600 bg-blue-50 border-blue-100'
                              }`}>
                              {rec.priority}
                            </span>
                            <p className="font-bold text-sm text-emerald-100">{rec.action}</p>
                          </div>
                          <p className="text-xs text-emerald-300 italic pl-1 leading-relaxed">
                            Rationale: {rec.rationale}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <footer className="py-12 text-center text-slate-400 text-sm">
            &copy; 2026 CommCoach AI Quality Assurance & Business Intelligence. All rights reserved.
          </footer>
        </div>
      </main>
    </div>
  );
}
