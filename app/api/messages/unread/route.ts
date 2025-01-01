// app/api/messages/unread/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getIronSession } from 'iron-session';
import { sessionConfig } from '@/src/middleware/session';
import type { IronSessionData } from '@/src/types/session';

export async function GET(request: Request) {
  try {
    const session = await getIronSession<IronSessionData>(
      request,
      NextResponse.next(),
      sessionConfig
    );
    
    if (!session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only count messages sent TO the user that are unread
    const count = await prisma.message.count({
      where: {
        toUserId: session.userId,
        fromUserId: { not: session.userId }, // Exclude messages sent by the user
        isRead: false,
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error checking unread messages:', error);
    return NextResponse.json(
      { error: 'Failed to check unread messages' },
      { status: 500 }
    );
  }
}