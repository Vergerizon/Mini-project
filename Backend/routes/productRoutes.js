/**
 * Product Routes
 * API endpoints untuk operasi produk PPOB
 */

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { 
    createProductValidation, 
    updateProductValidation, 
    getProductValidation,
    listProductsValidation 
} = require('../utils/validator');
const { authMiddleware } = require('../middleware/auth');

/**
 * @route   POST /api/products
 * @desc    Create new product
 * @access  Public
 */
// Only admin can create product
router.post('/', authMiddleware, (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Tidak memiliki wewenang: Hanya admin yang dapat membuat produk' });
    }
    next();
}, createProductValidation, productController.createProduct);

/**
 * @route   GET /api/products
 * @desc    Get all products with pagination and filters
 * @access  User and Admin (read-only for user)
 */
router.get('/', authMiddleware, listProductsValidation, productController.getProducts);

/**
 * @route   GET /api/products/type/:type
 * @desc    Get products by type
 * @access  User and Admin (read-only for user)
 */
router.get('/type/:type', authMiddleware, productController.getProductsByType);

/**
 * @route   GET /api/products/:id
 * @desc    Get product by ID
 * @access  User and Admin (read-only for user)
 */
router.get('/:id', authMiddleware, getProductValidation, productController.getProductById);

/**
 * @route   PUT /api/products/:id
 * @desc    Update product
 * @access  Public
 */
// Only admin can update product
router.put('/:id', authMiddleware, (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Tidak memiliki wewenang: Hanya admin yang dapat mengubah produk' });
    }
    next();
}, updateProductValidation, productController.updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product
 * @access  Public
 */
// Only admin can delete product
router.delete('/:id', authMiddleware, (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Tidak memiliki wewenang: Hanya admin yang dapat menghapus produk' });
    }
    next();
}, getProductValidation, productController.deleteProduct);

/**
 * @route   PATCH /api/products/:id/toggle-status
 * @desc    Toggle product status (active/inactive)
 * @access  Public
 */
// Only admin can toggle product status
router.patch('/:id/toggle-status', authMiddleware, (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Tidak memiliki wewenang: Hanya admin yang dapat mengubah status produk' });
    }
    next();
}, getProductValidation, productController.toggleProductStatus);

module.exports = router;
