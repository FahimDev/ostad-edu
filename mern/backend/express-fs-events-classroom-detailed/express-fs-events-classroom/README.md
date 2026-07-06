# Express FS + Events Classroom Project

A small educational Express.js project for teaching these Node.js topics:

- `fs` module
- File-based CRUD
- Synchronous vs asynchronous file operations
- `events` module and `EventEmitter`
- `path` module
- Express routing and middleware

This project intentionally uses JSON files as storage so students can see how data changes directly inside the `data/` folder.

---

## 1. Project Goal

Students will build a mini Notes API where notes are saved in local JSON files.

They will see:

1. How Express receives HTTP requests.
2. How `fs/promises` reads and writes files asynchronously.
3. How sync file operations work and why they can block the server.
4. How `EventEmitter` can separate business action from side effects.
5. How `path.join()` creates safe cross-platform file paths.

---

## 2. Requirements

Use Node.js 18 or later.

Check your version:

```bash
node -v
npm -v
```

---

## 3. Installation

```bash
npm install
```

Optional seed data:

```bash
npm run seed
```

Start development server:

```bash
npm run dev
```

Or start without nodemon:

```bash
npm start
```

Server runs at:

```text
http://localhost:5000
```

---

## 4. Project Structure

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

---

## 5. API Endpoints

### General

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Project overview |
| GET | `/health` | Server health |

### Path Module Demo

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/path/inspect?filename=notes.txt` | Shows `path.join`, `resolve`, `basename`, `dirname`, `extname`, `normalize` |

### Async File CRUD

Uses `fs/promises`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/async-notes` | Get all async notes |
| GET | `/api/async-notes/:id` | Get one async note |
| POST | `/api/async-notes` | Create async note |
| PATCH | `/api/async-notes/:id` | Update async note |
| DELETE | `/api/async-notes/:id` | Delete async note |

Example create request:

```bash
curl -X POST http://localhost:5000/api/async-notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn async fs","body":"Async file I/O is non-blocking."}'
```

### Sync File CRUD

Uses `fs.readFileSync()` and `fs.writeFileSync()`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/sync-notes` | Get all sync notes |
| GET | `/api/sync-notes/:id` | Get one sync note |
| POST | `/api/sync-notes` | Create sync note |
| PATCH | `/api/sync-notes/:id` | Update sync note |
| DELETE | `/api/sync-notes/:id` | Delete sync note |

Important: sync routes are educational only. In real production HTTP APIs, prefer async file operations or a database.

### Event Module Demo

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/events/demo` | Emits a custom `demo:ping` event |
| GET | `/api/events/logs` | Reads event logs from file |
| DELETE | `/api/events/logs` | Clears event logs |

---

## 6. Recommended Class Flow

1. Start with `server.js` and `src/app.js`.
2. Explain `path` module using `src/config/paths.js`.
3. Build async file CRUD first.
4. Compare with sync file CRUD.
5. Add event emitter and listeners.
6. Watch how `data/event-log.txt` changes after API actions.
7. Use `requests.http`, Postman, Thunder Client, or curl for testing.

---

## 7. Important Theory Summary

### fs module

The `fs` module allows Node.js to interact with the file system.

Common operations:

- Create file
- Read file
- Update file
- Delete file
- Append to file
- Check file access

### Async fs

Async file operations do not block the main event loop while waiting for disk I/O.

Example:

```js
const fs = require("fs/promises");
const data = await fs.readFile("notes.json", "utf8");
```

### Sync fs

Sync file operations block the current JavaScript thread.

Example:

```js
const fs = require("fs");
const data = fs.readFileSync("notes.json", "utf8");
```

### events module

The `events` module provides `EventEmitter`.

Example:

```js
appEvents.emit("note:created", note);
appEvents.on("note:created", listenerFunction);
```

### path module

The `path` module helps build file paths safely across operating systems.

Example:

```js
const filePath = path.join(process.cwd(), "data", "notes.json");
```

---

## 8. Classroom Challenge

Ask students to add:

1. `category` field to notes.
2. Search notes by title.
3. A new event: `note:read`.
4. A route to export all notes into `backup.json`.
5. A route to clear all notes.

---

## 9. Interview Questions

1. What is the difference between sync and async file operations?
2. Why should sync file operations be avoided in Express route handlers?
3. What is EventEmitter?
4. Why do we use events in backend systems?
5. What is the purpose of the path module?
6. What is the difference between `path.join()` and manual string concatenation?
7. Why should JSON file storage not be used as a real production database?
8. What happens if two requests write to the same JSON file at the same time?

---

## 10. Notes for Instructor

This project is intentionally simple. It is not a production database system.

The goal is to teach Node.js core modules clearly before students move to MongoDB, PostgreSQL, Redis, or other real storage systems.
---

## Instructor Lecture Sheets

This project includes two lecture sheets:

- `LECTURE_SHEET.md` — detailed instructor walkthrough for exploring the existing codebase step by step.
- `LECTURE_SHEET_SHORT.md` — shorter classroom activity version kept for reference.

For live teaching, start with `LECTURE_SHEET.md`.

