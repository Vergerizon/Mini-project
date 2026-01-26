/**
 * Transaction Service
 * Business logic untuk operasi transaksi PPOB
 * Menggunakan database transaction untuk konsistensi data
 */

const { pool } = require('../database/config');
const { ERROR_MESSAGES } = require('../utils/respons');
const userService = require('./userService');
const productService = require('./productService');

class TransactionService {
    /**
     * Generate unique reference number
     * @returns {string} Reference number
     */
    generateReferenceNumber() {
        const timestamp = Date.now().toString();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `TRX${timestamp}${random}`;
    }

    /**
     * Create new transaction (purchase PPOB product)
     * Uses database transaction for data consistency
     * @param {object} transactionData - Transaction data
     * @returns {object} Created transaction
     */
    async createTransaction(transactionData) {
        const { user_id, product_id, customer_number } = transactionData;
        
        // Get database connection for transaction
        const connection = await pool.getConnection();
        
        try {
            // Begin transaction
            await connection.beginTransaction();
            
            // 1. Validate user exists
            const [users] = await connection.query(
                'SELECT id, name, balance FROM users WHERE id = ? FOR UPDATE',
                [user_id]
            );
            
            if (users.length === 0) {
                const error = new Error(ERROR_MESSAGES.USER_NOT_FOUND);
                error.status = 404;
                throw error;
            }
            
            const user = users[0];
            
            // 2. Validate product exists and is active
            const [products] = await connection.query(
                'SELECT id, name, type, price, is_active FROM products WHERE id = ?',
                [product_id]
            );
            
            if (products.length === 0) {
                const error = new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
                error.status = 404;
                throw error;
            }
            
            const product = products[0];
            
            if (!product.is_active) {
                const error = new Error(ERROR_MESSAGES.PRODUCT_NOT_ACTIVE);
                error.status = 400;
                throw error;
            }
            
            // 3. Validate user balance
            const amount = parseFloat(product.price);
            const currentBalance = parseFloat(user.balance);
            
            if (currentBalance < amount) {
                const error = new Error(ERROR_MESSAGES.INSUFFICIENT_BALANCE);
                error.status = 400;
                throw error;
            }
            
            // 4. Generate reference number
            const referenceNumber = this.generateReferenceNumber();
            
            // 5. Deduct user balance
            const newBalance = currentBalance - amount;
            await connection.query(
                'UPDATE users SET balance = ? WHERE id = ?',
                [newBalance, user_id]
            );
            
            // 6. Create transaction record with SUCCESS status
            const [result] = await connection.query(
                `INSERT INTO transactions 
                 (user_id, product_id, customer_number, amount, status, reference_number) 
                 VALUES (?, ?, ?, ?, 'SUCCESS', ?)`,
                [user_id, product_id, customer_number, amount, referenceNumber]
            );
            
            // 7. Commit transaction
            await connection.commit();
            
            // Return transaction details
            return this.getTransactionById(result.insertId);
            
        } catch (error) {
            // Rollback transaction on error
            await connection.rollback();
            
            // If it's a known error, re-throw it
            if (error.status) {
                throw error;
            }
            
            // For unknown errors, wrap them
            console.error('Transaction error:', error);
            const transactionError = new Error(ERROR_MESSAGES.TRANSACTION_FAILED);
            transactionError.status = 500;
            throw transactionError;
            
        } finally {
            // Release connection back to pool
            connection.release();
        }
    }

    /**
     * Get transaction by ID with user and product details
     * @param {number} id - Transaction ID
     * @returns {object} Transaction data
     */
    async getTransactionById(id) {
        const [rows] = await pool.query(
            `SELECT 
                t.id,
                t.user_id,
                t.product_id,
                t.customer_number,
                t.amount,
                t.status,
                t.reference_number,
                t.notes,
                t.created_at,
                t.updated_at,
                u.name as user_name,
                u.email as user_email,
                p.name as product_name,
                p.type as product_type
             FROM transactions t
             JOIN users u ON t.user_id = u.id
             JOIN products p ON t.product_id = p.id
             WHERE t.id = ?`,
            [id]
        );
        
        if (rows.length === 0) {
            const error = new Error(ERROR_MESSAGES.TRANSACTION_NOT_FOUND);
            error.status = 404;
            throw error;
        }
        
        return rows[0];
    }

    /**
     * Get transaction by reference number
     * @param {string} referenceNumber - Reference number
     * @returns {object} Transaction data
     */
    async getTransactionByReference(referenceNumber) {
        const [rows] = await pool.query(
            `SELECT 
                t.id,
                t.user_id,
                t.product_id,
                t.customer_number,
                t.amount,
                t.status,
                t.reference_number,
                t.notes,
                t.created_at,
                t.updated_at,
                u.name as user_name,
                u.email as user_email,
                p.name as product_name,
                p.type as product_type
             FROM transactions t
             JOIN users u ON t.user_id = u.id
             JOIN products p ON t.product_id = p.id
             WHERE t.reference_number = ?`,
            [referenceNumber]
        );
        
        if (rows.length === 0) {
            const error = new Error(ERROR_MESSAGES.TRANSACTION_NOT_FOUND);
            error.status = 404;
            throw error;
        }
        
        return rows[0];
    }

    /**
     * Get all transactions with pagination and filters
     * @param {object} options - Query options
     * @returns {object} Transactions list with pagination info
     */
    async getTransactions(options = {}) {
        const { 
            page = 1, 
            limit = 10, 
            user_id = null,
            product_id = null,
            status = null,
            start_date = null,
            end_date = null
        } = options;
        
        const offset = (page - 1) * limit;
        
        // Build where clause
        const conditions = [];
        const values = [];
        
        if (user_id) {
            conditions.push('t.user_id = ?');
            values.push(user_id);
        }
        
        if (product_id) {
            conditions.push('t.product_id = ?');
            values.push(product_id);
        }
        
        if (status) {
            conditions.push('t.status = ?');
            values.push(status);
        }
        
        if (start_date) {
            conditions.push('t.created_at >= ?');
            values.push(start_date);
        }
        
        if (end_date) {
            conditions.push('t.created_at <= ?');
            values.push(end_date + ' 23:59:59');
        }
        
        const whereClause = conditions.length > 0 
            ? 'WHERE ' + conditions.join(' AND ') 
            : '';
        
        // Get total count
        const [countResult] = await pool.query(
            `SELECT COUNT(*) as total FROM transactions t ${whereClause}`,
            values
        );
        const totalItems = countResult[0].total;
        const totalPages = Math.ceil(totalItems / limit);
        
        // Get transactions
        const [rows] = await pool.query(
            `SELECT 
                t.id,
                t.user_id,
                t.product_id,
                t.customer_number,
                t.amount,
                t.status,
                t.reference_number,
                t.notes,
                t.created_at,
                t.updated_at,
                u.name as user_name,
                u.email as user_email,
                p.name as product_name,
                p.type as product_type
             FROM transactions t
             JOIN users u ON t.user_id = u.id
             JOIN products p ON t.product_id = p.id
             ${whereClause}
             ORDER BY t.created_at DESC 
             LIMIT ? OFFSET ?`,
            [...values, limit, offset]
        );
        
        return {
            data: rows,
            pagination: {
                totalItems,
                totalPages,
                currentPage: page,
                limit
            }
        };
    }

    /**
     * Get transactions by user ID
     * @param {number} userId - User ID
     * @param {object} options - Query options
     * @returns {object} Transactions list
     */
    async getTransactionsByUser(userId, options = {}) {
        return this.getTransactions({ ...options, user_id: userId });
    }

    /**
     * Cancel/Refund a pending transaction (manual process)
     * @param {number} id - Transaction ID
     * @returns {object} Updated transaction with refund details
     */
    async cancelTransaction(id) {
        const connection = await pool.getConnection();
        
        try {
            await connection.beginTransaction();
            
            // Get transaction with lock
            const [transactions] = await connection.query(
                'SELECT * FROM transactions WHERE id = ? FOR UPDATE',
                [id]
            );
            
            if (transactions.length === 0) {
                const error = new Error(ERROR_MESSAGES.TRANSACTION_NOT_FOUND);
                error.status = 404;
                throw error;
            }
            
            const transaction = transactions[0];
            
            // Check if already cancelled
            if (transaction.status === 'FAILED' && transaction.notes && transaction.notes.includes('Dibatalkan')) {
                const error = new Error('Transaksi sudah dibatalkan sebelumnya');
                error.status = 400;
                throw error;
            }
            
            // Only SUCCESS transactions can be refunded
            if (transaction.status !== 'SUCCESS') {
                const error = new Error('Hanya transaksi SUCCESS yang dapat dibatalkan');
                error.status = 400;
                throw error;
            }
            
            // Refund balance to user
            await connection.query(
                'UPDATE users SET balance = balance + ? WHERE id = ?',
                [transaction.amount, transaction.user_id]
            );
            
            // Get user's new balance
            const [users] = await connection.query(
                'SELECT balance FROM users WHERE id = ?',
                [transaction.user_id]
            );
            
            // Update transaction status to FAILED (refunded)
            await connection.query(
                "UPDATE transactions SET status = 'FAILED', notes = 'Dibatalkan dan dana dikembalikan' WHERE id = ?",
                [id]
            );
            
            await connection.commit();
            
            const updatedTransaction = await this.getTransactionById(id);
            
            return {
                ...updatedTransaction,
                refunded_amount: parseFloat(transaction.amount).toFixed(2),
                user_new_balance: parseFloat(users[0].balance).toFixed(2)
            };
            
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = new TransactionService();
