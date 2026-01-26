/**
 * User Service
 * Business logic untuk operasi user
 */

const { pool } = require('../database/config');
const { ERROR_MESSAGES } = require('../utils/respons');

class UserService {
    /**
     * Create new user
     * @param {object} userData - User data
     * @returns {object} Created user
     */
    async createUser(userData) {
        const { name, email, phone_number } = userData;
        
        // Check if email already exists
        const [existing] = await pool.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );
        
        if (existing.length > 0) {
            const error = new Error(ERROR_MESSAGES.USER_ALREADY_EXISTS);
            error.status = 409;
            throw error;
        }
        
        // Create user with default balance = 0
        const [result] = await pool.query(
            'INSERT INTO users (name, email, phone_number, balance) VALUES (?, ?, ?, 0)',
            [name, email, phone_number || null]
        );
        
        return this.getUserById(result.insertId);
    }

    /**
     * Get all users with pagination
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     * @returns {object} Users list with pagination info
     */
    async getUsers(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        
        // Get total count
        const [countResult] = await pool.query('SELECT COUNT(*) as total FROM users');
        const totalItems = countResult[0].total;
        const totalPages = Math.ceil(totalItems / limit);
        
        // Get users
        const [rows] = await pool.query(
            `SELECT id, name, email, phone_number, balance, created_at, updated_at 
             FROM users 
             ORDER BY created_at DESC 
             LIMIT ? OFFSET ?`,
            [limit, offset]
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
     * Get user by ID
     * @param {number} id - User ID
     * @returns {object|null} User data
     */
    async getUserById(id) {
        const [rows] = await pool.query(
            `SELECT id, name, email, phone_number, balance, created_at, updated_at 
             FROM users WHERE id = ?`,
            [id]
        );
        
        if (rows.length === 0) {
            const error = new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            error.status = 404;
            throw error;
        }
        
        return rows[0];
    }

    /**
     * Update user
     * @param {number} id - User ID
     * @param {object} userData - User data to update
     * @returns {object} Updated user
     */
    async updateUser(id, userData) {
        // Check if user exists
        await this.getUserById(id);
        
        const { name, email, phone_number, balance } = userData;
        
        // If email is being updated, check for duplicates
        if (email) {
            const [existing] = await pool.query(
                'SELECT id FROM users WHERE email = ? AND id != ?',
                [email, id]
            );
            
            if (existing.length > 0) {
                const error = new Error(ERROR_MESSAGES.USER_ALREADY_EXISTS);
                error.status = 409;
                throw error;
            }
        }
        
        // Build dynamic update query
        const updates = [];
        const values = [];
        
        if (name !== undefined) {
            updates.push('name = ?');
            values.push(name);
        }
        if (email !== undefined) {
            updates.push('email = ?');
            values.push(email);
        }
        if (phone_number !== undefined) {
            updates.push('phone_number = ?');
            values.push(phone_number);
        }
        if (balance !== undefined) {
            updates.push('balance = ?');
            values.push(balance);
        }
        
        if (updates.length > 0) {
            values.push(id);
            await pool.query(
                `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
                values
            );
        }
        
        return this.getUserById(id);
    }

    /**
     * Delete user
     * @param {number} id - User ID
     * @returns {boolean} Success status
     */
    async deleteUser(id) {
        // Check if user exists
        await this.getUserById(id);
        
        // Check if user has transactions
        const [transactions] = await pool.query(
            'SELECT id FROM transactions WHERE user_id = ? LIMIT 1',
            [id]
        );
        
        if (transactions.length > 0) {
            const error = new Error('User tidak dapat dihapus karena sudah memiliki transaksi');
            error.status = 400;
            throw error;
        }
        
        await pool.query('DELETE FROM users WHERE id = ?', [id]);
        return true;
    }

    /**
     * Update user balance (for internal use)
     * @param {object} connection - Database connection (for transaction)
     * @param {number} userId - User ID
     * @param {number} amount - Amount to deduct (positive number)
     * @returns {object} Updated user
     */
    async deductBalance(connection, userId, amount) {
        // Lock the row for update (prevent race condition)
        const [users] = await connection.query(
            'SELECT id, balance FROM users WHERE id = ? FOR UPDATE',
            [userId]
        );
        
        if (users.length === 0) {
            const error = new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            error.status = 404;
            throw error;
        }
        
        const user = users[0];
        const currentBalance = parseFloat(user.balance);
        
        if (currentBalance < amount) {
            const error = new Error(ERROR_MESSAGES.INSUFFICIENT_BALANCE);
            error.status = 400;
            throw error;
        }
        
        const newBalance = currentBalance - amount;
        
        await connection.query(
            'UPDATE users SET balance = ? WHERE id = ?',
            [newBalance, userId]
        );
        
        return { ...user, balance: newBalance };
    }

    /**
     * Add balance to user (for top up)
     * @param {number} userId - User ID
     * @param {number} amount - Amount to add
     * @returns {object} Updated user with top up details
     */
    async addBalance(userId, amount) {
        const user = await this.getUserById(userId);
        const previousBalance = parseFloat(user.balance);
        
        await pool.query(
            'UPDATE users SET balance = balance + ? WHERE id = ?',
            [amount, userId]
        );
        
        const updatedUser = await this.getUserById(userId);
        
        return {
            ...updatedUser,
            previous_balance: previousBalance.toFixed(2),
            top_up_amount: parseFloat(amount).toFixed(2)
        };
    }
}

module.exports = new UserService();   