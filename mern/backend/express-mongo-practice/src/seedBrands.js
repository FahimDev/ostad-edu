const mongoose = require("mongoose");
require("dotenv").config();

const Brand = require("./models/Brand");

const seedBrands = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Brand.deleteMany();

    await Brand.insertMany([
      {
        name: "Apple",
        image: "apple.png",
        status: "active",
      },
      {
        name: "Samsung",
        image: "samsung.png",
        status: "active",
      },
      {
        name: "Xiaomi",
        image: "xiaomi.png",
        status: "active",
      },
      {
        name: "Sony",
        image: "sony.png",
        status: "inactive",
      },
    ]);

    console.log("Brand data seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Brand seed failed:", error.message);
    process.exit(1);
  }
};

seedBrands();
