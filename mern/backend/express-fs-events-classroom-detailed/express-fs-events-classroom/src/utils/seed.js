/**
 * src/utils/seed.js
 * -----------------------------------------------------------------------------
 * Seed script for classroom demonstration.
 * Run: npm run seed
 */

const fs = require("fs/promises");
const { randomUUID } = require("crypto");
const { ensureDataFiles } = require("./ensureDataFiles");
const { ASYNC_NOTES_FILE, SYNC_NOTES_FILE, EVENT_LOG_FILE } = require("../config/paths");

function makeNotes(mode) {
  return [
    {
      id: randomUUID(),
      title: `${mode} note one`,
      body: "This note was created by the seed script.",
      mode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: randomUUID(),
      title: `${mode} note two`,
      body: "Use this data to test GET, PATCH, and DELETE.",
      mode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}

async function seed() {
  await ensureDataFiles();
  await fs.writeFile(ASYNC_NOTES_FILE, JSON.stringify(makeNotes("async"), null, 2), "utf8");
  await fs.writeFile(SYNC_NOTES_FILE, JSON.stringify(makeNotes("sync"), null, 2), "utf8");
  await fs.writeFile(EVENT_LOG_FILE, "", "utf8");
  console.log("Seed complete. Start server with: npm run dev");
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
