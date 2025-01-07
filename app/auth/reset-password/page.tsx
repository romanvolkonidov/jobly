'use client';

import { Suspense } from 'react';
import ResetPasswordForm from '@/src/components/auth/ResetPasswordForm';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  if (!token) {
    toast.error('Invalid reset link. Please request a new password reset.');
    return <div className="text-center p-4">Please request a new password reset.</div>;
  }

  return <ResetPasswordForm token={token} />;
}

export default function ResetPasswordPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-pulse">Loading...</div>
        </div>
      }
    >
      <ResetPassword />
    </Suspense>
  );
}