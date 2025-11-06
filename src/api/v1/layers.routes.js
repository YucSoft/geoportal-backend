import { Router } from 'express';
import { getCatalog } from '../../controllers/layers.controller.js';
import { apiLimiter } from '../../config/rateLimit.config.js';
import { checkJwt } from '../../middlewares/auth.middleware.js';
import asyncHandler from '../../utils/asyncHandler.js';

// Initialize router
const router = Router();

// GET /api/v1/layers/catalog
router.get('/catalog', apiLimiter, checkJwt, asyncHandler(getCatalog));

export default router;