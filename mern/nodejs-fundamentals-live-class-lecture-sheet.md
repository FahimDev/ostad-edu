# Node.js Fundamentals Live Class Lecture Sheet

**Class focus:** Running JavaScript in Node.js, Node.js runtime model, single-threaded vs multithreaded, synchronous vs asynchronous, blocking vs non-blocking, modules, `module.exports`, `require`, NPM, `package.json`, URL module, HTTP module, and creating an HTTP server.

**Teaching style:** Live coding + prediction + visualization + interview drilling.

**Recommended duration:** 3 to 4 hours.

**Target students:** JavaScript learners preparing for backend development and Node.js interviews.

---

## 0. What Students Will Build

By the end of the class, students will build a small raw Node.js backend without Express:

```text
node-runtime-lab/
├── package.json
├── server.js
├── data.js
├── helpers/
│   └── response.js
└── playground/
    ├── 01-run-js.js
    ├── 02-sync-async.js
    ├── 03-blocking.js
    ├── 04-non-blocking.js
    ├── 05-modules.js
    └── 06-url.js
```

Final server routes:

```text
GET /                  -> Welcome message
GET /health            -> Server health
GET /time              -> Current server time
GET /about             -> About this API
GET /users             -> List users
GET /users?id=1        -> Get user by query parameter
GET /slow-blocking     -> Demonstrate blocking behavior
GET /slow-non-blocking -> Demonstrate non-blocking behavior
```

---

## 1. Class Learning Outcomes

After this class, students should be able to:

1. Run JavaScript using Node.js from the terminal.
2. Explain what Node.js is in interview-friendly language.
3. Explain how Node.js can handle many requests although JavaScript execution is single-threaded by default.
4. Differentiate:
   - Single-threaded vs multithreaded
   - Synchronous vs asynchronous
   - Blocking vs non-blocking
5. Explain call stack, event loop, callback queue, microtask queue, and libuv in simple terms.
6. Create and consume CommonJS modules using `module.exports` and `require`.
7. Use NPM and understand `package.json`.
8. Use Node.js built-in `url` and `http` modules.
9. Create a raw HTTP server without Express.
10. Answer common Node.js interview questions confidently.

---

## 2. Pre-Class Setup

### Required Software

Students should have:

```bash
node -v
npm -v
code -v
```

Recommended:

- Node.js LTS version
- VS Code
- Thunder Client / Postman / REST Client extension
- Browser
- Terminal

### Instructor Setup Check

Run:

```bash
node -v
npm -v
```

Expected:

```text
v20+ or latest LTS
npm version displayed
```

---

## 3. Class Opening Question

Ask students:

> If JavaScript is single-threaded, how can Node.js serve many users at the same time?

Expected early answers may be incomplete. Tell them:

> Today we will answer this by building and observing code. We will see where JavaScript runs, what blocks the thread, and how Node.js continues working using asynchronous I/O and the event loop.

---

# Part 1: Running JavaScript in Node.js

## 1.1 Concept

Node.js allows JavaScript to run outside the browser. In the browser, JavaScript is mainly used for UI behavior. In Node.js, JavaScript can be used to build servers, APIs, command-line tools, automation scripts, and backend applications.

Simple interview answer:

> Node.js is a JavaScript runtime environment built on Chrome's V8 engine. It lets us run JavaScript outside the browser and is commonly used to build servers, APIs, command-line tools, and backend services.

---

## 1.2 Live Coding Step

Create project:

```bash
mkdir node-runtime-lab
cd node-runtime-lab
mkdir playground
```

Create file:

```bash
touch playground/01-run-js.js
```

Add:

```js
console.log("Hello from Node.js");
console.log("Current directory:", __dirname);
console.log("Current file:", __filename);
```

Run:

```bash
node playground/01-run-js.js
```

---

## 1.3 Student Engagement

Ask students to modify the file:

```js
const name = "Aisha";
const role = "Node.js Learner";

console.log(`${name} is a ${role}`);
```

Ask:

1. Did we need a browser?
2. Where did the output appear?
3. What is the difference between browser console and terminal output?

---

## 1.4 Interview Questions

### Q1. What is Node.js?

Answer:

> Node.js is a JavaScript runtime environment that allows JavaScript to run outside the browser. It is built on V8 and is commonly used for backend servers, APIs, scripts, and command-line tools.

### Q2. Is Node.js a programming language?

Answer:

> No. JavaScript is the programming language. Node.js is the runtime environment that executes JavaScript outside the browser.

---

# Part 2: What is Node.js? Single-threaded vs Multithreaded

## 2.1 Concept

Node.js has a single main JavaScript execution thread by default. That means normal JavaScript code runs one line at a time on the main thread.

But Node.js can still handle many requests because slow I/O work does not have to block the main JavaScript thread. Node.js delegates many I/O operations to the operating system or libuv, then receives callbacks when the work is done.

---

## 2.2 Simple Visualization

```text
Traditional multithreaded server:

Request 1 -> Thread 1 -> Work -> Response
Request 2 -> Thread 2 -> Work -> Response
Request 3 -> Thread 3 -> Work -> Response
Request N -> Thread N -> Work -> Response

Problem: many threads = more memory + context switching
```

```text
Node.js event-driven server:

Request 1 -> Main JS Thread -> If I/O needed, delegate
Request 2 -> Main JS Thread -> If I/O needed, delegate
Request 3 -> Main JS Thread -> If I/O needed, delegate

I/O completes later -> Callback queue -> Event loop -> Call stack -> Response
```

---

## 2.3 Live Explanation

Use this analogy:

> A restaurant with one smart waiter can serve many tables if the waiter does not cook the food personally. The waiter takes orders, sends them to the kitchen, serves ready food, and continues moving. Node.js works similarly for I/O-heavy applications.

Mapping:

```text
Waiter      -> JavaScript main thread
Kitchen     -> OS / libuv / worker pool
Ready food  -> Completed async operation
Serving     -> Callback execution
```

---

## 2.4 Student Engagement Activity

Divide students into roles:

- Student 1: Main thread
- Student 2: Event loop
- Student 3: File system / database
- Student 4: Callback queue
- Other students: Client requests

Simulate:

1. Client gives request.
2. Main thread reads the request.
3. If slow work is needed, main thread delegates.
4. Main thread accepts next request.
5. Slow work completes.
6. Callback queue receives callback.
7. Event loop checks call stack.
8. Callback returns response.

---

## 2.5 Interview Questions

### Q1. Is Node.js single-threaded?

Answer:

> JavaScript execution in Node.js is single-threaded by default. However, Node.js uses the event loop, operating system async I/O, and libuv worker pool for some operations, so it can handle many concurrent I/O tasks efficiently.

### Q2. Is Node.js good for CPU-heavy work?

Answer:

> Not by default. CPU-heavy work can block the main JavaScript thread. For CPU-heavy tasks, we should use worker threads, child processes, queues, or separate services.

---

# Part 3: Synchronous vs Asynchronous

## 3.1 Concept

Synchronous code runs line by line. Each line waits for the previous line to finish.

Asynchronous code starts an operation and allows the program to continue. The result is handled later through a callback, promise, or async/await.

---

## 3.2 Live Coding: Synchronous Code

Create:

```bash
touch playground/02-sync-async.js
```

Add:

```js
console.log("1. Start");
console.log("2. Middle");
console.log("3. End");
```

Run:

```bash
node playground/02-sync-async.js
```

Expected output:

```text
1. Start
2. Middle
3. End
```

---

## 3.3 Live Coding: Asynchronous Code

Replace code with:

```js
console.log("1. Start");

setTimeout(() => {
  console.log("2. Inside setTimeout");
}, 0);

console.log("3. End");
```

Run:

```bash
node playground/02-sync-async.js
```

Expected output:

```text
1. Start
3. End
2. Inside setTimeout
```

---

## 3.4 Explain the Output

Execution order:

```text
1. console.log("Start") runs immediately
2. setTimeout registers callback
3. console.log("End") runs immediately
4. Call stack becomes empty
5. Event loop moves timer callback to call stack
6. setTimeout callback runs
```

---

## 3.5 Student Prediction Challenge

Ask students to predict output before running:

```js
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

Promise.resolve().then(() => {
  console.log("C");
});

console.log("D");
```

Expected output:

```text
A
D
C
B
```

Why?

```text
Synchronous code first: A, D
Microtask queue next: C
Macrotask/timer queue after: B
```

---

## 3.6 Interview Questions

### Q1. What is synchronous code?

Answer:

> Synchronous code executes line by line. Each operation must finish before the next operation starts.

### Q2. What is asynchronous code?

Answer:

> Asynchronous code allows a task to start and complete later without stopping the rest of the program from running.

---

# Part 4: Blocking vs Non-blocking

## 4.1 Concept

Blocking means the main thread must wait until the operation finishes.

Non-blocking means the main thread can continue doing other work while the operation completes in the background.

Important:

> Synchronous/asynchronous describes code style. Blocking/non-blocking describes whether execution is forced to wait.

---

## 4.2 Setup Demo File

Create a text file:

```bash
echo "This is a demo file for Node.js blocking and non-blocking examples." > demo.txt
```

Create:

```bash
touch playground/03-blocking.js
```

---

## 4.3 Blocking File Read

Add:

```js
const fs = require("fs");

console.log("1. Start");

const data = fs.readFileSync("demo.txt", "utf8");
console.log("2. File content:", data);

console.log("3. End");
```

Run:

```bash
node playground/03-blocking.js
```

Explain:

```text
Node.js waits at readFileSync.
Only after file reading is complete does the next line run.
```

---

## 4.4 Non-blocking File Read

Create:

```bash
touch playground/04-non-blocking.js
```

Add:

```js
const fs = require("fs");

console.log("1. Start");

fs.readFile("demo.txt", "utf8", (err, data) => {
  if (err) {
    console.log("Error:", err.message);
    return;
  }

  console.log("2. File content:", data);
});

console.log("3. End");
```

Run:

```bash
node playground/04-non-blocking.js
```

Expected output:

```text
1. Start
3. End
2. File content: This is a demo file...
```

---

## 4.5 Board Explanation

```text
Blocking:

Start -> readFileSync waits -> file complete -> End

Non-blocking:

Start -> readFile starts -> End -> file complete -> callback runs
```

---

## 4.6 Student Engagement

Ask students:

1. Which version is better for a web server?
2. What happens if 1,000 users request a file and every request uses blocking code?
3. Can non-blocking code still be slow?
4. Can CPU-heavy code block the server even if there is no file reading?

---

## 4.7 Interview Questions

### Q1. What is blocking code?

Answer:

> Blocking code stops the main thread from continuing until the current operation finishes.

### Q2. What is non-blocking code?

Answer:

> Non-blocking code allows the main thread to continue while the operation completes in the background. The result is handled later through a callback, promise, or event.

---

# Part 5: What is a Module in Node.js?

## 5.1 Concept

A module is a reusable piece of code. In Node.js, each file can act as a module.

Why modules matter:

- Organize code
- Reuse functions
- Hide private logic
- Expose only what is needed
- Make large applications maintainable

---

## 5.2 CommonJS Module System

Node.js supports CommonJS, where we use:

```js
require()
module.exports
```

`require()` imports a module.

`module.exports` exports values from a file.

---

## 5.3 Live Coding: Create a Module

Create:

```bash
touch playground/05-modules.js
mkdir helpers
```

Create helper file:

```bash
touch helpers/math.js
```

Add to `helpers/math.js`:

```js
function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

module.exports = {
  add,
  multiply,
};
```

Add to `playground/05-modules.js`:

```js
const math = require("../helpers/math");

console.log("Add:", math.add(10, 5));
console.log("Multiply:", math.multiply(10, 5));
```

Run:

```bash
node playground/05-modules.js
```

---

## 5.4 Export Single Function

Create:

```bash
touch helpers/greet.js
```

Add:

```js
function greet(name) {
  return `Hello, ${name}. Welcome to Node.js.`;
}

module.exports = greet;
```

Use it:

```js
const greet = require("../helpers/greet");

console.log(greet("Aisha"));
```

---

## 5.5 Student Engagement

Ask students to create a file:

```text
helpers/temperature.js
```

Export:

```js
celsiusToFahrenheit(celsius)
fahrenheitToCelsius(fahrenheit)
```

Then import and test them.

---

## 5.6 Interview Questions

### Q1. What is a module in Node.js?

Answer:

> A module is a reusable unit of code. In Node.js, every file can be treated as a module, and we can export or import functionality between files.

### Q2. What is `module.exports`?

Answer:

> `module.exports` defines what a file exposes when another file imports it using `require()`.

### Q3. What is `require()`?

Answer:

> `require()` is used in CommonJS to load built-in modules, third-party packages, or local files.

---

# Part 6: NPM

## 6.1 Concept

NPM means Node Package Manager. It is used to:

- Initialize Node.js projects
- Install third-party packages
- Manage dependencies
- Run scripts
- Share packages

---

## 6.2 Initialize Project

Run:

```bash
npm init -y
```

This creates:

```text
package.json
```

---

## 6.3 Install Development Tool

Install nodemon:

```bash
npm install -D nodemon
```

Explain:

```text
-D means devDependency.
Nodemon is needed during development, not production runtime.
```

---

## 6.4 Install a Normal Dependency

Install dayjs for date formatting:

```bash
npm install dayjs
```

Use it later in `/time` route.

---

## 6.5 Student Engagement

Ask students to inspect:

```text
node_modules/
package.json
package-lock.json
```

Ask:

1. Which file stores project metadata?
2. Which folder contains installed packages?
3. Which file locks exact versions?
4. Should we commit `node_modules` to Git?

Expected:

```text
Do not commit node_modules.
Commit package.json and package-lock.json.
```

---

# Part 7: Understanding package.json

## 7.1 Example package.json

Open `package.json` and update scripts:

```json
{
  "name": "node-runtime-lab",
  "version": "1.0.0",
  "description": "Node.js fundamentals live classroom project",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "play:sync": "node playground/02-sync-async.js",
    "play:blocking": "node playground/03-blocking.js",
    "play:nonblocking": "node playground/04-non-blocking.js"
  },
  "keywords": ["nodejs", "http", "event-loop", "teaching"],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "dayjs": "latest"
  },
  "devDependencies": {
    "nodemon": "latest"
  }
}
```

---

## 7.2 Important Fields

| Field | Meaning |
|---|---|
| `name` | Project/package name |
| `version` | Project version |
| `main` | Entry file |
| `scripts` | Commands we can run with npm |
| `dependencies` | Packages needed to run the app |
| `devDependencies` | Packages needed only during development |
| `license` | Usage license |

---

## 7.3 Run Scripts

Run:

```bash
npm run play:sync
npm run play:blocking
npm run play:nonblocking
```

Later:

```bash
npm run dev
```

---

## 7.4 Interview Questions

### Q1. What is package.json?

Answer:

> `package.json` is the configuration and metadata file of a Node.js project. It stores project information, scripts, dependencies, devDependencies, and package settings.

### Q2. Difference between dependencies and devDependencies?

Answer:

> Dependencies are required to run the application. devDependencies are used only during development, testing, building, or tooling.

---

# Part 8: URL Module

## 8.1 Concept

The URL module helps parse URLs and query parameters.

Example URL:

```text
http://localhost:5000/users?id=1&role=admin
```

Parts:

```text
Protocol: http
Host: localhost:5000
Pathname: /users
Query: id=1&role=admin
```

---

## 8.2 Live Coding

Create:

```bash
touch playground/06-url.js
```

Add:

```js
const { URL } = require("url");

const requestUrl = new URL("http://localhost:5000/users?id=1&role=admin");

console.log("Full URL:", requestUrl.href);
console.log("Pathname:", requestUrl.pathname);
console.log("ID:", requestUrl.searchParams.get("id"));
console.log("Role:", requestUrl.searchParams.get("role"));
```

Run:

```bash
node playground/06-url.js
```

---

## 8.3 Student Engagement

Ask students to parse this URL:

```text
http://localhost:5000/products?category=book&page=2&limit=10
```

They should print:

```text
pathname = /products
category = book
page = 2
limit = 10
```

---

## 8.4 Interview Question

### Q. Why do we need URL parsing in backend development?

Answer:

> Backend servers need to understand request paths and query parameters. URL parsing helps route requests and extract values such as filters, IDs, pagination, and search terms.

---

# Part 9: HTTP Module

## 9.1 Concept

The HTTP module allows Node.js to create a web server without Express.

Important objects:

```text
req -> Incoming request
res -> Outgoing response
```

Important request data:

```text
req.method
req.url
req.headers
```

Important response methods:

```text
res.writeHead(statusCode, headers)
res.end(body)
```

---

## 9.2 Create Data File

Create:

```bash
touch data.js
```

Add:

```js
const users = [
  { id: 1, name: "Aisha", role: "student" },
  { id: 2, name: "Rahim", role: "student" },
  { id: 3, name: "Karim", role: "instructor" },
];

module.exports = { users };
```

---

## 9.3 Create Response Helper Module

Create:

```bash
touch helpers/response.js
```

Add:

```js
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
  });

  res.end(JSON.stringify(data, null, 2));
}

function sendText(res, statusCode, message) {
  res.writeHead(statusCode, {
    "Content-Type": "text/plain",
  });

  res.end(message);
}

module.exports = {
  sendJson,
  sendText,
};
```

---

# Part 10: Create an HTTP Server

## 10.1 Basic Server

Create:

```bash
touch server.js
```

Add:

```js
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello from raw Node.js HTTP server");
});

server.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
```

Run:

```bash
node server.js
```

Open browser:

```text
http://localhost:5000
```

Stop server:

```text
Ctrl + C
```

Run with nodemon:

```bash
npm run dev
```

---

## 10.2 Upgrade Server with Routes

Replace `server.js` with:

```js
const http = require("http");
const dayjs = require("dayjs");
const { URL } = require("url");
const { users } = require("./data");
const { sendJson, sendText } = require("./helpers/response");

const PORT = 5000;

function blockCpu(seconds) {
  const start = Date.now();

  while (Date.now() - start < seconds * 1000) {
    // Intentionally blocking the main thread
  }
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = requestUrl.pathname;
  const method = req.method;

  console.log(`[${new Date().toISOString()}] ${method} ${pathname}`);

  if (method === "GET" && pathname === "/") {
    return sendJson(res, 200, {
      message: "Welcome to Node.js Runtime Lab",
      topics: [
        "Node.js",
        "Modules",
        "NPM",
        "URL module",
        "HTTP module",
        "Blocking vs Non-blocking",
      ],
    });
  }

  if (method === "GET" && pathname === "/health") {
    return sendJson(res, 200, {
      status: "ok",
      uptime: process.uptime(),
    });
  }

  if (method === "GET" && pathname === "/time") {
    return sendJson(res, 200, {
      now: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    });
  }

  if (method === "GET" && pathname === "/about") {
    return sendText(res, 200, "This server is built using only Node.js http module.");
  }

  if (method === "GET" && pathname === "/users") {
    const id = requestUrl.searchParams.get("id");

    if (id) {
      const user = users.find((item) => item.id === Number(id));

      if (!user) {
        return sendJson(res, 404, { error: "User not found" });
      }

      return sendJson(res, 200, user);
    }

    return sendJson(res, 200, users);
  }

  if (method === "GET" && pathname === "/slow-blocking") {
    blockCpu(5);

    return sendJson(res, 200, {
      message: "Blocking response after 5 seconds",
      warning: "During this time, the main thread was blocked.",
    });
  }

  if (method === "GET" && pathname === "/slow-non-blocking") {
    setTimeout(() => {
      sendJson(res, 200, {
        message: "Non-blocking response after 5 seconds",
        note: "During this time, the server could still handle other requests.",
      });
    }, 5000);

    return;
  }

  return sendJson(res, 404, {
    error: "Route not found",
    path: pathname,
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

---

## 10.3 Test Routes

Open browser or Postman:

```text
http://localhost:5000/
http://localhost:5000/health
http://localhost:5000/time
http://localhost:5000/about
http://localhost:5000/users
http://localhost:5000/users?id=1
```

---

## 10.4 Blocking vs Non-blocking Server Test

### Test Blocking

Open first tab:

```text
http://localhost:5000/slow-blocking
```

Quickly open second tab:

```text
http://localhost:5000/health
```

Observation:

```text
/health may wait because /slow-blocking blocks the main thread.
```

### Test Non-blocking

Open first tab:

```text
http://localhost:5000/slow-non-blocking
```

Quickly open second tab:

```text
http://localhost:5000/health
```

Observation:

```text
/health should respond immediately because setTimeout does not block the main thread.
```

---

# Part 11: Full Runtime Flow Explanation

## 11.1 Request Flow

```text
1. Client sends HTTP request
2. Node.js receives request
3. http.createServer callback enters call stack
4. Server checks method and pathname
5. If response is simple, response is sent immediately
6. If async work is needed, Node.js registers it and continues
7. Async work completes later
8. Callback enters queue
9. Event loop checks if call stack is empty
10. Callback runs and response is sent
```

---

## 11.2 Event Loop Summary

```text
Synchronous code -> Call stack
Promise callbacks -> Microtask queue
Timers / I/O callbacks -> Macrotask queues
Event loop -> Moves ready callbacks to call stack when stack is empty
```

Important order:

```text
1. Synchronous code first
2. Microtasks next
3. Macrotasks after
```

---

# Part 12: In-Class Practice Tasks

## Task 1: Add New Route

Add:

```text
GET /contact
```

Response:

```json
{
  "email": "support@example.com",
  "phone": "+8801000000000"
}
```

---

## Task 2: Add Query Search

Route:

```text
GET /users?role=student
```

Expected:

```text
Return only users whose role is student.
```

Hint:

```js
const role = requestUrl.searchParams.get("role");
```

---

## Task 3: Add Status Code Practice

Create:

```text
GET /error-demo
```

Return:

```json
{
  "error": "This is a demo error"
}
```

Status code:

```text
500
```

---

## Task 4: Create New Module

Create:

```text
helpers/logger.js
```

Export:

```js
function logRequest(method, pathname) {}
```

Use it inside `server.js`.

---

# Part 13: Interview Cheat Sheet

## 13.1 Node.js

Q: What is Node.js?

A:

> Node.js is a JavaScript runtime built on V8 that allows JavaScript to run outside the browser. It is commonly used for servers, APIs, scripts, and backend applications.

---

## 13.2 Single-threaded

Q: Is Node.js single-threaded?

A:

> JavaScript execution in Node.js is single-threaded by default. But Node.js can handle concurrent I/O using the event loop, OS async features, and libuv.

---

## 13.3 Synchronous vs Asynchronous

Q: Difference between synchronous and asynchronous?

A:

> Synchronous code runs line by line and waits. Asynchronous code allows a task to complete later while the program continues running.

---

## 13.4 Blocking vs Non-blocking

Q: Difference between blocking and non-blocking?

A:

> Blocking code prevents the main thread from continuing. Non-blocking code allows the main thread to continue while the operation completes in the background.

---

## 13.5 Module

Q: What is a module?

A:

> A module is a reusable unit of code. In Node.js, each file can be a module.

---

## 13.6 module.exports

Q: What is `module.exports`?

A:

> `module.exports` defines what a file exposes to other files when imported using `require()`.

---

## 13.7 require

Q: What is `require()`?

A:

> `require()` loads built-in modules, third-party packages, or local files in the CommonJS module system.

---

## 13.8 NPM

Q: What is NPM?

A:

> NPM is the Node Package Manager. It helps initialize projects, install packages, manage dependencies, and run scripts.

---

## 13.9 package.json

Q: What is `package.json`?

A:

> `package.json` is the main project metadata and configuration file. It stores scripts, dependencies, devDependencies, project name, version, and entry point.

---

## 13.10 URL Module

Q: Why use the URL module?

A:

> The URL module helps parse request paths and query parameters, which is necessary for routing, filtering, searching, and pagination.

---

## 13.11 HTTP Module

Q: What is the HTTP module?

A:

> The HTTP module is a built-in Node.js module that allows us to create HTTP servers and handle requests and responses without external frameworks.

---

# Part 14: Final Student Challenge

Build a mini API with these routes:

```text
GET /                  -> API welcome
GET /health            -> health status
GET /products          -> all products
GET /products?id=1     -> single product
GET /products?category=book -> filtered products
GET /slow-blocking     -> blocking demo
GET /slow-non-blocking -> non-blocking demo
```

Required modules:

```text
data.js
helpers/response.js
helpers/logger.js
server.js
```

Bonus:

```text
Add status code handling
Add 404 route
Add query filtering
Add request logging
Add npm scripts
```

---

# Part 15: Instructor Timing Plan

| Time | Topic | Activity |
|---|---|---|
| 0-10 min | Opening question | Discussion |
| 10-25 min | Running JS in Node | Live coding |
| 25-50 min | Node.js runtime model | Diagram + human simulation |
| 50-75 min | Sync vs async | Prediction challenge |
| 75-105 min | Blocking vs non-blocking | File system demo |
| 105-130 min | Modules | Module exercise |
| 130-155 min | NPM + package.json | Project setup |
| 155-180 min | URL module | Query parsing |
| 180-230 min | HTTP server | Build final server |
| 230-240 min | Interview recap | Q/A |

---

# Part 16: Recommended Visual Tools

Use these during class:

1. **Loupe** for browser event loop visualization  
   https://latentflip.com/loupe/

2. **Node.js Event Loop official guide**  
   https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick

3. **Node.js Blocking vs Non-blocking official guide**  
   https://nodejs.org/en/learn/asynchronous-work/overview-of-blocking-vs-non-blocking

4. **Node.js CommonJS Modules documentation**  
   https://nodejs.org/api/modules.html

5. **Node.js HTTP module documentation**  
   https://nodejs.org/api/http.html

6. **Node.js URL module documentation**  
   https://nodejs.org/api/url.html

7. **npm package.json documentation**  
   https://docs.npmjs.com/cli/v10/configuring-npm/package-json

---

# Part 17: One-Line Summary

> Node.js is powerful because it keeps JavaScript execution simple on the main thread while using non-blocking I/O, the event loop, and modular architecture to build scalable backend systems.

---

# Appendix A: Final Code Snapshot

## package.json Scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "play:sync": "node playground/02-sync-async.js",
    "play:blocking": "node playground/03-blocking.js",
    "play:nonblocking": "node playground/04-non-blocking.js"
  }
}
```

## server.js Final Version

```js
const http = require("http");
const dayjs = require("dayjs");
const { URL } = require("url");
const { users } = require("./data");
const { sendJson, sendText } = require("./helpers/response");

const PORT = 5000;

function blockCpu(seconds) {
  const start = Date.now();

  while (Date.now() - start < seconds * 1000) {
    // Intentionally blocking
  }
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = requestUrl.pathname;
  const method = req.method;

  console.log(`[${new Date().toISOString()}] ${method} ${pathname}`);

  if (method === "GET" && pathname === "/") {
    return sendJson(res, 200, {
      message: "Welcome to Node.js Runtime Lab",
    });
  }

  if (method === "GET" && pathname === "/health") {
    return sendJson(res, 200, {
      status: "ok",
      uptime: process.uptime(),
    });
  }

  if (method === "GET" && pathname === "/time") {
    return sendJson(res, 200, {
      now: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    });
  }

  if (method === "GET" && pathname === "/about") {
    return sendText(res, 200, "This server is built using only Node.js http module.");
  }

  if (method === "GET" && pathname === "/users") {
    const id = requestUrl.searchParams.get("id");
    const role = requestUrl.searchParams.get("role");

    if (id) {
      const user = users.find((item) => item.id === Number(id));

      if (!user) {
        return sendJson(res, 404, { error: "User not found" });
      }

      return sendJson(res, 200, user);
    }

    if (role) {
      const filteredUsers = users.filter((item) => item.role === role);
      return sendJson(res, 200, filteredUsers);
    }

    return sendJson(res, 200, users);
  }

  if (method === "GET" && pathname === "/slow-blocking") {
    blockCpu(5);

    return sendJson(res, 200, {
      message: "Blocking response after 5 seconds",
    });
  }

  if (method === "GET" && pathname === "/slow-non-blocking") {
    setTimeout(() => {
      sendJson(res, 200, {
        message: "Non-blocking response after 5 seconds",
      });
    }, 5000);

    return;
  }

  return sendJson(res, 404, {
    error: "Route not found",
    path: pathname,
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```
