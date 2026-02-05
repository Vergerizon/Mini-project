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
        // handleError removed (reverting to original error handling)
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
                error && error.details ? error.details : error,
                error
            );
        }
    }

    /**
     * Get all categories
     * GET /api/categories
     */
    getCategories = async (req, res) => {
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
            let categories = await categoryService.getCategories(options);
            
            // Filter fields for USER role
            if (req.user && req.user.role === 'USER') {
                categories = this.filterCategoryFields(categories);
            }
            
            return successResponse(res, categories, 'Daftar category berhasil diambil');
        } catch (error) {
            return errorResponse(
                res, 
                error && error.message ? error.message : 'Terjadi kesalahan',
                error && error.status ? error.status : HTTP_STATUS.INTERNAL_SERVER_ERROR,
                error
            );
        }
    }

    /**
     * Get category by ID
     * GET /api/categories/:id
     */
    getCategoryById = async (req, res) => {
        try {
            let category = await categoryService.getCategoryById(parseInt(req.params.id));
            
            // Filter fields for USER role
            if (req.user && req.user.role === 'USER') {
                category = this.filterCategoryFields(category);
            }
            
            return successResponse(res, category, 'Data category berhasil diambil');
        } catch (error) {
            return errorResponse(
                res, 
                error.message, 
                error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR,
                error
            );
        }
    }

    /**
     * Get category with its products
     * GET /api/categories/:id/products
     */
    getCategoryWithProducts = async (req, res) => {
        try {
            let category = await categoryService.getCategoryWithProducts(parseInt(req.params.id));
            
            // Filter fields for USER role
            if (req.user && req.user.role === 'USER') {
                category = this.filterCategoryFields(category);
            }
            
            return successResponse(res, category, 'Data category dengan produk berhasil diambil');
        } catch (error) {
            return errorResponse(
                res, 
                error.message, 
                error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR,
                error
            );
        }
    }

    /**
     * Get subcategories
     * GET /api/categories/:id/subcategories
     */
    getSubcategories = async (req, res) => {
        try {
            let subcategories = await categoryService.getSubcategories(parseInt(req.params.id));
            
            // Filter fields for USER role
            if (req.user && req.user.role === 'USER') {
                subcategories = this.filterCategoryFields(subcategories);
            }
            
            return successResponse(res, subcategories, 'Daftar subcategory berhasil diambil');
        } catch (error) {
            return errorResponse(
                res, 
                error.message, 
                error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR,
                error
            );
        }
    }

    
    getCategoryPath = async (req, res) => {
        try {
            let path = await categoryService.getCategoryPath(parseInt(req.params.id));
            
            // Filter fields for USER role
            if (req.user && req.user.role === 'USER') {
                path = this.filterCategoryFields(path);
            }
            
            return successResponse(res, path, 'Category path berhasil diambil');
        } catch (error) {
            return errorResponse(
                res, 
                error.message, 
                error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR,
                error
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
                error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR,
                error
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
                error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR,
                error
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
                error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR,
                error
            );
        }
    }

    /**
     * Filter category fields for USER role
     * Only show name and description
     */
    filterCategoryFields(data) {
        if (!data) return data;
        
        const self = this; // Save reference to this
        
        const filterCategory = (cat) => {
            if (!cat) return cat;
            const filtered = {
                name: cat.name,
                description: cat.description || null
            };
            // If category has children/subcategories, filter them too
            if (cat.children && Array.isArray(cat.children)) {
                filtered.children = cat.children.map(child => self.filterCategoryFields(child));
            }
            // If category has products, filter them for USER
            if (cat.products) {
                filtered.products = Array.isArray(cat.products) 
                    ? cat.products.map(p => self.filterProductFieldsForUser(p))
                    : cat.products;
            }
            return filtered;
        };
        
        // Handle array of categories
        if (Array.isArray(data)) {
            return data.map(item => filterCategory(item));
        }
        
        // Handle single category
        return filterCategory(data);
    }

    /**
     * Filter product fields for USER role (used in category responses)
     * Only show name and price
     */
    filterProductFieldsForUser(product) {
        if (!product) return product;
        
        return {
            name: product.name,
            price: product.price
        };
    }
}

module.exports = new CategoryController();
