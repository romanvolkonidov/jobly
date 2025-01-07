// app/api/profile/portfolio-image/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth-options";
import { prisma } from '@/src/lib/prisma';
import { revalidatePath } from 'next/cache';

// app/api/profile/portfolio-image/route.ts

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    // Convert file to buffer and then to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const imageUrl = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Update user with new image
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        portfolioImages: {
          push: imageUrl
        }
      },
      select: { portfolioImages: true }
    });

    revalidatePath('/profile');
    return NextResponse.json({
      imageUrl,
      portfolioImages: updatedUser.portfolioImages
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  
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
      data: { 
        portfolioImages: {
          set: updatedImages
        }
      },
    });

    revalidatePath('/profile');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Portfolio image deletion error:', error);
    return NextResponse.json({ error: 'Deletion failed' }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { portfolioImages: true }
    });

    return NextResponse.json({
      portfolioImages: user?.portfolioImages || []
    });

  } catch (error) {
    console.error('Error fetching portfolio images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio images' },
      { status: 500 }
    );
  }
}

