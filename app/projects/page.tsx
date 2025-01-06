// app/projects/page.tsx
//this file works in the following way: it renders the projects page
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

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
export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState<'client' | 'worker'>('client');

  const { data: tasksData, isLoading, error } = useQuery({
    queryKey: ['userTasks'],
    queryFn: async () => {
      const response = await fetch('/api/tasks/user');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      return response.json();
    },
  });

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setActiveTab('client')}
            className={`py-4 px-6 rounded-lg text-lg font-medium transition-colors ${
              activeTab === 'client'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            I&apos;m a Client
          </button>
          <button
            onClick={() => setActiveTab('worker')}
            className={`py-4 px-6 rounded-lg text-lg font-medium transition-colors ${
              activeTab === 'worker'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            I&apos;m a Worker
          </button>
        </div>
      </div>

      {activeTab === 'client' ? (
        <div>
          <h2 className="text-2xl font-semibold mb-6">
            Your Tasks ({tasksData?.tasks?.length || 0})
          </h2>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              Error loading tasks
            </div>
          ) : (
            <div className="space-y-4">
              {tasksData?.tasks?.map((task: Task) => (
                <div key={task.id} className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-medium mb-2">{task.title}</h3>
                  <p className="text-gray-600 mb-4">{task.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="space-x-4">
                      <span>Budget: KES {task.budget.toLocaleString()}</span>
                      <span>Status: {task.status}</span>
                      <span>Proposals: {task.bids.length}</span>
                    </div>
                    <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {tasksData?.tasks?.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <p className="text-gray-500">No tasks created yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-6">
            Tasks you&apos;ve responded to:
          </h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-500">No responses yet</p>
          </div>
        </div>
      )}
    </div>
  );
}