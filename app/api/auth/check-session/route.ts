//app/api/auth/check-session/route.ts
import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionConfig } from '@/src/middleware/session';
import type { IronSessionData } from '@/src/types/session';

export async function GET() {
  const session = await getIronSession<IronSessionData>(
    cookies(),
    sessionConfig
  );

  return NextResponse.json({
    isLoggedIn: !!session.userId,
  });
}
