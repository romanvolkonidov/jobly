// app/api/auth/login/route.ts
//this is the file that is reponsible for handling the login process
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { verifyPassword } from '@/src/utils/password.utils';
import { getIronSession } from 'iron-session';
import { sessionConfig } from '@/src/middleware/session';
import type { IronSessionData } from '@/src/types/session';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !await verifyPassword(password, user.password)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

    const session = await getIronSession<IronSessionData>(req, response, sessionConfig);
    session.userId = user.id;
    session.user = {
      id: user.id,
      email: user.email,
      name: user.name
    };
    await session.save();

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}