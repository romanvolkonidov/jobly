// app/api/auth/reset-password/route.ts

import { prisma } from '@/src/lib/prisma';
import { hashPassword } from '@/src/utils/password.utils';
import { validatePassword } from '@/src/utils/validation';
import { NextResponse } from 'next/server';
import { rateLimiterMiddleware } from '@/src/middleware/rateLimiter';
import { csrfProtection } from '@/src/middleware/csrf';
import { sendEmail } from '@/src/utils/email.utils';

export const POST = rateLimiterMiddleware(
 csrfProtection(async (req: Request) => {
   try {
     const { token, newPassword } = await req.json();

     const validation = validatePassword(newPassword);
     if (!validation.isValid) {
       return NextResponse.json({ message: validation.errors[0] }, { status: 400 });
     }

     const user = await prisma.user.findFirst({
       where: {
         resetToken: token,
         resetTokenExpiry: { gt: new Date() },
       },
     });

     if (!user) {
       return NextResponse.json(
         { message: 'Invalid or expired reset token' },
         { status: 400 }
       );
     }

     const hashedPassword = await hashPassword(newPassword);

     await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
        emailVerified: true
      },
    });

     // Send confirmation email
     await sendEmail({
       to: user.email,
       subject: 'Password Reset Successful',
       html: `
         <h1>Password Reset Successful</h1>
         <p>Your password has been successfully reset. If you did not make this change, please contact support immediately.</p>
         <p>You can now log in with your new password at ${process.env.NEXT_PUBLIC_APP_URL}/auth/login</p>
       `
     });

     return NextResponse.json(
       { message: 'Password successfully reset' },
       { status: 200 }
     );
     
   } catch (error) {
     console.error('Reset password error:', error);
     return NextResponse.json(
       { message: 'Error resetting password' },
       { status: 500 }
     );
   }
 })
);