// app/api/auth/auto-login/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getIronSession } from 'iron-session';
import { sessionConfig } from '@/src/middleware/session';
import type { IronSessionData } from '@/src/types/session';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const response = new Response();
    const session = await getIronSession<IronSessionData>(req, response, sessionConfig);
    session.userId = user.id;
    await session.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Auto-login error:', err);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}