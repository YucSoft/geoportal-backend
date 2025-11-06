import { Router } from 'express';
import { login } from '../../controllers/auth.controller.js';
import { loginLimiter } from '../../config/rateLimit.config.js';
import asyncHandler from '../../utils/asyncHandler.js';

// Initialize router
const router = Router();

// Login route with rate limiting and async error handling
router.post('/login', loginLimiter, asyncHandler(login));

export default router;