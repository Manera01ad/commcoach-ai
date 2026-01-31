import express from 'express';
import ArchetypeService from '../services/ArchetypeService.js';
import ArchetypeProgressionService from '../services/ArchetypeProgressionService.js';
import TherapySafetyService from '../services/TherapySafetyService.js';
import { strictLimiter } from '../middleware/rateLimiter.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';
import SessionRepository from '../repositories/SessionRepository.js';

const router = express.Router();

/**
 * POST /api/therapy/analyze
 * Analyzes communication archetype and returns therapy advice
 */
router.post('/analyze', authenticateToken(), validate(schemas.therapyAnalyze), strictLimiter, async (req, res) => {
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

        // 5. Log Session (Background)
        const sessionLog = await SessionRepository.logTherapySession({
            userId: req.user?.id,
            message,
            archetype: analysis.identified_archetype,
            confidence: analysis.confidence_score,
            response: safetyCheck.approved_response,
            safety: {
                safe: safetyCheck.safe,
                risk_level: safetyCheck.risk_level
            },
            evidence: analysis.evidence,
            history: history || []
        }).catch(err => {
            console.error('Background Logging Error:', err);
            return null;
        });

        // 6. Track Archetype Progression (NEW!)
        let archetypeProgress = null;
        if (req.user?.id && analysis.identified_archetype) {
            try {
                // Calculate quality score based on confidence and safety
                const qualityScore = Math.min(100,
                    (analysis.confidence_score * 0.7) +
                    (safetyCheck.safe ? 30 : 0)
                );

                // Track the session for archetype progression
                const progressResult = await ArchetypeProgressionService.trackSession(
                    req.user.id,
                    analysis.identified_archetype,
                    sessionLog?.id || null,
                    qualityScore
                );

                if (progressResult.success) {
                    archetypeProgress = {
                        sessionsCompleted: progressResult.sessionData?.sessions_completed,
                        isMastered: progressResult.sessionData?.is_mastered,
                        newlyUnlocked: progressResult.newlyUnlocked || []
                    };

                    // Log unlock achievements
                    if (progressResult.newlyUnlocked?.length > 0) {
                        console.log(`🎉 User ${req.user.id} unlocked:`, progressResult.newlyUnlocked);
                    }
                }
            } catch (err) {
                console.error('Archetype Progression Error:', err);
                // Don't fail the request if progression tracking fails
            }
        }

        // 7. Return Final Result
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
            timestamp: new Date().toISOString(),
            // Include archetype progression data
            progression: archetypeProgress
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
