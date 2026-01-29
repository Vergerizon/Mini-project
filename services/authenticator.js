// authenticator.js
// Logic for verifying user credentials (email + password)
const userService = require('./userService');
const bcrypt = require('bcryptjs');

class Authenticator {
    /**
     * Verify user credentials
     * @param {string} email
     * @param {string} password
     * @returns {object|null} user if valid, null if not
     */
    async verify(email, password) {
        const user = await userService.getUserByEmail(email);
        if (!user) return null;
        const match = await bcrypt.compare(password, user.password);
        if (!match) return null;
        return user;
    }
}

module.exports = new Authenticator();
