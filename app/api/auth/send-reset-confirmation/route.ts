// app/api/auth/send-reset-confirmation/route.ts
//this is the file that is reponsible for sending the reset confirmation email
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { sendEmail } from '@/src/utils/email.utils';
import { rateLimiterMiddleware } from '@/src/middleware/rateLimiter';
import { csrfProtection } from '@/src/middleware/csrf';

export const POST = rateLimiterMiddleware(
  csrfProtection(async (req: Request) => {
    try {
      const { token } = await req.json();
      
      const user = await prisma.user.findFirst({
        where: { resetToken: token }
      });

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      await sendEmail({
        to: user.email,
        subject: 'Password Reset Successful',
        html: `
          <h1>Password Reset Successful</h1>
          <p>Your password has been successfully reset. If you did not make this change, please contact support immediately.</p>
          <p>You can now log in with your new password.</p>
        `
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Send reset confirmation error:', error);
      return NextResponse.json(
        { error: 'Failed to send confirmation email' },
        { status: 500 }
      );
    }
  })
);