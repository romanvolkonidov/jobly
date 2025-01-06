// app/api/messages/[conversationId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth-options";
export const revalidate = 30;

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const conversationId = url.pathname.split('/').pop();
    const limit = Number(url.searchParams.get('limit')) || 50;
    const offset = Number(url.searchParams.get('offset')) || 0;

    if (!conversationId) {
      return NextResponse.json({ error: 'Missing conversationId' }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: { taskId: conversationId },
      select: {
        id: true,
        content: true,
        createdAt: true,
        fromUserId: true,
        toUserId: true,
      },
      orderBy: { createdAt: 'asc' },
      take: limit,
      skip: offset,
    });

    const userIds = [...new Set(messages.map(m => m.fromUserId))];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds }},
      select: { id: true, imageUrl: true }
    });

    const userImageMap = Object.fromEntries(
      users.map(user => [user.id, user.imageUrl])
    );

    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      timestamp: msg.createdAt,
      fromUserId: msg.fromUserId,
      userImageUrl: userImageMap[msg.fromUserId],
      isSender: msg.fromUserId === session.user.id
    }));

    return NextResponse.json(formattedMessages, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=59',
      },
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}