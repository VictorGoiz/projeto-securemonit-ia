import express from 'express';
import cors from 'cors';
import { requestLogger } from './middlewares/loggerMiddleware.js';
import apiRouter from './routes/index.js';

// Inicialização da aplicação Express
const app = express();

// Configuração de Middlewares Globais
// CORS liberado para permitir comunicação com o frontend hospedado separadamente no Render
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logger de requisições HTTP para monitoramento em tempo real nos logs do Render
app.use(requestLogger);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota raiz informativa
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Security Devs - Condominium Security Monitoring API',
    status: 'ACTIVE',
    environment: process.env.NODE_ENV || 'production',
    architecture: 'ESM / Routes-Controllers-Services',
    endpoints: {
      health: '/api/health',
      cameras: '/api/cameras',
      alerts: '/api/alerts',
      simulateAlert: 'POST /api/alerts/simulate',
      aiChatbot: 'POST /api/ai/chat',
      aiAnalyze: 'POST /api/ai/analyze'
    }
  });
});

// Acoplamento dos roteadores estruturados em /api
app.use('/api', apiRouter);

// Middleware para tratamento de rotas não encontradas
app.use((req, res) => {
  const timestamp = new Date().toISOString();
  console.warn(`[WARN-404] ${timestamp} | Rota não encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} não encontrado na API.`
  });
});

// Middleware global de tratamento de erros com telemetria para o Render
app.use((err, req, res, next) => {
  const timestamp = new Date().toISOString();
  console.error(`[ERROR-500] ${timestamp} | Falha na requisição [${req.method} ${req.originalUrl}]:`, err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erro interno no servidor de monitoramento'
  });
});

export default app;
