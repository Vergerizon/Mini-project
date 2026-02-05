// sessionService.js
// Service for session management (create, validate, delete)
const { pool } = require('../database/config');
const crypto = require('crypto');

class SessionService {
    /**
     * Create a new session for user
     * @param {number} userId
     * @param {number} expiresInSeconds (default 7 days)
     * @returns {object} session { session_id, user_id, token, created_at, expired_at }
     */
    async createSession(userId, expiresInSeconds = 7 * 24 * 60 * 60) {
        const session_id = crypto.randomUUID();
        const token = crypto.randomBytes(32).toString('hex');
        const now = new Date();
        const expired_at = new Date(now.getTime() + expiresInSeconds * 1000);
        await pool.query(
            'INSERT INTO sessions (session_id, user_id, token, created_at, expired_at) VALUES (?, ?, ?, ?, ?)',
            [session_id, userId, token, now, expired_at]
        );
        return { session_id, user_id: userId, token, created_at: now, expired_at };
    }

    /**
     * Validate session token
     */
    async getSessionByToken(token) {
        const [rows] = await pool.query(
            'SELECT * FROM sessions WHERE token = ?',
            [token]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    /**
     * Delete session by token
     */
    async deleteSession(token) {
        await pool.query('DELETE FROM sessions WHERE token = ?', [token]);
        return true;
    }
}

module.exports = new SessionService();
