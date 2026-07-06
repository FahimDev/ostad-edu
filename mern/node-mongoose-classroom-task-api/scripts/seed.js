require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../src/models/User");
const Task = require("../src/models/Task");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  await Task.deleteMany({});
  await User.deleteMany({});

  const teacher = await User.create({
    name: "Teacher Demo",
    email: "teacher@example.com",
    password: "password123",
    role: "admin"
  });

  const student = await User.create({
    name: "Student Demo",
    email: "student@example.com",
    password: "password123"
  });

  await Task.insertMany([
    {
      title: "Explain Schema to Model to Collection",
      description: "Show how User model creates the users collection.",
      status: "todo",
      priority: 4,
      owner: teacher._id,
      tags: ["mongoose", "model"]
    },
    {
      title: "Show JWT protected task creation",
      description: "Create a task with Bearer token and inspect owner field.",
      status: "doing",
      priority: 5,
      owner: teacher._id,
      tags: ["jwt", "auth"]
    },
    {
      title: "Student private task",
      description: "This task belongs to another user and should not be visible to teacher.",
      status: "todo",
      priority: 2,
      owner: student._id,
      tags: ["ownership"]
    }
  ]);

  console.log("Seed completed");
  console.log("Teacher login: teacher@example.com / password123");
  console.log("Student login: student@example.com / password123");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
