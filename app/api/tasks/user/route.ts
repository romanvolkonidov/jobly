// app/api/tasks/user/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}