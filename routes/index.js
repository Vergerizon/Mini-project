/**
 * Routes Index
 * Central routing configuration
 */

const express = require('express');
const router = express.Router();


const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const transactionRoutes = require('./transactionRoutes');
const reportRoutes = require('./reportRoutes');

// API Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/transactions', transactionRoutes);
router.use('/reports', reportRoutes);

// Import database config for health check
const { pool } = require('../database/config');

// Health check endpoint
router.get('/health', async (req, res) => {
    const startTime = Date.now();
    let dbStatus = 'disconnected';
    let dbLatency = null;
    
    try {
        // Test database connection
        const dbStart = Date.now();
        await pool.query('SELECT 1');
        dbLatency = Date.now() - dbStart;
        dbStatus = 'connected';
    } catch (error) {
        dbStatus = 'error';
    }
    
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    
    res.json({
        success: true,
        message: 'DigiWallet PPOB API is running',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        uptime: {
            seconds: Math.floor(uptime),
            formatted: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`
        },
        database: {
            status: dbStatus,
            latency_ms: dbLatency
        },
        memory: {
            heap_used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
            heap_total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
            rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`
        },
        system: {
            node_version: process.version,
            platform: process.platform,
            pid: process.pid
        },
        response_time_ms: Date.now() - startTime
    });
});

module.exports = router;
