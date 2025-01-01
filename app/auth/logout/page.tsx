// app/auth/logout/page.tsx
//this file works in the following way: it logs out the user
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function logout() {
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/auth/login');
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    logout();
  }, [router]);

  return <div>Logging out...</div>;
}
