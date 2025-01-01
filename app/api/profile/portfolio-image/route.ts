//app/api/profile/portfolio-image/route.ts
//this file works in the following way: it deletes a user's portfolio image
import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionConfig } from '@/src/middleware/session';
import type { IronSessionData } from '@/src/types/session';
import { prisma } from '@/src/lib/prisma';

export async function DELETE(req: Request) {
  try {
    const session = await getIronSession<IronSessionData>(
      req,
      NextResponse.next(),
      sessionConfig
    );
    if (!session.userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { imageUrl } = await req.json();

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { portfolioImages: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedImages = user.portfolioImages.filter(
      (img) => img !== imageUrl
    );

    await prisma.user.update({
      where: { id: session.userId },
      data: { portfolioImages: updatedImages },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Portfolio image deletion error:', error);
    return NextResponse.json({ error: 'Deletion failed' }, { status: 500 });
  }
}
