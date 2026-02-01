"use client";

import Link from "next/link";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Header } from "@/components/Dashboard/Header";
import { AlertsSidebar } from "@/components/Dashboard/AlertsSidebar";
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
  LayoutDashboard
} from "lucide-react";

export default function DashboardPage() {
  const { data, backendHealth, isLoading, isRefreshing, error, lastUpdated } = useDashboardData();

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Initializing Dashboard</h2>
        <p className="text-slate-500 mt-2">Connecting to CommCoach AI monitoring systems...</p>
      </div>
    );
  }

  if (error && !data) {
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

  const { infra, therapy, journey, performance, security, safety, bias, quality, trends, alerts, overallScore, summaries, recommendations } = data;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header
        overallScore={overallScore || 0}
        lastUpdated={lastUpdated}
        isRefreshing={isRefreshing}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-[1400px] mx-auto">
            {/* SaaS Admin Shortcut */}
            <div className="mb-6 flex justify-end">
              <Link 
                href="/saas-admin"
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 group"
              >
                <LayoutDashboard className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                Go to SaaS Control Plane
              </Link>
            </div>
            {/* Live Monitoring Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-6 bg-blue-600 rounded-full" />
                <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Priority 1: Live Monitoring</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <HealthCard
                  title="System Core"
                  icon={Server}
                  score={backendHealth?.status === 'healthy' ? 100 : 0}
                  status={backendHealth?.status === 'healthy' ? "Online" : "Offline"}
                  metric={backendHealth ? `RAM: ${backendHealth.system.memory.used}MB / DB: ${backendHealth.database}` : 'Connecting...'}
                  isLoading={isLoading && !backendHealth}
                />
                <HealthCard
                  title="Infrastructure"
                  icon={ShieldCheck}
                  score={infra?.is_healthy ? 100 : 0}
                  status={infra?.is_healthy ? "Healthy" : "Critical"}
                  metric={`${infra?.frontend_response_time_ms}ms / ${infra?.backend_response_time_ms}ms`}
                  isLoading={isLoading}
                />
                <HealthCard
                  title="Security"
                  icon={Lock}
                  score={security?.total_security_score || 0}
                  status={security?.total_security_score >= 95 ? "Hardened" : "Vulnerable"}
                  metric={`${security?.critical_issues_count || 0} critical findings`}
                  isLoading={isLoading}
                />
                <HealthCard
                  title="User Journeys"
                  icon={UserSquare2}
                  score={journey?.success_rate || 0}
                  status={journey?.success_rate >= 85 ? "Stable" : "Regression"}
                  metric={`${journey?.passed_journeys}/${journey?.total_journeys} completed`}
                  isLoading={isLoading}
                />
                <HealthCard
                  title="Safety"
                  icon={ShieldAlert}
                  score={safety?.prescription_safety_score || 0}
                  status={safety?.prescription_safety_score >= 90 ? "Protected" : "Violation"}
                  metric={safety?.boundary_maintained ? "Boundaries maintained" : "Issues detected"}
                  isLoading={isLoading}
                />
                <HealthCard
                  title="Bias & Fairness"
                  icon={Scale}
                  score={bias?.overall_fairness_score || 0}
                  status={bias?.overall_fairness_score >= 90 ? "Equitable" : "Biased"}
                  metric={`${bias?.gender_fairness_score}% gender, ${bias?.age_fairness_score}% age`}
                  isLoading={isLoading}
                />
              </div>
            </div>

            {/* Secondary / WIP Section */}
            <div className="mb-8 opacity-70 grayscale-[0.3]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-6 bg-slate-400 rounded-full" />
                <h2 className="text-lg font-bold text-slate-500 uppercase tracking-tight">Priority 2: System Calibration (WIP)</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <HealthCard
                  title="Therapy Logic"
                  icon={Brain}
                  score={therapy?.archetype_accuracy || 0}
                  status={therapy?.archetype_accuracy > 0 ? (therapy?.archetype_accuracy >= 80 ? "Accurate" : "Investigation") : "Calibrating"}
                  metric={therapy?.total_tests ? `${therapy?.passed_tests}/${therapy?.total_tests} passed` : "Pending Logic Freeze"}
                  isLoading={isLoading}
                />
                <HealthCard
                  title="Performance"
                  icon={Zap}
                  score={performance?.performance_score || 0}
                  status={performance?.performance_score > 0 ? (performance?.performance_score >= 80 ? "Fast" : "Latency") : "Sampling"}
                  metric={performance?.avg_response_time_ms ? `${performance?.avg_response_time_ms}ms average` : "Optimizing Infra"}
                  isLoading={isLoading}
                />
                <HealthCard
                  title="Conversation Quality"
                  icon={MessageSquare}
                  score={quality?.overall_quality_score || 0}
                  status={quality?.overall_quality_score > 0 ? (quality?.overall_quality_score >= 80 ? "Elite" : "Sub-par") : "Training"}
                  metric={quality?.empathy_score ? `${quality?.empathy_score}% empathy, ${quality?.clarity_score}% clarity` : "Refining NLP"}
                  isLoading={isLoading}
                />
              </div>
            </div>

            {/* Trends */}
            <TrendsChart data={trends} isLoading={isLoading} />

            {/* Bottom Section */}
            <div className="flex flex-col lg:flex-row gap-8 items-stretch mt-8">
              <SummaryList summaries={summaries} isLoading={isLoading} />
              <AIRecommendations recommendations={recommendations} isLoading={isLoading} />
            </div>

            <footer className="py-12 text-center text-slate-400 text-sm">
              &copy; 2026 CommCoach AI Quality Assurance Intelligence. All rights reserved.
            </footer>
          </div>
        </main>

        {/* Sidebar for Alerts */}
        <aside className="w-80 shrink-0 hidden xl:block shadow-2xl z-10 transition-all border-l border-slate-200">
          <AlertsSidebar alerts={alerts || []} />
        </aside>
      </div>
    </div>
  );
}
