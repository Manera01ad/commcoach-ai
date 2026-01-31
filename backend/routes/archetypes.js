import express from 'express';
import ArchetypeProgressionService from '../services/ArchetypeProgressionService.js';
import ArchetypeService from '../services/ArchetypeService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/archetypes
 * List all archetypes with tier information
 */
router.get('/', (req, res) => {
    try {
        const archetypes = Object.entries(ArchetypeService.archetypes).map(([id, data]) => ({
            id,
            ...data
        }));

        res.json({
            success: true,
            archetypes
        });
    } catch (error) {
        console.error('[Archetypes API] Error listing archetypes:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch archetypes'
        });
    }
});

/**
 * GET /api/archetypes/progress
 * Get user's archetype progression tree
 */
router.get('/progress', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await ArchetypeProgressionService.getProgressTree(userId);

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.json(result);
    } catch (error) {
        console.error('[Archetypes API] Error fetching progress:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch progression data'
        });
    }
});

/**
 * GET /api/archetypes/stats
 * Get user's archetype statistics
 */
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await ArchetypeProgressionService.getStats(userId);

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.json(result);
    } catch (error) {
        console.error('[Archetypes API] Error fetching stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch archetype stats'
        });
    }
});

/**
 * POST /api/archetypes/switch
 * Switch to a different unlocked archetype
 */
router.post('/switch', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { archetype } = req.body;

        if (!archetype) {
            return res.status(400).json({
                success: false,
                error: 'Archetype ID is required'
            });
        }

        const result = await ArchetypeProgressionService.switchArchetype(userId, archetype);

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.json(result);
    } catch (error) {
        console.error('[Archetypes API] Error switching archetype:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to switch archetype'
        });
    }
});

/**
 * POST /api/archetypes/track-session
 * Track a session for archetype progression (internal use)
 */
router.post('/track-session', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { archetype, sessionId, qualityScore } = req.body;

        if (!archetype) {
            return res.status(400).json({
                success: false,
                error: 'Archetype ID is required'
            });
        }

        const result = await ArchetypeProgressionService.trackSession(
            userId,
            archetype,
            sessionId,
            qualityScore
        );

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.json(result);
    } catch (error) {
        console.error('[Archetypes API] Error tracking session:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to track session'
        });
    }
});

/**
 * GET /api/archetypes/unlock-check
 * Check if any new archetypes can be unlocked
 */
router.get('/unlock-check', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await ArchetypeProgressionService.checkUnlocks(userId);

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.json(result);
    } catch (error) {
        console.error('[Archetypes API] Error checking unlocks:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to check unlocks'
        });
    }
});

export default router;
