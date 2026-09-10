import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Sliders, Sparkles, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight, Info } from 'lucide-react';

export const WhatIfSimulator = () => {
  const { activeProduce } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [simData, setSimData] = useState(null);

  useEffect(() => {
    fetchSimulation();
  }, [activeProduce]);

  const fetchSimulation = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/simulator', {
        quantity_quintals: activeProduce.quantity_quintals || 50,
        current_price_per_q: 4600,
        distance_km: 145
      });
      setSimData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const scenarios = simData?.scenarios || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-emerald-950 text-white p-6 rounded-3xl shadow-lg border border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30 mb-1">
            <Sliders size={14} />
            <span>Interactive Decision Simulator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">What-If Selling Simulator</h1>
          <p className="text-xs text-slate-300">
            Simulating "What happens if I wait 3 days vs 7 days vs choose another mandi or direct buyer?"
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 font-medium">Calculating scenario revenue, storage costs, and spoilage losses...</p>
        </div>
      ) : (
        <>
          {/* Recommendation summary box */}
          <div className="bg-emerald-900 text-white p-5 rounded-3xl shadow-md border border-emerald-700 flex items-start space-x-3 text-xs">
            <Sparkles size={22} className="text-amber-300 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-extrabold text-sm text-emerald-200">AI SIMULATOR RECOMMENDATION:</p>
              <p className="leading-relaxed text-slate-100 font-medium">
                {simData?.recommendation_summary || 'Waiting 3 days yields the highest expected net realization (+₹3,800) due to projected price surge to ₹4,720/q.'}
              </p>
            </div>
          </div>

          {/* Comparative Bar Chart Visualization */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Expected Net Realization Across 5 Scenarios (₹)</h3>
              <span className="text-xs font-semibold text-emerald-700">Highest: Wait 3 Days (+₹3,800 gain)</span>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scenarios}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="title" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Expected Net']} />
                  <Bar dataKey="expected_net_realization" radius={[8, 8, 0, 0]}>
                    {scenarios.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.diff_from_sell_now > 3000 ? '#16a34a' : entry.diff_from_sell_now < 0 ? '#dc2626' : '#0284c7'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Scenario Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scenarios.map((sc) => {
              const isGain = sc.diff_from_sell_now > 0;
              const isLoss = sc.diff_from_sell_now < 0;
              const isBest = sc.status === 'RECOMMENDED';

              return (
                <div
                  key={sc.id}
                  className={`bg-white rounded-3xl p-5 shadow-sm border space-y-4 relative overflow-hidden transition ${
                    isBest ? 'border-2 border-emerald-500 shadow-md' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                      isBest ? 'bg-emerald-600 text-white' : isLoss ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {sc.badge}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">{sc.timeframe}</span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">{sc.title}</h3>
                    <p className="text-xs text-slate-500">{sc.market}</p>
                  </div>

                  {/* Net Box */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                    <p className="text-[11px] text-slate-500">Expected Net Realization</p>
                    <p className="text-2xl font-extrabold text-slate-900">
                      ₹{sc.expected_net_realization?.toLocaleString('en-IN')}
                    </p>
                    
                    {sc.diff_from_sell_now !== 0 && (
                      <p className={`text-xs font-bold ${isGain ? 'text-emerald-700' : 'text-red-600'}`}>
                        {isGain ? `+₹${sc.diff_from_sell_now?.toLocaleString('en-IN')} Profit Gain` : `-₹${Math.abs(sc.diff_from_sell_now)?.toLocaleString('en-IN')} Net Loss`}
                      </p>
                    )}
                  </div>

                  {/* Breakdown details */}
                  <div className="space-y-1 text-xs text-slate-600 border-t border-slate-100 pt-2">
                    <div className="flex justify-between">
                      <span>Selling Price:</span>
                      <span className="font-semibold text-slate-900">₹{sc.selling_price_per_q}/q</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transport Freight:</span>
                      <span className="text-slate-900">₹{sc.transport_cost?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Storage Expense:</span>
                      <span className="text-slate-900">₹{sc.storage_cost?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Spoilage Loss:</span>
                      <span className="text-slate-900">₹{sc.spoilage_cost?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
