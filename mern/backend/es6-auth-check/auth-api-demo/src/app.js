import express from 'express';
import authRoutes from './routes/authRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Auth API Demo',
    endpoints: {
      login: 'POST /api/auth/login',
      profile: 'GET /api/auth/profile (protected)',
      dashboard: 'GET /api/auth/dashboard (protected)'
    },
    credentials: {
      username: 'admin',
      password: 'admin'
    },
    example: {
      login: {
        method: 'POST',
        url: '/api/auth/login',
        body: {
          username: 'admin',
          password: 'admin'
        }
      }
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

// API routes
app.use('/api/auth', authRoutes);

// 404 handler (for undefined routes)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { 
      message: `Route ${req.method} ${req.originalUrl} not found` 
    }
  });
});

// Error handling middleware (MUST be last)
app.use(errorHandler);

export default app;

// import express from 'express';

// const app = express();

// // Middleware to parse JSON
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Test route
// app.get('/', (req, res) => {
//   res.json({
//     message: 'Welcome to Auth API Demo',
//     status: 'Server is running!'
//   });
// });

// // Health check
// app.get('/health', (req, res) => {
//   res.json({ 
//     status: 'ok', 
//     // ISO 8601
//     timestamp: new Date().toISOString() 
//   });
// });

// export default app;