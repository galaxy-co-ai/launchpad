import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  console.warn("[RateLimit] Upstash credentials missing - rate limiting disabled");
}

const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

// Default rate limiter: 100 requests per 10 seconds
export const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, "10 s"),
      analytics: true,
      prefix: "api:ratelimit",
    })
  : {
      // Fallback when Redis not configured (dev mode)
      limit: async (_identifier: string) => ({
        success: true,
        limit: 100,
        remaining: 99,
        reset: Date.now() + 10000,
      }),
    };

// Stricter limiter for expensive operations
export const strictRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "60 s"),
      analytics: true,
      prefix: "api:ratelimit:strict",
    })
  : {
      limit: async (_identifier: string) => ({
        success: true,
        limit: 10,
        remaining: 9,
        reset: Date.now() + 60000,
      }),
    };
