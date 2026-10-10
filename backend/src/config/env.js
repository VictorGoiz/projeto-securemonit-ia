try {
  await import('dotenv/config');
} catch (e) {
  // dotenv não instalado ou rodando nativamente no Node 20+ com process.env
}

export const config = {
  port: process.env.PORT || 3000,
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  env: process.env.NODE_ENV || 'development'
};

export default config;
