/**
 * Centralized Prometheus metrics definitions.
 * Import individual metrics in controllers/services instead of requiring the full client.
 */
const client = require('prom-client');

// ─── HTTP ─────────────────────────────────────────────────────────────────────
const httpRequestDurationMs = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in milliseconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [50, 100, 200, 300, 400, 500, 1000, 2000, 5000]
});

const httpRequestTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// ─── Auth ─────────────────────────────────────────────────────────────────────
const authLoginTotal = new client.Counter({
  name: 'auth_login_total',
  help: 'Total login attempts',
  labelNames: ['result'] // 'success' | 'invalid_credentials' | 'already_logged_in' | 'missing_fields'
});

// ─── Transactions ─────────────────────────────────────────────────────────────
const transactionCreatedTotal = new client.Counter({
  name: 'transaction_created_total',
  help: 'Total transactions created',
  labelNames: ['result'] // 'success' | 'failed'
});

const transactionAmountTotal = new client.Counter({
  name: 'transaction_amount_total',
  help: 'Cumulative transaction amount (rupiah)',
  labelNames: ['status'] // 'SUCCESS' | 'FAILED' | 'PENDING'
});

// ─── App Info ─────────────────────────────────────────────────────────────────
const appInfo = new client.Gauge({
  name: 'app_info',
  help: 'Application info',
  labelNames: ['version', 'env']
});
// Set once on startup
appInfo.labels(process.env.npm_package_version || '1.0.0', process.env.NODE_ENV || 'development').set(1);

module.exports = {
  client,
  httpRequestDurationMs,
  httpRequestTotal,
  authLoginTotal,
  transactionCreatedTotal,
  transactionAmountTotal
};
