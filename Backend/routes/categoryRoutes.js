/**
 * Category Routes
 * API endpoints untuk operasi kategori
 */

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { body, param, query } = require('express-validator');
const { handleValidationErrors } = require('../utils/validator');
const { authMiddleware } = require('../middleware/auth');

// Validation rules
const createCategoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Nama category wajib diisi')
        .isLength({ min: 2, max: 100 }).withMessage('Nama category harus 2-100 karakter'),
    body('parent_id')
        .optional({ nullable: true })
        .isInt({ min: 1 }).withMessage('Parent ID tidak valid'),
    body('description')
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 500 }).withMessage('Deskripsi maksimal 500 karakter'),
    body('is_active')
        .optional()
        .isBoolean().withMessage('Status aktif harus boolean'),
    handleValidationErrors
];

const updateCategoryValidation = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID category tidak valid'),
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('Nama category harus 2-100 karakter'),
    body('parent_id')
        .optional({ nullable: true })
        .custom((value) => {
            if (value === null || value === '' || value === 0) return true;
            return Number.isInteger(parseInt(value)) && parseInt(value) > 0;
        }).withMessage('Parent ID tidak valid'),
    body('description')
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 500 }).withMessage('Deskripsi maksimal 500 karakter'),
    body('is_active')
        .optional()
        .isBoolean().withMessage('Status aktif harus boolean'),
    handleValidationErrors
];

const getCategoryValidation = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID category tidak valid'),
    handleValidationErrors
];

/**
 * @route   POST /api/categories
 * @desc    Create new category
 * @access  Admin only
 */
router.post('/', authMiddleware, (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Tidak memiliki wewenang: Hanya admin yang dapat membuat kategori' });
    }
    next();
}, createCategoryValidation, categoryController.createCategory);

/**
 * @route   GET /api/categories
 * @desc    Get all categories (supports hierarchical and flat view)
 * @access  User and Admin (read-only for user)
 * @query   parent_id - Filter by parent ID (use 'null' or 0 for root categories)
 * @query   is_active - Filter by active status
 * @query   flat - Set to 'true' for flat list, otherwise returns tree structure
 */
router.get('/', authMiddleware, categoryController.getCategories);

/**
 * @route   GET /api/categories/:id
 * @desc    Get category by ID
 * @access  User and Admin (read-only for user)
 */
router.get('/:id', authMiddleware, getCategoryValidation, categoryController.getCategoryById);

/**
 * @route   GET /api/categories/:id/products
 * @desc    Get category with its products
 * @access  User and Admin (read-only for user)
 */
router.get('/:id/products', authMiddleware, getCategoryValidation, categoryController.getCategoryWithProducts);

/**
 * @route   GET /api/categories/:id/subcategories
 * @desc    Get subcategories of a category
 * @access  User and Admin (read-only for user)
 */
router.get('/:id/subcategories', authMiddleware, getCategoryValidation, categoryController.getSubcategories);

/**
 * @route   GET /api/categories/:id/path
 * @desc    Get category path (breadcrumb)
 * @access  User and Admin (read-only for user)
 */
router.get('/:id/path', authMiddleware, getCategoryValidation, categoryController.getCategoryPath);

/**
 * @route   PUT /api/categories/:id
 * @desc    Update category
 * @access  Admin only
 */
router.put('/:id', authMiddleware, (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Tidak memiliki wewenang: Hanya admin yang dapat mengubah kategori' });
    }
    next();
}, updateCategoryValidation, categoryController.updateCategory);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete category
 * @access  Admin only
 */
router.delete('/:id', authMiddleware, (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Tidak memiliki wewenang: Hanya admin yang dapat menghapus kategori' });
    }
    next();
}, getCategoryValidation, categoryController.deleteCategory);

/**
 * @route   PATCH /api/categories/:id/toggle-status
 * @desc    Toggle category status (active/inactive)
 * @access  Admin only
 */
router.patch('/:id/toggle-status', authMiddleware, (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Tidak memiliki wewenang: Hanya admin yang dapat mengubah status kategori' });
    }
    next();
}, getCategoryValidation, categoryController.toggleCategoryStatus);

module.exports = router;
