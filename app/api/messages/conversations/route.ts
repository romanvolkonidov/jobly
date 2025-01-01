// app/api/messages/conversations/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getIronSession } from 'iron-session';
import { sessionConfig } from '@/src/middleware/session';
import type { IronSessionData } from '@/src/types/session';

export async function GET(request: Request) {
  try {
    console.log('Fetching conversations...');
    
    // Get session data
    const session = await getIronSession<IronSessionData>(request, NextResponse.next(), sessionConfig);
    console.log('Session data:', session);

    if (!session.userId) {
      console.log('No user ID in session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Log user ID
    console.log('User ID:', session.userId);

    // Fetch all tasks
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { userId: session.userId },
          { bids: { some: { userId: session.userId } } }
        ]
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        userId: true, // Add this
        createdBy: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
        bids: {
          select: {
            userId: true,
            createdBy: {
              select: {
                id: true,
                name: true,
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

    console.log('Found tasks:', tasks);


// app/api/messages/conversations/route.ts

const conversations = tasks.map(task => {
  const lastMessage = task.messages[0];
  // Get all bids for this task that aren't from current user
  const otherUserBid = task.bids.find(bid => bid.userId !== session.userId);
  
  const otherUser = task.userId === session.userId 
    ? otherUserBid?.createdBy  // If I created task, show bidder
    : task.createdBy;          // If I'm bidder, show task creator

  if (!otherUser) {
    console.log('Missing other user for task:', task.id);
  }

  return {
    id: task.id,
    otherUserId: otherUser?.id ?? "",
    otherUserName: otherUser?.name ?? "Unknown User",
    otherUserImage: otherUser?.imageUrl,
    taskId: task.id,
    taskTitle: task.title,
    lastMessage: lastMessage?.content ?? 'No messages yet',
    timestamp: lastMessage?.createdAt ?? task.createdAt
  };
});

    console.log('Formatted conversations:', conversations);
    return NextResponse.json(conversations);

  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch conversations',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}