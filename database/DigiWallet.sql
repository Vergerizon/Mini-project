-- =============================================
-- TABLE: hashpassword
-- Menyimpan riwayat hash password user (opsional, untuk audit/history)
-- =============================================
CREATE TABLE hashpassword (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_hashpassword_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_hashpassword_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- =============================================
-- TABLE: hashpassword
-- Menyimpan riwayat hash password user (opsional, untuk audit/history)
-- =============================================
CREATE TABLE hashpassword (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_hashpassword_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_hashpassword_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- =============================================
-- PPOB (Payment Point Online Bank) Database Schema
-- DigiWallet - Complete Database Design
-- =============================================

-- Drop tables if exists (for fresh setup)
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15) NULL,
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Index untuk optimasi query
    INDEX idx_users_email (email),
    INDEX idx_users_phone (phone_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLE: sessions
-- Menyimpan data sesi login user
-- =============================================
CREATE TABLE sessions (
    session_id CHAR(36) PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expired_at TIMESTAMP NOT NULL,
    
    CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_sessions_user (user_id),
    INDEX idx_sessions_expired (expired_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    parent_id INT NULL,
    description TEXT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Key untuk parent category (self-referencing)
    CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id) 
        REFERENCES categories(id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Index untuk optimasi query
    INDEX idx_categories_parent (parent_id),
    INDEX idx_categories_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLE: products
-- Menyimpan data produk PPOB (pulsa, data, pln, dll)
-- =============================================
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    category_id INT NULL,
    type ENUM('pulsa', 'data', 'pln', 'pdam', 'internet', 'game', 'ewallet') NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    description TEXT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Key untuk category
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) 
        REFERENCES categories(id) ON DELETE SET NULL ON UPDATE CASCADE,
    
    -- Index untuk optimasi query
    INDEX idx_products_category (category_id),
    INDEX idx_products_type (type),
    INDEX idx_products_active (is_active),
    INDEX idx_products_price (price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLE: transactions  
-- Menyimpan data transaksi pembelian produk PPOB
-- =============================================
CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    customer_number VARCHAR(50) NOT NULL COMMENT 'Nomor tujuan (HP, meter listrik, dll)',
    amount DECIMAL(15, 2) NOT NULL COMMENT 'Nominal transaksi',
    status ENUM('PENDING', 'SUCCESS', 'FAILED') DEFAULT 'PENDING',
    reference_number VARCHAR(50) UNIQUE NOT NULL COMMENT 'Nomor referensi unik transaksi',
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_transactions_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    -- Index untuk optimasi query
    INDEX idx_transactions_user (user_id),
    INDEX idx_transactions_product (product_id),
    INDEX idx_transactions_status (status),
    INDEX idx_transactions_created (created_at),
    INDEX idx_transactions_reference (reference_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- SAMPLE DATA: Categories
-- =============================================
INSERT INTO categories (name, parent_id, description, is_active) VALUES
-- Parent Categories
('Top Up', NULL, 'Layanan isi ulang pulsa dan paket', TRUE),
('Tagihan', NULL, 'Pembayaran tagihan bulanan', TRUE),
('Hiburan', NULL, 'Layanan hiburan dan entertainment', TRUE),
('E-Wallet', NULL, 'Top up dompet digital', TRUE);

-- Sub Categories untuk Top Up (parent_id = 1)
INSERT INTO categories (name, parent_id, description, is_active) VALUES
('Pulsa', 1, 'Isi ulang pulsa semua operator', TRUE),
('Paket Data', 1, 'Paket internet semua operator', TRUE);

-- Sub Categories untuk Tagihan (parent_id = 2)
INSERT INTO categories (name, parent_id, description, is_active) VALUES
('Listrik PLN', 2, 'Pembayaran dan token listrik PLN', TRUE),
('PDAM', 2, 'Pembayaran tagihan air PDAM', TRUE),
('Internet', 2, 'Pembayaran tagihan internet', TRUE);

-- Sub Categories untuk Hiburan (parent_id = 3)
INSERT INTO categories (name, parent_id, description, is_active) VALUES
('Game Voucher', 3, 'Voucher game online', TRUE),
('Streaming', 3, 'Layanan streaming video dan musik', TRUE);

-- Sub Categories untuk E-Wallet (parent_id = 4)
INSERT INTO categories (name, parent_id, description, is_active) VALUES
('GoPay', 4, 'Top up saldo GoPay', TRUE),
('OVO', 4, 'Top up saldo OVO', TRUE),
('DANA', 4, 'Top up saldo DANA', TRUE),
('ShopeePay', 4, 'Top up saldo ShopeePay', TRUE);

-- =============================================
-- SAMPLE DATA: Products
-- =============================================
INSERT INTO products (name, category_id, type, price, description, is_active) VALUES
-- Pulsa (category_id = 5)
('Pulsa 10.000', 5, 'pulsa', 11000.00, 'Pulsa All Operator Rp 10.000', TRUE),
('Pulsa 25.000', 5, 'pulsa', 26000.00, 'Pulsa All Operator Rp 25.000', TRUE),
('Pulsa 50.000', 5, 'pulsa', 51000.00, 'Pulsa All Operator Rp 50.000', TRUE),
('Pulsa 100.000', 5, 'pulsa', 101000.00, 'Pulsa All Operator Rp 100.000', TRUE),

-- Paket Data (category_id = 6)
('Data 1GB 30 Hari', 6, 'data', 15000.00, 'Paket Data 1GB Masa Aktif 30 Hari', TRUE),
('Data 3GB 30 Hari', 6, 'data', 35000.00, 'Paket Data 3GB Masa Aktif 30 Hari', TRUE),
('Data 5GB 30 Hari', 6, 'data', 50000.00, 'Paket Data 5GB Masa Aktif 30 Hari', TRUE),
('Data 10GB 30 Hari', 6, 'data', 85000.00, 'Paket Data 10GB Masa Aktif 30 Hari', TRUE),

-- Token PLN (category_id = 7)
('Token PLN 20.000', 7, 'pln', 21500.00, 'Token Listrik PLN Rp 20.000', TRUE),
('Token PLN 50.000', 7, 'pln', 51500.00, 'Token Listrik PLN Rp 50.000', TRUE),
('Token PLN 100.000', 7, 'pln', 101500.00, 'Token Listrik PLN Rp 100.000', TRUE),
('Token PLN 200.000', 7, 'pln', 201500.00, 'Token Listrik PLN Rp 200.000', TRUE),

-- PDAM (category_id = 8)
('PDAM Bayar Tagihan', 8, 'pdam', 2500.00, 'Biaya Admin Pembayaran PDAM', TRUE),

-- Internet (category_id = 9)
('Internet Bayar Tagihan', 9, 'internet', 2500.00, 'Biaya Admin Pembayaran Internet', TRUE),

-- Game Voucher (category_id = 10)
('Mobile Legends 86 Diamonds', 10, 'game', 22000.00, 'Voucher ML 86 Diamonds', TRUE),
('Mobile Legends 172 Diamonds', 10, 'game', 44000.00, 'Voucher ML 172 Diamonds', TRUE),
('Free Fire 100 Diamonds', 10, 'game', 15000.00, 'Voucher FF 100 Diamonds', TRUE),

-- E-Wallet GoPay (category_id = 12)
('GoPay 50.000', 12, 'ewallet', 51000.00, 'Top Up GoPay Rp 50.000', TRUE),
-- E-Wallet OVO (category_id = 13)
('OVO 50.000', 13, 'ewallet', 51000.00, 'Top Up OVO Rp 50.000', TRUE),
-- E-Wallet DANA (category_id = 14)
('DANA 50.000', 14, 'ewallet', 51000.00, 'Top Up DANA Rp 50.000', TRUE);

-- =============================================
-- SAMPLE DATA: Users
-- =============================================
INSERT INTO users (name, email, phone_number, balance) VALUES
('John Doe', 'john@example.com', '081234567890', 500000.00),
('Jane Smith', 'jane@example.com', '081234567891', 250000.00),
('Ahmad Rizki', 'ahmad@example.com', '081234567892', 1000000.00);

-- =============================================
-- REPORTING VIEWS & QUERIES
-- =============================================

-- View: Total transaksi per user
CREATE OR REPLACE VIEW v_user_transaction_summary AS
SELECT 
    u.id AS user_id,
    u.name AS user_name,
    u.email,
    u.balance AS current_balance,
    COUNT(t.id) AS total_transactions,
    SUM(CASE WHEN t.status = 'SUCCESS' THEN 1 ELSE 0 END) AS success_count,
    SUM(CASE WHEN t.status = 'FAILED' THEN 1 ELSE 0 END) AS failed_count,
    SUM(CASE WHEN t.status = 'SUCCESS' THEN t.amount ELSE 0 END) AS total_spent
FROM users u
LEFT JOIN transactions t ON u.id = t.user_id
GROUP BY u.id, u.name, u.email, u.balance;

-- View: Total omzet per produk
CREATE OR REPLACE VIEW v_product_revenue_summary AS
SELECT 
    p.id AS product_id,
    p.name AS product_name,
    p.type AS product_type,
    c.name AS category_name,
    p.price,
    p.is_active,
    COUNT(t.id) AS total_sold,
    SUM(CASE WHEN t.status = 'SUCCESS' THEN t.amount ELSE 0 END) AS total_revenue
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN transactions t ON p.id = t.product_id
GROUP BY p.id, p.name, p.type, c.name, p.price, p.is_active;

-- View: Category hierarchy dengan parent name
CREATE OR REPLACE VIEW v_category_hierarchy AS
SELECT 
    c.id,
    c.name,
    c.parent_id,
    p.name AS parent_name,
    c.description,
    c.is_active,
    c.created_at
FROM categories c
LEFT JOIN categories p ON c.parent_id = p.id;

-- Query: Recursive category path (untuk mendapatkan full path category)
-- Contoh penggunaan:
-- WITH RECURSIVE category_path (id, name, path) AS (
--     SELECT id, name, name as path FROM categories WHERE parent_id IS NULL
--     UNION ALL
--     SELECT c.id, c.name, CONCAT(cp.path, ' > ', c.name)
--     FROM category_path AS cp JOIN categories AS c ON cp.id = c.parent_id
-- ) SELECT * FROM category_path;

-- Ubah definisi tabel transactions:
ALTER TABLE transactions 
MODIFY status ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED') DEFAULT 'PENDING';

ALTER TABLE users ADD COLUMN password VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER';