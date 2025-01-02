import { prisma } from '@/src/lib/prisma';
import { rateLimiterMiddleware } from '@/src/middleware/rateLimiter';
import { csrfProtection } from '@/src/middleware/csrf';
import { NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/src/utils/email.utils';

export const POST = rateLimiterMiddleware(
  csrfProtection(async (req: Request) => {
    try {
      const { email, token } = await req.json();

      if (!email || !token) {
        return NextResponse.json(
          { error: 'Email and token required' },
          { status: 400 }
        );
      }

      await sendVerificationEmail(email, token);

      const user = await prisma.user.findUnique({
        where: { verificationToken: token }
      });

      if (!user) {
        return NextResponse.json(
          { error: 'Invalid token' },
          { status: 400 }
        );
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          verificationToken: null
        }
      });

      return NextResponse.json({ 
        success: true,
        message: 'Email verified successfully'
      });

    } catch (error) {
      console.error('Verification error:', error);
      return NextResponse.json(
        { error: 'Verification failed' },
        { status: 500 }
      );
    }
  })
);