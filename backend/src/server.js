import app from './app.js';
import { config } from './config/env.js';

const PORT = config.port || 3000;

const server = app.listen(PORT, () => {
  console.log('====================================================');
  console.log('🛡️  SECURITY DEVS - SISTEMA DE MONITORAMENTO CONDOMINIAL');
  console.log('====================================================');
  console.log(`📡 Servidor de Segurança Operando na Porta: ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`🤖 Agente de IA: ${config.openaiApiKey ? 'OpenAI Conectado (' + config.openaiModel + ')' : 'Modo Heurístico Local Ativo'}`);
  console.log(`🎯 Foco: Assertividade de Alertas (Gato/Folhas vs Invasor)`);
  console.log('====================================================');
});

// Tratamento de encerramento gracioso
process.on('SIGTERM', () => {
  console.log('Recebido SIGTERM. Finalizando servidor com segurança...');
  server.close(() => {
    console.log('Servidor encerrado.');
  });
});

export default server;
