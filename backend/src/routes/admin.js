const express = require('express');
const router = express.Router();
const { getDB } = require('../db');

// Get overview stats for admin
router.get('/stats', async (req, res) => {
    try {
        const db = await getDB();
        const userCount = await db.get('SELECT COUNT(*) as count FROM users');
        const farmerCount = await db.get('SELECT COUNT(*) as count FROM farmers');
        const fpoCount = await db.get('SELECT COUNT(*) as count FROM fpos');
        const buyerCount = await db.get('SELECT COUNT(*) as count FROM buyers');
        const produceCount = await db.get('SELECT COUNT(*) as count FROM farmer_produce');
        const marketCount = await db.get('SELECT COUNT(*) as count FROM markets');

        return res.json({
            users: userCount.count,
            farmers: farmerCount.count,
            fpos: fpoCount.count,
            buyers: buyerCount.count,
            produce_listings: produceCount.count,
            markets: marketCount.count
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Update market price data
router.post('/market-data', async (req, res) => {
    try {
        const { market_id, crop_id, modal_price_per_q, min_price_per_q, max_price_per_q } = req.body;
        const db = await getDB();

        await db.run(`
            UPDATE market_prices 
            SET modal_price_per_q = ?, min_price_per_q = ?, max_price_per_q = ?, recorded_date = ?
            WHERE market_id = ? AND crop_id = ?
        `, [
            parseFloat(modal_price_per_q) || 4600,
            parseFloat(min_price_per_q) || 4200,
            parseFloat(max_price_per_q) || 4900,
            new Date().toISOString().split('T')[0],
            market_id || 'mkt-001',
            crop_id || 'crop-001'
        ]);

        return res.json({ message: 'Market price updated successfully' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;
