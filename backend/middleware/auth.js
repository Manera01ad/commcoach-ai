import jwt from 'jsonwebtoken';

/**
 * JWT Authentication Middleware
 * Verifies JWT tokens and attaches user data to request
 */

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Verify JWT token and attach user to request
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

            // Verify token
            const decoded = jwt.verify(token, JWT_SECRET);

            // Attach user data to request
            req.user = {
                id: decoded.userId,
                email: decoded.email,
                subscription_tier: decoded.subscription_tier || 'free',
                admin: decoded.admin || false
            };

            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    error: 'Token expired',
                    message: 'Please sign in again'
                });
            }

            if (error.name === 'JsonWebTokenError') {
                return res.status(403).json({
                    error: 'Invalid token',
                    message: 'Authentication failed'
                });
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

        const userTierLevel = tierLevels[req.user.subscription_tier] || 0;
        const requiredTierLevel = tierLevels[minTier] || 0;

        if (userTierLevel < requiredTierLevel) {
            return res.status(403).json({
                error: 'Subscription upgrade required',
                message: `This feature requires ${minTier} tier or higher`,
                currentTier: req.user.subscription_tier,
                requiredTier: minTier
            });
        }

        next();
    };
};

/**
 * Generate JWT token
 */
export const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user.id,
            email: user.email,
            subscription_tier: user.subscription_tier || 'free',
            admin: user.admin || false
        },
        JWT_SECRET,
        { expiresIn: '7d' } // Token expires in 7 days
    );
};

/**
 * Verify and decode token without middleware
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};
