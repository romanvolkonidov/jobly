'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TaskDetailsPage() {
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleContinue = () => {
    if (!description.trim()) {
      setError('Please describe your task');
      return;
    }

    // Store details in localStorage
    const taskData = JSON.parse(localStorage.getItem('taskData') || '{}');
    localStorage.setItem('taskData', JSON.stringify({
      ...taskData,
      description
    }));

    // Navigate to budget page
    router.push('/create-task/budget');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold mb-4">Specify the Details</h1>
        
        <p className="text-gray-600 mb-6">
          This will help workers better understand what needs to be done
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setError('');
            }}
            className={`w-full p-4 border rounded-lg min-h-[200px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
              ${error ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Describe your task in detail. Include all important information that workers should know."
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => router.back()}
            className="flex-1 py-3 px-6 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          
          <button 
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}