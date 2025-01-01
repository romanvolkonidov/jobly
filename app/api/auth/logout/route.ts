// app/api/auth/logout/route.ts
//this is the file that is reponsible for handling the logout process
import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

 const sessionConfig = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'jobly_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 // 7 days in seconds
  }
} as const;

export async function POST() {
// app/api/auth/logout/route.ts
const session = await getIronSession(await cookies(), sessionConfig);
  session.destroy();
  return NextResponse.json({ success: true });
}
