/**
 * Personas API Routes
 */

import express from 'express';
import PersonaEngine from '../services/PersonaEngine.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken());

/**
 * GET /api/personas
 * Get all available personas
 */
router.get('/', async (req, res) => {
    try {
        const result = await PersonaEngine.getAllPersonas();
        res.json(result);
    } catch (error) {
        console.error('[Personas API] Error getting personas:', error);
        res.status(500).json({ error: 'Failed to get personas' });
    }
});

/**
 * GET /api/personas/preferred
 * Get user's preferred persona
 */
router.get('/preferred', async (req, res) => {
    try {
        const userId = req.user.id;
        const persona = await PersonaEngine.getUserPreferredPersona(userId);
        res.json({ success: true, persona });
    } catch (error) {
        console.error('[Personas API] Error getting preferred persona:', error);
        res.status(500).json({ error: 'Failed to get preferred persona' });
    }
});

/**
 * POST /api/personas/preferred
 * Set user's preferred persona
 */
router.post('/preferred', async (req, res) => {
    try {
        const userId = req.user.id;
        const { personaId } = req.body;

        const result = await PersonaEngine.setUserPreferredPersona(userId, personaId);
        res.json(result);
    } catch (error) {
        console.error('[Personas API] Error setting preferred persona:', error);
        res.status(500).json({ error: 'Failed to set preferred persona' });
    }
});

/**
 * GET /api/personas/:archetype
 * Get persona by archetype
 */
router.get('/:archetype', async (req, res) => {
    try {
        const { archetype } = req.params;
        const persona = await PersonaEngine.getPersona(archetype);

        if (!persona) {
            return res.status(404).json({ error: 'Persona not found' });
        }

        res.json({ success: true, persona });
    } catch (error) {
        console.error('[Personas API] Error getting persona:', error);
        res.status(500).json({ error: 'Failed to get persona' });
    }
});

/**
 * GET /api/personas/:id/stats
 * Get persona statistics
 */
router.get('/:id/stats', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await PersonaEngine.getPersonaStats(id);
        res.json(result);
    } catch (error) {
        console.error('[Personas API] Error getting persona stats:', error);
        res.status(500).json({ error: 'Failed to get persona stats' });
    }
});

export default router;
