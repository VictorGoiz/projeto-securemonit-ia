import { aiService } from '../services/aiService.js';

export const aiController = {
  chat: async (req, res) => {
    try {
      const { message, history } = req.body;

      if (!message || typeof message !== 'string' || message.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'O campo "message" é obrigatório e deve ser um texto válido.'
        });
      }

      const response = await aiService.chat(message, history || []);

      return res.status(200).json({
        success: true,
        data: response
      });
    } catch (error) {
      console.error('Erro no aiController.chat:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao processar consulta com o agente de IA',
        error: error.message
      });
    }
  },

  analyzeThreat: async (req, res) => {
    try {
      const { objectType, zone, hour, movementSpeed } = req.body;

      if (!objectType) {
        return res.status(400).json({
          success: false,
          message: 'O campo "objectType" é obrigatório para a análise de assertividade.'
        });
      }

      const analysis = await aiService.analyzeThreat({
        objectType,
        zone: zone || 'Perímetro Geral',
        hour: hour || new Date().toLocaleTimeString(),
        movementSpeed: movementSpeed || 'médio'
      });

      return res.status(200).json({
        success: true,
        data: analysis
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro na análise de perigo da IA',
        error: error.message
      });
    }
  }
};

export default aiController;
