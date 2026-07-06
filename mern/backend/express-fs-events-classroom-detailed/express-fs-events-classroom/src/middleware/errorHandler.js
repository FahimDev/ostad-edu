/**
 * src/middleware/errorHandler.js
 * -----------------------------------------------------------------------------
 * Express error-handling theory:
 * - A middleware with four parameters is treated as an error handler.
 * - Signature: (err, req, res, next)
 * - async route errors should be passed to next(error).
 */

function notFoundHandler(req, res) {
  res.status(404).json({
    error: "Route not found",
    method: req.method,
    path: req.originalUrl
  });
}

function errorHandler(err, req, res, next) {
  console.error("[error]", err);

  res.status(500).json({
    error: "Internal Server Error",
    message: err.message
  });
}

module.exports = { notFoundHandler, errorHandler };
