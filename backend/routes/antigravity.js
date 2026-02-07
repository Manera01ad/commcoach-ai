import express from 'express';
import geminiService from '../services/geminiService.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';

const router = express.Router();

/**
 * POST /api/antigravity/analyze-session
 * Analyze communication transcript and return structured insights
 */
router.post('/analyze-session', authenticateToken(), validate(schemas.antigravityAnalyze), async (req, res) => {
    try {
        const { transcript, userId, timestamp } = req.body;

        // Validated by Zod middleware: transcript is required, userId is optional/injected


        // Analysis logic continues...
        // Sentry captures performance automatically via tracingHandler

        // Call Gemini service for analysis
        const analysis = await geminiService.analyzeTranscript(transcript, userId);

        // Add metadata
        const response = {
            ...analysis,
            analyzedAt: new Date().toISOString(),
            userId,
            transcriptLength: transcript.length
        };

        // Analysis complete

        res.json(response);

    } catch (error) {
        console.error('[Antigravity] Analysis error:', error);

        res.status(500).json({
            error: 'Analysis failed',
            ...(process.env.NODE_ENV === 'development' && { message: error.message, details: error.stack })
        });
    }
});

// Test endpoint - only available in development
if (process.env.NODE_ENV !== 'production') {
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
}

export default router;
