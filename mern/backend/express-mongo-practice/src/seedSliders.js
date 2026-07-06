const mongoose = require("mongoose");
require("dotenv").config();

const Slider = require("./models/Slider");

const seedSliders = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Slider.deleteMany();

    await Slider.insertMany([
      {
        title: "New iPhone Collection",
        description: "Explore the latest Apple smartphones",
        image: "slider-iphone.png",
        status: "active",
      },
      {
        title: "Laptop Mega Sale",
        description: "Powerful laptops for work and gaming",
        image: "slider-laptop.png",
        status: "active",
      },
      {
        title: "Audio Zone",
        description: "Premium headphones with clear sound",
        image: "slider-audio.png",
        status: "active",
      },
      {
        title: "Old Campaign",
        description: "This slider should not be visible",
        image: "old-slider.png",
        status: "inactive",
      },
    ]);

    console.log("Slider data seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Slider seed failed:", error.message);
    process.exit(1);
  }
};

seedSliders();