import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const userSession = localStorage.getItem('userSession');
  return userSession ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;