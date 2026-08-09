import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getNotifications, 
  deleteNotifications, 
  unreadNotification, 
  unreadAllNotification,
  getUnreadNotificationCount
} from '../services/api';

export function useNotificationsQuery(options = {}) {
  return useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: ({ pageParam }) => getNotifications(pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      const resData = lastPage?.data || lastPage;
      return resData?.hasMore ? resData?.nextCursor : undefined;
    },
    ...options,
  });
}

export function useUnreadNotificationCount(options = {}) {
  return useQuery({
    queryKey: ['unreadNotificationCount'],
    queryFn: getUnreadNotificationCount,
    ...options,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => unreadNotification(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const previousNotifications = queryClient.getQueryData(['notifications']);
      
      queryClient.setQueryData(['notifications'], (old) => {
        if (!old || !old.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page) => {
            const pageData = page?.data || page;
            const notifications = pageData?.notifications || [];
            const updatedNotifications = notifications.map((n) =>
              n._id === id ? { ...n, isRead: true } : n
            );
            if (page?.data) {
              return {
                ...page,
                data: {
                  ...page.data,
                  notifications: updatedNotifications,
                },
              };
            }
            return {
              ...page,
              notifications: updatedNotifications,
            };
          }),
        };
      });

      return { previousNotifications };
    },
    onError: (err, id, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(['notifications'], context.previousNotifications);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount'] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => unreadAllNotification(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const previousNotifications = queryClient.getQueryData(['notifications']);

      queryClient.setQueryData(['notifications'], (old) => {
        if (!old || !old.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page) => {
            const pageData = page?.data || page;
            const notifications = pageData?.notifications || [];
            const updatedNotifications = notifications.map((n) => ({ ...n, isRead: true }));
            if (page?.data) {
              return {
                ...page,
                data: {
                  ...page.data,
                  notifications: updatedNotifications,
                },
              };
            }
            return {
              ...page,
              notifications: updatedNotifications,
            };
          }),
        };
      });

      return { previousNotifications };
    },
    onError: (err, variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(['notifications'], context.previousNotifications);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount'] });
    },
  });
}

export function useClearAllNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteNotifications(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const previousNotifications = queryClient.getQueryData(['notifications']);

      queryClient.setQueryData(['notifications'], (old) => {
        if (!old || !old.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page) => {
            if (page?.data) {
              return {
                ...page,
                data: {
                  ...page.data,
                  notifications: [],
                },
              };
            }
            return {
              ...page,
              notifications: [],
            };
          }),
        };
      });

      return { previousNotifications };
    },
    onError: (err, variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(['notifications'], context.previousNotifications);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount'] });
    },
  });
}
