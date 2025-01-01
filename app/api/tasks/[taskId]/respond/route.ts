// app/api/tasks/[taskId]/respond/route.ts
//this file works in the following way: it creates a bid for a task
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getIronSession } from 'iron-session';
import { sessionConfig } from '@/src/middleware/session';
import type { IronSessionData } from '@/src/types/session';

export async function POST(request: Request) {
  try {
    const session = await getIronSession<IronSessionData>(request, NextResponse.next(), sessionConfig);
    if (!session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const taskId = request.url.split('/tasks/')[1].split('/respond')[0];
    const { price, message } = await request.json();

    // Create the bid
    const bid = await prisma.bid.create({
      data: {
        amount: price,
        proposal: message,
        taskId,
        userId: session.userId,
        status: 'pending'
      }
    });

    // Create a message thread for the task owner and worker
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { userId: true }
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Create initial message
    await prisma.message.create({
      data: {
        content: message,
        fromUserId: session.userId,
        toUserId: task.userId,
        taskId,
        bidId: bid.id
      }
    });

    return NextResponse.json(bid);
  } catch (err) {
    console.error('Error creating response:', err);
    return NextResponse.json({ error: 'Failed to submit response' }, { status: 500 });
  }
}