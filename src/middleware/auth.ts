// src/middleware/auth.ts
//this file works in the following way: it checks if the user is authenticated
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionConfig } from './session';
import { prisma } from '@/src/lib/prisma';
import type { IronSessionData } from '@/src/types/session';

const PROTECTED_ACTIONS = [
  '/api/tasks/create',
  '/api/tasks/bid', 
  '/api/messages/send',
  '/api/payments'
];

export async function authMiddleware(request: NextRequest) {
  const response = new Response();
  const session = await getIronSession<IronSessionData>(request, response, sessionConfig);
  const path = request.nextUrl.pathname;

  const publicPaths = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/verify-email',
  ];

  if (publicPaths.includes(path)) return NextResponse.next();
  if (!session.userId) return NextResponse.redirect(new URL('/auth/login', request.url));

  if (PROTECTED_ACTIONS.some(protectedPath => path.startsWith(protectedPath))) {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { emailVerified: true }
    });

    if (!user?.emailVerified) {
      return NextResponse.redirect(new URL('/auth/verify', request.url));
    }
  }

  return NextResponse.next();
}