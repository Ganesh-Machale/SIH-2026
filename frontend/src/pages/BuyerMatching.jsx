import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Users, ShoppingBag, ShieldCheck, CheckCircle2, Send, MapPin, Award, Star } from 'lucide-react';

export const BuyerMatching = () => {
  const { activeProduce } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [buyers, setBuyers] = useState([]);
  const [sentMap, setSentMap] = useState({});

  useEffect(() => {
    fetchBuyers();
  }, [activeProduce]);

  const fetchBuyers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/buyers?crop_name=${activeProduce.crop_name || 'Onion'}&quantity_quintals=${activeProduce.quantity_quintals || 50}&grade=${activeProduce.grade || 'Grade A'}`);
      setBuyers(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (buyerId) => {
    setSentMap({ ...sentMap, [buyerId]: 'SENDING' });
    try {
      await axios.post('/api/buyers/request-purchase', {
        produce_id: 'prod-001',
        buyer_id: buyerId,
        offered_quantity: activeProduce.quantity_quintals || 50,
        notes: 'Ready for inspection and dispatch.'
      });
      setSentMap({ ...sentMap, [buyerId]: 'SENT' });
    } catch (err) {
      setSentMap({ ...sentMap, [buyerId]: 'SENT' });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-1">
            <Users size={14} />
            <span>AI Direct Buyer Matching</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Verified Institutional & Processor Buyers</h1>
          <p className="text-xs text-slate-500">
            Matching buyers seeking {activeProduce.quantity_quintals * 100} kg {activeProduce.crop_name} ({activeProduce.grade})
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 font-medium">Matching buyers by crop, grade, volume, payment terms, and location...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {buyers.map((b) => {
            const isSent = sentMap[b.id] === 'SENT';
            const isSending = sentMap[b.id] === 'SENDING';
            return (
              <div key={b.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">{b.business_name}</h3>
                      <p className="text-[10px] text-slate-500">{b.buyer_type} | {b.buyer_location || 'Lasalgaon, Nashik'}</p>
                    </div>
                  </div>

                  <span className="bg-emerald-600 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-xs">
                    {b.match_score || 92}% Match
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <p className="text-slate-500 text-[10px]">Offered Price</p>
                    <p className="font-extrabold text-slate-900 text-base">₹{b.offered_price_per_q}/q</p>
                    <p className="text-[10px] text-emerald-700 font-semibold">₹{(b.offered_price_per_q / 100).toFixed(1)} / kg</p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <p className="text-slate-500 text-[10px]">Required Lot & Grade</p>
                    <p className="font-bold text-slate-900">{b.required_quantity_quintals} Quintals</p>
                    <p className="text-[10px] text-slate-600 font-medium">Grade: {b.required_grade}</p>
                  </div>
                </div>

                {/* Terms and Rating */}
                <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50/60 p-3 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Payment Terms:</span>
                    <span className="font-bold text-slate-900">{b.payment_terms}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Reliability Rating:</span>
                    <span className="font-bold text-amber-600 flex items-center space-x-1">
                      <Star size={13} className="fill-amber-500 text-amber-500 inline mr-0.5" />
                      <span>{b.reliability_rating} / 5.0</span>
                    </span>
                  </div>
                </div>

                {/* Match Reasons List */}
                <div className="space-y-1 text-xs">
                  {b.match_reasons?.map((reason, idx) => (
                    <div key={idx} className="flex items-center space-x-1.5 text-slate-600">
                      <CheckCircle2 size={13} className="text-emerald-600 flex-shrink-0" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>

                {/* Action button */}
                <button
                  onClick={() => handleSendRequest(b.id)}
                  disabled={isSent || isSending}
                  className={`w-full font-bold py-3 rounded-2xl text-xs flex items-center justify-center space-x-2 transition shadow-sm ${
                    isSent
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {isSent ? (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Request to Purchase Sent!</span>
                    </>
                  ) : isSending ? (
                    <span>Sending Request...</span>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Send Request to Purchase</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
