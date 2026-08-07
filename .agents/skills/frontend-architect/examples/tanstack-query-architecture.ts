import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface UserFilters {
  role?: string;
  search?: string;
}

// Query Key Factory Pattern
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// API Fetchers
async function fetchUsers(filters: UserFilters): Promise<User[]> {
  const params = new URLSearchParams(filters as Record<string, string>);
  const res = await fetch(`/api/users?${params}`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

async function updateUserRole({ id, role }: { id: string; role: 'admin' | 'user' }): Promise<User> {
  const res = await fetch(`/api/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role }),
  });
  if (!res.ok) throw new Error('Failed to update user role');
  return res.json();
}

// Custom Hooks Layer
export function useUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: () => fetchUsers(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserRole,
    onSuccess: (updatedUser) => {
      // Invalidate list queries to refetch fresh state
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      // Directly update detail cache
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
    },
  });
}
