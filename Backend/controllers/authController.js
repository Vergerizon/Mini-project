// authController.js
// Controller for authentication (login, logout)
const authenticator = require('../services/authenticator');
const sessionService = require('../services/sessionService');
const { authLoginTotal } = require('../utils/metrics');

class AuthController {
    /**
     * Login user, create session and return token
     */
    async login(req, res) {
        // Check if user is already logged in
        const authHeader = req.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            authLoginTotal.inc({ result: 'already_logged_in' });
            return res.status(403).json({ message: 'Sudah login: Logout terlebih dahulu sebelum login kembali' });
        }
        
        const { email, password } = req.body;
        if (!email || !password) {
            authLoginTotal.inc({ result: 'missing_fields' });
            return res.status(400).json({ message: 'Email dan password wajib diisi' });
        }
        const user = await authenticator.verify(email, password);
        if (!user) {
            authLoginTotal.inc({ result: 'invalid_credentials' });
            return res.status(401).json({ message: 'Email atau password salah' });
        }
        const session = await sessionService.createSession(user.id);
        // Set token di header Authorization
        res.set('Authorization', 'Bearer ' + session.token);
        
        // Return user data and session info (without sensitive data)
        // id is included so the frontend can use it (e.g. for fetching own transactions)
        const { password: _, ...userWithoutPassword } = user;
        const { user_id, ...sessionWithoutUserId } = session;
        authLoginTotal.inc({ result: 'success' });
        return res.json({ 
            user: userWithoutPassword,
            session: sessionWithoutUserId 
        });
    }

    /**
     * Logout user (delete session)
     */
    async logout(req, res) {
        const token = req.headers['authorization']?.replace('Bearer ', '');
        if (!token) return res.status(400).json({ message: 'No token provided' });
        await sessionService.deleteSession(token);
        return res.json({ message: 'Logged out' });
    }
}

module.exports = new AuthController();
