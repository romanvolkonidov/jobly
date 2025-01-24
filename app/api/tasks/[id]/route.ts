import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const task = await prisma.task.findUnique({
      where: {
        id: params.id,
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
            name: true,
            logo: true,
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
