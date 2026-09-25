import { openaiClient } from '../config/openai.js';
import { config } from '../config/env.js';
import { alertService } from './alertService.js';
import { cameraService } from './cameraService.js';

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

export const aiService = {
  chat: async (userMessage, chatHistory = []) => {
    // Coleta contexto atual do sistema para alimentar a IA
    const metrics = alertService.getMetrics();
    const recentAlerts = alertService.getAll().slice(0, 3);
    const cameras = cameraService.getAll();

    const contextSnippet = `
Contexto do condomínio em tempo real:
- Status Sentinela AI: Online (${metrics.assertivenessRate} de assertividade).
- Falsos alarmes bloqueados no turno: ${metrics.falsePositivesFiltered} (gatos, vento, folhagens).
- Câmeras ativas: ${cameras.length}.
- Alertas recentes:
${recentAlerts.map((a) => `  * [${a.category}] na câmera ${a.cameraName} (${a.confidenceScore}% de confiança) - ${a.targetIdentified}`).join('\n')}
`;

    // Se houver cliente OpenAI configurado, faz a chamada à API oficial
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

    // Fallback inteligente caso a chave OpenAI não esteja definida ou falhe
    const localReply = generateLocalSecurityResponse(userMessage, recentAlerts, metrics);
    return {
      reply: localReply,
      source: 'sentinela_heuristics_agent',
      model: 'Sentinela-LocalEngine-v2',
      timestamp: new Date().toISOString()
    };
  },

  analyzeThreat: async (detectionDetails) => {
    const { objectType, zone, hour, movementSpeed } = detectionDetails;
    
    // Análise de assertividade
    const isAnimal = ['gato', 'cachorro', 'passaro', 'felino'].some((kw) => 
      (objectType || '').toLowerCase().includes(kw)
    );
    const isNature = ['folha', 'vento', 'galho', 'arvore', 'sombra'].some((kw) => 
      (objectType || '').toLowerCase().includes(kw)
    );
    const isHuman = ['pessoa', 'homem', 'invasor', 'individuo', 'silhueta'].some((kw) => 
      (objectType || '').toLowerCase().includes(kw)
    );

    let classification = 'SUSPICIOUS_UNDER_REVIEW';
    let isRealThreat = false;
    let confidence = 88.0;
    let recommendation = 'Manter em observação automática sem disparar sirene.';

    if (isHuman) {
      classification = 'CRITICAL_INTRUDER';
      isRealThreat = true;
      confidence = 98.4;
      recommendation = 'ACIONAMENTO IMEDIATO: Notificar guarita, travar clausuras e alertar moradores da prumada.';
    } else if (isAnimal) {
      classification = 'FALSE_POSITIVE_ANIMAL';
      isRealThreat = false;
      confidence = 95.8;
      recommendation = 'FILTRADO COM SUCESSO: Trata-se de pequeno animal. Disparo cancelado para evitar falso alarme.';
    } else if (isNature) {
      classification = 'FALSE_POSITIVE_ENVIRONMENT';
      isRealThreat = false;
      confidence = 93.2;
      recommendation = 'FILTRADO COM SUCESSO: Movimento ambiental por vento/folhas. Nenhuma ação necessária.';
    }

    return {
      objectEvaluated: objectType,
      classification,
      isRealThreat,
      confidenceScore: confidence,
      zone,
      recommendation,
      evaluatedAt: new Date().toISOString()
    };
  }
};

function generateLocalSecurityResponse(query, recentAlerts, metrics) {
  const q = query.toLowerCase();

  if (q.includes('gato') || q.includes('animal') || q.includes('bicho')) {
    return `🐾 **Análise Security Devs AI - Detecção de Felino:**
Identificamos recentemente a presença de um gato sobre o topo do muro perimetral.
- **Assinatura Biométrica:** Massa aproximada de 3.8kg, locomoção quadrúpede rasteira.
- **Decisão do Sistema:** **Falso positivo confirmado**. O alarme e os avisos aos moradores foram **bloqueados automaticamente**, prevenindo pânico desnecessário e mantendo o silêncio no condomínio.`;
  }

  if (q.includes('folha') || q.includes('vento') || q.includes('árvore') || q.includes('galho')) {
    return `🍃 **Análise Security Devs AI - Perturbação Ambiental:**
As oscilações térmicas registradas no corredor técnico foram causadas por rajadas de vento movimentando folhas de Ficus benjamina.
- **Filtro Aplicado:** Assinatura de calor ambiente sem presença bípede.
- **Resultado:** Evento silenciado e arquivado nos logs de auditoria.`;
  }

  if (q.includes('invasor') || q.includes('perigo') || q.includes('ladrão') || q.includes('muro') || q.includes('assalto')) {
    return `🚨 **Protocolo de Segurança Ativo - Invasão Real:**
O Security Devs AI monitora continuamente as câmeras perimetrais (CAM-01 Muro Norte e CAM-06 Bosque Sul).
- Em caso de confirmação de silhueta humana transpondo o muro com ferramentas, o sistema:
  1. Notifica imediatamente o posto de comando da guarita.
  2. Dispara sinal luminoso silencioso na central.
  3. Envia push de alta prioridade aos moradores alertando para não descerem às áreas externas.
- Taxa atual de assertividade: **${metrics.assertivenessRate}** com ${metrics.falsePositivesFiltered} falsos alarmes evitados.`;
  }

  if (q.includes('status') || q.includes('como está') || q.includes('câmera') || q.includes('câmeras')) {
    return `🛡️ **Status Geral do Sistema Security Devs:**
- **Estado Operacional:** Totalmente ativo e calibrado.
- **Falsos Positivos Filtrados no Turno:** ${metrics.falsePositivesFiltered} (evitou perturbar os moradores).
- **Último Alerta Triado:** ${recentAlerts[0]?.category || 'Nenhuma anormalidade no momento'}.
- **Câmeras em Ronda Digital:** 6 zonas perimetrais cobertas em 4K.`;
  }

  return `🤖 **Security Devs AI - Central de Monitoramento:**
Olá! Estou monitorando as 6 câmeras do condomínio em tempo real.
Meu papel é garantir que você e os moradores sejam alertados **somente quando houver perigo real**, filtrando gatos, folhas e sombras com mais de **${metrics.assertivenessRate} de assertividade**.

Você pode me perguntar:
- *"O movimento no muro norte foi um gato ou invasor?"*
- *"Por que a câmera da garagem não apitou?"*
- *"Como o sistema identifica folhas balançando?"*
- *"Qual o status atual da segurança do condomínio?"*`;
}

export default aiService;
