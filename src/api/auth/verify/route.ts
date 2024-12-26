import { NextResponse } from 'next/server';

// src/api/auth/verify/route.ts
export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    await prisma.user.update({
      where: { verificationToken: token },
      data: { emailVerified: true, verificationToken: null }
    });
    return NextResponse.json({ message: 'Email verified' });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
  }
}