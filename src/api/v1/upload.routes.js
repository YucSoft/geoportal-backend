import { Router } from 'express';
import { uploadShapefile } from '../../api/v1/upload.controller.js';
import { apiLimiter } from '../../config/rateLimit.config.js';
import { checkJwt } from '../../middlewares/auth.middleware.js';
import asyncHandler from '../../utils/asyncHandler.js';
import upload from '../../config/multer.config.js';

const router = Router();

router.post(
    '/shapefile',
    apiLimiter,
    checkJwt,
    upload.single('shapefile'),
    asyncHandler(uploadShapefile)
);

export default router;