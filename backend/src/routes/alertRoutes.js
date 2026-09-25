import { Router } from 'express';
import { getAlerts, getAlertMetrics, simulateDetection } from '../controllers/alertController.js';

const router = Router();

router.get('/', getAlerts);
router.get('/metrics', getAlertMetrics);
router.post('/simulate', simulateDetection);

export default router;
