/**
 * src/routes/notesSyncRoutes.js
 * -----------------------------------------------------------------------------
 * Sync CRUD routes using fs.readFileSync() and fs.writeFileSync().
 * These routes are intentionally educational.
 * They work, but they are not recommended for production HTTP APIs.
 */

const express = require("express");
const appEvents = require("../events/appEvents");
const {
  getAllNotesSync,
  getNoteByIdSync,
  createNoteSync,
  updateNoteSync,
  deleteNoteSync
} = require("../services/fileStoreSync");

const router = express.Router();

function validateTitle(req, res, next) {
  if (!req.body.title || typeof req.body.title !== "string") {
    return res.status(400).json({ error: "title is required and must be a string" });
  }
  next();
}

router.get("/", (req, res, next) => {
  try {
    const notes = getAllNotesSync();
    res.json({
      warning: "This route uses synchronous fs. Educational only.",
      count: notes.length,
      data: notes
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", (req, res, next) => {
  try {
    const note = getNoteByIdSync(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (error) {
    next(error);
  }
});

router.post("/", validateTitle, (req, res, next) => {
  try {
    const note = createNoteSync(req.body);
    appEvents.emit("note:created", { mode: "sync", note });
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", (req, res, next) => {
  try {
    const note = updateNoteSync(req.params.id, req.body);
    if (!note) return res.status(404).json({ error: "Note not found" });
    appEvents.emit("note:updated", { mode: "sync", note });
    res.json(note);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", (req, res, next) => {
  try {
    const note = deleteNoteSync(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    appEvents.emit("note:deleted", { mode: "sync", id: req.params.id });
    res.json({ message: "Note deleted", deleted: note });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
