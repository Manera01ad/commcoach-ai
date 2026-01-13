import express from 'express';
import geminiService from '../services/geminiService.js';

const router = express.Router();

/**
 * POST /api/antigravity/analyze-session
 * Analyze communication transcript and return structured insights
 */
router.post('/analyze-session', async (req, res) => {
    try {
        const { transcript, userId, timestamp } = req.body;

        // Validation
        if (!transcript || typeof transcript !== 'string') {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'Transcript is required and must be a string'
            });
        }

        if (!userId) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'userId is required'
            });
        }

        console.log(`[Antigravity] Analyzing session for user: ${userId}`);
        console.log(`[Antigravity] Transcript length: ${transcript.length} characters`);

        // Call Gemini service for analysis
        const analysis = await geminiService.analyzeTranscript(transcript, userId);

        // Add metadata
        const response = {
            ...analysis,
            analyzedAt: new Date().toISOString(),
            userId,
            transcriptLength: transcript.length
        };

        console.log(`[Antigravity] Analysis complete for user: ${userId}`);

        res.json(response);

    } catch (error) {
        console.error('[Antigravity] Analysis error:', error);

        res.status(500).json({
            error: 'Analysis failed',
            message: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

/**
 * GET /api/antigravity/test
 * Test endpoint to verify Antigravity route is working
 */
router.get('/test', (req, res) => {
    res.json({
        status: 'ok',
        service: 'Antigravity Analysis Engine',
        version: '1.0.0',
        endpoints: {
            analyzeSession: 'POST /api/antigravity/analyze-session'
        }
    });
});

export default router;
