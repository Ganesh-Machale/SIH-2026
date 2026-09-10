import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const DEMO_USERS = {
  FARMER: {
    id: 'user-farmer-01',
    name: 'Ramesh Patil',
    email: 'ramesh@farmer.com',
    user_type: 'FARMER',
    location: 'Nashik, Maharashtra',
    mobile: '9876543210',
    preferred_language: 'Marathi'
  },
  FPO: {
    id: 'user-fpo-01',
    name: 'Nashik Farmers Producer Co.',
    email: 'info@nashikfpo.org',
    user_type: 'FPO',
    location: 'Nashik, Maharashtra',
    mobile: '9876543211',
    preferred_language: 'English'
  },
  BUYER: {
    id: 'user-buyer-01',
    name: 'ABC Agro Processing Pvt Ltd',
    email: 'procurement@abcagro.com',
    user_type: 'BUYER',
    location: 'Lasalgaon, Nashik',
    mobile: '9876543212',
    preferred_language: 'English'
  },
  ADMIN: {
    id: 'user-admin-01',
    name: 'Agri Market Admin',
    email: 'admin@kisanniti.gov.in',
    user_type: 'ADMIN',
    location: 'Mumbai, Maharashtra',
    mobile: '9876543214',
    preferred_language: 'English'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('kisanniti_user');
    return saved ? JSON.parse(saved) : DEMO_USERS.FARMER;
  });

  const [activeProduce, setActiveProduce] = useState({
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

  const switchDemoUser = (role) => {
    const selected = DEMO_USERS[role] || DEMO_USERS.FARMER;
    setUser(selected);
    localStorage.setItem('kisanniti_user', JSON.stringify(selected));
  };

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('kisanniti_user', JSON.stringify(userData));
    if (token) localStorage.setItem('kisanniti_token', token);
  };

  const logout = () => {
    setUser(DEMO_USERS.FARMER);
    localStorage.removeItem('kisanniti_user');
    localStorage.removeItem('kisanniti_token');
  };

  return (
    <AuthContext.Provider value={{
      user,
      switchDemoUser,
      login,
      logout,
      activeProduce,
      setActiveProduce,
      DEMO_USERS
    }}>
      {children}
    </AuthContext.Provider>
  );
};
