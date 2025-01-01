//app/tasks/[taskId]/page.tsx
//this file works in the following way: 
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Eye, Calendar, Tag, X } from 'lucide-react';
import TaskResponseConfirmation from '@/src/components/common/modals/TaskResponseConfirmation';

interface Task {
  id: string;
  title: string;
  description: string;
  budget: number;
  views: number;
  createdAt: string;
  category: string;
  subcategory: string;
}

export default function TaskDetailsPage() {
  const params = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (amount: number) => amount.toLocaleString('en-US');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`/api/tasks/${params.taskId}`);
        const data = await response.json();
        setTask(data);
      } catch (error) {
        console.error('Error fetching task:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.taskId) {
      fetchTask();
    }
  }, [params.taskId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch(`/api/tasks/${params.taskId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: Number(price),
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit response');
      }

      setIsModalOpen(false);
      setPrice('');
      setMessage('');
      setShowConfirmation(true);
    } catch (error) {
      setError('Failed to submit your response. Please try again later.');
      console.error('Error submitting response:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p>Loading task...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p>Task not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">{task.title}</h1>
            <span className="text-lg font-medium text-primary-blue">
              up to {formatCurrency(task.budget)} KES
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{task.views} views</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Tag className="w-4 h-4" />
              <span>{task.subcategory}</span>
            </div>
          </div>

          <div className="border-t border-b border-gray-200 py-6 mb-6">
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">
                {task.description || 'No description provided for this task.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-primary-blue text-white py-4 px-6 rounded-lg font-medium hover:bg-primary-blue/90 transition-colors"
          >
            Reply to this task
          </button>
        </div>
      </div>

      {/* Response Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          role="dialog"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div className="bg-white rounded-lg w-full max-w-xl mx-4">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 id="modal-title" className="text-xl font-semibold text-gray-900">{task.title}</h2>
                  <p id="modal-description" className="text-sm text-gray-600 mt-1">
                    Client offers up to {formatCurrency(task.budget)} KES
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block font-medium mb-2">Suggest your price</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="Enter amount"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 leading-none">
                      KES
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    If you request less than {formatCurrency(task.budget)} KES, you&apos;ll have better chances of getting the job.
                  </p>
                </div>

                <div>
                  <label className="block font-medium mb-2">Your message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg h-32 resize-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                    placeholder="Describe your experience and explain why you should be chosen for this task"
                  />
                </div>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <button
                  type="submit"
                  className="w-full bg-primary-blue text-white py-4 px-6 rounded-lg font-medium hover:bg-primary-blue/90 transition-colors"
                >
                  Send Response
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <TaskResponseConfirmation
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
      />
    </div>
  );
}
