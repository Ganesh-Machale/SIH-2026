-- ============================================================
-- KisanNiti AI - Database Schema (MySQL / SQLite Compatible)
-- SIH 2026 Problem Statement ID: SIH26132
-- ============================================================

-- Drop tables if exists for clean reset
DROP TABLE IF EXISTS saved_opportunities;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS Recommendations;
DROP TABLE IF EXISTS price_forecasts;
DROP TABLE IF EXISTS farmer_produce;
DROP TABLE IF EXISTS buyer_requirements;
DROP TABLE IF EXISTS market_arrivals;
DROP TABLE IF EXISTS market_prices;
DROP TABLE IF EXISTS buyers;
DROP TABLE IF EXISTS fpos;
DROP TABLE IF EXISTS farmers;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS markets;
DROP TABLE IF EXISTS crops;

-- 1. Users table (Farmers, FPOs, Buyers, Admin)
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('FARMER', 'FPO', 'BUYER', 'ADMIN')),
    location VARCHAR(100) NOT NULL,
    preferred_language VARCHAR(20) DEFAULT 'English',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Farmers detail table
CREATE TABLE farmers (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    farm_size_acres DECIMAL(6,2),
    primary_crops VARCHAR(255),
    storage_available BOOLEAN DEFAULT FALSE,
    storage_capacity_quintals DECIMAL(8,2) DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. FPOs detail table
CREATE TABLE fpos (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    org_name VARCHAR(150) NOT NULL,
    member_count INT DEFAULT 0,
    registration_no VARCHAR(50),
    aggregated_capacity_tonnes DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Buyers detail table
CREATE TABLE buyers (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    business_name VARCHAR(150) NOT NULL,
    buyer_type VARCHAR(50) NOT NULL, -- e.g. 'Processor', 'Wholesaler', 'Exporter', 'Retail Chain'
    required_crops VARCHAR(255),
    payment_terms VARCHAR(100) DEFAULT '7 days',
    reliability_rating DECIMAL(3,2) DEFAULT 4.5,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Crops table
CREATE TABLE crops (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    shelf_life_days INT DEFAULT 7,
    spoilage_rate_daily_percent DECIMAL(4,2) DEFAULT 1.5,
    icon_name VARCHAR(50) DEFAULT 'sprout'
);

-- 6. Markets (Mandis) table
CREATE TABLE markets (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL DEFAULT 'Maharashtra',
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    avg_commission_percent DECIMAL(4,2) DEFAULT 1.0,
    storage_rate_per_q_day DECIMAL(6,2) DEFAULT 1.50,
    loading_unloading_per_q DECIMAL(6,2) DEFAULT 10.00
);

-- 7. Market Prices (Current and Daily)
CREATE TABLE market_prices (
    id VARCHAR(36) PRIMARY KEY,
    market_id VARCHAR(36) NOT NULL,
    crop_id VARCHAR(36) NOT NULL,
    min_price_per_q DECIMAL(8,2) NOT NULL,
    max_price_per_q DECIMAL(8,2) NOT NULL,
    modal_price_per_q DECIMAL(8,2) NOT NULL,
    grade VARCHAR(20) DEFAULT 'Grade A',
    recorded_date DATE NOT NULL,
    FOREIGN KEY (market_id) REFERENCES markets(id) ON DELETE CASCADE,
    FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE CASCADE
);

-- 8. Market Arrivals
CREATE TABLE market_arrivals (
    id VARCHAR(36) PRIMARY KEY,
    market_id VARCHAR(36) NOT NULL,
    crop_id VARCHAR(36) NOT NULL,
    arrival_quantity_tonnes DECIMAL(10,2) NOT NULL,
    demand_level VARCHAR(20) DEFAULT 'HIGH', -- 'HIGH', 'MEDIUM', 'LOW'
    recorded_date DATE NOT NULL,
    FOREIGN KEY (market_id) REFERENCES markets(id) ON DELETE CASCADE,
    FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE CASCADE
);

-- 9. Buyer Requirements (Demands posted by buyers)
CREATE TABLE buyer_requirements (
    id VARCHAR(36) PRIMARY KEY,
    buyer_id VARCHAR(36) NOT NULL,
    crop_id VARCHAR(36) NOT NULL,
    required_quantity_quintals DECIMAL(10,2) NOT NULL,
    required_grade VARCHAR(20) NOT NULL DEFAULT 'Grade A',
    offered_price_per_q DECIMAL(8,2) NOT NULL,
    target_location VARCHAR(100) NOT NULL,
    payment_terms VARCHAR(100) DEFAULT '7-day payment',
    required_by_date DATE,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES buyers(id) ON DELETE CASCADE,
    FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE CASCADE
);

-- 10. Farmer Produce Listings
CREATE TABLE farmer_produce (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    crop_id VARCHAR(36) NOT NULL,
    quantity_quintals DECIMAL(10,2) NOT NULL,
    grade VARCHAR(20) NOT NULL DEFAULT 'Grade A',
    harvest_date DATE NOT NULL,
    available_from_date DATE NOT NULL,
    farmer_location VARCHAR(100) NOT NULL,
    storage_available BOOLEAN DEFAULT FALSE,
    max_storage_days INT DEFAULT 0,
    urgency VARCHAR(20) DEFAULT 'MEDIUM', -- 'LOW', 'MEDIUM', 'HIGH'
    min_acceptable_price_per_q DECIMAL(8,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'AVAILABLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE CASCADE
);

-- 11. Price Forecasts (AI ML predictions)
CREATE TABLE price_forecasts (
    id VARCHAR(36) PRIMARY KEY,
    crop_id VARCHAR(36) NOT NULL,
    market_id VARCHAR(36) NOT NULL,
    current_price_per_q DECIMAL(8,2) NOT NULL,
    pred_3day_price_per_q DECIMAL(8,2) NOT NULL,
    pred_7day_price_per_q DECIMAL(8,2) NOT NULL,
    pred_15day_price_per_q DECIMAL(8,2) NOT NULL,
    trend VARCHAR(30) NOT NULL, -- 'Strongly Increasing', 'Moderately Increasing', 'Stable', 'Decreasing'
    confidence_percent INT DEFAULT 85,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE CASCADE,
    FOREIGN KEY (market_id) REFERENCES markets(id) ON DELETE CASCADE
);

-- 12. Recommendations generated by AI Engine
CREATE TABLE recommendations (
    id VARCHAR(36) PRIMARY KEY,
    produce_id VARCHAR(36) NOT NULL,
    recommended_market_id VARCHAR(36) NOT NULL,
    recommended_buyer_id VARCHAR(36),
    recommended_window_days INT DEFAULT 3,
    expected_selling_price_per_q DECIMAL(8,2) NOT NULL,
    gross_revenue DECIMAL(12,2) NOT NULL,
    total_logistics_cost DECIMAL(10,2) NOT NULL,
    expected_net_realization DECIMAL(12,2) NOT NULL,
    opportunity_score INT NOT NULL, -- 0 to 100
    confidence_percent INT DEFAULT 87,
    reasons_json TEXT NOT NULL, -- JSON array of bullet strings
    why_not_others_json TEXT, -- JSON explanation for alternative markets
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (produce_id) REFERENCES farmer_produce(id) ON DELETE CASCADE,
    FOREIGN KEY (recommended_market_id) REFERENCES markets(id) ON DELETE CASCADE
);

-- 13. Transactions & Sales History
CREATE TABLE transactions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    crop_id VARCHAR(36) NOT NULL,
    market_id VARCHAR(36),
    buyer_id VARCHAR(36),
    quantity_quintals DECIMAL(10,2) NOT NULL,
    selling_price_per_q DECIMAL(8,2) NOT NULL,
    gross_revenue DECIMAL(12,2) NOT NULL,
    transport_cost DECIMAL(10,2) DEFAULT 0,
    storage_cost DECIMAL(10,2) DEFAULT 0,
    commission_cost DECIMAL(10,2) DEFAULT 0,
    other_costs DECIMAL(10,2) DEFAULT 0,
    final_net_realization DECIMAL(12,2) NOT NULL,
    sale_date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE CASCADE
);

-- 14. Notifications
CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) DEFAULT 'INFO', -- 'PRICE_ALERT', 'BUYER_MATCH', 'RECOMMENDATION', 'INFO'
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 15. Saved Opportunities
CREATE TABLE saved_opportunities (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    market_id VARCHAR(36),
    buyer_id VARCHAR(36),
    title VARCHAR(150) NOT NULL,
    expected_net_realization DECIMAL(12,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
