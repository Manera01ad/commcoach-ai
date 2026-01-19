import rateLimit from 'express-rate-limit';

/**
 * Rate limiting middleware with tier-based limits
 * - Free tier: 10 requests/minute
 * - Pro tier: 100 requests/minute
 * - Enterprise tier: unlimited (very high limit)
 * - Unauthenticated: 5 requests/minute (IP-based)
 */

// Default rate limiter for unauthenticated requests
export const defaultLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // 5 requests per minute
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: '1 minute'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// API rate limiter for authenticated requests
export const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: async (req) => {
        // Check user's subscription tier from req.user (set by auth middleware)
        const user = req.user;

        if (!user) return 5; // Unauthenticated fallback

        switch (user.subscription_tier) {
            case 'enterprise':
                return 10000; // Effectively unlimited
            case 'pro':
                return 100;
            case 'free':
            default:
                return 10;
        }
    },
    message: (req) => {
        const user = req.user;
        const tier = user?.subscription_tier || 'free';
        return {
            error: `Rate limit exceeded for ${tier} tier`,
            tier,
            retryAfter: '1 minute',
            upgrade: tier === 'free' ? 'Upgrade to Pro for 100 requests/minute' : null
        };
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Use user ID for rate limiting if authenticated, otherwise IP
    keyGenerator: (req) => {
        return req.user?.id || req.ip;
    }
});

// Strict rate limiter for expensive operations (AI generation, voice synthesis)
export const strictLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: async (req) => {
        const user = req.user;

        if (!user) return 2; // Very limited for unauthenticated

        switch (user.subscription_tier) {
            case 'enterprise':
                return 1000;
            case 'pro':
                return 50;
            case 'free':
            default:
                return 5;
        }
    },
    message: {
        error: 'AI generation rate limit exceeded',
        retryAfter: '1 minute'
    },
    keyGenerator: (req) => req.user?.id || req.ip
});
