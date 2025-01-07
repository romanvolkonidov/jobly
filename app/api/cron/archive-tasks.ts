import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET() {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    await prisma.task.updateMany({
      where: {
        createdAt: {
          lte: weekAgo,
        },
        status: 'open',
      },
      data: {
        status: 'archived',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in auto-archive:', error);
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}
