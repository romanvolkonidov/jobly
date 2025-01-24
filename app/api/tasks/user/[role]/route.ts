//app/api/tasks/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/src/lib/prisma';
import { authOptions } from '@/app/api/auth/auth-options';

export async function GET(req: Request, { params }: { params: { role: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'open';
    const role = params.role;

    if (role === 'client') {
      const tasks = await prisma.task.findMany({
        where: {
          userId: session.user.id,
          status: status === 'archived' ? 'archived' : 'open',
        },
        include: {
          bids: true,
          createdBy: {
            select: {
              firstName: true,
              lastName: true,
              imageUrl: true,
            },
          },
          company: {
            select: {
              id: true,
              name: true,
              logo: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      tasks.forEach(task => {
        console.log(`Task ${task.id}:`, {
          postedAs: task.postedAs,
          companyId: task.companyId,
          companyName: task.company?.name,
          creatorName: task.createdBy.firstName
        });
      });

      const transformedTasks = tasks.map(task => {
        const isCompanyTask = Boolean(task.postedAs === 'company' && task.company);
        return {
          ...task,
          displayAs: isCompanyTask ? 'company' : 'individual',
          posterName: isCompanyTask ? task.company?.name : task.createdBy.firstName,
          posterImage: isCompanyTask ? task.company?.logo : task.createdBy.imageUrl
        };
      });

      return NextResponse.json({ tasks: transformedTasks });
    }

    if (role === 'worker') {
      const tasks = await prisma.task.findMany({
        where: {
          bids: {
            some: {
              userId: session.user.id,
            },
          },
          status: status === 'archived' ? 'archived' : 'open',
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
              imageUrl: true,
            },
          },
          company: {
            select: {
              name: true,
              logo: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return NextResponse.json({ tasks });
    }

    return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
