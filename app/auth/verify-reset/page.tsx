// app/auth/verify-reset/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/src/components/ui/Card';
import { authStyles } from '@/src/styles/auth.styles';

export default function VerifyResetPage() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('resetEmail');
    if (!storedEmail) {
      router.push('/auth/forgot-password');
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/auth/verify-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.join(''),
          newPassword: password,
          email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Password reset successful! Redirecting to login...');
        sessionStorage.removeItem('resetEmail');
        setTimeout(() => router.push('/auth/login'), 2000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Verification failed');
      }
    } catch {
      setStatus('error');
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className={authStyles.container}>
      <Card className={authStyles.wrapper}>
        <div className={authStyles.formContainer}>
          <h1 className={authStyles.title}>Verify Reset Code</h1>

          <form onSubmit={handleSubmit} className={authStyles.form}>
            <div className="mb-4">
              <label className={authStyles.label}>Enter Reset Code</label>
              <div className="flex justify-center space-x-2">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    className="w-12 h-12 text-center text-2xl border-2 rounded-md"
                  />
                ))}
              </div>
            </div>

            <div>
              <label className={authStyles.label}>New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={authStyles.input}
                required
                minLength={8}
              />
            </div>

            {message && (
              <div
                className={authStyles.message(
                  status === 'error' ? 'error' : 'success'
                )}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={
                status === 'loading' || code.join('').length !== 6 || !password
              }
              className={authStyles.button}
            >
              {status === 'loading' ? 'Verifying...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
}
