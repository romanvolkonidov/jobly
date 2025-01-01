// app/api/auth/forgot-password/route.ts
//this is the file that is reponsible for handling the password reset process
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { sendEmail } from '@/src/utils/email.utils';
import { generateResetToken } from '@/src/utils/password.utils';
import { rateLimiterMiddleware } from '@/src/middleware/rateLimiter';
import { csrfProtection } from '@/src/middleware/csrf'


export const POST = rateLimiterMiddleware(
  csrfProtection(async (req: Request) => {
    try {
      console.log('Starting password reset request');
      const { email } = await req.json();
      console.log('Email received:', email);
      
      
      const user = await prisma.user.findUnique({ 
        where: { email },
        select: { email: true }
      });
      
      if (!user) {
        return NextResponse.json(
          { message: 'If an account exists, a reset link has been sent.' },
          { status: 200 }
        );
      }

      const resetToken = generateResetToken();
      const resetTokenExpiry = new Date(Date.now() + 3600000);
      console.log('3. Generated reset token:', resetToken);

      await prisma.user.update({
        where: { email },
        data: { resetToken, resetTokenExpiry },
      });
      console.log('4. Updated user with reset token');

      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;
      console.log('5. Reset URL:', resetUrl);

      try {
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
        console.log('6. Reset email sent successfully');
      } catch (emailError) {
        console.error('7. Email sending failed:', emailError);
        throw emailError;
      }

      return NextResponse.json(
        { message: 'If an account exists, a reset link has been sent.' },
        { status: 200 }
      );
    } catch (error) {
      console.error('8. Password reset error:', error);
      return NextResponse.json(
        { message: 'Error processing request' },
        { status: 500 }
      );
    }
  })
);