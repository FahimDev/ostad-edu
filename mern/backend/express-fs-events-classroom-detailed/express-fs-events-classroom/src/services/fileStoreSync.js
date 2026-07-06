/**
 * src/services/fileStoreSync.js
 * -----------------------------------------------------------------------------
 * Sync fs theory:
 * - readFileSync() and writeFileSync() block the current JavaScript thread.
 * - Blocking means Node.js cannot process another request on the main thread
 *   until the operation finishes.
 * - Sync fs is acceptable for startup scripts, CLI tools, or tiny demos.
 * - Avoid sync fs in high-traffic HTTP route handlers.
 *
 * This file intentionally uses sync operations for classroom comparison.
 */

const fs = require("fs");
const { randomUUID } = require("crypto");
const { SYNC_NOTES_FILE } = require("../config/paths");

function readNotesSync() {
  const raw = fs.readFileSync(SYNC_NOTES_FILE, "utf8");
  return JSON.parse(raw || "[]");
}

function writeNotesSync(notes) {
  fs.writeFileSync(SYNC_NOTES_FILE, JSON.stringify(notes, null, 2), "utf8");
}

function getAllNotesSync() {
  return readNotesSync();
}

function getNoteByIdSync(id) {
  const notes = readNotesSync();
  return notes.find((note) => note.id === id) || null;
}

function createNoteSync({ title, body }) {
  const notes = readNotesSync();

  const note = {
    id: randomUUID(),
    title,
    body: body || "",
    mode: "sync",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  notes.push(note);
  writeNotesSync(notes);
  return note;
}

function updateNoteSync(id, changes) {
  const notes = readNotesSync();
  const index = notes.findIndex((note) => note.id === id);

  if (index === -1) return null;

  notes[index] = {
    ...notes[index],
    ...changes,
    updatedAt: new Date().toISOString()
  };

  writeNotesSync(notes);
  return notes[index];
}

function deleteNoteSync(id) {
  const notes = readNotesSync();
  const note = notes.find((item) => item.id === id);

  if (!note) return null;

  const remaining = notes.filter((item) => item.id !== id);
  writeNotesSync(remaining);
  return note;
}

module.exports = {
  getAllNotesSync,
  getNoteByIdSync,
  createNoteSync,
  updateNoteSync,
  deleteNoteSync
};
