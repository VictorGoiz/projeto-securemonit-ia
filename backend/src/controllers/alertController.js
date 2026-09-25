import {
  getAllAlerts,
  getAlertMetrics as fetchAlertMetrics,
  simulateDetection as runSimulateDetection
} from '../services/alertService.js';

// GET /api/alerts - Lista alertas (com suporte a filtro por query param ?filter=)
export async function getAlerts(req, res) {
  try {
    const { filter = 'all' } = req.query;

    // Executa a busca de alertas e o cálculo de métricas em paralelo
    const [alerts, metrics] = await Promise.all([
      getAllAlerts(filter),
      fetchAlertMetrics()
    ]);

    return res.status(200).json({
      success: true,
      metrics,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    console.error('Erro em getAlerts:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno ao obter alertas',
      error: error.message
    });
  }
}

// GET /api/alerts/metrics - Retorna as métricas consolidadas de assertividade
export async function getAlertMetrics(req, res) {
  try {
    const metrics = await fetchAlertMetrics();

    return res.status(200).json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Erro em getAlertMetrics:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno ao calcular métricas de assertividade',
      error: error.message
    });
  }
}

// POST /api/alerts/simulate - Simula um evento de segurança (gato, folha, invasor, etc.)
export async function simulateDetection(req, res) {
  try {
    const { type = 'random' } = req.body || {};

    // Executa a simulação e atualiza a câmera de forma assíncrona
    const newAlert = await runSimulateDetection(type);
    const updatedMetrics = await fetchAlertMetrics();

    return res.status(201).json({
      success: true,
      message: `Detecção simulada com sucesso: ${newAlert.category}`,
      data: newAlert,
      metrics: updatedMetrics
    });
  } catch (error) {
    console.error('Erro em simulateDetection:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno ao simular detecção de segurança',
      error: error.message
    });
  }
}

export const alertController = {
  getAlerts,
  getAlertMetrics,
  simulateDetection
};

export default alertController;
