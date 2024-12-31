// app/api/messages/conversations/route.ts

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

    const conversations = await prisma.message.findMany({
      where: {
        OR: [
          { fromUserId: session.userId },
          { toUserId: session.userId }
        ]
      },
      include: {
        from: {
          select: {
            name: true,
            imageUrl: true
          }
        },
        task: {
          select: {
            title: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      distinct: ['taskId']
    });
    
    const formattedConversations = conversations.map(conv => ({
      id: conv.taskId,
      senderId: conv.fromUserId,
      senderName: conv.from.name,
      senderImageUrl: conv.from.imageUrl,
      taskId: conv.taskId,
      taskTitle: conv.task.title,
      lastMessage: conv.content,
      timestamp: conv.createdAt
    }));

    return NextResponse.json(formattedConversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}
