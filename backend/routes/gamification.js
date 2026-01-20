import express from 'express';
import GamificationService from '../services/GamificationService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user progress (XP, Level)
router.get('/progress', authenticateToken, async (req, res) => {
    try {
        const progress = await GamificationService.getProgress(req.user.id);
        res.json(progress);
    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({ error: 'Failed to fetch progress' });
    }
});

// Award XP (Admin or internal only - or for testing)
// In production, this should likely be restricted or called internally by other services
router.post('/award', authenticateToken, async (req, res) => {
    try {
        const { amount, reason } = req.body;
        const result = await GamificationService.awardXP(req.user.id, amount, reason);
        res.json(result);
    } catch (error) {
        console.error('Error awarding XP:', error);
        res.status(500).json({ error: 'Failed to award XP' });
    }
});

export default router;
