import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getIronSession } from 'iron-session';
import { sessionConfig } from '@/src/middleware/session';
import type { IronSessionData } from '@/src/types/session';

export async function POST(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const session = await getIronSession<IronSessionData>(req, NextResponse.next(), sessionConfig);
    if (!session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { price, message } = await req.json();

    const bid = await prisma.bid.create({
      data: {
        amount: price,
        proposal: message,
        taskId: params.taskId,
        userId: session.userId,
        status: 'pending'
      }
    });

    return NextResponse.json(bid);
  } catch (error) {
    console.error('Error creating response:', error);
    return NextResponse.json({ error: 'Failed to submit response' }, { status: 500 });
  }
}