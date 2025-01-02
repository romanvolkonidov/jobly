'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

function EmailVerification() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { update } = useSession();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setStatus('error');
        return;
      }

      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token })
        });

        if (!response.ok) {
          throw new Error('Verification failed');
        }

        await update();
        setStatus('success');
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } catch {
        setStatus('error');
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      }
    };

    verifyEmail();
  }, [router, searchParams, update]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {status === 'verifying' && <p>Verifying your email...</p>}
      {status === 'success' && <p>Email verified successfully! Redirecting to dashboard...</p>}
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