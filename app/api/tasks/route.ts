// app/api/tasks/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;

  const tasks = await prisma.task.findMany({
    take: limit,
    skip: (page - 1) * limit,
    where: {
      status: 'open'
    },
    include: {
      bids: true,
      createdBy: true,
      company: true
    },
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.task.count();

  return NextResponse.json({
    tasks,
    pagination: {
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    }
  });
}