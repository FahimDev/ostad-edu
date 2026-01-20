# ES6 Authentication API Demo

A modern Node.js authentication API built with ES6 modules, Express.js, JWT, and bcrypt. This project demonstrates clean architecture with separation of concerns using controllers, services, repositories, and middleware.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Project Maintenance](#project-maintenance)
- [ES6 Module Structure](#es6-module-structure)

## ✨ Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt password encryption
- **Clean Architecture** - Separation of concerns (Controllers → Services → Repositories)
- **Error Handling** - Centralized error handling middleware
- **ES6 Modules** - Modern JavaScript with import/export
- **Protected Routes** - Middleware-based route protection

## 📁 Project Structure

```
auth-api-demo/
├── src/
│   ├── app.js                 # Express app configuration
│   ├── controllers/           # Request handlers (HTTP layer)
│   │   └── authController.js
│   ├── services/              # Business logic layer
│   │   └── authService.js
│   ├── repositories/          # Data access layer
│   │   └── userRepository.js
│   ├── routes/                # Route definitions
│   │   └── authRoutes.js
│   ├── middleware/            # Custom middleware
│   │   ├── auth.js           # Authentication middleware
│   │   └── errorHandler.js   # Error handling middleware
│   └── utils/                 # Utility functions
│       └── token.js          # JWT token utilities
├── server.js                  # Application entry point
├── package.json               # Dependencies and scripts
├── env                       # Environment variables template
└── README.md                  # This file
```

## 🔧 Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn**
- Basic knowledge of REST APIs and ES6 JavaScript

## 🚀 Installation

### 1. Clone the repository

```bash
cd mern/backend/es6-auth-check/auth-api-demo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the `env` file to `.env`:

```bash
cp env .env
```

Or create a `.env` file manually with:

```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

**⚠️ Important:** Change `JWT_SECRET` to a strong, random string in production!

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port number | `3000` |
| `JWT_SECRET` | Secret key for JWT signing | `fallback-secret-key-CHANGE-IN-PRODUCTION` |
| `JWT_EXPIRES_IN` | Token expiration time | `24h` |
| `NODE_ENV` | Environment mode | `development` |

## 🏃 Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## 📡 API Endpoints

### Public Endpoints

#### 1. Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "role": "administrator",
      "email": "admin@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Protected Endpoints (Require JWT Token)

#### 2. Get User Profile
```bash
GET /api/auth/profile
Authorization: Bearer <your-jwt-token>
```

#### 3. Get Dashboard Data
```bash
GET /api/auth/dashboard
Authorization: Bearer <your-jwt-token>
```

### Example cURL Commands

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

**Get Profile (replace TOKEN with actual token):**
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

**Get Dashboard:**
```bash
curl -X GET http://localhost:3000/api/auth/dashboard \
  -H "Authorization: Bearer TOKEN"
```

## 🧪 Testing

### Test Credentials

- **Username:** `admin`
- **Password:** `admin`

### Quick Test Flow

1. **Login and save token:**
```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Token: $TOKEN"
```

2. **Use token for protected routes:**
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

## 🛠️ Project Maintenance

### Helpful CLI Commands for ES6 Project Structure

#### 1. **Create New Controller**
```bash
# Create a new controller file
touch src/controllers/newController.js

# Add basic controller template
cat > src/controllers/newController.js << 'EOF'
/**
 * New Controller
 * Description of what this controller handles
 */

export const methodName = async (req, res, next) => {
  try {
    // Controller logic here
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
EOF
```

#### 2. **Create New Service**
```bash
# Create a new service file
touch src/services/newService.js

# Add basic service template
cat > src/services/newService.js << 'EOF'
/**
 * New Service
 * Business logic for [feature]
 */

export const serviceMethod = async (params) => {
  // Business logic here
  return {};
};
EOF
```

#### 3. **Create New Repository**
```bash
# Create a new repository file
touch src/repositories/newRepository.js

# Add basic repository template
cat > src/repositories/newRepository.js << 'EOF'
/**
 * New Repository
 * Data access layer for [entity]
 */

const delay = (ms = 50) => new Promise(resolve => setTimeout(resolve, ms));

export const findById = async (id) => {
  await delay();
  // Database query logic here
  return null;
};
EOF
```

#### 4. **Create New Route File**
```bash
# Create a new route file
touch src/routes/newRoutes.js

# Add basic route template
cat > src/routes/newRoutes.js << 'EOF'
import express from 'express';
import * as newController from '../controllers/newController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', newController.methodName);

// Protected routes
router.post('/create', authenticate, newController.createMethod);

export default router;
EOF
```

#### 5. **Add Route to app.js**
```bash
# Add import and route registration
# Edit src/app.js and add:
# import newRoutes from './routes/newRoutes.js';
# app.use('/api/new', newRoutes);
```

#### 6. **Create New Middleware**
```bash
# Create a new middleware file
touch src/middleware/newMiddleware.js

# Add basic middleware template
cat > src/middleware/newMiddleware.js << 'EOF'
/**
 * New Middleware
 * Description of what this middleware does
 */
export const newMiddleware = async (req, res, next) => {
  try {
    // Middleware logic here
    next();
  } catch (error) {
    next(error);
  }
};
EOF
```

#### 7. **Create New Utility**
```bash
# Create a new utility file
touch src/utils/newUtil.js

# Add basic utility template
cat > src/utils/newUtil.js << 'EOF'
/**
 * New Utility
 * Description of utility functions
 */

export const utilityFunction = (params) => {
  // Utility logic here
  return {};
};
EOF
```

#### 8. **Check Project Structure**
```bash
# View project structure
tree -I 'node_modules' -L 3

# Or if tree is not installed:
find src -type f -name "*.js" | sort
```

#### 9. **Find All Imports/Exports**
```bash
# Find all export statements
grep -r "export" src/ --include="*.js"

# Find all import statements
grep -r "import" src/ --include="*.js"
```

#### 10. **Validate ES6 Module Syntax**
```bash
# Check for CommonJS require (should not exist in ES6 modules)
grep -r "require(" src/ --include="*.js" || echo "✓ No CommonJS require found"

# Check for module.exports (should not exist)
grep -r "module.exports" src/ --include="*.js" || echo "✓ No module.exports found"
```

#### 11. **Format and Lint (if configured)**
```bash
# Install ESLint for ES6 modules
npm install --save-dev eslint

# Create .eslintrc.json
cat > .eslintrc.json << 'EOF'
{
  "env": {
    "node": true,
    "es2022": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module"
  },
  "rules": {
    "no-unused-vars": "warn",
    "no-console": "off"
  }
}
EOF
```

#### 12. **Check for Circular Dependencies**
```bash
# Simple check for potential circular imports
# (Manual review recommended)
grep -r "from.*\.\./\.\./\.\." src/ --include="*.js"
```

#### 13. **Generate Project Documentation**
```bash
# List all exported functions
grep -rh "export" src/ --include="*.js" | \
  grep -E "(export const|export function|export default)" | \
  sed 's/export //' | sort
```

#### 14. **Clean and Reinstall**
```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 15. **Check for Missing Dependencies**
```bash
# Check for unused dependencies (requires depcheck)
npm install -g depcheck
depcheck
```

## 📐 ES6 Module Structure

### Import/Export Patterns

#### Named Exports
```javascript
// Export
export const functionName = () => {};
export const constantName = 'value';

// Import
import { functionName, constantName } from './module.js';
```

#### Default Exports
```javascript
// Export
export default router;

// Import
import router from './routes.js';
```

#### Mixed Exports
```javascript
// Export
export const namedExport = () => {};
export default defaultExport;

// Import
import defaultExport, { namedExport } from './module.js';
```

#### Namespace Imports
```javascript
// Import all exports as namespace
import * as authService from './services/authService.js';

// Use
authService.login({ username, password });
```

### File Naming Conventions

- Use **camelCase** for file names: `authController.js`
- Use **PascalCase** for classes (if any): `UserService.js`
- Keep file names **descriptive** and **singular**: `userRepository.js` not `usersRepository.js`

### Directory Structure Best Practices

1. **Controllers** - Handle HTTP requests/responses
2. **Services** - Contain business logic
3. **Repositories** - Handle data access
4. **Routes** - Define API endpoints
5. **Middleware** - Request processing functions
6. **Utils** - Reusable utility functions

## 🔒 Security Notes

- Always use environment variables for secrets
- Never commit `.env` files to version control
- Use strong JWT secrets in production
- Implement rate limiting for production
- Use HTTPS in production
- Validate and sanitize all inputs

## 📝 License

ISC

## 👤 Author

Your Name

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Happy Coding! 🚀**
