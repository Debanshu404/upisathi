import React, { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  CheckCheck, 
  Trash2, 
  BellOff, 
  ArrowRightLeft, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import { notificationContext } from '../context/NotificationContext';

export default function NotificationDrawer() {
  const {
    notifications,
    unreadCount,
    isDrawerOpen,
    setIsDrawerOpen,
    loading,
    markNotificationRead,
    markAllNotificationsRead,
    clearAllNotifications,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  } = useContext(notificationContext);

  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!isDrawerOpen || !hasNextPage || isFetchingNextPage || !sentinelRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    }, {
      root: sentinelRef.current.parentElement,
      threshold: 0.1
    });

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [isDrawerOpen, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const navigate = useNavigate();
  const drawerRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsDrawerOpen(false);
      }
    };
    if (isDrawerOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDrawerOpen]);

  // Prevent scroll propagation when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  const handleNotificationClick = async (n) => {
    if (!n.isRead) {
      await markNotificationRead(n._id);
    }
    setIsDrawerOpen(false);

    // Context-aware redirection
    if (n.metaData?.matchId) {
      if (n.type === 'SWAP_COMPLETED' || n.type === 'SWAP_CANCELLED') {
        navigate('/activity');
      } else {
        navigate(`/chat/${n.metaData.matchId}`);
      }
    } else if (n.metaData?.requestId) {
      navigate('/');
    } else {
      navigate('/activity');
    }
  };

  const formatTimeAgo = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSecs < 10) return 'Just now';
      if (diffSecs < 60) return `${diffSecs}s ago`;
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch (e) {
      return '';
    }
  };

  const getNotificationStyles = (type) => {
    switch (type) {
      case 'OFFER_RECEIVED':
        return {
          icon: <ArrowDownLeft className="text-indigo-600" size={18} />,
          bgClass: 'bg-indigo-50/50 border-indigo-100 hover:bg-indigo-50/80',
          badgeClass: 'bg-indigo-100 text-indigo-700 border-indigo-200/50',
          dotClass: 'bg-indigo-500'
        };
      case 'OFFER_ACCEPTED':
        return {
          icon: <ArrowUpRight className="text-emerald-600" size={18} />,
          bgClass: 'bg-emerald-50/50 border-emerald-100 hover:bg-emerald-50/80',
          badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200/50',
          dotClass: 'bg-emerald-500'
        };
      case 'OFFER_REJECTED':
        return {
          icon: <XCircle className="text-rose-600" size={18} />,
          bgClass: 'bg-rose-50/50 border-rose-100 hover:bg-rose-50/80',
          badgeClass: 'bg-rose-100 text-rose-700 border-rose-200/50',
          dotClass: 'bg-rose-500'
        };
      case 'SWAP_COMPLETED':
        return {
          icon: <Sparkles className="text-amber-600 animate-pulse" size={18} />,
          bgClass: 'bg-amber-50/40 border-amber-100 hover:bg-amber-50/70',
          badgeClass: 'bg-amber-100 text-amber-800 border-amber-200/50',
          dotClass: 'bg-amber-500'
        };
      case 'SWAP_CANCELLED':
        return {
          icon: <XCircle className="text-slate-600" size={18} />,
          bgClass: 'bg-slate-50/70 border-slate-100 hover:bg-slate-100/70',
          badgeClass: 'bg-slate-200 text-slate-700 border-slate-300/50',
          dotClass: 'bg-slate-400'
        };
      default:
        return {
          icon: <ArrowRightLeft className="text-indigo-600" size={18} />,
          bgClass: 'bg-indigo-50/50 border-indigo-100 hover:bg-indigo-50/80',
          badgeClass: 'bg-indigo-100 text-indigo-700 border-indigo-200/50',
          dotClass: 'bg-indigo-500'
        };
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        onClick={() => setIsDrawerOpen(false)}
        className={`fixed inset-0 bg-slate-950/20 backdrop-blur-sm z-[100] transition-opacity duration-300 ${
          isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer Container */}
      <div 
        ref={drawerRef}
        className={`fixed right-0 top-0 h-full w-full sm:w-[28rem] bg-white/95 backdrop-blur-xl border-l border-slate-100 shadow-2xl z-[101] flex flex-col transition-all duration-300 ease-out transform ${
          isDrawerOpen 
            ? 'translate-x-0 opacity-100' 
            : 'translate-x-full opacity-90'
        }`}
      >
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h2 className="font-extrabold text-xl text-slate-800 tracking-tight">Notifications</h2>
            {unreadCount > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[10px] font-black text-white shadow-sm shadow-indigo-200">
                {unreadCount}
              </span>
            )}
          </div>
          
          <button 
            onClick={() => setIsDrawerOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Action Buttons Bar */}
        {notifications.length > 0 && (
          <div className="px-6 py-3 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between text-xs">
            <button 
              onClick={markAllNotificationsRead}
              className="flex items-center space-x-1.5 text-indigo-600 font-bold hover:text-indigo-800 transition-colors cursor-pointer"
            >
              <CheckCheck size={14} className="stroke-[2.5]" />
              <span>Mark all as read</span>
            </button>
            <button 
              onClick={clearAllNotifications}
              className="flex items-center space-x-1.5 text-rose-500 font-bold hover:text-rose-700 transition-colors cursor-pointer"
            >
              <Trash2 size={14} className="stroke-[2.5]" />
              <span>Clear all</span>
            </button>
          </div>
        )}

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 scrollbar-thin scrollbar-thumb-indigo-100 scrollbar-track-transparent">
          {loading && notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-3">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold text-slate-400">Syncing alerts...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-80 text-center px-4 space-y-4">
              <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 shadow-sm shadow-slate-100/50">
                <BellOff size={28} className="stroke-[1.8]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-700 text-sm">All caught up!</h3>
                <p className="text-xs text-slate-400 max-w-[18rem]">You don't have any notifications right now. We'll alert you when matching offers arrive.</p>
              </div>
            </div>
          ) : (
            notifications.map((n) => {
              const styles = getNotificationStyles(n.type);
              return (
                <div
                  key={n._id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-4 rounded-2xl border transition-all duration-300 flex items-start space-x-3 cursor-pointer relative ${
                    n.isRead 
                      ? 'bg-white hover:bg-slate-50/50 border-slate-100 shadow-sm shadow-slate-100/20' 
                      : `${styles.bgClass} border-transparent shadow-sm shadow-indigo-100/10`
                  }`}
                >
                  {/* Read status dot */}
                  {!n.isRead && (
                    <span className={`absolute top-4 right-4 w-2 h-2 rounded-full ${styles.dotClass}`} />
                  )}

                  {/* Icon Box */}
                  <div className={`p-2.5 rounded-xl border flex items-center justify-center ${styles.badgeClass}`}>
                    {styles.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-1.5 pr-2">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xs font-black tracking-wide uppercase ${
                        n.isRead ? 'text-slate-500' : 'text-slate-800'
                      }`}>
                        {n.title}
                      </h4>
                    </div>
                    
                    <p className={`text-[13px] leading-relaxed font-bold ${
                      n.isRead ? 'text-slate-400' : 'text-slate-700'
                    }`}>
                      {n.message}
                    </p>

                    <div className="flex items-center space-x-1 text-[10px] font-bold text-slate-400">
                      <Clock size={10} className="stroke-[2.5]" />
                      <span>{formatTimeAgo(n.createdAt)}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          {hasNextPage && (
            <div ref={sentinelRef} className="flex justify-center py-4">
              <Loader2 className="animate-spin text-indigo-650" size={20} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
