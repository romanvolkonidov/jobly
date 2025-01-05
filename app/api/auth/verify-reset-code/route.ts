import { hash } from 'bcryptjs';
import { prisma } from '@/src/lib/prisma';
import { NextResponse } from 'next/server';



export async function POST(req: Request) {
  try {
    const { code, newPassword } = await req.json();

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: code,
        resetPasswordExpires: { gt: new Date() },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired code' },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        emailVerified: true  // Add this line
      },
    });

    return NextResponse.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset verification error:', error);
    return NextResponse.json(
      { error: 'Password reset failed' },
      { status: 500 }
    );
  }
}
