const express = require("express");
const { tasks } = require("../data/memoryStore");
const { authRequired } = require("../middleware/auth");

const router = express.Router();

// All task routes are protected.
// Multi-user rule: a user should only see, update, or delete their own tasks.
router.use(authRequired);

// Creating New Task
router.post("/", (req, res) => {
  const now = new Date().toISOString();
  const task = {
    id: `task_${Date.now()}`,
    title: req.body.title || "Untitled Task",
    description: req.body.description || "",
    status: req.body.status || "todo",
    priority: req.body.priority || "medium",
    dueDate: req.body.dueDate || new Date().toISOString().slice(0, 10),
    ownerId: req.user.id,
    createdAt: now,
    updatedAt: now
  };

  tasks.push(task);

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: task
  });
});

// Selecting + Filtering Task List
// Supported filters: status, priority, search, fromDate, toDate.
router.get("/", (req, res) => {
  const { status, priority, search, fromDate, toDate } = req.query;

  let result = tasks.filter((task) => task.ownerId === req.user.id);

  if (status) result = result.filter((task) => task.status === status);
  if (priority) result = result.filter((task) => task.priority === priority);

  if (search) {
    const keyword = search.toLowerCase();
    result = result.filter(
      (task) =>
        task.title.toLowerCase().includes(keyword) ||
        task.description.toLowerCase().includes(keyword)
    );
  }

  // Date filtering checks dueDate. For real DB, this should be handled by query operators/indexes.
  if (fromDate) result = result.filter((task) => task.dueDate >= fromDate);
  if (toDate) result = result.filter((task) => task.dueDate <= toDate);

  res.json({
    success: true,
    message: "Task list selected successfully",
    meta: {
      total: result.length,
      filters: { status, priority, search, fromDate, toDate }
    },
    data: result
  });
});

// Selecting One Task
router.get("/:id", (req, res) => {
  const task = tasks.find((item) => item.id === req.params.id && item.ownerId === req.user.id);

  if (!task) return res.status(404).json({ success: false, message: "Task not found" });

  res.json({
    success: true,
    message: "Task selected successfully",
    data: task
  });
});

// Updating Task
router.patch("/:id", (req, res) => {
  const task = tasks.find((item) => item.id === req.params.id && item.ownerId === req.user.id);

  if (!task) return res.status(404).json({ success: false, message: "Task not found" });

  const allowedFields = ["title", "description", "status", "priority", "dueDate"];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) task[field] = req.body[field];
  });
  task.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: "Task updated successfully",
    data: task
  });
});

// Removing Task
router.delete("/:id", (req, res) => {
  const index = tasks.findIndex((item) => item.id === req.params.id && item.ownerId === req.user.id);

  if (index === -1) return res.status(404).json({ success: false, message: "Task not found" });

  const deletedTask = tasks.splice(index, 1)[0];

  res.json({
    success: true,
    message: "Task removed successfully",
    data: deletedTask
  });
});

module.exports = router;
