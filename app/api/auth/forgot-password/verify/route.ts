// app/api/auth/forgot-password/verify/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { rateLimiterMiddleware } from '@/src/middleware/rateLimiter';
import { csrfProtection } from '@/src/middleware/csrf';

export const POST = rateLimiterMiddleware(
 csrfProtection(async (req: Request) => {
   try {
     const { token } = await req.json();
     console.log('Token verification started:', token);

     const user = await prisma.user.findFirst({
       where: {
         resetToken: token,
         resetTokenExpiry: { gt: new Date() }
       },
       select: { id: true, email: true }
     });

     if (!user) {
       return NextResponse.json(
         { valid: false, message: 'Invalid or expired token' },
         { status: 403 }
       );
     }

     return NextResponse.json({
       valid: true,
       email: user.email 
     });

   } catch (error) {
     console.error('Token verification error:', error);
     return NextResponse.json(
       { message: 'Error processing request' },
       { status: 500 }
     );
   }
 })
);