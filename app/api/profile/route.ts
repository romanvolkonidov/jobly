//app/api/profile/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth-options";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      skills: true,
      email: true,
      imageUrl: true,
      aboutMe: true,
      location: true,
      isWorker: true,
      rating: true,
      portfolioImages: true,
      portfolioVideo: true,
      completedTasks: true,
      reviewCount: true,
      taskRating: true,
    }
  });
  
  if (!user) {
    return new NextResponse('User not found', { status: 404 });
  }

  const response = {
    ...user,
    fullName: `${user.firstName} ${user.lastName}` // Add convenience field
  };

  return NextResponse.json(response);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  
  const data = await req.json();
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { aboutMe: data.aboutMe },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      imageUrl: true,
      aboutMe: true,
      skills: true,
      completedTasks: true,
      location: true,
      isWorker: true,
      rating: true,
      portfolioImages: true,
      portfolioVideo: true,
      reviewCount: true,
      taskRating: true,
    }
  });
  
  const response = {
    ...user,
    fullName: `${user.firstName} ${user.lastName}` // Add convenience field
  };

  return NextResponse.json(response);
}