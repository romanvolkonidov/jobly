//app/api/tasks/[taskId]/route.ts
//this is the route that fetches a single task by its ID
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const task = await prisma.task.findUnique({
      where: { id: params.taskId },
      include: {
        createdBy: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}
