/**
 * Role-Based Access Control Middleware
 * Ensures user has required role(s) to access endpoint
 */
export const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Insufficient permissions',
                required: allowedRoles,
                current: req.user.role
            });
        }

        next();
    };
};

/**
 * Doctor-only access
 */
export const requireDoctor = requireRole('DOCTOR');

/**
 * User-only access
 */
export const requireUser = requireRole('USER');

/**
 * Either role can access
 */
export const requireAuthenticated = requireRole('USER', 'DOCTOR');
