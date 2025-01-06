// app/api/tasks/[taskId]/respond/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth-options";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const taskId = request.url.split('/tasks/')[1].split('/respond')[0];
    const { price, message } = await request.json();

    const bid = await prisma.bid.create({
      data: {
        amount: price,
        proposal: message,
        taskId,
        userId: session.user.id,
        status: 'pending'
      }
    });

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { userId: true }
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    await prisma.message.create({
      data: {
        content: message,
        fromUserId: session.user.id,
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