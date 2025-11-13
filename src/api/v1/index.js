import { Router } from 'express';
import authRoutes from './auth.routes.js';
import layerRoutes from './layers.routes.js';
import uploadRoutes from './upload.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/layers', layerRoutes);
router.use('/upload', uploadRoutes);

export default router;