import { Router } from 'express';
import { chat, analyzeThreat } from '../controllers/aiController.js';

const router = Router();

// Rota para o chatbot de alertas inteligentes
router.post('/chat', chat);

// Rota para diagnóstico e assertividade de perigo real vs falso positivo
router.post('/analyze', analyzeThreat);

export default router;
