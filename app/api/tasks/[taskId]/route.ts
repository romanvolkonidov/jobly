//app/api/tasks/[taskId]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET(request: Request) {
  try {
    const taskId = request.url.split('/tasks/')[1];
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Transform the task to include fullName
    const transformedTask = {
      ...task,
      createdBy: {
        ...task.createdBy,
        fullName: `${task.createdBy.firstName} ${task.createdBy.lastName}`
      }
    };

    return NextResponse.json(transformedTask);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}