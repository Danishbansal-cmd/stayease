import { redis } from './redis';
import { Ratelimit } from '@upstash/ratelimit';

export const loginRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),

    // analytics: true,
    prefix: "ratelimit:login",
})


export const signupRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "1 m"),

    prefix: "ratelimit:signup"
})

export const reviewRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),

    prefix: "ratelimit:review"
})

export const bookingRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),

    prefix: "ratelimit:booking"
})