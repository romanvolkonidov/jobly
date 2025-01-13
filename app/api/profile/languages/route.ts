import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getServerSession } from "next-auth";
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
        languages: true,
      }
    });
    
    return NextResponse.json({ languages: user?.languages || [] });
  } catch (error) {
    console.error('Error fetching languages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch languages' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { languages } = await request.json();
    console.log('Updating languages:', languages);
    
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { languages },
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
    
    console.log('Updated user:', user);
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating languages:', error);
    return NextResponse.json(
      { error: 'Failed to update languages' },
      { status: 500 }
    );
  }
}