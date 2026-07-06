const mongoose = require("mongoose");

const states = ["disconnected", "connected", "connecting", "disconnecting"];

async function connectDB() {
  try {
    if (process.env.MONGOOSE_DEBUG === "true") {
      mongoose.set("debug", true);
    }

    mongoose.connection.on("connecting", () => {
      console.log("Mongoose state: connecting...");
    });

    mongoose.connection.on("connected", () => {
      console.log("Mongoose state: connected");
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose state: disconnected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err.message);
    });

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");
    console.log(`readyState = ${mongoose.connection.readyState} (${states[mongoose.connection.readyState]})`);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
