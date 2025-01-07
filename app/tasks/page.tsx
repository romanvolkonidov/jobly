// pages/projects.tsx
'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { TaskCard } from '@/src/components/tasks/TaskCard';
import { TaskModal } from '@/src/components/tasks/TaskModal';
import { useTasks } from '@/src/hooks/useTasks';
import { Task } from '@/src/types/task';

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState<'client' | 'worker'>('client');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const {   error, refetch } = useTasks();
  const { data, isLoading } = useTasks(activeTab);
  const handleDelete = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete task');
      await refetch();
      toast.success('Task deleted successfully');
    } catch  {
      toast.error('Failed to delete task');
    }
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

      <div>
        <h2 className="text-2xl font-semibold mb-6">
          {activeTab === 'client' 
            ? `Your Tasks (${data?.tasks?.length || 0})`
            : 'Tasks you\'ve responded to'
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
                onDelete={handleDelete}
                onClick={setSelectedTask}
              />
            ))}
            {(!data?.tasks || data.tasks.length === 0) && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <p className="text-gray-500">
                  {activeTab === 'client' ? 'No tasks created yet' : 'No responses yet'}
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