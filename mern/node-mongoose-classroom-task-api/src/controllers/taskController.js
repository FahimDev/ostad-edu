const Task = require("../models/Task");

async function getTasks(req, res, next) {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = { owner: req.user._id };

    if (status) filter.status = status;

    const safeLimit = Math.min(Number(limit) || 10, 50);
    const safePage = Math.max(Number(page) || 1, 1);
    const skip = (safePage - 1) * safeLimit;

    const [tasks, total] = await Promise.all([
      Task.find(filter).sort("-createdAt").skip(skip).limit(safeLimit),
      Task.countDocuments(filter)
    ]);

    res.json({
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
      data: tasks
    });
  } catch (err) {
    next(err);
  }
}

async function createTask(req, res, next) {
  try {
    const task = await Task.create({ ...req.body, owner: req.user._id });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

async function getTask(req, res, next) {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    next(err);
  }
}

async function updateTask(req, res, next) {
  try {
    const allowedFields = ["title", "description", "status", "priority", "dueDate", "tags"];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    next(err);
  }
}

async function deleteTask(req, res, next) {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted", taskId: req.params.id });
  } catch (err) {
    next(err);
  }
}

module.exports = { getTasks, createTask, getTask, updateTask, deleteTask };
