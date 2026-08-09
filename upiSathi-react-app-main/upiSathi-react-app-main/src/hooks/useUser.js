import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser, loginUser, registerUser, getOthersProfile } from '../services/api';

export function useCurrentUser(options = {}) {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    ...options,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }) => loginUser(email, password),
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: ({ username, email, password }) => registerUser(username, email, password),
  });
}

export function usePublicProfile(userId, options = {}) {
  return useQuery({
    queryKey: ['publicProfile', userId],
    queryFn: () => getOthersProfile(userId),
    enabled: !!userId,
    ...options,
  });
}
