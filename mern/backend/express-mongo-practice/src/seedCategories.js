const mongoose = require("mongoose");
require("dotenv").config();

const Category = require("./models/Category");

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Category.deleteMany();

    await Category.insertMany([
      {
        name: "Smartphone",
        image: "smartphone.png",
        status: "active",
      },
      {
        name: "Laptop",
        image: "laptop.png",
        status: "active",
      },
      {
        name: "Headphone",
        image: "headphone.png",
        status: "active",
      },
      {
        name: "Camera",
        image: "camera.png",
        status: "inactive",
      },
    ]);

    console.log("Category data seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Category seed failed:", error.message);
    process.exit(1);
  }
};

seedCategories();