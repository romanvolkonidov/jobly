'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

export default function EmailVerification() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token');
        
        if (!token) {
          toast.error('Invalid verification link');
          router.push('/auth/login');
          return;
        }

        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });

        if (res.ok) {
          toast.success('Email verified successfully!');
          setTimeout(() => router.push('/auth/login'), 2000);
        } else {
          const data = await res.json();
          toast.error(data.error || 'Verification failed');
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Verification error:', error);
        toast.error('Verification failed. Please try again.');
        router.push('/auth/login');
      }
    };

    verifyEmail();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-gray-600">
        Verifying your email...
      </div>
    </div>
  );
}