/**
 * Transaction Routes
 * API endpoints untuk operasi transaksi PPOB
 */

const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { idempotencyMiddleware } = require('../middleware/idempotency');
const { authMiddleware } = require('../middleware/auth');
const { 
    createTransactionValidation, 
    getTransactionValidation,
    listTransactionsValidation 
} = require('../utils/validator');

/**
 * @route   POST /api/transactions
 * @desc    Create new transaction (purchase PPOB product)
 * @access  Public
 * @header  X-Idempotency-Key (optional) - Untuk mencegah double submit
 */
// Only USER can create transaction (not ADMIN)
router.post('/', 
    authMiddleware,
    (req, res, next) => {
        if (req.user.role !== 'USER') {
            return res.status(403).json({ message: 'Forbidden: Only USER can create transaction' });
        }
        next();
    },
    idempotencyMiddleware, 
    createTransactionValidation, 
    transactionController.createTransaction
);

/**
 * @route   GET /api/transactions
 * @desc    Get all transactions with pagination and filters
 * @access  Public
 */
// Only admin can get all transactions
router.get('/', authMiddleware, (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Forbidden: Admin only' });
    }
    next();
}, listTransactionsValidation, transactionController.getTransactions);

/**
 * @route   GET /api/transactions/reference/:reference
 * @desc    Get transaction by reference number
 * @access  Public
 */
router.get('/reference/:reference', transactionController.getTransactionByReference);

/**
 * @route   GET /api/transactions/user/:userId
 * @desc    Get transactions by user
 * @access  Public
 */
// User can get their own transactions, admin can get any
router.get('/user/:userId', authMiddleware, listTransactionsValidation, (req, res, next) => {
    if (req.user.role !== 'ADMIN' && req.user.id !== parseInt(req.params.userId)) {
        return res.status(403).json({ message: 'Forbidden: Can only access own transactions' });
    }
    next();
}, transactionController.getTransactionsByUser);

/**
 * @route   GET /api/transactions/:id
 * @desc    Get transaction by ID
 * @access  Public
 */
router.get('/:id', getTransactionValidation, transactionController.getTransactionById);


/**
 * @route   PATCH /api/transactions/:id/cancel
 * @desc    Cancel transaction (only for PENDING)
 * @access  Public
 */
router.patch('/:id/cancel', getTransactionValidation, transactionController.cancelTransaction);

/**
 * @route   PATCH /api/transactions/:id/refund
 * @desc    Refund transaction (only for SUCCESS)
 * @access  Public
 */
router.patch('/:id/refund', getTransactionValidation, transactionController.refundTransaction);

/**
 * @route   DELETE /api/transactions/:id
 * @desc    Delete transaction by ID
 * @access  Public
 */
router.delete('/:id', getTransactionValidation, transactionController.deleteTransaction);

module.exports = router;
