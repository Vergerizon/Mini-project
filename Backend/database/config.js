const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT || 3306,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'DigiWallet',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Database connection established successfully.');
        connection.release();
    } catch (error) {
        console.error('Error connecting to the database:', error);
        return false;    
    }
}

module.exports = { pool, testConnection };