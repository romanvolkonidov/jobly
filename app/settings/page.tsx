// app/settings/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/src/components/ui/Card';
import { signOut, useSession } from "next-auth/react";
import { useToast } from "@/src/components/ui/use-toast"

function SettingsContent() {
  const { toast } = useToast();

  const { status } = useSession();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/auth/login');
    }
  }, [status, router]);

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      
      // Get CSRF token
      const csrfResponse = await fetch('/api/csrf');
      const { token } = await csrfResponse.json();
      
      const response = await fetch('/api/profile/delete', {
        method: 'DELETE',
        headers: {
          'x-csrf-token': token,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete account');
      }

      await signOut({ callbackUrl: '/auth/login' });
      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to delete account',
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>

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
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-gray-600">Loading settings...</div>
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}