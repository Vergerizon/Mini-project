/**
 * Idempotency Middleware
 * Mencegah double submit transaksi
 */

const { errorResponse, HTTP_STATUS, ERROR_MESSAGES } = require('../utils/respons');

// In-memory store untuk idempotency keys
const idempotencyStore = new Map();
const processingKeys = new Set();

// Configuration
const CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour
const KEY_EXPIRATION_TIME = 10 * 60 * 1000; // 10 minutes

/**
 * Cleanup expired keys periodically
 */
setInterval(() => {
    const now = Date.now();
    for (const [key, data] of idempotencyStore.entries()) {
        if (now - data.timestamp > KEY_EXPIRATION_TIME) {
            idempotencyStore.delete(key);
        }
    }
}, CLEANUP_INTERVAL);

/**
 * Check if idempotency key exists and return cached response
 * @param {string} key - Idempotency key
 * @returns {object|null} - Cached response or null
 */
const checkIdempotencyKey = (key) => {
    if (!key) return null;
    
    const cached = idempotencyStore.get(key);
    if (cached) {
        return cached.response;
    }
    return null;
};

/**
 * Store response with idempotency key
 * @param {string} key - Idempotency key
 * @param {object} response - Response to cache
 */
const storeIdempotencyKey = (key, response) => {
    if (!key) return;
    
    idempotencyStore.set(key, {
        response: response,
        timestamp: Date.now()
    });
};

/**
 * Acquire lock for processing key
 * @param {string} key - Idempotency key
 * @returns {boolean} - True if lock acquired, false if already locked
 */
const acquireLock = (key) => {
    if (!key) return true;
    
    if (processingKeys.has(key)) {
        return false; // Lock already acquired by another request
    }
    processingKeys.add(key);
    return true; // Lock acquired successfully
};

/**
 * Release lock for processing key
 * @param {string} key - Idempotency key
 */
const releaseLock = (key) => {
    if (key) {
        processingKeys.delete(key);
    }
};

/**
 * Idempotency Middleware
 * Checks for idempotency key in request header and prevents duplicate processing
 */
const idempotencyMiddleware = (req, res, next) => {
    const idempotencyKey = req.headers['x-idempotency-key'];
    
    // If no idempotency key provided, proceed normally
    if (!idempotencyKey) {
        return next();
    }
    
    // Check if we already have a cached response
    const cachedResponse = checkIdempotencyKey(idempotencyKey);
    if (cachedResponse) {
        return res.status(cachedResponse.statusCode).json(cachedResponse.body);
    }
    
    // Try to acquire lock
    if (!acquireLock(idempotencyKey)) {
        return errorResponse(
            res,
            ERROR_MESSAGES.DUPLICATE_TRANSACTION,
            HTTP_STATUS.CONFLICT
        );
    }
    
    // Store original json method
    const originalJson = res.json.bind(res);
    
    // Override json method to cache response
    res.json = (body) => {
        storeIdempotencyKey(idempotencyKey, {
            statusCode: res.statusCode,
            body: body
        });
        releaseLock(idempotencyKey);
        return originalJson(body);
    };
    
    // Ensure lock is released even if response is not sent via json
    res.on('finish', () => {
        releaseLock(idempotencyKey);
    });
    
    next();
};

module.exports = {
    checkIdempotencyKey,
    storeIdempotencyKey,
    acquireLock,
    releaseLock,
    idempotencyMiddleware
};