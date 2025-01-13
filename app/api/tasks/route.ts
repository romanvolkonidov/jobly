// app/api/tasks/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

interface WhereClause {
  status: string;
  budget?: {
    gte?: number;
    lte?: number;
  };
  category?: {
    in: string[];
  };
  subcategory?: {
    in: string[];
  };
  OR?: {
    title?: {
      contains: string;
      mode: 'insensitive';
    };
    description?: {
      contains: string;
      mode: 'insensitive';
    };
  }[];
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
    const categories = searchParams.get('categories')?.split(',');
    const subcategories = searchParams.get('subcategories')?.split(',');
    const searchQuery = searchParams.get('search')?.trim();

    const where: WhereClause = { status };

    if (searchQuery) {
      where.OR = [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } }
      ];
    }

    if (minBudget || maxBudget) {
      where.budget = {
        ...(minBudget && { gte: parseFloat(minBudget) }),
        ...(maxBudget && { lte: parseFloat(maxBudget) }),
      };
    }

    if (categories?.length) {
      where.category = { in: categories };
    }

    if (subcategories?.length) {
      where.subcategory = { in: subcategories };
    }

    const total = await prisma.task.count({ where });

    const tasks = await prisma.task.findMany({
      where,
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
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
      orderBy: [
        { [sortBy]: sortOrder },
      ],
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