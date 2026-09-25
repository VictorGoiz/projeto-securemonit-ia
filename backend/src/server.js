import app from './app.js';
import { config } from './config/env.js';

// No Render, a variável PORT é injetada automaticamente pelo ambiente
const PORT = Number(process.env.PORT) || config.port || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const timestamp = new Date().toISOString();

  console.log('================================================================');
  console.log('🛡️  SECURITY DEVS - CONDOMINIUM DEFENSE & THREAT MONITORING SOC');
  console.log('================================================================');
  console.log(`[BOOT] ${timestamp} | Servidor inicializado com sucesso`);
  console.log(`[BOOT] 🚀 Escutando em: http://${HOST}:${PORT}`);
  console.log(`[BOOT] 🌍 Ambiente: ${isProduction ? 'PRODUCTION (Render)' : 'DEVELOPMENT'}`);
  console.log(`[BOOT] 🤖 Agente IA: ${config.openaiApiKey ? 'OpenAI Conectado (' + config.openaiModel + ')' : 'Sentinela-LocalEngine-v2 (Fallback Local Ativo)'}`);
  console.log(`[BOOT] 📡 Health Check: http://${HOST}:${PORT}/api/health`);
  console.log('================================================================');
  console.log('Esperando requisições do frontend...');
});

// Tratamento de encerramento gracioso (SIGTERM e SIGINT comuns no Render)
process.on('SIGTERM', () => {
  const timestamp = new Date().toISOString();
  console.log(`[SHUTDOWN] ${timestamp} | Recebido sinal SIGTERM do Render. Encerrando servidor...`);
  server.close(() => {
    console.log(`[SHUTDOWN] Servidor encerrado com sucesso.`);
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  const timestamp = new Date().toISOString();
  console.log(`[SHUTDOWN] ${timestamp} | Recebido sinal SIGINT. Encerrando servidor...`);
  server.close(() => {
    console.log(`[SHUTDOWN] Servidor encerrado com sucesso.`);
    process.exit(0);
  });
});

export default server;
