/**
 * src/services/fileStoreAsync.js
 * -----------------------------------------------------------------------------
 * Async fs theory:
 * - fs/promises gives promise-based file operations.
 * - async/await keeps code readable while remaining non-blocking for I/O.
 * - File reading/writing is slow compared to normal JS execution.
 * - In web servers, async file operations are preferred because they do not block
 *   the main event loop while waiting for disk I/O.
 */

const fs = require("fs/promises");
const { randomUUID } = require("crypto");
const { ASYNC_NOTES_FILE } = require("../config/paths");

async function readNotes() {
  const raw = await fs.readFile(ASYNC_NOTES_FILE, "utf8");
  return JSON.parse(raw || "[]");
}

async function writeNotes(notes) {
  // JSON.stringify(data, null, 2) makes the JSON file human-readable for class demo.
  await fs.writeFile(ASYNC_NOTES_FILE, JSON.stringify(notes, null, 2), "utf8");
}

async function getAllNotes() {
  return readNotes();
}

async function getNoteById(id) {
  const notes = await readNotes();
  return notes.find((note) => note.id === id) || null;
}

async function createNote({ title, body }) {
  const notes = await readNotes();

  const note = {
    id: randomUUID(),
    title,
    body: body || "",
    mode: "async",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  notes.push(note);
  await writeNotes(notes);
  return note;
}

async function updateNote(id, changes) {
  const notes = await readNotes();
  const index = notes.findIndex((note) => note.id === id);

  if (index === -1) return null;

  notes[index] = {
    ...notes[index],
    ...changes,
    updatedAt: new Date().toISOString()
  };

  await writeNotes(notes);
  return notes[index];
}

async function deleteNote(id) {
  const notes = await readNotes();
  const note = notes.find((item) => item.id === id);

  if (!note) return null;

  const remaining = notes.filter((item) => item.id !== id);
  await writeNotes(remaining);
  return note;
}

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
};
