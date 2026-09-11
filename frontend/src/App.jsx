import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DemoHeader } from './components/DemoHeader';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
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
import { PrivateRoute } from './components/PrivateRoute';

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
          {/* Public Routes */}
          <Route path="/" element={
            <div>
              <DemoHeader />
              <LandingPage />
            </div>
          } />
          <Route path="/login" element={<LoginPage />} />

          {/* App Dashboard Routes */}
          <Route path="/dashboard" element={<PrivateRoute allowedRoles={['FARMER']}><AppLayout><FarmerDashboard /></AppLayout></PrivateRoute>} />
          <Route path="/add-produce" element={<PrivateRoute allowedRoles={['FARMER']}><AppLayout><AddProduce /></AppLayout></PrivateRoute>} />
          <Route path="/where-when-whom" element={<PrivateRoute allowedRoles={['FARMER']}><AppLayout><WhereWhenToWhom /></AppLayout></PrivateRoute>} />
          <Route path="/market-intelligence" element={<PrivateRoute allowedRoles={['FARMER', 'FPO']}><AppLayout><MarketIntelligence /></AppLayout></PrivateRoute>} />
          <Route path="/net-realization" element={<PrivateRoute allowedRoles={['FARMER', 'FPO']}><AppLayout><NetRealizationCalculator /></AppLayout></PrivateRoute>} />
          <Route path="/price-forecast" element={<PrivateRoute allowedRoles={['FARMER', 'FPO', 'BUYER']}><AppLayout><PriceForecast /></AppLayout></PrivateRoute>} />
          <Route path="/buyer-matching" element={<PrivateRoute allowedRoles={['FARMER', 'FPO']}><AppLayout><BuyerMatching /></AppLayout></PrivateRoute>} />
          <Route path="/what-if-simulator" element={<PrivateRoute allowedRoles={['FARMER', 'FPO']}><AppLayout><WhatIfSimulator /></AppLayout></PrivateRoute>} />
          <Route path="/market-map" element={<PrivateRoute allowedRoles={['FARMER', 'FPO', 'BUYER']}><AppLayout><MarketMap /></AppLayout></PrivateRoute>} />
          <Route path="/fpo-dashboard" element={<PrivateRoute allowedRoles={['FPO']}><AppLayout><FPODashboard /></AppLayout></PrivateRoute>} />
          <Route path="/buyer-dashboard" element={<PrivateRoute allowedRoles={['BUYER']}><AppLayout><BuyerDashboard /></AppLayout></PrivateRoute>} />
          <Route path="/selling-history" element={<PrivateRoute allowedRoles={['FARMER', 'FPO']}><AppLayout><SellingHistory /></AppLayout></PrivateRoute>} />
          <Route path="/saved-opportunities" element={<PrivateRoute allowedRoles={['FARMER', 'FPO']}><AppLayout><SavedOpportunities /></AppLayout></PrivateRoute>} />
          <Route path="/admin-dashboard" element={<PrivateRoute allowedRoles={['ADMIN']}><AppLayout><AdminDashboard /></AppLayout></PrivateRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
