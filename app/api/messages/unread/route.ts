
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { getServerSession } from "next-auth";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '1 m'),
});

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Rest of the code remains the same

    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const { success, limit, reset, remaining } = await ratelimit.limit(
      `messages_${session.user.id}_${ip}`
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Too Many Requests' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          },
        }
      );
    }

    const count = await prisma.message.count({
      where: {
        toUserId: session.user.id,
        fromUserId: { not: session.user.id },
        isRead: false,
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}