/**
 * Error Handler Middleware
 * Global error handling untuk aplikasi
 */

const { errorResponse, HTTP_STATUS, ERROR_MESSAGES } = require('../utils/respons');

/**
 * 404 Not Found Handler
 */
const notFoundHandler = (req, res, next) => {
    return errorResponse(
        res, 
        `Route ${req.method} ${req.originalUrl} tidak ditemukan`, 
        HTTP_STATUS.NOT_FOUND
    );
};

/**
 * Global Error Handler
 */
const globalErrorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    
    // Default error
    let statusCode = err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    let message = err.message || ERROR_MESSAGES.INTERNAL_ERROR;
    
    // MySQL duplicate entry error
    if (err.code === 'ER_DUP_ENTRY') {
        statusCode = HTTP_STATUS.CONFLICT;
        message = 'Data sudah ada dalam database';
    }
    
    // MySQL foreign key constraint error
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        statusCode = HTTP_STATUS.BAD_REQUEST;
        message = 'Referensi data tidak valid';
    }
    
    // MySQL foreign key constraint error (delete)
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        statusCode = HTTP_STATUS.BAD_REQUEST;
        message = 'Data tidak dapat dihapus karena masih digunakan';
    }
    
    // Validation error from express-validator
    if (err.array && typeof err.array === 'function') {
        statusCode = HTTP_STATUS.BAD_REQUEST;
        message = ERROR_MESSAGES.VALIDATION_ERROR;
    }
    
    // JSON parse error
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        statusCode = HTTP_STATUS.BAD_REQUEST;
        message = 'Invalid JSON format';
    }
    
    return errorResponse(res, message, statusCode);
};

module.exports = {
    notFoundHandler,
    globalErrorHandler
};
