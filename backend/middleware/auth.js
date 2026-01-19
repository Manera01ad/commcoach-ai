import { supabase, getUserById } from '../config/supabase.js';

/**
 * Supabase Authentication Middleware
 * Verifies Supabase JWT tokens and attaches user data to request
 */

/**
 * Verify Supabase token and attach user to request
 * Optional: if requireAuth is false, continues even without valid token
 */
export const authenticateToken = (requireAuth = true) => {
    return async (req, res, next) => {
        try {
            // Get token from Authorization header
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

            if (!token) {
                if (requireAuth) {
                    return res.status(401).json({
                        error: 'Authentication required',
                        message: 'No token provided'
                    });
                }
                return next(); // Continue without auth if not required
            }

            // Verify token with Supabase
            const { data: { user }, error } = await supabase.auth.getUser(token);

            if (error || !user) {
                if (requireAuth) {
                    return res.status(401).json({
                        error: 'Invalid token',
                        message: 'Authentication failed'
                    });
                }
                return next();
            }

            // Fetch full profile to get roles/subscription
            // Note: In a high-traffic app, you might want to cache this or encode it in custom claims
            const profile = await getUserById(user.id).catch(() => null);

            // Attach user data to request
            req.user = {
                id: user.id,
                email: user.email,
                ...profile, // includes admin, subscription_tier, status
                auth_user: user // keep original auth user object if needed
            };

            next();
        } catch (error) {
            console.error('Auth Middleware Error:', error);
            if (requireAuth) {
                return res.status(500).json({ error: 'Internal server error during authentication' });
            }
            next(error);
        }
    };
};

/**
 * Require admin role
 * Must be used after authenticateToken
 */
export const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            error: 'Authentication required'
        });
    }

    if (!req.user.admin) {
        return res.status(403).json({
            error: 'Admin access required',
            message: 'You do not have permission to access this resource'
        });
    }

    next();
};

/**
 * Require specific subscription tier
 * Must be used after authenticateToken
 */
export const requireTier = (minTier) => {
    const tierLevels = {
        'free': 0,
        'pro': 1,
        'enterprise': 2
    };

    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'Authentication required'
            });
        }

        const userTier = req.user.subscription_tier || 'free';
        const userTierLevel = tierLevels[userTier] || 0;
        const requiredTierLevel = tierLevels[minTier] || 0;

        if (userTierLevel < requiredTierLevel) {
            return res.status(403).json({
                error: 'Subscription upgrade required',
                message: `This feature requires ${minTier} tier or higher`,
                currentTier: userTier,
                requiredTier: minTier
            });
        }

        next();
    };
};
