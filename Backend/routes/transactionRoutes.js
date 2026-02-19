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
            return res.status(403).json({ message: 'Tidak memiliki wewenang: Hanya user yang dapat membuat transaksi' });
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
        return res.status(403).json({ message: 'Tidak memiliki wewenang: Hanya admin yang dapat melihat semua transaksi' });
    }
    next();
}, listTransactionsValidation, transactionController.getTransactions);

/**
 * @route   GET /api/transactions/me
 * @desc    Get transactions for the currently logged-in user (no userId needed in URL)
 * @access  Private (any authenticated user)
 */
router.get('/me', authMiddleware, listTransactionsValidation, (req, res, next) => {
    req.params.userId = req.user.id;
    next();
}, transactionController.getTransactionsByUser);

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
        return res.status(403).json({ message: 'Tidak memiliki wewenang: Hanya dapat melihat transaksi sendiri' });
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
 * @route   PATCH /api/transactions/:id/complete
 * @desc    Complete transaction (mark as SUCCESS) - Admin only
 * @access  Admin only
 */
router.patch('/:id/complete', authMiddleware, (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Tidak memiliki wewenang: Hanya admin yang dapat menyelesaikan transaksi' });
    }
    next();
}, getTransactionValidation, transactionController.completeTransaction);

/**
 * @route   DELETE /api/transactions/:id
 * @desc    Delete transaction by ID
 * @access  Public
 */
router.delete('/:id', getTransactionValidation, transactionController.deleteTransaction);

/**
 * @route   GET /api/transactions/:id/receipt
 * @desc    Get receipt for a transaction
 * @access  Public
 */
router.get('/:id/receipt', authMiddleware, getTransactionValidation, transactionController.getReceipt);

module.exports = router;
