import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Building2, Users, TrendingUp, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const FPODashboard = () => {
  const [fpoData, setFpoData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFPOData();
  }, []);

  const fetchFPOData = async () => {
    try {
      const res = await axios.get('/api/fpo/dashboard');
      setFpoData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 text-white p-6 rounded-3xl shadow-lg border border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30 mb-1">
            <Building2 size={14} />
            <span>FPO Enterprise Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">{fpoData?.org_name || 'Nashik Farmers Producer Co-operative Ltd'}</h1>
          <p className="text-xs text-slate-300">
            Collective produce aggregation & bulk buyer bargaining intelligence
          </p>
        </div>

        <div className="bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700 text-xs">
          <p className="text-slate-400">Total Members</p>
          <p className="text-xl font-extrabold text-emerald-400">{fpoData?.member_count || 248} Farmers</p>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : (
        <>
          {/* Key Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <p className="text-[11px] text-slate-500 font-medium">Aggregated Volume</p>
              <p className="text-2xl font-extrabold text-slate-900">{fpoData?.total_aggregated_tonnes || 420} Tonnes</p>
              <p className="text-[10px] text-slate-500">4,200 Quintals Onion</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <p className="text-[11px] text-slate-500 font-medium">Individual Avg Net</p>
              <p className="text-2xl font-extrabold text-slate-900">₹{fpoData?.financial_metrics?.individual_avg_net_per_q}/q</p>
              <p className="text-[10px] text-slate-500">Single Farmer Rate</p>
            </div>

            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 shadow-xs space-y-1">
              <p className="text-[11px] text-emerald-800 font-bold">FPO Bulk Net Realization</p>
              <p className="text-2xl font-extrabold text-emerald-950">₹{fpoData?.financial_metrics?.fpo_bulk_net_per_q}/q</p>
              <p className="text-[10px] text-emerald-700 font-bold">+₹406/q Collective Boost</p>
            </div>

            <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-xs space-y-1">
              <p className="text-[11px] text-slate-400 font-medium">Net Collective Gain</p>
              <p className="text-2xl font-extrabold text-amber-400">₹{(fpoData?.financial_metrics?.net_collective_gain / 100000).toFixed(1)} Lakhs</p>
              <p className="text-[10px] text-slate-300">₹{fpoData?.financial_metrics?.gain_per_member_avg} / member gain</p>
            </div>
          </div>

          {/* Member Produce Aggregation Table */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Member Farmers Produce Inventory</h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">5 Lots Aggregated</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 font-bold text-slate-700">
                    <th className="p-3">Farmer Name</th>
                    <th className="p-3">Crop</th>
                    <th className="p-3">Quantity</th>
                    <th className="p-3">Grade</th>
                    <th className="p-3">Village Location</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fpoData?.produce_breakdown?.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{row.farmer_name}</td>
                      <td className="p-3">{row.crop}</td>
                      <td className="p-3 font-bold">{row.quantity_q} Quintals</td>
                      <td className="p-3">{row.grade}</td>
                      <td className="p-3">{row.location}</td>
                      <td className="p-3">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Aggregated
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
