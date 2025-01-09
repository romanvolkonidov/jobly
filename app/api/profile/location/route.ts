//app/api/profile/location/route.tsimport { NextResponse } from 'next/server';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/src/lib/prisma';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { address } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { location: address },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Location update error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}