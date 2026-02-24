/**
 * Prometheus HTTP instrumentation middleware.
 * Uses the centralized metrics registry from utils/metrics.js.
 */
const { client, httpRequestDurationMs, httpRequestTotal } = require('../utils/metrics');

// Collect default Node.js metrics (process CPU, memory, GC, event loop lag, etc.)
client.collectDefaultMetrics({ timeout: 5000 });

/**
 * Express middleware that records duration and count for every HTTP request.
 */
function prometheusMiddleware(req, res, next) {
  const startAt = process.hrtime.bigint();

  const originalEnd = res.end.bind(res);
  res.end = function (...args) {
    try {
      const durationMs = Number(process.hrtime.bigint() - startAt) / 1e6;

      // Prefer the matched route pattern (e.g. /api/users/:id) over the raw URL
      let route = req.originalUrl || req.url;
      if (req.route && req.route.path) {
        route = `${req.baseUrl || ''}${req.route.path}`;
      }

      const labels = {
        method: req.method,
        route,
        status_code: String(res.statusCode)
      };

      httpRequestDurationMs.observe(labels, durationMs);
      httpRequestTotal.inc(labels);
    } catch (_) {
      // Never let metrics collection break the response
    }

    res.end = originalEnd;
    return res.end(...args);
  };

  next();
}

module.exports = {
  client,
  middleware: prometheusMiddleware
};
