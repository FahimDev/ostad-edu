import * as authService from '../services/authService.js';

/**
 * Login controller
 * POST /api/auth/login
 * Body: { username, password }
 */
export const login = async (req, res, next) => {
  try {
    // Extract data from request body (ES6 destructuring)
    const { username, password } = req.body;
    
    // Call service layer (business logic)
    const result = await authService.login({ username, password });
    
    // Send HTTP response
    res.json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    next(error); // Pass to error handler middleware
  }
};

/**
 * Get profile controller (protected route)
 * GET /api/auth/profile
 * Requires:  Authorization header with JWT token
 */
export const getProfile = async (req, res, next) => {
  try {
    // req.user is set by authentication middleware
    const userId = req.user.id;
    
    // Call service layer
    const profile = await authService. getUserProfile(userId);
    
    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get dashboard controller (protected route)
 * GET /api/auth/dashboard
 * Requires: Authorization header with JWT token
 */
export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Call service layer
    const dashboard = await authService.getDashboardData(userId);
    
    res.json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    next(error);
  }
};