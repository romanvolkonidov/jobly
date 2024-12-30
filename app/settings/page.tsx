// app/settings/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/src/components/ui/Card';

export default function SettingsPage() {
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('/api/profile/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        router.push('/auth/logout');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>

        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete Account
          </button>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure? This cannot be undone.
            </p>
            <div className="space-x-4">
              <button
                onClick={handleDeleteAccount}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Yes, Delete My Account
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
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
