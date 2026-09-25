import OpenAI from 'openai';
import { config } from './env.js';

let openaiClient = null;

if (config.openaiApiKey && config.openaiApiKey.trim() !== '') {
  openaiClient = new OpenAI({
    apiKey: config.openaiApiKey
  });
}

export { openaiClient };
export default openaiClient;
