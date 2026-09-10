import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PlusCircle, Sprout, Calendar, MapPin, Warehouse, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const AddProduce = () => {
  const { setActiveProduce } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    crop_name: 'Onion',
    quantity: 5000,
    quantity_unit: 'kg',
    grade: 'Grade A',
    harvest_date: new Date().toISOString().split('T')[0],
    available_from_date: new Date().toISOString().split('T')[0],
    farmer_location: 'Nashik, Maharashtra',
    storage_available: true,
    max_storage_days: 7,
    urgency: 'MEDIUM',
    min_acceptable_price: 4200
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let qtyQuintals = parseFloat(formData.quantity) || 50;
    if (formData.quantity_unit === 'kg') {
      qtyQuintals = qtyQuintals / 100.0;
    } else if (formData.quantity_unit === 'tonnes') {
      qtyQuintals = qtyQuintals * 10.0;
    }

    const updatedProduce = {
      crop_name: formData.crop_name,
      quantity_quintals: qtyQuintals,
      quantity_kg: qtyQuintals * 100,
      grade: formData.grade,
      location: formData.farmer_location,
      harvest_date: formData.harvest_date,
      available_from_date: formData.available_from_date,
      storage_available: formData.storage_available,
      max_storage_days: formData.max_storage_days,
      urgency: formData.urgency,
      min_acceptable_price: formData.min_acceptable_price
    };

    setActiveProduce(updatedProduce);

    try {
      await axios.post('/api/produce', {
        ...formData,
        quantity: qtyQuintals,
        quantity_unit: 'quintals'
      });
    } catch (err) {
      console.log('Demo mode fallback for add produce');
    }

    setLoading(false);
    navigate('/where-when-whom');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-1">
              <Sprout size={14} />
              <span>Farmer Produce Entry Form</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">List Harvested Produce</h1>
            <p className="text-xs text-slate-500">Enter crop quantity and quality to calculate Expected Net Realization</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Crop Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Select Crop</label>
              <select
                value={formData.crop_name}
                onChange={(e) => setFormData({ ...formData, crop_name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              >
                <option value="Onion">🧅 Onion (Kanda)</option>
                <option value="Tomato">🍅 Tomato</option>
                <option value="Potato">🥔 Potato (Batata)</option>
                <option value="Wheat">🌾 Wheat (Gahu)</option>
                <option value="Soybean">🫘 Soybean</option>
                <option value="Cotton">☁️ Cotton (Kapas)</option>
              </select>
            </div>

            {/* Quantity and Unit */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Quantity</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  placeholder="e.g. 5000"
                  required
                />
                <select
                  value={formData.quantity_unit}
                  onChange={(e) => setFormData({ ...formData, quantity_unit: e.target.value })}
                  className="bg-slate-100 border border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-800"
                >
                  <option value="kg">kg</option>
                  <option value="quintals">Quintals (100kg)</option>
                  <option value="tonnes">Tonnes (1000kg)</option>
                </select>
              </div>
            </div>

            {/* Quality Grade */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Quality / Grade</label>
              <select
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              >
                <option value="Grade A">Grade A (Premium Quality, Uniform Size, Dry)</option>
                <option value="Grade B">Grade B (Medium Quality, Minor Variations)</option>
                <option value="Grade C">Grade C (Mixed Size, Higher Moisture)</option>
              </select>
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Farm Location</label>
              <input
                type="text"
                value={formData.farmer_location}
                onChange={(e) => setFormData({ ...formData, farmer_location: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                placeholder="District, State (e.g. Nashik, Maharashtra)"
              />
            </div>

            {/* Storage Available */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Storage Facility On Farm / Warehouse?</label>
              <div className="flex items-center space-x-4 pt-1">
                <label className="flex items-center space-x-2 text-xs text-slate-800 cursor-pointer">
                  <input
                    type="radio"
                    name="storage"
                    checked={formData.storage_available === true}
                    onChange={() => setFormData({ ...formData, storage_available: true })}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Yes (Storage Available)</span>
                </label>

                <label className="flex items-center space-x-2 text-xs text-slate-800 cursor-pointer">
                  <input
                    type="radio"
                    name="storage"
                    checked={formData.storage_available === false}
                    onChange={() => setFormData({ ...formData, storage_available: false })}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>No (Must Sell Immediately)</span>
                </label>
              </div>
            </div>

            {/* Max Storage Duration */}
            {formData.storage_available && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Maximum Storage Duration (Days)</label>
                <input
                  type="number"
                  value={formData.max_storage_days}
                  onChange={(e) => setFormData({ ...formData, max_storage_days: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  min="1"
                  max="60"
                />
              </div>
            )}

            {/* Urgency */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Selling Urgency</label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              >
                <option value="LOW">Low (Can wait up to 14 days for peak price)</option>
                <option value="MEDIUM">Medium (Prefer to sell within 3–7 days)</option>
                <option value="HIGH">High (Urgent cash required / perishability risk)</option>
              </select>
            </div>

            {/* Minimum acceptable price */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Minimum Acceptable Price (₹ / Quintal)</label>
              <input
                type="number"
                value={formData.min_acceptable_price}
                onChange={(e) => setFormData({ ...formData, min_acceptable_price: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                placeholder="e.g. 4200"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3 rounded-xl text-xs flex items-center space-x-2 shadow-md transition disabled:opacity-50"
            >
              {loading ? (
                <span>Calculating Opportunities...</span>
              ) : (
                <>
                  <span>Find Best Selling Opportunity</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
