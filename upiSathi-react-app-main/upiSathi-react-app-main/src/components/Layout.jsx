import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import NotificationDrawer from './NotificationDrawer';

function Layout() {
  return (
    <div className="min-h-screen bg-background text-default relative selection:bg-indigo-500 selection:text-white">
      {/* Subtle ambient lighting gradients */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-10 right-1/4 w-96 h-96 bg-emerald-200/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      <Navigation />
      <NotificationDrawer />
      
      {/* Content wrapper with generous padding to prevent bottom floating nav collisions */}
      <main className="pt-16 pb-28 md:pt-20 md:pb-12 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;
