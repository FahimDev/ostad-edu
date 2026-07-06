/**
 * src/app.js
 * -----------------------------------------------------------------------------
 * Express app configuration.
 * Express is used here only as a lightweight HTTP API layer.
 * Our main learning focus is Node.js core modules:
 * 1. fs      -> read/write/update/delete files
 * 2. events  -> publish/subscribe style communication using EventEmitter
 * 3. path    -> safe cross-platform file path construction
 */

const express = require("express");
const notesAsyncRoutes = require("./routes/notesAsyncRoutes");
const notesSyncRoutes = require("./routes/notesSyncRoutes");
const pathRoutes = require("./routes/pathRoutes");
const eventRoutes = require("./routes/eventRoutes");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const app = express();

// express.json() parses JSON request bodies and attaches them to req.body.
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Express FS + Events Classroom Project",
    modules: ["fs", "events", "path"],
    docs: {
      asyncCrud: "/api/async-notes",
      syncCrud: "/api/sync-notes",
      pathDemo: "/api/path/inspect?filename=notes.txt",
      eventLog: "/api/events/logs"
    }
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.use("/api/async-notes", notesAsyncRoutes);
app.use("/api/sync-notes", notesSyncRoutes);
app.use("/api/path", pathRoutes);
app.use("/api/events", eventRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
