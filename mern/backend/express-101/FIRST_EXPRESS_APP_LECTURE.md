# Your First Express App (Lecture Content)

This note is designed for beginner classroom sessions.
Goal: build and run a very first Express API app.

## 1) What is Express.js?

Express.js is a minimal and popular web framework for Node.js.
It helps us create APIs and web servers quickly.

Why beginners use Express:

- Simple syntax
- Easy routing
- Fast setup
- Huge community support

## 2) Prerequisites

Before starting, make sure:

- Node.js is installed
- npm is available
- A code editor is installed (VS Code recommended)

Check versions:

```bash
node -v
npm -v
```

## 3) Project Initialization

Create a new project folder and initialize npm:

```bash
mkdir my-first-express-app
cd my-first-express-app
npm init -y
```

This creates `package.json`, which stores project metadata and scripts.

## 4) Install Required Packages

Install Express:

```bash
npm install express
```

Install nodemon for development:

```bash
npm install --save-dev nodemon
```

## 5) Create App File

Create `app.js` and add this code:

```js
const express = require("express");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello, this is your first Express app!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

## 6) Configure Scripts in package.json

Add scripts:

```json
"scripts": {
  "start": "node app.js",
  "dev": "nodemon app.js"
}
```

## 7) Run the Server

Run in normal mode:

```bash
npm start
```

Run in development mode:

```bash
npm run dev
```

Open browser:

```text
http://localhost:3000
```

You should see:

```text
Hello, this is your first Express app!
```

## 8) Basic Configuration You Should Teach

- `const app = express()` creates Express application instance.
- `app.get()` defines a GET route.
- `req` is request object.
- `res` is response object.
- `app.listen()` starts server on a port.

## 9) Must-Know Things About Express

These are the core ideas every beginner should know:

- **Middleware order matters**
  - Express runs middleware/routes top to bottom.
  - If order is wrong, expected route may never execute.
- **Route matching is order based**
  - Put specific routes before generic ones.
  - Example: keep `/students/download` before `/students/:id`.
- **HTTP methods are different**
  - `GET` read, `POST` create, `PUT/PATCH` update, `DELETE` remove.
- **Always send one response**
  - Use one of `res.send()`, `res.json()`, `res.redirect()`, `res.download()` once per request.
- **Status code is important**
  - `200` success, `201` created, `400` bad request, `404` not found, `500` server error.
- **Use JSON for APIs**
  - Most modern APIs use `res.json()` and `express.json()` for request/response.
- **Environment-based configuration**
  - Keep port/config flexible using environment variables (`process.env.PORT`).
- **Error handling is part of API design**
  - Return clear error messages and proper status code for learners and clients.

## 10) Common Beginner Errors

- Port already in use
  - Change port or stop old process.
- `Cannot find module 'express'`
  - Run `npm install express`.
- `npm run dev` not working
  - Install nodemon as dev dependency.

## 11) Classroom Practice Tasks

1. Change root response text.
2. Add route `GET /about`.
3. Add route `GET /students` returning JSON.
4. Change port from `3000` to `5000`.
5. Run with `nodemon` and test auto-restart.

## Quick Recap

- Initialize project with npm
- Install Express + nodemon
- Create `app.js`
- Add scripts in `package.json`
- Run and test in browser/Postman

This is the foundational setup students need before learning routing, CRUD, cookies, and middleware.
