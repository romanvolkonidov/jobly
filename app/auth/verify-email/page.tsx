//app/auth/verify-email/page.tsx
//this file works in the following way: it verifies the email of the user
'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

function EmailVerification() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setStatus('error');
        return;
      }

      try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (!csrfToken) throw new Error('CSRF token not found');

        const verifyResponse = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': csrfToken
          },
          body: JSON.stringify({ token })
        });

        if (!verifyResponse.ok) throw new Error('Verification failed');

        setStatus('success');
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);

      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      }
    };

    verifyEmail();
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {status === 'verifying' && <p>Verifying your email...</p>}
      {status === 'success' && <p>Email verified successfully! Redirecting to login...</p>}
      {status === 'error' && <p>Verification failed. Redirecting to login...</p>}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailVerification />
    </Suspense>
  );
}