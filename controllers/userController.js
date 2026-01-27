/**
 * User Controller
 * Handles HTTP requests untuk user endpoints
 */

const userService = require('../services/userService');
const { 
    successResponse, 
    errorResponse, 
    paginatedResponse,
    HTTP_STATUS,
    SUCCESS_MESSAGES,
    ERROR_MESSAGES 
} = require('../utils/respons');

class UserController {
    /**
     * Create new user
     * POST /api/users
     */
    async createUser(req, res) {
        try {
            const user = await userService.createUser(req.body);
            return successResponse(
                res, 
                user, 
                SUCCESS_MESSAGES.USER_CREATED, 
                HTTP_STATUS.CREATED
            );
        } catch (error) {
            return errorResponse(
                res,
                error && error.message ? error.message : 'Terjadi kesalahan',
                error && error.status ? error.status : HTTP_STATUS.INTERNAL_SERVER_ERROR,
                error && error.details ? error.details : null
            );
        }
    }

    /**
     * Get all users with pagination
     * GET /api/users
     */
    async getUsers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || '';
            const sortBy = req.query.sortBy || 'created_at';
            const sortDir = req.query.sortDir || 'DESC';
            const filters = {
                email: req.query.email,
                phone_number: req.query.phone_number,
                balance_min: req.query.balance_min,
                balance_max: req.query.balance_max
            };
            const result = await userService.getUsers(page, limit, search, sortBy, sortDir, filters);
            return paginatedResponse(
                res, 
                result.data, 
                result.pagination, 
                SUCCESS_MESSAGES.USERS_FETCHED
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
     * Get user by ID
     * GET /api/users/:id
     */
    async getUserById(req, res) {
        try {
            const user = await userService.getUserById(parseInt(req.params.id));
            return successResponse(res, user, SUCCESS_MESSAGES.USER_FETCHED);
        } catch (error) {
            return errorResponse(
                res, 
                error.message, 
                error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Update user
     * PUT /api/users/:id
     */
    async updateUser(req, res) {
        try {
            const user = await userService.updateUser(
                parseInt(req.params.id), 
                req.body
            );
            return successResponse(res, user, SUCCESS_MESSAGES.USER_UPDATED);
        } catch (error) {
            return errorResponse(
                res, 
                error.message, 
                error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Delete user
     * DELETE /api/users/:id
     */
    async deleteUser(req, res) {
        try {
            await userService.deleteUser(parseInt(req.params.id));
            return successResponse(
                res, 
                null, 
                SUCCESS_MESSAGES.USER_DELETED
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
     * Add balance to user (Top Up)
     * POST /api/users/:id/topup
     */
    async topUpBalance(req, res) {
        try {
            const { amount } = req.body;
            
            if (!amount || amount <= 0) {
                return errorResponse(
                    res, 
                    'Jumlah top up harus lebih dari 0', 
                    HTTP_STATUS.BAD_REQUEST
                );
            }
            
            const user = await userService.addBalance(
                parseInt(req.params.id), 
                parseFloat(amount)
            );
            
            return successResponse(res, user, 'Top up berhasil');
        } catch (error) {
            return errorResponse(
                res, 
                error.message, 
                error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }
    }
}

module.exports = new UserController();
