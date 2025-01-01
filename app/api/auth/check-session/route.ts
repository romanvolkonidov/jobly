import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionConfig } from '@/src/middleware/session';
import type { IronSessionData } from '@/src/types/session';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<IronSessionData>(
      cookieStore,
      sessionConfig
    );

    if (!session?.userId || !session?.user) {
      return NextResponse.json({
        isLoggedIn: false,
        user: null
      });
    }

    return NextResponse.json({
      isLoggedIn: true,
      user: session.user
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({
      isLoggedIn: false,
      user: null
    });
  }
}