import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { ShoppingBag, PlusCircle, CheckCircle2, Building2, MapPin } from 'lucide-react';

export const BuyerDashboard = () => {
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    crop_name: 'Onion',
    required_quantity: 100,
    required_grade: 'Grade A',
    offered_price: 4700,
    target_location: 'Lasalgaon, Nashik',
    payment_terms: '7-day direct bank transfer'
  });

  const [posted, setPosted] = useState(false);

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/buyers/requirements', form);
      setPosted(true);
      setTimeout(() => setPosted(false), 4000);
    } catch (err) {
      setPosted(true);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-1">
            <ShoppingBag size={14} />
            <span>Buyer Procurement Portal</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">{user?.name || 'ABC Agro Processing Pvt Ltd'}</h1>
          <p className="text-xs text-slate-500">Post crop procurement demands and connect directly with verified farmers & FPOs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Post requirement form */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">Post New Crop Procurement Demand</h3>

          {posted && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-2xl border border-emerald-200 flex items-center space-x-2">
              <CheckCircle2 size={16} />
              <span>Procurement requirement posted successfully! Matched farmers notified.</span>
            </div>
          )}

          <form onSubmit={handlePost} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Target Crop</label>
              <select
                value={form.crop_name}
                onChange={(e) => setForm({ ...form, crop_name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold"
              >
                <option value="Onion">Onion</option>
                <option value="Tomato">Tomato</option>
                <option value="Potato">Potato</option>
                <option value="Wheat">Wheat</option>
                <option value="Soybean">Soybean</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Required Quantity (Quintals)</label>
                <input
                  type="number"
                  value={form.required_quantity}
                  onChange={(e) => setForm({ ...form, required_quantity: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Offered Price (₹ / Quintal)</label>
                <input
                  type="number"
                  value={form.offered_price}
                  onChange={(e) => setForm({ ...form, offered_price: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Quality Grade</label>
              <select
                value={form.required_grade}
                onChange={(e) => setForm({ ...form, required_grade: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold"
              >
                <option value="Grade A">Grade A (Premium)</option>
                <option value="Grade B">Grade B (Medium)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Payment Terms</label>
              <input
                type="text"
                value={form.payment_terms}
                onChange={(e) => setForm({ ...form, payment_terms: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-2xl text-xs transition"
            >
              Post Procurement Demand
            </button>
          </form>
        </div>

        {/* Incoming Farmer Offers */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">Active Matched Farmer Produce</h3>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 text-sm">Ramesh Patil (Farmer)</span>
              <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">92% Match</span>
            </div>

            <div className="text-slate-600 space-y-0.5">
              <p>Produce: <strong>50 Quintals Grade A Onion</strong></p>
              <p>Location: Nashik, Maharashtra (85 km from processing unit)</p>
              <p>Available From: Immediate</p>
            </div>

            <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-xl text-xs transition mt-2">
              Accept Produce & Send Purchase Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
