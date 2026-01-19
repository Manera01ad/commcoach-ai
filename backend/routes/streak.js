/**
 * Streak Engine API Routes
 * Privacy-first gamification endpoints
 */

import express from 'express';
import StreakEngine from '../services/StreakEngine.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/streak/activity
 * Log user activity and update streak
 * 
 * Body:
 * - activityWeight: number (1 = normal, 2 = extended session)
 * - timezone: string (user's timezone, default: Asia/Kolkata)
 */
router.post('/activity', authenticate, async (req, res) => {
    try {
        const { activityWeight = 1, timezone = 'Asia/Kolkata' } = req.body;
        const userId = req.user.id;

        const result = await StreakEngine.processActivity(userId, timezone, activityWeight);

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('[Streak API] Error processing activity:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process activity'
        });
    }
});

/**
 * GET /api/streak/stats
 * Get user's streak statistics
 */
router.get('/stats', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const stats = await StreakEngine.getStreakStats(userId);

        res.json({
            success: true,
            stats
        });
    } catch (error) {
        console.error('[Streak API] Error getting stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get streak stats'
        });
    }
});

/**
 * GET /api/streak/leaderboard
 * Get streak leaderboard
 * 
 * Query:
 * - limit: number (default: 10)
 */
router.get('/leaderboard', authenticate, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const { data, error } = await supabase
            .rpc('get_streak_leaderboard', { p_limit: limit });

        if (error) throw error;

        res.json({
            success: true,
            leaderboard: data
        });
    } catch (error) {
        console.error('[Streak API] Error getting leaderboard:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get leaderboard'
        });
    }
});

/**
 * GET /api/streak/inventory
 * Get user's inventory (streak shields, power-ups)
 */
router.get('/inventory', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;

        const { data, error } = await supabase
            .from('user_inventory')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;

        res.json({
            success: true,
            inventory: data || []
        });
    } catch (error) {
        console.error('[Streak API] Error getting inventory:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get inventory'
        });
    }
});

/**
 * POST /api/streak/shield/use
 * Use a streak shield (admin/testing only - normally auto-used)
 */
router.post('/shield/use', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;

        const hasShield = await StreakEngine.hasStreakShield(userId);

        if (!hasShield) {
            return res.status(400).json({
                success: false,
                error: 'No streak shields available'
            });
        }

        await StreakEngine.consumeStreakShield(userId);

        res.json({
            success: true,
            message: 'Streak shield used successfully'
        });
    } catch (error) {
        console.error('[Streak API] Error using shield:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to use streak shield'
        });
    }
});

/**
 * GET /api/streak/history
 * Get user's streak event history
 * 
 * Query:
 * - limit: number (default: 50)
 */
router.get('/history', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const limit = parseInt(req.query.limit) || 50;

        const { data, error } = await supabase
            .from('streak_events')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;

        res.json({
            success: true,
            history: data || []
        });
    } catch (error) {
        console.error('[Streak API] Error getting history:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get streak history'
        });
    }
});

export default router;
