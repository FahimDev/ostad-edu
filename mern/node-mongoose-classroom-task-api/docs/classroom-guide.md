# Mongoose Zero to JWT: Classroom Live-Coding Guide

## Goal

Build a stable **Task Manager REST API** in front of students, part by part, so they can understand how **Node.js, Express, MongoDB, Mongoose, validation, and JWT authentication** work together.

This guide is designed for a classroom where:

- **MongoDB runs through Docker**.
- **Mongo Express runs through Docker** to visualize collections and documents.
- **Express runs from the terminal** so students can see request logs, Mongoose connection logs, query logs, validation errors, and server behavior.

---

## 0. Final Architecture

```text
Student / Postman / Browser
        |
        v
Express API running in terminal
http://localhost:5000
        |
        v
Mongoose ODM
Schema -> Model -> Query -> Validation -> MongoDB Driver
        |
        v
MongoDB container
localhost:27017
        |
        v
Mongo Express UI container
http://localhost:8081
```

### Why this setup is good for teaching

| Component | How students see it |
|---|---|
| Express server | Terminal logs through `npm run dev` |
| HTTP requests | `morgan` logs in terminal |
| MongoDB connection state | `/health` route and console logs |
| Mongoose queries | `MONGOOSE_DEBUG=true` shows DB queries in terminal |
| Collections/documents | Mongo Express UI |
| JWT flow | Postman / REST Client headers |
| Validation errors | API response + terminal stack in development |

---

## 1. Project Folder

Project name:

```bash
node-mongoose-classroom-task-api
```

Recommended structure:

```text
node-mongoose-classroom-task-api/
├── docker-compose.yml
├── .env.example
├── .env
├── package.json
├── server.js
├── README.md
├── requests/
│   └── task-manager-api.http
├── scripts/
│   └── seed.js
└── src/
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── authController.js
    │   ├── taskController.js
    │   └── visualController.js
    ├── middleware/
    │   ├── authMiddleware.js
    │   └── errorMiddleware.js
    ├── models/
    │   ├── User.js
    │   └── Task.js
    └── routes/
        ├── authRoutes.js
        ├── taskRoutes.js
        └── visualRoutes.js
```

---

## 2. Before Class: Teacher Setup

### Required tools

Students should have:

```text
Node.js 20+
Docker Desktop / Docker Engine
Postman or VS Code REST Client
VS Code
Terminal
```

Check versions:

```bash
node -v
npm -v
docker -v
docker compose version
```

---

## 3. Start Infrastructure First

### Step 1: Copy environment file

```bash
cp .env.example .env
```

`.env` should contain:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://admin:secret123@localhost:27017/taskdb?authSource=admin
JWT_SECRET=change_this_to_a_long_random_secret_for_real_projects
JWT_EXPIRES_IN=7d
MONGOOSE_DEBUG=true
```

### Step 2: Start MongoDB and Mongo Express

```bash
npm run db:up
```

Or directly:

```bash
docker compose up -d
```

### Step 3: Check containers

```bash
docker ps
```

Expected containers:

```text
classroom-mongodb
classroom-mongo-express
```

### Step 4: Open Mongo Express

```text
http://localhost:8081
```

Login:

```text
username: teacher
password: teacher123
```

### Teaching point

Before writing Express code, show students that the database exists as a separate running service.

Explain:

```text
Our API is not the database.
Our API talks to MongoDB.
MongoDB is running inside Docker.
Mongo Express is only a visual dashboard.
```

---

## 4. Install Node Dependencies

```bash
npm install
```

Main packages:

| Package | Purpose |
|---|---|
| express | HTTP server and routing |
| mongoose | ODM for MongoDB |
| dotenv | Load `.env` variables |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT token sign/verify |
| cors | Allow cross-origin requests |
| morgan | Request logging |
| nodemon | Auto restart during development |

Start Express:

```bash
npm run dev
```

Expected terminal output:

```text
Mongoose state: connecting...
Mongoose state: connected
MongoDB connected successfully
readyState = 1 (connected)
Server running at http://localhost:5000
Mongo Express UI at http://localhost:8081
```

---

## 5. Classroom Flow Overview

Use this order in class:

| Part | Topic | Build / Show |
|---|---|---|
| 1 | What is Mongoose? | Explain ODM layer |
| 2 | Docker MongoDB | Start DB + Mongo Express |
| 3 | Express bootstrap | `server.js` + health route |
| 4 | DB connection | `src/config/db.js` |
| 5 | User model | Schema -> Model -> users collection |
| 6 | Task model | ObjectId relation with User |
| 7 | Validation/defaults | Invalid payload demo |
| 8 | Auth register/login | bcrypt + JWT |
| 9 | Protect middleware | Authorization header |
| 10 | Task CRUD | Owner-based multiuser API |
| 11 | Visualization | Mongo Express + `/api/visual/db-state` |
| 12 | Interview recap | Common questions |

---

# Part 1: Explain Mongoose

## Instructor explanation

Mongoose is an **ODM**, Object Data Modeling library. It sits between Express and MongoDB.

```text
Express Route
req.body -> controller
        |
        v
Mongoose Model
schema validation -> hooks -> save/query
        |
        v
MongoDB Driver
        |
        v
MongoDB Collection
```

### Without Mongoose

```text
MongoDB accepts flexible documents.
This is powerful but dangerous for application data consistency.
```

### With Mongoose

```text
We define shape, type, validation, default values, hooks, relationships, and helper methods.
```

### Interview answer

> Mongoose wraps the native MongoDB driver and adds schema, validation, middleware hooks, virtuals, model methods, and relationship helpers like populate.

---

# Part 2: Docker MongoDB + Mongo Express

## docker-compose.yml concept

MongoDB container stores the data.
Mongo Express container gives a browser UI to inspect databases, collections, and documents.

Important ports:

```text
MongoDB:       localhost:27017
Mongo Express: http://localhost:8081
```

### Live demo

Run:

```bash
npm run db:up
```

Then:

```bash
docker ps
```

Then open:

```text
http://localhost:8081
```

### Teaching point

At this stage, the database is running, but there may be no application collections yet. Collections will appear after our API creates documents.

---

# Part 3: Express Server Bootstrap

## File: server.js

Start with only this part if live-coding from zero:

```js
require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

Run:

```bash
npm run dev
```

Test:

```bash
curl http://localhost:5000
```

Expected:

```json
{ "message": "API is running" }
```

---

# Part 4: Connect Mongoose to MongoDB

## File: src/config/db.js

```js
const mongoose = require("mongoose");

async function connectDB() {
  try {
    if (process.env.MONGOOSE_DEBUG === "true") {
      mongoose.set("debug", true);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
    console.log(`readyState = ${mongoose.connection.readyState}`);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
```

Use it in `server.js`:

```js
const connectDB = require("./src/config/db");
connectDB();
```

## Mongoose readyState

| Code | Meaning |
|---|---|
| 0 | disconnected |
| 1 | connected |
| 2 | connecting |
| 3 | disconnecting |

### Live demo

Open:

```text
http://localhost:5000/health
```

Expected:

```json
{
  "status": "ok",
  "dbReadyState": 1,
  "dbStateName": "connected"
}
```

---

# Part 5: User Model

## File: src/models/User.js

Teaching sequence:

1. Define schema.
2. Add validation.
3. Add default role.
4. Add password hashing hook.
5. Compile schema into model.

Key idea:

```text
Schema = blueprint
Model = class-like object used by code
Collection = actual MongoDB storage
```

Example:

```js
module.exports = mongoose.model("User", userSchema);
```

Mongoose will create:

```text
Model: User
Collection: users
```

### Explain password security

Do not store plain text passwords.

```js
userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
```

### Interview answer

> `pre("save")` middleware runs before saving a document. It is commonly used to hash passwords before insertion or update through `.save()`.

---

# Part 6: Task Model and Relationship

## File: src/models/Task.js

Important field:

```js
owner: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
  index: true
}
```

### Teaching point

This is how we connect a task to a user.

```text
User _id ----------------------+
                               |
                               v
Task.owner stores User ObjectId
```

### Why this matters

Later, every query will include:

```js
{ _id: req.params.id, owner: req.user._id }
```

This prevents one user from reading, updating, or deleting another user's task.

---

# Part 7: Validation, Defaults, and Timestamps

## Demonstrate invalid task

Request:

```json
{
  "title": "x",
  "status": "blocked",
  "priority": 10
}
```

Expected response:

```json
{
  "error": "Validation failed",
  "details": [
    "Title must be at least 2 characters",
    "`blocked` is not a valid enum value for path `status`.",
    "Priority maximum is 5"
  ]
}
```

### Teaching point

Validation happens before invalid data reaches MongoDB.

### Defaults to show in Mongo Express

Create a task without status:

```json
{
  "title": "Learn defaults"
}
```

Then show in Mongo Express:

```text
status: "todo"
priority: 3
createdAt: auto-generated
updatedAt: auto-generated
```

---

# Part 8: Auth Register/Login

## Register flow

```text
Client sends name, email, password
        |
        v
Express route
        |
        v
User.create()
        |
        v
Mongoose validation
        |
        v
pre-save hook hashes password
        |
        v
MongoDB stores user
        |
        v
JWT token returned
```

## Login flow

```text
Client sends email + password
        |
        v
Find user by email
        |
        v
Compare password with bcrypt
        |
        v
Sign JWT
        |
        v
Return token
```

### JWT contains

```text
Header.Payload.Signature
```

Payload example:

```json
{
  "id": "user_mongodb_id"
}
```

### Important teaching point

JWT is not encrypted by default. It is signed. Do not put sensitive secrets in JWT payload.

---

# Part 9: Protect Middleware

## File: src/middleware/authMiddleware.js

Flow:

```text
Request comes with Authorization header
        |
        v
Authorization: Bearer <token>
        |
        v
jwt.verify(token, secret)
        |
        v
Find user in DB
        |
        v
Attach user to req.user
        |
        v
Protected route continues
```

### Why `.select("-password")`?

Because we do not want the password hash to be accidentally exposed from `req.user`.

---

# Part 10: Protected Task CRUD

## Endpoints

| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/login` | No | Login user |
| GET | `/api/auth/me` | Yes | Get logged-in profile |
| GET | `/api/tasks` | Yes | Get logged-in user's tasks |
| POST | `/api/tasks` | Yes | Create task |
| GET | `/api/tasks/:id` | Yes | Get one task |
| PUT | `/api/tasks/:id` | Yes | Update one task |
| DELETE | `/api/tasks/:id` | Yes | Delete one task |
| GET | `/api/visual/db-state` | No | Classroom visualization |

## Owner protection

Use this pattern:

```js
Task.findOne({ _id: req.params.id, owner: req.user._id })
```

Do not use only:

```js
Task.findById(req.params.id)
```

Because that could allow one user to access another user's task.

---

# Part 11: Live Request Testing Sequence

Use Postman or `requests/task-manager-api.http`.

## 1. Health check

```http
GET http://localhost:5000/health
```

## 2. Register

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Aisha Rahman",
  "email": "aisha@example.com",
  "password": "password123"
}
```

Copy token.

## 3. Login

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "aisha@example.com",
  "password": "password123"
}
```

## 4. Create task

```http
POST http://localhost:5000/api/tasks
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "title": "Learn Mongoose Model",
  "description": "Understand schema to model to collection",
  "status": "todo",
  "priority": 4
}
```

## 5. Get tasks

```http
GET http://localhost:5000/api/tasks
Authorization: Bearer YOUR_TOKEN
```

## 6. Update task

```http
PUT http://localhost:5000/api/tasks/TASK_ID
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "status": "done"
}
```

## 7. Delete task

```http
DELETE http://localhost:5000/api/tasks/TASK_ID
Authorization: Bearer YOUR_TOKEN
```

---

# Part 12: Visualization Moments During Class

## Moment 1: After registration

Open Mongo Express:

```text
http://localhost:8081
```

Go to:

```text
taskdb -> users
```

Show:

```text
name
email
hashed password
role default
createdAt
updatedAt
__v
```

## Moment 2: After task creation

Go to:

```text
taskdb -> tasks
```

Show:

```text
title
status default
priority default
owner ObjectId
createdAt
updatedAt
```

## Moment 3: Use visual API route

```http
GET http://localhost:5000/api/visual/db-state
```

Expected:

```json
{
  "mongoose": {
    "readyState": 1,
    "stateName": "connected"
  },
  "collections": {
    "users": 1,
    "tasks": 2
  }
}
```

## Moment 4: Terminal query logs

Because `.env` has:

```env
MONGOOSE_DEBUG=true
```

Students will see Mongoose queries in terminal when routes run.

Example:

```text
Mongoose: users.insertOne(...)
Mongoose: tasks.find({ owner: ObjectId(...) })
```

---

# Part 13: Seed Data for Faster Demo

Run:

```bash
npm run seed
```

Demo users:

```text
teacher@example.com / password123
student@example.com / password123
```

Teaching idea:

1. Login as teacher.
2. Get teacher tasks.
3. Login as student.
4. Show student cannot see teacher tasks.
5. Explain ownership filtering.

---

# Part 14: Reset Everything

To stop containers:

```bash
npm run db:down
```

To delete all database data and restart:

```bash
npm run db:reset
```

Use this before a new batch of students.

---

# Part 15: Common Problems and Fixes

## Problem: Mongo Express opens but cannot connect

Try:

```bash
docker compose down
npm run db:up
```

Then check:

```bash
docker logs classroom-mongodb
```

## Problem: API cannot connect to MongoDB

Check `.env`:

```env
MONGO_URI=mongodb://admin:secret123@localhost:27017/taskdb?authSource=admin
```

Because Express runs from terminal, it must use `localhost`, not Docker service name `mongodb`.

## Problem: Port already in use

Check:

```bash
sudo lsof -i :5000
sudo lsof -i :27017
sudo lsof -i :8081
```

Stop old process or change ports.

## Problem: JWT invalid

Check:

```text
Authorization: Bearer <token>
```

Do not send only the token. The word `Bearer` is required.

---

# Part 16: Interview Questions to Ask Students

## Mongoose

1. What is Mongoose?
2. What is the difference between Mongoose and the MongoDB native driver?
3. What is the difference between Schema, Model, and Collection?
4. Why does `User` become `users` in MongoDB?
5. What is `ObjectId`?
6. What does `ref: "User"` mean?

## CRUD

1. Difference between `find()`, `findOne()`, and `findById()`?
2. Why use `{ new: true }` in `findByIdAndUpdate()`?
3. Why use `{ runValidators: true }` during update?
4. Why should owner be included in task queries?

## Validation

1. Difference between `required` and `unique`?
2. Why is `unique` not a normal validator?
3. What is enum validation?
4. Why use default values?
5. What is `__v`?

## Auth/JWT

1. Why hash passwords?
2. What is JWT?
3. What are the three parts of JWT?
4. Where should JWT secret be stored?
5. Why use middleware for protected routes?
6. Why use `.select("-password")`?

---

# Part 17: Recommended Class Timing

| Time | Activity |
|---|---|
| 0:00 - 0:10 | Explain architecture and final API |
| 0:10 - 0:25 | Docker MongoDB + Mongo Express |
| 0:25 - 0:40 | Express bootstrap + health route |
| 0:40 - 1:00 | Mongoose connection and readyState |
| 1:00 - 1:25 | User and Task models |
| 1:25 - 1:45 | Validation/default/timestamps demo |
| 1:45 - 2:15 | Register/login with JWT |
| 2:15 - 2:45 | Protected Task CRUD |
| 2:45 - 3:00 | Mongo Express visualization + interview recap |

---

# Part 18: Final Student Assignment

Ask students to extend the project:

1. Add `category` field to Task.
2. Add `dueDate` filter.
3. Add pagination UI idea using query parameters.
4. Add refresh token flow.
5. Add admin-only route to see total users and tasks.
6. Deploy MongoDB to Atlas and API to Render/Railway.

---

# Final Teaching Message

> Mongoose is not just a database library. It is the layer that gives MongoDB application-level structure. Express receives HTTP requests, Mongoose validates and models the data, MongoDB stores the documents, and JWT protects user-specific resources.
