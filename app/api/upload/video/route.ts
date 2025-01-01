//app/api/upload/video/route.ts
//this file works in the following way: it uploads a video file to the server
import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionConfig } from '@/src/middleware/session';
import type { IronSessionData } from '@/src/types/session';
import { prisma } from '@/src/lib/prisma';

export async function POST(req: Request) {
  try {
    // Log each step
    console.log('Starting video upload...');
    
    const session = await getIronSession<IronSessionData>(req, NextResponse.next(), sessionConfig);
    if (!session.userId) {
      console.log('No session found');
      return new NextResponse('Unauthorized', { status: 401 });
    }
    console.log('Session found for user:', session.userId);
    

    const formData = await req.formData();
    const file = formData.get('video') as File;

    if (!file) {
      console.log('No file found in request');
      return NextResponse.json({ error: 'No video provided' }, { status: 400 });
    }
    
    console.log('Received file:', {
      name: file.name,
      type: file.type,
      size: file.size
    });
    const allowedVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-m4v'];

if (!allowedVideoTypes.includes(file.type)) {
  return NextResponse.json({ 
    error: 'Only MP4 and MOV videos are allowed' 
  }, { status: 400 });
}

    if (file.size > 100 * 1024 * 1024) {
      console.log('File too large:', file.size);
      return NextResponse.json({ error: 'Video must be less than 100MB' }, { status: 400 });
    }

    if (!['video/mp4', 'video/quicktime'].includes(file.type)) {
      console.log('Invalid file type:', file.type);
      return NextResponse.json({ error: 'Only MP4 and MOV videos allowed' }, { status: 400 });
    }

    console.log('Processing video file...');
    const buffer = await file.arrayBuffer();
    const base64Video = Buffer.from(buffer).toString('base64');
    const videoUrl = `data:${file.type};base64,${base64Video}`;
    console.log('Video processed, URL length:', videoUrl.length);

    try {
      const user = await prisma.user.update({
        where: { id: session.userId },
        data: { 
          portfolioVideo: videoUrl 
        },
        select: {
          id: true,
          portfolioVideo: true
        }
      });
      console.log('Database updated successfully');

      return NextResponse.json({ videoUrl: user.portfolioVideo });
    } catch (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

  } catch (error) {
    console.error('Video upload error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Upload failed',
      details: error
    }, { status: 500 });
  }
}