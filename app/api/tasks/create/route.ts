import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const taskData = await req.json();

    const task = await prisma.task.create({
      data: {
        title: taskData.name,
        description: taskData.description,
        budget: taskData.budget,
        status: taskData.status,
        userId: session.user.id,
      }
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}