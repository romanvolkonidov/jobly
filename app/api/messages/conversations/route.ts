// app/api/messages/conversations/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth-options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { userId: session.user.id },
          { bids: { some: { userId: session.user.id } } }
        ]
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        userId: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
          },
        },
        bids: {
          select: {
            userId: true,
            createdBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                imageUrl: true
              }
            }
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            content: true,
            createdAt: true,
          }
        }
      }
    });

    const conversations = tasks.map(task => {
      const isTaskCreator = task.userId === session.user.id;
      const otherUser = isTaskCreator ? task.bids[0]?.createdBy : task.createdBy;

      return {
        id: task.id,
        otherUserId: otherUser?.id,
        otherUserFirstName: otherUser?.firstName,
        otherUserLastName: otherUser?.lastName,
        otherUserFullName: otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : null,
        otherUserImage: otherUser?.imageUrl,
        taskId: task.id,
        taskTitle: task.title,
        lastMessage: task.messages[0]?.content ?? 'No messages yet',
        timestamp: task.messages[0]?.createdAt ?? task.createdAt
      };
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}