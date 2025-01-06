'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import AuthModal from '@/src/components/common/modals/AuthModal';

export default function BudgetPage() {
  const [budget, setBudget] = useState('');
  const [needsBusinessDoc, setNeedsBusinessDoc] = useState(false);
  const [error, setError] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleContinue = async () => {
    if (!session) {
      setShowAuthModal(true);
      return;
    }

    try {
      if (!budget) {
        setError('Please enter a budget');
        return;
      }

      const taskData = JSON.parse(localStorage.getItem('taskData') || '{}');
      
      const response = await fetch('/api/tasks/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...taskData,
          budget: Number(budget),
          needsBusinessDoc,
          status: 'open'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      router.push('/projects');
    } catch (error) {
      console.error('Error saving task:', error);
      setError('Something went wrong. Please try again.');
    }
  };

  const handleLogin = () => {
    router.push('/api/auth/signin');
  };

  const handleSignup = () => {
    router.push('/api/auth/signin');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold mb-4">What&apos;s your budget?</h1>
        
        <p className="text-gray-600 mb-8">
          Specify an approximate budget. The final cost can be discussed with the worker.
        </p>

        <div className="mb-8">
          <div className="relative w-full max-w-md mx-auto">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-semibold pl-4">
              Up to
            </span>
            <input
              type="number"
              value={budget}
              onChange={(e) => {
                setBudget(e.target.value);
                setError('');
              }}
              className="w-full pl-20 pr-12 py-4 text-2xl font-semibold border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
              min="0"
            />
            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-2xl font-semibold pr-4">
              KES
            </span>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
          )}
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              Payment is made directly to the worker. You&apos;ll discuss payment terms and method with them.
            </p>
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="businessDoc"
              checked={needsBusinessDoc}
              onChange={(e) => setNeedsBusinessDoc(e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="businessDoc" className="text-gray-600">
              Only registered businesses or self-employed professionals can respond. You&apos;ll pay to their business account and receive official documentation.
            </label>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button 
            onClick={() => router.back()}
            className="flex-1 py-3 px-6 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          
          <button 
            onClick={handleContinue}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />
    </div>
  );
}