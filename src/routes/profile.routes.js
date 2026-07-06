const express = require("express");
const { users } = require("../data/memoryStore");
const { authRequired } = require("../middleware/auth");

const router = express.Router();

// Select User Profile
// Profile routes are protected because profile data belongs to the logged-in user.
router.get("/me", authRequired, (req, res) => {
  res.json({
    success: true,
    message: "Profile selected successfully",
    data: req.user
  });
});

// Update User Profile
// Real project: validate fields -> update DB -> return updated safe profile.
router.patch("/me", authRequired, (req, res) => {
  const user = users.find((item) => item.id === req.user.id);

  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  const allowedFields = ["name", "phone", "bio"];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) user[field] = req.body[field];
  });

  const { password, ...safeUser } = user;

  res.json({
    success: true,
    message: "Profile updated successfully",
    data: safeUser
  });
});

module.exports = router;
