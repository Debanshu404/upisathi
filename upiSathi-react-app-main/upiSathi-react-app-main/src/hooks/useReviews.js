import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createReview, getMyReviews, getUserReviews } from '../services/api';

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ matchId, rating, comment }) => createReview(matchId, rating, comment),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['myReviews'] });
      queryClient.invalidateQueries({ queryKey: ['userReviews'] });
      queryClient.invalidateQueries({ queryKey: ['activeMatches'] });
      queryClient.invalidateQueries({ queryKey: ['chat', variables.matchId] });
    },
  });
}

export function useMyReviews(options = {}) {
  return useInfiniteQuery({
    queryKey: ['myReviews'],
    queryFn: ({ pageParam }) => getMyReviews(pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      const resData = lastPage?.data || lastPage;
      return resData?.hasMore ? resData?.nextCursor : undefined;
    },
    ...options,
  });
}

export function useUserReviews(userId, options = {}) {
  return useInfiniteQuery({
    queryKey: ['userReviews', userId],
    queryFn: ({ pageParam }) => getUserReviews(userId, pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      const resData = lastPage?.data || lastPage;
      return resData?.hasMore ? resData?.nextCursor : undefined;
    },
    enabled: !!userId,
    ...options,
  });
}
