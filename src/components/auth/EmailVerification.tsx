// src/components/auth/EmailVerification.tsx
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// src/components/auth/EmailVerification.tsx
export default function EmailVerification() {
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

        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-csrf-token': csrfToken
          },
          body: JSON.stringify({ token }),
        });

        if (res.ok) {
          setStatus('success');
          await fetch('/api/auth/auto-login', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'x-csrf-token': csrfToken
            },
            body: JSON.stringify({ token }),
          });
          setTimeout(() => router.push('/'), 2000);
        } else {
          setStatus('error');
          setTimeout(() => router.push('/auth/login'), 2000);
        }
      } catch {
        setStatus('error');
        setTimeout(() => router.push('/auth/login'), 2000);
      }
    };

    verifyEmail();
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {status === 'verifying' && <p>Verifying your email...</p>}
      {status === 'success' && <p>Email verified! Redirecting to home...</p>}
      {status === 'error' && <p>Verification failed. Redirecting to login...</p>}
    </div>
  );
}