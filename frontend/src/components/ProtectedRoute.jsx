import React from 'react';
import { Navigate } from 'react-router-dom';
import { apiService } from '../services/api';

const ProtectedRoute = ({ element, allowedRole }) => {
  const user = apiService.getCurrentUser();
  const token = localStorage.getItem('token');

  if (!user || !token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // If authenticated but wrong role, send to their appropriate dashboard
    const roleRoutes = {
      'BOSS': '/boss',
      'ANALISTA': '/analista',
      'ARTISTA': '/artista'
    };
    return <Navigate to={roleRoutes[user.role] || '/'} replace />;
  }

  return element;
};

export default ProtectedRoute;
