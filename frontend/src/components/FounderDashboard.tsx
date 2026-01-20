import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, DollarSign, Users, Award, TrendingUp, Copy, Check } from 'lucide-react';

const FounderDashboard: React.FC = () => {
    const [copied, setCopied] = useState(false);

    // Mock data - In real app, fetch from /api/founders/stats
    const stats = {
        isFounder: false,
        referralCode: 'ALEX-FND-2026',
        totalReferrals: 0,
        earningsPending: 0,
        earningsPaid: 0,
        referralRate: '20%'
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(`https://commcoach.ai/join?ref=${stats.referralCode}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!stats.isFounder) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-8 text-white relative overflow-hidden shadow-2xl"
            >
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20 rotate-3 transform hover:rotate-6 transition-transform">
                        <Crown className="w-8 h-8 text-white" />
                    </div>

                    <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600">
                        Join the Founder's Circle
                    </h2>

                    <p className="text-neutral-400 max-w-lg mx-auto mb-8 text-lg">
                        Get lifetime access, exclusive features, and earn 20% commission on every referral. Forever.
                    </p>

                    <button
                        className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-amber-500/25 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
                        onClick={() => console.log('Open checkout')}
                    >
                        Become a Founder <TrendingUp className="w-5 h-5" />
                    </button>

                    <p className="mt-4 text-sm text-neutral-500">
                        Limited to first 100 members • 42 spots remaining
                    </p>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="w-full space-y-6">
            {/* Founder Status Card */}
            <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-2xl p-6 text-white border border-amber-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Crown className="w-32 h-32" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
                                FOUNDING MEMBER
                            </span>
                            <span className="text-neutral-400 text-xs">Since Jan 2026</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white">Founder Dashboard</h2>
                    </div>

                    <div className="flex items-center gap-2 bg-neutral-800/50 p-2 rounded-lg border border-neutral-700">
                        <div className="px-3">
                            <div className="text-xs text-neutral-400">Referral Code</div>
                            <div className="font-mono font-bold text-amber-400">{stats.referralCode}</div>
                        </div>
                        <button
                            onClick={handleCopy}
                            className="p-2 hover:bg-neutral-700 rounded-md transition-colors"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-neutral-400" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    icon={Users}
                    label="Total Referrals"
                    value={stats.totalReferrals.toString()}
                    trend="+2 this week"
                    color="blue"
                />
                <StatCard
                    icon={DollarSign}
                    label="Pending Earnings"
                    value={`$${stats.earningsPending}`}
                    subtext="Next payout: Feb 1st"
                    color="amber"
                />
                <StatCard
                    icon={Award}
                    label="Lifetime Earnings"
                    value={`$${stats.earningsPaid}`}
                    color="green"
                />
            </div>

            {/* Recent Activity Placeholder */}
            {/* Would typically list recent referrals here */}
        </div>
    );
};

const StatCard: React.FC<{ icon: any, label: string, value: string, trend?: string, subtext?: string, color: 'blue' | 'amber' | 'green' }> = ({
    icon: Icon, label, value, trend, subtext, color
}) => {
    const colors = {
        blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        green: 'bg-green-500/10 text-green-500 border-green-500/20'
    };

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-lg ${colors[color]} border`}>
                    <Icon className="w-5 h-5" />
                </div>
                {trend && (
                    <span className="text-xs font-medium text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                        {trend}
                    </span>
                )}
            </div>
            <div className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
                {value}
            </div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
                {label}
            </div>
            {subtext && (
                <div className="text-xs text-neutral-400 mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                    {subtext}
                </div>
            )}
        </div>
    );
};

export default FounderDashboard;
