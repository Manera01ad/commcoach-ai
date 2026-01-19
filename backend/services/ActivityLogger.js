/**
 * Activity Logger - Privacy-First Session Tracking
 * 
 * Bridges your existing session logic with Streak Engine
 * WITHOUT exposing sensitive data
 * 
 * @author CommCoach AI Team
 * @version 1.0.0
 */

import StreakEngine from './StreakEngine.js';
import supabase from '../config/supabase.js';

export class ActivityLogger {
    /**
     * Call this AFTER a user completes ANY activity
     * (voice session, text drill, chat practice, etc.)
     * 
     * @param {Object} params - Activity parameters
     * @param {string} params.userId - User UUID
     * @param {string} params.sessionType - Type of activity
     * @param {number} params.durationSeconds - Session duration
     * @param {number} params.completionScore - Quality score (0-100)
     * @param {string} params.timestamp - ISO timestamp
     * @returns {Promise<Object>} Streak result and activity confirmation
     */
    static async logActivity(params) {
        const {
            userId,
            sessionType,      // 'voice_drill' | 'text_practice' | 'chat_session' | 'pod_review'
            durationSeconds,
            completionScore = 50,  // Default to 50 if not provided
            timestamp = new Date().toISOString()
        } = params;

        try {
            // 1. Calculate activity weight (smart scoring)
            const weight = this.calculateWeight({
                sessionType,
                durationSeconds,
                completionScore
            });

            // 2. Get user's timezone (from their profile or default)
            const userTimezone = await this.getUserTimezone(userId);

            // 3. Process through Streak Engine
            const streakResult = await StreakEngine.processActivity(
                userId,
                userTimezone,
                weight
            );

            // 4. Log the activity (NO sensitive content - privacy-safe!)
            await this.storeActivity({
                userId,
                sessionType,
                durationSeconds,
                weight,
                xpEarned: this.calculateXP(weight, streakResult.streak),
                timestamp
            });

            // 5. Check for milestone achievements
            if (streakResult.milestone) {
                await this.awardMilestone(userId, streakResult.milestone);
            }

            // 6. Return streak info to caller
            return {
                streak: streakResult,
                activityLogged: true,
                xpEarned: this.calculateXP(weight, streakResult.streak)
            };

        } catch (error) {
            console.error('[ActivityLogger] Error logging activity:', error);
            throw error;
        }
    }

    /**
     * Smart weight calculation
     * Higher weight = More valuable activity
     * 
     * @param {Object} params - Activity parameters
     * @returns {number} Activity weight (1.0 - 3.0)
     */
    static calculateWeight(params) {
        const { sessionType, durationSeconds, completionScore } = params;

        let baseWeight = 1.0;

        // Type bonuses (different activities have different value)
        const typeMultipliers = {
            'voice_drill': 1.5,           // Voice practice is valuable
            'chat_session': 1.0,          // Standard chat
            'pod_review': 1.3,            // Reviewing content
            'assessment': 1.8,            // Taking assessments
            'mentors_lab': 1.6,           // Working with mentors
            'meeting_agent': 1.7,         // Meeting practice
            'vision_lab': 1.4             // Visual analysis
        };

        baseWeight = typeMultipliers[sessionType] || 1.0;

        // Duration bonuses
        if (durationSeconds >= 1200) baseWeight *= 1.8;      // 20+ min = serious practice
        else if (durationSeconds >= 600) baseWeight *= 1.5;  // 10+ min = good session
        else if (durationSeconds >= 300) baseWeight *= 1.2;  // 5+ min = decent
        else if (durationSeconds < 60) baseWeight *= 0.5;    // < 1 min = quick check-in

        // Quality bonuses (if user completed well)
        if (completionScore >= 90) baseWeight *= 1.3;        // Excellent
        else if (completionScore >= 70) baseWeight *= 1.1;   // Good
        else if (completionScore < 30) baseWeight *= 0.7;    // Needs improvement

        // Cap at 3.0 to prevent gaming
        return Math.min(parseFloat(baseWeight.toFixed(2)), 3.0);
    }

    /**
     * Calculate XP earned from activity
     * XP = weight × streak multiplier
     */
    static calculateXP(weight, currentStreak) {
        const baseXP = weight * 10; // 1.0 weight = 10 XP
        const streakBonus = Math.min(currentStreak * 0.1, 2.0); // Max 2x bonus at 20 day streak
        return Math.floor(baseXP * (1 + streakBonus));
    }

    /**
     * Get user's timezone from profile
     */
    static async getUserTimezone(userId) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('timezone')
                .eq('id', userId)
                .single();

            if (error) {
                console.warn('[ActivityLogger] Could not fetch timezone, using default');
                return 'Asia/Kolkata';
            }

            return data?.timezone || 'Asia/Kolkata';
        } catch (error) {
            console.warn('[ActivityLogger] Timezone fetch error:', error);
            return 'Asia/Kolkata';
        }
    }

    /**
     * Store activity in database (privacy-safe - no sensitive content!)
     */
    static async storeActivity(data) {
        try {
            const { error } = await supabase
                .from('activity_log')
                .insert({
                    user_id: data.userId,
                    activity_type: data.sessionType,
                    duration_seconds: data.durationSeconds,
                    activity_weight: data.weight,
                    xp_earned: data.xpEarned,
                    created_at: data.timestamp
                });

            if (error) throw error;
        } catch (error) {
            // If activity_log table doesn't exist yet, create it
            if (error.code === '42P01') {
                await this.createActivityLogTable();
                // Retry insert
                await this.storeActivity(data);
            } else {
                console.error('[ActivityLogger] Error storing activity:', error);
                throw error;
            }
        }
    }

    /**
     * Create activity_log table if it doesn't exist
     */
    static async createActivityLogTable() {
        const { error } = await supabase.rpc('exec_sql', {
            sql: `
        CREATE TABLE IF NOT EXISTS activity_log (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
          activity_type TEXT NOT NULL,
          duration_seconds INTEGER,
          activity_weight REAL,
          xp_earned INTEGER,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log(user_id);
        CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at);
      `
        });

        if (error) {
            console.error('[ActivityLogger] Error creating activity_log table:', error);
        }
    }

    /**
     * Award milestone achievement
     */
    static async awardMilestone(userId, milestone) {
        try {
            // Find achievement by name
            const { data: achievement, error: findError } = await supabase
                .from('achievements')
                .select('id')
                .eq('name', milestone.title)
                .single();

            if (findError || !achievement) {
                console.warn('[ActivityLogger] Achievement not found:', milestone.title);
                return;
            }

            // Award achievement to user
            const { error: awardError } = await supabase
                .from('user_achievements')
                .insert({
                    user_id: userId,
                    achievement_id: achievement.id,
                    unlocked_at: new Date().toISOString()
                })
                .onConflict('user_id, achievement_id')
                .ignore();

            if (awardError) {
                console.error('[ActivityLogger] Error awarding achievement:', awardError);
                return;
            }

            // Award the reward (e.g., streak shield)
            if (milestone.reward === 'streak_shield') {
                await supabase.rpc('award_streak_shield', {
                    p_user_id: userId,
                    p_quantity: 1
                });
            }

            console.log(`[ActivityLogger] Milestone awarded: ${milestone.title} to user ${userId}`);
        } catch (error) {
            console.error('[ActivityLogger] Error in awardMilestone:', error);
        }
    }

    /**
     * Get user's activity summary
     */
    static async getActivitySummary(userId, days = 30) {
        try {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            const { data, error } = await supabase
                .from('activity_log')
                .select('*')
                .eq('user_id', userId)
                .gte('created_at', startDate.toISOString())
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Calculate summary stats
            const summary = {
                totalActivities: data.length,
                totalDuration: data.reduce((sum, a) => sum + (a.duration_seconds || 0), 0),
                totalXP: data.reduce((sum, a) => sum + (a.xp_earned || 0), 0),
                averageWeight: data.length > 0
                    ? data.reduce((sum, a) => sum + (a.activity_weight || 0), 0) / data.length
                    : 0,
                activityByType: this.groupByType(data),
                activityByDay: this.groupByDay(data)
            };

            return summary;
        } catch (error) {
            console.error('[ActivityLogger] Error getting activity summary:', error);
            throw error;
        }
    }

    /**
     * Group activities by type
     */
    static groupByType(activities) {
        return activities.reduce((acc, activity) => {
            const type = activity.activity_type;
            if (!acc[type]) {
                acc[type] = { count: 0, totalDuration: 0, totalXP: 0 };
            }
            acc[type].count++;
            acc[type].totalDuration += activity.duration_seconds || 0;
            acc[type].totalXP += activity.xp_earned || 0;
            return acc;
        }, {});
    }

    /**
     * Group activities by day
     */
    static groupByDay(activities) {
        return activities.reduce((acc, activity) => {
            const day = new Date(activity.created_at).toISOString().split('T')[0];
            if (!acc[day]) {
                acc[day] = { count: 0, totalDuration: 0, totalXP: 0 };
            }
            acc[day].count++;
            acc[day].totalDuration += activity.duration_seconds || 0;
            acc[day].totalXP += activity.xp_earned || 0;
            return acc;
        }, {});
    }
}

export default ActivityLogger;
