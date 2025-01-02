// src/components/auth/ForgotPasswordForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@zod/resolver';
import { z } from 'zod';
import { toast } from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Please enter a valid email')
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Step 1: Verify and generate token
      const verifyRes = await fetch('/api/auth/forgot-password/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const verifyData = await verifyRes.json();

      if (verifyData.success && verifyData.resetToken) {
        // Step 2: Send email
        await fetch('/api/auth/forgot-password/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: data.email,
            resetToken: verifyData.resetToken
          })
        });
      }

      toast.success('If an account exists, a reset link has been sent.');
    } catch  {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          {...register('email')}
          type="email"
          placeholder="Enter your email"
          disabled={isLoading}
          className="w-full p-2 border rounded"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? 'Sending...' : 'Reset Password'}
      </button>
    </form>
  );
}