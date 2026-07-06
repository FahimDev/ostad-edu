const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const openApiDocument = require("./docs/openapi");

const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");
const taskRoutes = require("./routes/task.routes");

const app = express();

// express.json() parses incoming JSON request bodies.
// Without this middleware, req.body would be undefined for JSON POST/PATCH requests.
app.use(express.json());
app.use(cors());

// OpenAPI is the machine-readable API contract.
// Swagger UI is only the visual documentation layer for that contract.
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.get("/openapi.json", (req, res) => res.json(openApiDocument));

app.get("/", (req, res) => {
  res.json({
    message: "Ostad Edu Backend Sample API",
    docs: "/api-docs",
    openapi: "/openapi.json"
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "UP",
    service: "ostad-open-api-small",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/tasks", taskRoutes);

// Central 404 handler for unknown routes.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl
  });
});

// Central error handler. In production, never expose raw stack traces to clients.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error"
  });
});

module.exports = app;
