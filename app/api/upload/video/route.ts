import {  NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth-options";
// app/api/profile/portfolio-video/route.ts
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('video') as File;

    if (!file) {
      return NextResponse.json({ error: 'No video provided' }, { status: 400 });
    }

    const MAX_SIZE = 100 * 1024 * 1024; // 100MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Video must be less than 100MB' }, { status: 400 });
    }

    // Process in chunks
    const buffer = await file.arrayBuffer();
    const chunks: Buffer[] = [];
    const chunkSize = 5 * 1024 * 1024; // 5MB chunks

    for (let i = 0; i < buffer.byteLength; i += chunkSize) {
      const chunk = Buffer.from(buffer.slice(i, i + chunkSize));
      chunks.push(chunk);
    }

    const base64Video = Buffer.concat(chunks).toString('base64');
    const videoUrl = `data:${file.type};base64,${base64Video}`;

    await prisma.user.update({
      where: { id: session.user.id },
      data: { portfolioVideo: videoUrl }
    });

    return NextResponse.json({ videoUrl });
  } catch (error) {
    console.error('Video upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}