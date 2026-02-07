import express from 'express';
import intelligentRouter from '../services/ai/IntelligentAIRouter.js';
import { strictLimiter, defaultLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * POST /api/ai/generate
 * Universal AI generation endpoint with automatic failover
 * Priority: Gemini (free) → Ollama (free) → OpenRouter (paid)
 */
router.post('/generate', strictLimiter, async (req, res) => {
    try {
        const { prompt, config = {} } = req.body;

        if (!prompt) {
            return res.status(400).json({
                error: 'Prompt is required',
                message: 'Please provide a prompt in the request body'
            });
        }

        // This will ALWAYS return a result (tries all providers)
        const result = await intelligentRouter.generateContent(prompt, config);

        res.json({
            success: true,
            text: result.text,
            provider: result.provider,
            fallbackUsed: result.fallbackUsed,
            attemptedProviders: result.attemptedProviders,
            model: result.model,
            cost: result.cost || 0,
            usage: result.usage
        });

    } catch (error) {
        // This should be extremely rare (all providers failed)
        console.error('[AI API] All providers failed:', error);

        res.status(503).json({
            error: 'Service temporarily unavailable',
            message: 'All AI providers are currently unavailable. Please try again in a moment.',
            retryAfter: 60
        });
    }
});

/**
 * POST /api/ai/structured
 * Generate structured JSON output with automatic failover
 */
router.post('/structured', strictLimiter, async (req, res) => {
    try {
        const { prompt, schema, config = {} } = req.body;

        if (!prompt || !schema) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'Both prompt and schema are required'
            });
        }

        const result = await intelligentRouter.generateStructuredContent(
            prompt,
            schema,
            config
        );

        res.json({
            success: true,
            data: result,
            provider: result.provider || 'unknown'
        });

    } catch (error) {
        console.error('[AI API] Structured generation failed:', error);

        res.status(500).json({
            error: 'Structured generation failed',
            ...(process.env.NODE_ENV === 'development' && { message: error.message })
        });
    }
});

/**
 * GET /api/ai/status
 * Get router status, provider health, and usage statistics
 */
router.get('/status', defaultLimiter, (req, res) => {
    try {
        const status = intelligentRouter.getStatus();

        res.json({
            success: true,
            status: 'operational',
            ...status,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to get status',
            ...(process.env.NODE_ENV === 'development' && { message: error.message })
        });
    }
});

/**
 * GET /api/ai/providers
 * List available providers and their configuration
 */
router.get('/providers', defaultLimiter, async (req, res) => {
    try {
        const providers = {
            tier1: {
                name: 'Gemini',
                cost: 'FREE',
                limits: '15 req/min, 1500 req/day',
                models: ['gemini-2.0-flash-exp', 'gemini-1.5-pro'],
                available: !!process.env.GEMINI_API_KEY
            },
            tier2: {
                name: 'Ollama',
                cost: 'FREE (self-hosted)',
                limits: 'Unlimited',
                models: ['llama3', 'mistral', 'codellama'],
                available: false // Will be checked dynamically
            },
            tier3: {
                name: 'OpenRouter',
                cost: 'PAID (~$2.50/10K requests)',
                limits: 'Unlimited',
                models: ['anthropic/claude-3-haiku', 'openai/gpt-4o-mini'],
                available: !!process.env.OPENROUTER_API_KEY
            }
        };

        // Check Ollama availability
        const ollamaService = (await import('../services/ai/OllamaService.js')).default;
        providers.tier2.available = await ollamaService.isAvailable();

        res.json({
            success: true,
            providers,
            priority: ['tier1', 'tier2', 'tier3'],
            description: 'Automatic failover: Gemini → Ollama → OpenRouter'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to get providers',
            ...(process.env.NODE_ENV === 'development' && { message: error.message })
        });
    }
});

/**
 * GET /api/ai/costs
 * Get cost tracking and usage statistics
 */
router.get('/costs', defaultLimiter, (req, res) => {
    try {
        const status = intelligentRouter.getStatus();
        const costs = status.costs;

        // Calculate totals
        const totalRequests = Object.values(costs).reduce((sum, p) => sum + p.requests, 0);
        const totalCost = Object.values(costs).reduce((sum, p) => sum + p.cost, 0);

        res.json({
            success: true,
            breakdown: costs,
            totals: {
                requests: totalRequests,
                cost: totalCost,
                costPerRequest: totalRequests > 0 ? totalCost / totalRequests : 0
            },
            period: 'since server start',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to get costs',
            ...(process.env.NODE_ENV === 'development' && { message: error.message })
        });
    }
});

/**
 * POST /api/ai/reset
 * Reset tracking (for testing/debugging)
 */
router.post('/reset', (req, res) => {
    try {
        intelligentRouter.reset();

        res.json({
            success: true,
            message: 'Router tracking reset successfully'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to reset',
            ...(process.env.NODE_ENV === 'development' && { message: error.message })
        });
    }
});

export default router;
