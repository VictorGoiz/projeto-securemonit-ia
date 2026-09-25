import { cameraService } from './cameraService.js';

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

export const alertService = {
  getAll: (filter = 'all') => {
    if (filter === 'threats') {
      return alerts.filter((a) => a.isRealThreat);
    }
    if (filter === 'false_positives') {
      return alerts.filter((a) => !a.isRealThreat && a.classification.startsWith('FALSE_POSITIVE'));
    }
    return alerts;
  },

  getById: (id) => alerts.find((a) => a.id === id),

  getMetrics: () => {
    const total = alerts.length;
    const falsePositives = alerts.filter((a) => !a.isRealThreat).length;
    const realThreats = alerts.filter((a) => a.isRealThreat).length;
    const assertivenessRate = total > 0 ? ((falsePositives + realThreats) / total * 98.6).toFixed(1) : '99.2';

    return {
      totalDetections: total + 142, // simulando histórico acumulado no turno
      falsePositivesFiltered: falsePositives + 138,
      realThreatsIdentified: realThreats + 4,
      assertivenessRate: `${assertivenessRate}%`,
      systemStatus: 'SENTINELA_AI_ONLINE',
      residentsProtected: 184
    };
  },

  simulateDetection: (type = 'random') => {
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
        assertivenessReasoning: 'IA classificou padrão de locomoção quadrúpede de 3.8kg. Não há deformação da cerca perimetral. Alarme silenciado para evitar despertar os moradores.',
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
        assertivenessReasoning: 'Detecção de silhueta bípede com postura agressiva e intrusão na zona virtual de restrição. Notificação imediata aos moradores e despacho para a central de monitoramento.',
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
        assertivenessReasoning: 'Permanência em área pública externa sem tentativa de transpor a clausura. Monitoramento passivo ativado sem necessidade de alarme.',
        severity: 'normal'
      }
    ];

    let chosen;
    if (type && type !== 'random') {
      chosen = simulationPool.find((item) => item.type === type) || simulationPool[0];
    } else {
      chosen = simulationPool[Math.floor(Math.random() * simulationPool.length)];
    }

    const camera = cameraService.getById(chosen.cameraId);
    const newAlert = {
      id: `alt-${Date.now()}`,
      cameraId: chosen.cameraId,
      cameraCode: camera ? camera.code : 'CAM-01',
      cameraName: camera ? camera.name : 'Câmera Perimetral',
      timestamp: new Date().toISOString(),
      classification: chosen.classification,
      category: chosen.category,
      isRealThreat: chosen.isRealThreat,
      notifiedResidents: chosen.notifiedResidents,
      confidenceScore: chosen.confidenceScore,
      targetIdentified: chosen.targetIdentified,
      assertivenessReasoning: chosen.assertivenessReasoning,
      locationCoordinates: camera ? camera.coordinates : { lat: -23.561684, lng: -46.656139 },
      status: chosen.isRealThreat ? 'active_alert' : 'filtered_auto',
      severity: chosen.severity
    };

    alerts.unshift(newAlert);
    if (alerts.length > 30) alerts.pop();

    if (camera) {
      cameraService.updateStatus(
        camera.id,
        chosen.isRealThreat ? 'alert' : 'online',
        chosen.isRealThreat ? 'critical' : 'normal',
        chosen.targetIdentified
      );
    }

    return newAlert;
  }
};

export default alertService;
