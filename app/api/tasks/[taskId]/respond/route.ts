import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getIronSession } from 'iron-session';
import { sessionConfig } from '@/src/middleware/session';
import type { IronSessionData } from '@/src/types/session';

export async function POST(request: Request) {
  try {
    const session = await getIronSession<IronSessionData>(request, NextResponse.next(), sessionConfig);
    if (!session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const taskId = request.url.split('/tasks/')[1].split('/respond')[0];
    const { price, message } = await request.json();

    const bid = await prisma.bid.create({
      data: {
        amount: price,
        proposal: message,
        taskId,
        userId: session.userId,
        status: 'pending'
      }
    });

    return NextResponse.json(bid);
  } catch (err) {
    console.error('Error creating response:', err);
    return NextResponse.json({ error: 'Failed to submit response' }, { status: 500 });
  }
}