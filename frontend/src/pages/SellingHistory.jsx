import React from 'react';
import { History, CheckCircle2, DollarSign, ArrowUpRight } from 'lucide-react';

export const SellingHistory = () => {
  const transactions = [
    { id: 'tx-001', crop: 'Onion', qty: '30 Quintals', mandi: 'Lasalgaon Mandi', buyer: 'ABC Agro', price: '₹4,450/q', gross: '₹1,33,500', cost: '₹8,635', net: '₹1,24,865', date: '2026-08-15' },
    { id: 'tx-002', crop: 'Tomato', qty: '20 Quintals', mandi: 'Pimpalgaon APMC', buyer: 'Local Trader', price: '₹2,200/q', gross: '₹44,000', cost: '₹4,240', net: '₹39,760', date: '2026-08-28' }
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-1">
          <History size={14} />
          <span>Historical Track Record</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Completed Sales & Performance</h1>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 font-bold text-slate-700">
                <th className="p-3">Date</th>
                <th className="p-3">Crop</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Selling Channel</th>
                <th className="p-3">Gross Revenue</th>
                <th className="p-3">Total Costs</th>
                <th className="p-3 font-extrabold text-emerald-800">Final Net Realization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 font-medium">
                  <td className="p-3 text-slate-500">{t.date}</td>
                  <td className="p-3 font-bold text-slate-900">{t.crop}</td>
                  <td className="p-3">{t.qty}</td>
                  <td className="p-3">{t.mandi} ({t.buyer})</td>
                  <td className="p-3">{t.gross}</td>
                  <td className="p-3 text-amber-700">- {t.cost}</td>
                  <td className="p-3 font-extrabold text-emerald-900 text-sm">{t.net}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const SavedOpportunities = () => {
  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900">Saved Opportunities & Scenarios</h1>
        <p className="text-xs text-slate-500">Your bookmarked selling opportunities and what-if simulation snapshots</p>
      </div>

      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 text-xs text-slate-600">
        <p className="font-bold text-slate-800">⭐ Saved Snapshot: Lasalgaon Mandi (Wait 3 Days)</p>
        <p className="mt-1">Expected Net Realization: ₹2,18,500 | Saved on 2026-09-10</p>
      </div>
    </div>
  );
};
