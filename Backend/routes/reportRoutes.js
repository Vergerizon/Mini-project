/**
 * Report Routes
 * API endpoints untuk reporting dan analisis
 */

const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { reportDateRangeValidation } = require('../utils/validator');

/**
 * @route   GET /api/reports/dashboard
 * @desc    Get dashboard summary
 * @access  Public
 */
router.get('/dashboard', reportDateRangeValidation, reportController.getDashboardSummary);

/**
 * @route   GET /api/reports/users
 * @desc    Get user transaction summary
 * @access  Public
 */
router.get('/users', reportDateRangeValidation, reportController.getUserTransactionSummary);

/**
 * @route   GET /api/reports/products
 * @desc    Get product revenue summary
 * @access  Public
 */
router.get('/products', reportDateRangeValidation, reportController.getProductRevenueSummary);

/**
 * @route   GET /api/reports/failed-transactions
 * @desc    Get failed transactions in date range
 * @access  Public
 */
router.get('/failed-transactions', reportDateRangeValidation, reportController.getFailedTransactions);

/**
 * @route   GET /api/reports/daily
 * @desc    Get daily transaction summary
 * @access  Public
 */
router.get('/daily', reportDateRangeValidation, reportController.getDailyTransactionSummary);

module.exports = router;
