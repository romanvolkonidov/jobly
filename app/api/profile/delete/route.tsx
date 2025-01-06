// app/api/profile/delete/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth-options";
import { verifyToken } from '@/src/lib/csrf';

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const csrfToken = request.headers.get('x-csrf-token');
    if (!csrfToken || !verifyToken(csrfToken)) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
    }

    await prisma.$transaction([
      // Delete reviews
      prisma.review.deleteMany({
        where: { OR: [{ fromUserId: session.user.id }, { toUserId: session.user.id }] }
      }),
      // Delete bot-related data
      prisma.botConversation.deleteMany({ where: { userId: session.user.id } }),
      prisma.botFile.deleteMany({
        where: { project: { userId: session.user.id } }
      }),
      prisma.botProject.deleteMany({ where: { userId: session.user.id } }),
      // Delete messages
      prisma.message.deleteMany({
        where: { OR: [{ fromUserId: session.user.id }, { toUserId: session.user.id }] }
      }),
      // Delete bids
      prisma.bid.deleteMany({ where: { userId: session.user.id } }),
      // Delete tasks
      prisma.task.deleteMany({ where: { userId: session.user.id } }),
      // Finally delete user
      prisma.user.delete({ where: { id: session.user.id } })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json(
      { error: 'Failed to delete account. Please try again later.' },
      { status: 500 }
    );
  }
}