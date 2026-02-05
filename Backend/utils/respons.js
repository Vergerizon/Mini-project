/**
 * Response Utility Module
 * Standarisasi format response API
 */

// HTTP Status Codes
const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
};

// Error Messages
const ERROR_MESSAGES = {
    // User Errors
    USER_NOT_FOUND: 'User tidak ditemukan',
    USER_ALREADY_EXISTS: 'Email sudah terdaftar',
    INVALID_USER_DATA: 'Data user tidak valid',
    
    // Product Errors
    PRODUCT_NOT_FOUND: 'Produk tidak ditemukan',
    PRODUCT_NOT_ACTIVE: 'Produk tidak aktif',
    PRODUCT_HAS_TRANSACTIONS: 'Produk tidak dapat dihapus karena sudah memiliki transaksi',
    INVALID_PRODUCT_DATA: 'Data produk tidak valid',
    
    // Transaction Errors
    INSUFFICIENT_BALANCE: 'Saldo tidak mencukupi',
    TRANSACTION_NOT_FOUND: 'Transaksi tidak ditemukan',
    TRANSACTION_FAILED: 'Transaksi gagal diproses',
    DUPLICATE_TRANSACTION: 'Transaksi duplikat terdeteksi',
    
    // General Errors
    VALIDATION_ERROR: 'Validasi gagal',
    INTERNAL_ERROR: 'Terjadi kesalahan pada server',
    UNAUTHORIZED: 'Akses tidak diizinkan',
    FORBIDDEN: 'Akses ditolak',
    NOT_FOUND: 'Resource tidak ditemukan',
    INVALID_REQUEST: 'Request tidak valid'
};

// Success Messages
const SUCCESS_MESSAGES = {
    // User
    USER_CREATED: 'User berhasil dibuat',
    USER_UPDATED: 'User berhasil diupdate',
    USER_DELETED: 'User berhasil dihapus',
    USER_FETCHED: 'Data user berhasil diambil',
    USERS_FETCHED: 'Daftar user berhasil diambil',
    
    // Product
    PRODUCT_CREATED: 'Produk berhasil dibuat',
    PRODUCT_UPDATED: 'Produk berhasil diupdate',
    PRODUCT_DELETED: 'Produk berhasil dihapus',
    PRODUCT_FETCHED: 'Data produk berhasil diambil',
    PRODUCTS_FETCHED: 'Daftar produk berhasil diambil',
    
    // Transaction
    TRANSACTION_SUCCESS: 'Transaksi berhasil',
    TRANSACTION_FETCHED: 'Data transaksi berhasil diambil',
    TRANSACTIONS_FETCHED: 'Daftar transaksi berhasil diambil',
    
    // Report
    REPORT_GENERATED: 'Laporan berhasil dibuat'
};

/**
 * Success Response
 * @param {object} res - Express response object
 * @param {any} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code
 */
const successResponse = (res, data = null, message = 'Success', statusCode = HTTP_STATUS.OK) => {
    return res.status(statusCode).json({
        success: true,
        message: message,
        data: data,
        timestamp: new Date().toISOString()
    });
};

/**
 * Error Response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {any} errors - Additional error details
 */
const errorResponse = (res, message = 'An error occurred', statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null) => {
    const response = {
        success: false,
        message: message,
        timestamp: new Date().toISOString()
    };
    if (errors) {
        response.errors = errors;
    }
    return res.status(statusCode).json(response);
};

/**
 * Paginated Response
 * @param {object} res - Express response object
 * @param {array} data - Array of data
 * @param {object} pagination - Pagination info
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code
 */
const paginatedResponse = (res, data, pagination, message = 'Success', statusCode = HTTP_STATUS.OK) => {
    return res.status(statusCode).json({
        success: true,
        message: message,
        data: data,
        pagination: {
            totalItems: pagination.totalItems,
            totalPages: pagination.totalPages,
            currentPage: pagination.currentPage,
            itemsPerPage: pagination.limit,
            hasNextPage: pagination.currentPage < pagination.totalPages,
            hasPrevPage: pagination.currentPage > 1
        },
        timestamp: new Date().toISOString()
    });
};

/**
 * Validation Error Response
 * @param {object} res - Express response object
 * @param {array} errors - Validation errors array
 */
const validationErrorResponse = (res, errors) => {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: ERROR_MESSAGES.VALIDATION_ERROR,
        errors: errors,
        timestamp: new Date().toISOString()
    });
};

module.exports = {
    HTTP_STATUS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    successResponse,
    errorResponse,
    paginatedResponse,
    validationErrorResponse
};   