//src/api/messages/[conversationId}/route.tsimport { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getIronSession } from 'iron-session';
import { sessionConfig } from '@/src/middleware/session';
import type { IronSessionData } from '@/src/types/session';

export async function GET(
  request: Request,
  context: { params: { conversationId: string } } // Adjusted type
) {
  const { params } = context; // Extract params from context
  try {
    const session = await getIronSession<IronSessionData>(request, NextResponse.next(), sessionConfig);
    if (!session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch task to verify user is involved
    const task = await prisma.task.findUnique({
      where: { id: params.conversationId },
      include: { bids: true }
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Allow access if user is task creator or has bid on the task
    const userHasBid = task.bids.some(bid => bid.userId === session.userId);
    if (task.userId !== session.userId && !userHasBid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const messages = await prisma.message.findMany({
      where: { taskId: params.conversationId },
      include: {
        from: {
          select: {
            imageUrl: true
          }
        }
      },
      orderBy: { createdAt: 'asc' },
    });

    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      isSender: msg.fromUserId === session.userId,
      userImageUrl: msg.from.imageUrl,
      timestamp: msg.createdAt
    }));

    return NextResponse.json(formattedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
