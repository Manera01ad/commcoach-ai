import express from 'express';
import AssessmentService from '../services/AssessmentService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Analyze assessment answers
router.post('/analyze', authenticateToken, async (req, res) => {
    try {
        const { answers } = req.body;

        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({ error: 'Invalid answers format' });
        }

        const result = await AssessmentService.analyzeDNA(answers, req.user.id);
        res.json(result);
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ error: 'Failed to analyze assessment' });
    }
});

export default router;
