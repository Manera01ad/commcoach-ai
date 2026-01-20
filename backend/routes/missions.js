/**
 * Daily Missions API Routes
 */

import express from 'express';
import DailyMissionService from '../services/DailyMissionService.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/missions/today
 * Get today's mission for the user
 */
router.get('/today', async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await DailyMissionService.getTodaysMission(userId);
        res.json(result);
    } catch (error) {
        console.error('[Missions API] Error getting today mission:', error);
        res.status(500).json({ error: 'Failed to get mission' });
    }
});

/**
 * POST /api/missions/:id/complete
 * Complete a mission
 */
router.post('/:id/complete', async (req, res) => {
    try {
        const userId = req.user.id;
        const missionId = req.params.id;
        const { score, durationSeconds, feedback } = req.body;

        const result = await DailyMissionService.completeMission(userId, missionId, {
            score,
            durationSeconds,
            feedback
        });

        res.json(result);
    } catch (error) {
        console.error('[Missions API] Error completing mission:', error);
        res.status(500).json({ error: 'Failed to complete mission' });
    }
});

/**
 * GET /api/missions/level
 * Get user's current level and XP
 */
router.get('/level', async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await DailyMissionService.getUserLevel(userId);
        res.json(result);
    } catch (error) {
        console.error('[Missions API] Error getting level:', error);
        res.status(500).json({ error: 'Failed to get level' });
    }
});

/**
 * GET /api/missions/history
 * Get mission history
 */
router.get('/history', async (req, res) => {
    try {
        const userId = req.user.id;
        const limit = parseInt(req.query.limit) || 30;
        const result = await DailyMissionService.getMissionHistory(userId, limit);
        res.json(result);
    } catch (error) {
        console.error('[Missions API] Error getting history:', error);
        res.status(500).json({ error: 'Failed to get history' });
    }
});

/**
 * GET /api/missions/stats
 * Get completion statistics
 */
router.get('/stats', async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await DailyMissionService.getCompletionStats(userId);
        res.json(result);
    } catch (error) {
        console.error('[Missions API] Error getting stats:', error);
        res.status(500).json({ error: 'Failed to get stats' });
    }
});

export default router;
