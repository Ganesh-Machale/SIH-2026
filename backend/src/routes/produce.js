const express = require('express');
const router = express.Router();
const { getDB } = require('../db');

// List produce for user or demo
router.get('/', async (req, res) => {
    try {
        const db = await getDB();
        const userId = req.query.user_id || 'user-farmer-01';
        const produces = await db.all(
            `SELECT fp.*, c.name as crop_name, c.category, c.icon_name
             FROM farmer_produce fp
             JOIN crops c ON fp.crop_id = c.id
             WHERE fp.user_id = ?
             ORDER BY fp.created_at DESC`,
            [userId]
        );
        return res.json(produces);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Get produce details
router.get('/:id', async (req, res) => {
    try {
        const db = await getDB();
        const produce = await db.get(
            `SELECT fp.*, c.name as crop_name, c.category, c.shelf_life_days, c.spoilage_rate_daily_percent
             FROM farmer_produce fp
             JOIN crops c ON fp.crop_id = c.id
             WHERE fp.id = ?`,
            [req.params.id]
        );
        if (!produce) return res.status(404).json({ error: 'Produce not found' });
        return res.json(produce);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Add produce
router.post('/', async (req, res) => {
    try {
        const {
            user_id,
            crop_name,
            quantity, // in kg or quintals
            quantity_unit, // 'kg' or 'quintal'
            grade,
            harvest_date,
            available_from_date,
            farmer_location,
            storage_available,
            max_storage_days,
            urgency,
            min_acceptable_price
        } = req.body;

        const db = await getDB();

        // Convert quantity to quintals (1 Quintal = 100 kg)
        let quantityQuintals = parseFloat(quantity) || 50;
        if (quantity_unit === 'kg') {
            quantityQuintals = quantityQuintals / 100.0;
        } else if (quantity_unit === 'tonnes') {
            quantityQuintals = quantityQuintals * 10.0;
        }

        // Find or map crop_id
        let crop = await db.get('SELECT id FROM crops WHERE LOWER(name) = LOWER(?)', [crop_name || 'Onion']);
        let cropId = crop ? crop.id : 'crop-001';

        const produceId = 'prod-' + Date.now();
        const userId = user_id || 'user-farmer-01';

        await db.run(
            `INSERT INTO farmer_produce 
             (id, user_id, crop_id, quantity_quintals, grade, harvest_date, available_from_date, farmer_location, storage_available, max_storage_days, urgency, min_acceptable_price_per_q, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                produceId,
                userId,
                cropId,
                quantityQuintals,
                grade || 'Grade A',
                harvest_date || new Date().toISOString().split('T')[0],
                available_from_date || new Date().toISOString().split('T')[0],
                farmer_location || 'Nashik, Maharashtra',
                storage_available ? 1 : 0,
                parseInt(max_storage_days) || 7,
                urgency || 'MEDIUM',
                parseFloat(min_acceptable_price) || 0,
                'AVAILABLE'
            ]
        );

        const newProduce = await db.get(
            `SELECT fp.*, c.name as crop_name FROM farmer_produce fp JOIN crops c ON fp.crop_id = c.id WHERE fp.id = ?`,
            [produceId]
        );

        return res.status(201).json({
            message: 'Produce listed successfully',
            produce: newProduce
        });
    } catch (err) {
        console.error('Add produce error:', err);
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;
