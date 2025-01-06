// app/api/auth/verify-code/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { hash } from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    
    const pendingUser = await prisma.pendingUser.findFirst({
      where: {
        verificationCode: code,
        verificationCodeExpires: { gt: new Date() }
      }
    });

    if (!pendingUser) {
      return NextResponse.json(
        { error: 'Invalid or expired code' },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(pendingUser.password, 12);

    const user = await prisma.user.create({
      data: {
        email: pendingUser.email,
        firstName: pendingUser.firstName,
        lastName: pendingUser.lastName,
        password: hashedPassword,
        emailVerified: true
      }
    });

    await prisma.pendingUser.delete({
      where: { id: pendingUser.id }
    });

    return NextResponse.json({ 
      message: 'Email verified successfully',
      email: user.email,
      password: pendingUser.password // Unhashed password for initial login
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}