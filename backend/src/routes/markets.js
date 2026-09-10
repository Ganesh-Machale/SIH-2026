const express = require('express');
const router = express.Router();
const { getDB } = require('../db');

// Distance calculator helper between two lat/lon coordinates in km (Haversine formula)
function getDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
}

// Fixed coordinates for Maharashtra locations
const LOCATION_COORDS = {
    'Nashik': { lat: 20.0059, lon: 73.7898 },
    'Lasalgaon': { lat: 20.1472, lon: 74.2274 },
    'Pune': { lat: 18.5204, lon: 73.8567 },
    'Solapur': { lat: 17.6599, lon: 75.9064 },
    'Ahmednagar': { lat: 19.0948, lon: 74.7480 },
    'Sangli': { lat: 16.8524, lon: 74.5815 },
    'Nagpur': { lat: 21.1458, lon: 79.0882 }
};

// Get all markets
router.get('/', async (req, res) => {
    try {
        const db = await getDB();
        const markets = await db.all('SELECT * FROM markets');
        return res.json(markets);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Get market prices with filtering by crop and calculating distance from farmer location
router.get('/prices', async (req, res) => {
    try {
        const { crop_name, farmer_location } = req.query;
        const db = await getDB();

        let crop = await db.get('SELECT id, name, spoilage_rate_daily_percent FROM crops WHERE LOWER(name) = LOWER(?)', [crop_name || 'Onion']);
        const cropId = crop ? crop.id : 'crop-001';

        const prices = await db.all(
            `SELECT mp.*, m.name as market_name, m.district, m.state, m.latitude, m.longitude,
                    m.avg_commission_percent, m.storage_rate_per_q_day, m.loading_unloading_per_q,
                    ma.arrival_quantity_tonnes, ma.demand_level
             FROM market_prices mp
             JOIN markets m ON mp.market_id = m.id
             LEFT JOIN market_arrivals ma ON ma.market_id = m.id AND ma.crop_id = mp.crop_id
             WHERE mp.crop_id = ?
             ORDER BY mp.modal_price_per_q DESC`,
            [cropId]
        );

        // Determine farmer lat/lon
        const originLoc = farmer_location ? farmer_location.split(',')[0].trim() : 'Nashik';
        const originCoords = LOCATION_COORDS[originLoc] || LOCATION_COORDS['Nashik'];

        // Compute distance and logistics breakdown for each market
        const enriched = prices.map(item => {
            const distanceKm = getDistanceKm(originCoords.lat, originCoords.lon, item.latitude, item.longitude) || 45;
            
            // Transport rate calculation: ~ ₹55 per km for a 5-10 tonne truck base
            const transportRatePerKm = 55;
            const transportCost = Math.round(distanceKm * transportRatePerKm);
            
            return {
                ...item,
                distance_km: distanceKm,
                estimated_transport_cost: transportCost
            };
        });

        return res.json({
            crop: crop ? crop.name : 'Onion',
            farmer_location: originLoc,
            markets: enriched
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Get historical price series for charts
router.get('/history/:crop/:market', async (req, res) => {
    try {
        const { crop, market } = req.params;
        // Generate realistic 30-day historical price points for visualization
        const basePrice = crop.toLowerCase() === 'onion' ? 4400 : (crop.toLowerCase() === 'tomato' ? 2200 : 1800);
        const history = [];
        const today = new Date();

        for (let i = 30; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const noise = (Math.sin(i * 0.5) * 180) + (Math.cos(i * 0.3) * 120);
            const price = Math.round(basePrice + noise);
            const arrivals = Math.round(900 + Math.sin(i * 0.4) * 300);
            
            history.push({
                date: dateStr,
                modal_price: price,
                min_price: Math.round(price * 0.9),
                max_price: Math.round(price * 1.08),
                arrivals_tonnes: arrivals
            });
        }

        return res.json({
            crop,
            market,
            history
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;
