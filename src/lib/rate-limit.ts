// src/lib/rate-limit.ts
import { redis } from './redis';
import { Ratelimit } from '@upstash/ratelimit';

export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'),
});
