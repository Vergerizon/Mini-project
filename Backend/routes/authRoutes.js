// authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const configController = require('../controllers/configController');
const { authMiddleware } = require('../middleware/auth');

router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Returns navigation items + permissions based on the authenticated user's role
router.get('/config', authMiddleware, configController.getConfig);

module.exports = router;
