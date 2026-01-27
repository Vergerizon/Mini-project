const transactionService = require('../services/transactionService');
const { 
    successResponse, 
    errorResponse, 
    paginatedResponse,
    HTTP_STATUS,
    SUCCESS_MESSAGES,
    ERROR_MESSAGES 
} = require('../utils/respons');

class TransactionController {
        /**
         * Delete transaction by ID
         * DELETE /api/transactions/:id
         */
        async deleteTransaction(req, res) {
            try {
                await transactionService.deleteTransaction(parseInt(req.params.id));
                return successResponse(res, null, 'Transaksi berhasil dihapus');
            } catch (error) {
                return errorResponse(
                    res,
                    error.message,
                    error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR
                );
            }
        }
    /**
     * Create new transaction (purchase PPOB product)
     * POST /api/transactions
     */
    async createTransaction(req, res) {
        try {
            const transaction = await transactionService.createTransaction(req.body);
            return successResponse(
                res, 
                transaction, 
                SUCCESS_MESSAGES.TRANSACTION_SUCCESS, 
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
     * Get all transactions with pagination and filters
     * GET /api/transactions
     */
    async getTransactions(req, res) {
        try {
            const options = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10,
                user_id: req.query.user_id ? parseInt(req.query.user_id) : null,
                product_id: req.query.product_id ? parseInt(req.query.product_id) : null,
                status: req.query.status || null,
                start_date: req.query.start_date || null,
                end_date: req.query.end_date || null
            };
            
            const result = await transactionService.getTransactions(options);
            
            return paginatedResponse(
                res, 
                result.data, 
                result.pagination, 
                SUCCESS_MESSAGES.TRANSACTIONS_FETCHED
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
     * Get transaction by ID
     * GET /api/transactions/:id
     */
    async getTransactionById(req, res) {
        try {
            const transaction = await transactionService.getTransactionById(parseInt(req.params.id));
            return successResponse(res, transaction, SUCCESS_MESSAGES.TRANSACTION_FETCHED);
        } catch (error) {
            return errorResponse(
                res, 
                error.message, 
                error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Get transaction by reference number
     * GET /api/transactions/reference/:reference
     */
    async getTransactionByReference(req, res) {
        try {
            const transaction = await transactionService.getTransactionByReference(req.params.reference);
            return successResponse(res, transaction, SUCCESS_MESSAGES.TRANSACTION_FETCHED);
        } catch (error) {
            return errorResponse(
                res, 
                error.message, 
                error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Get transactions by user
     * GET /api/transactions/user/:userId
     */
    async getTransactionsByUser(req, res) {
        try {
            const options = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10,
                status: req.query.status || null,
                start_date: req.query.start_date || null,
                end_date: req.query.end_date || null
            };
            
            const result = await transactionService.getTransactionsByUser(
                parseInt(req.params.userId),
                options
            );
            
            return paginatedResponse(
                res, 
                result.data, 
                result.pagination, 
                SUCCESS_MESSAGES.TRANSACTIONS_FETCHED
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
     * Cancel transaction (only for PENDING)
     * PATCH /api/transactions/:id/cancel
     */
    async cancelTransaction(req, res) {
        try {
            const transaction = await transactionService.cancelTransaction(parseInt(req.params.id));
            return successResponse(res, transaction, 'Transaksi berhasil dibatalkan dan dana dikembalikan');
        } catch (error) {
            return errorResponse(
                res, 
                error.message, 
                error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Refund transaction (only for SUCCESS)
     * PATCH /api/transactions/:id/refund
     */
    async refundTransaction(req, res) {
        try {
            const transaction = await transactionService.refundTransaction(parseInt(req.params.id));
            return successResponse(res, transaction, 'Transaksi berhasil direfund dan dana dikembalikan');
        } catch (error) {
            return errorResponse(
                res, 
                error.message, 
                error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }
    }
}

module.exports = new TransactionController();
