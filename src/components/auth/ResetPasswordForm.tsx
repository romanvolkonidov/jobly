import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authStyles } from '@/src/styles/auth.styles'
import { Card } from '@/src/components/ui/Card';
import toast from 'react-hot-toast';

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

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
      
      if (response.ok) {
        toast.success('Password reset successfully!');
        
        // Send confirmation email
        await fetch('/api/auth/send-reset-confirmation', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-csrf-token': csrfToken
          },
          body: JSON.stringify({ token })
        });
        
        // Redirect after showing success message
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        throw new Error(data.error || 'Failed to reset password');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
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

            <button
              type="submit"
              disabled={loading}
              className={authStyles.button}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </Card>
    </div>
  )
}