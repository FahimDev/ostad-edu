import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express. Router();

// Public routes (no authentication required)
router.post('/login', authController.login);

// Protected routes (authentication required)
// The authenticate middleware runs BEFORE the controller
router.get('/profile', authenticate, authController.getProfile);
router.get('/dashboard', authenticate, authController.getDashboard);

export default router;