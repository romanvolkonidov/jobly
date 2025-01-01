// app/api/upload/route.ts
//this file works in the following way: it uploads a user's video
import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionConfig } from '@/src/middleware/session';
import type { IronSessionData } from '@/src/types/session';
import { prisma } from '@/src/lib/prisma';

// app/api/upload/route.ts
export async function POST(req: Request) {
  const session = await getIronSession<IronSessionData>(req, NextResponse.next(), sessionConfig);
  if (!session.userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image must be less than 5MB' }, { status: 400 });
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      return NextResponse.json({ error: 'Only JPEG and PNG allowed' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');
    const imageUrl = `data:${file.type};base64,${base64Image}`;

    const user = await prisma.user.update({
      where: { id: session.userId },
      data: { imageUrl },
    });

    return NextResponse.json({ imageUrl: user.imageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}