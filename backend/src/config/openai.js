import { config } from './env.js';

let openaiClient = null;

if (config.openaiApiKey && config.openaiApiKey.trim() !== '') {
  try {
    const { default: OpenAI } = await import('openai');
    openaiClient = new OpenAI({
      apiKey: config.openaiApiKey
    });
  } catch (err) {
    console.warn('[OpenAI] Módulo openai não carregado ou pacote não instalado:', err.message);
  }
}

export { openaiClient };
export default openaiClient;
