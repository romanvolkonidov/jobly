// app/api/tasks/user/[type]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth-options";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        bids: true,
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Transform the tasks to include fullName
    const transformedTasks = tasks.map(task => ({
      ...task,
      createdBy: {
        ...task.createdBy,
        fullName: `${task.createdBy.firstName} ${task.createdBy.lastName}`
      }
    }));

    return NextResponse.json({ tasks: transformedTasks });
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}