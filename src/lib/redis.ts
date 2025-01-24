import { Redis } from '@upstash/redis'

const getRedisClient = () => {
  if (!process.env.UPSTASH_REDIS_URL || !process.env.UPSTASH_REDIS_TOKEN) {
    throw new Error('Redis credentials not configured')
  }
  
  return new Redis({
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REDIS_TOKEN,
    retry: {
      retries: 3,
      backoff: (retryCount) => Math.min(retryCount * 1000, 3000)
    }
  })
}

export const redis = getRedisClient()