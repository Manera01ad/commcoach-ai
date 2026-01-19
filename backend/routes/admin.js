import express from 'express';
import { getPendingList, approveUser, rejectUser } from '../controllers/adminController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all admin routes
// First verify token (authenticateToken), then check admin role (requireAdmin)
router.use(authenticateToken());
router.use(requireAdmin);

router.get('/pending', getPendingList);
router.post('/approve/:id', approveUser);
router.post('/reject/:id', rejectUser);

export default router;
