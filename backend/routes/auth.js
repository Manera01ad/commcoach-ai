import express from 'express';
import { signup, signin, signout, getSession } from '../controllers/authController.js';

const router = express.Router();

// Public Routes
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', signout);

// Protected Routes (Logic handled in controller/middleware)
router.get('/me', getSession);

export default router;
