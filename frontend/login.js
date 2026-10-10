/**
 * SECURITY DEVS // SOC LOGIN CONTROLLER
 * Autenticação via Webhook n8n com payload { email, codigo_acesso }
 */

// Endpoint oficial de validação no n8n
const N8N_AUTH_WEBHOOK_URL = 
  window.__N8N_AUTH_WEBHOOK_URL__ ||
  'https://gilmar9374.app.n8n.cloud/webhook/forms';

document.addEventListener('DOMContentLoaded', () => {
  // Elementos do DOM
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('emailInput');
  const codigoAcessoInput = document.getElementById('codigoAcessoInput');
  const btnTogglePassword = document.getElementById('btnTogglePassword');
  const eyeIcon = document.getElementById('eyeIcon');
  const rememberMe = document.getElementById('rememberMe');
  const btnSubmit = document.getElementById('btnSubmit');
  const glassLoginCard = document.getElementById('glassLoginCard');

  // Elementos de Notificação
  const alertBox = document.getElementById('alertBox');
  const alertIcon = document.getElementById('alertIcon');
  const alertTitle = document.getElementById('alertTitle');
  const alertMessage = document.getElementById('alertMessage');
  const btnCloseAlert = document.getElementById('btnCloseAlert');

  // Inicializa relógio do topo
  initLiveClock();

  // Recupera e-mail salvo anteriormente
  const savedEmail = localStorage.getItem('securemonit_remember_email');
  if (savedEmail && emailInput) {
    emailInput.value = savedEmail;
  }

  // Verifica se a chamada foi um logout explícito
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('logout') === 'true') {
    localStorage.removeItem('securemonit_auth');
    showAlert('info', 'Sessão Encerrada', 'Você saiu com segurança do terminal SOC.');
  }

  // ==========================================================================
  // Alternar Visibilidade da Senha (Código de Acesso)
  // ==========================================================================
  if (btnTogglePassword && codigoAcessoInput && eyeIcon) {
    btnTogglePassword.addEventListener('click', () => {
      const isPassword = codigoAcessoInput.getAttribute('type') === 'password';
      codigoAcessoInput.setAttribute('type', isPassword ? 'text' : 'password');
      eyeIcon.classList.toggle('fa-eye', !isPassword);
      eyeIcon.classList.toggle('fa-eye-slash', isPassword);
    });
  }

  // ==========================================================================
  // Submissão do Formulário de Login
  // ==========================================================================
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const codigo_acesso = codigoAcessoInput.value;

    if (!email || !codigo_acesso) {
      showAlert('error', 'Campos Incompletos', 'Informe o e-mail corporativo e o código de acesso.');
      return;
    }

    setButtonState('loading');
    hideAlert();

    // Payload enviado com as variáveis requeridas
    const payload = {
      email: email,
      codigo_acesso: codigo_acesso
    };

    console.log('[SOC Login] Enviando credenciais ao webhook n8n:', {
      endpoint: N8N_AUTH_WEBHOOK_URL,
      payload: { email: payload.email, codigo_acesso: '***PROTEGIDO***' }
    });

    try {
      const response = await fetch(N8N_AUTH_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      let responseData = null;
      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        const textData = await response.text();
        try {
          responseData = JSON.parse(textData);
        } catch {
          responseData = { rawText: textData };
        }
      }

      console.log('[SOC Login] Resposta do webhook:', response.status, responseData);

      const isAuthorized = evaluateAuthResponse(response.status, responseData);

      if (isAuthorized.success) {
        setButtonState('success');

        if (rememberMe && rememberMe.checked) {
          localStorage.setItem('securemonit_remember_email', email);
        } else {
          localStorage.removeItem('securemonit_remember_email');
        }

        const sessionData = {
          email: email,
          operatorName: email.split('@')[0].toUpperCase(),
          loginTime: new Date().toISOString(),
          token: isAuthorized.token || 'soc_session_' + Date.now(),
          level: isAuthorized.level || 'Operador SOC'
        };
        localStorage.setItem('securemonit_auth', JSON.stringify(sessionData));

        showAlert('success', 'Acesso Autorizado', 'Credenciais validadas. Redirecionando...');

        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1000);

      } else {
        setButtonState('default');
        triggerCardShake();
        showAlert(
          'error',
          'Acesso Negado',
          isAuthorized.message || 'Código de acesso ou e-mail inválido.'
        );
      }

    } catch (err) {
      console.error('[SOC Login] Erro na requisição:', err);
      setButtonState('default');
      triggerCardShake();

      let errorMessage = 'Não foi possível conectar ao servidor de validação.';
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        errorMessage = 'Falha de conexão com o webhook. Verifique se o fluxo do n8n está ativo ou se há restrição de CORS.';
      }

      showAlert('error', 'Falha de Conexão', errorMessage);
    }
  });

  // ==========================================================================
  // Avaliação da Resposta da Validação
  // ==========================================================================
  function evaluateAuthResponse(statusCode, data) {
    const payload = Array.isArray(data) ? data[0] : (data || {});

    if (statusCode === 401 || statusCode === 403) {
      return {
        success: false,
        message: payload.message || payload.error || 'Credenciais não autorizadas.'
      };
    }

    if (statusCode === 404) {
      return {
        success: false,
        message: 'Endpoint de webhook não encontrado no n8n. Verifique se o fluxo está ativo.'
      };
    }

    if (statusCode >= 200 && statusCode < 300) {
      if (
        payload.authenticated === false ||
        payload.success === false ||
        payload.autorizado === false ||
        payload.authorized === false
      ) {
        return {
          success: false,
          message: payload.message || payload.error || 'Código de acesso incorreto.'
        };
      }

      return {
        success: true,
        token: payload.token,
        level: payload.level || payload.role
      };
    }

    if (statusCode === 500) {
      if (typeof payload.message === 'string' && payload.message.includes('No Respond to Webhook node found')) {
        return {
          success: false,
          message: 'Fluxo n8n ativo, porém falta o nó "Respond to Webhook" no n8n (ou altere o nó Webhook para Respond: Immediately).'
        };
      }
      return {
        success: false,
        message: payload.message || 'Erro interno no fluxo do n8n (HTTP 500).'
      };
    }

    return {
      success: false,
      message: payload.message || `O servidor retornou o status HTTP ${statusCode}.`
    };
  }

  // ==========================================================================
  // Funções Utilitárias: Alertas, Estados e Relógio
  // ==========================================================================
  function showAlert(type, title, message) {
    if (!alertBox) return;
    alertBox.className = `alert-box alert-${type}`;
    if (alertTitle) alertTitle.textContent = title;
    if (alertMessage) alertMessage.textContent = message;

    const iconMap = {
      error: 'fa-circle-exclamation',
      warning: 'fa-triangle-exclamation',
      success: 'fa-circle-check',
      info: 'fa-circle-info'
    };
    if (alertIcon) {
      alertIcon.innerHTML = `<i class="fa-solid ${iconMap[type] || 'fa-circle-info'}"></i>`;
    }
    alertBox.style.display = 'flex';
  }

  function hideAlert() {
    if (alertBox) alertBox.style.display = 'none';
  }

  if (btnCloseAlert) {
    btnCloseAlert.addEventListener('click', hideAlert);
  }

  function setButtonState(state) {
    if (!btnSubmit) return;
    const defaultContent = btnSubmit.querySelector('.default-content');
    const loadingContent = btnSubmit.querySelector('.loading-content');
    const successContent = btnSubmit.querySelector('.success-content');

    if (defaultContent) defaultContent.style.display = 'none';
    if (loadingContent) loadingContent.style.display = 'none';
    if (successContent) successContent.style.display = 'none';
    btnSubmit.classList.remove('btn-success');

    if (state === 'loading') {
      if (loadingContent) loadingContent.style.display = 'flex';
      btnSubmit.disabled = true;
      if (emailInput) emailInput.disabled = true;
      if (codigoAcessoInput) codigoAcessoInput.disabled = true;
    } else if (state === 'success') {
      if (successContent) successContent.style.display = 'flex';
      btnSubmit.classList.add('btn-success');
      btnSubmit.disabled = true;
    } else {
      if (defaultContent) defaultContent.style.display = 'flex';
      btnSubmit.disabled = false;
      if (emailInput) emailInput.disabled = false;
      if (codigoAcessoInput) codigoAcessoInput.disabled = false;
    }
  }

  function triggerCardShake() {
    if (!glassLoginCard) return;
    glassLoginCard.classList.remove('shake-card');
    void glassLoginCard.offsetWidth;
    glassLoginCard.classList.add('shake-card');
    setTimeout(() => {
      glassLoginCard.classList.remove('shake-card');
    }, 500);
  }

  function initLiveClock() {
    const clockEl = document.getElementById('liveClock');
    if (!clockEl) return;
    function update() {
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString('pt-BR', { hour12: false });
    }
    update();
    setInterval(update, 1000);
  }
});
