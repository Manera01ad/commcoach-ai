import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Components
import StreakCounter from '../components/StreakCounter';
import LevelProgress from '../components/LevelProgress';
import DailyMission from '../components/DailyMission';
import CommDNAAssessment from '../components/CommDNAAssessment';
import CommDNAProfile from '../components/CommDNAProfile';
import FounderDashboard from '../components/FounderDashboard';
import Leaderboard from '../components/Leaderboard';
import { LayoutDashboard, Target, Users, Settings, LogOut, Menu, X, BookOpen, Crown, BrainCircuit } from 'lucide-react';

// Context
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'missions' | 'founders' | 'settings' | 'library' | 'community' | 'meetings' | 'profile'>('overview');
    const [dnaProfile, setDnaProfile] = useState<any>(null); // Ideally fetch from DB
    const [isAssessmentActive, setIsAssessmentActive] = useState(false);

    // Stats (Mock for now, would come from Context/API)
    const userStats = {
        level: 4,
        currentXP: 850,
        nextLevelXP: 1000,
        streak: 12,
        xpHistory: 50 // Recent gain
    };

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const MenuLink = ({ id, icon: Icon, label, active, onClick }) => (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active
                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
        >
            <Icon className={`w-5 h-5 ${active ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white font-sans">

            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-30">
                <div className="font-bold text-xl tracking-tight flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white">
                        <Crown className="w-5 h-5" />
                    </div>
                    CommCoach
                </div>
                <button onClick={toggleSidebar} className="p-2">
                    {sidebarOpen ? <X /> : <Menu />}
                </button>
            </div>

            <div className="flex max-w-7xl mx-auto relative">

                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm transition-opacity"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar Navigation */}
                <aside className={`
                    fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 p-6 flex flex-col justify-between transition-transform duration-300 transform
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    lg:h-screen lg:top-0
                `}>
                    <div>
                        <div className="hidden lg:flex items-center gap-3 mb-10 px-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/20 flex items-center justify-center text-white">
                                <Crown className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="font-bold text-xl tracking-tight">CommCoach</h1>
                                <p className="text-xs text-neutral-500 font-medium tracking-wider">AI TRAINING DECK</p>
                            </div>
                        </div>

                        <nav className="space-y-2">
                            <MenuLink
                                id="overview"
                                icon={LayoutDashboard}
                                label="Dashboard"
                                active={activeTab === 'overview'}
                                onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
                            />
                            <MenuLink
                                id="profile"
                                icon={BrainCircuit}
                                label="CommDNA Profile"
                                active={activeTab === 'profile'}
                                onClick={() => { setActiveTab('profile'); setSidebarOpen(false); }}
                            />
                            <MenuLink
                                id="missions"
                                icon={Target}
                                label="Missions"
                                active={activeTab === 'missions'}
                                onClick={() => { setActiveTab('missions'); setSidebarOpen(false); }}
                            />
                            <MenuLink
                                id="founders"
                                icon={Crown}
                                label="Founder's Circle"
                                active={activeTab === 'founders'}
                                onClick={() => { setActiveTab('founders'); setSidebarOpen(false); }}
                            />
                            <MenuLink
                                id="library"
                                icon={BookOpen}
                                label="Library"
                                active={activeTab === 'library'}
                                onClick={() => { setActiveTab('library'); setSidebarOpen(false); }}
                            />
                            <MenuLink
                                id="community"
                                icon={Users}
                                label="Community"
                                active={activeTab === 'community'}
                                onClick={() => { setActiveTab('community'); setSidebarOpen(false); }}
                            />
                        </nav>
                    </div>

                    <div>
                        <MenuLink
                            id="settings"
                            icon={Settings}
                            label="Settings"
                            active={activeTab === 'settings'}
                            onClick={() => setActiveTab('settings')}
                        />
                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-4 py-3 mt-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-1">
                                {activeTab === 'overview' && `Welcome back, ${user?.full_name || 'Champion'} 👋`}
                                {activeTab === 'meetings' && 'Mission Control'}
                                {activeTab === 'founders' && 'Founder\'s Lounge'}
                            </h2>
                            <p className="text-neutral-500 dark:text-neutral-400">
                                {activeTab === 'overview' && 'Ready to crush your communication goals?'}
                                {activeTab === 'founders' && 'Your exclusive benefits and referral stats.'}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <StreakCounter
                                currentStreak={userStats.streak}
                                longestStreak={15}
                                frozen={false}
                            />
                        </div>
                    </div>

                    {/* Content Switcher */}
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Left Column (Main) */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Level Progress */}
                                <LevelProgress
                                    currentLevel={userStats.level}
                                    currentXP={userStats.currentXP}
                                    nextLevelXP={userStats.nextLevelXP}
                                    recentXP={userStats.xpHistory}
                                />

                                {/* Active Missions */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-lg">Today's Missions</h3>
                                        <button className="text-sm text-indigo-600 font-medium hover:underline">View All</button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <DailyMission
                                            id="1"
                                            title="Pacing Drill"
                                            description="Speak for 1 min at 130-150wpm"
                                            xpReward={100}
                                            category="delivery"
                                            difficulty="easy"
                                            status="pending"
                                        />
                                        <DailyMission
                                            id="2"
                                            title="Filler Word Hunt"
                                            description="Use <2 filler words in a story"
                                            xpReward={150}
                                            category="clarity"
                                            difficulty="medium"
                                            status="pending"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Column (Sidebar) */}
                            <div className="space-y-6">
                                <Leaderboard />

                                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white text-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                                    <Crown className="w-8 h-8 mx-auto mb-3" />
                                    <h3 className="font-bold text-lg mb-2">Upgrade to Pro</h3>
                                    <p className="text-white/80 text-sm mb-4">Unlock unlimited AI coaching sessions and advanced analytics.</p>
                                    <button className="w-full py-2 bg-white text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition-colors">
                                        View Plans
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="max-w-4xl mx-auto">
                            {isAssessmentActive ? (
                                <CommDNAAssessment
                                    onComplete={(result) => {
                                        setDnaProfile(result);
                                        setIsAssessmentActive(false);
                                    }}
                                    onCancel={() => setIsAssessmentActive(false)}
                                />
                            ) : dnaProfile ? (
                                <CommDNAProfile
                                    data={dnaProfile}
                                    onRetake={() => setIsAssessmentActive(true)}
                                />
                            ) : (
                                <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800">
                                    <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <BrainCircuit className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <h2 className="text-3xl font-bold mb-4">Discover Your CommDNA</h2>
                                    <p className="text-neutral-500 max-w-lg mx-auto mb-8 text-lg">
                                        Unlock a detailed analysis of your communication style, strengths, and recommended AI coaching tones.
                                    </p>
                                    <button
                                        onClick={() => setIsAssessmentActive(true)}
                                        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all hover:scale-105"
                                    >
                                        Start Assessment
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'founders' && (
                        <div className="max-w-4xl mx-auto">
                            <FounderDashboard />
                        </div>
                    )}

                    {/* Other tabs can be placeholders for now */}
                    {(activeTab !== 'overview' && activeTab !== 'founders') && (
                        <div className="text-center py-20 text-neutral-500">
                            Work in progress...
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
};

export default Dashboard;
