// authController.js
// Controller for authentication (login, logout)
const authenticator = require('../services/authenticator');
const sessionService = require('../services/sessionService');

class AuthController {
    /**
     * Login user, create session and return token
     */
    async login(req, res) {
        // Check if user is already logged in
        const authHeader = req.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return res.status(403).json({ message: 'Sudah login: Logout terlebih dahulu sebelum login kembali' });
        }
        
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email dan password wajib diisi' });
        }
        const user = await authenticator.verify(email, password);
        if (!user) {
            return res.status(401).json({ message: 'Email atau password salah' });
        }
        const session = await sessionService.createSession(user.id);
        // Set token di header Authorization
        res.set('Authorization', 'Bearer ' + session.token);
        
        // Hide user_id from response
        const { user_id, ...sessionWithoutUserId } = session;
        
        return res.json({ session: sessionWithoutUserId });
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
