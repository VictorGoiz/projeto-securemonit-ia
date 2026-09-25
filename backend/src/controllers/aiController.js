import {
  chat as processChat,
  analyzeThreat as evaluateThreat
} from '../services/aiService.js';

// POST /api/ai/chat - Processa conversa com o assistente inteligente
export async function chat(req, res) {
  try {
    const { message, history = [] } = req.body || {};

    // Validação simples da mensagem
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'O campo "message" é obrigatório e deve ser um texto válido.'
      });
    }

    // Executa a consulta de IA de forma assíncrona
    const response = await processChat(message.trim(), history);

    return res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Erro em aiController.chat:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno ao processar consulta com o agente de IA',
      error: error.message
    });
  }
}

// POST /api/ai/analyze - Avalia criticidade e assertividade de um objeto detectado
export async function analyzeThreat(req, res) {
  try {
    const { objectType, zone = 'Perímetro Geral', hour, movementSpeed = 'médio' } = req.body || {};

    // Validação do tipo de objeto
    if (!objectType) {
      return res.status(400).json({
        success: false,
        message: 'O campo "objectType" é obrigatório para a análise de assertividade.'
      });
    }

    // Executa a análise assíncrona
    const analysis = await evaluateThreat({
      objectType,
      zone,
      hour: hour || new Date().toLocaleTimeString('pt-BR'),
      movementSpeed
    });

    return res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Erro em aiController.analyzeThreat:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno na análise de perigo da IA',
      error: error.message
    });
  }
}

export const aiController = {
  chat,
  analyzeThreat
};

export default aiController;
