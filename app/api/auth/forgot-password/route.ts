import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { sendEmail } from '@/src/utils/email.utils';
import { generateResetToken } from '@/src/utils/password.utils';
import { rateLimiterMiddleware } from '@/src/middleware/rateLimiter';
import { csrfProtection } from '@/src/middleware/csrf';

export const POST = rateLimiterMiddleware(
  csrfProtection(async (req: Request) => {
    try {
      console.log('Config:', {
        RESEND_API_KEY: !!process.env.RESEND_API_KEY,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        RESEND_API_KEY_VALUE: process.env.RESEND_API_KEY?.substring(0, 5) + '...'
      });

      const { email } = await req.json();
      console.log('Processing reset for:', email);
      
      const user = await prisma.user.findUnique({ 
        where: { email },
        select: { id: true, email: true }
      });

      console.log('User found:', !!user);
      
      if (!user) {
        return NextResponse.json({ message: 'If account exists, reset link sent' }, { status: 200 });
      }

      const resetToken = generateResetToken();
      const resetTokenExpiry = new Date(Date.now() + 3600000);

      await prisma.user.update({
        where: { email },
        data: { resetToken, resetTokenExpiry },
      });

      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;

      try {
        console.log('Sending reset email...');
        const emailResult = await sendEmail({
          to: email,
          subject: 'Reset Your Password',
          html: `
            <h2>Password Reset Request</h2>
            <p>Click to reset your password (valid for 1 hour):</p>
            <a href="${resetUrl}" style="background:#2563eb;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;display:inline-block;">Reset Password</a>
          `
        });
        console.log('Email result:', emailResult);
      } catch (emailError) {
        console.error('Email send error:', emailError);
        throw emailError;
      }

      return NextResponse.json({ message: 'If account exists, reset link sent' }, { status: 200 });
    } catch (error) {
      console.error('Reset process error:', error);
      return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
    }
  })
);