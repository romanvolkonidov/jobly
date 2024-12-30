// app/auth/verify-email/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyEmail() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    async function verifyEmail() {
      const token = params.get('token');
      
      try {
        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });

        if (res.ok) {
          setStatus('success');
          setTimeout(() => router.push('/dashboard'), 2000);
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    }

    verifyEmail();
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md">
        {status === 'verifying' && <h2>Verifying your email...</h2>}
        {status === 'success' && <h2>Email verified! Redirecting to dashboard...</h2>}
        {status === 'error' && <h2>Verification failed. Please try again.</h2>}
      </div>
    </div>
  );
}