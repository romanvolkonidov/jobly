'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { TaskCard } from '@/src/components/tasks/TaskCard';
import { TaskModal } from '@/src/components/tasks/TaskModal';
import { Task } from '@/src/types/task';
import { useSession } from 'next-auth/react';

// src/types/task.ts
export interface Bid {
  id: string;
  amount: number;
  proposal: string;
  status: string;
  createdAt: string;
}

interface TasksResponse {
  tasks: Task[];
}

export default function ProjectsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'client' | 'worker'>('client');
  const [viewType, setViewType] = useState<'current' | 'archived'>('current');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['userTasks', activeTab, viewType],
    queryFn: async () => {
      const response = await fetch(`/api/tasks/user/${activeTab}?status=${viewType === 'current' ? 'open' : 'archived'}`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      return response.json() as Promise<TasksResponse>;
    },
    refetchInterval: 5000, // Refetch every 5 seconds
    staleTime: 3000, // Consider data stale after 3 seconds
  });

  const archiveMutation = useMutation({
    mutationFn: async (taskId: string) => {
      try {
        const response = await fetch(`/api/tasks/${taskId}/archive`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ taskId })
        });
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          throw new Error('API endpoint not found');
        }

        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          throw new Error('Invalid server response format');
        }
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to archive task');
        }
        
        return data;
      } catch (error) {
        console.error('Archive error:', error);
        throw error;
      }
    },
    onMutate: async (taskId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['userTasks'] });

      // Get snapshots of both current and archived tasks
      const previousCurrent = queryClient.getQueryData(['userTasks', activeTab, 'current']) as TasksResponse;
      const previousArchived = queryClient.getQueryData(['userTasks', activeTab, 'archived']) as TasksResponse;

      // Find the task to be archived
      const taskToArchive = previousCurrent?.tasks?.find(task => task.id === taskId);
      
      if (taskToArchive) {
        // Update current tasks - remove the archived task
        queryClient.setQueryData(['userTasks', activeTab, 'current'], {
          tasks: previousCurrent.tasks.filter(task => task.id !== taskId)
        });

        // Update archived tasks - add the archived task
        const archivedTasks = previousArchived?.tasks || [];
        queryClient.setQueryData(['userTasks', activeTab, 'archived'], {
          tasks: [...archivedTasks, { ...taskToArchive, status: 'archived' }]
        });
      }

      return { previousCurrent, previousArchived };
    },
    onError: (err, taskId, context) => {
      // Restore both lists to their previous state
      if (context?.previousCurrent) {
        queryClient.setQueryData(['userTasks', activeTab, 'current'], context.previousCurrent);
      }
      if (context?.previousArchived) {
        queryClient.setQueryData(['userTasks', activeTab, 'archived'], context.previousArchived);
      }
      toast.error(err instanceof Error ? err.message : 'Failed to archive task. Please try again.');
    },
    onSuccess: (data) => {
      toast.success('Task archived successfully');
      // Invalidate both current and archived queries to ensure consistency
      queryClient.invalidateQueries({ 
        queryKey: ['userTasks', activeTab] 
      });
    }
  });

  const addTaskMutation = useMutation({
    mutationFn: async (newTask: Partial<Task>) => {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      if (!response.ok) throw new Error('Failed to add task');
      return response.json();
    },
    onMutate: async (newTask) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: ['userTasks', activeTab, viewType] 
      });

      // Get current data
      const previousData = queryClient.getQueryData(['userTasks', activeTab, viewType]) as TasksResponse;

      // Create optimistic task
      const optimisticTask = {
        ...newTask,
        id: 'temp-' + Date.now(), // Temporary ID
        createdAt: new Date().toISOString(),
        status: 'open',
        bids: [],
      };

      // Update the cache with optimistic data
      queryClient.setQueryData(['userTasks', activeTab, viewType], {
        tasks: previousData ? [optimisticTask, ...previousData.tasks] : [optimisticTask]
      });

      return { previousData };
    },
    onError: (err, newTask, context) => {
      // Revert on error
      if (context?.previousData) {
        queryClient.setQueryData(
          ['userTasks', activeTab, viewType],
          context.previousData
        );
      }
      toast.error('Failed to add task');
    },
    onSuccess: (data) => {
      // Update the cache with the real data
      queryClient.setQueryData(['userTasks', activeTab, viewType], (old: TasksResponse | undefined) => {
        if (!old) return { tasks: [data] };
        return {
          tasks: [
            data,
            ...old.tasks.filter(task => task.id !== 'temp-' + Date.now())
          ]
        };
      });
      toast.success('Task added successfully');
    }
  });

  const handleArchive = (taskId: string) => {
    archiveMutation.mutate(taskId);
    setSelectedTask(null);
  };

  const handleAddTask = () => {
    if (!session?.user) {
      toast.error('You must be logged in to create a task');
      return;
    }

    const newTask: Partial<Task> = {
      title: 'New Task Title',
      description: 'New Task Description',
      budget: 1000,
      type: 'task',
      status: 'open',
      postedAs: 'individual',
      createdBy: {
        id: session.user.id,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        imageUrl: session.user.image || undefined
      },
      company: null,
      bids: [],
    };

    addTaskMutation.mutate(newTask);
  };

  if (error) {
    toast.error(error instanceof Error ? error.message : 'Failed to load tasks');
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 gap-2">
          {['client', 'worker'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as 'client' | 'worker')}
              className={`py-4 px-6 rounded-lg text-lg font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              I&apos;m a {tab === 'client' ? 'Client' : 'Worker'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'client' && (
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setViewType('current')}
            className={`px-4 py-2 rounded ${
              viewType === 'current' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            Current
          </button>
          <button
            onClick={() => setViewType('archived')}
            className={`px-4 py-2 rounded ${
              viewType === 'archived' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            Archived
          </button>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-semibold mb-6">
          {activeTab === 'client' 
            ? `Your ${viewType === 'current' ? 'Current' : 'Archived'} Tasks (${data?.tasks?.length || 0})`
            : `Tasks you've responded to (${viewType === 'current' ? 'Current' : 'Archived'})`
          }
        </h2>
        
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {data?.tasks?.map((task: Task) => (
              <TaskCard
                key={task.id}
                task={task}
                isClientView={activeTab === 'client'}
                onClick={() => setSelectedTask(task)}
                onArchive={() => handleArchive(task.id)}
              />
            ))}
            {(!data?.tasks || data.tasks.length === 0) && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <p className="text-gray-500">
                  {activeTab === 'client' 
                    ? `No ${viewType} tasks`
                    : `No ${viewType} responses`
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          isWorkerView={activeTab === 'worker'}
          onClose={() => setSelectedTask(null)}
          onArchive={handleArchive}
        />
      )}

    </div>
  );
}