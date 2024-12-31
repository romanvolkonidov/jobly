// app/api/tasks/create/route.ts
//this is the route that creates a new task
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getIronSession } from 'iron-session';
import { sessionConfig } from '@/src/middleware/session';
import type { IronSessionData } from '@/src/types/session';

export async function POST(req: Request) {
  try {
    const session = await getIronSession<IronSessionData>(req, NextResponse.next(), sessionConfig);
    if (!session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const taskData = await req.json();

    const task = await prisma.task.create({
      data: {
        title: taskData.name, // Make sure this matches your schema
        description: taskData.description,
        budget: taskData.budget,
        status: taskData.status,
        userId: session.userId,
      }
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}