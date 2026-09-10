import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calculator, DollarSign, Truck, Warehouse, Percent, ArrowRight, RefreshCw, BarChart2 } from 'lucide-react';

export const NetRealizationCalculator = () => {
  const [inputs, setInputs] = useState({
    quantity_quintals: 50,
    selling_price_per_q: 4600,
    distance_km: 145,
    storage_days: 3,
    storage_rate_per_q_day: 1.5,
    commission_percent: 1.0,
    loading_unloading_per_q: 10,
    packaging_per_q: 30,
    spoilage_rate_daily_percent: 0.8
  });

  const [result, setResult] = useState(null);

  useEffect(() => {
    calculateNet();
  }, [inputs]);

  const calculateNet = async () => {
    try {
      const res = await axios.post('/api/recommendations/net-realization', inputs);
      setResult(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-1">
          <Calculator size={14} />
          <span>Financial Engine</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Expected Net Realization Calculator</h1>
        <p className="text-xs text-slate-500">
          Adjust crop quantity, market distance, transport rates, and storage parameters to calculate exact net earnings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Form Sliders */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">Input Selling Parameters</h3>

          {/* Quantity */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between font-semibold text-slate-700">
              <span>Crop Quantity:</span>
              <span className="text-emerald-700 font-bold">{inputs.quantity_quintals} Quintals ({inputs.quantity_quintals * 100} kg)</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              value={inputs.quantity_quintals}
              onChange={(e) => setInputs({ ...inputs, quantity_quintals: parseFloat(e.target.value) })}
              className="w-full accent-emerald-600"
            />
          </div>

          {/* Selling Price */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between font-semibold text-slate-700">
              <span>Listed Market Price:</span>
              <span className="text-emerald-700 font-bold">₹{inputs.selling_price_per_q} / quintal</span>
            </div>
            <input
              type="range"
              min="2000"
              max="8000"
              step="50"
              value={inputs.selling_price_per_q}
              onChange={(e) => setInputs({ ...inputs, selling_price_per_q: parseFloat(e.target.value) })}
              className="w-full accent-emerald-600"
            />
          </div>

          {/* Distance */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between font-semibold text-slate-700">
              <span>Distance to Market:</span>
              <span className="text-emerald-700 font-bold">{inputs.distance_km} km</span>
            </div>
            <input
              type="range"
              min="10"
              max="800"
              value={inputs.distance_km}
              onChange={(e) => setInputs({ ...inputs, distance_km: parseFloat(e.target.value) })}
              className="w-full accent-emerald-600"
            />
          </div>

          {/* Storage Days */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between font-semibold text-slate-700">
              <span>Storage Duration:</span>
              <span className="text-emerald-700 font-bold">{inputs.storage_days} Days</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={inputs.storage_days}
              onChange={(e) => setInputs({ ...inputs, storage_days: parseFloat(e.target.value) })}
              className="w-full accent-emerald-600"
            />
          </div>

          {/* Mandi Commission */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between font-semibold text-slate-700">
              <span>Mandi Commission Rate:</span>
              <span className="text-emerald-700 font-bold">{inputs.commission_percent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={inputs.commission_percent}
              onChange={(e) => setInputs({ ...inputs, commission_percent: parseFloat(e.target.value) })}
              className="w-full accent-emerald-600"
            />
          </div>
        </div>

        {/* Right 6 Cols: Result Output */}
        <div className="lg:col-span-6 bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-6">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">LIVE CALCULATION RESULT</span>
            <p className="text-xs text-slate-400">Formula: Gross Revenue - (Transport + Storage + Commission + Spoilage)</p>
          </div>

          {/* Big Result Card */}
          <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 border border-emerald-500/40 rounded-2xl p-5 text-center space-y-1">
            <p className="text-xs text-emerald-300 font-bold">EXPECTED NET REALIZATION</p>
            <p className="text-4xl font-extrabold text-white">
              ₹{result?.expected_net_realization?.toLocaleString('en-IN') || '0'}
            </p>
            <div className="flex justify-center space-x-3 text-xs pt-1">
              <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full">
                ₹{result?.net_per_kg || 0} / kg NET
              </span>
              <span className="bg-amber-500/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-full">
                {result?.margin_percent || 0}% Net Margin
              </span>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Gross Revenue</span>
              <span className="font-bold text-white">₹{result?.gross_revenue?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Transport Freight Cost ({inputs.distance_km} km)</span>
              <span className="font-bold text-amber-300">- ₹{result?.cost_breakdown?.transport_cost?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Mandi Commission ({inputs.commission_percent}%)</span>
              <span className="font-bold text-amber-300">- ₹{result?.cost_breakdown?.commission?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Storage Expense ({inputs.storage_days} days)</span>
              <span className="font-bold text-amber-300">- ₹{result?.cost_breakdown?.storage_cost?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Estimated Spoilage Loss</span>
              <span className="font-bold text-amber-300">- ₹{result?.cost_breakdown?.estimated_spoilage?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-2 pt-3 font-extrabold text-sm text-emerald-400 border-t border-slate-700">
              <span>Total Cost Deductions</span>
              <span>- ₹{result?.cost_breakdown?.total_cost?.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
