const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided. Use Authorization: Bearer <token>" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user || !user.active) {
      return res.status(401).json({ error: "User no longer exists or is inactive" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalid or expired" });
  }
}

module.exports = { protect };
