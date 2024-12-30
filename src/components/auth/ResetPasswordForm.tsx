// src/components/auth/ResetPasswordForm.tsx

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authStyles } from '@/src/styles/auth.styles'
import { Card } from '@/src/components/ui/Card';

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

// src/components/auth/ResetPasswordForm.tsx
// Update the handleSubmit function:

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (newPassword !== confirmPassword) {
    setStatus('error');
    setMessage('Passwords do not match');
    return;
  }

  setStatus('loading');

  try {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (!csrfToken) {
      throw new Error('CSRF token not found');
    }

    // Reset password
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-csrf-token': csrfToken
      },
      body: JSON.stringify({ token, newPassword })
    });

    const data = await response.json();
    setMessage(data.message);
    
    if (response.ok) {
      setStatus('success');
      // Send confirmation email
      await fetch('/api/auth/send-reset-confirmation', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken
        },
        body: JSON.stringify({ token })
      });
      
      // Show success message briefly before redirect
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } else {
      setStatus('error');
    }
  } catch  {
    setStatus('error');
    setMessage('An error occurred. Please try again.');
  }
};

  return (
    <div className={authStyles.container}>
      <Card className={authStyles.wrapper}>
        <div className={authStyles.formContainer}>
          <h1 className={authStyles.title}>Reset Your Password</h1>
          
          <form onSubmit={handleSubmit} className={authStyles.form}>
            <div>
              <label htmlFor="newPassword" className={authStyles.label}>
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={authStyles.input}
                required
                minLength={8}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className={authStyles.label}>
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={authStyles.input}
                required
                minLength={8}
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
              {status === 'loading' ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </Card>
    </div>
  )
}