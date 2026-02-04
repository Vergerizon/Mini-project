/**
 * Logging Middleware
 * Mencatat operasi POST, PATCH/PUT, dan DELETE ke database
 */

const { pool } = require('../database/config');

/**
 * Middleware untuk logging operasi ke database
 * Hanya mencatat operasi POST, PATCH, PUT, dan DELETE
 */
const loggingMiddleware = (req, res, next) => {
    // Hanya log untuk method POST, PUT, PATCH, DELETE
    const methodsToLog = ['POST', 'PUT', 'PATCH', 'DELETE'];
    
    if (!methodsToLog.includes(req.method)) {
        return next();
    }

    console.log(`[LOGGING] Intercepting ${req.method} ${req.originalUrl || req.url}`);

    // Simpan response asli
    const originalSend = res.send;
    const originalJson = res.json;
    
    let responseBody = null;

    // Override res.send
    res.send = function(body) {
        responseBody = body;
        return originalSend.call(this, body);
    };

    // Override res.json
    res.json = function(body) {
        responseBody = JSON.stringify(body);
        return originalJson.call(this, body);
    };

    // Setelah response selesai, simpan log ke database
    res.on('finish', async () => {
        console.log(`[LOGGING] Response finished for ${req.method} ${req.originalUrl || req.url}, status: ${res.statusCode}`);
        try {
            // Kumpulkan pihak-pihak yang terlibat
            let involvedParties = {
                user_id: req.user?.id || null,           // User yang melakukan operasi
                user_email: req.user?.email || null,     // Email user
                user_role: req.user?.role || null,       // Role user
                ip_address: req.ip || req.connection?.remoteAddress || null,
                user_agent: req.get('User-Agent') || null
            };

            // Jika ada user_id tapi tidak ada email, query dari database
            if (involvedParties.user_id && !involvedParties.user_email) {
                try {
                    const [userRows] = await pool.execute(
                        'SELECT email FROM users WHERE id = ?',
                        [involvedParties.user_id]
                    );
                    if (userRows.length > 0) {
                        involvedParties.user_email = userRows[0].email;
                    }
                } catch (dbError) {
                    // Jika query gagal, lanjutkan dengan email null
                    console.error('Error fetching user email:', dbError.message);
                }
            }

            // Tambahkan target_id jika ada di params
            if (req.params.id) {
                involvedParties.target_id = req.params.id;
            }
            if (req.params.userId) {
                involvedParties.target_user_id = req.params.userId;
            }
            if (req.params.productId) {
                involvedParties.target_product_id = req.params.productId;
            }
            if (req.params.categoryId) {
                involvedParties.target_category_id = req.params.categoryId;
            }
            if (req.params.transactionId) {
                involvedParties.target_transaction_id = req.params.transactionId;
            }

            // Siapkan data untuk insert
            const logData = {
                involved_parties: JSON.stringify(involvedParties),
                operation_type: req.method,
                http_status_code: res.statusCode,
                response: truncateResponse(responseBody),
                endpoint: req.originalUrl || req.url
            };

            // Insert ke database
            const query = `
                INSERT INTO logs (involved_parties, operation_type, http_status_code, response, endpoint)
                VALUES (?, ?, ?, ?, ?)
            `;

            await pool.execute(query, [
                logData.involved_parties,
                logData.operation_type,
                logData.http_status_code,
                logData.response,
                logData.endpoint
            ]);

            console.log(`[LOGGING] ✓ Log saved to database for ${req.method} ${req.originalUrl || req.url}`);

        } catch (error) {
            // Jangan sampai error logging mengganggu response ke client
            console.error('Error saving log to database:', error.message);
        }
    });

    next();
};

/**
 * Truncate response jika terlalu panjang
 * @param {string} response - Response body
 * @param {number} maxLength - Maximum length (default: 5000)
 * @returns {string} - Truncated response
 */
const truncateResponse = (response, maxLength = 5000) => {
    if (!response) return null;
    
    const responseStr = typeof response === 'string' ? response : JSON.stringify(response);
    
    if (responseStr.length > maxLength) {
        return responseStr.substring(0, maxLength) + '... [TRUNCATED]';
    }
    
    return responseStr;
};

/**
 * Service untuk query logs dari database
 */
const LogService = {
    /**
     * Ambil semua logs dengan pagination
     */
    async getAllLogs(page = 1, limit = 20, filters = {}) {
        try {
            let query = 'SELECT * FROM logs WHERE 1=1';
            const params = [];

            if (filters.operation_type) {
                query += ' AND operation_type = ?';
                params.push(filters.operation_type);
            }

            if (filters.http_status_code) {
                query += ' AND http_status_code = ?';
                params.push(filters.http_status_code);
            }

            if (filters.endpoint) {
                query += ' AND endpoint LIKE ?';
                params.push(`%${filters.endpoint}%`);
            }

            if (filters.start_date) {
                query += ' AND created_at >= ?';
                params.push(filters.start_date);
            }

            if (filters.end_date) {
                query += ' AND created_at <= ?';
                params.push(filters.end_date);
            }

            // Count total
            const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
            const [countResult] = await pool.execute(countQuery, params);
            const total = countResult[0].total;

            // Add pagination
            const offset = (page - 1) * limit;
            query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
            params.push(limit, offset);

            const [rows] = await pool.execute(query, params);

            return {
                data: rows,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            throw error;
        }
    },

    /**
     * Ambil log berdasarkan ID
     */
    async getLogById(id) {
        try {
            const [rows] = await pool.execute('SELECT * FROM logs WHERE id = ?', [id]);
            return rows[0] || null;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Ambil logs berdasarkan user ID
     */
    async getLogsByUserId(userId, page = 1, limit = 20) {
        try {
            const query = `
                SELECT * FROM logs 
                WHERE JSON_EXTRACT(involved_parties, '$.user_id') = ?
                ORDER BY created_at DESC
                LIMIT ? OFFSET ?
            `;
            const offset = (page - 1) * limit;
            const [rows] = await pool.execute(query, [userId, limit, offset]);

            // Count total
            const [countResult] = await pool.execute(
                `SELECT COUNT(*) as total FROM logs WHERE JSON_EXTRACT(involved_parties, '$.user_id') = ?`,
                [userId]
            );

            return {
                data: rows,
                pagination: {
                    page,
                    limit,
                    total: countResult[0].total,
                    totalPages: Math.ceil(countResult[0].total / limit)
                }
            };
        } catch (error) {
            throw error;
        }
    },

    /**
     * Hapus logs yang lebih tua dari X hari
     */
    async deleteOldLogs(days = 30) {
        try {
            const [result] = await pool.execute(
                'DELETE FROM logs WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)',
                [days]
            );
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = { loggingMiddleware, LogService };
