import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { userContext } from '../context/UserContext';

function PublicRoute({ children }) {
  const { user, loading } = useContext(userContext);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If user is already authenticated, redirect them away from login/register to Home
  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PublicRoute;
