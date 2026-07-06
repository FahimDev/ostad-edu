/**
 * server.js
 * -----------------------------------------------------------------------------
 * Entry point of the application.
 * In real projects, keep server bootstrapping separate from app configuration.
 * This makes the Express app easier to test later.
 */

const app = require("./src/app");
const { ensureDataFiles } = require("./src/utils/ensureDataFiles");
const appEvents = require("./src/events/appEvents");
require("./src/events/listeners");

const PORT = process.env.PORT || 5000;

async function startServer() {
  // Before accepting requests, ensure the JSON files exist.
  // This avoids "file not found" errors during the first class run.
  await ensureDataFiles();

  app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}`);

    // EventEmitter demo: the server does not directly write to event-log.txt.
    // It only emits an event. A listener handles the side effect.
    appEvents.emit("server:started", { port: PORT, at: new Date().toISOString() });
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
