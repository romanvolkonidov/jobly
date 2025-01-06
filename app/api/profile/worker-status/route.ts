// app/api/profile/worker-status/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth-options";

export async function PUT() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: { isWorker: !user?.isWorker },
  });

  return NextResponse.json(updatedUser);
}