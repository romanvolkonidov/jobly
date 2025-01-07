// app/api/tasks/user/[type]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth-options';

export async function GET(
  request: Request,
  { params }: { params: { type: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session:', session); // Debug session

    if (!session?.user?.id) {
      console.log('No user ID in session'); // Debug auth
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (params.type === 'worker') {
      const tasks = await prisma.task.findMany({
        where: {
          bids: {
            some: {
              userId: session.user.id,
            },
          },
        },
        include: {
          bids: {
            where: {
              userId: session.user.id,
            },
          },
          createdBy: {
            select: {
              firstName: true, 
              lastName: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      
      console.log('Worker tasks found:', tasks.length); // Debug results
      return NextResponse.json({ tasks });
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId: session.user.id,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log('Client tasks found:', tasks.length); // Debug results
    return NextResponse.json({ tasks });

  } catch (error) {
    // Log full error details
    console.error('Detailed error:', {
      message: (error as any).message,
      stack: (error as any).stack,
      cause: (error as any).cause
    });
    
    return NextResponse.json(
      { error: 'Failed to fetch tasks', details: (error as any).message },
      { status: 500 }
    );
  }
}