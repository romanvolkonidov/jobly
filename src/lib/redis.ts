import { Redis as UpstashRedis } from '@upstash/redis'

interface CustomRedis extends UpstashRedis {
  clearUserSession(userId: string): Promise<void>;
}

if (!process.env.UPSTASH_REDIS_URL || !process.env.UPSTASH_REDIS_TOKEN) {
  throw new Error('Missing Redis environment variables')
}

const redis = new UpstashRedis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
}) as CustomRedis;

redis.clearUserSession = async (userId: string) => {
  const keys = await redis.keys(`*:${userId}*`);
  if (keys.length) {
    await Promise.all(keys.map(key => redis.del(key)));
  }
};

export default redis;