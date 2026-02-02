module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/app/api/saas-metrics/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://jmaerbneeavezfrvttzq.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptYWVyYm5lZWF2ZXpmcnZ0dHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NTI5NjIsImV4cCI6MjA4NDMyODk2Mn0.HgtB-4Y8im5H4GzoQezIWOzgPSXBRdCQ1xNStshDMJI");
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
async function GET() {
    try {
        // Fetch current MRR from view
        const { data: mrrData, error: mrrError } = await supabase.from('current_mrr').select('*').single();
        if (mrrError && mrrError.code !== 'PGRST116') {
            console.error('MRR fetch error:', mrrError);
        }
        // Fetch active users count
        const { count: activeUsersCount, error: activeUsersError } = await supabase.from('user_subscriptions').select('*', {
            count: 'exact',
            head: true
        }).eq('status', 'active').gte('current_period_end', new Date().toISOString());
        if (activeUsersError) {
            console.error('Active users error:', activeUsersError);
        }
        // Fetch total users count
        const { count: totalUsersCount, error: totalUsersError } = await supabase.from('user_subscriptions').select('*', {
            count: 'exact',
            head: true
        });
        if (totalUsersError) {
            console.error('Total users error:', totalUsersError);
        }
        // Fetch token usage for current month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const { data: tokenData, error: tokenError } = await supabase.from('token_usage').select('tokens_used, cost_usd').gte('created_at', startOfMonth.toISOString());
        if (tokenError) {
            console.error('Token usage error:', tokenError);
        }
        const totalTokens = tokenData?.reduce((sum, row)=>sum + row.tokens_used, 0) || 0;
        const totalCost = tokenData?.reduce((sum, row)=>sum + (row.cost_usd || 0), 0) || 0;
        // Fetch open support tickets
        const { count: openTicketsCount, error: ticketsError } = await supabase.from('support_tickets').select('*', {
            count: 'exact',
            head: true
        }).in('status', [
            'open',
            'in_progress'
        ]);
        if (ticketsError) {
            console.error('Support tickets error:', ticketsError);
        }
        // Fetch banned users count
        const { count: bannedUsersCount, error: bannedError } = await supabase.from('user_moderation').select('*', {
            count: 'exact',
            head: true
        }).eq('status', 'banned');
        if (bannedError) {
            console.error('Banned users error:', bannedError);
        }
        // Fetch revenue for current month
        const { data: revenueData, error: revenueError } = await supabase.from('revenue_transactions').select('amount').eq('payment_status', 'completed').gte('created_at', startOfMonth.toISOString());
        if (revenueError) {
            console.error('Revenue error:', revenueError);
        }
        const monthlyRevenue = revenueData?.reduce((sum, row)=>sum + parseFloat(row.amount.toString()), 0) || 0;
        // Fetch last month's MRR for growth calculation
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const { data: lastMonthMetrics, error: lastMonthError } = await supabase.from('saas_metrics_daily').select('mrr').gte('date', lastMonth.toISOString().split('T')[0]).lt('date', startOfMonth.toISOString().split('T')[0]).order('date', {
            ascending: false
        }).limit(1).single();
        if (lastMonthError && lastMonthError.code !== 'PGRST116') {
            console.error('Last month metrics error:', lastMonthError);
        }
        const currentMrr = mrrData?.mrr || 0;
        const lastMonthMrr = lastMonthMetrics?.mrr || currentMrr;
        const mrrGrowth = lastMonthMrr > 0 ? (currentMrr - lastMonthMrr) / lastMonthMrr * 100 : 0;
        // Calculate revenue per token
        const revenuePerToken = totalCost > 0 ? currentMrr / totalCost : 0;
        // Fetch subscription breakdown
        const { data: subscriptionBreakdown, error: breakdownError } = await supabase.from('user_subscriptions').select(`
        plan_id,
        subscription_plans (
          display_name,
          price_monthly
        )
      `).eq('status', 'active');
        if (breakdownError) {
            console.error('Subscription breakdown error:', breakdownError);
        }
        // Group by plan
        const planCounts = {};
        subscriptionBreakdown?.forEach((sub)=>{
            const planName = sub.subscription_plans?.display_name || 'Unknown';
            const planRevenue = parseFloat(sub.subscription_plans?.price_monthly || 0);
            if (!planCounts[planName]) {
                planCounts[planName] = {
                    count: 0,
                    revenue: 0,
                    name: planName
                };
            }
            planCounts[planName].count++;
            planCounts[planName].revenue += planRevenue;
        });
        const summaries = Object.values(planCounts).map((plan)=>({
                type: plan.name,
                count: plan.count,
                passRate: plan.revenue,
                lastRun: new Date().toISOString()
            }));
        // Fetch recent alerts (high-value signups, payment failures, etc.)
        const { data: recentTransactions, error: alertsError } = await supabase.from('revenue_transactions').select('*').order('created_at', {
            ascending: false
        }).limit(10);
        if (alertsError) {
            console.error('Alerts error:', alertsError);
        }
        const alerts = recentTransactions?.map((txn)=>({
                id: txn.id,
                message: txn.payment_status === 'completed' ? `New payment: $${txn.amount} via ${txn.payment_gateway}` : `Payment ${txn.payment_status}: $${txn.amount}`,
                type: txn.payment_status === 'completed' ? 'success' : txn.payment_status === 'failed' ? 'critical' : 'warning',
                timestamp: txn.created_at
            })) || [];
        // Fetch trends data (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const { data: trendsData, error: trendsError } = await supabase.from('saas_metrics_daily').select('*').gte('date', sevenDaysAgo.toISOString().split('T')[0]).order('date', {
            ascending: true
        });
        if (trendsError) {
            console.error('Trends error:', trendsError);
        }
        const trends = trendsData?.map((day)=>({
                date: new Date(day.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                }),
                infrastructure: day.mrr,
                therapy: day.total_token_cost,
                journey: day.active_users,
                performance: day.revenue_today,
                security: day.open_tickets
            })) || [];
        // Generate AI recommendations based on data
        const recommendations = [];
        // Check for high token usage
        if (totalCost > 0 && revenuePerToken < 5) {
            recommendations.push({
                priority: 'High',
                action: 'Optimize Token Cost',
                rationale: `Revenue per token is ${revenuePerToken.toFixed(2)}x. Consider optimizing AI model usage.`
            });
        }
        // Check for open tickets
        if ((openTicketsCount || 0) > 10) {
            recommendations.push({
                priority: 'Medium',
                action: 'Review Support Load',
                rationale: `${openTicketsCount} open tickets. Consider scaling support team.`
            });
        }
        // Check for growth
        if (mrrGrowth < 5) {
            recommendations.push({
                priority: 'High',
                action: 'Accelerate Growth',
                rationale: `MRR growth is ${mrrGrowth.toFixed(1)}%. Focus on acquisition and retention.`
            });
        }
        // Calculate overall health score
        const healthFactors = [
            mrrGrowth > 10 ? 100 : mrrGrowth * 5,
            (activeUsersCount || 0) > 100 ? 100 : activeUsersCount || 0,
            revenuePerToken > 5 ? 100 : revenuePerToken * 20,
            (openTicketsCount || 0) < 10 ? 100 : 100 - (openTicketsCount || 0) * 5 // Support health
        ];
        const overallHealth = healthFactors.reduce((a, b)=>a + b, 0) / healthFactors.length;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: {
                mrr: currentMrr,
                mrrGrowth: parseFloat(mrrGrowth.toFixed(2)),
                activeUsers: activeUsersCount || 0,
                totalUsers: totalUsersCount || 0,
                tokenSpend: parseFloat(totalCost.toFixed(2)),
                revenuePerToken: parseFloat(revenuePerToken.toFixed(2)),
                openTickets: openTicketsCount || 0,
                bannedUsers: bannedUsersCount || 0,
                overallHealth: parseFloat(overallHealth.toFixed(1)),
                trends,
                alerts,
                summaries,
                recommendations
            }
        });
    } catch (error) {
        console.error('SaaS metrics API error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error.message || 'Failed to fetch SaaS metrics',
            data: null
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6750e72e._.js.map