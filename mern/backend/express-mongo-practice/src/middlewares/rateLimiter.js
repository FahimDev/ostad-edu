const rateLimit = require("express-rate-limit");

const productCreateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  message: {
    success: false,
    message: "Too many product creation requests. Please try again later.",
  },
});

module.exports = {
  productCreateLimiter,
};