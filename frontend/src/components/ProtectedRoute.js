import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute component for future authentication implementation
 * Currently allows all routes, but can be extended with authentication logic
 * 
 * Usage:
 * <Route path="/protected" element={<ProtectedRoute><ProtectedPage /></ProtectedRoute>} />
 */
const ProtectedRoute = ({ children, redirectTo = '/' }) => {
  // TODO: Implement authentication check
  // const isAuthenticated = checkAuth();
  const isAuthenticated = true; // Allow all routes for now

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;
