// app/api/auth/reset-password/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { sendResetCode } from '@/src/utils/email.utils';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'If an account exists, a reset code has been sent' },
        { status: 200 }
      );
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetExpires = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetCode,
        resetPasswordExpires: resetExpires
      }
    });

    await sendResetCode(email, resetCode);

    return NextResponse.json({ 
      message: 'If an account exists, a reset code has been sent' 
    });
  } catch (error) {
    console.error('Reset request error:', error);
    return NextResponse.json(
      { error: 'Failed to process reset request' },
      { status: 500 }
    );
  }
}