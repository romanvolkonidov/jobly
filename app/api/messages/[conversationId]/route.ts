import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { sessionConfig } from '@/src/middleware/session';
import type { IronSessionData } from '@/src/types/session';

export const revalidate = 30;

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const conversationId = url.pathname.split('/').pop();
    const limit = Number(url.searchParams.get('limit')) || 50;
    const offset = Number(url.searchParams.get('offset')) || 0;

    if (!conversationId) {
      return NextResponse.json({ error: 'Missing conversationId' }, { status: 400 });
    }

    // Get session using cookies
    const cookieStore = await cookies();

    const session = await getIronSession<IronSessionData>(cookieStore, sessionConfig);
    
    if (!session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Updated Prisma query with correct types
    const messages = await prisma.message.findMany({
      where: {
        taskId: conversationId, // Assuming messages are linked to tasks
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        fromUserId: true,
        toUserId: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset,
    });

    // Join with users table to get profile images
    const userIds = [...new Set(messages.map(m => m.fromUserId))];
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds
        }
      },
      select: {
        id: true,
        imageUrl: true
      }
    });

    // Create a map of user IDs to image URLs
    const userImageMap = Object.fromEntries(
      users.map(user => [user.id, user.imageUrl])
    );

    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      timestamp: msg.createdAt,
      fromUserId: msg.fromUserId,
      userImageUrl: userImageMap[msg.fromUserId],
      isSender: msg.fromUserId === session.userId
    }));

    return NextResponse.json(formattedMessages, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=59',
      },
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}