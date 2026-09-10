-- ============================================================
-- KisanNiti AI - Seed Data
-- SIH 2026 Problem Statement ID: SIH26132
-- ============================================================

-- 1. Insert Crops
INSERT INTO crops (id, name, category, shelf_life_days, spoilage_rate_daily_percent, icon_name) VALUES
('crop-001', 'Onion', 'Horticulture', 14, 0.80, 'onion'),
('crop-002', 'Tomato', 'Horticulture', 4, 3.50, 'apple'),
('crop-003', 'Potato', 'Horticulture', 30, 0.50, 'potato'),
('crop-004', 'Wheat', 'Grain', 180, 0.10, 'wheat'),
('crop-005', 'Soybean', 'Oilseed', 90, 0.20, 'bean'),
('crop-006', 'Cotton', 'Fiber', 120, 0.05, 'feather');

-- 2. Insert Mandis / Markets (Maharashtra focused)
INSERT INTO markets (id, name, district, state, latitude, longitude, avg_commission_percent, storage_rate_per_q_day, loading_unloading_per_q) VALUES
('mkt-001', 'Lasalgaon Mandi', 'Nashik', 'Maharashtra', 20.1472, 74.2274, 1.0, 1.50, 10.0),
('mkt-002', 'Pune APMC Market', 'Pune', 'Maharashtra', 18.5204, 73.8567, 1.5, 2.00, 12.0),
('mkt-003', 'Pimpalgaon Baswant', 'Nashik', 'Maharashtra', 20.1667, 73.9833, 1.0, 1.40, 9.5),
('mkt-004', 'Solapur APMC', 'Solapur', 'Maharashtra', 17.6599, 75.9064, 1.2, 1.80, 11.0),
('mkt-005', 'Ahmednagar Mandi', 'Ahmednagar', 'Maharashtra', 19.0948, 74.7480, 1.0, 1.50, 10.0),
('mkt-006', 'Sangli APMC', 'Sangli', 'Maharashtra', 16.8524, 74.5815, 1.2, 1.75, 11.5),
('mkt-007', 'Nagpur APMC', 'Nagpur', 'Maharashtra', 21.1458, 79.0882, 1.5, 2.20, 13.0);

-- 3. Insert Demo Users (Farmer, FPO, Buyer, Admin)
-- Password for all demo accounts is "demo123" (bcrypt hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy)
INSERT INTO users (id, name, email, mobile, password_hash, user_type, location, preferred_language) VALUES
('user-farmer-01', 'Ramesh Patil', 'ramesh@farmer.com', '9876543210', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'FARMER', 'Nashik, Maharashtra', 'Marathi'),
('user-fpo-01', 'Nashik Farmers Producer Co.', 'info@nashikfpo.org', '9876543211', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'FPO', 'Nashik, Maharashtra', 'English'),
('user-buyer-01', 'ABC Agro Processing Pvt Ltd', 'procurement@abcagro.com', '9876543212', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'BUYER', 'Lasalgaon, Nashik', 'English'),
('user-buyer-02', 'Sahyadri Agri Products', 'buy@sahyadri.com', '9876543213', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'BUYER', 'Pune, Maharashtra', 'English'),
('user-admin-01', 'Agri Market Admin', 'admin@kisanniti.gov.in', '9876543214', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', 'Mumbai, Maharashtra', 'English');

-- Insert Farmer details
INSERT INTO farmers (id, user_id, farm_size_acres, primary_crops, storage_available, storage_capacity_quintals) VALUES
('farmer-01', 'user-farmer-01', 8.5, 'Onion, Tomato, Soybean', TRUE, 100.00);

-- Insert FPO details
INSERT INTO fpos (id, user_id, org_name, member_count, registration_no, aggregated_capacity_tonnes) VALUES
('fpo-01', 'user-fpo-01', 'Nashik Farmers Producer Co-operative Ltd', 248, 'FPO-MH-2022-889', 420.00);

-- Insert Buyer details
INSERT INTO buyers (id, user_id, business_name, buyer_type, required_crops, payment_terms, reliability_rating) VALUES
('buyer-01', 'user-buyer-01', 'ABC Agro Processing Pvt Ltd', 'Processor', 'Onion, Tomato', '7-day direct bank transfer', 4.90),
('buyer-02', 'user-buyer-02', 'Sahyadri Agri Products', 'Retail Chain', 'Onion, Potato, Tomato', 'Immediate cash / UPI', 4.75);

-- 4. Market Prices (Current listed prices per quintal - Note: 1 Quintal = 100 kg)
INSERT INTO market_prices (id, market_id, crop_id, min_price_per_q, max_price_per_q, modal_price_per_q, grade, recorded_date) VALUES
-- Lasalgaon Onion
('mp-001', 'mkt-001', 'crop-001', 4200.00, 4900.00, 4600.00, 'Grade A', '2026-09-10'),
-- Pune Onion (Higher listed price ₹4,750, but 210 km away!)
('mp-002', 'mkt-002', 'crop-001', 4400.00, 5100.00, 4750.00, 'Grade A', '2026-09-10'),
-- Pimpalgaon Onion
('mp-003', 'mkt-003', 'crop-001', 4150.00, 4800.00, 4550.00, 'Grade A', '2026-09-10'),
-- Solapur Onion
('mp-004', 'mkt-004', 'crop-001', 4000.00, 4650.00, 4400.00, 'Grade A', '2026-09-10'),
-- Nagpur Onion (High listed price ₹4,900, but 700 km away!)
('mp-005', 'mkt-007', 'crop-001', 4500.00, 5200.00, 4900.00, 'Grade A', '2026-09-10'),

-- Tomato Prices
('mp-006', 'mkt-001', 'crop-002', 1800.00, 2400.00, 2100.00, 'Grade A', '2026-09-10'),
('mp-007', 'mkt-002', 'crop-002', 2000.00, 2600.00, 2350.00, 'Grade A', '2026-09-10'),

-- Potato Prices
('mp-008', 'mkt-001', 'crop-003', 1500.00, 1900.00, 1720.00, 'Grade A', '2026-09-10'),
('mp-009', 'mkt-002', 'crop-003', 1600.00, 2050.00, 1850.00, 'Grade A', '2026-09-10'),

-- Soybean Prices
('mp-010', 'mkt-005', 'crop-005', 4300.00, 4850.00, 4620.00, 'Grade A', '2026-09-10'),
('mp-011', 'mkt-006', 'crop-005', 4400.00, 4900.00, 4700.00, 'Grade A', '2026-09-10');

-- 5. Market Arrivals & Demand
INSERT INTO market_arrivals (id, market_id, crop_id, arrival_quantity_tonnes, demand_level, recorded_date) VALUES
('ma-001', 'mkt-001', 'crop-001', 1240.00, 'HIGH', '2026-09-10'),
('ma-002', 'mkt-002', 'crop-001', 980.00, 'HIGH', '2026-09-10'),
('ma-003', 'mkt-003', 'crop-001', 850.00, 'MEDIUM', '2026-09-10'),
('ma-004', 'mkt-004', 'crop-001', 620.00, 'MEDIUM', '2026-09-10'),
('ma-005', 'mkt-007', 'crop-001', 410.00, 'LOW', '2026-09-10');

-- 6. Buyer Requirements
INSERT INTO buyer_requirements (id, buyer_id, crop_id, required_quantity_quintals, required_grade, offered_price_per_q, target_location, payment_terms, status) VALUES
('br-001', 'buyer-01', 'crop-001', 100.00, 'Grade A', 4700.00, 'Lasalgaon, Nashik', '7-day direct bank transfer', 'ACTIVE'),
('br-002', 'buyer-02', 'crop-001', 80.00, 'Grade A', 4800.00, 'Pune', 'Immediate UPI on delivery', 'ACTIVE'),
('br-003', 'buyer-01', 'crop-002', 50.00, 'Grade A', 2250.00, 'Lasalgaon, Nashik', '3-day bank transfer', 'ACTIVE');

-- 7. Seed Produce Listing for Ramesh Patil (50 Quintals / 5,000 kg Onion)
INSERT INTO farmer_produce (id, user_id, crop_id, quantity_quintals, grade, harvest_date, available_from_date, farmer_location, storage_available, max_storage_days, urgency, min_acceptable_price_per_q, status) VALUES
('prod-001', 'user-farmer-01', 'crop-001', 50.00, 'Grade A', '2026-09-08', '2026-09-10', 'Nashik, Maharashtra', TRUE, 7, 'MEDIUM', 4200.00, 'AVAILABLE');

-- 8. Price Forecast Data (for Onion across key mandis)
INSERT INTO price_forecasts (id, crop_id, market_id, current_price_per_q, pred_3day_price_per_q, pred_7day_price_per_q, pred_15day_price_per_q, trend, confidence_percent) VALUES
('pf-001', 'crop-001', 'mkt-001', 4600.00, 4720.00, 4650.00, 4510.00, 'Moderately Increasing (Short-term)', 87),
('pf-002', 'crop-001', 'mkt-002', 4750.00, 4810.00, 4700.00, 4580.00, 'Stable to Decreasing', 82),
('pf-003', 'crop-001', 'mkt-007', 4900.00, 4920.00, 4850.00, 4700.00, 'Slow Decline', 78);

-- 9. Seed Sample Recommendations
INSERT INTO recommendations (id, produce_id, recommended_market_id, recommended_buyer_id, recommended_window_days, expected_selling_price_per_q, gross_revenue, total_logistics_cost, expected_net_realization, opportunity_score, confidence_percent, reasons_json, why_not_others_json) VALUES
('rec-001', 'prod-001', 'mkt-001', 'buyer-01', 3, 4720.00, 236000.00, 17500.00, 218500.00, 94, 88, 
'["Expected Net Realization is ₹12,400 higher than second-best option Pune due to 60% lower freight.", "Transport cost from Nashik is only ₹8,500 compared to ₹14,200 for Pune and ₹31,000 for Nagpur.", "High current buyer demand from ABC Agro Processing with direct 7-day bank transfer.", "Grade-A Onion matches premium processor specifications perfectly.", "3-day forecast indicates price surge to ₹4,720/q before stabilization."]',
'{"mkt-002": "Pune offers a slightly higher listed price (₹4,750/q), but long distance (210 km) increases transport to ₹14,200 and storage to ₹4,000, yielding lower Net Realization (₹2,11,800).", "mkt-007": "Nagpur listed price is highest (₹4,900/q), but extreme transport cost (₹31,000) and spoilage risk (₹7,000) drastically lower Net Realization to ₹2,03,000."}'
);

-- 10. Sample Completed Transactions for History
INSERT INTO transactions (id, user_id, crop_id, market_id, buyer_id, quantity_quintals, selling_price_per_q, gross_revenue, transport_cost, storage_cost, commission_cost, other_costs, final_net_realization, sale_date) VALUES
('tx-001', 'user-farmer-01', 'crop-001', 'mkt-001', 'buyer-01', 30.00, 4450.00, 133500.00, 5200.00, 1200.00, 1335.00, 900.00, 124865.00, '2026-08-15'),
('tx-002', 'user-farmer-01', 'crop-002', 'mkt-003', NULL, 20.00, 2200.00, 44000.00, 2500.00, 800.00, 440.00, 500.00, 39760.00, '2026-08-28');

-- 11. Initial Notifications
INSERT INTO notifications (id, user_id, title, message, type, is_read) VALUES
('notif-001', 'user-farmer-01', '📈 Price Forecast Alert: Onion', 'Onion prices in Lasalgaon Mandi are projected to increase by ₹120/q over the next 3 days.', 'PRICE_ALERT', FALSE),
('notif-002', 'user-farmer-01', '🤝 New Buyer Match Found!', 'ABC Agro Processing Pvt Ltd posted demand for 100 quintals of Grade A Onion at ₹4,700/q.', 'BUYER_MATCH', FALSE);
