import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getIronSession } from 'iron-session';
import { sessionConfig } from '@/src/middleware/session';
import type { IronSessionData } from '@/src/types/session';

export async function GET(request: Request) {
  try {
    // Extract conversationId from the URL
    const url = new URL(request.url);
    const conversationId = url.pathname.split('/').pop(); // Get the last part of the URL

    if (!conversationId) {
      return NextResponse.json({ error: 'Missing conversationId' }, { status: 400 });
    }

    // Retrieve session data
    const session = await getIronSession<IronSessionData>(request, NextResponse.next(), sessionConfig);
    if (!session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch task to verify user involvement
    const task = await prisma.task.findUnique({
      where: { id: conversationId },
      include: { bids: true },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Verify user authorization: either task creator or bidder
    const userHasBid = task.bids.some(bid => bid.userId === session.userId);
    if (task.userId !== session.userId && !userHasBid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch messages associated with the task
    const messages = await prisma.message.findMany({
      where: { taskId: conversationId },
      include: {
        from: { select: { imageUrl: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Format messages for response
    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      isSender: msg.fromUserId === session.userId,
      userImageUrl: msg.from.imageUrl,
      timestamp: msg.createdAt,
    }));

    return NextResponse.json(formattedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
