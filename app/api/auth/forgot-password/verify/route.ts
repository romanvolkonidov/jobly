import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { generateResetToken } from '@/src/utils/password.utils';
import { rateLimiterMiddleware } from '@/src/middleware/rateLimiter';
import { csrfProtection } from '@/src/middleware/csrf';

export const POST = rateLimiterMiddleware(
  csrfProtection(async (req: Request) => {
    try {
      const { email } = await req.json();
      console.log('Email verification started:', email);

      const user = await prisma.user.findUnique({
        where: { email },
        select: { email: true },
      });

      if (!user) {
        return NextResponse.json(
          { message: 'If an account exists, a reset link will be sent.' },
          { status: 200 }
        );
      }

      const resetToken = generateResetToken();
      const resetTokenExpiry = new Date(Date.now() + 3600000);

      await prisma.user.update({
        where: { email },
        data: { resetToken, resetTokenExpiry },
      });

      return NextResponse.json(
        {
          success: true,
          resetToken,
          message: 'If an account exists, a reset link will be sent.',
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Verification error:', error);
      return NextResponse.json(
        { message: 'Error processing request' },
        { status: 500 }
      );
    }
  })
);
