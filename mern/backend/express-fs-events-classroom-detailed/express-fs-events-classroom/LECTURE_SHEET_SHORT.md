# Lecture Sheet: Express.js with File System, Events, and Path Module

## Class Title

**Building a File-Based Notes API with Express.js, fs, EventEmitter, and path**

## Duration

2.5 to 3 hours

## Learning Outcome

By the end of this class, students will understand how Node.js can:

1. Read and write files using the `fs` module.
2. Perform CRUD operations using JSON files.
3. Compare synchronous and asynchronous file operations.
4. Use the `events` module to create event-driven behavior.
5. Use the `path` module to create safe cross-platform file paths.
6. Build a small Express API around Node.js core modules.

---

# Part 1: Warm-up Discussion

Ask students:

> If we do not use MongoDB or MySQL, where can we store data?

Expected answers:

- Memory
- File
- JSON file
- CSV file
- Database

Then explain:

> Today we will use JSON files as a temporary educational database. This is not recommended for serious production apps, but it is excellent for understanding how Node.js interacts with files.

---

# Part 2: Project Setup

## Step 1: Create project

```bash
mkdir express-fs-events-classroom
cd express-fs-events-classroom
npm init -y
```

## Step 2: Install dependencies

```bash
npm install express
npm install -D nodemon
```

## Step 3: Add scripts

In `package.json`:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

Teaching point:

- `start` runs app normally.
- `dev` restarts server on file changes.

---

# Part 3: Project Structure

Create this structure:

```text
src/
├── config/
│   └── paths.js
├── events/
│   ├── appEvents.js
│   └── listeners.js
├── routes/
│   ├── notesAsyncRoutes.js
│   ├── notesSyncRoutes.js
│   ├── pathRoutes.js
│   └── eventRoutes.js
├── services/
│   ├── fileStoreAsync.js
│   └── fileStoreSync.js
├── middleware/
│   └── errorHandler.js
└── utils/
    └── ensureDataFiles.js
```

Ask students:

> Why should we separate route, service, config, and events?

Expected answer:

> Separation makes the project easier to understand, test, and maintain.

---

# Part 4: path Module

## Theory

The `path` module helps us work with file paths safely.

Bad practice:

```js
const filePath = __dirname + "/data/notes.json";
```

Better practice:

```js
const path = require("path");
const filePath = path.join(process.cwd(), "data", "notes.json");
```

Why?

- Linux/macOS and Windows use different path separators.
- `path.join()` makes the path OS-safe.
- `path.resolve()` creates an absolute path.

## Student Activity

Open:

```text
GET /api/path/inspect?filename=class-notes.txt
```

Ask students to identify:

- `basename`
- `dirname`
- `extname`
- `resolvedPath`
- `path.sep`

---

# Part 5: fs Module

## Theory

The `fs` module lets Node.js interact with the operating system's file system.

Common file operations:

| Operation | Method Example |
|---|---|
| Read | `readFile()` |
| Write | `writeFile()` |
| Append | `appendFile()` |
| Delete | `unlink()` |
| Check access | `access()` |

---

# Part 6: Async File Operations

## Theory

Async file operations are preferred in web servers because they do not block the event loop while waiting for disk I/O.

Example:

```js
const fs = require("fs/promises");
const raw = await fs.readFile("notes.json", "utf8");
```

## Build Async CRUD

Create these endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/async-notes` | Read all notes |
| GET | `/api/async-notes/:id` | Read one note |
| POST | `/api/async-notes` | Create note |
| PATCH | `/api/async-notes/:id` | Update note |
| DELETE | `/api/async-notes/:id` | Delete note |

## Student Test

Create note:

```bash
curl -X POST http://localhost:5000/api/async-notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Async note","body":"This uses fs/promises"}'
```

Read notes:

```bash
curl http://localhost:5000/api/async-notes
```

Ask students to open:

```text
data/notes-async.json
```

They should see the file updated.

---

# Part 7: Sync File Operations

## Theory

Sync file operations block the main thread.

Example:

```js
const fs = require("fs");
const raw = fs.readFileSync("notes.json", "utf8");
```

This means Node.js must wait until the file operation finishes.

## When sync is acceptable

- Small CLI scripts
- Startup configuration loading
- Build tools
- Tiny local demos

## When sync should be avoided

- Express route handlers
- High-traffic APIs
- Real-time servers
- Any place where many users are waiting

## Student Activity

Compare:

```text
GET /api/async-notes
GET /api/sync-notes
```

Ask:

> Which one should we use in a production API and why?

Expected answer:

> Async version, because it does not block the event loop while waiting for file I/O.

---

# Part 8: Event Module

## Theory

Node.js has a built-in `events` module.

It gives us `EventEmitter`.

Mental model:

```text
Action happens → emit event → listener reacts
```

Example:

```js
appEvents.emit("note:created", note);
appEvents.on("note:created", (note) => {
  console.log("A note was created", note.id);
});
```

## Why use events?

Events help separate core business logic from side effects.

Without event:

```text
Route creates note + logs file + sends email + sends notification
```

With event:

```text
Route creates note + emits note:created
Listeners handle logging, email, notification
```

This makes code cleaner and easier to extend.

---

# Part 9: Event Log Demo

## Demo Flow

1. Create an async note.
2. Check terminal log.
3. Open `data/event-log.txt`.
4. Read logs using API:

```bash
curl http://localhost:5000/api/events/logs
```

5. Emit custom event:

```bash
curl -X POST http://localhost:5000/api/events/demo \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello from classroom"}'
```

Teaching point:

> The route does not directly write logs. It emits an event. The listener writes the log.

---

# Part 10: Express Error Handling

## Theory

Express error middleware has four parameters:

```js
function errorHandler(err, req, res, next) {}
```

For async route handlers:

```js
try {
  // async work
} catch (error) {
  next(error);
}
```

Teaching point:

> Never leave async errors unhandled. Always return proper HTTP status and message.

---

# Part 11: Final Student Assignment

Ask students to add these features:

## Task 1: Search notes

```text
GET /api/async-notes?search=node
```

## Task 2: Add category field

Example note:

```json
{
  "title": "Learn fs",
  "body": "File system module",
  "category": "node-core"
}
```

## Task 3: Add backup route

```text
POST /api/async-notes/backup
```

It should create:

```text
data/backup.json
```

## Task 4: Add a new event

```text
note:read
```

Emit this event when one note is read.

---

# Part 12: Interview Preparation

## Question 1

What is the `fs` module?

Answer:

> The `fs` module is a built-in Node.js module used to interact with the file system. It can read, write, update, delete, and append files.

## Question 2

What is the difference between async and sync fs operations?

Answer:

> Async operations allow Node.js to continue handling other work while waiting for file I/O. Sync operations block the main thread until the operation finishes.

## Question 3

Why should sync fs be avoided inside Express routes?

Answer:

> Because Express runs on Node.js's event loop. A blocking sync file operation can stop the server from handling other requests during that time.

## Question 4

What is EventEmitter?

Answer:

> EventEmitter is a class from Node.js's events module that allows us to emit named events and register listeners that react to those events.

## Question 5

Why use EventEmitter in backend apps?

Answer:

> It helps decouple actions from side effects. For example, after creating a note, the route can emit `note:created`, and separate listeners can handle logging or notifications.

## Question 6

What is the path module?

Answer:

> The path module is a built-in Node.js module for working with file and directory paths in a cross-platform way.

## Question 7

Why use `path.join()`?

Answer:

> `path.join()` safely joins path segments and uses the correct separator for the current operating system.

## Question 8

Is JSON file storage production-ready?

Answer:

> Usually no. JSON file storage is good for learning and small local tools, but real apps should use databases because they handle concurrency, indexing, transactions, security, and scalability better.

---

# Part 13: Final Summary

Today students learned:

1. Express route structure.
2. File-based CRUD using Node.js `fs`.
3. Difference between sync and async file operations.
4. How EventEmitter supports event-driven architecture.
5. How the path module creates safe file paths.
6. Why this knowledge matters before learning databases.
