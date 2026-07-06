/**
 * src/routes/notesAsyncRoutes.js
 * -----------------------------------------------------------------------------
 * Async CRUD routes using fs/promises.
 * CRUD means:
 * C = Create  -> POST
 * R = Read    -> GET
 * U = Update  -> PATCH/PUT
 * D = Delete  -> DELETE
 */

const express = require("express");
const appEvents = require("../events/appEvents");
const {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
} = require("../services/fileStoreAsync");

const router = express.Router();

function validateTitle(req, res, next) {
  if (!req.body.title || typeof req.body.title !== "string") {
    return res.status(400).json({ error: "title is required and must be a string" });
  }
  next();
}

router.get("/", async (req, res, next) => {
  try {
    const notes = await getAllNotes();
    res.json({ count: notes.length, data: notes });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const note = await getNoteById(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (error) {
    next(error);
  }
});

router.post("/", validateTitle, async (req, res, next) => {
  try {
    const note = await createNote(req.body);

    // The route emits an event after successful business action.
    // Listener will write audit log separately.
    appEvents.emit("note:created", { mode: "async", note });

    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const note = await updateNote(req.params.id, req.body);
    if (!note) return res.status(404).json({ error: "Note not found" });

    appEvents.emit("note:updated", { mode: "async", note });

    res.json(note);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const note = await deleteNote(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });

    appEvents.emit("note:deleted", { mode: "async", id: req.params.id });

    res.json({ message: "Note deleted", deleted: note });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
