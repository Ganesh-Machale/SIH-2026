import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import {
  TrendingUp,
  Filter,
  MapPin,
  Sparkles,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Truck,
  Building2,
  Info
} from 'lucide-react';

export const MarketIntelligence = () => {
  const { activeProduce } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [sortBy, setSortBy] = useState('score'); // 'score', 'net', 'price', 'cost', 'distance'

  useEffect(() => {
    fetchMarketData();
  }, [activeProduce]);

  const fetchMarketData = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/recommendations/calculate', {
        crop_name: activeProduce.crop_name || 'Onion',
        quantity_quintals: activeProduce.quantity_quintals || 50,
        grade: activeProduce.grade || 'Grade A',
        farmer_location: activeProduce.location || 'Nashik, Maharashtra'
      });
      setData(res.data);
    } catch (err) {
      console.error('Error fetching market intelligence:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSortedMarkets = () => {
    if (!data?.all_opportunities) return [];
    const list = [...data.all_opportunities];

    if (sortBy === 'score') {
      return list.sort((a, b) => b.opportunity_score - a.opportunity_score);
    } else if (sortBy === 'net') {
      return list.sort((a, b) => b.expected_net_realization - a.expected_net_realization);
    } else if (sortBy === 'price') {
      return list.sort((a, b) => b.listed_modal_price_per_q - a.listed_modal_price_per_q);
    } else if (sortBy === 'cost') {
      return list.sort((a, b) => a.total_cost - b.total_cost);
    } else if (sortBy === 'distance') {
      return list.sort((a, b) => a.distance_km - b.distance_km);
    }
    return list;
  };

  const markets = getSortedMarkets();

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-1">
            <TrendingUp size={14} />
            <span>Market Intelligence Portal</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Mandi Price & Net Realization Comparison</h1>
          <p className="text-xs text-slate-500">
            Comparing markets for {activeProduce.quantity_quintals * 100} kg {activeProduce.crop_name} ({activeProduce.grade}) from {activeProduce.location}
          </p>
        </div>

        {/* Sort Filter Dropdown */}
        <div className="flex items-center space-x-2 bg-slate-100 p-2 rounded-2xl border border-slate-200">
          <ArrowUpDown size={14} className="text-slate-600 ml-1" />
          <span className="text-xs font-bold text-slate-700">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none"
          >
            <option value="score">⭐ Best Opportunity Score</option>
            <option value="net">💰 Highest Net Realization</option>
            <option value="price">📈 Highest Listed Price</option>
            <option value="cost">🚚 Lowest Total Logistics Cost</option>
            <option value="distance">📍 Nearest Distance</option>
          </select>
        </div>
      </div>

      {/* Main Comparison Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-500 font-medium">Calculating freight costs, mandi commissions, and opportunity scores...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white font-bold">
                  <th className="p-4 rounded-tl-2xl">Mandi / Market</th>
                  <th className="p-4">Distance</th>
                  <th className="p-4">Listed Price</th>
                  <th className="p-4">3-Day Forecast</th>
                  <th className="p-4">Demand</th>
                  <th className="p-4 text-amber-300">Transport Cost</th>
                  <th className="p-4 text-amber-300">Storage & Spoilage</th>
                  <th className="p-4 text-emerald-400 font-extrabold text-sm">EXPECTED NET REALIZATION</th>
                  <th className="p-4 text-center">Score</th>
                  <th className="p-4 rounded-tr-2xl text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {markets.map((m, idx) => {
                  const isBest = idx === 0 && sortBy === 'score';
                  return (
                    <tr
                      key={m.market_id}
                      className={`transition ${
                        isBest ? 'bg-emerald-50/70 font-medium' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          {isBest && <Sparkles size={16} className="text-amber-500 flex-shrink-0" />}
                          <div>
                            <p className="font-extrabold text-slate-900 text-sm">{m.market_name}</p>
                            <p className="text-[10px] text-slate-500">{m.district}, MH</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-semibold text-slate-700">
                        {m.distance_km} km
                      </td>

                      <td className="p-4">
                        <span className="font-extrabold text-slate-900">₹{m.listed_modal_price_per_q}/q</span>
                        <span className="text-[10px] text-slate-500 block">₹{(m.listed_modal_price_per_q / 100).toFixed(1)}/kg</span>
                      </td>

                      <td className="p-4 text-emerald-700 font-semibold">
                        ₹{m.forecasted_price_per_q}/q
                        <span className="text-[10px] text-slate-500 block">{m.trend}</span>
                      </td>

                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          m.demand_level === 'HIGH' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {m.demand_level}
                        </span>
                      </td>

                      <td className="p-4 text-slate-700 font-medium">
                        ₹{m.transport_cost?.toLocaleString('en-IN')}
                      </td>

                      <td className="p-4 text-slate-700 font-medium">
                        ₹{(m.storage_cost + m.spoilage_cost)?.toLocaleString('en-IN')}
                      </td>

                      {/* Net Realization Column */}
                      <td className="p-4 bg-emerald-50/40">
                        <p className="text-base font-extrabold text-emerald-900">
                          ₹{m.expected_net_realization?.toLocaleString('en-IN')}
                        </p>
                        <p className="text-[11px] text-emerald-700 font-bold">
                          ₹{m.net_per_kg} / kg NET
                        </p>
                      </td>

                      <td className="p-4 text-center">
                        <span className="inline-block bg-slate-900 text-white font-extrabold px-2.5 py-1 rounded-xl text-xs">
                          {m.opportunity_score}/100
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        {isBest ? (
                          <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            BEST CHOICE
                          </span>
                        ) : m.opportunity_score > 80 ? (
                          <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            GOOD
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-500 text-[10px] font-medium px-2 py-0.5 rounded-full">
                            MODERATE
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Critical Insight Alert Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex items-start space-x-3 text-xs text-amber-900">
        <Info size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-extrabold">💡 Critical SIH Insight: Higher Listed Price ≠ Higher Profit</p>
          <p className="leading-relaxed text-amber-800">
            Notice how <strong>Nagpur Mandi</strong> lists the highest market price (₹4,900/quintal), but because it is 700 km away, transport costs (₹31,000) and spoilage reduce your Net Realization to only <strong>₹2,03,000</strong>. Meanwhile, <strong>Lasalgaon Mandi</strong> (145 km away at ₹4,600/q listed price) yields <strong>₹2,18,500 NET PROFIT</strong> (₹15,500 MORE!).
          </p>
        </div>
      </div>
    </div>
  );
};
