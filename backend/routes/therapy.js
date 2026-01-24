import express from 'express';
import ArchetypeService from '../services/ArchetypeService.js';
import TherapySafetyService from '../services/TherapySafetyService.js';
import { strictLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * POST /api/therapy/analyze
 * Analyzes communication archetype and returns therapy advice
 */
router.post('/analyze', strictLimiter, async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // 1. Detect Archetype
        const analysis = await ArchetypeService.analyzeArchetype(message, history || []);

        // 2. Handle low confidence / clarification
        if (analysis.needs_clarification || analysis.confidence_score < 60) {
            return res.json({
                type: 'clarification',
                question: analysis.clarifying_question || "I'd like to understand more. Could you elaborate on what specifically triggered this reaction?",
                analysis
            });
        }

        // 3. Generate Therapy Response
        const therapyResponse = await ArchetypeService.generateTherapyResponse(
            analysis.identified_archetype,
            message
        );

        // 4. Verify Safety (CoVe)
        const userContext = `Archetype: ${analysis.identified_archetype}, Message: ${message}`;
        const safetyCheck = await TherapySafetyService.verifyTherapyAdvice(
            therapyResponse,
            userContext
        );

        // 5. Return Final Result
        res.json({
            type: 'therapy',
            archetype: analysis.identified_archetype,
            confidence: analysis.confidence_score,
            response: safetyCheck.approved_response,
            safety: {
                safe: safetyCheck.safe,
                risk_level: safetyCheck.risk_level
            },
            evidence: analysis.evidence,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Therapy Analysis Error:', error);
        res.status(500).json({
            error: 'Failed to analyze therapy request',
            details: error.message
        });
    }
});

export default router;
