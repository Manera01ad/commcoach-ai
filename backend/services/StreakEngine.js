/**
 * 🔥 Confidential Streak Engine
 * 
 * Privacy-First Gamification System
 * - Zero-knowledge: Only tracks THAT activity occurred, not WHAT was said
 * - Smart Logic: Weighted streaks, forgiveness windows, streak shields
 * - Enterprise-Ready: All data stays in YOUR Supabase
 * 
 * @author CommCoach AI Team
 * @version 1.0.0
 */

import supabase from '../config/supabase.js';

class ConfidentialStreakEngine {
    constructor() {
        this.db = supabase;
    }

    /**
     * Process user activity and update streak
     * @param {string} userId - User UUID
     * @param {string} userTimezone - User's timezone (default: Asia/Kolkata)
     * @param {number} activityWeight - Activity weight (1 = normal, 2 = extended session)
     * @returns {Promise<Object>} Streak status and message
     */
    async processActivity(userId, userTimezone = 'Asia/Kolkata', activityWeight = 1) {
        try {
            // 1. Fetch current user streak data from secure DB
            const userState = await this.getStreakData(userId);

            // 2. Calculate dates in user's timezone
            const nowLocal = this.getLocalDate(userTimezone);
            const lastActiveLocal = userState.last_activity_date
                ? new Date(userState.last_activity_date)
                : null;

            // 3. The Streak Logic
            if (lastActiveLocal && this.isSameDay(lastActiveLocal, nowLocal)) {
                // Already logged today - just add activity weight
                await this.addActivityPoints(userId, activityWeight);

                return {
                    status: 'already_logged',
                    message: "Great work! You've already extended your streak today.",
                    streak: userState.streak_days,
                    totalPoints: userState.total_activity_points + activityWeight,
                    emoji: '✅'
                };
            }

            if (lastActiveLocal && this.isConsecutiveDay(lastActiveLocal, nowLocal)) {
                // Consecutive day! Extend streak
                const newStreak = userState.streak_days + 1;
                await this.updateStreak(userId, newStreak, nowLocal, activityWeight);

                // Check for milestone achievements
                const milestone = this.checkMilestone(newStreak);

                return {
                    status: 'extended',
                    message: `🔥 Streak Extended! You are now on Day ${newStreak}!`,
                    streak: newStreak,
                    milestone: milestone,
                    emoji: '🔥'
                };
            }

            // Streak might be broken - check for Streak Shield
            if (await this.hasStreakShield(userId)) {
                await this.consumeStreakShield(userId);
                await this.updateLastActive(userId, nowLocal, activityWeight);

                return {
                    status: 'saved',
                    message: '❄️ Streak Shield Used! Streak saved.',
                    streak: userState.streak_days,
                    emoji: '🛡️'
                };
            }

            // Forgiveness Window: Check if activity was late night (12:00 AM - 3:00 AM)
            if (lastActiveLocal && this.isInForgivenessWindow(nowLocal)) {
                const yesterday = new Date(nowLocal);
                yesterday.setDate(yesterday.getDate() - 1);

                if (this.isConsecutiveDay(lastActiveLocal, yesterday)) {
                    // Count it for yesterday to save streak
                    const newStreak = userState.streak_days + 1;
                    await this.updateStreak(userId, newStreak, yesterday, activityWeight);

                    return {
                        status: 'forgiven',
                        message: `🌙 Late night session counted! Day ${newStreak} streak maintained.`,
                        streak: newStreak,
                        emoji: '🌙'
                    };
                }
            }

            // Streak broken - reset to Day 1
            await this.updateStreak(userId, 1, nowLocal, activityWeight);

            return {
                status: 'reset',
                message: 'Streak reset. Day 1 starts now. Let\'s build it back!',
                streak: 1,
                previousBest: userState.longest_streak,
                emoji: '🔄'
            };

        } catch (error) {
            console.error('[StreakEngine] Error processing activity:', error);
            throw error;
        }
    }

    /**
     * Get user's current streak data
     */
    async getStreakData(userId) {
        const { data, error } = await this.db
            .from('user_progress')
            .select('streak_days, last_activity_date, longest_streak, total_activity_points')
            .eq('user_id', userId)
            .single();

        if (error) {
            // User doesn't have progress record yet - create one
            if (error.code === 'PGRST116') {
                await this.initializeUserProgress(userId);
                return {
                    streak_days: 0,
                    last_activity_date: null,
                    longest_streak: 0,
                    total_activity_points: 0
                };
            }
            throw error;
        }

        return {
            streak_days: data.streak_days || 0,
            last_activity_date: data.last_activity_at,
            longest_streak: data.longest_streak || 0,
            total_activity_points: data.total_activity_points || 0
        };
    }

    /**
     * Initialize user progress record
     */
    async initializeUserProgress(userId) {
        const { error } = await this.db
            .from('user_progress')
            .insert({
                user_id: userId,
                streak_days: 0,
                longest_streak: 0,
                total_activity_points: 0,
                last_activity_at: null
            });

        if (error) throw error;
    }

    /**
     * Update user's streak
     */
    async updateStreak(userId, newStreak, date, activityWeight = 1) {
        // Get current longest streak
        const { data: current } = await this.db
            .from('user_progress')
            .select('longest_streak')
            .eq('user_id', userId)
            .single();

        const longestStreak = Math.max(current?.longest_streak || 0, newStreak);

        const { error } = await this.db
            .from('user_progress')
            .update({
                streak_days: newStreak,
                last_activity_at: date.toISOString(),
                longest_streak: longestStreak,
                total_activity_points: this.db.raw(`total_activity_points + ${activityWeight}`),
                updated_at: new Date().toISOString()
            })
            .eq('user_id', userId);

        if (error) throw error;

        // Log the streak event
        await this.logStreakEvent(userId, 'streak_updated', {
            new_streak: newStreak,
            activity_weight: activityWeight
        });
    }

    /**
     * Update only last active date (for shield usage)
     */
    async updateLastActive(userId, date, activityWeight = 1) {
        const { error } = await this.db
            .from('user_progress')
            .update({
                last_activity_at: date.toISOString(),
                total_activity_points: this.db.raw(`total_activity_points + ${activityWeight}`),
                updated_at: new Date().toISOString()
            })
            .eq('user_id', userId);

        if (error) throw error;
    }

    /**
     * Add activity points without changing streak
     */
    async addActivityPoints(userId, points) {
        const { error } = await this.db
            .from('user_progress')
            .update({
                total_activity_points: this.db.raw(`total_activity_points + ${points}`),
                updated_at: new Date().toISOString()
            })
            .eq('user_id', userId);

        if (error) throw error;
    }

    /**
     * Check if user has a streak shield
     */
    async hasStreakShield(userId) {
        // Check user's inventory for streak shield
        const { data, error } = await this.db
            .from('user_inventory')
            .select('quantity')
            .eq('user_id', userId)
            .eq('item_type', 'streak_shield')
            .single();

        if (error || !data) return false;
        return data.quantity > 0;
    }

    /**
     * Consume a streak shield
     */
    async consumeStreakShield(userId) {
        const { error } = await this.db
            .from('user_inventory')
            .update({
                quantity: this.db.raw('quantity - 1'),
                updated_at: new Date().toISOString()
            })
            .eq('user_id', userId)
            .eq('item_type', 'streak_shield');

        if (error) throw error;

        await this.logStreakEvent(userId, 'shield_used', {});
    }

    /**
     * Log streak event for analytics
     */
    async logStreakEvent(userId, eventType, metadata) {
        await this.db
            .from('streak_events')
            .insert({
                user_id: userId,
                event_type: eventType,
                metadata: metadata,
                created_at: new Date().toISOString()
            });
    }

    /**
     * Get local date in user's timezone
     */
    getLocalDate(timezone) {
        return new Date(new Date().toLocaleString('en-US', { timeZone: timezone }));
    }

    /**
     * Check if two dates are the same day
     */
    isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    }

    /**
     * Check if date2 is the day after date1
     */
    isConsecutiveDay(date1, date2) {
        const nextDay = new Date(date1);
        nextDay.setDate(nextDay.getDate() + 1);
        return this.isSameDay(nextDay, date2);
    }

    /**
     * Check if current time is in forgiveness window (12 AM - 3 AM)
     */
    isInForgivenessWindow(date) {
        const hours = date.getHours();
        return hours >= 0 && hours < 3;
    }

    /**
     * Check for milestone achievements
     */
    checkMilestone(streak) {
        const milestones = {
            7: { title: 'Week Warrior', reward: 'streak_shield' },
            30: { title: 'Monthly Master', reward: 'premium_voice' },
            100: { title: 'Century Champion', reward: 'lifetime_pro' },
            365: { title: 'Year Legend', reward: 'hall_of_fame' }
        };

        return milestones[streak] || null;
    }

    /**
     * Get user's streak statistics
     */
    async getStreakStats(userId) {
        const { data, error } = await this.db
            .from('user_progress')
            .select('streak_days, longest_streak, total_activity_points, last_activity_at')
            .eq('user_id', userId)
            .single();

        if (error) throw error;

        return {
            currentStreak: data.streak_days || 0,
            longestStreak: data.longest_streak || 0,
            totalPoints: data.total_activity_points || 0,
            lastActive: data.last_activity_at,
            nextMilestone: this.getNextMilestone(data.streak_days || 0)
        };
    }

    /**
     * Get next milestone
     */
    getNextMilestone(currentStreak) {
        const milestones = [7, 30, 100, 365];
        return milestones.find(m => m > currentStreak) || null;
    }
}

export default new ConfidentialStreakEngine();
