import React, { useContext, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, MessageSquare, User, Bell, LogOut, FileText } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { userContext } from '../context/UserContext';
import { socketContext } from '../context/SocketContext';
import { notificationContext } from '../context/NotificationContext';
import { useActiveMatches } from '../hooks/useMatches';
import { logoutUser } from '../services/api';

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
    { name: 'Home', path: '/', icon: <Home size={24} /> },
    { name: 'My Swaps', path: '/activity', icon: <FileText size={24} /> },
    { name: 'Chats', path: '/chats', icon: <MessageSquare size={24} /> },
    { name: 'Profile', path: '/profile', icon: <User size={24} /> },
  ];

  const desktopNavItems = navItems.filter(item => item.name !== 'Profile');

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 w-full h-14 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 z-50 shadow-sm shadow-indigo-100/[0.01]">
        <div className="flex items-center space-x-2">
          <div className="font-black text-lg bg-gradient-to-r from-indigo-600 to-indigo-650 bg-clip-text text-transparent tracking-tight select-none">PeerSync</div>
          {isOnline && (
            <span className="flex h-2 w-2 relative mt-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1.5">
          <button 
            onClick={toggleDrawer}
            className={`p-2 transition-all relative rounded-xl duration-300 active:scale-95 border ${
              isDrawerOpen 
                ? 'text-indigo-600 bg-indigo-50 border-indigo-100/50 shadow-sm shadow-indigo-100/5' 
                : 'text-slate-450 hover:text-indigo-600 hover:bg-slate-50 border-transparent'
            }`}
          >
            <Bell size={19} className="stroke-[2.2]" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[8px] font-black text-white shadow-sm border border-white animate-badge-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
          <button 
            onClick={handleLogout}
            className="p-2 transition-all relative rounded-xl duration-300 text-slate-400 hover:text-rose-600 hover:bg-rose-55 border border-transparent hover:border-rose-100/30 active:scale-95 cursor-pointer"
            aria-label="Logout"
          >
            <LogOut size={19} className="stroke-[2.2]" />
          </button>
        </div>
      </div>

      {/* Desktop Top Nav */}
      <div className="hidden md:block fixed top-0 left-0 right-0 w-full h-16 bg-white/80 backdrop-blur-md border-b border-slate-100/80 z-50 shadow-sm shadow-indigo-100/[0.01] transition-all duration-300">
        <div className="max-w-7xl mx-auto h-full px-6 md:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="font-black text-2xl bg-gradient-to-r from-indigo-600 to-indigo-650 bg-clip-text text-transparent tracking-tight select-none">PeerSync</div>
            {isOnline && (
              <div className="flex items-center space-x-1.5 mt-0.5 bg-emerald-50/80 px-2.5 py-0.5 rounded-full border border-emerald-100/40 shadow-sm shadow-emerald-100/5 select-none">
                <span className="flex h-1.5 w-1.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest leading-none">Online</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-1 bg-slate-100/50 backdrop-blur-sm border border-slate-200/30 p-1 rounded-2xl shadow-sm">
            {desktopNavItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 active:scale-97 border ${
                    isActive 
                      ? 'text-indigo-600 bg-white shadow-[0_2px_8px_rgba(99,102,241,0.06)] border-slate-200/30 font-extrabold' 
                      : 'text-slate-500 hover:text-indigo-600 hover:bg-white/50 border-transparent'
                  }`
                }
              >
                <div className="relative transition-transform duration-350">
                  {React.cloneElement(item.icon, { size: 17 })}
                  {item.name === 'Chats' && unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[8px] font-black text-white shadow-sm border border-white animate-badge-pulse">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            {/* Notifications Bell */}
            <button 
              onClick={toggleDrawer}
              className={`p-2 transition-all relative rounded-xl duration-300 active:scale-95 border ${
                isDrawerOpen 
                  ? 'text-indigo-600 bg-indigo-50 border-indigo-100/50 shadow-sm shadow-indigo-100/5' 
                  : 'text-slate-550 hover:text-indigo-600 hover:bg-slate-50 border-transparent'
              }`}
              title="Notifications"
            >
              <Bell size={19} className="stroke-[2.2]" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[8px] font-black text-white shadow-sm border border-white animate-badge-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Vertical Separator */}
            <div className="w-px h-5 bg-slate-200/60 mx-0.5" />

            {/* Profile Avatar Link */}
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center space-x-2 p-1 pr-3 rounded-xl transition-all duration-300 active:scale-97 border ${
                  isActive 
                    ? 'bg-indigo-50/50 border-indigo-100/40 text-indigo-700 font-bold shadow-sm shadow-indigo-100/5' 
                    : 'border-transparent text-slate-700 hover:bg-slate-50 hover:text-indigo-650'
                }`
              }
              title="Profile"
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200/60 shadow-sm flex items-center justify-center bg-slate-100 shrink-0">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user?.username} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-indigo-650 text-white font-bold text-sm">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-start leading-none animate-in fade-in duration-300">
                <span className="text-xs font-bold truncate max-w-[80px]">{user?.username || 'Profile'}</span>
                <span className="text-[9px] font-semibold text-slate-400 mt-0.5">
                  {user?.trustScore ? `★ ${Number(user.trustScore).toFixed(1)}` : 'Verified'}
                </span>
              </div>
            </NavLink>

            {/* Logout */}
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-300 active:scale-95 cursor-pointer border border-transparent hover:border-rose-100/30"
              title="Logout"
            >
              <LogOut size={18} className="stroke-[2.2]" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 h-16 bg-white/80 backdrop-blur-md border border-slate-100/80 flex items-center justify-around z-50 rounded-2xl shadow-[0_10px_30px_rgba(99,102,241,0.06)] px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className="flex-1 h-full flex flex-col items-center justify-center py-1 transition-all duration-300 active:scale-95"
          >
            {({ isActive }) => (
              <>
                <div className={`relative p-2 rounded-xl transition-all duration-300 flex items-center justify-center ${
                  isActive 
                    ? 'bg-gradient-to-br from-indigo-50/90 to-indigo-100/50 border border-indigo-100/20 text-indigo-600 scale-105 shadow-[inset_0_1px_2px_rgba(99,102,241,0.03)]' 
                    : 'text-slate-450 hover:bg-slate-50/50 border border-transparent'
                }`}>
                  {item.name === 'Profile' ? (
                    <div className={`w-5 h-5 rounded-full overflow-hidden border transition-all duration-300 ${
                      isActive ? 'border-indigo-500 scale-105 ring-2 ring-indigo-100/50' : 'border-slate-300'
                    }`}>
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user?.username} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-indigo-650 text-white font-bold text-[8px]">
                          {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                  ) : (
                    React.cloneElement(item.icon, { size: 20 })
                  )}
                  
                  {item.name === 'Chats' && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[8px] font-black text-white shadow-sm border border-white animate-badge-pulse">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <span className={`text-[9px] tracking-wide mt-1 transition-all duration-300 ${isActive ? 'opacity-100 font-extrabold text-indigo-600' : 'opacity-85 font-bold text-slate-450'}`}>{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </>
  );
}

export default Navigation;
