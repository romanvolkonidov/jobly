// app/api/auth/register/route.ts
import { prisma } from '@/src/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    const user = await prisma.user.create({
      data: {
        email,
        password,
        name,
        imageUrl: null,
        aboutMe: '',
        location: null,
        isWorker: false,
        portfolioImages: [],
        portfolioVideo: null
      }
    });

    return NextResponse.json({ success: true, user });
  } catch  {
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    );
  }
}