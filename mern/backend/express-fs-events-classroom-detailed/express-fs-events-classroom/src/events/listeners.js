/**
 * src/events/listeners.js
 * -----------------------------------------------------------------------------
 * Event listener theory:
 * - .on(eventName, listener) registers a listener.
 * - .emit(eventName, payload) triggers all listeners for that event.
 * - EventEmitter listeners run synchronously by default in registration order.
 * - Here, listener starts async file append operation, but the emit call itself
 *   still calls listeners synchronously.
 */

const fs = require("fs/promises");
const appEvents = require("./appEvents");
const { EVENT_LOG_FILE } = require("../config/paths");

async function appendEventLog(type, payload) {
  const line = JSON.stringify({ type, payload, at: new Date().toISOString() }) + "\n";
  await fs.appendFile(EVENT_LOG_FILE, line, "utf8");
}

appEvents.on("server:started", async (payload) => {
  console.log("[event] server:started", payload);
  await appendEventLog("server:started", payload);
});

appEvents.on("note:created", async (payload) => {
  console.log("[event] note:created", payload.note.id);
  await appendEventLog("note:created", payload);
});

appEvents.on("note:updated", async (payload) => {
  console.log("[event] note:updated", payload.note.id);
  await appendEventLog("note:updated", payload);
});

appEvents.on("note:deleted", async (payload) => {
  console.log("[event] note:deleted", payload.id);
  await appendEventLog("note:deleted", payload);
});

appEvents.on("demo:ping", async (payload) => {
  console.log("[event] demo:ping", payload);
  await appendEventLog("demo:ping", payload);
});

module.exports = appEvents;
