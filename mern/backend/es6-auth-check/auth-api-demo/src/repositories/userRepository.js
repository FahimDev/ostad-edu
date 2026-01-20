import bcrypt from 'bcryptjs';

// Static user database (simulates real database)
// In production, this would be MongoDB, PostgreSQL, etc.
const STATIC_USERS = [
  {
    id: 1,
    username: 'admin',
    // Pre-hashed password for "admin" (bcrypt hash of "admin")
    password: '$2b$10$BS3ximwlp1.7D26Ug9zqTuUPEC4zAeInjfzdp1rfVA1DWa20ZN1xG',
    role: 'administrator',
    email: 'admin@example.com',
    createdAt: new Date('2024-01-01')
  }
];

// Simulate async database operation (real databases are async)
const delay = (ms = 50) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Find user by username
 * @param {string} username 
 * @returns {Promise<Object|null>}
 */
export const findByUsername = async (username) => {
  await delay(); // Simulate database latency
  
  const user = STATIC_USERS.find(u => u.username === username);
  return user || null;
};

/**
 * Find user by ID
 * @param {number} id 
 * @returns {Promise<Object|null>}
 */
export const findById = async (id) => {
  await delay();
  
  const user = STATIC_USERS.find(u => u.id === id);
  return user || null;
};

/**
 * Get all users (for debugging)
 * @returns {Promise<Array>}
 */
export const findAll = async () => {
  await delay();
  // Return users without passwords
  return STATIC_USERS.map(({ password, ...user }) => user);
};