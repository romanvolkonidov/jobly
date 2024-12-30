// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

const sessionConfig = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'jobly_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60,
  },
};

export async function POST() {
// app/api/auth/logout/route.ts
const session = await getIronSession(await cookies(), sessionConfig);
  session.destroy();
  return NextResponse.json({ success: true });
}
