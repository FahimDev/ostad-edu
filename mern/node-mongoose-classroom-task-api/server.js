require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
const visualRoutes = require("./src/routes/visualRoutes");
const { notFound, errorHandler } = require("./src/middleware/errorMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    message: "Node + Express + Mongoose Classroom API is running",
    docs: {
      health: "/health",
      auth: "/api/auth/register | /api/auth/login | /api/auth/me",
      tasks: "/api/tasks",
      visual: "/api/visual/db-state"
    }
  });
});

app.get("/health", (req, res) => {
  const mongoose = require("mongoose");
  const states = ["disconnected", "connected", "connecting", "disconnecting"];

  res.json({
    status: "ok",
    nodeEnv: process.env.NODE_ENV || "development",
    dbReadyState: mongoose.connection.readyState,
    dbStateName: states[mongoose.connection.readyState] || "unknown",
    time: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/visual", visualRoutes);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Mongo Express UI at http://localhost:8081`);
});

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

function shutdown() {
  console.log("\nShutting down server...");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
}
