// src/middleware/rateLimiter.ts
//this file works in the following way: it limits the number of requests a user can make in a given time window
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: `${process.env.UPSTASH_REDIS_URL}`,
  token: `${process.env.UPSTASH_REDIS_TOKEN}`
});

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // Per window per IP

export function rateLimiterMiddleware(handler: (req: NextRequest) => Promise<NextResponse>) {
 return async function(req: NextRequest): Promise<NextResponse> {
   const ip = req.headers.get('x-forwarded-for') || 'unknown';
   const key = `ratelimit:${ip}`;
   
   try {
     const requests = await redis.incr(key);
     
     if (requests === 1) {
       await redis.expire(key, WINDOW_MS / 1000);
     }
     
     if (requests > MAX_REQUESTS) {
       return NextResponse.json(
         { error: 'Too many requests, please try again later' },
         { status: 429 }
       );
     }
     
     return handler(req);
     
   } catch (error) {
     console.error('Rate limiter error:', error);
     // Fail open if Redis is down
     return handler(req);
   }
 };
}