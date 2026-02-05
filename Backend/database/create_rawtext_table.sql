-- =============================================
-- TABLE: rawtext
-- Menyimpan receipt/struk dalam format TEXT dan BLOB
-- =============================================

-- Drop table if exists (untuk fresh setup)
DROP TABLE IF EXISTS rawtext;

-- Create rawtext table
CREATE TABLE rawtext (
    id INT PRIMARY KEY AUTO_INCREMENT,
    transaction_id INT NOT NULL UNIQUE,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    product_type VARCHAR(50) NOT NULL,
    customer_number VARCHAR(50) NOT NULL,
    subtotal DECIMAL(15, 2) NOT NULL,
    tax_amount DECIMAL(15, 2) NOT NULL COMMENT '11% tax',
    total_amount DECIMAL(15, 2) NOT NULL,
    reference_number VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    receipt_text LONGTEXT NOT NULL COMMENT 'Struk dalam format TEXT plain',
    receipt_blob LONGBLOB NOT NULL COMMENT 'Struk dalam format BLOB binary',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_rawtext_transaction FOREIGN KEY (transaction_id) 
        REFERENCES transactions(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_rawtext_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_rawtext_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_rawtext_transaction (transaction_id),
    INDEX idx_rawtext_user (user_id),
    INDEX idx_rawtext_reference (reference_number),
    INDEX idx_rawtext_status (status),
    INDEX idx_rawtext_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
