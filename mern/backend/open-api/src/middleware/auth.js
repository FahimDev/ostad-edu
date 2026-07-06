const jwt = require("jsonwebtoken");
const { users } = require("../data/memoryStore");

// Authentication middleware concept:
// 1. Read Authorization header
// 2. Extract Bearer token
// 3. Verify token signature and expiry
// 4. Attach authenticated user to req.user
// 5. Allow route handler to continue
function authRequired(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Missing Bearer token. Use Authorization: Bearer <token>"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    const user = users.find((item) => item.id === decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: "Token user not found" });
    }

    // Remove password before attaching user to request.
    const { password, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
}

module.exports = { authRequired };
