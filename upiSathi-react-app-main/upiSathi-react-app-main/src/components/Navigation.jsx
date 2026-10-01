import React, { useContext, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, MessageSquare, User, Bell, LogOut, FileText, ArrowLeftRight, Sparkles } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { userContext } from '../context/UserContext';
import { socketContext } from '../context/SocketContext';
import { notificationContext } from '../context/NotificationContext';
import { useActiveMatches } from '../hooks/useMatches';
import { logoutUser } from '../services/api';
import ThemeToggle from './ThemeToggle';

function Navigation() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(userContext);
  const { socket, isOnline } = useContext(socketContext);
  const { unreadCount: unreadNotificationsCount, toggleDrawer, isDrawerOpen } = useContext(notificationContext);
  const queryClient = useQueryClient();

  const { data: rawActiveMatches } = useActiveMatches({
    enabled: !!user,
  });

  const matchesList = rawActiveMatches?.data || rawActiveMatches || [];
  let unreadCount = 0;
  if (Array.isArray(matchesList)) {
    matchesList.forEach(m => {
      if (m.status === 'ACTIVE') {
        const isRequester = m.requester?._id === user?._id || m.requester === user?._id;
        unreadCount += isRequester ? (m.requesterUnread || 0) : (m.accepterUnread || 0);
      }
    });
  }

  useEffect(() => {
    if (!user || !socket?.current) return;

    const handleSocketUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['activeMatches'] });
    };

    const s = socket.current;
    s.on('newMatch', handleSocketUpdate);
    s.on('confirmMatch', handleSocketUpdate);
    s.on('rejectMatch', handleSocketUpdate);
    s.on('completeMatch', handleSocketUpdate);
    s.on('cancelActiveMatch', handleSocketUpdate);
    s.on('newMessage', handleSocketUpdate);
    
    return () => {
      s.off('newMatch', handleSocketUpdate);
      s.off('confirmMatch', handleSocketUpdate);
      s.off('rejectMatch', handleSocketUpdate);
      s.off('completeMatch', handleSocketUpdate);
      s.off('cancelActiveMatch', handleSocketUpdate);
      s.off('newMessage', handleSocketUpdate);
    };
  }, [user, socket, queryClient]);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Failed to logout:', err);
    } finally {
      setUser(null);
      queryClient.clear();
      navigate('/login');
    }
  };

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={22} /> },
    { name: 'My Swaps', path: '/activity', icon: <FileText size={22} /> },
    { name: 'Chats', path: '/chats', icon: <MessageSquare size={22} /> },
    { name: 'Profile', path: '/profile', icon: <User size={22} /> },
  ];

  const desktopNavItems = navItems.filter(item => item.name !== 'Profile');

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 w-full h-15 bg-white/90 dark:bg-[#1a1918]/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-white/10 flex items-center justify-between px-4 z-50 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-colors">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
            <ArrowLeftRight size={16} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white leading-none">
              UPI<span className="text-indigo-600 dark:text-indigo-400">Sathi</span>
            </div>
            <div className="text-[9px] font-bold text-slate-400 tracking-wider uppercase leading-none mt-0.5">
              PeerSync
            </div>
          </div>
          {isOnline && (
            <span className="flex h-2 w-2 relative ml-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1.5">
          {/* Light / Dark Mode Toggle */}
          <ThemeToggle />

          <button 
            onClick={toggleDrawer}
            className={`p-2.5 transition-all relative rounded-xl duration-200 active:scale-95 border ${
              isDrawerOpen 
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/5 border-transparent'
            }`}
            aria-label="Notifications"
          >
            <Bell size={18} className="stroke-[2.2]" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[8px] font-black text-white shadow-sm border border-white animate-badge-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          <button 
            onClick={handleLogout}
            className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer border border-transparent hover:border-rose-100 dark:hover:border-rose-900/40"
            aria-label="Logout"
            title="Log out"
          >
            <LogOut size={18} className="stroke-[2.2]" />
          </button>
        </div>
      </div>

      {/* Desktop Top Nav */}
      <div className="hidden md:block fixed top-0 left-0 right-0 w-full h-16 bg-white/85 dark:bg-[#1a1918]/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-white/10 z-50 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto h-full px-6 md:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <ArrowLeftRight size={18} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                UPI<span className="text-indigo-600 dark:text-indigo-400">Sathi</span>
              </div>
              <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase leading-none mt-0.5">
                Peer-to-Peer Cash Swap
              </div>
            </div>

            {isOnline && (
              <div className="flex items-center space-x-1.5 ml-2 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/40 select-none">
                <span className="flex h-1.5 w-1.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider leading-none">Live</span>
              </div>
            )}
          </div>
          
          {/* Centered Navigation Pills */}
          <nav className="flex items-center space-x-1 bg-slate-100/70 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 p-1 rounded-2xl shadow-inner">
            {desktopNavItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-xl font-bold text-sm transition-all duration-200 active:scale-97 border ${
                    isActive 
                      ? 'text-indigo-600 dark:text-white bg-white dark:bg-[#272625] shadow-[0_2px_8px_rgba(99,102,241,0.08)] border-slate-200/80 dark:border-white/10 font-extrabold' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5 border-transparent'
                  }`
                }
              >
                <div className="relative">
                  {React.cloneElement(item.icon, { size: 16 })}
                  {item.name === 'Chats' && unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[8px] font-black text-white shadow-sm border border-white animate-badge-pulse">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <span>{item.name}</span>
              </NavLink>
            ))}

            <NavLink
              to="/landing"
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded-xl font-bold text-sm transition-all duration-200 border ${
                  isActive 
                    ? 'text-phoenix-orange bg-white dark:bg-[#272625] border-slate-200/80 dark:border-white/10 font-extrabold' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-phoenix-orange hover:bg-white/50 dark:hover:bg-white/5 border-transparent'
                }`
              }
              title="View Platform Vision & Use Cases"
            >
              <Sparkles size={15} className="text-phoenix-orange" />
              <span>Vision</span>
            </NavLink>
          </nav>

          {/* Right Action Icons: Theme Toggle, Notifications, Profile, Logout */}
          <div className="flex items-center space-x-2.5">
            {/* Dark Mode Toggle Button */}
            <ThemeToggle />

            <button 
              onClick={toggleDrawer}
              className={`p-2.5 transition-all relative rounded-xl duration-200 active:scale-95 border ${
                isDrawerOpen 
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/5 border-transparent'
              }`}
              title="Notifications"
            >
              <Bell size={18} className="stroke-[2.2]" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[8px] font-black text-white shadow-sm border border-white animate-badge-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            <div className="w-px h-5 bg-slate-200 dark:bg-white/10" />

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center space-x-2.5 p-1.5 pr-3.5 rounded-xl transition-all duration-200 active:scale-97 border ${
                  isActive 
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 shadow-sm' 
                    : 'border-slate-200/50 dark:border-white/10 bg-white/70 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-slate-800 dark:text-white hover:border-indigo-150'
                }`
              }
              title="Profile"
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 shadow-sm flex items-center justify-center bg-slate-100 shrink-0">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user?.username} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-indigo-700 text-white font-extrabold text-xs">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-start leading-none">
                <span className="text-xs font-bold text-slate-800 truncate max-w-[90px]">{user?.username || 'Profile'}</span>
                <span className="text-[10px] font-bold text-amber-500 mt-0.5">
                  ★ {Number(user?.trustScore || 4.8).toFixed(1)}
                </span>
              </div>
            </NavLink>

            <button 
              onClick={handleLogout}
              className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer border border-transparent hover:border-rose-100"
              title="Logout"
            >
              <LogOut size={18} className="stroke-[2.2]" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Floating Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 h-16 bg-white/90 dark:bg-[#1a1918]/90 backdrop-blur-xl border border-slate-200/70 dark:border-white/10 flex items-center justify-around z-50 rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] px-2 transition-colors">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className="flex-1 h-full flex flex-col items-center justify-center py-1 transition-all duration-200 active:scale-95"
          >
            {({ isActive }) => (
              <>
                <div className={`relative p-2 rounded-xl transition-all duration-200 flex items-center justify-center ${
                  isActive 
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800 scale-105 shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent'
                }`}>
                  {item.name === 'Profile' ? (
                    <div className={`w-5 h-5 rounded-full overflow-hidden border transition-all duration-200 ${
                      isActive ? 'border-indigo-600 scale-105 ring-2 ring-indigo-200' : 'border-slate-300'
                    }`}>
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user?.username} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white font-bold text-[9px]">
                          {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                  ) : (
                    React.cloneElement(item.icon, { size: 19 })
                  )}
                  
                  {item.name === 'Chats' && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[8px] font-black text-white shadow-sm border border-white animate-badge-pulse">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] tracking-tight mt-1 transition-all duration-200 ${isActive ? 'font-extrabold text-indigo-600' : 'font-medium text-slate-500'}`}>
                  {item.name}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </>
  );
}

export default Navigation;
