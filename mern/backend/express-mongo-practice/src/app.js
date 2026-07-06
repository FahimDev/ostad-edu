const express = require("express");
const cors = require("cors");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");

const connectDB = require("./config/db");
const apiRoutes = require("./routes/apiRoutes");
const swaggerSpec = require("./config/swagger");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(errorHandler);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Express MongoDB Practice API is running",
  });
});

app.use("/api", apiRoutes);

// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});