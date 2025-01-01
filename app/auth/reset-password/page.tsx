// app/auth/reset-password/page.tsx
//this file works in the following way: it renders the reset password form
'use client';

import { Suspense } from 'react';
import ResetPasswordForm from '@/src/components/auth/ResetPasswordForm';
import { useSearchParams } from 'next/navigation';

function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  if (!token) {
    return <div>Invalid reset link</div>;
  }

  return <ResetPasswordForm token={token} />;
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPassword />
    </Suspense>
  );
}