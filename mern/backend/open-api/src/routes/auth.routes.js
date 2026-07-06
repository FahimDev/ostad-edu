const express = require("express");
const jwt = require("jsonwebtoken");
const { users } = require("../data/memoryStore");
const { authRequired } = require("../middleware/auth");

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "dev-secret",
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );
}

// User Registration
// Real project flow: validate input -> check duplicate email -> hash password -> save DB -> send verification email.
router.post("/register", (req, res) => {
  const { name = "New User", email = "newuser@example.com", password = "password123" } = req.body;

  const user = {
    id: `user_${Date.now()}`,
    name,
    email,
    password, // Demo only. Real project: bcrypt.hash(password, saltRounds)
    phone: req.body.phone || null,
    role: "student",
    emailVerified: false,
    bio: "",
    createdAt: new Date().toISOString()
  };

  users.push(user);

  res.status(201).json({
    success: true,
    message: "Registration successful. Please verify your email.",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      verificationHint: "Use OTP 123456 for demo verification."
    }
  });
});

// Login + Token Generation
// Real project flow: find user by email -> bcrypt.compare(password, hash) -> issue JWT.
router.post("/login", (req, res) => {
  const { email = "student@example.com", password = "password123" } = req.body;
  const user = users.find((item) => item.email === email && item.password === password);

  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  const token = signToken(user);
  const { password: ignoredPassword, ...safeUser } = user;

  res.json({
    success: true,
    message: "Login successful",
    data: {
      tokenType: "Bearer",
      accessToken: token,
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      user: safeUser
    }
  });
});

// Login Token Verification
router.get("/verify-token", authRequired, (req, res) => {
  res.json({
    success: true,
    message: "Token is valid",
    data: { user: req.user }
  });
});

// Email Verification
// Real project: send signed email link or OTP through email service.
router.post("/email/verify", (req, res) => {
  const { email = "student@example.com", otp = "123456" } = req.body;
  const user = users.find((item) => item.email === email);

  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  if (otp !== "123456") return res.status(400).json({ success: false, message: "Invalid OTP" });

  user.emailVerified = true;

  res.json({
    success: true,
    message: "Email verified successfully",
    data: { email: user.email, emailVerified: user.emailVerified }
  });
});

// OTP Verification
router.post("/otp/verify", (req, res) => {
  const { purpose = "login", otp = "123456" } = req.body;

  if (otp !== "123456") {
    return res.status(400).json({ success: false, message: "OTP verification failed" });
  }

  res.json({
    success: true,
    message: "OTP verified successfully",
    data: { purpose, verified: true }
  });
});

// Reset User Password
// Real project flow: verify reset token/OTP -> hash new password -> update DB.
router.post("/password/reset", (req, res) => {
  const { email = "student@example.com", otp = "123456", newPassword = "newpassword123" } = req.body;
  const user = users.find((item) => item.email === email);

  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  if (otp !== "123456") return res.status(400).json({ success: false, message: "Invalid reset OTP" });

  user.password = newPassword;

  res.json({
    success: true,
    message: "Password reset successful",
    data: { email: user.email }
  });
});

module.exports = router;
