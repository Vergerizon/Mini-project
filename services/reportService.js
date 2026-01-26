/**
 * Report Service
 * Business logic untuk reporting dan analisis data
 */

const { pool } = require('../database/config');

class ReportService {
    /**
     * Get total transactions per user
     * @param {object} options - Query options
     * @returns {array} User transaction summary
     */
    async getUserTransactionSummary(options = {}) {
        const { start_date = null, end_date = null } = options;
        
        let dateFilter = '';
        const values = [];
        
        if (start_date && end_date) {
            dateFilter = 'AND t.created_at BETWEEN ? AND ?';
            values.push(start_date, end_date + ' 23:59:59');
        } else if (start_date) {
            dateFilter = 'AND t.created_at >= ?';
            values.push(start_date);
        } else if (end_date) {
            dateFilter = 'AND t.created_at <= ?';
            values.push(end_date + ' 23:59:59');
        }
        
        const [rows] = await pool.query(
            `SELECT 
                u.id AS user_id,
                u.name AS user_name,
                u.email,
                u.phone_number,
                u.balance AS current_balance,
                COUNT(t.id) AS total_transactions,
                SUM(CASE WHEN t.status = 'SUCCESS' THEN 1 ELSE 0 END) AS success_count,
                SUM(CASE WHEN t.status = 'FAILED' THEN 1 ELSE 0 END) AS failed_count,
                SUM(CASE WHEN t.status = 'PENDING' THEN 1 ELSE 0 END) AS pending_count,
                COALESCE(SUM(CASE WHEN t.status = 'SUCCESS' THEN t.amount ELSE 0 END), 0) AS total_spent,
                CASE 
                    WHEN COUNT(CASE WHEN t.status = 'SUCCESS' THEN 1 END) > 0 
                    THEN COALESCE(SUM(CASE WHEN t.status = 'SUCCESS' THEN t.amount ELSE 0 END), 0) / COUNT(CASE WHEN t.status = 'SUCCESS' THEN 1 END)
                    ELSE 0 
                END AS average_transaction,
                MAX(t.created_at) AS last_transaction
             FROM users u
             LEFT JOIN transactions t ON u.id = t.user_id ${dateFilter ? dateFilter.replace('AND', 'AND') : ''}
             GROUP BY u.id, u.name, u.email, u.phone_number, u.balance
             ORDER BY total_spent DESC`,
            values
        );
        
        return rows;
    }

    /**
     * Get total revenue per product
     * @param {object} options - Query options
     * @returns {array} Product revenue summary
     */
    async getProductRevenueSummary(options = {}) {
        const { start_date = null, end_date = null, type = null } = options;
        
        const conditions = [];
        const values = [];
        
        if (start_date && end_date) {
            conditions.push('t.created_at BETWEEN ? AND ?');
            values.push(start_date, end_date + ' 23:59:59');
        } else if (start_date) {
            conditions.push('t.created_at >= ?');
            values.push(start_date);
        } else if (end_date) {
            conditions.push('t.created_at <= ?');
            values.push(end_date + ' 23:59:59');
        }
        
        if (type) {
            conditions.push('p.type = ?');
            values.push(type);
        }
        
        const whereClause = conditions.length > 0 
            ? 'WHERE ' + conditions.join(' AND ')
            : '';
        
        // Get total revenue first for percentage calculation
        const [totalResult] = await pool.query(
            `SELECT COALESCE(SUM(CASE WHEN t.status = 'SUCCESS' THEN t.amount ELSE 0 END), 0) as grand_total
             FROM transactions t
             ${start_date || end_date ? 'WHERE ' + conditions.filter(c => !c.includes('p.type')).join(' AND ') : ''}`,
            values.filter((v, i) => !conditions[i]?.includes('p.type'))
        );
        const grandTotal = parseFloat(totalResult[0].grand_total) || 1;
        
        const [rows] = await pool.query(
            `SELECT 
                p.id AS product_id,
                p.name AS product_name,
                p.type AS product_type,
                c.name AS category_name,
                p.price AS current_price,
                p.is_active,
                COUNT(t.id) AS total_sold,
                COALESCE(SUM(CASE WHEN t.status = 'SUCCESS' THEN t.amount ELSE 0 END), 0) AS total_revenue,
                COALESCE(SUM(CASE WHEN t.status = 'SUCCESS' THEN 1 ELSE 0 END), 0) AS success_count,
                COALESCE(SUM(CASE WHEN t.status = 'FAILED' THEN 1 ELSE 0 END), 0) AS failed_count
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.id
             LEFT JOIN transactions t ON p.id = t.product_id ${whereClause ? 'AND ' + conditions.join(' AND ') : ''}
             GROUP BY p.id, p.name, p.type, c.name, p.price, p.is_active
             ORDER BY total_revenue DESC`,
            values
        );
        
        // Add percentage to each row
        return rows.map(row => ({
            ...row,
            percentage_of_total: ((parseFloat(row.total_revenue) / grandTotal) * 100).toFixed(2)
        }));
    }

    /**
     * Get failed transactions in date range
     * @param {object} options - Query options
     * @returns {object} Failed transactions list with summary
     */
    async getFailedTransactions(options = {}) {
        const { start_date = null, end_date = null, page = 1, limit = 20 } = options;
        
        const offset = (page - 1) * limit;
        const conditions = ["t.status = 'FAILED'"];
        const values = [];
        
        if (start_date) {
            conditions.push('t.created_at >= ?');
            values.push(start_date);
        }
        
        if (end_date) {
            conditions.push('t.created_at <= ?');
            values.push(end_date + ' 23:59:59');
        }
        
        const whereClause = 'WHERE ' + conditions.join(' AND ');
        
        // Get total count and sum
        const [summaryResult] = await pool.query(
            `SELECT COUNT(*) as total, COALESCE(SUM(amount), 0) as total_amount FROM transactions t ${whereClause}`,
            values
        );
        const totalItems = summaryResult[0].total;
        const totalLostRevenue = summaryResult[0].total_amount;
        const totalPages = Math.ceil(totalItems / limit);
        
        // Get failed transactions
        const [rows] = await pool.query(
            `SELECT 
                t.id,
                t.reference_number,
                t.user_id,
                u.name AS user_name,
                u.email AS user_email,
                t.product_id,
                p.name AS product_name,
                p.type AS product_type,
                t.customer_number,
                t.amount,
                t.status,
                t.notes,
                t.created_at
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
            },
            summary: {
                total_failed: totalItems,
                total_lost_revenue: parseFloat(totalLostRevenue).toFixed(2)
            }
        };
    }

    /**
     * Get overall dashboard summary
     * @param {object} options - Query options
     * @returns {object} Dashboard summary
     */
    async getDashboardSummary(options = {}) {
        const { start_date = null, end_date = null } = options;
        
        let dateFilter = '';
        const values = [];
        
        if (start_date && end_date) {
            dateFilter = 'AND created_at BETWEEN ? AND ?';
            values.push(start_date, end_date + ' 23:59:59');
        } else if (start_date) {
            dateFilter = 'AND created_at >= ?';
            values.push(start_date);
        } else if (end_date) {
            dateFilter = 'AND created_at <= ?';
            values.push(end_date + ' 23:59:59');
        }
        
        // Total users
        const [usersCount] = await pool.query('SELECT COUNT(*) as total FROM users');
        
        // Total products
        const [productsCount] = await pool.query('SELECT COUNT(*) as total, SUM(is_active) as active FROM products');
        
        // Transaction summary
        const [transactionSummary] = await pool.query(
            `SELECT 
                COUNT(*) as total_transactions,
                SUM(CASE WHEN status = 'SUCCESS' THEN 1 ELSE 0 END) as success_count,
                SUM(CASE WHEN status = 'FAILED' THEN 1 ELSE 0 END) as failed_count,
                SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as pending_count,
                COALESCE(SUM(CASE WHEN status = 'SUCCESS' THEN amount ELSE 0 END), 0) as total_revenue
             FROM transactions
             WHERE 1=1 ${dateFilter}`,
            values
        );
        
        // Revenue by product type
        const [revenueByType] = await pool.query(
            `SELECT 
                p.type,
                COUNT(t.id) as transaction_count,
                COALESCE(SUM(CASE WHEN t.status = 'SUCCESS' THEN t.amount ELSE 0 END), 0) as revenue
             FROM products p
             LEFT JOIN transactions t ON p.id = t.product_id ${dateFilter ? dateFilter.replace('AND', 'AND') : ''}
             GROUP BY p.type
             ORDER BY revenue DESC`,
            values
        );
        
        // Recent transactions
        const [recentTransactions] = await pool.query(
            `SELECT 
                t.id,
                t.reference_number,
                u.name as user_name,
                p.name as product_name,
                t.amount,
                t.status,
                t.created_at
             FROM transactions t
             JOIN users u ON t.user_id = u.id
             JOIN products p ON t.product_id = p.id
             ORDER BY t.created_at DESC
             LIMIT 10`
        );
        
        return {
            users: {
                total: usersCount[0].total
            },
            products: {
                total: productsCount[0].total,
                active: productsCount[0].active || 0
            },
            transactions: {
                total: transactionSummary[0].total_transactions,
                success: transactionSummary[0].success_count || 0,
                failed: transactionSummary[0].failed_count || 0,
                pending: transactionSummary[0].pending_count || 0,
                total_revenue: parseFloat(transactionSummary[0].total_revenue) || 0,
                average_transaction: transactionSummary[0].total_transactions > 0 
                    ? (parseFloat(transactionSummary[0].total_revenue) / (transactionSummary[0].success_count || 1)).toFixed(2)
                    : "0.00"
            },
            revenue_by_type: revenueByType,
            recent_transactions: recentTransactions,
            period: {
                start_date: start_date || 'All time',
                end_date: end_date || 'All time'
            }
        };
    }

    /**
     * Get daily transaction summary
     * @param {object} options - Query options
     * @returns {object} Daily summary with totals
     */
    async getDailyTransactionSummary(options = {}) {
        const { start_date = null, end_date = null, days = 30 } = options;
        
        let dateFilter = '';
        const values = [];
        
        if (start_date && end_date) {
            dateFilter = 'WHERE created_at BETWEEN ? AND ?';
            values.push(start_date, end_date + ' 23:59:59');
        } else {
            // Default: last N days
            dateFilter = 'WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)';
            values.push(days);
        }
        
        const [rows] = await pool.query(
            `SELECT 
                DATE(created_at) as date,
                COUNT(*) as total_transactions,
                SUM(CASE WHEN status = 'SUCCESS' THEN 1 ELSE 0 END) as success_count,
                SUM(CASE WHEN status = 'FAILED' THEN 1 ELSE 0 END) as failed_count,
                SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as pending_count,
                COALESCE(SUM(CASE WHEN status = 'SUCCESS' THEN amount ELSE 0 END), 0) as daily_revenue,
                CASE 
                    WHEN SUM(CASE WHEN status = 'SUCCESS' THEN 1 ELSE 0 END) > 0 
                    THEN COALESCE(SUM(CASE WHEN status = 'SUCCESS' THEN amount ELSE 0 END), 0) / SUM(CASE WHEN status = 'SUCCESS' THEN 1 ELSE 0 END)
                    ELSE 0 
                END as average_transaction
             FROM transactions
             ${dateFilter}
             GROUP BY DATE(created_at)
             ORDER BY date DESC`,
            values
        );
        
        // Calculate summary
        const totalDays = rows.length;
        const totalTransactions = rows.reduce((sum, r) => sum + parseInt(r.total_transactions), 0);
        const totalRevenue = rows.reduce((sum, r) => sum + parseFloat(r.daily_revenue), 0);
        const dailyAverageRevenue = totalDays > 0 ? totalRevenue / totalDays : 0;
        
        return {
            data: rows,
            summary: {
                total_days: totalDays,
                total_transactions: totalTransactions,
                total_revenue: totalRevenue.toFixed(2),
                daily_average_revenue: dailyAverageRevenue.toFixed(2)
            }
        };
    }
}

module.exports = new ReportService();
