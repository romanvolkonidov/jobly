'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { TaskCard } from '@/src/components/tasks/TaskCard';
import { TaskModal } from '@/src/components/tasks/TaskModal';

interface Bid {
  id: string;
  amount: number;
  proposal: string;
  status: string;
  createdAt: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: string;
  createdAt: string;
  bids: Bid[];
  createdBy: {
    firstName: string;
    lastName: string;
  };
}

interface TasksResponse {
  tasks: Task[];
}

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState<'client' | 'worker'>('client');
  const [viewType, setViewType] = useState<'current' | 'archived'>('current');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['userTasks', activeTab, viewType],
    queryFn: async () => {
      const response = await fetch(`/api/tasks/user/${activeTab}?status=${viewType === 'current' ? 'open' : 'archived'}`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      return response.json() as Promise<TasksResponse>;
    }
  });

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
        />
      )}
    </div>
  );
}