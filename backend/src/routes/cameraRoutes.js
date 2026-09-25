import { Router } from 'express';
import { cameraController } from '../controllers/cameraController.js';

const router = Router();

router.get('/', cameraController.getAllCameras);
router.get('/:id', cameraController.getCameraById);

export default router;
