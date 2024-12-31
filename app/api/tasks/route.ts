// app/api/tasks/route.ts
//this is the route that fetches all tasks
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

interface WhereClause {
  status: string;
  budget?: {
    gte?: number;
    lte?: number;
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const minBudget = searchParams.get('minBudget');
    const maxBudget = searchParams.get('maxBudget');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const status = searchParams.get('status') || 'open';

    // Build where clause based on filters
    const where: WhereClause = { status };
    if (minBudget || maxBudget) {
      where.budget = {
        ...(minBudget && { gte: parseFloat(minBudget) }),
        ...(maxBudget && { lte: parseFloat(maxBudget) }),
      };
    }

    // Get total count for pagination
    const total = await prisma.task.count({ where });

    // Get tasks with pagination
    const tasks = await prisma.task.findMany({
      where,
      include: {
        createdBy: {
          select: {
            name: true,
            rating: true,
            reviewCount: true,
          },
        },
        bids: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      tasks,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}