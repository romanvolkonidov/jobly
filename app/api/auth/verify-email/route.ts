// app/api/auth/verify-email/route.ts
//this is the file that is reponsible for handling the email verification process
import { prisma } from '@/src/lib/prisma';
import { rateLimiterMiddleware } from '@/src/middleware/rateLimiter';
import { csrfProtection } from '@/src/middleware/csrf';
import { NextResponse } from 'next/server';

// app/api/auth/verify-email/route.ts
export const POST = rateLimiterMiddleware(
  csrfProtection(async (req: Request) => {
    try {
      const { token } = await req.json();
      console.log("Verification token:", token); // Add logging

      const user = await prisma.user.findUnique({
        where: { verificationToken: token }
      });
      console.log("User found:", !!user); // Add logging

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
      console.log("User verified successfully"); // Add logging

      return NextResponse.json({ 
        success: true,
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