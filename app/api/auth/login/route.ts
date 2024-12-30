// app/api/auth/login/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { verifyPassword } from '@/src/utils/password.utils';
import { getIronSession } from 'iron-session';
import { sessionConfig } from '@/src/middleware/session';
import type { IronSessionData } from '@/src/types/session';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    console.log('Login attempt for:', email); // Add logging

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, password: true, name: true, emailVerified: true }
    });

    if (!user) {
      console.log('User not found');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password);
    console.log('Password valid:', isValid); // Add logging

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const response = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, emailVerified: user.emailVerified }
    });

    const session = await getIronSession<IronSessionData>(req, response, sessionConfig);
    session.userId = user.id;
    await session.save();

    return response;
  } catch (error) {
    console.error('Login error:', error); // Add detailed error logging
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}