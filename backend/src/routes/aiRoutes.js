import { Router } from 'express';
import { aiController } from '../controllers/aiController.js';

const router = Router();

// Rota para o chatbot de alertas inteligentes
router.post('/chat', aiController.chat);

// Rota para diagnóstico e assertividade de perigo real vs falso positivo
router.post('/analyze', aiController.analyzeThreat);

export default router;
