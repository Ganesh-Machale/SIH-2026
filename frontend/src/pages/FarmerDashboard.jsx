import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Sparkles,
  TrendingUp,
  Truck,
  Building2,
  Calendar,
  MapPin,
  PlusCircle,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  LineChart,
  ShieldCheck,
  ShoppingBag,
  Info
} from 'lucide-react';

export const FarmerDashboard = () => {
  const { user, activeProduce } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState(null);
  const [buyers, setBuyers] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, [activeProduce]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Call recommendations backend calculation API
      const recRes = await axios.post('/api/recommendations/calculate', {
        crop_name: activeProduce.crop_name || 'Onion',
        quantity_quintals: activeProduce.quantity_quintals || 50,
        grade: activeProduce.grade || 'Grade A',
        farmer_location: activeProduce.location || 'Nashik, Maharashtra'
      });
      setRecommendation(recRes.data);

      // Call buyers API
      const buyerRes = await axios.get(`/api/buyers?crop_name=${activeProduce.crop_name || 'Onion'}&quantity_quintals=${activeProduce.quantity_quintals || 50}`);
      setBuyers(buyerRes.data || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const bestOpp = recommendation?.best_opportunity;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-emerald-950 text-white p-6 rounded-3xl shadow-lg border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Active Produce: {activeProduce.quantity_quintals * 100} kg {activeProduce.crop_name} ({activeProduce.grade})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Good Morning, {user?.name || 'Ramesh Patil'} 👋
          </h1>
          <p className="text-xs text-slate-300 flex items-center space-x-1">
            <MapPin size={14} className="text-emerald-400" />
            <span>Farm Location: {activeProduce.location || 'Nashik, Maharashtra'}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/add-produce"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-md transition"
          >
            <PlusCircle size={16} />
            <span>+ Add Produce</span>
          </Link>
          <Link
            to="/what-if-simulator"
            className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs border border-slate-700 transition"
          >
            <span>Run What-If Simulator</span>
          </Link>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: SPOTLIGHT CARD */}
        <div className="lg:col-span-8 space-y-6">
          {/* ⭐ BEST SELLING OPPORTUNITY SPOTLIGHT CARD */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/90 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-emerald-500 text-slate-950 text-[11px] font-extrabold px-4 py-1 rounded-bl-2xl uppercase tracking-wider flex items-center space-x-1">
              <Sparkles size={13} />
              <span>⭐ BEST SELLING OPPORTUNITY</span>
            </div>

            {loading ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-slate-500 font-medium">Analyzing market prices, logistics, and forecasting prices...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Recommended Mandi</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
                    {bestOpp?.where?.market_name || 'Lasalgaon Mandi'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    District: {bestOpp?.where?.district || 'Nashik'} | Distance: {bestOpp?.where?.distance_km || 145} km from your farm
                  </p>
                </div>

                {/* Net Realization Highlight Box */}
                <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-2xl p-5 shadow-inner space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                    <div>
                      <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">EXPECTED NET REALIZATION</p>
                      <p className="text-3xl sm:text-4xl font-extrabold text-white">
                        ₹{bestOpp?.metrics?.expected_net_realization?.toLocaleString('en-IN') || '2,18,500'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="bg-emerald-500/20 text-emerald-300 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-500/30">
                        ₹{bestOpp?.metrics?.net_per_kg || '43.70'} / kg NET
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1">Listed Price: ₹{bestOpp?.where?.listed_price_per_q || '4,600'}/q (₹46/kg)</p>
                    </div>
                  </div>

                  {/* Financial Breakdown Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                    <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                      <p className="text-slate-400 text-[10px]">Gross Revenue</p>
                      <p className="font-bold text-white">₹{bestOpp?.metrics?.gross_revenue?.toLocaleString('en-IN') || '2,30,000'}</p>
                    </div>
                    <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                      <p className="text-slate-400 text-[10px]">Transport Cost</p>
                      <p className="font-bold text-amber-300">- ₹8,500</p>
                    </div>
                    <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                      <p className="text-slate-400 text-[10px]">Storage & Comm.</p>
                      <p className="font-bold text-amber-300">- ₹5,500</p>
                    </div>
                    <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                      <p className="text-slate-400 text-[10px]">Spoilage Loss</p>
                      <p className="font-bold text-amber-300">- ₹4,000</p>
                    </div>
                  </div>
                </div>

                {/* Explainable AI Reasons */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>WHY THIS OPPORTUNITY IS RECOMMENDED:</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 pl-6 list-disc">
                    {bestOpp?.reasons?.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    )) || (
                      <>
                        <li>Expected Net Realization is <strong>₹12,400 higher</strong> than second-best option Pune due to lower transport freight.</li>
                        <li>Transport cost is <strong>24% lower</strong> (145 km distance).</li>
                        <li>Buyer demand is currently <strong>HIGH</strong> with 87% forecast confidence.</li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    to="/where-when-whom"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition"
                  >
                    <span>View Where / When / Whom Details</span>
                    <ArrowRight size={14} />
                  </Link>

                  <Link
                    to="/what-if-simulator"
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-5 py-2.5 rounded-xl text-xs border border-slate-300 transition"
                  >
                    <span>Simulate Hold vs Sell Now</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Quick Metrics & Market Comparison Teaser */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Short-Term Price Trend</p>
                <p className="text-sm font-bold text-slate-900">↗ Moderately Increasing</p>
                <p className="text-[10px] text-emerald-600 font-semibold">+₹120/q in 3 days</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Truck size={20} />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Nearest Mandi Freight</p>
                <p className="text-sm font-bold text-slate-900">₹8,500 (145 km)</p>
                <p className="text-[10px] text-slate-500">₹55/km 5-tonne truck</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">AI Confidence Score</p>
                <p className="text-sm font-bold text-slate-900">87% Confidence</p>
                <p className="text-[10px] text-slate-500">Based on arrival signals</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Matched Buyers & Market Intelligence Teaser */}
        <div className="lg:col-span-4 space-y-6">
          {/* Matched Buyers Widget */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <ShoppingBag size={18} className="text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">Top Matched Buyers</h3>
              </div>
              <Link to="/buyer-matching" className="text-xs font-semibold text-emerald-600 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {buyers.slice(0, 2).map((buyer, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{buyer.business_name}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {buyer.match_score || 92}% Match
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 space-y-1">
                    <p>Offered Price: <strong className="text-slate-900">₹{buyer.offered_price_per_q}/q</strong></p>
                    <p>Required: {buyer.required_quantity_quintals}q ({buyer.required_grade})</p>
                    <p>Terms: {buyer.payment_terms}</p>
                  </div>

                  <Link
                    to="/buyer-matching"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-1.5 rounded-xl text-[11px] block text-center transition"
                  >
                    Send Purchase Request
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Forecast Teaser */}
          <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">3-Day Forecast Teaser</span>
              <LineChart size={16} className="text-emerald-400" />
            </div>

            <div className="space-y-1">
              <p className="text-2xl font-extrabold">₹4,720 / q</p>
              <p className="text-xs text-slate-300">Expected in 3 days (+₹120/q gain)</p>
            </div>

            <p className="text-[11px] text-slate-400">
              Holding produce for 3 days yields +₹3,800 net gain after subtracting storage and minimal spoilage.
            </p>

            <Link
              to="/what-if-simulator"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 rounded-xl text-xs block text-center transition"
            >
              Open What-If Simulator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
