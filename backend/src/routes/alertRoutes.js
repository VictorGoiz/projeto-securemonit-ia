import { Router } from 'express';
import { alertController } from '../controllers/alertController.js';

const router = Router();

router.get('/', alertController.getAlerts);
router.get('/metrics', alertController.getAlertMetrics);
router.post('/simulate', alertController.simulateDetection);

export default router;
