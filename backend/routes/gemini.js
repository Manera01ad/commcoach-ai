import express from 'express';
import geminiService from '../services/geminiService.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';
import SessionRepository from '../repositories/SessionRepository.js';

const router = express.Router();

/**
 * POST /api/gemini/generate
 * Proxy endpoint for Gemini API calls (keeps API key server-side)
 */
router.post('/generate', authenticateToken(), validate(schemas.geminiGenerate), async (req, res) => {
    try {
        const { model, prompt, config } = req.body;

        // Validation
        if (!model || !prompt) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'Both model and prompt are required'
            });
        }

        console.log(`[Gemini] Generating content with model: ${model}`);

        // Generate content
        const result = await geminiService.generateContent(model, prompt, config);

        res.json(result);

    } catch (error) {
        console.error('[Gemini] Generation error:', error);

        res.status(500).json({
            error: 'Generation failed',
            ...(process.env.NODE_ENV === 'development' && { message: error.message })
        });
    }
});

/**
 * POST /api/gemini/structured
 * Generate structured JSON output
 */
router.post('/structured', authenticateToken(), async (req, res) => {
    try {
        const { model, prompt, schema } = req.body;

        if (!model || !prompt || !schema) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'model, prompt, and schema are required'
            });
        }

        console.log(`[Gemini] Generating structured content with model: ${model}`);

        const result = await geminiService.generateStructuredContent(model, prompt, schema);

        res.json(result);

    } catch (error) {
        console.error('[Gemini] Structured generation error:', error);

        res.status(500).json({
            error: 'Structured generation failed',
            ...(process.env.NODE_ENV === 'development' && { message: error.message })
        });
    }
});

/**
 * GET /api/gemini/models
 * List available Gemini models
 */
router.get('/models', (req, res) => {
    res.json({
        available: [
            'gemini-2.0-flash-exp',
            'gemini-2.0-flash-thinking-exp-01-21',
            'gemini-1.5-pro',
            'gemini-1.5-flash'
        ],
        recommended: {
            chat: 'gemini-2.0-flash-exp',
            deepThinking: 'gemini-2.0-flash-thinking-exp-01-21',
            structured: 'gemini-2.0-flash-exp'
        }
    });
});

export default router;
