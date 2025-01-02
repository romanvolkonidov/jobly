import { NextResponse } from 'next/server';
import { sendEmail } from '@/src/utils/email.utils';
import { rateLimiterMiddleware } from '@/src/middleware/rateLimiter';
import { csrfProtection } from '@/src/middleware/csrf';

export const POST = rateLimiterMiddleware(
  csrfProtection(async (req: Request) => {
    try {
      const { email, resetToken } = await req.json();
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;

      await sendEmail({
        to: email,
        subject: 'Reset Your Jobly Password',
        html: `
          <h1>Password Reset Request</h1>
          <p>Click the link below to reset your password. This link is valid for 1 hour.</p>
          <a href="${resetUrl}">Reset Password</a>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      });

      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      console.error('Email sending error:', error);
      if (error instanceof Error) {
        const smtpError = error as { response?: string };
        console.error('SMTP details:', {
          message: error.message,
          name: error.name,
          stack: error.stack,
          smtpResponse: smtpError.response,
        });
      }
      return NextResponse.json(
        { message: 'Error sending email' },
        { status: 500 }
      );
    }
  })
);
