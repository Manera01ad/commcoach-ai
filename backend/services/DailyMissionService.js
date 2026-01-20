/**
 * Daily Mission Service
 * Handles daily mission generation, completion, and XP rewards
 */

import { supabase } from '../config/supabase.js';

class DailyMissionService {
    /**
     * Get or generate today's mission for a user
     */
    async getTodaysMission(userId) {
        try {
            // Call database function to generate/get mission
            const { data, error } = await supabase
                .rpc('generate_daily_mission', { p_user_id: userId });

            if (error) throw error;

            const missionId = data;

            // Get full mission details
            const { data: mission, error: missionError } = await supabase
                .from('daily_missions')
                .select(`
          *,
          drill:micro_drills(*)
        `)
                .eq('id', missionId)
                .single();

            if (missionError) throw missionError;

            return {
                success: true,
                mission
            };
        } catch (error) {
            console.error('[DailyMissionService] Error getting mission:', error);
            throw error;
        }
    }

    /**
     * Complete a mission
     */
    async completeMission(userId, missionId, completionData) {
        try {
            const { score, durationSeconds, feedback } = completionData;

            // Get mission details
            const { data: mission, error: missionError } = await supabase
                .from('daily_missions')
                .select('*, drill:micro_drills(*)')
                .eq('id', missionId)
                .eq('user_id', userId)
                .single();

            if (missionError) throw missionError;

            if (mission.completed) {
                return {
                    success: false,
                    error: 'Mission already completed'
                };
            }

            // Calculate XP based on score
            const baseXP = mission.drill.xp_reward;
            const scoreMultiplier = score / 100;
            const xpEarned = Math.round(baseXP * scoreMultiplier);

            // Update mission as completed
            const { error: updateError } = await supabase
                .from('daily_missions')
                .update({
                    completed: true,
                    xp_earned: xpEarned,
                    completion_score: score,
                    completed_at: new Date().toISOString()
                })
                .eq('id', missionId);

            if (updateError) throw updateError;

            // Log completion
            const { error: logError } = await supabase
                .from('mission_completions')
                .insert({
                    user_id: userId,
                    mission_id: missionId,
                    drill_id: mission.drill_id,
                    duration_seconds: durationSeconds,
                    score,
                    xp_earned: xpEarned,
                    feedback
                });

            if (logError) throw logError;

            // Award XP and check for level up
            const { data: xpResult, error: xpError } = await supabase
                .rpc('award_xp', {
                    p_user_id: userId,
                    p_xp_amount: xpEarned
                });

            if (xpError) throw xpError;

            return {
                success: true,
                xpEarned,
                levelUp: xpResult
            };
        } catch (error) {
            console.error('[DailyMissionService] Error completing mission:', error);
            throw error;
        }
    }

    /**
     * Get user's level and XP
     */
    async getUserLevel(userId) {
        try {
            const { data, error } = await supabase
                .from('user_levels')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            // If no level record, create one
            if (!data) {
                const { data: newLevel, error: createError } = await supabase
                    .from('user_levels')
                    .insert({ user_id: userId })
                    .select()
                    .single();

                if (createError) throw createError;
                return { success: true, level: newLevel };
            }

            return { success: true, level: data };
        } catch (error) {
            console.error('[DailyMissionService] Error getting user level:', error);
            throw error;
        }
    }

    /**
     * Get mission history
     */
    async getMissionHistory(userId, limit = 30) {
        try {
            const { data, error } = await supabase
                .from('daily_missions')
                .select(`
          *,
          drill:micro_drills(title, category, difficulty)
        `)
                .eq('user_id', userId)
                .order('date', { ascending: false })
                .limit(limit);

            if (error) throw error;

            return { success: true, history: data };
        } catch (error) {
            console.error('[DailyMissionService] Error getting history:', error);
            throw error;
        }
    }

    /**
     * Get completion stats
     */
    async getCompletionStats(userId) {
        try {
            const { data, error } = await supabase
                .from('daily_missions')
                .select('completed, xp_earned, completion_score')
                .eq('user_id', userId);

            if (error) throw error;

            const total = data.length;
            const completed = data.filter(m => m.completed).length;
            const completionRate = total > 0 ? (completed / total) * 100 : 0;
            const totalXP = data.reduce((sum, m) => sum + (m.xp_earned || 0), 0);
            const avgScore = completed > 0
                ? data.filter(m => m.completed).reduce((sum, m) => sum + m.completion_score, 0) / completed
                : 0;

            return {
                success: true,
                stats: {
                    totalMissions: total,
                    completedMissions: completed,
                    completionRate: Math.round(completionRate),
                    totalXP,
                    averageScore: Math.round(avgScore),
                    currentStreak: await this.calculateMissionStreak(userId)
                }
            };
        } catch (error) {
            console.error('[DailyMissionService] Error getting stats:', error);
            throw error;
        }
    }

    /**
     * Calculate mission completion streak
     */
    async calculateMissionStreak(userId) {
        try {
            const { data, error } = await supabase
                .from('daily_missions')
                .select('date, completed')
                .eq('user_id', userId)
                .order('date', { ascending: false })
                .limit(30);

            if (error) throw error;

            let streak = 0;
            const today = new Date().toISOString().split('T')[0];

            for (const mission of data) {
                const missionDate = mission.date;
                if (mission.completed) {
                    streak++;
                } else if (missionDate !== today) {
                    // Streak broken (but today doesn't count against streak)
                    break;
                }
            }

            return streak;
        } catch (error) {
            console.error('[DailyMissionService] Error calculating streak:', error);
            return 0;
        }
    }
}

export default new DailyMissionService();
