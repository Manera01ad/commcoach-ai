import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import Logo from '../components/Logo';

// Components
import StreakCounter from '../components/StreakCounter';
import LevelProgress from '../components/LevelProgress';
import DailyMission from '../components/DailyMission';
import CommDNAAssessment from '../components/CommDNAAssessment';
import CommDNAProfile from '../components/CommDNAProfile';
import FounderDashboard from '../components/FounderDashboard';
import MeetingAgent from '../components/MeetingLab/MeetingAgent';
import AuraChat from '../components/AuraChat';
import Leaderboard from '../components/Leaderboard';
import SettingsPage from './Settings';
import ArchetypeSkillTree from '../components/ArchetypeSkillTree';
import { LayoutDashboard, Target, Users, Settings, LogOut, Menu, X, BookOpen, Crown, BrainCircuit, TreePine } from 'lucide-react';

// Context
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'missions' | 'founders' | 'settings' | 'library' | 'community' | 'meetings' | 'profile' | 'neural' | 'archetypes'>('overview');
    const [dnaProfile, setDnaProfile] = useState<any>(null);
    const [isAssessmentActive, setIsAssessmentActive] = useState(false);
    const [isAuraOpen, setIsAuraOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const [userStats, setUserStats] = useState({
        level: 4,
        currentXP: 850,
        nextLevelXP: 1000,
        streak: 12,
        xpHistory: 50
    });

    const [dailyMissions, setDailyMissions] = useState<any[]>([]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;
            try {
                const tokenObj = localStorage.getItem('supabase.auth.token');
                const token = tokenObj ? JSON.parse(tokenObj).access_token : '';

                // 1. Fetch Streak Stats
                const streakRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/streak/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const streakData = await streakRes.json();

                // 2. Fetch Level/XP Stats
                const levelRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/missions/level`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const levelData = await levelRes.json();

                // 3. Fetch Today's Missions
                const missionsRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/missions/today`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const missionsData = await missionsRes.json();

                if (streakData.success) {
                    setUserStats(prev => ({
                        ...prev,
                        streak: streakData.stats?.currentStreak || 0
                    }));
                }

                if (levelData.success) {
                    setUserStats(prev => ({
                        ...prev,
                        level: levelData.level?.level || prev.level,
                        currentXP: levelData.level?.current_xp || prev.currentXP,
                        nextLevelXP: levelData.level?.next_level_xp || prev.nextLevelXP
                    }));
                }

                if (missionsData.success) {
                    // Adapt the missions table structure to DailyMission props
                    const mission = missionsData.mission;
                    setDailyMissions([{
                        id: mission.id,
                        title: mission.drill.title,
                        description: mission.drill.description,
                        xpReward: mission.drill.xp_reward,
                        category: mission.drill.category,
                        difficulty: mission.drill.difficulty,
                        status: mission.completed ? 'completed' : 'pending'
                    }]);
                }

                // 4. Fetch DNA Profile
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('comm_dna')
                    .eq('id', user.id)
                    .single();

                if (profile?.comm_dna) {
                    setDnaProfile(profile.comm_dna);
                }
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user]);

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
        <div className="h-full flex flex-col bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white font-sans overflow-hidden">

            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-30">
                <div className="flex items-center gap-2">
                    <Logo className="h-10" />
                </div>
                <button onClick={toggleSidebar} className="p-2">
                    {sidebarOpen ? <X /> : <Menu />}
                </button>
            </div>

            <div className="flex-1 min-h-0 flex max-w-7xl mx-auto relative w-full overflow-hidden">

                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm transition-opacity"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar Navigation */}
                <aside className={`
                    fixed lg:sticky top-0 left-0 z-40 h-full w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 p-6 flex flex-col justify-between transition-transform duration-300 transform overflow-y-auto
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    lg:h-screen lg:top-0
                `}>
                    <div>
                        <div className="hidden lg:flex items-center gap-3 mb-10 px-2">
                            <Logo className="h-24" />
                        </div>
                        <div className="mb-6 px-2">
                            <p className="text-xs text-neutral-500 font-medium tracking-wider">AI TRAINING DECK</p>
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
                                icon={Users}
                                label="CommDNA Profile"
                                active={activeTab === 'profile'}
                                onClick={() => { setActiveTab('profile'); setSidebarOpen(false); }}
                            />
                            <MenuLink
                                id="neural"
                                icon={BrainCircuit}
                                label="Neural Architecture"
                                active={activeTab === 'neural'}
                                onClick={() => { setActiveTab('neural'); setSidebarOpen(false); }}
                            />
                            <MenuLink
                                id="archetypes"
                                icon={TreePine}
                                label="Archetype Mastery"
                                active={activeTab === 'archetypes'}
                                onClick={() => { setActiveTab('archetypes'); setSidebarOpen(false); }}
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
                <main className="flex-1 h-full overflow-y-auto p-4 lg:p-8 overflow-x-hidden custom-scrollbar">

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
                        <>
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
                                            {dailyMissions.length > 0 ? dailyMissions.map((m) => (
                                                <DailyMission
                                                    key={m.id}
                                                    id={m.id}
                                                    title={m.title}
                                                    description={m.description}
                                                    xpReward={m.xpReward}
                                                    category={m.category}
                                                    difficulty={m.difficulty}
                                                    status={m.status}
                                                />
                                            )) : (
                                                <div className="md:col-span-2 text-center py-8 bg-white/50 dark:bg-neutral-800/50 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700">
                                                    <p className="text-neutral-500">No missions scheduled for today yet.</p>
                                                    <button className="mt-2 text-sm text-indigo-600 font-bold">Generate New Mission →</button>
                                                </div>
                                            )}
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

                        </>
                    )}

                    {activeTab === 'neural' && (
                        <div className="max-w-6xl mx-auto">
                            <div className="mb-8 p-6 bg-gradient-to-r from-indigo-600/10 to-transparent rounded-3xl border border-indigo-500/10">
                                <h2 className="text-3xl font-black mb-2">Neural Architecture</h2>
                                <p className="text-neutral-500 font-medium">Your Real-time Communication DNA & Persona Matrix.</p>
                            </div>
                            <CommDNAProfile
                                data={dnaProfile || {
                                    archetype: 'The Diplomat',
                                    traits: { clarity: 65, empathy: 90, confidence: 60, persuasion: 75 },
                                    strengths: ['Empathetic', 'Calm'],
                                    weaknesses: ['Assertiveness'],
                                    recommendedTone: 'Assertive'
                                }}
                                user={{ name: user?.full_name || 'Champion' }}
                                stats={{
                                    level: userStats.level,
                                    streak: userStats.streak,
                                    xp: userStats.currentXP
                                }}
                                onRetake={() => { setActiveTab('profile'); setIsAssessmentActive(true); }}
                            />
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="max-w-4xl mx-auto">
                            {isAssessmentActive ? (
                                <CommDNAAssessment
                                    onComplete={(result) => {
                                        setDnaProfile(result);
                                        setIsAssessmentActive(false);
                                        setActiveTab('neural'); // Switch to neural view on completion
                                    }}
                                    onCancel={() => setIsAssessmentActive(false)}
                                />
                            ) : dnaProfile ? (
                                <div className="text-center py-12 px-6 bg-white dark:bg-neutral-900 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-xl">
                                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Users className="w-10 h-10" />
                                    </div>
                                    <h2 className="text-3xl font-black mb-4">DNA Profile Active</h2>
                                    <p className="text-neutral-500 max-w-lg mx-auto mb-8 text-lg font-medium">
                                        Your communication DNA has been mapped. You can view your detailed architecture in the dedicated tab or recalibrate below.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <button
                                            onClick={() => setActiveTab('neural')}
                                            className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all"
                                        >
                                            View Architecture
                                        </button>
                                        <button
                                            onClick={() => setIsAssessmentActive(true)}
                                            className="px-8 py-4 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-2xl font-black hover:bg-neutral-200 transition-all"
                                        >
                                            Retake Assessment
                                        </button>
                                    </div>
                                </div>
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

                    {activeTab === 'archetypes' && (
                        <div className="max-w-7xl mx-auto">
                            <ArchetypeSkillTree />
                        </div>
                    )}

                    {activeTab === 'founders' && (
                        <div className="max-w-4xl mx-auto">
                            <FounderDashboard />
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="max-w-4xl mx-auto">
                            <SettingsPage />
                        </div>
                    )}

                    {activeTab === 'meetings' && (
                        <div className="h-[calc(100vh-16rem)] min-h-[600px]">
                            <MeetingAgent />
                        </div>
                    )}

                    {/* Floating Aura Active Link */}
                    <div className="fixed bottom-8 right-8 z-50">
                        <button
                            onClick={() => setIsAuraOpen(true)}
                            className="w-16 h-16 bg-slate-900 dark:bg-indigo-600 text-white rounded-[2rem] shadow-2xl shadow-indigo-600/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
                        >
                            <BrainCircuit className="w-8 h-8 group-hover:animate-pulse" />
                        </button>
                    </div>

                    <AuraChat
                        isOpen={isAuraOpen}
                        onClose={() => setIsAuraOpen(false)}
                        dnaProfile={dnaProfile}
                    />

                </main>
            </div >
        </div >
    );
};

export default Dashboard;
