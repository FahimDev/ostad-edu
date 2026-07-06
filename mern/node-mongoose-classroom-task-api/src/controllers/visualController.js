const mongoose = require("mongoose");
const User = require("../models/User");
const Task = require("../models/Task");

async function dbState(req, res, next) {
  try {
    const states = ["disconnected", "connected", "connecting", "disconnecting"];
    const [users, tasks, taskStatusBreakdown] = await Promise.all([
      User.countDocuments(),
      Task.countDocuments(),
      Task.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }])
    ]);

    res.json({
      mongoose: {
        readyState: mongoose.connection.readyState,
        stateName: states[mongoose.connection.readyState] || "unknown",
        host: mongoose.connection.host,
        name: mongoose.connection.name
      },
      collections: {
        users,
        tasks,
        taskStatusBreakdown
      },
      explanation: "Use this route while teaching to show how API actions change MongoDB documents. Also open Mongo Express at http://localhost:8081."
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { dbState };
