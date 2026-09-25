import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';

// Inicialização da aplicação Express
const app = express();

// Configuração de Middlewares Globais
// CORS liberado para permitir comunicação do frontend isolado
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota raiz informativa
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Security Devs - Condominium Security Monitoring API',
    status: 'ACTIVE',
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
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} não encontrado na API.`
  });
});

// Middleware global de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro na aplicação:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erro interno no servidor de monitoramento'
  });
});

export default app;
