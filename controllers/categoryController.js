/**
 * Category Controller
 * Handles HTTP requests untuk category endpoints
 */

const categoryService = require('../services/categoryService');
const { 
    successResponse, 
    errorResponse, 
    HTTP_STATUS,
    SUCCESS_MESSAGES 
} = require('../utils/respons');

class CategoryController {
    /**
     * Create new category
     * POST /api/categories
     */
    async createCategory(req, res) {
        try {
            const category = await categoryService.createCategory(req.body);
            return successResponse(
                res, 
                category, 
                'Category berhasil dibuat', 
                HTTP_STATUS.CREATED
            );
        } catch (error) {
            // Map pesan error ke status code spesifik jika error.status tidak ada
            let status = error && error.status ? error.status : HTTP_STATUS.INTERNAL_SERVER_ERROR;
            if (!error.status && error && error.message) {
                if (error.message.toLowerCase().includes('not found') || error.message.toLowerCase().includes('tidak ditemukan')) {
                    status = HTTP_STATUS.NOT_FOUND;
                } else if (error.message.toLowerCase().includes('validasi') || error.message.toLowerCase().includes('validation')) {
                    status = HTTP_STATUS.BAD_REQUEST;
                } else if (error.message.toLowerCase().includes('sudah ada') || error.message.toLowerCase().includes('already exists')) {
                    status = HTTP_STATUS.CONFLICT;
                }
            }
            return errorResponse(
                res,
                error && error.message ? error.message : 'Terjadi kesalahan',
                status,
                error && error.details ? error.details : null
            );
        }
    }

    /**
     * Get all categories
     * GET /api/categories
     */
    async getCategories(req, res) {
        try {
            const options = {
                parent_id: req.query.parent_id !== undefined ? req.query.parent_id : null,
                is_active: req.query.is_active !== undefined ? req.query.is_active : null,
                flat: req.query.flat === 'true',
                search: req.query.search || '',
                sortBy: req.query.sortBy || 'c.name',
                sortDir: req.query.sortDir || 'ASC',
                description: req.query.description || null
            };
            const categories = await categoryService.getCategories(options);
            return successResponse(res, categories, 'Daftar category berhasil diambil');
        } catch (error) {
            return errorResponse(
                res, 
                error.message, 
                error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Get category by ID
     * GET /api/categories/:id
     */
    async getCategoryById(req, res) {
        try {
            const category = await categoryService.getCategoryById(parseInt(req.params.id));
            return successResponse(res, category, 'Data category berhasil diambil');
        } catch (error) {
            return errorResponse(
                res, 
                error.message, 
                error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Get category with its products
     * GET /api/categories/:id/products
     */
    async getCategoryWithProducts(req, res) {
        try {
            const category = await categoryService.getCategoryWithProducts(parseInt(req.params.id));
            return successResponse(res, category, 'Data category dengan produk berhasil diambil');
        } catch (error) {
            return errorResponse(
                res, 
                error.message, 
                error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Get subcategories
     * GET /api/categories/:id/subcategories
     */
    async getSubcategories(req, res) {
        try {
            const subcategories = await categoryService.getSubcategories(parseInt(req.params.id));
            return successResponse(res, subcategories, 'Daftar subcategory berhasil diambil');
        } catch (error) {
            return errorResponse(
                res, 
                error.message, 
                error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }
    }

    
    async getCategoryPath(req, res) {
        try {
            const path = await categoryService.getCategoryPath(parseInt(req.params.id));
            return successResponse(res, path, 'Category path berhasil diambil');
        } catch (error) {
            return errorResponse(
                res, 
                error.message, 
                error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Update category
     * PUT /api/categories/:id
     */
    async updateCategory(req, res) {
        try {
            const category = await categoryService.updateCategory(
                parseInt(req.params.id), 
                req.body
            );
            return successResponse(res, category, 'Category berhasil diupdate');
        } catch (error) {
            return errorResponse(
                res, 
                error.message, 
                error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Delete category
     * DELETE /api/categories/:id
     */
    async deleteCategory(req, res) {
        try {
            await categoryService.deleteCategory(parseInt(req.params.id));
            return successResponse(res, null, 'Category berhasil dihapus');
        } catch (error) {
            return errorResponse(
                res, 
                error.message, 
                error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Toggle category status
     * PATCH /api/categories/:id/toggle-status
     */
    async toggleCategoryStatus(req, res) {
        try {
            const category = await categoryService.toggleCategoryStatus(parseInt(req.params.id));
            const message = category.is_active 
                ? 'Category berhasil diaktifkan' 
                : 'Category berhasil dinonaktifkan';
            return successResponse(res, category, message);
        } catch (error) {
            return errorResponse(
                res, 
                error.message, 
                error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }
    }
}

module.exports = new CategoryController();
