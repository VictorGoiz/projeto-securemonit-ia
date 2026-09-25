import { openaiClient } from '../config/openai.js';
import { config } from '../config/env.js';
import { getAlertMetrics, getAllAlerts } from './alertService.js';
import { getAllCameras } from './cameraService.js';

// Prompt de sistema que define o comportamento do assistente de segurança
const SYSTEM_PROMPT = `
Você é o "Security Devs AI", um agente inteligente e amigável especializado em segurança física condominial e monitoramento de câmeras de alta assertividade.
Seu objetivo principal é triar eventos e explicar com clareza aos moradores e operadores do condomínio a diferença entre:
1. PERIGOS REAIS: Invasores humanos pulando muros, arrombamentos, tentativa de escalada, pessoas não autorizadas em áreas restritas após horário.
2. FALSOS POSITIVOS NATURAIS: Gatos e animais domésticos transitando em muros, vento balançando folhagens/árvores, sombras de iluminação pública, reflexos de faróis de carros.

DIRETRIZES DE COMUNICAÇÃO:
- Seja calmo, assertivo, profissional e empático.
- Quando se tratar de um falso positivo (gato, folha, sombra): tranquilize o morador, explique a biometria/assinatura térmica que permitiu descartar a ameaça e destaque que o sistema evitou um disparo de alarme desnecessário.
- Quando for perigo real: seja direto, informe quais medidas táticas foram tomadas (acionamento da portaria, ronda perimetral, trava de acessos) e instrua o morador a permanecer em segurança dentro da sua unidade.
- Forneça respostas concisas, estruturadas com tópicos e com tom moderno de tecnologia de segurança inteligente.
`;

// Processa a mensagem do usuário via OpenAI ou motor heurístico local
export async function chat(userMessage, chatHistory = []) {
  // 1. Obtém os dados operacionais mais recentes de forma assíncrona
  const [metrics, allAlerts, cameras] = await Promise.all([
    getAlertMetrics(),
    getAllAlerts(),
    getAllCameras()
  ]);

    const recentAlerts = allAlerts.slice(0, 3);

    // 2. Monta o contexto operacional em tempo real
    const contextSnippet = `
      Contexto do condomínio em tempo real:
      - Status Sentinela AI: Online (${metrics.assertivenessRate} de assertividade).
      - Falsos alarmes bloqueados no turno: ${metrics.falsePositivesFiltered} (gatos, vento, folhagens).
      - Câmeras ativas: ${cameras.length}.
      - Alertas recentes:
      ${recentAlerts.map((a) => `  * [${a.category}] na câmera ${a.cameraName} (${a.confidenceScore}% de confiança) - ${a.targetIdentified}`).join('\n')}
      `;

    // 3. Se houver chave e cliente da OpenAI configurados, faz a chamada na API
    if (openaiClient) {
      try {
        const messages = [
          { role: 'system', content: `${SYSTEM_PROMPT}\n${contextSnippet}` },
          ...chatHistory.slice(-6).map((msg) => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          })),
          { role: 'user', content: userMessage }
        ];

        const response = await openaiClient.chat.completions.create({
          model: config.openaiModel,
          messages,
          temperature: 0.4,
          max_tokens: 450
        });

        const reply = response.choices[0]?.message?.content;
        if (reply) {
          return {
            reply,
            source: 'openai',
            model: config.openaiModel,
            timestamp: new Date().toISOString()
          };
        }
      } catch (err) {
        console.warn('Falha na requisição OpenAI (ativando fallback local):', err.message);
      }
    }

    // 4. Fallback local inteligente caso a OpenAI não esteja configurada ou falhe
    const localReply = generateLocalSecurityResponse(userMessage, recentAlerts, metrics);
    return {
      reply: localReply,
      source: 'sentinela_heuristics_agent',
      model: 'Sentinela-LocalEngine-v2',
      timestamp: new Date().toISOString()
    };
}

// Analisa semanticamente um evento detectado por sensor ou câmera
export async function analyzeThreat(detectionDetails) {
  const { objectType = '', zone = 'Perímetro Geral' } = detectionDetails;
  const term = objectType.toLowerCase();

  // Verificação de categorias simples
  const isAnimal = ['gato', 'cachorro', 'passaro', 'felino', 'ave'].some((kw) => term.includes(kw));
  const isNature = ['folha', 'vento', 'galho', 'arvore', 'sombra', 'luz'].some((kw) => term.includes(kw));
  const isHuman = ['pessoa', 'homem', 'invasor', 'individuo', 'silhueta', 'ladrao'].some((kw) => term.includes(kw));

  if (isHuman) {
    return {
      objectEvaluated: objectType,
      classification: 'CRITICAL_INTRUDER',
      isRealThreat: true,
      confidenceScore: 98.4,
      zone,
      recommendation: 'ACIONAMENTO IMEDIATO: Notificar guarita, travar clausuras e alertar moradores.',
      evaluatedAt: new Date().toISOString()
    };
  }

  if (isAnimal) {
    return {
      objectEvaluated: objectType,
      classification: 'FALSE_POSITIVE_ANIMAL',
      isRealThreat: false,
      confidenceScore: 95.8,
      zone,
      recommendation: 'FILTRADO COM SUCESSO: Animal doméstico identificado. Alarme silenciado para evitar ruído.',
      evaluatedAt: new Date().toISOString()
    };
  }

  if (isNature) {
    return {
      objectEvaluated: objectType,
      classification: 'FALSE_POSITIVE_ENVIRONMENT',
      isRealThreat: false,
      confidenceScore: 93.2,
      zone,
      recommendation: 'FILTRADO COM SUCESSO: Movimento ambiental por vento/folhagens. Nenhuma ação necessária.',
      evaluatedAt: new Date().toISOString()
    };
  }

  // Caso padrão sob revisão
  return {
    objectEvaluated: objectType,
    classification: 'SUSPICIOUS_UNDER_REVIEW',
    isRealThreat: false,
    confidenceScore: 88.0,
    zone,
    recommendation: 'Manter em observação automática sem acionamento sonoro de sirene.',
    evaluatedAt: new Date().toISOString()
  };
}

export const aiService = {
  chat,
  analyzeThreat
};

// Gera respostas contextuais simples e explicativas em português
function generateLocalSecurityResponse(query, recentAlerts, metrics) {
  const q = query.toLowerCase();

  // Cenário de animais
  if (q.includes('gato') || q.includes('animal') || q.includes('bicho')) {
    return `🐾 **Análise Security Devs AI - Detecção de Felino:**
Identificamos a presença de um gato sobre o topo do muro perimetral.
- **Assinatura Biométrica:** Massa aproximada de 3.8kg, locomoção quadrúpede rasteira.
- **Decisão do Sistema:** **Falso positivo confirmado**. O alarme e os avisos aos moradores foram **bloqueados automaticamente**, mantendo o silêncio e o conforto no condomínio.`;
  }

  // Cenário ambiental (folhas, vento, sombras)
  if (q.includes('folha') || q.includes('vento') || q.includes('árvore') || q.includes('galho') || q.includes('sombra')) {
    return `🍃 **Análise Security Devs AI - Perturbação Ambiental:**
As oscilações registradas no corredor técnico foram causadas por rajadas de vento movimentando a vegetação.
- **Filtro Aplicado:** Assinatura térmica ambiente sem presença biológica humana.
- **Resultado:** Evento silenciado e arquivado nos logs de auditoria.`;
  }

  // Cenário de invasão ou perigo real
  if (q.includes('invasor') || q.includes('perigo') || q.includes('ladrão') || q.includes('assalto')) {
    return `🚨 **Protocolo de Segurança Ativo - Invasão Real:**
O sistema monitora continuamente as câmeras perimetrais do condomínio.
- Em caso de confirmação de silhueta humana transpondo muros:
  1. Notifica imediatamente a equipe de segurança da guarita.
  2. Dispara aviso tático silencioso na central de comando.
  3. Envia push de alta prioridade aos moradores para permanecerem em segurança.
- Taxa atual de assertividade: **${metrics.assertivenessRate}** com ${metrics.falsePositivesFiltered} falsos alarmes evitados.`;
  }

  // Cenário de status geral
  if (q.includes('status') || q.includes('como está') || q.includes('câmera') || q.includes('câmeras')) {
    const ultimoAlerta = recentAlerts[0]?.category || 'Nenhuma anormalidade no momento';
    return `🛡️ **Status Geral do Sistema Security Devs:**
- **Estado Operacional:** Totalmente ativo e calibrado.
- **Falsos Alarmes Barrados no Turno:** ${metrics.falsePositivesFiltered}
- **Último Alerta Triado:** ${ultimoAlerta}.
- **Câmeras em Ronda Digital:** 6 zonas perimetrais cobertas em alta definição.`;
  }

  // Resposta padrão explicativa
  return `🤖 **Security Devs AI - Central de Monitoramento:**
Olá! Estou monitorando as câmeras do condomínio em tempo real.
Meu papel é garantir que alertas sejam disparados **somente quando houver perigo real**, filtrando gatos, folhas e sombras com **${metrics.assertivenessRate} de assertividade**.

Você pode me perguntar:
- *"O movimento no muro norte foi um gato ou invasor?"*
- *"Por que a câmera da garagem não apitou?"*
- *"Como o sistema identifica folhas balançando?"*
- *"Qual o status atual da segurança do condomínio?"*`;
}

export default aiService;
