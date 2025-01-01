// app/api/messages/mark-read/route.ts
//this file works in the following way: it marks all messages in a conversation as read
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getIronSession } from 'iron-session';
import { sessionConfig } from '@/src/middleware/session';
import type { IronSessionData } from '@/src/types/session';

export async function POST(request: Request) {
  try {
    const session = await getIronSession<IronSessionData>(
      request,
      NextResponse.next(),
      sessionConfig
    );

    if (!session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId } = await request.json();

    // Mark all messages in the conversation as read
    await prisma.message.updateMany({
      where: {
        taskId: conversationId,
        toUserId: session.userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark messages as read' },
      { status: 500 }
    );
  }
}
