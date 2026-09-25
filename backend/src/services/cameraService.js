// Base de câmeras do condomínio com coordenadas geográficas fictícias e estáticas
const cameras = [
  {
    id: 'cam-01',
    code: 'CAM-01-NORTE',
    name: 'Perímetro Muro Norte',
    zone: 'Perímetro Externo',
    sector: 'Setor A - Cerca Elétrica',
    status: 'alert',
    resolution: '4K UltraHD',
    fps: 30,
    nightVision: true,
    feedUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
    coordinates: {
      lat: -23.561684,
      lng: -46.656139,
      accuracyMeters: 2.5,
      zoneName: 'Muro Norte - Viga 14'
    },
    lastDetection: 'Movimento suspeito verificado',
    threatLevel: 'low'
  },
  {
    id: 'cam-02',
    code: 'CAM-02-PORTARIA',
    name: 'Portaria Principal (Pedestres)',
    zone: 'Controle de Acesso',
    sector: 'Setor B - Clausura Social',
    status: 'online',
    resolution: '1080p 60fps',
    fps: 60,
    nightVision: true,
    feedUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    coordinates: {
      lat: -23.562305,
      lng: -46.655821,
      accuracyMeters: 1.0,
      zoneName: 'Portaria Social - Hall'
    },
    lastDetection: 'Morador liberado com biometria facial',
    threatLevel: 'normal'
  },
  {
    id: 'cam-03',
    code: 'CAM-03-GARAGEM',
    name: 'Portão Veicular - Garagem G1',
    zone: 'Estacionamento Subsolo',
    sector: 'Setor C - Rampa de Acesso',
    status: 'online',
    resolution: '1440p QuadHD',
    fps: 30,
    nightVision: true,
    feedUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
    coordinates: {
      lat: -23.562751,
      lng: -46.656410,
      accuracyMeters: 2.0,
      zoneName: 'Subsolo G1 - Portão Rápido'
    },
    lastDetection: 'Veículo morador Apt 104 identificado (LPR)',
    threatLevel: 'normal'
  },
  {
    id: 'cam-04',
    code: 'CAM-04-PISCINA',
    name: 'Área de Lazer / Piscina',
    zone: 'Convivência Comum',
    sector: 'Setor D - Deck Superior',
    status: 'online',
    resolution: '1080p 30fps',
    fps: 30,
    nightVision: true,
    feedUrl: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
    coordinates: {
      lat: -23.561912,
      lng: -46.654920,
      accuracyMeters: 3.0,
      zoneName: 'Deck Piscina e Solarium'
    },
    lastDetection: 'Área desocupada (Horário restrito)',
    threatLevel: 'normal'
  },
  {
    id: 'cam-05',
    code: 'CAM-05-CORREDOR',
    name: 'Corredor Técnico / Gerador',
    zone: 'Infraestrutura Crítica',
    sector: 'Setor E - Casa de Máquinas',
    status: 'alert',
    resolution: '4K NightColor',
    fps: 24,
    nightVision: true,
    feedUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
    coordinates: {
      lat: -23.561420,
      lng: -46.655210,
      accuracyMeters: 1.8,
      zoneName: 'Fundos Bloco B - Subestação'
    },
    lastDetection: 'Oscilação térmica descartada como folhagem',
    threatLevel: 'low'
  },
  {
    id: 'cam-06',
    code: 'CAM-06-BOSQUE',
    name: 'Perímetro Sul / Bosque',
    zone: 'Perímetro Externo',
    sector: 'Setor F - Gradil Fundos',
    status: 'online',
    resolution: '1080p 30fps',
    fps: 30,
    nightVision: true,
    feedUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    coordinates: {
      lat: -23.563120,
      lng: -46.655190,
      accuracyMeters: 4.0,
      zoneName: 'Perímetro Sul - Área Verde'
    },
    lastDetection: 'Sensor infravermelho estável',
    threatLevel: 'normal'
  }
];

export const cameraService = {
  getAll: () => cameras,
  
  getById: (id) => cameras.find((cam) => cam.id === id || cam.code === id),

  updateStatus: (id, status, threatLevel = 'normal', lastDetection = null) => {
    const cam = cameras.find((c) => c.id === id);
    if (cam) {
      cam.status = status;
      cam.threatLevel = threatLevel;
      if (lastDetection) cam.lastDetection = lastDetection;
    }
    return cam;
  }
};

export default cameraService;
