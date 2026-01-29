// Admin only: set user role (moved after router initialization)
/**
 * User Routes
 * API endpoints untuk operasi user
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { 
    createUserValidation, 
    updateUserValidation, 
    getUserValidation,
    listUsersValidation 
} = require('../utils/validator');
const { authMiddleware } = require('../middleware/auth');

/**
 * @route   POST /api/users
 * @desc    Create new user
 * @access  Public
 */
router.post('/', createUserValidation, userController.createUser);

/**
 * @route   GET /api/users
 * @desc    Get all users with pagination
 * @access  Public
 */
// Only admin can get all users
router.get('/', authMiddleware, (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Forbidden: Admin only' });
    }
    next();
}, listUsersValidation, userController.getUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Public
 */
// User can get own data, admin can get any
router.get('/:id', authMiddleware, getUserValidation, (req, res, next) => {
    if (req.user.role !== 'ADMIN' && req.user.id !== parseInt(req.params.id)) {
        return res.status(403).json({ message: 'Forbidden: Can only access own data' });
    }
    next();
}, userController.getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Public
 */
// User can update own data, admin can update any except password/email
router.put('/:id', authMiddleware, updateUserValidation, (req, res, next) => {
    if (req.user.role !== 'ADMIN' && req.user.id !== parseInt(req.params.id)) {
        return res.status(403).json({ message: 'Forbidden: Can only update own data' });
    }
    // Admin cannot update password/email
    if (req.user.role === 'ADMIN' && (req.body.password || req.body.email)) {
        return res.status(403).json({ message: 'Admin cannot change user password or email' });
    }
    next();
}, userController.updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Public
 */
// Only admin can delete users
router.delete('/:id', authMiddleware, (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Forbidden: Admin only' });
    }
    next();
}, getUserValidation, userController.deleteUser);

/**
 * @route   POST /api/users/:id/topup
 * @desc    Add balance to user (Top Up)
 * @access  Public
 */
// Only admin can top up user balance
router.post('/:id/topup', authMiddleware, (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Forbidden: Admin only' });
    }
    next();
}, getUserValidation, userController.topUpBalance);

// Admin only: set user role
router.patch('/:id/role', authMiddleware, (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Forbidden: Admin only' });
    }
    next();
}, userController.setUserRole);

module.exports = router;
