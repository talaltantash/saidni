import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ user, requiredType, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredType && user.user_type !== requiredType) {
    return <Navigate to="/" replace />;
  }

  return children;
}
