// app/api/messages/mark-read/route.ts
//this file works in the following way: it marks all messages in a conversation as read
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';


export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { conversationId } = await request.json();

    await prisma.message.updateMany({
      where: {
        taskId: conversationId,
        toUserId: session.user.id,
        isRead: false,
      },
      data: { isRead: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to mark messages as read' }, { status: 500 });
  }
}