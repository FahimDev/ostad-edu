# Detailed Instructor Lecture Sheet

# Express.js File System & Events Project

## Class Theme

**Build a file-based Notes API and observe how Node.js uses `fs`, `path`, and `events` inside an Express application.**

This lecture sheet is designed for instructors. It is not only an activity sheet. It tells you **which file to open**, **what to explain**, **what code to run**, **what students should observe**, and **how the concept maps to a real-life backend project**.

---

## 0. Project Story: Why This Project Exists

### Real-life project scenario

Imagine your team is building an internal **Support Notes API** for a small company.

The company wants to:

1. Save support notes.
2. Read previous notes.
3. Update notes when a support agent adds more information.
4. Delete wrong or duplicate notes.
5. Keep an audit trail whenever a note is created, updated, or deleted.
6. Store simple data locally during early development before using MongoDB/PostgreSQL.

In a real production system, the notes would usually be stored in a database. But in this class, we intentionally use JSON files so students can visually see:

```text
HTTP Request -> Express Route -> Service Function -> fs Module -> JSON File
```

And for events:

```text
Note Created -> Event Emitted -> Listener Runs -> Audit Log Written
```

---

## 1. Learning Outcomes

By the end of this lecture, students should be able to explain and demonstrate:

1. What the Node.js `fs` module does.
2. How to perform CRUD operations using a local JSON file.
3. Difference between asynchronous and synchronous file operations.
4. Why async `fs/promises` is preferred inside HTTP route handlers.
5. What the `path` module does and why string-based paths are risky.
6. What the `events` module is.
7. How `EventEmitter` helps separate the main business action from side effects.
8. How Express routes, service files, utilities, middleware, and events work together.
9. How a small educational file-based app maps to real-world backend systems.

---

## 2. Expected Duration

Recommended class duration: **3 to 4 hours**

Suggested split:

| Section | Time |
|---|---:|
| Project story and setup | 20 min |
| Express app entry flow | 25 min |
| `path` module | 25 min |
| `fs` async CRUD | 60 min |
| `fs` sync CRUD comparison | 35 min |
| `events` module and audit logging | 45 min |
| Error handling and wrap-up | 25 min |
| Interview questions and final recap | 20 min |

---

## 3. Before Class: Instructor Setup

Open terminal inside the project root.

```bash
npm install
npm run seed
npm run dev
```

Expected server URL:

```text
http://localhost:5000
```

Open these files side by side:

```text
server.js
src/app.js
src/config/paths.js
src/utils/ensureDataFiles.js
src/services/fileStoreAsync.js
src/routes/notesAsyncRoutes.js
src/services/fileStoreSync.js
src/routes/notesSyncRoutes.js
src/events/appEvents.js
src/events/listeners.js
src/routes/eventRoutes.js
src/middleware/errorHandler.js
data/notes-async.json
data/notes-sync.json
data/event-log.txt
requests.http
```

Use one API testing tool:

- VS Code REST Client extension with `requests.http`
- Postman
- Thunder Client
- `curl`

---

## 4. Project Architecture Overview

Before opening code, draw this on the board:

```text
Client / Browser / API Tool
        |
        v
Express Route
        |
        v
Service Layer
        |
        v
Node.js Core Module
(fs / path / events)
        |
        v
Local File System
(JSON files / text logs)
```

Explain:

> Express is not doing file operations directly. Express receives the HTTP request and sends the HTTP response. The actual file logic is placed in service files. This is how we keep code clean in real projects.

---

## 5. Project Folder Walkthrough

Open the project tree and explain each part.

```text
express-fs-events-classroom/
├── data/
│   ├── notes-async.json
│   ├── notes-sync.json
│   └── event-log.txt
├── src/
│   ├── config/
│   │   └── paths.js
│   ├── events/
│   │   ├── appEvents.js
│   │   └── listeners.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── eventRoutes.js
│   │   ├── notesAsyncRoutes.js
│   │   ├── notesSyncRoutes.js
│   │   └── pathRoutes.js
│   ├── services/
│   │   ├── fileStoreAsync.js
│   │   └── fileStoreSync.js
│   └── utils/
│       ├── ensureDataFiles.js
│       └── seed.js
├── requests.http
├── server.js
└── package.json
```

### Instructor explanation

- `server.js`: starts the server.
- `src/app.js`: configures Express.
- `src/config/paths.js`: centralizes file path configuration.
- `src/services`: contains actual CRUD logic.
- `src/routes`: maps HTTP endpoints to service functions.
- `src/events`: handles event-driven side effects.
- `src/middleware`: handles errors and unknown routes.
- `data`: visible storage layer for the class.

### Real-life mapping

In a real company project:

| This project | Real-life equivalent |
|---|---|
| `data/notes-async.json` | MongoDB/PostgreSQL table |
| `fileStoreAsync.js` | Repository/service layer |
| `notesAsyncRoutes.js` | REST controller/router |
| `event-log.txt` | Audit log / activity log |
| `appEvents.emit()` | Notification/event bus |
| `path.js` | Storage config / upload path config |

---

# Part A: Application Entry Flow

---

## 6. Step 1: Explore `package.json`

Open:

```text
package.json
```

Explain the important fields:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js",
  "seed": "node src/utils/seed.js"
}
```

### Teaching points

- `npm start` runs the app normally.
- `npm run dev` runs app with `nodemon` for auto restart.
- `npm run seed` resets demo data.
- `dependencies` are needed to run the app.
- `devDependencies` are only needed during development.

### Real-life example

In a production company project, common scripts can be:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js",
  "test": "jest",
  "lint": "eslint .",
  "seed": "node src/utils/seed.js"
}
```

### Ask students

> Why do we use `npm run dev` during development instead of manually restarting the server?

Expected answer:

> Because `nodemon` watches file changes and restarts the server automatically.

---

## 7. Step 2: Explore `server.js`

Open:

```text
server.js
```

Key code:

```js
const app = require("./src/app");
const { ensureDataFiles } = require("./src/utils/ensureDataFiles");
const appEvents = require("./src/events/appEvents");
require("./src/events/listeners");
```

### What to explain

This file does four important things:

1. Imports the Express app.
2. Ensures required data files exist before accepting requests.
3. Loads event listeners.
4. Starts the server.

### Important theory

`require("./src/events/listeners")` is imported without assigning it to a variable.

Why?

Because this file registers event listeners as a side effect:

```js
appEvents.on("note:created", async (payload) => { ... })
```

So when the file is required, listeners become active.

### Explain this function

```js
async function startServer() {
  await ensureDataFiles();

  app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}`);
    appEvents.emit("server:started", { port: PORT, at: new Date().toISOString() });
  });
}
```

### Instructor explanation

> Before the server starts accepting HTTP requests, we make sure the data folder and files exist. This avoids first-run crashes. Then, when the server starts successfully, we emit a `server:started` event so another part of the app can log it.

### Real-life example

In real systems, server startup may trigger:

- Health check registration
- Startup audit log
- Cache warming
- Message queue connection
- Background job scheduler

### Run and observe

Run:

```bash
npm run dev
```

Then open:

```text
data/event-log.txt
```

You should see a server startup log after listeners are active.

---

## 8. Step 3: Explore `src/app.js`

Open:

```text
src/app.js
```

Key code:

```js
const express = require("express");
const app = express();
app.use(express.json());
```

### What to explain

`express.json()` is middleware. It reads incoming JSON request body and makes it available as:

```js
req.body
```

Without this line, POST/PATCH JSON body will not be parsed correctly.

### Explain route registration

```js
app.use("/api/async-notes", notesAsyncRoutes);
app.use("/api/sync-notes", notesSyncRoutes);
app.use("/api/path", pathRoutes);
app.use("/api/events", eventRoutes);
```

This means:

| Base path | Router file |
|---|---|
| `/api/async-notes` | `notesAsyncRoutes.js` |
| `/api/sync-notes` | `notesSyncRoutes.js` |
| `/api/path` | `pathRoutes.js` |
| `/api/events` | `eventRoutes.js` |

### Request flow example

When client calls:

```text
POST /api/async-notes
```

Express resolves it like this:

```text
src/app.js base path: /api/async-notes
        +
notesAsyncRoutes.js route: /
        =
POST /api/async-notes
```

### Real-life example

In a larger project:

```js
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
```

This keeps the app modular.

---

# Part B: `path` Module

---

## 9. Step 4: Explain Why `path` Module Exists

Open:

```text
src/config/paths.js
```

Key code:

```js
const path = require("path");

const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, "data");
```

### Theory

The `path` module helps Node.js safely build and inspect file paths.

Different operating systems use different path separators:

| OS | Example separator |
|---|---|
| Linux | `/` |
| macOS | `/` |
| Windows | `\` |

Bad practice:

```js
const filePath = __dirname + "/data/notes.json";
```

Better practice:

```js
const filePath = path.join(process.cwd(), "data", "notes.json");
```

### Explain `process.cwd()`

`process.cwd()` means:

> The current working directory from where the Node.js process was started.

In this project, it should be the project root.

### Explain exported paths

```js
module.exports = {
  ROOT_DIR,
  DATA_DIR,
  ASYNC_NOTES_FILE: path.join(DATA_DIR, "notes-async.json"),
  SYNC_NOTES_FILE: path.join(DATA_DIR, "notes-sync.json"),
  EVENT_LOG_FILE: path.join(DATA_DIR, "event-log.txt")
};
```

### Instructor explanation

> We centralize all file paths in one file. If later we move data files to another folder, we only update this config file instead of changing many files.

### Real-life example

This pattern is used for:

- Uploaded image folder
- Generated PDF folder
- CSV import folder
- Log file location
- Temporary processing directory

---

## 10. Step 5: Explore `pathRoutes.js`

Open:

```text
src/routes/pathRoutes.js
```

Key route:

```js
router.get("/inspect", (req, res) => {
  const filename = req.query.filename || "notes.txt";
  const unsafeExample = `${DATA_DIR}/${filename}`;
  const safeJoinedPath = path.join(DATA_DIR, filename);

  res.json({
    input: filename,
    unsafeStringConcatExample: unsafeExample,
    safeJoinedPath,
    resolvedPath: path.resolve(DATA_DIR, filename),
    basename: path.basename(safeJoinedPath),
    dirname: path.dirname(safeJoinedPath),
    extname: path.extname(safeJoinedPath),
    normalized: path.normalize(`${DATA_DIR}//folder/../${filename}`),
    separatorUsedByCurrentOS: path.sep
  });
});
```

### Test route

```bash
curl "http://localhost:5000/api/path/inspect?filename=report.pdf"
```

### Explain each output

| Output field | Meaning |
|---|---|
| `basename` | File name from full path |
| `dirname` | Parent folder path |
| `extname` | File extension |
| `resolve` | Absolute path |
| `normalize` | Cleans strange path segments |
| `path.sep` | OS-specific separator |

### Real-life example

Suppose users upload invoices:

```js
const invoicePath = path.join(DATA_DIR, "invoices", `${invoiceId}.pdf`);
```

This is safer than manually writing:

```js
const invoicePath = DATA_DIR + "/invoices/" + invoiceId + ".pdf";
```

### Instructor warning

This route is educational. In production, never blindly trust file names from user input. You must validate file names to avoid path traversal attacks such as:

```text
../../secret.txt
```

---

# Part C: `fs` Module and Async File CRUD

---

## 11. Step 6: Explain `fs` Module

### Theory

`fs` means **file system**.

Node.js uses `fs` to interact with files and folders.

Common operations:

| CRUD idea | File-system operation |
|---|---|
| Create | Write new data to file |
| Read | Read file content |
| Update | Read existing content, modify it, write back |
| Delete | Remove item from file or delete file |

### Important Node.js `fs` styles

Node.js has multiple ways to use `fs`:

| Style | Example | Use case |
|---|---|---|
| Promise-based async | `fs/promises.readFile()` | Modern apps and APIs |
| Callback-based async | `fs.readFile(path, cb)` | Older Node.js style |
| Synchronous | `fs.readFileSync()` | Startup scripts, CLI tools, quick demos |

This project uses:

```text
Async CRUD -> fs/promises
Sync CRUD  -> fs.readFileSync / fs.writeFileSync
```

---

## 12. Step 7: Explore Async Service `fileStoreAsync.js`

Open:

```text
src/services/fileStoreAsync.js
```

Start with imports:

```js
const fs = require("fs/promises");
const { randomUUID } = require("crypto");
const { ASYNC_NOTES_FILE } = require("../config/paths");
```

### Explain each import

| Import | Purpose |
|---|---|
| `fs/promises` | Promise-based file read/write |
| `randomUUID` | Creates unique note IDs |
| `ASYNC_NOTES_FILE` | Path to JSON file |

### Explain read operation

```js
async function readNotes() {
  const raw = await fs.readFile(ASYNC_NOTES_FILE, "utf8");
  return JSON.parse(raw || "[]");
}
```

Step-by-step:

1. Read file as UTF-8 text.
2. The file content is still a string.
3. Convert JSON string into JavaScript array using `JSON.parse()`.
4. Return the array.

### Board diagram

```text
notes-async.json
      |
      v
fs.readFile()
      |
      v
JSON string
      |
      v
JSON.parse()
      |
      v
JavaScript array
```

### Explain write operation

```js
async function writeNotes(notes) {
  await fs.writeFile(ASYNC_NOTES_FILE, JSON.stringify(notes, null, 2), "utf8");
}
```

Step-by-step:

1. Receive JavaScript array.
2. Convert it to JSON string using `JSON.stringify()`.
3. `null, 2` formats JSON with indentation.
4. Write it back to the file.

### Board diagram

```text
JavaScript array
      |
      v
JSON.stringify(data, null, 2)
      |
      v
JSON string
      |
      v
fs.writeFile()
      |
      v
notes-async.json
```

### Real-life example

In a real app, this service layer would become a database repository:

```js
await NoteModel.find();
await NoteModel.create(req.body);
await NoteModel.findByIdAndUpdate(id, changes);
```

But the route layer can remain almost the same.

---

## 13. Step 8: Explain Async Create Operation

In `fileStoreAsync.js`, open:

```js
async function createNote({ title, body }) {
  const notes = await readNotes();

  const note = {
    id: randomUUID(),
    title,
    body: body || "",
    mode: "async",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  notes.push(note);
  await writeNotes(notes);
  return note;
}
```

### Explain line by line

1. `await readNotes()` loads existing notes.
2. A new note object is created.
3. `randomUUID()` gives every note a unique identifier.
4. `body || ""` gives a fallback empty body.
5. `createdAt` and `updatedAt` are audit fields.
6. `notes.push(note)` adds the note to the array.
7. `await writeNotes(notes)` saves the full array back to JSON file.
8. Return the created note to the route.

### Real-life use case

This is similar to:

- Creating a support ticket
- Saving a blog draft
- Creating a product review
- Saving an uploaded file metadata record

---

## 14. Step 9: Explain Async Read, Update, Delete

### Read all

```js
async function getAllNotes() {
  return readNotes();
}
```

This simply returns all records.

### Read one

```js
async function getNoteById(id) {
  const notes = await readNotes();
  return notes.find((note) => note.id === id) || null;
}
```

Explain:

- `find()` returns the first matching note.
- If no note is found, return `null`.

### Update

```js
async function updateNote(id, changes) {
  const notes = await readNotes();
  const index = notes.findIndex((note) => note.id === id);

  if (index === -1) return null;

  notes[index] = {
    ...notes[index],
    ...changes,
    updatedAt: new Date().toISOString()
  };

  await writeNotes(notes);
  return notes[index];
}
```

Explain:

- `findIndex()` finds the position of the note.
- `-1` means not found.
- Spread operator keeps old fields and applies new fields.
- `updatedAt` changes every time update happens.

### Delete

```js
async function deleteNote(id) {
  const notes = await readNotes();
  const note = notes.find((item) => item.id === id);

  if (!note) return null;

  const remaining = notes.filter((item) => item.id !== id);
  await writeNotes(remaining);
  return note;
}
```

Explain:

- Find the note first.
- If not found, return null.
- Use `filter()` to keep all notes except deleted note.
- Save remaining notes.

### Real-life caution

File-based CRUD works for class learning, but has real limitations:

1. No concurrent write protection.
2. No query optimization.
3. No indexes.
4. No transactions.
5. Not good for high traffic.

This is why production systems use databases.

---

## 15. Step 10: Explore Async Routes `notesAsyncRoutes.js`

Open:

```text
src/routes/notesAsyncRoutes.js
```

### Explain route imports

```js
const express = require("express");
const appEvents = require("../events/appEvents");
const {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
} = require("../services/fileStoreAsync");
```

### Teaching point

Routes should not contain too much business logic. They should:

1. Receive request.
2. Validate request.
3. Call service.
4. Emit event if needed.
5. Send response.
6. Pass errors to error handler.

---

## 16. Step 11: Explain Middleware Validation

In `notesAsyncRoutes.js`:

```js
function validateTitle(req, res, next) {
  if (!req.body.title || typeof req.body.title !== "string") {
    return res.status(400).json({ error: "title is required and must be a string" });
  }
  next();
}
```

### Explain

This middleware checks that the request body contains a valid title.

If invalid:

```text
Return 400 Bad Request
```

If valid:

```js
next();
```

This passes control to the next handler.

### Real-life example

In a real app, validation is used for:

- User registration form
- Product creation form
- Payment request
- File upload metadata
- Task creation

---

## 17. Step 12: Explain Async GET Route

```js
router.get("/", async (req, res, next) => {
  try {
    const notes = await getAllNotes();
    res.json({ count: notes.length, data: notes });
  } catch (error) {
    next(error);
  }
});
```

### Request flow

```text
GET /api/async-notes
      |
      v
router.get("/")
      |
      v
getAllNotes()
      |
      v
readNotes()
      |
      v
fs.readFile()
      |
      v
res.json(...)
```

### Important teaching point

The route uses `try/catch` because async operations can fail.

Possible failures:

- File missing
- Invalid JSON
- Permission problem
- Disk issue

---

## 18. Step 13: Explain Async POST Route and Event Emission

```js
router.post("/", validateTitle, async (req, res, next) => {
  try {
    const note = await createNote(req.body);
    appEvents.emit("note:created", { mode: "async", note });
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
});
```

### Step-by-step execution

```text
1. Client sends POST request
2. express.json() parses body
3. validateTitle middleware checks title
4. createNote() writes data to JSON file
5. note:created event is emitted
6. listener writes audit log
7. API responds with 201 Created
```

### Why event after create?

Because audit logging is a side effect. It should not be mixed deeply with the main note creation logic.

### Real-life example

When a user places an order:

```text
Order created
      |
      +--> Send email
      +--> Notify warehouse
      +--> Write audit log
      +--> Update analytics
```

Instead of putting all these actions inside the route, we can emit an event:

```js
appEvents.emit("order:created", order);
```

Then different listeners can react.

---

## 19. Step 14: Test Async CRUD Live

Use `requests.http` or run curl commands.

### Create async note

```bash
curl -X POST http://localhost:5000/api/async-notes \
  -H "Content-Type: application/json" \
  -d '{"title":"First async note","body":"This note uses fs/promises"}'
```

Now open:

```text
data/notes-async.json
data/event-log.txt
```

Students should see:

1. New note saved in JSON.
2. `note:created` log written in event log.

### Read all

```bash
curl http://localhost:5000/api/async-notes
```

### Update one

Copy note ID, then:

```bash
curl -X PATCH http://localhost:5000/api/async-notes/PASTE_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{"body":"Updated body from live class"}'
```

### Delete one

```bash
curl -X DELETE http://localhost:5000/api/async-notes/PASTE_ID_HERE
```

---

# Part D: Sync File CRUD

---

## 20. Step 15: Explore Sync Service `fileStoreSync.js`

Open:

```text
src/services/fileStoreSync.js
```

Key imports:

```js
const fs = require("fs");
const { randomUUID } = require("crypto");
const { SYNC_NOTES_FILE } = require("../config/paths");
```

### Compare with async service

Async version:

```js
const fs = require("fs/promises");
await fs.readFile(...);
```

Sync version:

```js
const fs = require("fs");
fs.readFileSync(...);
```

### Explain sync read

```js
function readNotesSync() {
  const raw = fs.readFileSync(SYNC_NOTES_FILE, "utf8");
  return JSON.parse(raw || "[]");
}
```

### Explain sync write

```js
function writeNotesSync(notes) {
  fs.writeFileSync(SYNC_NOTES_FILE, JSON.stringify(notes, null, 2), "utf8");
}
```

### Main theory

Synchronous file operations block the current JavaScript thread.

Meaning:

```text
While Node.js is reading/writing file synchronously,
it cannot continue processing the next JavaScript task on that thread.
```

---

## 21. Step 16: Sync vs Async Classroom Explanation

Draw this comparison:

```text
ASYNC FILE OPERATION

Request A -> Start file read -> Continue event loop -> File read finishes -> Callback/Promise resumes
Request B -> Can be handled while A is waiting

SYNC FILE OPERATION

Request A -> Start file read -> Wait... wait... wait... -> Finish
Request B -> Must wait until sync operation finishes
```

### Simple analogy

Async operation:

> You order tea, then continue teaching while tea is being prepared. When tea is ready, someone calls you.

Sync operation:

> You order tea and stand at the counter doing nothing until tea is ready. The whole class waits.

### When sync fs is acceptable

- Reading config during app startup
- CLI scripts
- Small build scripts
- One-time migration scripts
- Educational demos

### When sync fs should be avoided

- High-traffic API route handlers
- Payment APIs
- Login APIs
- Upload APIs
- Real-time apps

---

## 22. Step 17: Explore Sync Routes `notesSyncRoutes.js`

Open:

```text
src/routes/notesSyncRoutes.js
```

Key route:

```js
router.get("/", (req, res, next) => {
  try {
    const notes = getAllNotesSync();
    res.json({
      warning: "This route uses synchronous fs. Educational only.",
      count: notes.length,
      data: notes
    });
  } catch (error) {
    next(error);
  }
});
```

### Explain

Notice this route is not marked as `async`. The service returns result directly because sync function blocks until it finishes.

### Compare async route

Async:

```js
const notes = await getAllNotes();
```

Sync:

```js
const notes = getAllNotesSync();
```

### Test sync note

```bash
curl -X POST http://localhost:5000/api/sync-notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Sync note","body":"This uses readFileSync and writeFileSync"}'
```

Then open:

```text
data/notes-sync.json
data/event-log.txt
```

---

# Part E: Event Module

---

## 23. Step 18: Explain Why Events Are Needed

### Real-life problem

Suppose your note creation route has to do this:

1. Save note.
2. Write audit log.
3. Send email.
4. Send Slack notification.
5. Update analytics.
6. Notify admin.

Bad route design:

```js
router.post("/", async (req, res) => {
  const note = await createNote(req.body);
  await writeAuditLog(note);
  await sendEmail(note);
  await sendSlackNotification(note);
  await updateAnalytics(note);
  res.json(note);
});
```

Problem:

- Route becomes too big.
- Business logic and side effects are mixed.
- Hard to test.
- Hard to add/remove behavior.

Better design:

```js
const note = await createNote(req.body);
appEvents.emit("note:created", { note });
res.status(201).json(note);
```

Now listeners handle side effects separately.

---

## 24. Step 19: Explore `appEvents.js`

Open:

```text
src/events/appEvents.js
```

Code:

```js
const EventEmitter = require("events");

class AppEvents extends EventEmitter {}

const appEvents = new AppEvents();

module.exports = appEvents;
```

### Explain

`EventEmitter` is a built-in Node.js class.

It gives us methods like:

| Method | Purpose |
|---|---|
| `.on()` | Register listener |
| `.emit()` | Fire/trigger event |
| `.once()` | Listen only one time |
| `.off()` | Remove listener |

### Why singleton instance?

This project exports one shared instance:

```js
const appEvents = new AppEvents();
```

So any file can import the same event bus.

### Real-life mapping

In larger apps, this pattern can evolve into:

- RabbitMQ
- Kafka
- Redis Pub/Sub
- AWS SNS/SQS
- Background job queues

---

## 25. Step 20: Explore `listeners.js`

Open:

```text
src/events/listeners.js
```

Key function:

```js
async function appendEventLog(type, payload) {
  const line = JSON.stringify({ type, payload, at: new Date().toISOString() }) + "\n";
  await fs.appendFile(EVENT_LOG_FILE, line, "utf8");
}
```

### Explain

This function appends one JSON line to `event-log.txt`.

Why append?

Because logs are usually append-only. We normally do not rewrite the whole log file each time.

### Explain listener registration

```js
appEvents.on("note:created", async (payload) => {
  console.log("[event] note:created", payload.note.id);
  await appendEventLog("note:created", payload);
});
```

### Execution flow

```text
Route emits: note:created
        |
        v
listeners.js catches event
        |
        v
appendEventLog()
        |
        v
data/event-log.txt updated
```

### Important theory

`EventEmitter` listeners are called synchronously in registration order. But here each listener starts an async file append operation.

So students must understand:

```text
emit() calls the listener immediately.
Inside the listener, await fs.appendFile() performs async file writing.
```

---

## 26. Step 21: Trace One Full Event Flow

Use this example:

```bash
curl -X POST http://localhost:5000/api/async-notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Event flow note","body":"Observe event-log.txt"}'
```

Now trace:

```text
1. Client sends POST /api/async-notes
2. notesAsyncRoutes.js receives request
3. validateTitle() passes
4. createNote() writes note to notes-async.json
5. appEvents.emit("note:created", payload)
6. listeners.js receives note:created
7. appendEventLog() writes one line to event-log.txt
8. Client receives 201 response
```

Open these files after request:

```text
data/notes-async.json
data/event-log.txt
```

### Instructor message

> The note file is the main business data. The event log file is the side-effect/audit data. This separation is a very important backend design idea.

---

## 27. Step 22: Explore Event Routes `eventRoutes.js`

Open:

```text
src/routes/eventRoutes.js
```

### Demo event

```js
router.post("/demo", (req, res) => {
  const payload = {
    message: req.body.message || "Hello EventEmitter",
    triggeredFrom: "POST /api/events/demo"
  };

  appEvents.emit("demo:ping", payload);

  res.json({
    message: "demo:ping event emitted",
    payload
  });
});
```

### Test

```bash
curl -X POST http://localhost:5000/api/events/demo \
  -H "Content-Type: application/json" \
  -d '{"message":"Testing event from class"}'
```

Then read logs:

```bash
curl http://localhost:5000/api/events/logs
```

### Explain log reading

```js
const raw = await fs.readFile(EVENT_LOG_FILE, "utf8");
const lines = raw.trim().split("\n").filter(Boolean).map((line) => JSON.parse(line));
res.json({ count: lines.length, data: lines });
```

Step-by-step:

1. Read full log file.
2. Split by new line.
3. Remove empty lines.
4. Parse each JSON line.
5. Return logs as API response.

### Real-life example

This is similar to reading:

- Audit logs
- Login history
- Payment event history
- Webhook delivery logs
- Background job logs

---

# Part F: File Initialization and Stability

---

## 28. Step 23: Explore `ensureDataFiles.js`

Open:

```text
src/utils/ensureDataFiles.js
```

Key code:

```js
async function ensureDataFiles() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  if (!(await fileExists(ASYNC_NOTES_FILE))) {
    await fs.writeFile(ASYNC_NOTES_FILE, "[]\n", "utf8");
  }

  if (!(await fileExists(SYNC_NOTES_FILE))) {
    await fs.writeFile(SYNC_NOTES_FILE, "[]\n", "utf8");
  }

  if (!(await fileExists(EVENT_LOG_FILE))) {
    await fs.writeFile(EVENT_LOG_FILE, "", "utf8");
  }
}
```

### Explain

This utility makes the project stable for students.

If a student accidentally deletes:

```text
data/notes-async.json
data/notes-sync.json
data/event-log.txt
```

The server recreates them at startup.

### Real-life use case

Production apps often do startup checks:

- Ensure upload folder exists.
- Ensure temp folder exists.
- Check database connection.
- Check Redis connection.
- Check required environment variables.

---

## 29. Step 24: Explain Error Handling

Open:

```text
src/middleware/errorHandler.js
```

### Not found handler

```js
function notFoundHandler(req, res) {
  res.status(404).json({
    error: "Route not found",
    method: req.method,
    path: req.originalUrl
  });
}
```

This handles unknown routes.

Test:

```bash
curl http://localhost:5000/api/wrong-route
```

### Error handler

```js
function errorHandler(err, req, res, next) {
  console.error("[error]", err);

  res.status(500).json({
    error: "Internal Server Error",
    message: err.message
  });
}
```

### Express theory

An error-handling middleware has four parameters:

```js
(err, req, res, next)
```

If Express sees four parameters, it treats this function as an error handler.

### Real-life example

In production, error handlers usually:

- Hide internal error details from users.
- Log error to a monitoring system.
- Return a clean error response.
- Attach request ID for debugging.

---

# Part G: Complete Request Lifecycle

---

## 30. Full Request Flow: Create Async Note

Use this as a final board explanation.

```text
Client
  |
  | POST /api/async-notes
  v
src/app.js
  |
  | app.use("/api/async-notes", notesAsyncRoutes)
  v
src/routes/notesAsyncRoutes.js
  |
  | validateTitle()
  v
src/services/fileStoreAsync.js
  |
  | readNotes()
  | create object
  | writeNotes()
  v
data/notes-async.json
  |
  | saved successfully
  v
appEvents.emit("note:created")
  |
  v
src/events/listeners.js
  |
  | appendEventLog()
  v
data/event-log.txt
  |
  v
Response: 201 Created
```

### Instructor explanation

> This is the most important flow of the whole project. Students must understand that a backend request usually passes through multiple layers, not just one function.

---

## 31. Full Request Flow: Path Inspect

```text
Client
  |
  | GET /api/path/inspect?filename=report.pdf
  v
src/app.js
  |
  v
src/routes/pathRoutes.js
  |
  | path.join()
  | path.resolve()
  | path.basename()
  | path.dirname()
  | path.extname()
  v
Response with path details
```

### Real-life use case

This is similar to an API that manages uploaded documents:

```text
GET /api/files/invoices/INV-1001.pdf
```

The backend needs to build a safe file path before reading the file.

---

## 32. Full Request Flow: Event Demo

```text
Client
  |
  | POST /api/events/demo
  v
eventRoutes.js
  |
  | appEvents.emit("demo:ping")
  v
listeners.js
  |
  | appendEventLog()
  v
data/event-log.txt
  |
  v
Response: event emitted
```

---

# Part H: Real-Life Project Use Cases

---

## 33. Use Case 1: Audit Log System

When important actions happen, we store audit logs.

Examples:

```text
user:logged_in
user:password_changed
order:created
payment:failed
invoice:downloaded
note:deleted
```

In this project:

```js
appEvents.emit("note:deleted", { mode: "async", id: req.params.id });
```

This maps to a real audit trail.

---

## 34. Use Case 2: Local JSON Before Database

Early-stage teams sometimes build prototypes with JSON files before adding a real database.

This helps them test:

- API structure
- Routes
- Request/response format
- Frontend integration
- Basic validation

Later they replace file service with database service.

### Example evolution

```text
Week 1 prototype: JSON file
Week 2 MVP: SQLite/MongoDB
Week 3 production: PostgreSQL/MongoDB with indexes
```

---

## 35. Use Case 3: Report Generation

Many backend systems generate files:

- PDF invoices
- CSV reports
- Excel exports
- Text logs
- JSON backup files

The `fs` and `path` modules are used heavily in those cases.

---

## 36. Use Case 4: Notification System

Events are useful when one action should trigger many reactions.

Example:

```text
payment:success
  |-- send email receipt
  |-- notify accounting
  |-- update invoice status
  |-- create audit log
  |-- send webhook
```

In this educational project:

```text
note:created
  |-- write audit log
```

The concept is the same, only smaller.

---

# Part I: Important Theory Recap

---

## 37. `fs` Module Summary

The `fs` module lets Node.js work with files and folders.

Important operations:

| Operation | Async example | Sync example |
|---|---|---|
| Read | `await fs.readFile()` | `fs.readFileSync()` |
| Write | `await fs.writeFile()` | `fs.writeFileSync()` |
| Append | `await fs.appendFile()` | `fs.appendFileSync()` |
| Delete file | `await fs.unlink()` | `fs.unlinkSync()` |
| Create folder | `await fs.mkdir()` | `fs.mkdirSync()` |
| Check access | `await fs.access()` | `fs.accessSync()` |

---

## 38. Async vs Sync Summary

| Topic | Async fs | Sync fs |
|---|---|---|
| Style | Promise/callback | Direct return |
| Blocks event loop? | No, while waiting for I/O | Yes |
| Best for HTTP APIs? | Yes | No |
| Easy to read? | Yes with async/await | Yes, but risky in server routes |
| Example | `await fs.readFile()` | `fs.readFileSync()` |

### Interview answer

> Async file operations allow Node.js to continue handling other work while waiting for file I/O. Sync file operations block the main JavaScript thread, so they should generally be avoided inside high-traffic HTTP route handlers.

---

## 39. `path` Module Summary

Common methods:

| Method | Purpose |
|---|---|
| `path.join()` | Join path parts safely |
| `path.resolve()` | Create absolute path |
| `path.basename()` | Get file name |
| `path.dirname()` | Get parent directory |
| `path.extname()` | Get file extension |
| `path.normalize()` | Clean path |
| `path.sep` | OS-specific separator |

### Interview answer

> The `path` module helps create and inspect file paths in a cross-platform way, so the same code works on Linux, macOS, and Windows.

---

## 40. `events` Module Summary

Important methods:

| Method | Purpose |
|---|---|
| `.on()` | Register listener |
| `.emit()` | Trigger event |
| `.once()` | Listen one time only |
| `.off()` | Remove listener |

### Interview answer

> Node.js `events` module provides `EventEmitter`, which allows one part of an application to emit named events and other parts to listen and react. It is useful for separating core business logic from side effects like logging, notifications, and analytics.

---

# Part J: Instructor-Led Live Coding Sequence

---

## 41. Recommended Teaching Sequence

Follow this exact sequence in class:

### Phase 1: Run existing app

```bash
npm install
npm run seed
npm run dev
```

Visit:

```text
http://localhost:5000
http://localhost:5000/health
```

Explain `server.js` and `app.js`.

---

### Phase 2: Show visible data storage

Open:

```text
data/notes-async.json
data/notes-sync.json
data/event-log.txt
```

Explain:

> These files are our educational database and audit log.

---

### Phase 3: Explain path config

Open:

```text
src/config/paths.js
src/routes/pathRoutes.js
```

Run:

```bash
curl "http://localhost:5000/api/path/inspect?filename=class-note.txt"
```

---

### Phase 4: Explain async CRUD service

Open:

```text
src/services/fileStoreAsync.js
```

Explain:

```text
readNotes()
writeNotes()
getAllNotes()
getNoteById()
createNote()
updateNote()
deleteNote()
```

---

### Phase 5: Explain async route layer

Open:

```text
src/routes/notesAsyncRoutes.js
```

Create note:

```bash
curl -X POST http://localhost:5000/api/async-notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Live class note","body":"Created during lecture"}'
```

Open:

```text
data/notes-async.json
```

---

### Phase 6: Explain events

Open:

```text
src/events/appEvents.js
src/events/listeners.js
```

Then explain this line from route:

```js
appEvents.emit("note:created", { mode: "async", note });
```

Open:

```text
data/event-log.txt
```

---

### Phase 7: Compare sync CRUD

Open:

```text
src/services/fileStoreSync.js
src/routes/notesSyncRoutes.js
```

Create sync note:

```bash
curl -X POST http://localhost:5000/api/sync-notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Sync class note","body":"Educational sync route"}'
```

Explain why it works, but why async is preferred in real server routes.

---

### Phase 8: Explain error handling

Open:

```text
src/middleware/errorHandler.js
```

Test wrong route:

```bash
curl http://localhost:5000/wrong-url
```

---

# Part K: Common Student Confusions

---

## 42. Confusion 1: Is JSON file a database?

Answer:

> Not exactly. A JSON file can store data, but it does not provide database features like indexing, transactions, concurrent write safety, query optimization, or access control.

---

## 43. Confusion 2: Does async mean faster?

Answer:

> Async does not always mean one operation becomes faster. It means Node.js can continue handling other work while waiting for the operation to complete.

---

## 44. Confusion 3: Does EventEmitter run in another thread?

Answer:

> No. EventEmitter itself does not create a new thread. It calls registered listeners. If the listener starts async work, that async work can complete later.

---

## 45. Confusion 4: Why separate route and service?

Answer:

> Routes should handle HTTP concerns. Services should handle business/data logic. This makes the app easier to test, change, and maintain.

---

## 46. Confusion 5: Why do we rewrite the whole JSON file?

Answer:

> Because this is a simple educational storage system. Real databases update records more efficiently. For small JSON demos, reading and rewriting is easier to understand.

---

# Part L: Interview Questions

---

## 47. Basic Interview Questions

1. What is the `fs` module in Node.js?
2. What is the difference between `fs` and `fs/promises`?
3. What is the difference between `readFile()` and `readFileSync()`?
4. Why should sync file operations be avoided in high-traffic APIs?
5. What is the `path` module used for?
6. Why is `path.join()` better than manual string concatenation?
7. What is `EventEmitter`?
8. What is the difference between `.on()` and `.emit()`?
9. What is middleware in Express?
10. Why do we use `express.json()`?

---

## 48. Strong Interview Answers

### Q1: What is the `fs` module?

> The `fs` module is a built-in Node.js module that allows applications to interact with the file system. It can read, write, append, delete files, create folders, and check file access.

### Q2: Difference between async and sync file operations?

> Async file operations allow the event loop to continue while file I/O is pending. Sync file operations block the current JavaScript thread until the file operation completes.

### Q3: What is `EventEmitter`?

> `EventEmitter` is a Node.js class from the `events` module that allows one part of an app to emit named events and other parts to listen and react to those events.

### Q4: Why use events in backend projects?

> Events help separate main business logic from side effects. For example, after creating an order, the system can emit `order:created`, and separate listeners can send emails, write logs, or notify other services.

### Q5: Why use the `path` module?

> The `path` module helps build and inspect file paths in a safe, cross-platform way. It avoids OS-specific path separator issues and makes code more portable.

---

# Part M: Final Recap Script for Instructor

Use this closing script:

> Today we built a small Express API, but the main learning was Node.js core modules. We saw how `path` helps us create safe file paths, how `fs` reads and writes JSON files, how async file operations are better for server routes, how sync operations block the main thread, and how `EventEmitter` allows us to trigger side effects like audit logging without mixing everything inside one route. This same architecture appears in real backend systems where data is stored in databases, events trigger notifications, and logs help teams audit user activity.

---

# Part N: Suggested Homework

Ask students to add these features:

1. Add `GET /api/async-notes/search?title=abc`.
2. Add note category field.
3. Add validation so title must be at least 3 characters.
4. Add a new event called `note:read` when one note is viewed.
5. Add a listener that writes `note:read` to `event-log.txt`.
6. Add route `GET /api/events/logs/type/:type` to filter event logs.
7. Add `path` validation to reject filenames containing `..`.

---

# Part O: Final Concept Map

```text
Express
  |
  | receives HTTP request
  v
Route
  |
  | validates request and calls service
  v
Service
  |
  | performs CRUD logic
  v
fs module
  |
  | reads/writes data
  v
JSON file

After successful action:

Route/Service
  |
  | emits event
  v
EventEmitter
  |
  | listener reacts
  v
fs.appendFile()
  |
  v
event-log.txt

Path support:

path.join()
path.resolve()
path.basename()
path.dirname()
path.extname()
```

