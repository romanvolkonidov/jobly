import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getIronSession } from 'iron-session';
import { sessionConfig } from '@/src/middleware/session';
import { IronSessionData } from 'iron-session';

export async function POST(req: NextRequest) {
  const session = await getIronSession(req, NextResponse.next(), sessionConfig) as IronSessionData;

  if (!session?.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;
    const type = formData.get('type') as string;

    if (!file || !type) {
      return NextResponse.json({ error: 'Invalid upload parameters' }, { status: 400 });
    }

    const allowedTypes = ['profile', 'portfolio'];
    if (!allowedTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid upload type' }, { status: 400 });
    }

    // Convert file to Base64 for storage
    const buffer = await file.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');
    const imageUrl = `data:${file.type};base64,${base64Image}`;

    let updatedUser;

    if (type === 'profile') {
      // Update profile picture
      updatedUser = await prisma.user.update({
        where: { id: session.userId },
        data: { imageUrl },
      });
    } else {
      // Update portfolio images
      const user = await prisma.user.findUnique({ where: { id: session.userId } });
      const updatedPortfolio = [...(user?.portfolioImages || []), imageUrl];
      updatedUser = await prisma.user.update({
        where: { id: session.userId },
        data: { portfolioImages: updatedPortfolio },
      });
    }

    // Return updated user data
    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
