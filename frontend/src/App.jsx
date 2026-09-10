import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DemoHeader } from './components/DemoHeader';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

import { LandingPage } from './pages/LandingPage';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { AddProduce } from './pages/AddProduce';
import { MarketIntelligence } from './pages/MarketIntelligence';
import { WhereWhenToWhom } from './pages/WhereWhenToWhom';
import { NetRealizationCalculator } from './pages/NetRealizationCalculator';
import { PriceForecast } from './pages/PriceForecast';
import { BuyerMatching } from './pages/BuyerMatching';
import { WhatIfSimulator } from './pages/WhatIfSimulator';
import { MarketMap } from './pages/MarketMap';
import { FPODashboard } from './pages/FPODashboard';
import { BuyerDashboard } from './pages/BuyerDashboard';
import { SellingHistory, SavedOpportunities } from './pages/SellingHistory';
import { AdminDashboard } from './pages/AdminDashboard';

// Layout wrapper for app pages (with navbar and sidebar)
const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoHeader />
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={
            <div>
              <DemoHeader />
              <LandingPage />
            </div>
          } />

          {/* App Dashboard Routes */}
          <Route path="/dashboard" element={<AppLayout><FarmerDashboard /></AppLayout>} />
          <Route path="/add-produce" element={<AppLayout><AddProduce /></AppLayout>} />
          <Route path="/where-when-whom" element={<AppLayout><WhereWhenToWhom /></AppLayout>} />
          <Route path="/market-intelligence" element={<AppLayout><MarketIntelligence /></AppLayout>} />
          <Route path="/net-realization" element={<AppLayout><NetRealizationCalculator /></AppLayout>} />
          <Route path="/price-forecast" element={<AppLayout><PriceForecast /></AppLayout>} />
          <Route path="/buyer-matching" element={<AppLayout><BuyerMatching /></AppLayout>} />
          <Route path="/what-if-simulator" element={<AppLayout><WhatIfSimulator /></AppLayout>} />
          <Route path="/market-map" element={<AppLayout><MarketMap /></AppLayout>} />
          <Route path="/fpo-dashboard" element={<AppLayout><FPODashboard /></AppLayout>} />
          <Route path="/buyer-dashboard" element={<AppLayout><BuyerDashboard /></AppLayout>} />
          <Route path="/selling-history" element={<AppLayout><SellingHistory /></AppLayout>} />
          <Route path="/saved-opportunities" element={<AppLayout><SavedOpportunities /></AppLayout>} />
          <Route path="/admin-dashboard" element={<AppLayout><AdminDashboard /></AppLayout>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
