// src/components/auth/ForgotPasswordForm.tsx

import { useState } from 'react';
import { Card } from '@/src/components/ui/Card';
import Link from 'next/link';
import { authStyles } from '@/src/styles/auth.styles';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      if (!csrfToken) {
        throw new Error('CSRF token not found');
      }

      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      setMessage(data.message);
      setStatus(response.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className={authStyles.container}>
      <Card className={authStyles.wrapper}>
        <div className={authStyles.formContainer}>
          <h1 className={authStyles.title}>Reset Your Password</h1>
          
          <p className={authStyles.description}>
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className={authStyles.form}>
            <div>
              <label htmlFor="email" className={authStyles.label}>
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={authStyles.input}
                required
                placeholder="Enter your email"
              />
            </div>

            {message && (
              <div className={authStyles.message(status === 'error' ? 'error' : 'success')}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className={authStyles.button}
            >
              {status === 'loading' ? 'Sending...' : 'Reset Password'}
            </button>

            <div className="text-center mt-4">
              <Link 
                href="/auth/login" 
                className={authStyles.link}
              >
                Back to Sign In
              </Link>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}