// app/api/profile/languages/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth-options';

// Export a named PUT function instead of default export
export async function PUT(request: Request) {
  try {
    // Get the session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    // Parse the request body
    const { languages } = await request.json();

    if (!Array.isArray(languages)) {
      return NextResponse.json(
        { error: 'Languages must be an array' },
        { status: 400 }
      );
    }

    // Update user languages
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        languages,
      },
      select: {
        id: true,
        languages: true,
      },
    });

    // Return the response
    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error('Error updating languages:', error);
    return NextResponse.json(
      { error: 'Failed to update languages' },
      { status: 500 }
    );
  }
}