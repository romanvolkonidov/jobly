//app/api/profile/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { prisma } from '@/src/lib/prisma';
import { authOptions } from "@/app/api/auth/auth-options";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        imageUrl: true,
        aboutMe: true,
        locations: true,
        isWorker: true,
        rating: true,
        skills: true,
        languages: true,
        portfolioImages: true,
        portfolioVideo: true,
        completedTasks: true,
        reviewCount: true,
        taskRating: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}