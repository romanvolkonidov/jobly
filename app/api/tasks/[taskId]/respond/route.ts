import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { cookies } from 'next/headers';
import type { IronSessionData } from '@/src/types/session';

type Props = {
  params: { taskId: string }
}

export async function POST(req: NextRequest, props: Props) {
  try {
    const cookiesList = await cookies();
    const sessionCookie = cookiesList.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value) as IronSessionData;
    if (!session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { price, message } = await req.json();

    const bid = await prisma.bid.create({
      data: {
        amount: price,
        proposal: message,
        taskId: props.params.taskId,
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