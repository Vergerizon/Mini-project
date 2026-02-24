/**
 * DigiWallet PPOB Backend Application
 * Main entry point
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const routes = require('./routes');
const { testConnection } = require('./database/config');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');
const { loggingMiddleware } = require('./middleware/logging');
const prometheus = require('./middleware/prometheus');
const { startScheduler } = require('./services/schedulerService');

// Initialize Express app
const app = express();

// =============================================
// MIDDLEWARE CONFIGURATION
// =============================================

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Idempotency-Key'],
    exposedHeaders: ['Authorization']
}));

// Request logging - custom format to exclude Authorization header
if (process.env.NODE_ENV !== 'test') {
    // Custom morgan format that excludes Authorization header
    morgan.token('auth-header', (req) => {
        return req.headers.authorization ? '***REDACTED***' : 'none';
    });
    
    app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting - prevent abuse
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Terlalu banyak request, silakan coba lagi nanti',
        timestamp: new Date().toISOString()
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Apply rate limiting to API routes
app.use('/api', limiter);

// Logging middleware untuk POST, PUT, PATCH, DELETE
// HARUS ditempatkan SEBELUM routes agar bisa intercept response
app.use(loggingMiddleware);

// Prometheus metrics middleware - collect HTTP metrics
app.use(prometheus.middleware);

// =============================================
// API ROUTES
// =============================================

// API routes
app.use('/api', routes);

// Expose Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', prometheus.client.register.contentType);
        res.end(await prometheus.client.register.metrics());
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to DigiWallet PPOB API',
        version: '1.0.0',
        documentation: '/api/docs',
        endpoints: {
            health: '/api/health',
            users: '/api/users',
            products: '/api/products',
            categories: '/api/categories',
            transactions: '/api/transactions',
            reports: '/api/reports'
        },
        timestamp: new Date().toISOString()
    });
});

// =============================================
// ERROR HANDLING
// =============================================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(globalErrorHandler);

// =============================================
// SERVER STARTUP
// =============================================

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || 'localhost';

const startServer = async () => {
    try {
        // Test database connection
        await testConnection();
        
        // Start server
        app.listen(PORT, () => {
            console.log('='.repeat(50));
            console.log('DigiWallet PPOB API Server');
            console.log('='.repeat(50));
            console.log(`Server running on http://${HOST}:${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log('='.repeat(50));
            console.log('Available Endpoints:');
            console.log(`  - Users:        http://${HOST}:${PORT}/api/users`);
            console.log(`  - Categories:   http://${HOST}:${PORT}/api/categories`);
            console.log(`  - Products:     http://${HOST}:${PORT}/api/products`);
            console.log(`  - Transactions: http://${HOST}:${PORT}/api/transactions`);
            console.log(`  - Reports:      http://${HOST}:${PORT}/api/reports`);
            console.log(`  - Health:       http://${HOST}:${PORT}/api/health`);
            console.log(`  - Metrics:      http://${HOST}:${PORT}/metrics`);
            console.log('='.repeat(50));

            // Start background scheduler (auto-complete PENDING transactions after 1 minute)
            startScheduler();
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

// Start the server
startServer();

module.exports = app;
