//src/api/messages/send/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { conversationId, content } = await request.json();

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
        fromUserId: session.user.id,
        toUserId: task.userId,
        taskId: conversationId,
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}