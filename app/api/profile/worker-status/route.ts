import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getIronSession } from 'iron-session';
import { sessionConfig } from '@/src/middleware/session';
import type { IronSessionData } from '@/src/types/session';

export async function PUT(req: Request) {
  const session = await getIronSession<IronSessionData>(req, NextResponse.next(), sessionConfig);
  if (!session.userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  const updatedUser = await prisma.user.update({
    where: { id: session.userId },
    data: { isWorker: !user?.isWorker },
  });

  return NextResponse.json(updatedUser);
}