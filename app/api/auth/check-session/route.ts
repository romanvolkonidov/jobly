//app/api/auth/check-session/route.ts
////this is the file that is reponsible for checking the session
import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionConfig } from '@/src/middleware/session';
import type { IronSessionData } from '@/src/types/session';

// app/api/auth/check-session/route.ts
export async function GET() {
  const cookieStore = await cookies();
  const session = await getIronSession<IronSessionData>(
    cookieStore,
    sessionConfig
  );

  return NextResponse.json({
    isLoggedIn: !!session.userId,
  });
}