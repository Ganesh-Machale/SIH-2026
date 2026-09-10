import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Sparkles, UserCheck, ShieldCheck, ShoppingBag, Building2, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DemoHeader = () => {
  const { user, switchDemoUser, setActiveProduce } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleTriggerDemoScenario = () => {
    switchDemoUser('FARMER');
    setActiveProduce({
      crop_name: 'Onion',
      quantity_quintals: 50,
      quantity_kg: 5000,
      grade: 'Grade A',
      location: 'Nashik, Maharashtra',
      harvest_date: '2026-09-08',
      storage_available: true,
      max_storage_days: 7,
      urgency: 'MEDIUM'
    });
    navigate('/dashboard');
  };

  return (
    <div className="bg-slate-900 text-white text-xs py-2 px-4 flex flex-wrap items-center justify-between border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="flex items-center space-x-3 my-1">
        <span className="bg-gradient-to-r from-emerald-500 to-green-400 text-slate-950 font-bold px-2 py-0.5 rounded tracking-wide text-[10px] uppercase">
          SIH 2026 DEMO MODE
        </span>
        <span className="text-slate-300 font-medium hidden sm:inline">
          Problem Statement ID: <strong className="text-emerald-400">SIH26132</strong>
        </span>
      </div>

      <div className="flex items-center space-x-2 my-1 overflow-x-auto">
        <span className="text-slate-400 font-medium mr-1 hidden md:inline">Switch Persona:</span>
        
        <button
          onClick={() => switchDemoUser('FARMER')}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition font-medium ${
            user?.user_type === 'FARMER'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <UserCheck size={13} />
          <span>Farmer (Ramesh)</span>
        </button>

        <button
          onClick={() => switchDemoUser('FPO')}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition font-medium ${
            user?.user_type === 'FPO'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Building2 size={13} />
          <span>FPO</span>
        </button>

        <button
          onClick={() => switchDemoUser('BUYER')}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition font-medium ${
            user?.user_type === 'BUYER'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <ShoppingBag size={13} />
          <span>Buyer</span>
        </button>

        <button
          onClick={() => switchDemoUser('ADMIN')}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition font-medium ${
            user?.user_type === 'ADMIN'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <ShieldCheck size={13} />
          <span>Admin</span>
        </button>

        <button
          onClick={handleTriggerDemoScenario}
          className="flex items-center space-x-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1 rounded-md shadow-sm transition ml-2"
          title="Reset produce to 5,000 kg Grade-A Onion scenario"
        >
          <PlayCircle size={14} className="fill-slate-950 text-amber-500" />
          <span>Preset Demo Flow</span>
        </button>
      </div>
    </div>
  );
};
