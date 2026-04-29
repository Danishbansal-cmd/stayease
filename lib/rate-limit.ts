import { redis } from './redis';
import { Ratelimit } from '@upstash/ratelimit';

export const loginRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),

    // analytics: true,
    prefix: "ratelimit:login",
})
