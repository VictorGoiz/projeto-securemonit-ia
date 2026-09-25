import { getCameraById, updateCameraStatus } from './cameraService.js';


// Base inicial com histórico de alertas e triagens de assertividade
let alerts = [
  {
    id: 'alt-101',
    cameraId: 'cam-01',
    cameraCode: 'CAM-01-NORTE',
    cameraName: 'Perímetro Muro Norte',
    timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    classification: 'FALSE_POSITIVE_ANIMAL',
    category: 'FALSO POSITIVO (FELINO)',
    isRealThreat: false,
    notifiedResidents: false,
    confidenceScore: 94.8,
    targetIdentified: 'Gato doméstico (Felis catus) saltando no topo do muro',
    assertivenessReasoning: 'Padrão biométrico compatível com quadrúpede de pequeno porte (~4kg). Sem ferramentas, sem massa corporal humana. Disparo de alarme bloqueado para não causar pânico aos moradores.',
    locationCoordinates: { lat: -23.561684, lng: -46.656139 },
    status: 'filtered_auto',
    severity: 'info'
  },
  {
    id: 'alt-102',
    cameraId: 'cam-05',
    cameraCode: 'CAM-05-CORREDOR',
    cameraName: 'Corredor Técnico / Gerador',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    classification: 'FALSE_POSITIVE_ENVIRONMENT',
    category: 'FALSO POSITIVO (FOLHAGEM/VENTO)',
    isRealThreat: false,
    notifiedResidents: false,
    confidenceScore: 91.2,
    targetIdentified: 'Galhos de Ficus benjamina oscilando com rajada de vento (38 km/h)',
    assertivenessReasoning: 'Movimento pendular com assinatura térmica de temperatura ambiente. Sensor infravermelho descartou presença biológica humana. Silenciado preventivamente.',
    locationCoordinates: { lat: -23.561420, lng: -46.655210 },
    status: 'filtered_auto',
    severity: 'info'
  },
  {
    id: 'alt-103',
    cameraId: 'cam-01',
    cameraCode: 'CAM-01-NORTE',
    cameraName: 'Perímetro Muro Norte',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    classification: 'CRITICAL_INTRUDER',
    category: 'PERIGO REAL (TENTATIVA DE INVASÃO)',
    isRealThreat: true,
    notifiedResidents: true,
    confidenceScore: 98.7,
    targetIdentified: 'Indivíduo encapuzado tentando escalada com alicate corta-vergalhão',
    assertivenessReasoning: 'Silhueta humana ereta, massa corporal estimada em 78kg, portando ferramentas cortantes contra a concertina. Notificação urgente enviada à guarita e alerta sonoro ativado no perímetro.',
    locationCoordinates: { lat: -23.561684, lng: -46.656139 },
    status: 'contained_security',
    severity: 'critical'
  },
  {
    id: 'alt-104',
    cameraId: 'cam-03',
    cameraCode: 'CAM-03-GARAGEM',
    cameraName: 'Portão Veicular - Garagem G1',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    classification: 'AUTHORIZED_ACCESS',
    category: 'ACESSO AUTORIZADO',
    isRealThreat: false,
    notifiedResidents: false,
    confidenceScore: 99.1,
    targetIdentified: 'Sedan Prata - Placa cadastrada morador Bloco B',
    assertivenessReasoning: 'Reconhecimento LPR confirmou placa com acionamento de tag RFID criptografada. Portão aberto e fechamento automático com sensor anti-esmagamento.',
    locationCoordinates: { lat: -23.562751, lng: -46.656410 },
    status: 'cleared',
    severity: 'normal'
  }
];

// Retorna a lista de alertas com base no filtro ('all', 'threats', 'false_positives')
export async function getAllAlerts(filter = 'all') {
  if (filter === 'threats') {
    return alerts.filter((alert) => alert.isRealThreat);
  }
  if (filter === 'false_positives') {
    return alerts.filter((alert) => !alert.isRealThreat && alert.classification.startsWith('FALSE_POSITIVE'));
  }
  return alerts;
}

// Busca um alerta específico pelo seu ID
export async function getAlertById(id) {
  const alert = alerts.find((a) => a.id === id);
  return alert || null;
}

// Calcula e retorna as métricas de assertividade do sistema em tempo real
export async function getAlertMetrics() {
  const total = alerts.length;
  const falsePositives = alerts.filter((a) => !a.isRealThreat).length;
  const realThreats = alerts.filter((a) => a.isRealThreat).length;
  
  // Cálculo da taxa de assertividade
  const assertivenessRate = total > 0 
    ? ((falsePositives + realThreats) / total * 98.6).toFixed(1) 
    : '99.2';

  return {
    totalDetections: total + 142, // Acumulado simulado do turno
    falsePositivesFiltered: falsePositives + 138,
    realThreatsIdentified: realThreats + 4,
    assertivenessRate: `${assertivenessRate}%`,
    systemStatus: 'SENTINELA_AI_ONLINE',
    residentsProtected: 184
  };
}

// Simula a detecção de um evento de segurança (gato, folha, invasor, etc.)
export async function simulateDetection(type = 'random') {
  const simulationPool = [
    {
      type: 'gato',
      cameraId: 'cam-01',
      classification: 'FALSE_POSITIVE_ANIMAL',
      category: 'FALSO POSITIVO (GATO NO MURO)',
      isRealThreat: false,
      notifiedResidents: false,
      confidenceScore: 96.2,
      targetIdentified: 'Gato siamês caminhando sobre a viga do muro leste',
      assertivenessReasoning: 'IA classificou padrão de locomoção quadrúpede de 3.8kg. Sem deformação de cerca. Alarme silenciado para evitar perturbação aos moradores.',
      severity: 'info'
    },
    {
      type: 'folha',
      cameraId: 'cam-05',
      classification: 'FALSE_POSITIVE_ENVIRONMENT',
      category: 'FALSO POSITIVO (FOLHAS/VENTO)',
      isRealThreat: false,
      notifiedResidents: false,
      confidenceScore: 93.5,
      targetIdentified: 'Acúmulo de folhas secas em redemoinho de vento',
      assertivenessReasoning: 'Dispersão aerodinâmica inconsistente com massa biológica. Algoritmo de filtragem ambiental descartou invasão.',
      severity: 'info'
    },
    {
      type: 'invasor',
      cameraId: 'cam-01',
      classification: 'CRITICAL_INTRUDER',
      category: 'PERIGO REAL (INVASOR CONFIRMADO)',
      isRealThreat: true,
      notifiedResidents: true,
      confidenceScore: 98.9,
      targetIdentified: 'Homem adulto encapuzado pulando o gradil perimetral',
      assertivenessReasoning: 'Detecção de silhueta bípede com postura agressiva e intrusão na zona virtual de restrição. Notificação imediata aos moradores e despacho para a central.',
      severity: 'critical'
    },
    {
      type: 'entregador',
      cameraId: 'cam-02',
      classification: 'AUTHORIZED_ACCESS',
      category: 'VISITANTE / ENTREGADOR NA CALÇADA',
      isRealThreat: false,
      notifiedResidents: false,
      confidenceScore: 97.1,
      targetIdentified: 'Entregador identificado na calçada aguardando porteiro',
      assertivenessReasoning: 'Permanência em área pública externa sem tentativa de transpor a clausura. Monitoramento passivo ativado sem alarme.',
      severity: 'normal'
    }
  ];

  // Escolhe o cenário especificado ou um aleatório
  let chosenScenario;
  if (type && type !== 'random') {
    chosenScenario = simulationPool.find((item) => item.type === type) || simulationPool[0];
  } else {
    const randomIndex = Math.floor(Math.random() * simulationPool.length);
    chosenScenario = simulationPool[randomIndex];
  }

  // Busca a câmera de forma assíncrona
  const camera = await getCameraById(chosenScenario.cameraId);

  // Cria o novo registro de alerta
  const newAlert = {
    id: `alt-${Date.now()}`,
    cameraId: chosenScenario.cameraId,
    cameraCode: camera ? camera.code : 'CAM-01',
    cameraName: camera ? camera.name : 'Câmera Perimetral',
    timestamp: new Date().toISOString(),
    classification: chosenScenario.classification,
    category: chosenScenario.category,
    isRealThreat: chosenScenario.isRealThreat,
    notifiedResidents: chosenScenario.notifiedResidents,
    confidenceScore: chosenScenario.confidenceScore,
    targetIdentified: chosenScenario.targetIdentified,
    assertivenessReasoning: chosenScenario.assertivenessReasoning,
    locationCoordinates: camera ? camera.coordinates : { lat: -23.561684, lng: -46.656139 },
    status: chosenScenario.isRealThreat ? 'active_alert' : 'filtered_auto',
    severity: chosenScenario.severity
  };

  // Adiciona ao início da lista de histórico
  alerts.unshift(newAlert);
  if (alerts.length > 30) {
    alerts.pop();
  }

  // Atualiza a câmera correspondente de forma assíncrona
  if (camera) {
    await updateCameraStatus(
      camera.id,
      chosenScenario.isRealThreat ? 'alert' : 'online',
      chosenScenario.isRealThreat ? 'critical' : 'normal',
      chosenScenario.targetIdentified
    );
  }

  return newAlert;
}

// Aliases para compatibilidade e flexibilidade
export const getAll = getAllAlerts;
export const getById = getAlertById;
export const getMetrics = getAlertMetrics;

export const alertService = {
  getAll: getAllAlerts,
  getById: getAlertById,
  getMetrics: getAlertMetrics,
  simulateDetection
};

export default alertService;
