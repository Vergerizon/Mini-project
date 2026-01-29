// authentication.js
// Middleware for session authentication only (tanpa cek role)
const { pool } = require('../database/config');

async function authenticationMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    const token = authHeader.replace('Bearer ', '');
    const [sessions] = await pool.query(
        'SELECT s.*, u.role FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.token = ?',
        [token]
    );
    if (sessions.length === 0) {
        return res.status(401).json({ message: 'Unauthorized: Invalid session' });
    }
    const session = sessions[0];
    const now = new Date();
    const expiredAt = new Date(session.expired_at);
    if (expiredAt < now) {
        const diffMs = now - expiredAt;
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        if (diffDays > 7) {
            return res.status(403).json({ message: 'Session expired and user blocked (expired > 7 days)' });
        }
        return res.status(403).json({ message: 'Session expired' });
    }
    req.user = { id: session.user_id, role: session.role };
    req.session = session;
    next();
}

module.exports = { authenticationMiddleware };
