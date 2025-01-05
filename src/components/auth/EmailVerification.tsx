'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function EmailVerification() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token');
        
        if (!token) {
          setStatus('error');
          return;
        }

        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });

        if (res.ok) {
          setStatus('success');
          setTimeout(() => router.push('/auth/login'), 2000);
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
      }
    };

    verifyEmail();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {status === 'verifying' && <p>Verifying your email...</p>}
      {status === 'success' && (
        <div className="text-center">
          <p className="text-green-600">Email verified successfully!</p>
          <p>Redirecting to login...</p>
        </div>
      )}
      {status === 'error' && (
        <div className="text-center">
          <p className="text-red-600">Verification failed</p>
          <button 
            onClick={() => router.push('/auth/login')}
            className="mt-4 text-blue-600 hover:underline"
          >
            Return to login
          </button>
        </div>
      )}
    </div>
  );
}