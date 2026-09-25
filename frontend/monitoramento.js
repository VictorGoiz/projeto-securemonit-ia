/**
 * SECURITY DEVS // CONDOMINIUM DEFENSE & THREAT MONITORING SOC
 * Frontend Controller & Real-Time Telemetry Engine
 * 
 * Funcionalidades:
 * - Design limpo, profissional e corporativo com traços elegantes
 * - Ciclo automático de alertas estáticos a cada 5 segundos
 * - Restauração completa de todas as câmeras para o estado base a cada 1 minuto (60s)
 * - Integração com mapa Leaflet em coordenadas geográficas fictícias
 * - Chatbot flutuante ("Security Devs AI") com respostas táticas
 */

const API_BASE_URL = 'http://localhost:3000/api';

// Catálogo de Câmeras Base
const INITIAL_CAMERAS = [
  {
    id: 'cam-01',
    code: 'CAM-01',
    name: 'Perímetro Muro Norte',
    zone: 'Perímetro Externo',
    sector: 'Setor A • Cerca Perimetral',
    status: 'online',
    resolution: '4K',
    fps: 30,
    feedUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: -23.561684, lng: -46.656139, zoneName: 'Muro Norte - Viga 14' },
    lastDetection: 'Perímetro estável e alinhado',
    threatLevel: 'normal'
  },
  {
    id: 'cam-02',
    code: 'CAM-02',
    name: 'Portaria Principal (Pedestres)',
    zone: 'Controle de Acesso',
    sector: 'Setor B • Clausura Social',
    status: 'online',
    resolution: '1080p',
    fps: 60,
    feedUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: -23.562305, lng: -46.655821, zoneName: 'Portaria Social - Hall' },
    lastDetection: 'Reconhecimento facial biométrico ativo',
    threatLevel: 'normal'
  },
  {
    id: 'cam-03',
    code: 'CAM-03',
    name: 'Portão Veicular - Garagem G1',
    zone: 'Estacionamento Subsolo',
    sector: 'Setor C • Rampa de Acesso',
    status: 'online',
    resolution: '1440p',
    fps: 30,
    feedUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: -23.562751, lng: -46.656410, zoneName: 'Subsolo G1 - Portão Rápido' },
    lastDetection: 'Sensor LPR e laço indutivo operando',
    threatLevel: 'normal'
  },
  {
    id: 'cam-04',
    code: 'CAM-04',
    name: 'Área de Lazer / Piscina',
    zone: 'Convivência Comum',
    sector: 'Setor D • Deck Superior',
    status: 'online',
    resolution: '1080p',
    fps: 30,
    feedUrl: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: -23.561912, lng: -46.654920, zoneName: 'Deck Piscina e Solarium' },
    lastDetection: 'Área sem movimentação recente',
    threatLevel: 'normal'
  },
  {
    id: 'cam-05',
    code: 'CAM-05',
    name: 'Corredor Técnico / Gerador',
    zone: 'Infraestrutura Crítica',
    sector: 'Setor E • Casa de Máquinas',
    status: 'online',
    resolution: '4K',
    fps: 24,
    feedUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: -23.561420, lng: -46.655210, zoneName: 'Fundos Bloco B - Subestação' },
    lastDetection: 'Sensor infravermelho calibrado',
    threatLevel: 'normal'
  },
  {
    id: 'cam-06',
    code: 'CAM-06',
    name: 'Perímetro Sul / Bosque',
    zone: 'Perímetro Externo',
    sector: 'Setor F • Gradil Fundos',
    status: 'online',
    resolution: '1080p',
    fps: 30,
    feedUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: -23.563120, lng: -46.655190, zoneName: 'Perímetro Sul - Área Verde' },
    lastDetection: 'Feixe perimetral ativo e alinhado',
    threatLevel: 'normal'
  }
];

// Ciclo Estático de Eventos (a cada 5 segundos)
const STATIC_CYCLE_SCENARIOS = [
  {
    secondMark: 5,
    stageName: 'Gato no Muro (5s)',
    cameraId: 'cam-01',
    classification: 'FALSE_POSITIVE_ANIMAL',
    category: 'Falso Positivo (Felino)',
    isRealThreat: false,
    notifiedResidents: false,
    confidenceScore: 96.4,
    targetIdentified: 'Gato doméstico caminhando sobre a viga do muro leste',
    assertivenessReasoning: 'Biometria térmica detectou padrão quadrúpede de 3.8kg. Alarme silenciado aos moradores.',
    severity: 'info'
  },
  {
    secondMark: 10,
    stageName: 'Vento/Folhas (10s)',
    cameraId: 'cam-05',
    classification: 'FALSE_POSITIVE_ENVIRONMENT',
    category: 'Falso Positivo (Folhagem)',
    isRealThreat: false,
    notifiedResidents: false,
    confidenceScore: 93.8,
    targetIdentified: 'Rajada de vento (38 km/h) balançando copa de árvore',
    assertivenessReasoning: 'Filtro espectral descartou calor biológico. Oscilação natural silenciada.',
    severity: 'info'
  },
  {
    secondMark: 15,
    stageName: 'Acesso Social (15s)',
    cameraId: 'cam-02',
    classification: 'AUTHORIZED_ACCESS',
    category: 'Acesso Autorizado',
    isRealThreat: false,
    notifiedResidents: false,
    confidenceScore: 99.4,
    targetIdentified: 'Morador Bloco A identificado por biometria facial',
    assertivenessReasoning: 'Reconhecimento biométrico confirmado. Clausura destravada com segurança.',
    severity: 'normal'
  },
  {
    secondMark: 20,
    stageName: 'Invasor Real (20s)',
    cameraId: 'cam-01',
    classification: 'CRITICAL_INTRUDER',
    category: 'Perigo Real (Invasão)',
    isRealThreat: true,
    notifiedResidents: true,
    confidenceScore: 98.9,
    targetIdentified: 'Indivíduo encapuzado tentando escalada com alicate corta-vergalhão',
    assertivenessReasoning: 'Silhueta bípede com ferramenta de corte. Sirene e guarita acionados imediatamente!',
    severity: 'critical'
  },
  {
    secondMark: 25,
    stageName: 'Reflexo Farol (25s)',
    cameraId: 'cam-03',
    classification: 'FALSE_POSITIVE_ENVIRONMENT',
    category: 'Falso Positivo (Luz)',
    isRealThreat: false,
    notifiedResidents: false,
    confidenceScore: 95.2,
    targetIdentified: 'Reflexo de farol de automóvel externo na vidraça da clausura',
    assertivenessReasoning: 'Sensor óptico descartou intrusão mecânica ou física. Evento silenciado.',
    severity: 'info'
  },
  {
    secondMark: 30,
    stageName: 'Pássaro no Deck (30s)',
    cameraId: 'cam-04',
    classification: 'FALSE_POSITIVE_ANIMAL',
    category: 'Falso Positivo (Pássaro)',
    isRealThreat: false,
    notifiedResidents: false,
    confidenceScore: 94.6,
    targetIdentified: 'Pássaro pousando e obstruindo feixe óptico',
    assertivenessReasoning: 'Interrupção ultracurta de feixe descartada como ave urbana.',
    severity: 'info'
  },
  {
    secondMark: 35,
    stageName: 'Ronda Interna (35s)',
    cameraId: 'cam-06',
    classification: 'AUTHORIZED_ACCESS',
    category: 'Ronda Preventiva',
    isRealThreat: false,
    notifiedResidents: false,
    confidenceScore: 99.1,
    targetIdentified: 'Vigilante patrimonial com bastão de ronda eletrônica',
    assertivenessReasoning: 'Transponder de segurança da guarita reconhecido no ponto de controle Setor F.',
    severity: 'normal'
  },
  {
    secondMark: 40,
    stageName: 'Sombra ao Vento (40s)',
    cameraId: 'cam-01',
    classification: 'FALSE_POSITIVE_ENVIRONMENT',
    category: 'Falso Positivo (Sombra)',
    isRealThreat: false,
    notifiedResidents: false,
    confidenceScore: 92.5,
    targetIdentified: 'Oscilação de sombra de poste de iluminação na calçada',
    assertivenessReasoning: 'Filtro volumétrico descartou massa sólida 3D. Alarme cancelado.',
    severity: 'info'
  },
  {
    secondMark: 45,
    stageName: 'Teste de Gerador (45s)',
    cameraId: 'cam-05',
    classification: 'AUTHORIZED_ACCESS',
    category: 'Infraestrutura Técnica',
    isRealThreat: false,
    notifiedResidents: false,
    confidenceScore: 99.7,
    targetIdentified: 'Partida automática preventiva do gerador elétrico a diesel',
    assertivenessReasoning: 'Telemetria predial confirmou teste semanal de contingência elétrica.',
    severity: 'normal'
  },
  {
    secondMark: 50,
    stageName: 'Varredura Setorial (50s)',
    cameraId: 'cam-02',
    classification: 'NORMAL_MONITORING',
    category: 'Calibração Regular',
    isRealThreat: false,
    notifiedResidents: false,
    confidenceScore: 99.9,
    targetIdentified: 'Verificação periódica de sensores térmicos e analíticos',
    assertivenessReasoning: 'Todos os canais de vídeo respondendo com latência estável.',
    severity: 'normal'
  },
  {
    secondMark: 55,
    stageName: 'Pré-Restauração (55s)',
    cameraId: 'cam-01',
    classification: 'NORMAL_MONITORING',
    category: 'Varredura Perimetral',
    isRealThreat: false,
    notifiedResidents: false,
    confidenceScore: 99.8,
    targetIdentified: 'Perímetro norte alinhado e trancado',
    assertivenessReasoning: 'Preparando reinício do ciclo e restauração total de estados.',
    severity: 'normal'
  }
];

// Estado global
const state = {
  cameras: JSON.parse(JSON.stringify(INITIAL_CAMERAS)),
  alerts: [],
  metrics: {
    totalDetections: 147,
    falsePositivesFiltered: 142,
    realThreatsIdentified: 5,
    assertivenessRate: '98.6%'
  },
  activeFilter: 'all',
  chatHistory: [],
  isChatOpen: false,
  map: null,
  markers: {},
  unreadAlerts: 0,
  
  // Controle do Ciclo de 5s / Restauração de 1min
  cycleSeconds: 0,
  cycleIntervalId: null,
  isCycleActive: true,
  lastScenario: null
};

// ==========================================================================
// Inicialização
// ==========================================================================
document.addEventListener('DOMContentLoaded', async () => {
  initClock();
  setupEventListeners();
  initLeafletMap();

  await tryFetchBackendData();

  // Inicia o ciclo de alertas de 5 segundos
  startCycleTimer();

  // Render inicial
  renderMetrics();
  renderCameras();
  renderAuditLogs();
  updateMapMarkers();
});

// Relógio estilo Enterprise
function initClock() {
  const clockEl = document.getElementById('liveClock');
  const updateClock = () => {
    const now = new Date();
    if (clockEl) {
      clockEl.textContent = now.toLocaleTimeString('pt-BR', { hour12: false });
    }
  };
  setInterval(updateClock, 1000);
  updateClock();
}

// ==========================================================================
// Ciclo de Alertas (5s) e Restauração (60s)
// ==========================================================================
function startCycleTimer() {
  if (state.cycleIntervalId) clearInterval(state.cycleIntervalId);

  state.cycleIntervalId = setInterval(() => {
    if (!state.isCycleActive) return;

    state.cycleSeconds++;

    // Restauração a cada 1 minuto (60 segundos)
    if (state.cycleSeconds >= 60) {
      state.cycleSeconds = 0;
      restoreBaseState();
      return;
    }

    // Disparo a cada 5 segundos
    if (state.cycleSeconds % 5 === 0) {
      const scenario = STATIC_CYCLE_SCENARIOS.find((s) => s.secondMark === state.cycleSeconds);
      if (scenario) {
        applyScenario(scenario);
      }
    }

    updateCycleIndicators();
  }, 1000);

  updateCycleIndicators();
}

function updateCycleIndicators() {
  const remaining = 60 - state.cycleSeconds;
  const countdownEl = document.getElementById('cycleCountdownText');
  const stageEl = document.getElementById('cycleStageText');

  if (countdownEl) countdownEl.textContent = `${remaining}s`;
  if (stageEl) {
    stageEl.textContent = state.lastScenario ? state.lastScenario.stageName : 'Standby';
  }
}

function applyScenario(scenario) {
  state.lastScenario = scenario;

  const targetCam = state.cameras.find((c) => c.id === scenario.cameraId);
  if (targetCam) {
    targetCam.status = scenario.isRealThreat ? 'alert' : (scenario.severity === 'info' ? 'alert' : 'online');
    targetCam.threatLevel = scenario.isRealThreat ? 'critical' : (scenario.severity === 'info' ? 'low' : 'normal');
    targetCam.lastDetection = scenario.targetIdentified;
  }

  const newAlert = {
    id: `alt-${Date.now()}`,
    cameraId: scenario.cameraId,
    cameraCode: targetCam ? targetCam.code : 'CAM-01',
    cameraName: targetCam ? targetCam.name : 'Câmera Perimetral',
    timestamp: new Date().toISOString(),
    classification: scenario.classification,
    category: scenario.category,
    isRealThreat: scenario.isRealThreat,
    notifiedResidents: scenario.notifiedResidents,
    confidenceScore: scenario.confidenceScore,
    targetIdentified: scenario.targetIdentified,
    assertivenessReasoning: scenario.assertivenessReasoning,
    status: scenario.isRealThreat ? 'active_alert' : 'filtered_auto',
    severity: scenario.severity
  };

  state.alerts.unshift(newAlert);
  if (state.alerts.length > 20) state.alerts.pop();

  // Métricas
  state.metrics.totalDetections++;
  if (scenario.isRealThreat) {
    state.metrics.realThreatsIdentified++;
    state.unreadAlerts++;
    const badge = document.getElementById('chatNotificationBadge');
    if (badge) {
      badge.textContent = state.unreadAlerts;
      badge.style.display = 'flex';
    }
  } else {
    state.metrics.falsePositivesFiltered++;
  }

  renderMetrics();
  renderCameras();
  renderAuditLogs();
  updateMapMarkers();
}

function restoreBaseState() {
  state.cameras = JSON.parse(JSON.stringify(INITIAL_CAMERAS));
  state.lastScenario = null;

  const restoreLog = {
    id: `alt-restore-${Date.now()}`,
    cameraId: 'cam-all',
    cameraCode: 'TODOS',
    cameraName: 'Central Security Devs',
    timestamp: new Date().toISOString(),
    classification: 'SYSTEM_RESTORE',
    category: 'Restauração de Ciclo (60s)',
    isRealThreat: false,
    notifiedResidents: false,
    confidenceScore: 100.0,
    targetIdentified: 'Restauração de 1 minuto executada. Todas as câmeras no estado estável calibrado.',
    assertivenessReasoning: 'Fim do ciclo de 60 segundos. Perímetro retornou ao nível de segurança verde padrão.',
    status: 'restored',
    severity: 'normal'
  };

  state.alerts.unshift(restoreLog);
  if (state.alerts.length > 20) state.alerts.pop();

  renderMetrics();
  renderCameras();
  renderAuditLogs();
  updateMapMarkers();
  updateCycleIndicators();
}

// ==========================================================================
// Mapa Leaflet
// ==========================================================================
function initLeafletMap() {
  const mapEl = document.getElementById('condoMap');
  if (!mapEl || !window.L) return;

  const centerCoords = [-23.562100, -46.655600];

  state.map = L.map('condoMap', {
    center: centerCoords,
    zoom: 17,
    zoomControl: true
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; CARTO &copy; OpenStreetMap',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(state.map);

  const perimeter = [
    [-23.561300, -46.656500],
    [-23.561300, -46.654700],
    [-23.563300, -46.654700],
    [-23.563300, -46.656500]
  ];

  L.polygon(perimeter, {
    color: '#06b6d4',
    weight: 1.5,
    dashArray: '4, 4',
    fillColor: '#06b6d4',
    fillOpacity: 0.04
  }).addTo(state.map).bindTooltip('Perímetro Condomínio Jardins • São Paulo - SP', { permanent: false });

  // Força cálculo imediato do tamanho do container do Leaflet
  setTimeout(() => {
    state.map.invalidateSize();
  }, 250);
}

function updateMapMarkers() {
  if (!state.map || !window.L || !state.cameras.length) return;

  state.cameras.forEach((cam) => {
    const coords = [cam.coordinates.lat, cam.coordinates.lng];
    const isCritical = cam.threatLevel === 'critical';

    const iconHtml = `<div class="camera-marker-icon ${isCritical ? 'status-critical' : ''}">
      <i class="fa-solid ${isCritical ? 'fa-triangle-exclamation' : 'fa-video'}"></i>
    </div>`;

    const customIcon = L.divIcon({
      html: iconHtml,
      className: 'custom-leaflet-marker',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -16]
    });

    const popupContent = `
      <div style="font-family: 'Inter', sans-serif; font-size: 11px; padding: 4px; min-width: 180px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <strong style="color: ${isCritical ? '#ef4444' : '#06b6d4'}; font-size: 13px;">${cam.code}</strong>
          <span style="font-size: 9px; color: #94a3b8;">São Paulo - SP</span>
        </div>
        <div style="font-weight:600; color:#fff;">${cam.name}</div>
        <div style="color: #94a3b8; font-size: 10px;">${cam.coordinates.zoneName} (${cam.zone})</div>
        <hr style="border: 0; border-top: 1px solid #334155; margin: 6px 0;"/>
        <div><strong>Status:</strong> ${cam.status.toUpperCase()}</div>
        <div><strong>Detecção:</strong> ${cam.lastDetection || 'Sem ocorrência'}</div>
        <div style="margin-top: 4px; color: #38bdf8; font-family: monospace; font-size: 10px;">
          Lat: ${cam.coordinates.lat.toFixed(6)}<br/>Lng: ${cam.coordinates.lng.toFixed(6)}
        </div>
      </div>
    `;

    if (state.markers[cam.id]) {
      state.markers[cam.id].setLatLng(coords);
      state.markers[cam.id].setIcon(customIcon);
      state.markers[cam.id].setPopupContent(popupContent);
    } else {
      const marker = L.marker(coords, { icon: customIcon }).addTo(state.map);
      marker.bindPopup(popupContent);
      state.markers[cam.id] = marker;
    }
  });
}

window.focusCameraOnMap = function(cameraId) {
  const cam = state.cameras.find((c) => c.id === cameraId);
  if (!cam || !state.map) return;

  const mapSection = document.getElementById('tacticalMapSection');
  if (mapSection && mapSection.classList.contains('collapsed')) {
    mapSection.classList.remove('collapsed');
    setTimeout(() => state.map.invalidateSize(), 200);
  }

  state.map.flyTo([cam.coordinates.lat, cam.coordinates.lng], 18, { duration: 1.0 });

  setTimeout(() => {
    if (state.markers[cam.id]) {
      state.markers[cam.id].openPopup();
    }
  }, 1100);

  mapSection?.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

// ==========================================================================
// Requisições Backend (Tenta obter do servidor caso esteja rodando)
// ==========================================================================
async function tryFetchBackendData() {
  try {
    const [camRes, alertRes] = await Promise.all([
      fetch(`${API_BASE_URL}/cameras`),
      fetch(`${API_BASE_URL}/alerts`)
    ]);

    if (camRes.ok) {
      const camData = await camRes.json();
      if (camData.data?.length) state.cameras = camData.data;
    }

    if (alertRes.ok) {
      const alertData = await alertRes.json();
      if (alertData.data?.length) state.alerts = alertData.data;
      if (alertData.metrics) state.metrics = alertData.metrics;
    }
  } catch (err) {
    console.log('Operando com motor estático em tempo real.');
  }
}

// ==========================================================================
// Renderização das Métricas
// ==========================================================================
function renderMetrics() {
  const { falsePositivesFiltered, realThreatsIdentified, assertivenessRate } = state.metrics;

  const fpEl = document.getElementById('valFalsePositives');
  const rtEl = document.getElementById('valRealThreats');
  const arEl = document.getElementById('valAssertiveness');
  const camEl = document.getElementById('valActiveCameras');

  if (fpEl) fpEl.textContent = falsePositivesFiltered || 142;
  if (rtEl) rtEl.textContent = realThreatsIdentified || 5;
  if (arEl) arEl.textContent = assertivenessRate || '98.6%';
  if (camEl) camEl.textContent = `${state.cameras.length} / ${state.cameras.length}`;

  // Indicador Global
  const threatPill = document.getElementById('globalThreatPill');
  const threatText = document.getElementById('globalThreatText');
  const hasThreat = state.cameras.some((c) => c.threatLevel === 'critical');

  if (threatPill && threatText) {
    if (hasThreat) {
      threatPill.className = 'telemetry-pill threat-pill threat-critical';
      threatText.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Invasão Detectada';
    } else {
      threatPill.className = 'telemetry-pill threat-pill';
      threatText.innerHTML = '<i class="fa-solid fa-shield-check"></i> Perímetro Seguro';
    }
  }
}

// ==========================================================================
// Renderização dos Cards (Design Profissional & Limpo)
// ==========================================================================
function renderCameras() {
  const container = document.getElementById('camerasContainer');
  if (!container) return;

  let filtered = state.cameras;
  if (state.activeFilter === 'threats') {
    filtered = state.cameras.filter((c) => c.threatLevel === 'critical');
  } else if (state.activeFilter === 'false_positives') {
    filtered = state.cameras.filter((c) => c.status === 'alert' && c.threatLevel !== 'critical');
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 32px; text-align: center; color: #64748b; font-size: 13px;">
        <p>Nenhuma câmera corresponde ao filtro selecionado.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((cam) => {
    const isThreat = cam.threatLevel === 'critical';
    const isFiltered = cam.status === 'alert' && !isThreat;

    // Card border class
    let cardClass = 'pro-card';
    if (isThreat) cardClass += ' status-threat';
    else if (isFiltered) cardClass += ' status-filtered';

    // Status Pill
    let badgeHtml = `<span class="pro-status-badge badge-live">● Ao Vivo</span>`;
    if (isThreat) {
      badgeHtml = `<span class="pro-status-badge badge-threat">🚨 Alerta Crítico</span>`;
    } else if (isFiltered) {
      badgeHtml = `<span class="pro-status-badge badge-live" style="color:#6ee7b7; border-color:rgba(16,185,129,0.3);">🐾 Filtrado</span>`;
    }

    // Bounding Box Reticle
    let reticleHtml = '';
    if (isThreat) {
      reticleHtml = `
        <div class="pro-reticle-box reticle-threat">
          <span class="reticle-pill"><i class="fa-solid fa-person-running"></i> Invasor (98.9%)</span>
        </div>
      `;
    } else if (cam.lastDetection && cam.lastDetection.toLowerCase().includes('gato')) {
      reticleHtml = `
        <div class="pro-reticle-box">
          <span class="reticle-pill"><i class="fa-solid fa-cat"></i> Gato (96.4%)</span>
        </div>
      `;
    } else if (cam.lastDetection && (cam.lastDetection.toLowerCase().includes('vento') || cam.lastDetection.toLowerCase().includes('folha'))) {
      reticleHtml = `
        <div class="pro-reticle-box" style="border-color:#f59e0b;">
          <span class="reticle-pill" style="background:#f59e0b; color:#000;"><i class="fa-solid fa-wind"></i> Vento (93.8%)</span>
        </div>
      `;
    }

    // Diagnosis Text
    let diagClass = 'diag-normal';
    let diagHeadline = '<span class="diag-headline text-normal">Monitoramento Contínuo</span>';
    let diagMsg = cam.lastDetection || 'Perímetro estável sem anormalidades.';

    if (isThreat) {
      diagClass = 'diag-threat';
      diagHeadline = '<span class="diag-headline text-threat">Perigo Real • 98.9% Assertividade</span>';
      diagMsg = 'Indivíduo tentando escalada. Alarme perimetral e guarita acionados!';
    } else if (isFiltered) {
      diagClass = 'diag-filtered';
      diagHeadline = '<span class="diag-headline text-filtered">Falso Alarme Barrado • Assertividade Alta</span>';
      diagMsg = cam.lastDetection.includes('gato')
        ? 'Gato no muro perimetral. Alarme silenciado para evitar acordar os moradores.'
        : 'Oscilação natural por vento/folhagem. Notificação cancelada.';
    }

    return `
      <article class="${cardClass}" id="card-${cam.id}">
        <!-- Header -->
        <div class="pro-card-header">
          <div class="pro-cam-meta">
            <span class="pro-cam-code">${cam.code}</span>
            <span class="pro-cam-sector">${cam.sector}</span>
          </div>
          ${badgeHtml}
        </div>

        <!-- Video Stream Frame -->
        <div class="pro-stream-box">
          <img src="${cam.feedUrl}" alt="${cam.name}" class="pro-stream-img" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80';" />
          ${reticleHtml}
          <div class="pro-stream-coords" title="Coordenadas geográficas estáticas">
            <i class="fa-solid fa-location-crosshairs"></i> Lat ${cam.coordinates.lat.toFixed(6)}, Lng ${cam.coordinates.lng.toFixed(6)}
          </div>
          <div class="pro-stream-specs">${cam.resolution} • ${cam.fps}fps</div>
        </div>

        <!-- Card Body -->
        <div class="pro-card-body">
          <div class="pro-title-row">
            <h3 class="pro-card-title">${cam.name}</h3>
            <span class="pro-cam-zone-tag">${cam.zone}</span>
          </div>

          <!-- Informações de Localização Estática da Câmera -->
          <div class="pro-location-bar">
            <div class="loc-main">
              <i class="fa-solid fa-location-dot loc-icon"></i>
              <div class="loc-text">
                <span class="loc-name">${cam.coordinates.zoneName}</span>
                <span class="loc-gps">Lat: ${cam.coordinates.lat.toFixed(6)} • Lng: ${cam.coordinates.lng.toFixed(6)}</span>
              </div>
            </div>
            <button class="loc-pin-btn" onclick="focusCameraOnMap('${cam.id}')" title="Ver no radar Leaflet">
              <i class="fa-solid fa-crosshairs"></i> Radar
            </button>
          </div>

          <div class="pro-diagnosis ${diagClass}">
            ${diagHeadline}
            <p>${diagMsg}</p>
          </div>
        </div>

        <!-- Card Actions -->
        <div class="pro-card-actions">
          <button class="card-btn-action" onclick="focusCameraOnMap('${cam.id}')">
            <i class="fa-solid fa-map-location-dot"></i> Ver no Mapa
          </button>
          <button class="card-btn-action btn-ai-chat" onclick="askAiAboutCamera('${cam.name}')">
            <i class="fa-solid fa-robot"></i> Consultar IA
          </button>
        </div>
      </article>
    `;
  }).join('');
}

// ==========================================================================
// Histórico de Auditoria Limpo
// ==========================================================================
function renderAuditLogs() {
  const auditContainer = document.getElementById('auditList');
  if (!auditContainer || !state.alerts.length) return;

  const recents = state.alerts.slice(0, 5);

  auditContainer.innerHTML = recents.map((alert) => {
    const isThreat = alert.isRealThreat;
    const isRestore = alert.classification === 'SYSTEM_RESTORE';
    const timeFormatted = new Date(alert.timestamp).toLocaleTimeString('pt-BR');

    let tagClass = isThreat ? 'tag-threat' : 'tag-filtered';
    let tagLabel = isThreat ? 'AMEAÇA REAL' : (isRestore ? 'RESTAURAÇÃO' : 'FILTRADO');

    return `
      <div class="audit-item">
        <div class="audit-item-left">
          <span class="audit-time">${timeFormatted}</span>
          <span class="audit-badge-tag ${tagClass}">${tagLabel}</span>
          <span class="audit-desc">
            <strong>${alert.cameraName}:</strong> ${alert.targetIdentified}
          </span>
        </div>
        <span class="audit-residents-status">
          ${alert.notifiedResidents ? '🚨 Moradores Notificados' : '🛡️ Silenciado (Sem pânico)'}
        </span>
      </div>
    `;
  }).join('');
}

// ==========================================================================
// Event Listeners
// ==========================================================================
function setupEventListeners() {
  // Segmented Control Filters
  const segBtns = document.querySelectorAll('.seg-btn');
  segBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      segBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeFilter = btn.dataset.filter;
      renderCameras();
    });
  });

  // Ciclo Automático
  const btnToggleCycle = document.getElementById('btnToggleCycle');
  btnToggleCycle?.addEventListener('click', () => {
    state.isCycleActive = !state.isCycleActive;
    if (state.isCycleActive) {
      btnToggleCycle.innerHTML = '<i class="fa-solid fa-pause"></i> Pausar Ciclo';
    } else {
      btnToggleCycle.innerHTML = '<i class="fa-solid fa-play"></i> Continuar Ciclo';
    }
  });

  document.getElementById('btnForceRestore')?.addEventListener('click', () => {
    state.cycleSeconds = 0;
    restoreBaseState();
  });

  // Simulações Rápidas
  document.getElementById('btnSimCat')?.addEventListener('click', () => triggerSimulation('gato'));
  document.getElementById('btnSimLeaf')?.addEventListener('click', () => triggerSimulation('folha'));
  document.getElementById('btnSimIntruder')?.addEventListener('click', () => triggerSimulation('invasor'));

  // Toggle Mapa Tático
  document.getElementById('btnToggleMap')?.addEventListener('click', toggleMap);
  document.getElementById('btnCloseMap')?.addEventListener('click', toggleMap);

  // Chatbot
  document.getElementById('chatbotTrigger')?.addEventListener('click', toggleChatbot);
  document.getElementById('btnMinimizeChat')?.addEventListener('click', toggleChatbot);
  document.getElementById('chatForm')?.addEventListener('submit', handleChatSubmit);

  // Quick Chips
  document.querySelectorAll('.chip-btn').forEach((chip) => {
    chip.addEventListener('click', () => {
      if (chip.dataset.question) sendChatMessage(chip.dataset.question);
    });
  });
}

function toggleMap() {
  const mapSection = document.getElementById('tacticalMapSection');
  if (mapSection) {
    mapSection.classList.toggle('collapsed');
    if (!mapSection.classList.contains('collapsed') && state.map) {
      setTimeout(() => state.map.invalidateSize(), 200);
    }
  }
}

function triggerSimulation(type) {
  const found = STATIC_CYCLE_SCENARIOS.find((s) => {
    if (type === 'gato') return s.classification === 'FALSE_POSITIVE_ANIMAL';
    if (type === 'folha') return s.classification === 'FALSE_POSITIVE_ENVIRONMENT';
    if (type === 'invasor') return s.isRealThreat === true;
    return false;
  });

  if (found) {
    applyScenario(found);
    if (found.isRealThreat) {
      openChatWithQuestion(`🚨 Alerta Crítico! A câmera ${found.cameraId} detectou um invasor real. Qual o procedimento de segurança?`);
    }
  }
}

// ==========================================================================
// Chatbot
// ==========================================================================
function toggleChatbot() {
  const chatWindow = document.getElementById('chatbotWindow');
  const badge = document.getElementById('chatNotificationBadge');

  state.isChatOpen = !state.isChatOpen;

  if (state.isChatOpen) {
    chatWindow?.classList.add('open');
    if (badge) {
      badge.style.display = 'none';
      state.unreadAlerts = 0;
    }
    setTimeout(() => document.getElementById('chatInput')?.focus(), 200);
  } else {
    chatWindow?.classList.remove('open');
  }
}

window.askAiAboutCamera = function(cameraName) {
  openChatWithQuestion(`Qual a situação atual da câmera "${cameraName}"? Houve algum falso alarme ou ameaça recente?`);
};

function openChatWithQuestion(question) {
  const chatWindow = document.getElementById('chatbotWindow');
  state.isChatOpen = true;
  chatWindow?.classList.add('open');
  sendChatMessage(question);
}

async function handleChatSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  await sendChatMessage(text);
}

async function sendChatMessage(userMessage) {
  appendBubble('user', userMessage);
  const typingId = showTypingIndicator();

  try {
    const res = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage, history: state.chatHistory })
    });

    removeTypingIndicator(typingId);

    if (res.ok) {
      const data = await res.json();
      appendBubble('bot', data.data?.reply || 'Sem resposta disponível.');
    } else {
      appendBubble('bot', getLocalSecurityReply(userMessage));
    }
  } catch (err) {
    removeTypingIndicator(typingId);
    appendBubble('bot', getLocalSecurityReply(userMessage));
  }
}

function getLocalSecurityReply(query) {
  const q = query.toLowerCase();
  if (q.includes('gato') || q.includes('animal')) {
    return `🐾 **Security Devs AI - Triagem de Felino:**
Sensor térmico identificou massa de 3.8kg no muro perimetral. **Falso positivo confirmado**. Os moradores não foram incomodados e o ciclo de monitoramento prossegue normalmente.`;
  }
  if (q.includes('folha') || q.includes('vento')) {
    return `🍃 **Security Devs AI - Filtro Ambiental:**
Rajadas de vento movimentaram folhas no corredor técnico. O algoritmo silenciou o alerta para evitar fadiga de alarmes.`;
  }
  if (q.includes('invasor') || q.includes('perigo')) {
    return `🚨 **Security Devs AI - Protocolo de Invasão:**
Silhueta humana com ferramentas cortantes no muro norte. Alarme acionado e portões travados preventivamente.`;
  }
  return `🤖 **Security Devs AI:**
Monitoramento de 6 câmeras ativo. Ciclo de testes operando a cada 5 segundos com restauração automática a cada 1 minuto.`;
}

function appendBubble(sender, text) {
  const container = document.getElementById('chatMessages');
  if (!container) return;

  state.chatHistory.push({ sender, text });
  const isUser = sender === 'user';
  const row = document.createElement('div');
  row.className = `message-row ${isUser ? 'user-row' : 'bot-row'}`;

  row.innerHTML = `
    <div class="message-bubble ${isUser ? 'user-bubble' : 'bot-bubble'}">
      <div class="bubble-header">
        <span class="${isUser ? '' : 'bot-name'}">
          ${isUser ? 'Operador' : 'Security Devs AI'}
        </span>
        <span class="bubble-time">${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div>${formatMarkdown(text)}</div>
    </div>
  `;

  container.appendChild(row);
  container.scrollTop = container.scrollHeight;
}

function showTypingIndicator() {
  const container = document.getElementById('chatMessages');
  if (!container) return null;

  const id = `typing-${Date.now()}`;
  const row = document.createElement('div');
  row.className = 'message-row bot-row';
  row.id = id;

  row.innerHTML = `
    <div class="message-bubble bot-bubble">
      <div class="typing-dots">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    </div>
  `;

  container.appendChild(row);
  container.scrollTop = container.scrollHeight;
  return id;
}

function removeTypingIndicator(id) {
  if (id) document.getElementById(id)?.remove();
}

function formatMarkdown(str) {
  if (!str) return '';
  return str
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n- /g, '<br/>• ')
    .replace(/\n/g, '<br/>');
}
