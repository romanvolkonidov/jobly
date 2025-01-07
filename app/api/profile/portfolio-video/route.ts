import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth-options';
import { prisma } from '@/src/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { portfolioVideo: null },
    });

    revalidatePath('/profile');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Video deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to remove video' },
      { status: 500 }
    );
  }
}
