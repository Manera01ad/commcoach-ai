import { supabase } from '../config/supabase.js';

/**
 * ArchetypeProgressionService handles archetype unlocking, mastery tracking, and progression logic
 */
class ArchetypeProgressionService {
    /**
     * Get user's archetype progression data
     */
    async getProgressTree(userId) {
        try {
            const { data, error } = await supabase
                .rpc('get_user_archetype_progress', { p_user_id: userId });

            if (error) throw error;

            return {
                success: true,
                archetypes: data
            };
        } catch (error) {
            console.error('[ArchetypeProgression] Error fetching progress:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Track a session for an archetype and check for unlocks
     */
    async trackSession(userId, archetype, sessionId = null, qualityScore = null) {
        try {
            const { data, error } = await supabase
                .rpc('track_archetype_session', {
                    p_user_id: userId,
                    p_archetype: archetype,
                    p_session_id: sessionId,
                    p_quality_score: qualityScore
                });

            if (error) throw error;

            // Check for new unlocks
            const unlockCheck = await this.checkUnlocks(userId);

            return {
                success: true,
                sessionData: data,
                newlyUnlocked: unlockCheck.newlyUnlocked || []
            };
        } catch (error) {
            console.error('[ArchetypeProgression] Error tracking session:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Check if any new archetypes can be unlocked
     */
    async checkUnlocks(userId) {
        try {
            // Get user's current progress
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('archetype_mastery, unlocked_archetypes')
                .eq('id', userId)
                .single();

            if (profileError) throw profileError;

            const mastery = profile.archetype_mastery || {};
            const unlocked = profile.unlocked_archetypes || [];
            const newlyUnlocked = [];

            // Check Tier 2 unlocks
            const tier2Checks = [
                { id: 'BUILDER', requires: 'FORTRESS', minSessions: 10 },
                { id: 'LISTENER', requires: 'PLEASER', minSessions: 10 },
                { id: 'WARRIOR', requires: 'PROSECUTOR', minSessions: 10 }
            ];

            for (const check of tier2Checks) {
                if (!unlocked.includes(check.id)) {
                    const requiredSessions = mastery[check.requires]?.sessions || 0;
                    if (requiredSessions >= check.minSessions) {
                        newlyUnlocked.push(check.id);
                        unlocked.push(check.id);
                    }
                }
            }

            // Check Tier 3 (Sage) unlock
            if (!unlocked.includes('SAGE')) {
                const builderMastered = mastery.BUILDER?.mastered || false;
                const listenerMastered = mastery.LISTENER?.mastered || false;
                const warriorMastered = mastery.WARRIOR?.mastered || false;

                if (builderMastered && listenerMastered && warriorMastered) {
                    newlyUnlocked.push('SAGE');
                    unlocked.push('SAGE');
                }
            }

            // Update unlocked archetypes if there are new ones
            if (newlyUnlocked.length > 0) {
                await supabase
                    .from('profiles')
                    .update({
                        unlocked_archetypes: unlocked,
                        archetype_mastery: {
                            ...mastery,
                            ...Object.fromEntries(
                                newlyUnlocked.map(id => [
                                    id,
                                    {
                                        sessions: 0,
                                        mastered: false,
                                        unlocked_at: new Date().toISOString()
                                    }
                                ])
                            )
                        }
                    })
                    .eq('id', userId);
            }

            return {
                success: true,
                newlyUnlocked
            };
        } catch (error) {
            console.error('[ArchetypeProgression] Error checking unlocks:', error);
            return {
                success: false,
                error: error.message,
                newlyUnlocked: []
            };
        }
    }

    /**
     * Switch user's active archetype
     */
    async switchArchetype(userId, newArchetype) {
        try {
            const { data, error } = await supabase
                .rpc('switch_archetype', {
                    p_user_id: userId,
                    p_new_archetype: newArchetype
                });

            if (error) throw error;

            return {
                success: true,
                message: `Switched to ${newArchetype}`
            };
        } catch (error) {
            console.error('[ArchetypeProgression] Error switching archetype:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get archetype statistics for a user
     */
    async getStats(userId) {
        try {
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('archetype_mastery, unlocked_archetypes, current_archetype')
                .eq('id', userId)
                .single();

            if (profileError) throw profileError;

            const mastery = profile.archetype_mastery || {};
            const unlocked = profile.unlocked_archetypes || [];

            const masteredCount = Object.values(mastery).filter(m => m.mastered).length;
            const totalSessions = Object.values(mastery).reduce((sum, m) => sum + (m.sessions || 0), 0);

            return {
                success: true,
                stats: {
                    currentArchetype: profile.current_archetype,
                    unlockedCount: unlocked.length,
                    masteredCount,
                    totalSessions,
                    tier1Mastered: ['FORTRESS', 'PROSECUTOR', 'PLEASER', 'SOLVER']
                        .filter(id => mastery[id]?.mastered).length,
                    tier2Mastered: ['BUILDER', 'LISTENER', 'WARRIOR']
                        .filter(id => mastery[id]?.mastered).length,
                    tier3Mastered: mastery.SAGE?.mastered ? 1 : 0
                }
            };
        } catch (error) {
            console.error('[ArchetypeProgression] Error getting stats:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default new ArchetypeProgressionService();
