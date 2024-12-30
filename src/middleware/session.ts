// src/middleware/session.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession, IronSession } from 'iron-session';


export const sessionConfig = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'jobly_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 24 * 60 * 60 // 24 hours
  }
} as const;

interface CustomSessionData {
  userId?: string; // Define the custom properties you use
}

export async function sessionMiddleware(req: NextRequest) {
  try {
    const res = new Response();
    const session = (await getIronSession(req, res, sessionConfig)) as IronSession<CustomSessionData>;

    if (!session.userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    return NextResponse.next();
  } catch (err) {
    console.error('Session error:', err);
    return NextResponse.json({ error: 'Session error' }, { status: 500 });
  }
}
