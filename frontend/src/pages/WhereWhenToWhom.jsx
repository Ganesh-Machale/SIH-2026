import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import {
  Compass,
  MapPin,
  Calendar,
  UserCheck,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const WhereWhenToWhom = () => {
  const { activeProduce } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeProduce]);

  const fetchData = async () => {
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const best = data?.best_opportunity;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 text-white p-6 rounded-3xl shadow-lg border border-slate-800">
        <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30 mb-2">
          <Compass size={14} />
          <span>Personalized Decision Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold">Where. When. To Whom.</h1>
        <p className="text-xs text-slate-300">
          AI decision recommendation for {activeProduce.quantity_quintals * 100} kg {activeProduce.crop_name} ({activeProduce.grade}) from {activeProduce.location}
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 font-medium">Computing optimal market location, selling window, and buyer matches...</p>
        </div>
      ) : (
        <>
          {/* Three Major Pillar Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. WHERE CARD */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4 relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <MapPin size={24} />
              </div>

              <div>
                <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest">1. WHERE TO SELL?</span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">{best?.where?.market_name || 'Lasalgaon Mandi'}</h2>
                <p className="text-xs text-slate-500">District: {best?.where?.district} | Distance: {best?.where?.distance_km} km</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1 text-xs">
                <p className="text-slate-500">Expected Net Realization</p>
                <p className="text-2xl font-extrabold text-emerald-900">₹{best?.metrics?.expected_net_realization?.toLocaleString('en-IN')}</p>
                <p className="text-[11px] text-slate-600 font-semibold">₹{best?.metrics?.net_per_kg}/kg Net Profit</p>
              </div>
            </div>

            {/* 2. WHEN CARD */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4 relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <Calendar size={24} />
              </div>

              <div>
                <span className="text-xs font-extrabold text-blue-700 uppercase tracking-widest">2. WHEN TO SELL?</span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">{best?.when?.recommended_window || 'Sell within 3–5 days'}</h2>
                <p className="text-xs text-slate-500">Trend: {best?.when?.trend}</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1 text-xs">
                <p className="text-slate-500">3-Day Forecasted Price</p>
                <p className="text-2xl font-extrabold text-blue-900">₹{best?.when?.forecast_price_per_q}/q</p>
                <p className="text-[11px] text-emerald-700 font-semibold">↗ +₹120/q Projected Price Surge</p>
              </div>
            </div>

            {/* 3. TO WHOM CARD */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4 relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <UserCheck size={24} />
              </div>

              <div>
                <span className="text-xs font-extrabold text-amber-700 uppercase tracking-widest">3. TO WHOM TO SELL?</span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">{best?.to_whom?.business_name || 'ABC Agro Processing'}</h2>
                <p className="text-xs text-slate-500">Match Score: {best?.to_whom?.match_score || 92}%</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1 text-xs">
                <p className="text-slate-500">Offered Price & Payment Terms</p>
                <p className="text-2xl font-extrabold text-slate-900">₹{best?.to_whom?.offered_price_per_q}/q</p>
                <p className="text-[11px] text-slate-600 font-semibold">{best?.to_whom?.payment_terms || '7-day direct bank transfer'}</p>
              </div>
            </div>
          </div>

          {/* Explainable AI Rationale Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <CheckCircle2 size={20} className="text-emerald-600" />
                <h3 className="font-extrabold text-base text-slate-900">Why This Opportunity is Recommended</h3>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700">
                {best?.reasons?.map((reason, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span className="leading-relaxed">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Why Not Others? */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <AlertTriangle size={20} className="text-amber-600" />
                <h3 className="font-extrabold text-base text-slate-900">Why Not Alternative Markets?</h3>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                {best?.why_not_others && Object.entries(best.why_not_others).map(([mName, text]) => (
                  <div key={mName} className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/80">
                    <p className="font-bold text-amber-900 mb-1">Why not {mName}?</p>
                    <p className="text-slate-700 leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
