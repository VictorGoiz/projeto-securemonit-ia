import { alertService } from '../services/alertService.js';

export const alertController = {
  getAlerts: (req, res) => {
    try {
      const { filter } = req.query;
      const alerts = alertService.getAll(filter);
      const metrics = alertService.getMetrics();

      return res.status(200).json({
        success: true,
        metrics,
        count: alerts.length,
        data: alerts
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao obter alertas',
        error: error.message
      });
    }
  },

  getAlertMetrics: (req, res) => {
    try {
      const metrics = alertService.getMetrics();
      return res.status(200).json({
        success: true,
        data: metrics
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao calcular métricas de assertividade',
        error: error.message
      });
    }
  },

  simulateDetection: (req, res) => {
    try {
      const { type } = req.body || {};
      const newAlert = alertService.simulateDetection(type);

      return res.status(201).json({
        success: true,
        message: `Detecção simulada com sucesso (${newAlert.category})`,
        data: newAlert,
        metrics: alertService.getMetrics()
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao simular detecção',
        error: error.message
      });
    }
  }
};

export default alertController;
