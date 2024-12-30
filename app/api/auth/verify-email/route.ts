// app/api/auth/verify-email/route.ts

import { prisma } from '@/src/lib/prisma';
import { rateLimiterMiddleware } from '@/src/middleware/rateLimiter';
import { csrfProtection } from '@/src/middleware/csrf';
import { NextResponse } from 'next/server';

export const POST = rateLimiterMiddleware(
  csrfProtection(async (req: Request) => {
    try {
      const { token } = await req.json();

      const user = await prisma.user.findUnique({
        where: { verificationToken: token }
      });

      if (!user) {
        return NextResponse.json(
          { error: 'Invalid verification token' },
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
        message: 'Email verified successfully'
      });

    } catch (error) {
      console.error('Email verification error:', error);
      return NextResponse.json(
        { error: 'Verification failed' },
        { status: 500 }
      );
    }
  })
);