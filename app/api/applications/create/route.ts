import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth-options';
import { fileToBase64, validateFile } from '@/src/lib/uploadFile';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const vacancyId = formData.get('vacancyId') as string;
    const cv = formData.get('cv') as File;
    const coverLetterFile = formData.get('coverLetterFile') as File;
    const coverLetterText = formData.get('coverLetter') as string;

    if (cv) {
      try {
        validateFile(cv);
      } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
      }
    }

    if (coverLetterFile) {
      try {
        validateFile(coverLetterFile);
      } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
      }
    }

    // Check if application already exists
    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        taskId: vacancyId,
        userId: session.user.id,
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied for this position' },
        { status: 400 }
      );
    }

    let cvBase64: string | undefined;
    let coverLetterBase64: string | undefined;

    if (cv) {
      cvBase64 = await fileToBase64(cv);
    }

    if (coverLetterFile) {
      coverLetterBase64 = await fileToBase64(coverLetterFile);
    }

    const application = await prisma.jobApplication.create({
      data: {
        taskId: vacancyId,
        userId: session.user.id,
        cvUrl: cvBase64,
        coverLetter: coverLetterBase64 || coverLetterText,
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}
