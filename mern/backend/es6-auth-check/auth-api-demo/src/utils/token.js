import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-CHANGE-IN-PRODUCTION';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Generate JWT token
 * @param {Object} payload - Data to encode in token (user info)
 * @returns {string} JWT token
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

/**
 * Verify and decode JWT token
 * @param {string} token 
 * @returns {Object} Decoded payload
 * @throws {Error} If token is invalid or expired
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    const err = new Error('Invalid or expired token');
    err.statusCode = 401;
    throw err;
  }
};