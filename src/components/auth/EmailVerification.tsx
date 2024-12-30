// src/components/auth/EmailVerification.tsx
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function EmailVerification() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>(
    'verifying'
  );
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
        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (res.ok) {
          setStatus('success');
          setTimeout(() => router.push('/login'), 3000);
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    };

    verifyEmail();
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {status === 'verifying' && <p>Verifying your email...</p>}
      {status === 'success' && <p>Email verified! Redirecting to login...</p>}
      {status === 'error' && <p>Verification failed. Please try again.</p>}
    </div>
  );
}
