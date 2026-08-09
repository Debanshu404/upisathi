import React, { createContext, useState, useEffect, useContext } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { userContext } from './UserContext';
import { socketContext } from './SocketContext';
import { 
  useNotificationsQuery, 
  useUnreadNotificationCount,
  useMarkNotificationRead, 
  useMarkAllNotificationsRead, 
  useClearAllNotifications 
} from '../hooks/useNotifications';

export const notificationContext = createContext();

export function NotificationProvider({ children }) {
  const { user } = useContext(userContext);
  const { socket } = useContext(socketContext);
  const queryClient = useQueryClient();
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Query notifications
  const { 
    data: rawNotifications, 
    isLoading: loading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useNotificationsQuery({
    enabled: !!user,
  });

  // Query unread count from server
  const { data: rawUnreadCount } = useUnreadNotificationCount({
    enabled: !!user,
  });

  const notifications = rawNotifications?.pages
    ? rawNotifications.pages.flatMap(page => page?.data?.notifications || page?.notifications || [])
    : [];
  const unreadCount = rawUnreadCount?.data?.unreadCounter ?? rawUnreadCount?.unreadCounter ?? 0;

  // Mutations
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();
  const clearMutation = useClearAllNotifications();

  const markNotificationRead = (id) => markReadMutation.mutate(id);
  const markAllNotificationsRead = () => markAllReadMutation.mutate();
  const clearAllNotifications = () => clearMutation.mutate();

  const toggleDrawer = () => {
    setIsDrawerOpen(prev => !prev);
  };

  // Reset UI drawer state on logout
  useEffect(() => {
    if (!user) {
      setIsDrawerOpen(false);
    }
  }, [user]);

  // Listen to socket events for real-time notification sync
  useEffect(() => {
    if (!user || !socket?.current) return;

    const handleSocketNotificationUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount'] });
    };

    const s = socket.current;
    s.on('newMatch', handleSocketNotificationUpdate);
    s.on('confirmMatch', handleSocketNotificationUpdate);
    s.on('rejectMatch', handleSocketNotificationUpdate);
    s.on('completeMatch', handleSocketNotificationUpdate);
    s.on('cancelActiveMatch', handleSocketNotificationUpdate);

    return () => {
      s.off('newMatch', handleSocketNotificationUpdate);
      s.off('confirmMatch', handleSocketNotificationUpdate);
      s.off('rejectMatch', handleSocketNotificationUpdate);
      s.off('completeMatch', handleSocketNotificationUpdate);
      s.off('cancelActiveMatch', handleSocketNotificationUpdate);
    };
  }, [user, socket, queryClient]);

  return (
    <notificationContext.Provider value={{
      notifications,
      unreadCount,
      isDrawerOpen,
      setIsDrawerOpen,
      loading,
      fetchNotifications: () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount'] });
      },
      markNotificationRead,
      markAllNotificationsRead,
      clearAllNotifications,
      toggleDrawer,
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage
    }}>
      {children}
    </notificationContext.Provider>
  );
}
