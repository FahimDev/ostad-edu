// This file intentionally uses in-memory sample data.
// In a real project, this layer will be replaced by MongoDB/PostgreSQL repository functions.

const users = [
  {
    id: "user_101",
    name: "Demo Student",
    email: "student@example.com",
    password: "password123", // Never store plain password in real projects. Use bcrypt hash.
    phone: "+8801700000000",
    role: "student",
    emailVerified: true,
    bio: "Learning Node.js and Express.js",
    createdAt: "2026-07-06T10:00:00.000Z"
  }
];

const tasks = [
  {
    id: "task_101",
    title: "Read Node.js event loop notes",
    description: "Revise call stack, event loop, callback queue, microtask queue.",
    status: "todo",
    priority: "high",
    dueDate: "2026-07-10",
    ownerId: "user_101",
    createdAt: "2026-07-06T11:00:00.000Z",
    updatedAt: "2026-07-06T11:00:00.000Z"
  },
  {
    id: "task_102",
    title: "Build small Express API",
    description: "Practice routes, middleware, JWT and OpenAPI documentation.",
    status: "doing",
    priority: "medium",
    dueDate: "2026-07-12",
    ownerId: "user_101",
    createdAt: "2026-07-06T12:00:00.000Z",
    updatedAt: "2026-07-06T12:00:00.000Z"
  }
];

module.exports = { users, tasks };
