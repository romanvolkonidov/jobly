// lib/email.ts - Add this function
import { sendEmail } from '@/src/utils/email.utils';

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;

  return sendEmail({
    to: email,
    subject: 'Reset your password',
    html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password:</p>
      <a 
        href="${resetUrl}" 
        style="
          background: #2563eb;
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          text-decoration: none;
          display: inline-block;
          margin: 16px 0;
        "
      >
        Reset Password
      </a>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  });
};
