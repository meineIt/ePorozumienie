/**
 * Rate limiter z obsługą Redis (produkcja) i Map (development)
 * W produkcji używa Redis dla rozproszonego rate limitingu
 * W development używa Map w pamięci
 */

import { logRateLimitExceeded } from '@/lib/utils/securityLogger';

interface RateLimitOptions {
  interval: number; // w milisekundach
  uniqueTokenPerInterval: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Store dla development (Map w pamięci)
const memoryStore = new Map<string, RateLimitEntry>();

// Redis client (lazy initialization)
let redisClient: any = null;

async function getRedisClient() {
  if (redisClient) {
    return redisClient;
  }

  // Tylko w produkcji próbuj użyć Redis
  if (process.env.NODE_ENV === 'production' && process.env.REDIS_URL) {
    try {
      // Dynamiczny import Redis (opcjonalna zależność)
      const { createClient } = await import('redis');
      redisClient = createClient({
        url: process.env.REDIS_URL,
      });
      
      redisClient.on('error', (err: Error) => {
        console.error('Redis Client Error:', err);
        redisClient = null; // Fallback do memory store
      });
      
      await redisClient.connect();
      return redisClient;
    } catch (error) {
      console.warn('Redis not available, falling back to memory store:', error);
      redisClient = null;
    }
  }

  return null;
}

async function getCount(key: string): Promise<number> {
  const client = await getRedisClient();
  
  if (client) {
    try {
      const count = await client.get(key);
      return count ? parseInt(count, 10) : 0;
    } catch (error) {
      console.error('Redis get error:', error);
      // Fallback do memory store
      const entry = memoryStore.get(key);
      return entry ? entry.count : 0;
    }
  }
  
  // Memory store
  const entry = memoryStore.get(key);
  return entry ? entry.count : 0;
}

async function incrementCount(key: string, ttl: number): Promise<number> {
  const client = await getRedisClient();
  
  if (client) {
    try {
      const count = await client.incr(key);
      if (count === 1) {
        await client.expire(key, Math.ceil(ttl / 1000));
      }
      return count;
    } catch (error) {
      console.error('Redis increment error:', error);
      // Fallback do memory store
      return incrementMemoryCount(key, ttl);
    }
  }
  
  // Memory store
  return incrementMemoryCount(key, ttl);
}

function incrementMemoryCount(key: string, ttl: number): number {
  const now = Date.now();
  const entry = memoryStore.get(key);

  if (!entry || now > entry.resetTime) {
    memoryStore.set(key, {
      count: 1,
      resetTime: now + ttl,
    });
    return 1;
  }

  entry.count++;
  return entry.count;
}

async function getResetTime(key: string): Promise<number> {
  const client = await getRedisClient();
  
  if (client) {
    try {
      const ttl = await client.ttl(key);
      if (ttl > 0) {
        return Date.now() + (ttl * 1000);
      }
      return Date.now();
    } catch (error) {
      console.error('Redis TTL error:', error);
      // Fallback do memory store
      const entry = memoryStore.get(key);
      return entry ? entry.resetTime : Date.now();
    }
  }
  
  // Memory store
  const entry = memoryStore.get(key);
  return entry ? entry.resetTime : Date.now();
}

export function rateLimit(options: RateLimitOptions) {
  return {
    async check(limit: number, token: string, request?: { headers: Headers; url?: string }, userId?: string): Promise<void> {
      // Jeśli userId jest dostępny, użyj kombinacji IP:userId jako klucza
      // W przeciwnym razie użyj tylko token (IP) - backward compatible
      const rateLimitKey = userId ? `${token}:${userId}` : token;
      const key = `rate_limit:${rateLimitKey}`;
      const now = Date.now();
      
      const count = await getCount(key);
      const resetTime = await getResetTime(key);

      if (count >= limit) {
        const retryAfter = Math.ceil((resetTime - now) / 1000);
        logRateLimitExceeded(
          `Rate limit exceeded for token: ${rateLimitKey.substring(0, 8)}...`,
          request,
          {
            limit,
            count,
            retryAfter,
            token: rateLimitKey.substring(0, 8) + '...', // Loguj tylko prefix tokenu dla bezpieczeństwa
          }
        );
        throw new Error(`Rate limit exceeded. Retry after ${retryAfter} seconds`);
      }

      await incrementCount(key, options.interval);
    },
  };
}

// Czyszczenie starych wpisów z memory store co 5 minut (tylko dla development)
if (process.env.NODE_ENV !== 'production') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of memoryStore.entries()) {
      if (now > entry.resetTime) {
        memoryStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}


