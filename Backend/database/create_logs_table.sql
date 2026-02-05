-- =============================================
-- TABLE: logs
-- Menyimpan log operasi POST, PATCH/PUT, dan DELETE
-- =============================================
CREATE TABLE IF NOT EXISTS logs (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID logging (primary key)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Waktu operasi',
    involved_parties TEXT COMMENT 'Pihak-pihak yang terlibat dalam operasi (user_id, target_id, dll)',
    operation_type VARCHAR(10) NOT NULL COMMENT 'Jenis operasi (POST, PUT, PATCH, DELETE)',
    http_status_code INT NOT NULL COMMENT 'HTTP status code response',
    response TEXT COMMENT 'Response body dari operasi',
    endpoint VARCHAR(255) NOT NULL COMMENT 'Endpoint yang digunakan',
    INDEX idx_logs_created_at (created_at),
    INDEX idx_logs_operation (operation_type),
    INDEX idx_logs_status (http_status_code),
    INDEX idx_logs_endpoint (endpoint)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

USE digiwallet; -- Ganti dengan nama database Anda

ALTER TABLE logs DROP COLUMN involved_parties;