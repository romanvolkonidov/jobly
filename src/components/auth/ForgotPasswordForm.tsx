import { useState } from 'react';
import { Card } from '@/src/components/ui/Card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authStyles } from '@/src/styles/auth.styles';
import toast from 'react-hot-toast';

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        sessionStorage.setItem('resetEmail', email);
        setTimeout(() => {
          router.push('/auth/verify-reset');
        }, 2000);
      } else {
        toast.error(data.error || 'An error occurred');
      }
    } catch {
      toast.error('An error occurred. Please try again.');
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div className={authStyles.container}>
      <Card className={authStyles.wrapper}>
        <div className={authStyles.formContainer}>
          <h1 className={authStyles.title}>Reset Your Password</h1>

          <p className={authStyles.description}>
            Enter your email address and we&apos;ll send you a verification
            code.
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

            <button
              type="submit"
              disabled={status === 'loading'}
              className={authStyles.button}
            >
              {status === 'loading' ? 'Sending...' : 'Send Reset Code'}
            </button>

            <div className="text-center mt-4">
              <Link href="/auth/login" className={authStyles.link}>
                Back to Sign In
              </Link>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}