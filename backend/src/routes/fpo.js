const express = require('express');
const router = express.Router();
const { getDB } = require('../db');

router.get('/dashboard', async (req, res) => {
    try {
        const db = await getDB();

        // Sample aggregated metrics for Nashik FPO
        const memberCount = 248;
        const totalAggregatedQuintals = 4200; // 420 Tonnes
        const primaryCrop = 'Onion';

        // Price comparison: Individual Farmer selling (₹4,600/q) vs Bulk FPO Bargaining (₹4,850/q + shared freight)
        const individualNetPerQ = 4214;
        const fpoNetPerQ = 4620; // ₹406/q higher net realization!

        const totalIndividualRevenue = Math.round(totalAggregatedQuintals * individualNetPerQ);
        const totalFpoRevenue = Math.round(totalAggregatedQuintals * fpoNetPerQ);
        const netGainForFPO = totalFpoRevenue - totalIndividualRevenue;

        const produceBreakdown = [
            { farmer_name: 'Ramesh Patil', crop: 'Onion', quantity_q: 50, location: 'Nashik', grade: 'Grade A' },
            { farmer_name: 'Suresh Deshmukh', crop: 'Onion', quantity_q: 120, location: 'Pimpalgaon', grade: 'Grade A' },
            { farmer_name: 'Ganesh Pawar', crop: 'Onion', quantity_q: 80, location: 'Lasalgaon', grade: 'Grade B' },
            { farmer_name: 'Anil Shinde', crop: 'Soybean', quantity_q: 150, location: 'Ahmednagar', grade: 'Grade A' },
            { farmer_name: 'Vijay Kulkarni', crop: 'Tomato', quantity_q: 40, location: 'Pune', grade: 'Grade A' }
        ];

        const aggregatedMarkets = [
            { market_name: 'Lasalgaon APMC (Bulk Lot)', price_per_q: 4850, net_realization: totalFpoRevenue, gain_percent: '9.6%' },
            { market_name: 'Sahyadri Agri Processor Direct Contract', price_per_q: 4900, net_realization: totalFpoRevenue + 210000, gain_percent: '10.8%' }
        ];

        return res.json({
            org_name: 'Nashik Farmers Producer Co-operative Ltd',
            member_count: memberCount,
            total_aggregated_quintals: totalAggregatedQuintals,
            total_aggregated_tonnes: totalAggregatedQuintals / 10,
            primary_crop: primaryCrop,
            financial_metrics: {
                individual_avg_net_per_q: individualNetPerQ,
                fpo_bulk_net_per_q: fpoNetPerQ,
                total_individual_net: totalIndividualRevenue,
                total_fpo_net: totalFpoRevenue,
                net_collective_gain: netGainForFPO,
                gain_per_member_avg: Math.round(netGainForFPO / memberCount)
            },
            produce_breakdown: produceBreakdown,
            aggregated_markets: aggregatedMarkets
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;
