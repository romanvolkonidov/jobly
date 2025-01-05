// app/api/profile/portfolio-image/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/src/lib/prisma';

export async function DELETE(req: Request) {
  const auth = await authOptions();
  const session = await getServerSession(auth);
    try {
   
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { imageUrl } = await req.json();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { portfolioImages: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedImages = user.portfolioImages.filter((img) => img !== imageUrl);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { portfolioImages: updatedImages },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Portfolio image deletion error:', error);
    return NextResponse.json({ error: 'Deletion failed' }, { status: 500 });
  }
}