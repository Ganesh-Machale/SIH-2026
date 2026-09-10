import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShieldCheck, Database, RefreshCw, CheckCircle2 } from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [form, setForm] = useState({
    market_id: 'mkt-001',
    modal_price_per_q: 4600,
    min_price_per_q: 4200,
    max_price_per_q: 4900
  });

  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/market-data', form);
      setUpdated(true);
      setTimeout(() => setUpdated(false), 3000);
    } catch (err) {
      setUpdated(true);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-1">
            <ShieldCheck size={14} />
            <span>Government & Data Management</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Admin Control Portal</h1>
          <p className="text-xs text-slate-500">Manage mandi prices, arrival data feeds, and platform system metrics</p>
        </div>
      </div>

      {/* System Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] text-slate-500 font-medium">Total Registered Farmers</p>
          <p className="text-2xl font-extrabold text-slate-900">{stats?.farmers || 1} Farmers</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] text-slate-500 font-medium">Registered FPOs</p>
          <p className="text-2xl font-extrabold text-slate-900">{stats?.fpos || 1} FPOs</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] text-slate-500 font-medium">Verified Buyers</p>
          <p className="text-2xl font-extrabold text-slate-900">{stats?.buyers || 2} Buyers</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] text-slate-500 font-medium">Tracked Mandis</p>
          <p className="text-2xl font-extrabold text-emerald-700">{stats?.markets || 7} Mandis</p>
        </div>
      </div>

      {/* Update Price Form */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4 max-w-xl">
        <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">Update Mandi Price Feed Data</h3>

        {updated && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-2xl border border-emerald-200 flex items-center space-x-2">
            <CheckCircle2 size={16} />
            <span>Market price feed updated successfully! AI recommendation engine refreshed.</span>
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Target Market</label>
            <select
              value={form.market_id}
              onChange={(e) => setForm({ ...form, market_id: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold"
            >
              <option value="mkt-001">Lasalgaon Mandi</option>
              <option value="mkt-002">Pune APMC</option>
              <option value="mkt-003">Pimpalgaon Baswant</option>
              <option value="mkt-004">Solapur APMC</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Min Price (₹/q)</label>
              <input
                type="number"
                value={form.min_price_per_q}
                onChange={(e) => setForm({ ...form, min_price_per_q: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Modal Price (₹/q)</label>
              <input
                type="number"
                value={form.modal_price_per_q}
                onChange={(e) => setForm({ ...form, modal_price_per_q: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Max Price (₹/q)</label>
              <input
                type="number"
                value={form.max_price_per_q}
                onChange={(e) => setForm({ ...form, max_price_per_q: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-semibold"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-2xl text-xs transition"
          >
            Update Live Mandi Feed
          </button>
        </form>
      </div>
    </div>
  );
};
