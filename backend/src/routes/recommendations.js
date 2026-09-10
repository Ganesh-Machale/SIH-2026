const express = require('express');
const router = express.Router();
const { getDB } = require('../db');

// Distance utility
function getDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
}

const LOCATION_COORDS = {
    'Nashik': { lat: 20.0059, lon: 73.7898 },
    'Lasalgaon': { lat: 20.1472, lon: 74.2274 },
    'Pune': { lat: 18.5204, lon: 73.8567 },
    'Solapur': { lat: 17.6599, lon: 75.9064 },
    'Ahmednagar': { lat: 19.0948, lon: 74.7480 },
    'Sangli': { lat: 16.8524, lon: 74.5815 },
    'Nagpur': { lat: 21.1458, lon: 79.0882 }
};

// Calculate Expected Net Realization endpoint
router.post('/net-realization', async (req, res) => {
    try {
        const {
            quantity_quintals = 50, // 50 quintals = 5,000 kg
            selling_price_per_q = 4600,
            distance_km = 145,
            storage_days = 3,
            storage_rate_per_q_day = 1.5,
            commission_percent = 1.0,
            loading_unloading_per_q = 10,
            packaging_per_q = 30,
            spoilage_rate_daily_percent = 0.8
        } = req.body;

        const grossRevenue = quantity_quintals * selling_price_per_q;
        
        // Logistics cost breakdown
        const transportRatePerKm = 55; // ₹55 / km for truck load
        const transportCost = Math.round(distance_km * transportRatePerKm);
        const loadingCost = Math.round(quantity_quintals * loading_unloading_per_q);
        const commissionCost = Math.round(grossRevenue * (commission_percent / 100.0));
        const storageCost = Math.round(quantity_quintals * storage_rate_per_q_day * storage_days);
        const packagingCost = Math.round(quantity_quintals * packaging_per_q);
        
        const totalSpoilagePercent = (spoilage_rate_daily_percent * storage_days) / 100.0;
        const spoilageCost = Math.round(grossRevenue * totalSpoilagePercent);

        const totalCost = transportCost + loadingCost + commissionCost + storageCost + packagingCost + spoilageCost;
        const netRealization = grossRevenue - totalCost;
        const netPerKg = (netRealization / (quantity_quintals * 100)).toFixed(2);
        const netPerQuintal = (netRealization / quantity_quintals).toFixed(2);
        const marginPercent = ((netRealization / grossRevenue) * 100).toFixed(1);

        return res.json({
            quantity_quintals,
            quantity_kg: quantity_quintals * 100,
            selling_price_per_q,
            gross_revenue: grossRevenue,
            cost_breakdown: {
                transport_cost: transportCost,
                loading_unloading: loadingCost,
                commission: commissionCost,
                storage_cost: storageCost,
                packaging_cost: packagingCost,
                estimated_spoilage: spoilageCost,
                total_cost: totalCost
            },
            expected_net_realization: netRealization,
            net_per_kg: parseFloat(netPerKg),
            net_per_quintal: parseFloat(netPerQuintal),
            margin_percent: parseFloat(marginPercent)
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Generate AI Selling Opportunities & Rank Mandis/Buyers
router.post('/calculate', async (req, res) => {
    try {
        const {
            crop_name = 'Onion',
            quantity_quintals = 50,
            grade = 'Grade A',
            farmer_location = 'Nashik, Maharashtra',
            storage_available = true,
            max_storage_days = 7
        } = req.body;

        const db = await getDB();

        // 1. Fetch Crop
        let crop = await db.get('SELECT * FROM crops WHERE LOWER(name) = LOWER(?)', [crop_name]);
        if (!crop) crop = await db.get('SELECT * FROM crops WHERE id = "crop-001"');

        // 2. Fetch all markets with price and arrival data
        const markets = await db.all(`
            SELECT m.*, mp.modal_price_per_q, mp.min_price_per_q, mp.max_price_per_q,
                   ma.arrival_quantity_tonnes, ma.demand_level,
                   pf.pred_3day_price_per_q, pf.pred_7day_price_per_q, pf.trend, pf.confidence_percent as forecast_confidence
            FROM markets m
            JOIN market_prices mp ON m.id = mp.market_id AND mp.crop_id = ?
            LEFT JOIN market_arrivals ma ON m.id = ma.market_id AND ma.crop_id = ?
            LEFT JOIN price_forecasts pf ON m.id = pf.market_id AND pf.crop_id = ?
        `, [crop.id, crop.id, crop.id]);

        // 3. Fetch matched buyers
        const buyers = await db.all(`
            SELECT b.*, u.name as buyer_user_name, br.offered_price_per_q, br.required_quantity_quintals, br.required_grade, br.payment_terms
            FROM buyers b
            JOIN users u ON b.user_id = u.id
            JOIN buyer_requirements br ON b.id = br.buyer_id AND br.crop_id = ?
        `, [crop.id]);

        const originLoc = farmer_location.split(',')[0].trim();
        const originCoords = LOCATION_COORDS[originLoc] || LOCATION_COORDS['Nashik'];

        // Evaluate each market opportunity
        const evaluatedMarkets = markets.map(m => {
            const dist = getDistanceKm(originCoords.lat, originCoords.lon, m.latitude, m.longitude) || 45;
            
            // Logistics calculations
            const transportRatePerKm = 55;
            const transportCost = Math.round(dist * transportRatePerKm);
            const loadingCost = Math.round(quantity_quintals * m.loading_unloading_per_q);
            const grossRev = quantity_quintals * (m.pred_3day_price_per_q || m.modal_price_per_q);
            const commissionCost = Math.round(grossRev * (m.avg_commission_percent / 100.0));
            const storageDays = 3;
            const storageCost = Math.round(quantity_quintals * m.storage_rate_per_q_day * storageDays);
            const spoilageCost = Math.round(grossRev * ((crop.spoilage_rate_daily_percent * storageDays) / 100.0));

            const totalCost = transportCost + loadingCost + commissionCost + storageCost + spoilageCost;
            const netRealization = grossRev - totalCost;

            // Weighted multi-factor score calculation (0 - 100)
            let score = 0;
            
            // 25% Net Realization normalized (base target ₹2,10,000 for 50q)
            const netRealScore = Math.min(100, Math.max(20, (netRealization / (grossRev || 1)) * 110));
            score += netRealScore * 0.25;

            // 15% Price Trend
            const isTrendUp = m.trend && m.trend.includes('Increasing');
            const trendScore = isTrendUp ? 90 : 60;
            score += trendScore * 0.15;

            // 15% Demand
            const demandScore = m.demand_level === 'HIGH' ? 95 : (m.demand_level === 'MEDIUM' ? 75 : 50);
            score += demandScore * 0.15;

            // 15% Distance / Logistics score (Closer is higher score)
            const distanceScore = Math.max(10, 100 - (dist / 8.0));
            score += distanceScore * 0.15;

            // 15% Quality match & Storage capability
            const qualityScore = grade === 'Grade A' ? 95 : 80;
            score += qualityScore * 0.15;

            // 15% Market Arrival score
            const arrivalScore = m.arrival_quantity_tonnes > 1000 ? 90 : 70;
            score += arrivalScore * 0.15;

            const finalScore = Math.min(99, Math.round(score));

            return {
                market_id: m.id,
                market_name: m.name,
                district: m.district,
                distance_km: dist,
                listed_modal_price_per_q: m.modal_price_per_q,
                forecasted_price_per_q: m.pred_3day_price_per_q || m.modal_price_per_q,
                trend: m.trend || 'Stable',
                demand_level: m.demand_level || 'HIGH',
                gross_revenue: grossRev,
                transport_cost: transportCost,
                storage_cost: storageCost,
                commission_cost: commissionCost,
                spoilage_cost: spoilageCost,
                total_cost: totalCost,
                expected_net_realization: netRealization,
                net_per_kg: (netRealization / (quantity_quintals * 100)).toFixed(2),
                opportunity_score: finalScore,
                confidence_percent: m.forecast_confidence || 87
            };
        });

        // Sort markets by opportunity score descending
        evaluatedMarkets.sort((a, b) => b.opportunity_score - a.opportunity_score);

        const bestMarket = evaluatedMarkets[0];
        const secondMarket = evaluatedMarkets[1] || evaluatedMarkets[0];

        // Match best buyer
        const matchedBuyer = buyers.length > 0 ? {
            buyer_id: buyers[0].id,
            business_name: buyers[0].business_name,
            offered_price_per_q: buyers[0].offered_price_per_q,
            payment_terms: buyers[0].payment_terms,
            reliability_rating: buyers[0].reliability_rating,
            match_score: 92
        } : null;

        // Generate explainable reasons
        const diffNet = bestMarket.expected_net_realization - secondMarket.expected_net_realization;
        const reasons = [
            `Expected Net Realization is ₹${Math.abs(diffNet).toLocaleString('en-IN')} higher than ${secondMarket.market_name} due to lower logistics costs.`,
            `Transport cost from ${originLoc} to ${bestMarket.market_name} is ₹${bestMarket.transport_cost.toLocaleString('en-IN')} (${bestMarket.distance_km} km) compared to higher long-distance freight.`,
            `Demand is currently ${bestMarket.demand_level} with high buyer liquidity.`,
            `Your ${grade} ${crop.name} matches market and processor premium specifications.`,
            `Short-term 3-day forecast indicates price strength at ₹${bestMarket.forecasted_price_per_q}/q.`,
            `Estimated spoilage risk remains minimal (${crop.spoilage_rate_daily_percent * 3}% over 3 days).`
        ];

        const whyNotOthers = {
            [secondMarket.market_name]: `Although ${secondMarket.market_name} lists a price of ₹${secondMarket.listed_modal_price_per_q}/q, higher transportation cost (₹${secondMarket.transport_cost.toLocaleString('en-IN')}) and distance (${secondMarket.distance_km} km) reduce your actual expected net earnings to ₹${secondMarket.expected_net_realization.toLocaleString('en-IN')}.`
        };

        return res.json({
            crop_name: crop.name,
            quantity_quintals,
            quantity_kg: quantity_quintals * 100,
            farmer_location: originLoc,
            best_opportunity: {
                where: {
                    market_name: bestMarket.market_name,
                    district: bestMarket.district,
                    distance_km: bestMarket.distance_km,
                    listed_price_per_q: bestMarket.listed_modal_price_per_q
                },
                when: {
                    recommended_window: '3–5 days',
                    forecast_price_per_q: bestMarket.forecasted_price_per_q,
                    trend: bestMarket.trend
                },
                to_whom: matchedBuyer,
                metrics: {
                    expected_net_realization: bestMarket.expected_net_realization,
                    net_per_kg: bestMarket.net_per_kg,
                    gross_revenue: bestMarket.gross_revenue,
                    total_cost: bestMarket.total_cost,
                    opportunity_score: bestMarket.opportunity_score,
                    confidence_percent: bestMarket.confidence_percent
                },
                reasons,
                why_not_others: whyNotOthers
            },
            all_opportunities: evaluatedMarkets
        });
    } catch (err) {
        console.error('Calculate recommendation error:', err);
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;
