const express = require('express');
const router = express.Router();
const { getDB } = require('../db');

// List buyers and buyer requirements with match score
router.get('/', async (req, res) => {
    try {
        const { crop_name = 'Onion', quantity_quintals = 50, grade = 'Grade A' } = req.query;
        const db = await getDB();

        let crop = await db.get('SELECT id, name FROM crops WHERE LOWER(name) = LOWER(?)', [crop_name]);
        const cropId = crop ? crop.id : 'crop-001';

        const requirements = await db.all(`
            SELECT br.*, b.business_name, b.buyer_type, b.payment_terms as buyer_payment_terms, b.reliability_rating,
                   u.location as buyer_location, u.mobile, u.email
            FROM buyer_requirements br
            JOIN buyers b ON br.buyer_id = b.id
            JOIN users u ON b.user_id = u.id
            WHERE br.crop_id = ? AND br.status = 'ACTIVE'
        `, [cropId]);

        // Calculate match score for each buyer requirement
        const matchedBuyers = requirements.map(b => {
            let matchScore = 70; // Base score

            // Crop match: 30 pts
            matchScore += 20;

            // Grade match: 20 pts
            if (b.required_grade === grade) matchScore += 10;

            // Quantity compatibility: 15 pts
            const qtyRatio = parseFloat(quantity_quintals) / parseFloat(b.required_quantity_quintals);
            if (qtyRatio >= 0.4 && qtyRatio <= 1.5) matchScore += 10;

            // Price competitiveness: 15 pts
            if (b.offered_price_per_q >= 4600) matchScore += 10;

            const scoreFinal = Math.min(98, matchScore);

            const matchReasons = [
                `Crop requirement matched: ${crop_name}`,
                `Grade requirement matched: ${b.required_grade}`,
                `Payment terms: ${b.payment_terms}`,
                `Buyer rating: ⭐ ${b.reliability_rating} / 5.0`
            ];

            return {
                ...b,
                match_score: scoreFinal,
                match_reasons: matchReasons
            };
        });

        matchedBuyers.sort((a, b) => b.match_score - a.match_score);

        return res.json(matchedBuyers);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Post buyer requirement
router.post('/requirements', async (req, res) => {
    try {
        const { buyer_id, crop_name, required_quantity, required_grade, offered_price, target_location, payment_terms } = req.body;
        const db = await getDB();

        let crop = await db.get('SELECT id FROM crops WHERE LOWER(name) = LOWER(?)', [crop_name || 'Onion']);
        const cropId = crop ? crop.id : 'crop-001';
        const reqId = 'br-' + Date.now();

        await db.run(`
            INSERT INTO buyer_requirements (id, buyer_id, crop_id, required_quantity_quintals, required_grade, offered_price_per_q, target_location, payment_terms, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
        `, [
            reqId,
            buyer_id || 'buyer-01',
            cropId,
            parseFloat(required_quantity) || 100,
            required_grade || 'Grade A',
            parseFloat(offered_price) || 4700,
            target_location || 'Lasalgaon, Nashik',
            payment_terms || '7-day payment'
        ]);

        return res.status(201).json({ message: 'Buyer requirement posted successfully', requirement_id: reqId });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Send purchase request from farmer to buyer
router.post('/request-purchase', async (req, res) => {
    try {
        const { produce_id, buyer_id, offered_quantity, notes } = req.body;
        const db = await getDB();

        // Create a notification for the buyer
        const buyer = await db.get('SELECT user_id, business_name FROM buyers WHERE id = ?', [buyer_id || 'buyer-01']);
        if (buyer) {
            await db.run(`
                INSERT INTO notifications (id, user_id, title, message, type)
                VALUES (?, ?, ?, ?, 'BUYER_MATCH')
            `, [
                'notif-' + Date.now(),
                buyer.user_id,
                '📩 New Purchase Offer Received!',
                `A farmer has sent a purchase offer for ${offered_quantity || 50} quintals. Note: ${notes || 'Ready to dispatch.'}`
            ]);
        }

        return res.json({ message: 'Purchase offer sent to buyer successfully!', status: 'SENT' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;
