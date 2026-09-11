import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Sparkles,
  TrendingUp,
  MapPin,
  PlusCircle,
  ArrowRight,
  CheckCircle2,
  LineChart,
  ShoppingBag,
  History,
  Calculator
} from 'lucide-react';

export const FarmerDashboard = () => {
  const { user, activeProduce } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState(null);

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
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const bestOpp = recommendation?.best_opportunity;

  return (
    <div className="space-y-6 pb-12 text-slate-200">
      {/* Top Header greeting */}
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_50%)] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Good Morning, {user?.name || 'Farmer'} 👋
            </h1>
            <p className="text-sm text-slate-400 flex items-center space-x-1.5">
              <MapPin size={16} className="text-emerald-500" />
              <span>{activeProduce.location || 'Nashik, Maharashtra'}</span>
            </p>
          </div>

          <Link
            to="/add-produce"
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-6 py-3.5 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/25 transition transform hover:-translate-y-0.5"
          >
            <PlusCircle size={20} />
            <span>Add New Produce</span>
          </Link>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/net-realization" className="bg-slate-800 border border-slate-700 hover:border-emerald-500/50 rounded-2xl p-6 transition flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-slate-700 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Calculator size={28} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Net Realization Calculator</h3>
            <p className="text-xs text-slate-400">Calculate exactly how much you'll earn after all costs.</p>
          </div>
        </Link>
        <Link to="/selling-history" className="bg-slate-800 border border-slate-700 hover:border-emerald-500/50 rounded-2xl p-6 transition flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-slate-700 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <History size={28} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">View Selling History</h3>
            <p className="text-xs text-slate-400">Track your past sales and analyze your profit trends.</p>
          </div>
        </Link>
      </div>

      {/* ⭐ BEST SELLING OPPORTUNITY SPOTLIGHT CARD */}
      <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl border border-emerald-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-xs font-extrabold px-6 py-1.5 rounded-bl-3xl uppercase tracking-wider flex items-center space-x-1.5 shadow-md">
          <Sparkles size={14} />
          <span>Best AI Recommendation</span>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-slate-400 font-medium">Analyzing markets and forecasting prices for you...</p>
          </div>
        ) : (
          <div className="space-y-8 mt-2">
            <div>
              <span className="text-sm font-bold text-emerald-400 uppercase tracking-widest">Recommended Market</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                {bestOpp?.where?.market_name || 'Lasalgaon Mandi'}
              </h2>
              <p className="text-sm text-slate-400 mt-2 flex items-center space-x-2">
                <Truck size={16} className="text-slate-500" />
                <span>{bestOpp?.where?.distance_km || 145} km from your farm</span>
              </p>
            </div>

            {/* Net Realization Highlight Box */}
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700 pb-4">
                <div>
                  <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest mb-1">Expected Earnings in Hand</p>
                  <p className="text-4xl sm:text-5xl font-extrabold text-white">
                    ₹{bestOpp?.metrics?.expected_net_realization?.toLocaleString('en-IN') || '2,18,500'}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="bg-emerald-500/10 text-emerald-400 text-sm font-bold px-4 py-2 rounded-xl border border-emerald-500/20 inline-block">
                    ₹{bestOpp?.metrics?.net_per_kg || '43.70'} / kg NET
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/where-when-whom"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl text-sm flex items-center space-x-2 transition"
                >
                  <span>View Full Details</span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  to="/what-if-simulator"
                  className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition"
                >
                  <span>Check Future Price (Wait 3 Days)</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
