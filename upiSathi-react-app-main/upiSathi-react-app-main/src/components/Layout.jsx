import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import NotificationDrawer from './NotificationDrawer';

function Layout() {
  return (
    <div className="min-h-screen bg-background text-default">
      <Navigation />
      <NotificationDrawer />
      
      {/* Content wrapper with padding to account for fixed navs.
          Mobile: pt-14 (top bar) and pb-16 (bottom nav).
          Desktop: pt-16 (top nav) and pb-0 (no bottom nav).
      */}
      <main className="pt-14 pb-16 md:pt-16 md:pb-0 min-h-screen">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;

