import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth-options';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const {
      title,
      employmentType,
      location,
      isRemote,
      description,
      responsibilities,
      qualifications,
      skills,
      benefits,
      salaryMin,
      salaryMax,
      applicationDeadline,
      requiredDocuments,
      languages,
    } = await req.json();

    const vacancy = await prisma.task.create({
      data: {
        type: 'vacancy',
        title,
        description,
        location,
        status: 'open',
        employmentType,
        isRemote,
        responsibilities,
        qualifications,
        benefits,
        salaryMin: salaryMin ? parseFloat(salaryMin) : null,
        salaryMax: salaryMax ? parseFloat(salaryMax) : null,
        applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : null,
        requiredDocuments,
        languages,
        category: 'Jobs', // Default category for vacancies
        subcategory: employmentType, // Use employment type as subcategory
        userId: session.user.id,
      },
    });

    return NextResponse.json(vacancy);
  } catch (error) {
    console.error('Error creating vacancy:', error);
    return NextResponse.json(
      { error: 'Failed to create vacancy' },
      { status: 500 }
    );
  }
}
