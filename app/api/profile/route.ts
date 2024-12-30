//app/api/profile/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getIronSession } from 'iron-session';
import { sessionConfig } from '@/src/middleware/session';
import type { IronSessionData } from '@/src/types/session';

export async function GET(req: Request) {
  const session = await getIronSession<IronSessionData>(req, NextResponse.next(), sessionConfig);
  if (!session.userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  return NextResponse.json(user);
}

export async function PUT(req: Request) {
  const session = await getIronSession<IronSessionData>(req, NextResponse.next(), sessionConfig);
  if (!session.userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const data = await req.json();
  const user = await prisma.user.update({
    where: { id: session.userId },
    data: { aboutMe: data.aboutMe },
  });

  return NextResponse.json(user);
}