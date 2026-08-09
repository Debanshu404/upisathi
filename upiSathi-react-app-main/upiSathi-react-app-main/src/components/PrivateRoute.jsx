import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { userContext } from '../context/UserContext';
import { locationContext } from '../context/LocationContext';
import LocationRequired from '../pages/LocationRequired';

function PrivateRoute({ children }) {
  const { user, loading } = useContext(userContext);
  const { currentLocation, locationPermission } = useContext(locationContext);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Guard access if location is not resolved or is explicitly denied
  if (!currentLocation || locationPermission === 'denied') {
    return <LocationRequired />;
  }

  return children;
}

export default PrivateRoute;
