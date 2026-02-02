import { useState, useEffect, useCallback } from 'react';

export interface SaasMetrics {
    mrr: number;
    mrrGrowth: number;
    activeUsers: number;
    totalUsers: number;
    tokenSpend: number;
    revenuePerToken: number;
    openTickets: number;
    bannedUsers: number;
    overallHealth: number;
    trends: Array<{
        date: string;
        infrastructure: number;
        therapy: number;
        journey: number;
        performance: number;
        security: number;
    }>;
    alerts: Array<{
        id: string;
        message: string;
        type: 'success' | 'warning' | 'critical';
        timestamp: string;
    }>;
    summaries: Array<{
        type: string;
        count: number;
        passRate: number;
        lastRun: string;
    }>;
    recommendations: Array<{
        priority: 'High' | 'Medium' | 'Low';
        action: string;
        rationale: string;
    }>;
}

export function useSaasMetrics(refreshInterval: number = 30000) {
    const [data, setData] = useState<SaasMetrics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const fetchMetrics = useCallback(async (isInitial: boolean = false) => {
        try {
            if (isInitial) {
                setIsLoading(true);
            } else {
                setIsRefreshing(true);
            }

            setError(null);

            const response = await fetch('/api/saas-metrics', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success && result.data) {
                setData(result.data);
                setLastUpdated(new Date());
            } else {
                throw new Error(result.error || 'Failed to fetch SaaS metrics');
            }
        } catch (err: any) {
            console.error('Error fetching SaaS metrics:', err);
            setError(err.message || 'Failed to load SaaS metrics');

            // Set fallback mock data if fetch fails
            if (!data) {
                setData({
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
                });
            }
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [data]);

    useEffect(() => {
        fetchMetrics(true);

        // Set up auto-refresh
        const interval = setInterval(() => {
            fetchMetrics(false);
        }, refreshInterval);

        return () => clearInterval(interval);
    }, [fetchMetrics, refreshInterval]);

    return {
        data,
        isLoading,
        isRefreshing,
        error,
        lastUpdated,
        refresh: () => fetchMetrics(false)
    };
}
