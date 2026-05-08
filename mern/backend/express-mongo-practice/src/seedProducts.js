const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");
const Brand = require("./models/Brand");
const Category = require("./models/Category");

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const apple = await Brand.findOne({ name: "Apple" });
    const samsung = await Brand.findOne({ name: "Samsung" });
    const xiaomi = await Brand.findOne({ name: "Xiaomi" });
    const sony = await Brand.findOne({ name: "Sony" });

    const smartphone = await Category.findOne({ name: "Smartphone" });
    const laptop = await Category.findOne({ name: "Laptop" });
    const headphone = await Category.findOne({ name: "Headphone" });

    if (!apple || !samsung || !xiaomi || !sony) {
      throw new Error("Required brands not found. Run brand seeder first.");
    }

    if (!smartphone || !laptop || !headphone) {
      throw new Error("Required categories not found. Run category seeder first.");
    }

    await Product.deleteMany();

    await Product.insertMany([
      {
        name: "iPhone 15 Pro",
        price: 1200,
        discountPrice: 1100,
        image: "iphone-15-pro.png",
        brand: apple._id,
        category: smartphone._id,
        remark: "popular",
        stock: 15,
        specs: {
          storage: "256GB",
          color: "Titanium",
          battery: "3274mAh",
          warranty: "1 Year",
        },
        status: "active",
      },
      {
        name: "iPhone 14",
        price: 950,
        discountPrice: 850,
        image: "iphone-14.png",
        brand: apple._id,
        category: smartphone._id,
        remark: "new",
        stock: 20,
        specs: {
          storage: "128GB",
          color: "Blue",
          battery: "3279mAh",
          warranty: "1 Year",
        },
        status: "active",
      },
      {
        name: "Samsung Galaxy S24",
        price: 1150,
        discountPrice: 1050,
        image: "galaxy-s24.png",
        brand: samsung._id,
        category: smartphone._id,
        remark: "top",
        stock: 18,
        specs: {
          storage: "256GB",
          color: "Black",
          battery: "4000mAh",
          warranty: "1 Year",
        },
        status: "active",
      },
      {
        name: "Xiaomi Redmi Note 13",
        price: 320,
        discountPrice: 290,
        image: "redmi-note-13.png",
        brand: xiaomi._id,
        category: smartphone._id,
        remark: "trending",
        stock: 40,
        specs: {
          storage: "128GB",
          color: "White",
          battery: "5000mAh",
          warranty: "1 Year",
        },
        status: "active",
      },
      {
        name: "MacBook Air M2",
        price: 1400,
        discountPrice: 1300,
        image: "macbook-air-m2.png",
        brand: apple._id,
        category: laptop._id,
        remark: "special",
        stock: 10,
        specs: {
          storage: "512GB SSD",
          color: "Silver",
          battery: "18 Hours",
          warranty: "1 Year",
        },
        status: "active",
      },
      {
        name: "Sony WH-1000XM5",
        price: 420,
        discountPrice: 380,
        image: "sony-headphone.png",
        brand: sony._id,
        category: headphone._id,
        remark: "top",
        stock: 25,
        specs: {
          storage: "N/A",
          color: "Black",
          battery: "30 Hours",
          warranty: "1 Year",
        },
        status: "active",
      },
    ]);

    console.log("Referenced product data seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Product seed failed:", error.message);
    process.exit(1);
  }
};

seedProducts();