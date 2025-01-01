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
        createdBy: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          }
        },
        bids: {
          where: {
            userId: session.userId
          },
          select: {
            userId: true,
            createdBy: {
              select: {
                name: true,
                imageUrl: true
              }
            }
          }
        },
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1,
          select: {
            content: true,
            createdAt: true,
          }
        }
      }
    });

    console.log('Found tasks:', tasks);

    // Format the data
    const conversations = tasks.map(task => {
      const lastMessage = task.messages[0];
      const isCreator = task.createdBy.id === session.userId;
      const bid = task.bids[0];
      
      return {
        id: task.id,
        senderId: isCreator ? bid?.userId : task.createdBy.id,
        senderName: isCreator ? bid?.createdBy.name : task.createdBy.name,
        senderImageUrl: isCreator ? bid?.createdBy.imageUrl : task.createdBy.imageUrl,
        taskId: task.id,
        taskTitle: task.title,
        lastMessage: lastMessage?.content || 'No messages yet',
        timestamp: lastMessage?.createdAt || new Date(),
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