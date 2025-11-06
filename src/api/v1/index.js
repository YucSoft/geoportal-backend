import { Router } from 'express';
import authRoutes from './auth.routes.js';
import layerRoutes from './layers.routes.js';

// Initialize main router
const router = Router();

// /api/v1/auth/...
router.use('/auth', authRoutes);

// /api/v1/layers/...
router.use('/layers', layerRoutes);

export default router;