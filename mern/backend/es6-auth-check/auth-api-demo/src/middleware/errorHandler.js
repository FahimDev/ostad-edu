/**
 * Global error handler middleware
 * This catches all errors thrown in the application
 * Must be the LAST middleware in app.js
 */
export const errorHandler = (err, req, res, next) => {
  // Default to 500 if no status code is set
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Log error (in production, use proper logging service)
  console.error(`❌ Error [${statusCode}]:  ${message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }
  
  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      // Only show stack trace in development
      //.. .(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};