import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/auth-options";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const taskData = await req.json();
    console.log('Received task data:', taskData);

    // Map name to title
    const task = await prisma.task.create({
      data: {
        title: taskData.name, // Use name instead of title
        description: taskData.description,
        budget: taskData.budget,
        status: taskData.status || 'open',
        subcategory: taskData.subcategory,
        userId: session.user.id,
        needsBusinessDoc: taskData.needsBusinessDoc || false
      }
    });

    return NextResponse.json(task);
    
  } catch (error) {
    console.error('Error creating task:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}