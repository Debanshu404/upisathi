import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyRequests, getPublicRequests, createRequest, cancelRequest } from '../services/api';

export function useMyRequests(options = {}) {
  return useInfiniteQuery({
    queryKey: ['myRequests'],
    queryFn: ({ pageParam }) => getMyRequests(pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      const resData = lastPage?.data || lastPage;
      return resData?.hasMore ? resData?.nextCursor : undefined;
    },
    ...options,
  });
}

export function usePublicRequests(lng, lat, radius = 5, options = {}) {
  return useQuery({
    queryKey: ['publicRequests', lng, lat, radius],
    queryFn: () => getPublicRequests(lng, lat, radius),
    enabled: !!lng && !!lat,
    ...options,
  });
}

export function useCreateRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => createRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myRequests'] });
      queryClient.invalidateQueries({ queryKey: ['publicRequests'] });
    },
  });
}

export function useCancelRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId) => cancelRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myRequests'] });
      queryClient.invalidateQueries({ queryKey: ['publicRequests'] });
    },
  });
}
