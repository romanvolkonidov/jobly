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

    const data = await req.json();

    // Validate company posting
    if (data.postedAs === 'company') {
      // Check if user has access to this company
      const company = await prisma.company.findFirst({
        where: {
          id: data.companyId,
          userId: session.user.id
        }
      });

      if (!company) {
        return NextResponse.json(
          { error: 'Unauthorized to post as this company' },
          { status: 403 }
        );
      }
    }

    const vacancy = await prisma.task.create({
      data: {
        type: 'vacancy',
        postedAs: data.postedAs || 'individual', // Default to individual if not specified
        companyId: data.postedAs === 'company' ? data.companyId : null,
        title: data.title,
        description: data.description,
        location: data.location,
        status: 'open',
        employmentType: data.employmentType,
        isRemote: data.isRemote,
        responsibilities: data.responsibilities,
        qualifications: data.qualifications,
        benefits: data.benefits,
        salaryMin: data.salaryMin ? parseFloat(data.salaryMin) : null,
        salaryMax: data.salaryMax ? parseFloat(data.salaryMax) : null,
        applicationDeadline: data.applicationDeadline ? new Date(data.applicationDeadline) : null,
        requiredDocuments: data.requiredDocuments,
        languages: data.languages,
        category: 'Jobs', // Default category for vacancies
        subcategory: data.employmentType, // Use employment type as subcategory
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
