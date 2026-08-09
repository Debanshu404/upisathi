import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getPendingMatches, 
  getActiveMatches, 
  acceptRequest, 
  confirmMatch, 
  rejectMatch, 
  completeMatch, 
  cancelActiveMatch,
  getChat,
  getMatchHistory,
  getCompletedCounter,
  getCancelledCounter
} from '../services/api';

export function usePendingMatches(options = {}) {
  return useQuery({
    queryKey: ['pendingMatches'],
    queryFn: getPendingMatches,
    ...options,
  });
}

export function useActiveMatches(options = {}) {
  return useQuery({
    queryKey: ['activeMatches'],
    queryFn: getActiveMatches,
    ...options,
  });
}

export function useMatchHistory(options = {}) {
  return useInfiniteQuery({
    queryKey: ['matchHistory'],
    queryFn: ({ pageParam }) => getMatchHistory(pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      const resData = lastPage?.data || lastPage;
      return resData?.hasMore ? resData?.nextCursor : undefined;
    },
    ...options,
  });
}

export function useChat(matchId, options = {}) {
  return useQuery({
    queryKey: ['chat', matchId],
    queryFn: () => getChat(matchId),
    enabled: !!matchId,
    ...options,
  });
}

export function useAcceptRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId) => acceptRequest(requestId),
    onSuccess: (data, requestId) => {
      // Optimistically update publicRequests query cache to immediately remove the accepted request
      queryClient.setQueriesData({ queryKey: ['publicRequests'] }, (oldData) => {
        if (!oldData) return oldData;
        
        if (Array.isArray(oldData)) {
          return oldData.filter(req => req._id !== requestId);
        }
        
        if (oldData.data && Array.isArray(oldData.data)) {
          return {
            ...oldData,
            data: oldData.data.filter(req => req._id !== requestId)
          };
        }
        
        return oldData;
      });

      queryClient.invalidateQueries({ queryKey: ['activeMatches'] });
      queryClient.invalidateQueries({ queryKey: ['pendingMatches'] });
      queryClient.invalidateQueries({ queryKey: ['publicRequests'] });
    },
  });
}

export function useConfirmMatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (matchId) => confirmMatch(matchId),
    onSuccess: (data, matchId) => {
      queryClient.invalidateQueries({ queryKey: ['activeMatches'] });
      queryClient.invalidateQueries({ queryKey: ['pendingMatches'] });
      queryClient.invalidateQueries({ queryKey: ['chat', matchId] });
    },
  });
}

export function useRejectMatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (matchId) => rejectMatch(matchId),
    onSuccess: (data, matchId) => {
      queryClient.invalidateQueries({ queryKey: ['activeMatches'] });
      queryClient.invalidateQueries({ queryKey: ['pendingMatches'] });
      queryClient.invalidateQueries({ queryKey: ['chat', matchId] });
    },
  });
}

export function useCompleteMatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (matchId) => completeMatch(matchId),
    onSuccess: (data, matchId) => {
      queryClient.invalidateQueries({ queryKey: ['activeMatches'] });
      queryClient.invalidateQueries({ queryKey: ['matchHistory'] });
      queryClient.invalidateQueries({ queryKey: ['myRequests'] });
      queryClient.invalidateQueries({ queryKey: ['chat', matchId] });
      queryClient.invalidateQueries({ queryKey: ['completedCounter'] });
      queryClient.invalidateQueries({ queryKey: ['cancelledCounter'] });
    },
  });
}

export function useCancelActiveMatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (matchId) => cancelActiveMatch(matchId),
    onSuccess: (data, matchId) => {
      queryClient.invalidateQueries({ queryKey: ['activeMatches'] });
      queryClient.invalidateQueries({ queryKey: ['myRequests'] });
      queryClient.invalidateQueries({ queryKey: ['chat', matchId] });
      queryClient.invalidateQueries({ queryKey: ['completedCounter'] });
      queryClient.invalidateQueries({ queryKey: ['cancelledCounter'] });
    },
  });
}

export function useCompletedCounter(options = {}) {
  return useQuery({
    queryKey: ['completedCounter'],
    queryFn: getCompletedCounter,
    ...options,
  });
}

export function useCancelledCounter(options = {}) {
  return useQuery({
    queryKey: ['cancelledCounter'],
    queryFn: getCancelledCounter,
    ...options,
  });
}
