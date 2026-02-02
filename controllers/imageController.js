const imageService = require('../services/imageService');
const { 
    successResponse, 
    errorResponse, 
    HTTP_STATUS 
} = require('../utils/respons');

class ImageController {
    /**
     * Upload image
     * POST /api/users/:userId/images
     */
    uploadImage = async (req, res) => {
        try {
            if (!req.file) {
                return errorResponse(
                    res,
                    'File gambar tidak ditemukan',
                    HTTP_STATUS.BAD_REQUEST
                );
            }

            const userId = parseInt(req.params.userId);
            const image = await imageService.uploadImage(userId, req.file);

            return successResponse(
                res,
                image,
                'Gambar berhasil diupload',
                HTTP_STATUS.CREATED
            );
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
     * Get all images by user
     * GET /api/users/:userId/images
     */
    getImagesByUser = async (req, res) => {
        try {
            const userId = parseInt(req.params.userId);
            const images = await imageService.getImagesByUser(userId);

            return successResponse(
                res,
                images,
                'Daftar gambar berhasil diambil'
            );
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
     * Get image by ID
     * GET /api/images/:imageId
     */
    getImageById = async (req, res) => {
        try {
            const imageId = parseInt(req.params.imageId);
            const image = await imageService.getImageById(imageId);

            return successResponse(
                res,
                image,
                'Gambar berhasil diambil'
            );
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
     * Update/Replace image
     * PATCH /api/images/:imageId
     */
    updateImage = async (req, res) => {
        try {
            if (!req.file) {
                return errorResponse(
                    res,
                    'File gambar tidak ditemukan',
                    HTTP_STATUS.BAD_REQUEST
                );
            }

            const imageId = parseInt(req.params.imageId);
            const image = await imageService.updateImage(
                imageId, 
                req.file,
                req.user.id,
                req.user.role
            );

            return successResponse(
                res,
                image,
                'Gambar berhasil diupdate'
            );
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
     * Delete image
     * DELETE /api/images/:imageId
     */
    deleteImage = async (req, res) => {
        try {
            const imageId = parseInt(req.params.imageId);
            await imageService.deleteImage(
                imageId,
                req.user.id,
                req.user.role
            );

            return successResponse(
                res,
                null,
                'Gambar berhasil dihapus'
            );
        } catch (error) {
            return errorResponse(
                res,
                error.message,
                error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR,
                error
            );
        }
    }
    
    // =============================================
    // PRODUCT IMAGE METHODS
    // =============================================

    /**
     * Upload product image
     * POST /api/products/:productId/images
     */
    uploadProductImage = async (req, res) => {
        try {
            if (!req.file) {
                return errorResponse(
                    res,
                    'File gambar tidak ditemukan',
                    HTTP_STATUS.BAD_REQUEST
                );
            }

            const productId = parseInt(req.params.productId);
            const image = await imageService.uploadProductImage(productId, req.file);

            return successResponse(
                res,
                image,
                'Gambar produk berhasil diupload',
                HTTP_STATUS.CREATED
            );
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
     * Get all images by product
     * GET /api/products/:productId/images
     */
    getImagesByProduct = async (req, res) => {
        try {
            const productId = parseInt(req.params.productId);
            const images = await imageService.getImagesByProduct(productId);

            return successResponse(
                res,
                images,
                'Daftar gambar produk berhasil diambil'
            );
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
     * Get product image by ID
     * GET /api/product-images/:imageId
     */
    getProductImageById = async (req, res) => {
        try {
            const imageId = parseInt(req.params.imageId);
            const image = await imageService.getProductImageById(imageId);

            return successResponse(
                res,
                image,
                'Gambar produk berhasil diambil'
            );
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
     * Update product image
     * PATCH /api/product-images/:imageId
     */
    updateProductImage = async (req, res) => {
        try {
            if (!req.file) {
                return errorResponse(
                    res,
                    'File gambar tidak ditemukan',
                    HTTP_STATUS.BAD_REQUEST
                );
            }

            const imageId = parseInt(req.params.imageId);
            const image = await imageService.updateProductImage(
                imageId, 
                req.file,
                req.user.role
            );

            return successResponse(
                res,
                image,
                'Gambar produk berhasil diupdate'
            );
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
     * Delete product image
     * DELETE /api/product-images/:imageId
     */
    deleteProductImage = async (req, res) => {
        try {
            const imageId = parseInt(req.params.imageId);
            await imageService.deleteProductImage(
                imageId,
                req.user.role
            );

            return successResponse(
                res,
                null,
                'Gambar produk berhasil dihapus'
            );
        } catch (error) {
            return errorResponse(
                res,
                error.message,
                error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR,
                error
            );
        }
    }
}

module.exports = new ImageController();
