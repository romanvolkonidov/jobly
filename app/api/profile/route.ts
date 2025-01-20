// app/api/profile/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { prisma } from '@/src/lib/prisma';
import { authOptions } from "@/app/api/auth/auth-options";

export async function GET() {
 try {
   const session = await getServerSession(authOptions);
   
   if (!session?.user?.id) {
     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }

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
   return NextResponse.json({ error: 'Database error occurred' }, { status: 500 });
 }
}

export async function PUT(req: Request) {
 try {
   const session = await getServerSession(authOptions);
   if (!session?.user?.id) {
     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }

   const data = await req.json();

   // Validate data
   if (typeof data.aboutMe !== 'string') {
     return NextResponse.json({ error: 'Invalid about me text' }, { status: 400 });
   }

   const updatedUser = await prisma.user.update({
     where: { id: session.user.id },
     data: {
       aboutMe: data.aboutMe
     },
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

   return NextResponse.json(updatedUser);

 } catch (error) {
   console.error('Profile update error:', error);
   return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
 }
}