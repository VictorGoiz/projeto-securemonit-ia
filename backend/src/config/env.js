import 'dotenv/config';

export const config = {
  port: process.env.PORT || 3000,
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  env: process.env.NODE_ENV || 'development'
};

export default config;
