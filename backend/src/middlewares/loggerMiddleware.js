/**
 * SECURITY DEVS // Middleware de Telemetria e Logs HTTP
 * Formatado para streaming em tempo real no dashboard do Render
 */

export function requestLogger(req, res, next) {
  const startTime = Date.now();
  const { method, originalUrl } = req;
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

  // Registra o evento quando a resposta HTTP for completamente enviada
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    // Indicador visual de status para rápida triagem nos logs do Render
    let statusEmoji = '🟢';
    if (statusCode >= 500) statusEmoji = '🔴';
    else if (statusCode >= 400) statusEmoji = '🟡';
    else if (statusCode >= 300) statusEmoji = '🔵';

    const timestamp = new Date().toISOString();
    console.log(
      `[LOG-HTTP] ${timestamp} | ${statusEmoji} ${method.padEnd(6)} ${originalUrl.padEnd(25)} | ` +
      `Status: ${statusCode} | ${duration}ms | IP: ${clientIp}`
    );
  });

  next();
}

export default requestLogger;
