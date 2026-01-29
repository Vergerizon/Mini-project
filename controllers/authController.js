// authController.js
// Controller for authentication (login, logout)
const authenticator = require('../services/authenticator');
const sessionService = require('../services/sessionService');

class AuthController {
    /**
     * Login user, create session and return token
     */
    async login(req, res) {
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
        return res.json({ session });
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
