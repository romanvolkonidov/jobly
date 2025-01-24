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
      include: {
        education: true,
        experience: true,
        certifications: true,
      },
    });

    if (!resume) {
      return NextResponse.json(null);  // Return null instead of empty object
    }

    return NextResponse.json(resume);
  } catch (error) {
    console.error('Error fetching resume:', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}