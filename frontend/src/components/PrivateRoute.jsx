import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user || !user.id) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.user_type)) {
    // Redirect to default dashboard if authenticated but wrong role
    if (user.user_type === 'FARMER') return <Navigate to="/dashboard" replace />;
    if (user.user_type === 'BUYER') return <Navigate to="/buyer-dashboard" replace />;
    if (user.user_type === 'FPO') return <Navigate to="/fpo-dashboard" replace />;
    if (user.user_type === 'ADMIN') return <Navigate to="/admin-dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};
