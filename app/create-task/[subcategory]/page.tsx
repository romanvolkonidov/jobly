'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function CreateTaskPage() {
  const params = useParams();
  const router = useRouter();
  const subcategory = decodeURIComponent(params.subcategory as string).replace(/-/g, ' ');
  const [taskName, setTaskName] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!taskName.trim()) {
      setError('Please enter a task name');
      return;
    }
    
    // Store task data in localStorage for now
    localStorage.setItem('taskData', JSON.stringify({
      name: taskName,
      subcategory
    }));
    
    // Navigate to details page
    router.push('/create-task/details');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold mb-6">What would you like to name your task?</h1>
        
        <div className="mb-6">
          <textarea
            value={taskName}
            onChange={(e) => {
              setTaskName(e.target.value);
              setError('');
            }}
            placeholder="For example: I need someone to make braids at my home"
            className={`w-full p-4 border rounded-lg min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
              ${error ? 'border-red-500' : 'border-gray-300'}`}
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-gray-600">Selected category:</p>
          <p className="font-medium">{subcategory}</p>
        </div>

        <button 
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
}