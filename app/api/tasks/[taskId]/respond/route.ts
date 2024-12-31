// /api/tasks/[taskId]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET(request: Request) {
  try {
    const taskId = request.url.split('/tasks/')[1];
    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }
}