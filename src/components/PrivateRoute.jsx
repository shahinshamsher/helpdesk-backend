import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserFromToken } from '../utils/auth';

/**
 * roles: optional array ['admin','agent','user']
 */
export default function PrivateRoute({ children, roles }) {
  const user = getUserFromToken();
  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) return <div className="alert alert-danger">Access denied</div>;

  return children;
}
