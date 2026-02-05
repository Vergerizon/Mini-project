/**
 * Report Controller
 * Handles HTTP requests untuk reporting endpoints
 */

const reportService = require('../services/reportService');
const { 
    successResponse, 
    errorResponse, 
    paginatedResponse,
    HTTP_STATUS,
    SUCCESS_MESSAGES 
} = require('../utils/respons');

class ReportController {
        // handleError removed (reverting to original error handling)
    /**
     * Get user transaction summary
     * GET /api/reports/users
     */
    async getUserTransactionSummary(req, res) {
        try {
            const options = {
                start_date: req.query.start_date || null,
                end_date: req.query.end_date || null
            };
            
            const data = await reportService.getUserTransactionSummary(options);
            return successResponse(res, data, SUCCESS_MESSAGES.REPORT_GENERATED);
        } catch (error) {
            return errorResponse(
                res,
                error && error.message ? error.message : 'Terjadi kesalahan',
                error && error.status ? error.status : HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Get product revenue summary
     * GET /api/reports/products
     */
    async getProductRevenueSummary(req, res) {
        try {
            const options = {
                start_date: req.query.start_date || null,
                end_date: req.query.end_date || null,
                type: req.query.type || null
            };
            
            const data = await reportService.getProductRevenueSummary(options);
            return successResponse(res, data, SUCCESS_MESSAGES.REPORT_GENERATED);
        } catch (error) {
            return errorResponse(
                res, 
                error && error.message ? error.message : 'Terjadi kesalahan',
                error && error.status ? error.status : HTTP_STATUS.INTERNAL_SERVER_ERROR,
                error && error.details ? error.details : error
            );
        }
    }

    /**
     * Get failed transactions
     * GET /api/reports/failed-transactions
     */
    async getFailedTransactions(req, res) {
        try {
            const options = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 20,
                start_date: req.query.start_date || null,
                end_date: req.query.end_date || null
            };
            
            const result = await reportService.getFailedTransactions(options);
            
            // Include summary in response
            return res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.REPORT_GENERATED,
                data: result.data,
                pagination: {
                    totalItems: result.pagination.totalItems,
                    totalPages: result.pagination.totalPages,
                    currentPage: result.pagination.currentPage,
                    itemsPerPage: result.pagination.limit,
                    hasNextPage: result.pagination.currentPage < result.pagination.totalPages,
                    hasPrevPage: result.pagination.currentPage > 1
                },
                summary: result.summary,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            return errorResponse(
                res, 
                error.message, 
                error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Get dashboard summary
     * GET /api/reports/dashboard
     */
    async getDashboardSummary(req, res) {
        try {
            const options = {
                start_date: req.query.start_date || null,
                end_date: req.query.end_date || null
            };
            
            const data = await reportService.getDashboardSummary(options);
            return successResponse(res, data, SUCCESS_MESSAGES.REPORT_GENERATED);
        } catch (error) {
            return errorResponse(
                res, 
                error.message, 
                error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Get daily transaction summary
     * GET /api/reports/daily
     */
    async getDailyTransactionSummary(req, res) {
        try {
            const options = {
                start_date: req.query.start_date || null,
                end_date: req.query.end_date || null,
                days: parseInt(req.query.days) || 30
            };
            
            const result = await reportService.getDailyTransactionSummary(options);
            
            return res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.REPORT_GENERATED,
                data: result.data,
                summary: result.summary,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            return errorResponse(
                res, 
                error.message, 
                error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }
    }
}

module.exports = new ReportController();
