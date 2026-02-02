import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
    try {
        // Calculate current MRR directly from tables (no view needed)
        const { data: activeSubscriptions, error: mrrError } = await supabase
            .from('user_subscriptions')
            .select(`
                billing_cycle,
                subscription_plans (
                    price_usd
                )
            `)
            .eq('status', 'active')
            .gte('current_period_end', new Date().toISOString());

        if (mrrError) {
            console.error('MRR fetch error:', mrrError);
        }

        // Calculate MRR from active subscriptions
        let currentMrr = 0;
        if (activeSubscriptions) {
            currentMrr = activeSubscriptions.reduce((sum: number, sub: any) => {
                const price = parseFloat(sub.subscription_plans?.price_usd || 0);
                if (sub.billing_cycle === 'monthly') {
                    return sum + price;
                } else if (sub.billing_cycle === 'yearly') {
                    return sum + (price / 12);
                }
                return sum;
            }, 0);
        }

        const mrrData = { mrr: currentMrr, active_subscriptions: activeSubscriptions?.length || 0 };

        // Fetch active users count
        const { count: activeUsersCount, error: activeUsersError } = await supabase
            .from('user_subscriptions')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'active')
            .gte('current_period_end', new Date().toISOString());

        if (activeUsersError) {
            console.error('Active users error:', activeUsersError);
        }

        // Fetch total users count
        const { count: totalUsersCount, error: totalUsersError } = await supabase
            .from('user_subscriptions')
            .select('*', { count: 'exact', head: true });

        if (totalUsersError) {
            console.error('Total users error:', totalUsersError);
        }

        // Fetch token usage for current month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { data: tokenData, error: tokenError } = await supabase
            .from('token_usage')
            .select('tokens_used, cost_usd')
            .gte('created_at', startOfMonth.toISOString());

        if (tokenError) {
            console.error('Token usage error:', tokenError);
        }

        const totalTokens = tokenData?.reduce((sum, row) => sum + row.tokens_used, 0) || 0;
        const totalCost = tokenData?.reduce((sum, row) => sum + (row.cost_usd || 0), 0) || 0;

        // Fetch open support tickets
        const { count: openTicketsCount, error: ticketsError } = await supabase
            .from('support_tickets')
            .select('*', { count: 'exact', head: true })
            .in('status', ['open', 'in_progress']);

        if (ticketsError) {
            console.error('Support tickets error:', ticketsError);
        }

        // Fetch banned users count
        const { count: bannedUsersCount, error: bannedError } = await supabase
            .from('user_moderation')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'banned');

        if (bannedError) {
            console.error('Banned users error:', bannedError);
        }

        // Fetch revenue for current month
        const { data: revenueData, error: revenueError } = await supabase
            .from('revenue_transactions')
            .select('amount')
            .eq('payment_status', 'completed')
            .gte('created_at', startOfMonth.toISOString());

        if (revenueError) {
            console.error('Revenue error:', revenueError);
        }

        const monthlyRevenue = revenueData?.reduce((sum, row) => sum + parseFloat(row.amount.toString()), 0) || 0;

        // Fetch last month's MRR for growth calculation
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const { data: lastMonthMetrics, error: lastMonthError } = await supabase
            .from('saas_metrics_daily')
            .select('mrr')
            .gte('date', lastMonth.toISOString().split('T')[0])
            .lt('date', startOfMonth.toISOString().split('T')[0])
            .order('date', { ascending: false })
            .limit(1)
            .single();


        if (lastMonthError && lastMonthError.code !== 'PGRST116') {
            console.error('Last month metrics error:', lastMonthError);
        }

        // Use the currentMrr calculated earlier
        const lastMonthMrr = lastMonthMetrics?.mrr || currentMrr;
        const mrrGrowth = lastMonthMrr > 0
            ? ((currentMrr - lastMonthMrr) / lastMonthMrr) * 100
            : 0;

        // Calculate revenue per token
        const revenuePerToken = totalCost > 0 ? currentMrr / totalCost : 0;

        // Fetch subscription breakdown (using existing table structure)
        const { data: subscriptionBreakdown, error: breakdownError } = await supabase
            .from('user_subscriptions')
            .select(`
        plan_id,
        subscription_plans (
          name,
          tier,
          price_usd
        )
      `)
            .eq('status', 'active');

        if (breakdownError) {
            console.error('Subscription breakdown error:', breakdownError);
        }

        // Group by plan
        const planCounts: Record<string, { count: number; revenue: number; name: string }> = {};
        subscriptionBreakdown?.forEach((sub: any) => {
            const planName = sub.subscription_plans?.tier || sub.subscription_plans?.name || 'Unknown';
            const planRevenue = parseFloat(sub.subscription_plans?.price_usd || 0);

            if (!planCounts[planName]) {
                planCounts[planName] = { count: 0, revenue: 0, name: planName };
            }
            planCounts[planName].count++;
            planCounts[planName].revenue += planRevenue;
        });

        const summaries = Object.values(planCounts).map(plan => ({
            type: plan.name,
            count: plan.count,
            passRate: plan.revenue,
            lastRun: new Date().toISOString()
        }));

        // Fetch recent alerts (high-value signups, payment failures, etc.)
        const { data: recentTransactions, error: alertsError } = await supabase
            .from('revenue_transactions')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

        if (alertsError) {
            console.error('Alerts error:', alertsError);
        }

        const alerts = recentTransactions?.map((txn: any) => ({
            id: txn.id,
            message: txn.payment_status === 'completed'
                ? `New payment: $${txn.amount} via ${txn.payment_gateway}`
                : `Payment ${txn.payment_status}: $${txn.amount}`,
            type: txn.payment_status === 'completed' ? 'success' :
                txn.payment_status === 'failed' ? 'critical' : 'warning',
            timestamp: txn.created_at
        })) || [];

        // Fetch trends data (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data: trendsData, error: trendsError } = await supabase
            .from('saas_metrics_daily')
            .select('*')
            .gte('date', sevenDaysAgo.toISOString().split('T')[0])
            .order('date', { ascending: true });

        if (trendsError) {
            console.error('Trends error:', trendsError);
        }

        const trends = trendsData?.map((day: any) => ({
            date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            infrastructure: day.mrr,
            therapy: day.total_token_cost,
            journey: day.active_users,
            performance: day.revenue_today,
            security: day.open_tickets
        })) || [];

        // Generate AI recommendations based on data
        const recommendations: Array<{
            priority: 'High' | 'Medium' | 'Low';
            action: string;
            rationale: string;
        }> = [];

        // Check for high token usage
        if (totalCost > 0 && revenuePerToken < 5) {
            recommendations.push({
                priority: 'High' as const,
                action: 'Optimize Token Cost',
                rationale: `Revenue per token is ${revenuePerToken.toFixed(2)}x. Consider optimizing AI model usage.`
            });
        }

        // Check for open tickets
        if ((openTicketsCount || 0) > 10) {
            recommendations.push({
                priority: 'Medium' as const,
                action: 'Review Support Load',
                rationale: `${openTicketsCount} open tickets. Consider scaling support team.`
            });
        }

        // Check for growth
        if (mrrGrowth < 5) {
            recommendations.push({
                priority: 'High' as const,
                action: 'Accelerate Growth',
                rationale: `MRR growth is ${mrrGrowth.toFixed(1)}%. Focus on acquisition and retention.`
            });
        }

        // Calculate overall health score
        const healthFactors = [
            mrrGrowth > 10 ? 100 : mrrGrowth * 5, // Growth factor
            (activeUsersCount || 0) > 100 ? 100 : (activeUsersCount || 0), // User base
            revenuePerToken > 5 ? 100 : revenuePerToken * 20, // Unit economics
            (openTicketsCount || 0) < 10 ? 100 : 100 - ((openTicketsCount || 0) * 5) // Support health
        ];
        const overallHealth = healthFactors.reduce((a, b) => a + b, 0) / healthFactors.length;

        return NextResponse.json({
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

    } catch (error: any) {
        console.error('SaaS metrics API error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to fetch SaaS metrics',
                data: null
            },
            { status: 500 }
        );
    }
}
