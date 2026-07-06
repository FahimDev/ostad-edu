/**
 * src/config/paths.js
 * -----------------------------------------------------------------------------
 * path module theory:
 * - Never build file paths by string concatenation like: __dirname + "/data/file.json"
 * - Use path.join() or path.resolve() so your code works on Linux, macOS, and Windows.
 * - Linux/macOS use "/" while Windows commonly uses "\\".
 * - path.join() creates a normalized path using the correct separator for the OS.
 */

const path = require("path");

// process.cwd() means the folder from where the Node.js process was started.
// Here it should point to the project root.
const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, "data");

module.exports = {
  ROOT_DIR,
  DATA_DIR,
  ASYNC_NOTES_FILE: path.join(DATA_DIR, "notes-async.json"),
  SYNC_NOTES_FILE: path.join(DATA_DIR, "notes-sync.json"),
  EVENT_LOG_FILE: path.join(DATA_DIR, "event-log.txt")
};
