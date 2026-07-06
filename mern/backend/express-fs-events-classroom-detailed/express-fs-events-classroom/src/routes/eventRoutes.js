/**
 * src/routes/eventRoutes.js
 * -----------------------------------------------------------------------------
 * Event module demonstration routes.
 * These routes help students see EventEmitter in action.
 */

const express = require("express");
const fs = require("fs/promises");
const appEvents = require("../events/appEvents");
const { EVENT_LOG_FILE } = require("../config/paths");

const router = express.Router();

router.post("/demo", (req, res) => {
  const payload = {
    message: req.body.message || "Hello EventEmitter",
    triggeredFrom: "POST /api/events/demo"
  };

  appEvents.emit("demo:ping", payload);

  res.json({
    message: "demo:ping event emitted",
    payload
  });
});

router.get("/logs", async (req, res, next) => {
  try {
    const raw = await fs.readFile(EVENT_LOG_FILE, "utf8");
    const lines = raw.trim().split("\n").filter(Boolean).map((line) => JSON.parse(line));
    res.json({ count: lines.length, data: lines });
  } catch (error) {
    next(error);
  }
});

router.delete("/logs", async (req, res, next) => {
  try {
    await fs.writeFile(EVENT_LOG_FILE, "", "utf8");
    res.json({ message: "Event log cleared" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
