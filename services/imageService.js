const { pool } = require('../database/config');
const path = require('path');
const fs = require('fs').promises;

class ImageService {
    /**
     * Upload image for user
     * @param {number} userId - User ID
     * @param {object} file - File object from multer
     * @returns {object} Image data
     */
    async uploadImage(userId, file) {
        // Check if user exists
        const [users] = await pool.query('SELECT id FROM users WHERE id = ?', [userId]);
        if (users.length === 0) {
            // Delete uploaded file if user not found
            await fs.unlink(file.path);
            const error = new Error('User tidak ditemukan');
            error.status = 404;
            throw error;
        }

        // Save image metadata to database
        const imageUrl = `/uploads/${file.filename}`;
        const [result] = await pool.query(
            `INSERT INTO images (user_id, filename, image_url, mime_type, file_size) 
             VALUES (?, ?, ?, ?, ?)`,
            [userId, file.filename, imageUrl, file.mimetype, file.size]
        );

        return {
            id: result.insertId,
            user_id: userId,
            filename: file.filename,
            image_url: imageUrl,
            mime_type: file.mimetype,
            file_size: file.size
        };
    }

    /**
     * Get all images by user
     * @param {number} userId - User ID
     * @returns {array} List of images
     */
    async getImagesByUser(userId) {
        const [rows] = await pool.query(
            `SELECT id, user_id, filename, image_url, mime_type, file_size, is_active, created_at 
             FROM images 
             WHERE user_id = ? AND is_active = TRUE
             ORDER BY created_at DESC`,
            [userId]
        );
        return rows;
    }

    /**
     * Get image by ID
     * @param {number} imageId - Image ID
     * @returns {object} Image data
     */
    async getImageById(imageId) {
        const [rows] = await pool.query(
            `SELECT id, user_id, filename, image_url, mime_type, file_size, is_active, created_at 
             FROM images 
             WHERE id = ?`,
            [imageId]
        );

        if (rows.length === 0) {
            const error = new Error('Gambar tidak ditemukan');
            error.status = 404;
            throw error;
        }

        return rows[0];
    }

    /**
     * Update/Replace image
     * @param {number} imageId - Image ID
     * @param {object} file - New file object from multer
     * @returns {object} Updated image data
     */
    async updateImage(imageId, file, userId, userRole) {
        // Get existing image
        const oldImage = await this.getImageById(imageId);

        // Authorization check
        if (userRole === 'ADMIN') {
            // Admin tidak boleh update image user lain
            if (oldImage.user_id !== userId) {
                const error = new Error('Admin tidak dapat mengubah gambar user lain');
                error.status = 403;
                throw error;
            }
        } else {
            // User hanya boleh update imagenya sendiri
            if (oldImage.user_id !== userId) {
                const error = new Error('Anda tidak memiliki akses untuk mengubah gambar ini');
                error.status = 403;
                throw error;
            }
        }

        // Delete old file from disk
        const oldFilePath = path.join(__dirname, '..', 'uploads', oldImage.filename);
        try {
            await fs.unlink(oldFilePath);
        } catch (error) {
            console.error('Error deleting old file:', error);
            // Continue even if old file deletion fails
        }

        // Update image metadata in database
        const imageUrl = `/uploads/${file.filename}`;
        await pool.query(
            `UPDATE images 
             SET filename = ?, image_url = ?, mime_type = ?, file_size = ?, updated_at = CURRENT_TIMESTAMP 
             WHERE id = ?`,
            [file.filename, imageUrl, file.mimetype, file.size, imageId]
        );

        return {
            id: imageId,
            user_id: oldImage.user_id,
            filename: file.filename,
            image_url: imageUrl,
            mime_type: file.mimetype,
            file_size: file.size
        };
    }

    /**
     * Delete image
     * @param {number} imageId - Image ID
     * @returns {boolean} Success status
     */
    async deleteImage(imageId, userId, userRole) {
        // Get image data
        const image = await this.getImageById(imageId);

        // Authorization check
        if (userRole === 'ADMIN') {
            // Admin tidak boleh delete image user lain
            if (image.user_id !== userId) {
                const error = new Error('Admin tidak dapat menghapus gambar user lain');
                error.status = 403;
                throw error;
            }
        } else {
            // User hanya boleh delete imagenya sendiri
            if (image.user_id !== userId) {
                const error = new Error('Anda tidak memiliki akses untuk menghapus gambar ini');
                error.status = 403;
                throw error;
            }
        }

        // Delete file from disk
        const filePath = path.join(__dirname, '..', 'uploads', image.filename);
        try {
            await fs.unlink(filePath);
        } catch (error) {
            console.error('Error deleting file:', error);
            // Continue even if file deletion fails
        }

        // Delete from database
        await pool.query('DELETE FROM images WHERE id = ?', [imageId]);
        return true;
    }

    /**
     * Set image as inactive instead of deleting
     * @param {number} imageId - Image ID
     * @returns {object} Updated image
     */
    async deactivateImage(imageId) {
        await this.getImageById(imageId);
        await pool.query('UPDATE images SET is_active = FALSE WHERE id = ?', [imageId]);
        return this.getImageById(imageId);
    }

    // =============================================
    // PRODUCT IMAGE METHODS
    // =============================================

    /**
     * Upload image for product
     * @param {number} productId - Product ID
     * @param {object} file - File object from multer
     * @returns {object} Image data
     */
    async uploadProductImage(productId, file) {
        // Check if product exists
        const [products] = await pool.query('SELECT id FROM products WHERE id = ?', [productId]);
        if (products.length === 0) {
            // Delete uploaded file if product not found
            await fs.unlink(file.path);
            const error = new Error('Produk tidak ditemukan');
            error.status = 404;
            throw error;
        }

        // Save image metadata to database
        const imageUrl = `/uploads/${file.filename}`;
        const [result] = await pool.query(
            `INSERT INTO product_images (product_id, filename, image_url, mime_type, file_size) 
             VALUES (?, ?, ?, ?, ?)`,
            [productId, file.filename, imageUrl, file.mimetype, file.size]
        );

        return {
            id: result.insertId,
            product_id: productId,
            filename: file.filename,
            image_url: imageUrl,
            mime_type: file.mimetype,
            file_size: file.size
        };
    }

    /**
     * Get all images by product
     * @param {number} productId - Product ID
     * @returns {array} List of images
     */
    async getImagesByProduct(productId) {
        const [rows] = await pool.query(
            `SELECT id, product_id, filename, image_url, mime_type, file_size, is_active, created_at 
             FROM product_images 
             WHERE product_id = ? AND is_active = TRUE
             ORDER BY created_at DESC`,
            [productId]
        );
        return rows;
    }

    /**
     * Get product image by ID
     * @param {number} imageId - Image ID
     * @returns {object} Image data
     */
    async getProductImageById(imageId) {
        const [rows] = await pool.query(
            `SELECT id, product_id, filename, image_url, mime_type, file_size, is_active, created_at 
             FROM product_images 
             WHERE id = ?`,
            [imageId]
        );

        if (rows.length === 0) {
            const error = new Error('Gambar produk tidak ditemukan');
            error.status = 404;
            throw error;
        }

        return rows[0];
    }

    /**
     * Update product image
     * @param {number} imageId - Image ID
     * @param {object} file - New file object from multer
     * @returns {object} Updated image data
     */
    async updateProductImage(imageId, file, userRole) {
        // Only admin can update product images
        if (userRole !== 'ADMIN') {
            const error = new Error('Hanya admin yang dapat mengubah gambar produk');
            error.status = 403;
            throw error;
        }

        // Get existing image
        const oldImage = await this.getProductImageById(imageId);

        // Delete old file from disk
        const oldFilePath = path.join(__dirname, '..', 'uploads', oldImage.filename);
        try {
            await fs.unlink(oldFilePath);
        } catch (error) {
            console.error('Error deleting old file:', error);
        }

        // Update image metadata in database
        const imageUrl = `/uploads/${file.filename}`;
        await pool.query(
            `UPDATE product_images 
             SET filename = ?, image_url = ?, mime_type = ?, file_size = ?, updated_at = CURRENT_TIMESTAMP 
             WHERE id = ?`,
            [file.filename, imageUrl, file.mimetype, file.size, imageId]
        );

        return {
            id: imageId,
            product_id: oldImage.product_id,
            filename: file.filename,
            image_url: imageUrl,
            mime_type: file.mimetype,
            file_size: file.size
        };
    }

    /**
     * Delete product image
     * @param {number} imageId - Image ID
     * @returns {boolean} Success status
     */
    async deleteProductImage(imageId, userRole) {
        // Only admin can delete product images
        if (userRole !== 'ADMIN') {
            const error = new Error('Hanya admin yang dapat menghapus gambar produk');
            error.status = 403;
            throw error;
        }

        // Get image data
        const image = await this.getProductImageById(imageId);

        // Delete file from disk
        const filePath = path.join(__dirname, '..', 'uploads', image.filename);
        try {
            await fs.unlink(filePath);
        } catch (error) {
            console.error('Error deleting file:', error);
        }

        // Delete from database
        await pool.query('DELETE FROM product_images WHERE id = ?', [imageId]);
        return true;
    }
}

module.exports = new ImageService();
