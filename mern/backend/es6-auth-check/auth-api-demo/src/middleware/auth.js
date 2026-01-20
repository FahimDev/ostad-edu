import { verifyToken } from '../utils/token.js';

/**
 * Authentication middleware
 * Verifies JWT token and attaches user info to request
 * Use this middleware on protected routes
 */
export const authenticate = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const { authorization } = req.headers;
    
    if (!authorization) {
      const error = new Error('No token provided');
      error.statusCode = 401;
      throw error;
    }
    
    // Check Bearer format:  "Bearer <token>"
    const [scheme, token] = authorization.split(' ');
    
    if (scheme !== 'Bearer' || !token) {
      const error = new Error('Invalid token format.  Use:  Bearer <token>');
      error.statusCode = 401;
      throw error;
    }
    
    // Verify token and decode payload
    const decoded = verifyToken(token);
    
    // Attach user info to request object
    // Controllers can now access req.user
    req.user = decoded;
    
    // Continue to next middleware/controller
    next();
  } catch (error) {
    next(error); // Pass to error handler
  }
};