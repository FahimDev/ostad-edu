const errorHandler = (err, req, res, next) => {
  console.error({
    message: err.message,
    method: req.method,
    path: req.originalUrl,
  });

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

module.exports = errorHandler;