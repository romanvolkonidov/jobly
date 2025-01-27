import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const taskId = params.taskId;
    
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { 
        status: 'archived'
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Task archived successfully',
      task: updatedTask
    });
  } catch (error) {
    console.error('Archive task error:', error);
    return NextResponse.json(
      { message: 'Failed to archive task' },
      { status: 500 }
    );
  }
}
