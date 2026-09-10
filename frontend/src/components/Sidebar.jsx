import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  TrendingUp,
  LineChart,
  Calculator,
  Compass,
  Users,
  Sliders,
  Map,
  Building2,
  ShoppingBag,
  History,
  Bookmark,
  ShieldCheck,
  Home
} from 'lucide-react';

export const Sidebar = () => {
  const { user } = useContext(AuthContext);

  const navItems = [
    { to: '/dashboard', label: 'Farmer Dashboard', icon: LayoutDashboard, role: 'FARMER' },
    { to: '/add-produce', label: 'Add Produce', icon: PlusCircle, role: 'FARMER' },
    { to: '/where-when-whom', label: 'Where / When / Whom', icon: Compass, role: 'FARMER' },
    { to: '/market-intelligence', label: 'Market Intelligence', icon: TrendingUp, role: 'ALL' },
    { to: '/net-realization', label: 'Net Realization Engine', icon: Calculator, role: 'ALL' },
    { to: '/price-forecast', label: 'AI Price Forecast', icon: LineChart, role: 'ALL' },
    { to: '/buyer-matching', label: 'Buyer Matching', icon: Users, role: 'ALL' },
    { to: '/what-if-simulator', label: 'What-If Simulator', icon: Sliders, role: 'ALL' },
    { to: '/market-map', label: 'Interactive Market Map', icon: Map, role: 'ALL' },
    { to: '/fpo-dashboard', label: 'FPO Dashboard', icon: Building2, role: 'FPO' },
    { to: '/buyer-dashboard', label: 'Buyer Dashboard', icon: ShoppingBag, role: 'BUYER' },
    { to: '/selling-history', label: 'Selling History', icon: History, role: 'FARMER' },
    { to: '/saved-opportunities', label: 'Saved Opportunities', icon: Bookmark, role: 'FARMER' },
    { to: '/admin-dashboard', label: 'Admin Portal', icon: ShieldCheck, role: 'ADMIN' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-white border-r border-slate-200 min-h-screen p-4 flex-shrink-0">
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Main Navigation</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-xs transition ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-bold shadow-xs border border-emerald-200/80'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <Icon size={18} className="text-emerald-600 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-2 px-3 flex items-center justify-around z-50 shadow-lg">
        <NavLink to="/dashboard" className={({ isActive }) => `flex flex-col items-center text-[10px] ${isActive ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
          <Home size={18} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/market-intelligence" className={({ isActive }) => `flex flex-col items-center text-[10px] ${isActive ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
          <TrendingUp size={18} />
          <span>Markets</span>
        </NavLink>
        <NavLink to="/add-produce" className={({ isActive }) => `flex flex-col items-center text-[10px] ${isActive ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
          <PlusCircle size={22} className="text-emerald-600" />
          <span>Sell</span>
        </NavLink>
        <NavLink to="/what-if-simulator" className={({ isActive }) => `flex flex-col items-center text-[10px] ${isActive ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
          <Sliders size={18} />
          <span>Simulator</span>
        </NavLink>
        <NavLink to="/buyer-matching" className={({ isActive }) => `flex flex-col items-center text-[10px] ${isActive ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
          <Users size={18} />
          <span>Buyers</span>
        </NavLink>
      </div>
    </>
  );
};
