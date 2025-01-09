import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth-options";

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { skills } = await request.json();
    console.log('Received skills:', skills);
    
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { skills },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        imageUrl: true,
        aboutMe: true,
        location: true,
        isWorker: true,
        rating: true,
        skills: true,
        portfolioImages: true,
        portfolioVideo: true,
        completedTasks: true,
        reviewCount: true,
        taskRating: true
      }
    });
    
    console.log('Updated user:', user);
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}