// src/components/auth/AuthForm.tsx

'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/src/components/ui/Card';
import Link from 'next/link';

interface FormData {
  name: string;
  email: string;
  password: string;
}

interface AuthFormProps {
  defaultView: 'login' | 'register';
}

export default function AuthForm({ defaultView }: AuthFormProps) {
  const router = useRouter();
  const [formType, setFormType] = useState<'login' | 'register'>(defaultView);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setMessage('');

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      if (!csrfToken) throw new Error('CSRF token not found');

      const response = await fetch(`/api/auth/${formType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      if (formType === 'register') {
        setMessageType('success');
        setMessage('Please check your email to verify your account');
      } else {
        router.push('/');
      }
    } catch (error) {
      setMessageType('error');
      setMessage(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }, [formType, formData, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <div className="p-6 space-y-4">
          <h1 className="text-2xl font-bold text-center">
            {formType === 'register' ? 'Create Account' : 'Welcome Back'}
          </h1>

          {message && (
            <div className={`p-4 rounded-md ${
              messageType === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {formType === 'register' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  disabled={loading}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                disabled={loading}
              />
            </div>

            {formType === 'login' && (
              <div className="text-right">
                <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                  Forgot password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading 
                ? 'Please wait...' 
                : formType === 'register' 
                  ? 'Create Account' 
                  : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            {formType === 'register' 
              ? 'Already have an account?' 
              : "Don't have an account?"}{' '}
            <button
              onClick={() => {
                if (loading) return;
                setFormType(formType === 'register' ? 'login' : 'register');
                setMessage('');
                setMessageType(null);
                setFormData({ name: '', email: '', password: '' });
              }}
              className="text-blue-600 hover:text-blue-500"
              disabled={loading}
            >
              {formType === 'register' ? 'Sign In' : 'Create One'}
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}