import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/src/lib/prisma';
import { authOptions } from '../../auth/auth-options';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { postedAs, companyId, name, ...taskData } = data;
    console.log('Task creation data:', {
      postedAs,
      companyId,
      userId: session.user.id
    });
    
    // Also log the company search result
    if (postedAs === 'company' && companyId) {
      const company = await prisma.company.findFirst({
        where: {
          id: companyId,
          userId: session.user.id,
        },
      });
      console.log('Found company:', company);
    }

    if (postedAs === 'company' && companyId) {
      const company = await prisma.company.findFirst({
        where: {
          id: companyId,
          userId: session.user.id,
        },
      });

      if (!company) {
        return NextResponse.json({ message: 'Company not found' }, { status: 404 });
      }

      console.log('Found company:', company);

      const task = await prisma.task.create({
        data: {
          ...taskData,
          userId: session.user.id,
          postedAs: 'company',
          companyId: company.id,
          type: 'task'
        },
        include: {
          company: true,
          createdBy: {
            select: {
              firstName: true,
              lastName: true,
              imageUrl: true,
            }
          }
        }
      });

      console.log('Created task with company:', task);
      return NextResponse.json(task);
    }

    const task = await prisma.task.create({
      data: {
        ...taskData,
        userId: session.user.id,
        postedAs: 'individual',
        type: 'task'
      },
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
            imageUrl: true,
          }
        }
      }
    });

    console.log('Created individual task:', task);
    return NextResponse.json(task);

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ 
      message: 'Server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}