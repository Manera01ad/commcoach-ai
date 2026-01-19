import express from 'express';
import { getPendingList, approveUser, rejectUser } from '../controllers/adminController.js';

const router = express.Router();

// Middleware placeholder (TODO: Implement requireAdmin middleware)
const requireAdmin = (req, res, next) => {
    // Temporary pass-through until middleware is built
    // In production, verify req.headers.authorization and check database for admin flag
    next();
};

router.get('/pending', requireAdmin, getPendingList);
router.post('/approve/:id', requireAdmin, approveUser);
router.post('/reject/:id', requireAdmin, rejectUser);

export default router;
