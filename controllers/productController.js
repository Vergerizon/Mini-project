/**
 * Product Controller
 * Handles HTTP requests untuk product endpoints
 */

const productService = require('../services/productService');
const { 
    successResponse, 
    errorResponse, 
    paginatedResponse,
    HTTP_STATUS,
    SUCCESS_MESSAGES,
    ERROR_MESSAGES 
} = require('../utils/respons');

class ProductController {
    /**
     * Create new product
     * POST /api/products
     */
    async createProduct(req, res) {
        try {
            const product = await productService.createProduct(req.body);
            return successResponse(
                res, 
                product, 
                SUCCESS_MESSAGES.PRODUCT_CREATED, 
                HTTP_STATUS.CREATED
            );
        } catch (error) {
            return errorResponse(
                res, 
                error.message, 
                error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Get all products with pagination and filters
     * GET /api/products
     */
    async getProducts(req, res) {
        try {
            const options = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10,
                type: req.query.type || null,
                category_id: req.query.category_id ? parseInt(req.query.category_id) : null,
                is_active: req.query.is_active !== undefined ? req.query.is_active : null,
                search: req.query.search || null,
                sortBy: req.query.sortBy || 'p.created_at',
                sortDir: req.query.sortDir || 'DESC'
            };
            const result = await productService.getProducts(options);
            return paginatedResponse(
                res, 
                result.data, 
                result.pagination, 
                SUCCESS_MESSAGES.PRODUCTS_FETCHED
            );
        } catch (error) {
            return errorResponse(
                res, 
                error.message, 
                error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Get product by ID
     * GET /api/products/:id
     */
    async getProductById(req, res) {
        try {
            const product = await productService.getProductById(parseInt(req.params.id));
            return successResponse(res, product, SUCCESS_MESSAGES.PRODUCT_FETCHED);
        } catch (error) {
            return errorResponse(
                res, 
                error.message, 
                error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Update product
     * PUT /api/products/:id
     */
    async updateProduct(req, res) {
        try {
            const product = await productService.updateProduct(
                parseInt(req.params.id), 
                req.body
            );
            return successResponse(res, product, SUCCESS_MESSAGES.PRODUCT_UPDATED);
        } catch (error) {
            return errorResponse(
                res, 
                error.message, 
                error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Delete product
     * DELETE /api/products/:id
     */
    async deleteProduct(req, res) {
        try {
            await productService.deleteProduct(parseInt(req.params.id));
            return successResponse(
                res, 
                null, 
                SUCCESS_MESSAGES.PRODUCT_DELETED
            );
        } catch (error) {
            return errorResponse(
                res, 
                error.message, 
                error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Get products by type
     * GET /api/products/type/:type
     */
    async getProductsByType(req, res) {
        try {
            const products = await productService.getProductsByType(req.params.type);
            return successResponse(res, products, SUCCESS_MESSAGES.PRODUCTS_FETCHED);
        } catch (error) {
            return errorResponse(
                res, 
                error.message, 
                error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Toggle product status (active/inactive)
     * PATCH /api/products/:id/toggle-status
     */
    async toggleProductStatus(req, res) {
        try {
            const product = await productService.toggleProductStatus(parseInt(req.params.id));
            const message = product.is_active 
                ? 'Produk berhasil diaktifkan' 
                : 'Produk berhasil dinonaktifkan';
            return successResponse(res, product, message);
        } catch (error) {
            return errorResponse(
                res, 
                error.message, 
                error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }
    }
}

module.exports = new ProductController();
