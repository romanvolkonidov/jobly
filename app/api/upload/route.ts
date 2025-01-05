import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
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

    const buffer = await file.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');
    const imageUrl = `data:${file.type};base64,${base64Image}`;

    if (type === 'profile') {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { imageUrl },
      });
    } else {
      const user = await prisma.user.findUnique({ where: { id: session.user.id } });
      const updatedPortfolio = [...(user?.portfolioImages || []), imageUrl];
      await prisma.user.update({
        where: { id: session.user.id },
        data: { portfolioImages: updatedPortfolio },
      });
    }
    
    return NextResponse.json({ imageUrl });
    } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}