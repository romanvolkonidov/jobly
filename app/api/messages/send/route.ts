//src/api/messages/send/route.ts
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

    const { conversationId, content } = await request.json();

    // Get task to find recipient
    const task = await prisma.task.findUnique({
      where: { id: conversationId },
      select: { userId: true },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        content,
        fromUserId: session.userId,
        toUserId: task.userId,
        taskId: conversationId,
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
