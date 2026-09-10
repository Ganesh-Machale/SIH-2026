import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Sprout, Bell, User, MapPin, Search, ChevronDown, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-10 z-40 px-4 lg:px-8 py-3 flex items-center justify-between shadow-sm">
      {/* Brand logo & tagline */}
      <div className="flex items-center space-x-3">
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="w-10 h-10 rounded-xl gradient-agri flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Sprout size={22} className="text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">KisanNiti</span>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-1.5 py-0.5 rounded border border-emerald-300">AI</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Where. When. To Whom. Sell Smarter.</p>
          </div>
        </Link>
      </div>

      {/* Center Search / Location Info */}
      <div className="hidden md:flex items-center space-x-3 bg-slate-100 px-3.5 py-1.5 rounded-full text-xs text-slate-600 border border-slate-200">
        <MapPin size={14} className="text-emerald-600" />
        <span className="font-semibold text-slate-700">Location:</span>
        <span>{user?.location || 'Nashik, Maharashtra'}</span>
      </div>

      {/* Right icons & profile */}
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full text-slate-600 hover:bg-slate-100 transition relative"
            title="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 px-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                <h4 className="font-bold text-sm text-slate-800">Notifications</h4>
                <span className="text-[11px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">2 New</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-2 bg-emerald-50/60 rounded-xl border border-emerald-100">
                  <p className="font-bold text-slate-800">📈 Price Forecast Alert</p>
                  <p className="text-slate-600 mt-0.5">Onion in Lasalgaon Mandi is projected to increase by ₹120/q in 3 days.</p>
                </div>
                <div className="p-2 bg-blue-50/60 rounded-xl border border-blue-100">
                  <p className="font-bold text-slate-800">🤝 New Buyer Match Found</p>
                  <p className="text-slate-600 mt-0.5">ABC Agro Processing posted demand for 100 quintals Grade A Onion.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Badge */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
            {user?.name ? user.name.charAt(0) : 'F'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name || 'Ramesh Patil'}</p>
            <p className="text-[10px] text-emerald-700 font-semibold">{user?.user_type || 'FARMER'}</p>
          </div>
        </div>
      </div>
    </nav>
  );
};
