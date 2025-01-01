//app/settings/page.tsx
//this file works in the following way: it renders the settings page
'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/src/components/ui/Card';

function SettingsContent() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Add this to your page components that require authentication
useEffect(() => {
  const checkSession = async () => {
    const res = await fetch('/api/auth/check-session');
    const data = await res.json();
    if (!data.isLoggedIn) {
      // Redirect to login
      window.location.href = '/auth/login';
    }
  };
  checkSession();
}, []);

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      
      const response = await fetch('/api/profile/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      router.push('/auth/logout');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete account');
      console.error('Error deleting account:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}

        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Delete Account
          </button>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure? This action cannot be undone. All your data will be permanently deleted.
            </p>
            <div className="space-x-4">
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-pulse text-gray-600">Loading settings...</div>
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}