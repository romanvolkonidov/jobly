// app/api/auth/verify-code/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    
    const user = await prisma.user.findFirst({
      where: {
        verificationCode: code,
        verificationCodeExpires: { gt: new Date() },
        emailVerified: false
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired code' },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationCode: null,
        verificationCodeExpires: null
      }
    });

    return NextResponse.json({ message: 'Email verified successfully' });
  } catch  {
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}