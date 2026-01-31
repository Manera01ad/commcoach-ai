import React, { useState, useEffect } from 'react';
import { Lock, CheckCircle, TrendingUp, Sparkles, TreePine } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface ArchetypeData {
    id: string;
    name: string;
    tier: number;
    icon: string;
    traits: string[];
    description: string;
    growthPath?: string;
    unlockRequirements?: {
        requiredArchetypes?: string[];
        minSessions?: number;
        allMustBeMastered?: boolean;
    };
    sessions: number;
    isUnlocked: boolean;
    isMastered: boolean;
    isActive: boolean;
}

const ArchetypeSkillTree: React.FC = () => {
    const [archetypes, setArchetypes] = useState<ArchetypeData[]>([]);
    const [selectedArchetype, setSelectedArchetype] = useState<ArchetypeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [switching, setSwitching] = useState(false);
    const { showToast } = useToast();

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    // Fetch archetype progress from API
    useEffect(() => {
        const fetchArchetypeProgress = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');

                if (!token) {
                    setError('Please log in to view your archetype progress');
                    setLoading(false);
                    return;
                }

                // Fetch all archetypes with user progress
                const response = await fetch(`${API_URL}/api/archetypes/progress`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch archetype progress');
                }

                const data = await response.json();

                if (data.success && data.archetypes) {
                    // Transform API data to match component interface
                    const transformedArchetypes: ArchetypeData[] = data.archetypes.map((arch: any) => ({
                        id: arch.archetype_id,
                        name: arch.archetype_name,
                        tier: arch.tier,
                        icon: arch.icon,
                        traits: [], // Will be populated from archetypes endpoint
                        description: '',
                        sessions: arch.sessions_completed || 0,
                        isUnlocked: arch.is_unlocked,
                        isMastered: arch.is_mastered,
                        isActive: arch.is_active
                    }));

                    // Fetch full archetype details
                    const archetypesResponse = await fetch(`${API_URL}/api/archetypes`);
                    const archetypesData = await archetypesResponse.json();

                    if (archetypesData.success) {
                        // Merge progress data with full archetype details
                        const mergedArchetypes = transformedArchetypes.map(arch => {
                            const fullData = archetypesData.archetypes.find((a: any) => a.id === arch.id);
                            return {
                                ...arch,
                                traits: fullData?.traits || [],
                                description: fullData?.description || '',
                                growthPath: fullData?.growthPath,
                                unlockRequirements: fullData?.unlockRequirements
                            };
                        });

                        setArchetypes(mergedArchetypes);
                        setSelectedArchetype(mergedArchetypes.find(a => a.isActive) || mergedArchetypes[0]);
                    }
                } else {
                    throw new Error(data.error || 'Failed to load archetypes');
                }
            } catch (err) {
                console.error('Error fetching archetypes:', err);
                setError(err instanceof Error ? err.message : 'Failed to load archetypes');
            } finally {
                setLoading(false);
            }
        };

        fetchArchetypeProgress();
    }, [API_URL]);

    // Periodic check for new unlocks (every 30 seconds)
    useEffect(() => {
        if (!archetypes.length) return;

        const checkForUnlocks = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await fetch(`${API_URL}/api/archetypes/unlock-check`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if (data.success && data.newlyUnlocked && data.newlyUnlocked.length > 0) {
                    // Show celebration notification for each newly unlocked archetype
                    data.newlyUnlocked.forEach((archetypeId: string) => {
                        const archetype = archetypes.find(a => a.id === archetypeId);
                        if (archetype) {
                            showToast({
                                type: 'success',
                                title: '🎉 New Archetype Unlocked!',
                                message: `You've unlocked ${archetype.icon} ${archetype.name}! Keep practicing to master it.`,
                                duration: 8000
                            });
                        }
                    });

                    // Refresh archetype data
                    const progressResponse = await fetch(`${API_URL}/api/archetypes/progress`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (progressResponse.ok) {
                        const progressData = await progressResponse.json();
                        // Update archetypes with new unlock status
                        // (simplified - you may want to merge more carefully)
                        window.location.reload(); // Simple refresh for now
                    }
                }
            } catch (err) {
                console.error('Error checking unlocks:', err);
            }
        };

        // Check immediately, then every 30 seconds
        checkForUnlocks();
        const interval = setInterval(checkForUnlocks, 30000);

        return () => clearInterval(interval);
    }, [archetypes, API_URL, showToast]);

    // Handle archetype switching
    const handleSwitchArchetype = async (archetypeId: string) => {
        try {
            setSwitching(true);
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_URL}/api/archetypes/switch`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ archetype: archetypeId })
            });

            const data = await response.json();

            if (data.success) {
                // Update local state
                setArchetypes(prev => prev.map(a => ({
                    ...a,
                    isActive: a.id === archetypeId
                })));
                setSelectedArchetype(prev => prev ? { ...prev, isActive: prev.id === archetypeId } : null);
            } else {
                alert(data.error || 'Failed to switch archetype');
            }
        } catch (err) {
            console.error('Error switching archetype:', err);
            alert('Failed to switch archetype');
        } finally {
            setSwitching(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[600px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-neutral-500">Loading your archetype progress...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[600px]">
                <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-3xl border border-red-200 dark:border-red-800">
                    <p className="text-red-600 dark:text-red-400 font-bold mb-2">Error Loading Archetypes</p>
                    <p className="text-red-500 dark:text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    const ArchetypeCard: React.FC<{ archetype: ArchetypeData }> = ({ archetype }) => {
        const progress = archetype.unlockRequirements?.minSessions
            ? Math.min(100, (archetype.sessions / archetype.unlockRequirements.minSessions) * 100)
            : archetype.sessions >= 10 ? 100 : (archetype.sessions / 10) * 100;

        return (
            <button
                onClick={() => setSelectedArchetype(archetype)}
                className={`
                    relative p-6 rounded-2xl border-2 transition-all duration-300
                    ${archetype.isActive
                        ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 shadow-lg shadow-indigo-500/20'
                        : archetype.isUnlocked
                            ? 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-indigo-300 hover:shadow-md'
                            : 'border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 opacity-60'
                    }
                    ${selectedArchetype?.id === archetype.id ? 'ring-2 ring-indigo-500' : ''}
                `}
            >
                {/* Lock Icon for Locked Archetypes */}
                {!archetype.isUnlocked && (
                    <div className="absolute top-3 right-3">
                        <Lock className="w-5 h-5 text-neutral-400" />
                    </div>
                )}

                {/* Mastered Badge */}
                {archetype.isMastered && (
                    <div className="absolute top-3 right-3">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                )}

                {/* Active Indicator */}
                {archetype.isActive && (
                    <div className="absolute top-3 left-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    </div>
                )}

                {/* Icon */}
                <div className="text-5xl mb-3">{archetype.icon}</div>

                {/* Name */}
                <h3 className="font-bold text-lg mb-2">{archetype.name}</h3>

                {/* Tier Badge */}
                <div className={`
                    inline-block px-3 py-1 rounded-full text-xs font-bold mb-3
                    ${archetype.tier === 1 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : ''}
                    ${archetype.tier === 2 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                    ${archetype.tier === 3 ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : ''}
                `}>
                    Tier {archetype.tier}
                </div>

                {/* Progress Bar */}
                {archetype.isUnlocked && !archetype.isMastered && (
                    <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-neutral-500">Progress</span>
                            <span className="font-bold">{archetype.sessions}/{archetype.unlockRequirements?.minSessions || 10}</span>
                        </div>
                        <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Mastered Status */}
                {archetype.isMastered && (
                    <div className="mt-3 flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-bold text-sm">
                        <Sparkles className="w-4 h-4" />
                        MASTERED
                    </div>
                )}

                {/* Locked Status */}
                {!archetype.isUnlocked && (
                    <div className="mt-3 text-xs text-neutral-500">
                        Unlock: {archetype.unlockRequirements?.requiredArchetypes?.join(', ')}
                    </div>
                )}
            </button>
        );
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 p-6 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-3xl border border-indigo-500/10">
                <h2 className="text-3xl font-black mb-2">Archetype Mastery</h2>
                <p className="text-neutral-500 font-medium">Track your communication growth journey</p>
            </div>

            {/* Skill Tree Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Left: Skill Tree */}
                <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-800">
                    <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                        <TreePine className="w-6 h-6 text-indigo-600" />
                        Progression Tree
                    </h3>

                    {/* Tier 3: Sage */}
                    <div className="flex justify-center mb-8">
                        <ArchetypeCard archetype={archetypes.find(a => a.id === 'SAGE')!} />
                    </div>

                    {/* Connection Lines */}
                    <div className="flex justify-center mb-4">
                        <div className="w-px h-12 bg-gradient-to-b from-neutral-300 to-transparent dark:from-neutral-700" />
                    </div>

                    {/* Tier 2: Growth Archetypes */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <ArchetypeCard archetype={archetypes.find(a => a.id === 'BUILDER')!} />
                        <ArchetypeCard archetype={archetypes.find(a => a.id === 'LISTENER')!} />
                        <ArchetypeCard archetype={archetypes.find(a => a.id === 'WARRIOR')!} />
                    </div>

                    {/* Connection Lines */}
                    <div className="flex justify-center mb-4">
                        <div className="w-px h-12 bg-gradient-to-b from-neutral-300 to-transparent dark:from-neutral-700" />
                    </div>

                    {/* Tier 1: Starter Archetypes */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <ArchetypeCard archetype={archetypes.find(a => a.id === 'FORTRESS')!} />
                        <ArchetypeCard archetype={archetypes.find(a => a.id === 'PROSECUTOR')!} />
                        <ArchetypeCard archetype={archetypes.find(a => a.id === 'PLEASER')!} />
                        <ArchetypeCard archetype={archetypes.find(a => a.id === 'SOLVER')!} />
                    </div>
                </div>

                {/* Right: Selected Archetype Details */}
                {selectedArchetype && (
                    <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-800">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="text-6xl">{selectedArchetype.icon}</div>
                            <div>
                                <h3 className="text-2xl font-black">{selectedArchetype.name}</h3>
                                <p className="text-neutral-500">Tier {selectedArchetype.tier}</p>
                            </div>
                        </div>

                        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                            {selectedArchetype.description}
                        </p>

                        <div className="mb-6">
                            <h4 className="font-bold mb-2">Traits</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedArchetype.traits.map((trait, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-sm font-medium"
                                    >
                                        {trait}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {selectedArchetype.growthPath && (
                            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                    <h4 className="font-bold text-green-700 dark:text-green-400">Growth Path</h4>
                                </div>
                                <p className="text-sm text-green-600 dark:text-green-400">
                                    Evolves into: {archetypes.find(a => a.id === selectedArchetype.growthPath)?.name}
                                </p>
                            </div>
                        )}

                        {selectedArchetype.unlockRequirements && !selectedArchetype.isUnlocked && (
                            <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                                <h4 className="font-bold mb-2 text-orange-700 dark:text-orange-400">Unlock Requirements</h4>
                                <ul className="text-sm text-orange-600 dark:text-orange-400 space-y-1">
                                    {selectedArchetype.unlockRequirements.requiredArchetypes && (
                                        <li>• Master: {selectedArchetype.unlockRequirements.requiredArchetypes.join(', ')}</li>
                                    )}
                                    {selectedArchetype.unlockRequirements.minSessions && (
                                        <li>• Complete {selectedArchetype.unlockRequirements.minSessions} sessions</li>
                                    )}
                                </ul>
                            </div>
                        )}

                        {selectedArchetype.isUnlocked && (
                            <div className="space-y-3">
                                {selectedArchetype.isActive ? (
                                    <div className="px-4 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl font-bold text-center">
                                        ✓ Currently Active
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleSwitchArchetype(selectedArchetype.id)}
                                        disabled={switching}
                                        className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-400 text-white rounded-xl font-bold transition-colors"
                                    >
                                        {switching ? 'Switching...' : `Switch to ${selectedArchetype.name}`}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Progress Summary */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white">
                <h3 className="text-2xl font-black mb-4">Your Progress</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <div className="text-4xl font-black mb-2">
                            {archetypes.filter(a => a.isMastered).length}/8
                        </div>
                        <div className="text-white/80">Archetypes Mastered</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black mb-2">
                            {archetypes.filter(a => a.isUnlocked).length}/8
                        </div>
                        <div className="text-white/80">Archetypes Unlocked</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black mb-2">
                            {archetypes.reduce((sum, a) => sum + a.sessions, 0)}
                        </div>
                        <div className="text-white/80">Total Sessions</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArchetypeSkillTree;
