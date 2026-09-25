import { Router } from 'express';
import cameraRoutes from './cameraRoutes.js';
import alertRoutes from './alertRoutes.js';
import aiRoutes from './aiRoutes.js';

const apiRouter = Router();

apiRouter.use('/cameras', cameraRoutes);
apiRouter.use('/alerts', alertRoutes);
apiRouter.use('/ai', aiRoutes);

// Endpoint de status geral da API
apiRouter.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Security Devs - Condominium Security Backend',
    version: '1.0.0'
  });
});

export default apiRouter;
