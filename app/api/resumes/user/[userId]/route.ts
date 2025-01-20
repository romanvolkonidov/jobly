import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const resume = await prisma.resume.findFirst({
      where: {
        userId: params.userId,
      },
      include: {  // Change back to include from select
        education: {
          orderBy: { startDate: 'desc' }
        },
        experience: {
          orderBy: { startDate: 'desc' }
        },
        certifications: {
          orderBy: { issueDate: 'desc' }
        },
      },
    });

    if (!resume) {
      return new NextResponse(null, { status: 404 });  // Return 404 instead of empty object
    }

    return NextResponse.json(resume);
  } catch (error) {
    console.error('Error fetching resume:', error);
    return new NextResponse(null, { status: 500 });
  }
}
