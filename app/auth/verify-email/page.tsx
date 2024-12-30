// app/auth/verify-email/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyEmail() {
 const router = useRouter();
 const params = useSearchParams();
 const [status, setStatus] = useState('verifying');

 useEffect(() => {
   async function verifyEmail() {
     const token = params.get('token');
     
     try {
       const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
       if (!csrfToken) throw new Error('CSRF token missing');

       const res = await fetch('/api/auth/verify-email', {
         method: 'POST',
         headers: { 
           'Content-Type': 'application/json',
           'x-csrf-token': csrfToken
         },
         body: JSON.stringify({ token })
       });

       if (!res.ok) throw new Error('Verification failed');

       // Auto login after verification
       const loginRes = await fetch('/api/auth/auto-login', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'x-csrf-token': csrfToken
         },
         body: JSON.stringify({ token })
       });

       if (loginRes.ok) {
         setStatus('success');
         router.push('/dashboard');
       } else {
         throw new Error('Auto-login failed');
       }
     } catch (error) {
       console.error('Verification error:', error);
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
       {status === 'error' && (
         <div>
           <h2>Verification failed</h2>
           <p>Verification failed. Please try again.</p>
        </div>
       )}
     </div>
   </div>
 );
}