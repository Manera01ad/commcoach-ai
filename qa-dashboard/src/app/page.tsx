"use client";

import { useDashboardData } from "@/hooks/useDashboardData";
import { Header } from "@/components/Dashboard/Header";
import { AlertsSection } from "@/components/Dashboard/Alerts";
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
  Loader2
} from "lucide-react";

export default function DashboardPage() {
  const { data, isLoading, isRefreshing, error, lastUpdated } = useDashboardData();

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
    <div className="min-h-screen bg-slate-50">
      <Header
        overallScore={overallScore || 0}
        lastUpdated={lastUpdated}
        isRefreshing={isRefreshing}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Errors / Alerts */}
        <AlertsSection alerts={alerts} />

        {/* Health Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <HealthCard
            title="Infrastructure"
            icon={ShieldCheck}
            score={infra?.is_healthy ? 100 : 0}
            status={infra?.is_healthy ? "Healthy" : "Critical"}
            metric={`${infra?.frontend_response_time_ms}ms / ${infra?.backend_response_time_ms}ms`}
            isLoading={isLoading}
          />
          <HealthCard
            title="Therapy Logic"
            icon={Brain}
            score={therapy?.archetype_accuracy || 0}
            status={therapy?.archetype_accuracy >= 80 ? "Accurate" : "Investigation"}
            metric={`${therapy?.passed_tests}/${therapy?.total_tests} passed`}
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
            title="Performance"
            icon={Zap}
            score={performance?.performance_score || 0}
            status={performance?.performance_score >= 80 ? "Fast" : "Latency"}
            metric={`${performance?.avg_response_time_ms}ms average`}
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
          <HealthCard
            title="Conversation Quality"
            icon={MessageSquare}
            score={quality?.overall_quality_score || 0}
            status={quality?.overall_quality_score >= 80 ? "Elite" : "Sub-par"}
            metric={`${quality?.empathy_score}% empathy, ${quality?.clarity_score}% clarity`}
            isLoading={isLoading}
          />
        </div>

        {/* Trends */}
        <TrendsChart data={trends} isLoading={isLoading} />

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          <SummaryList summaries={summaries} isLoading={isLoading} />
          <AIRecommendations recommendations={recommendations} isLoading={isLoading} />
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 text-center text-slate-400 text-sm">
        &copy; 2026 CommCoach AI Quality Assurance Intelligence. All rights reserved.
      </footer>
    </div>
  );
}
