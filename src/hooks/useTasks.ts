// hooks/useTasks.ts
import { useQuery } from '@tanstack/react-query';

export const useTasks = (type: 'client' | 'worker') => {
  return useQuery({
    queryKey: ['userTasks', type],
    queryFn: async () => {
      const response = await fetch(`/api/tasks/user/${type}`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      return response.json();
    },
    retry: 1,
    staleTime: 5000
  });
};