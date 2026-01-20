import { supabase, supabaseAdmin } from '../config/supabase.js';

class GamificationService {
    /**
     * Calculate XP required for next level
     * Formula: Base * (Level ^ 1.5)
     */
    calculateNextLevelXP(level) {
        return Math.floor(1000 * Math.pow(level, 1.5));
    }

    /**
     * Award XP to a user
     * @param {string} userId
     * @param {number} amount
     * @param {string} reason
     */
    async awardXP(userId, amount, reason) {
        try {
            // 1. Get current stats
            const { data: profile, error: fetchError } = await supabaseAdmin
                .from('user_progress')
                .select('current_xp, level')
                .eq('user_id', userId)
                .single();

            if (fetchError) throw fetchError;

            let { current_xp, level } = profile;
            current_xp += amount;

            // 2. Check for level up
            let leveledUp = false;
            let nextLevelXP = this.calculateNextLevelXP(level);

            while (current_xp >= nextLevelXP) {
                current_xp -= nextLevelXP;
                level++;
                nextLevelXP = this.calculateNextLevelXP(level);
                leveledUp = true;
            }

            // 3. Update DB
            const { error: updateError } = await supabaseAdmin
                .from('user_progress')
                .update({
                    current_xp,
                    level,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', userId);

            if (updateError) throw updateError;

            // 4. Log transaction
            await supabaseAdmin.from('xp_ledger').insert({
                user_id: userId,
                amount,
                reason,
                created_at: new Date().toISOString()
            });

            return {
                newLevel: level,
                newXP: current_xp,
                leveledUp
            };

        } catch (error) {
            console.error('[GamificationService] Award XP failed:', error);
            throw error;
        }
    }

    /**
     * Get user progress
     */
    async getProgress(userId) {
        const { data, error } = await supabaseAdmin
            .from('user_progress')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) throw error;

        return {
            ...data,
            nextLevelXP: this.calculateNextLevelXP(data.level)
        };
    }
}

export default new GamificationService();
