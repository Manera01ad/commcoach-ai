import express from 'express';
import { handleChat } from '../controllers/agentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply Auth Middleware
router.use(authenticateToken());

// Chat Endpoint
router.post('/chat', handleChat);

export default router;
