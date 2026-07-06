/**
 * src/utils/ensureDataFiles.js
 * -----------------------------------------------------------------------------
 * Utility script to make the project stable for classroom use.
 * If a student deletes a data file accidentally, the server recreates it.
 */

const fs = require("fs/promises");
const { DATA_DIR, ASYNC_NOTES_FILE, SYNC_NOTES_FILE, EVENT_LOG_FILE } = require("../config/paths");

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function ensureDataFiles() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  if (!(await fileExists(ASYNC_NOTES_FILE))) {
    await fs.writeFile(ASYNC_NOTES_FILE, "[]\n", "utf8");
  }

  if (!(await fileExists(SYNC_NOTES_FILE))) {
    await fs.writeFile(SYNC_NOTES_FILE, "[]\n", "utf8");
  }

  if (!(await fileExists(EVENT_LOG_FILE))) {
    await fs.writeFile(EVENT_LOG_FILE, "", "utf8");
  }
}

module.exports = { ensureDataFiles };
