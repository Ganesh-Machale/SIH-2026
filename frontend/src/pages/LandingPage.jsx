import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  ArrowRight,
  TrendingUp,
  Truck,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  PlayCircle,
  BarChart3,
  MapPin,
  Sparkles,
  Users,
  Award
} from 'lucide-react';

export const LandingPage = () => {
  const [demoCrop, setDemoCrop] = useState('Onion');
  const [demoQty, setDemoQty] = useState(50); // 50 Quintals = 5,000 kg

  // Dynamic quick calculation for demo preview
  const grossRev = demoQty * 4600;
  const transportCost = 8500;
  const storageCost = 3000;
  const commissionCost = 2300;
  const spoilageCost = 2500;
  const totalCost = transportCost + storageCost + commissionCost + spoilageCost;
  const expectedNet = grossRev - totalCost;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950 text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.15),transparent_50%)] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto">
          {/* SIH Badge */}
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full mb-6">
            <Sparkles size={16} className="text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-300">Smart India Hackathon 2026</span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs font-mono font-bold text-amber-300">Problem ID: SIH26132</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Sell Smarter. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-amber-300">
                  Earn Better Net Returns.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Farmers often know today’s listed market price, but <strong>not their actual Net Realization</strong> after logistics, storage, commission, and spoilage. KisanNiti AI calculates expected net earnings and tells you exactly <strong>WHERE, WHEN & TO WHOM</strong> to sell.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/dashboard"
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-500/25 flex items-center space-x-2 transition transform hover:-translate-y-0.5"
                >
                  <span>Find Best Selling Opportunity</span>
                  <ArrowRight size={18} />
                </Link>

                <a
                  href="#how-it-works"
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-6 py-3.5 rounded-xl border border-slate-700 flex items-center space-x-2 transition"
                >
                  <PlayCircle size={18} className="text-emerald-400" />
                  <span>Explore How It Works</span>
                </a>
              </div>

              {/* Impact summary pills */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
                <div>
                  <p className="text-2xl font-extrabold text-white">₹12,400+</p>
                  <p className="text-xs text-slate-400">Avg Extra Income / Lot</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-emerald-400">24%</p>
                  <p className="text-xs text-slate-400">Lower Transport Cost</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-amber-400">87%</p>
                  <p className="text-xs text-slate-400">Forecast Confidence</p>
                </div>
              </div>
            </div>

            {/* Right Visual Card - Interactive Preview */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">Live Opportunity Preview</span>
                  </div>
                  <span className="text-[11px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded">
                    Score: 94/100
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Produce:</span>
                    <span className="font-bold text-white">5,000 kg Grade-A Onion</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Farmer Origin:</span>
                    <span className="font-semibold text-slate-200">Nashik, Maharashtra</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Recommended Market:</span>
                    <span className="font-bold text-emerald-400">Lasalgaon Mandi (145 km)</span>
                  </div>
                </div>

                {/* Net Realization Box */}
                <div className="bg-gradient-to-br from-emerald-900/60 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 text-center space-y-1">
                  <p className="text-xs text-emerald-300 font-medium">EXPECTED NET REALIZATION</p>
                  <p className="text-3xl font-extrabold text-white">₹{expectedNet.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-slate-400">
                    Gross ₹{grossRev.toLocaleString('en-IN')} - Total Cost ₹{totalCost.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                    <span>Transport cost is ₹8,500 vs ₹14,200 for Pune</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                    <span>3-day price forecast surge to ₹4,720/quintal</span>
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition"
                >
                  <span>Open Full Dashboard</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Traditional Platforms vs KisanNiti AI Comparison */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Why Traditional Price Platforms Fall Short
          </h2>
          <p className="text-slate-600 text-sm">
            Existing government and commercial platforms simply list today's mandi price. They leave the heavy math and logistics risk to the farmer.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 text-left text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                <th className="p-4 font-bold">Feature / Question</th>
                <th className="p-4 font-bold text-slate-500 w-1/3">Traditional Mandi Websites</th>
                <th className="p-4 font-bold text-emerald-800 bg-emerald-50 w-1/3 border-l border-emerald-200">KisanNiti AI Platform</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-4 font-semibold text-slate-900">Primary Focus</td>
                <td className="p-4 text-slate-600">Displays today's listed market price</td>
                <td className="p-4 bg-emerald-50/50 font-bold text-emerald-900 border-l border-emerald-200">Calculates Expected Net Realization</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-900">Logistics & Storage Cost</td>
                <td className="p-4 text-slate-600">Not calculated (Farmer does manual estimation)</td>
                <td className="p-4 bg-emerald-50/50 font-bold text-emerald-900 border-l border-emerald-200">Automated freight, loading, storage & spoilage math</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-900">Price Trend Forecasting</td>
                <td className="p-4 text-slate-600">Historical static data only</td>
                <td className="p-4 bg-emerald-50/50 font-bold text-emerald-900 border-l border-emerald-200">AI model predicts 3-day, 7-day & 15-day price trend</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-900">Buyer Matching</td>
                <td className="p-4 text-slate-600">Basic buyer list directory</td>
                <td className="p-4 bg-emerald-50/50 font-bold text-emerald-900 border-l border-emerald-200">AI-matched processors with match scores & payment terms</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-900">Scenario Comparison</td>
                <td className="p-4 text-slate-600">None</td>
                <td className="p-4 bg-emerald-50/50 font-bold text-emerald-900 border-l border-emerald-200">Interactive What-If Simulator (Sell Now vs Wait)</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-900">Core Decision Answered</td>
                <td className="p-4 text-slate-600 font-mono text-[11px]">"What is today's price?"</td>
                <td className="p-4 bg-emerald-50/50 font-bold text-emerald-900 border-l border-emerald-200 font-mono text-[11px]">"WHERE, WHEN and TO WHOM should I sell?"</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* How It Works Steps */}
      <section id="how-it-works" className="py-16 bg-slate-900 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">End-to-End Workflow</span>
            <h2 className="text-3xl font-extrabold">How KisanNiti AI Works</h2>
            <p className="text-slate-400 text-sm">6 intelligent steps transforming crop data into actionable net profit recommendations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">1</div>
              <h3 className="font-bold text-lg">Enter Crop Details</h3>
              <p className="text-xs text-slate-300">Input crop, quantity (kg/quintal), quality grade (A/B/C), location, and storage availability.</p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">2</div>
              <h3 className="font-bold text-lg">Gather Mandi & Buyer Data</h3>
              <p className="text-xs text-slate-300">System pulls live prices, arrival volumes, demand signals, and verified buyer requirements.</p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">3</div>
              <h3 className="font-bold text-lg">Calculate Net Realization</h3>
              <p className="text-xs text-slate-300">Deducts transport freight, loading/unloading, mandi commission, storage, and spoilage risk.</p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">4</div>
              <h3 className="font-bold text-lg">Forecast Price Trends</h3>
              <p className="text-xs text-slate-300">Scikit-Learn ML service models 3-day, 7-day, and 15-day price trajectories with confidence ranges.</p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">5</div>
              <h3 className="font-bold text-lg">What-If Simulation</h3>
              <p className="text-xs text-slate-300">Simulate holding produce vs immediate sale vs alternative markets to compare net profit gains.</p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">6</div>
              <h3 className="font-bold text-lg">Explainable Recommendation</h3>
              <p className="text-xs text-slate-300">Clear bullet points explaining WHY Lasalgaon is recommended and WHY NOT Pune.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-4 text-center text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Sprout size={20} className="text-emerald-400" />
            <span className="font-extrabold text-white text-base">KisanNiti AI</span>
          </div>
          <p>Smart India Hackathon 2026 | Problem Statement ID: SIH26132</p>
          <p className="text-slate-500">Built with React, Node.js Express, Python Scikit-Learn, and SQLite/MySQL relational architecture.</p>
        </div>
      </footer>
    </div>
  );
};
