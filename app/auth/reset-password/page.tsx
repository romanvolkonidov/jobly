// app/auth/reset-password/page.tsx
'use client';

import ResetPasswordForm from '@/src/components/auth/ResetPasswordForm';
import { useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  if (!token) {
    return <div>Invalid reset link</div>;
  }

  return <ResetPasswordForm token={token} />;
}
