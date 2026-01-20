import bcrypt from 'bcryptjs';
import * as userRepository from '../repositories/userRepository.js';
import { generateToken } from '../utils/token.js';

/**
 * Login user with username and password
 * @param {Object} credentials - { username, password }
 * @returns {Promise<Object>} - { user, token }
 * @throws {Error} If credentials are invalid
 */
export const login = async ({ username, password }) => {
  // Business Logic 1: Validate input
  if (!username || !password) {
    const error = new Error('Username and password are required');
    error.statusCode = 400;
    throw error;
  }
  
  // Business Logic 2: Find user by username
  const user = await userRepository.findByUsername(username);
  
  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }
  
  // Business Logic 3: Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);
  
  if (!isValidPassword) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }
  
  // Business Logic 4: Generate JWT token
  const token = generateToken({
    id: user.id,
    username: user.username,
    role: user.role
  });
  
  // Business Logic 5: Return user without password
  const { password: _, ...userWithoutPassword } = user;
  
  return {
    user: userWithoutPassword,
    token
  };
};

/**
 * Get user profile by ID
 * @param {number} id 
 * @returns {Promise<Object>} User profile without password
 * @throws {Error} If user not found
 */
export const getUserProfile = async (id) => {
  const user = await userRepository.findById(id);
  
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  
  // Remove sensitive data
  const { password, ...userProfile } = user;
  return userProfile;
};

/**
 * Get dashboard data (example of protected resource)
 * @param {number} userId 
 * @returns {Promise<Object>} Dashboard data
 * @throws {Error} If user not found
 */
export const getDashboardData = async (userId) => {
  const user = await userRepository.findById(userId);
  
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  
  // Business logic: Prepare dashboard data
  const accountAgeDays = Math.floor(
    (new Date() - user.createdAt) / (1000 * 60 * 60 * 24)
  );
  
  return {
    welcome: `Welcome back, ${user.username}!`,
    role: user.role,
    stats: {
      loginCount: 42, // In real app, track this in database
      lastLogin: new Date(),
      accountAge: `${accountAgeDays} days`
    }
  };
};