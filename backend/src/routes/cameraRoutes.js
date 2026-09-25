import { Router } from 'express';
import { getAllCameras, getCameraById } from '../controllers/cameraController.js';

const router = Router();

router.get('/', getAllCameras);
router.get('/:id', getCameraById);

export default router;
