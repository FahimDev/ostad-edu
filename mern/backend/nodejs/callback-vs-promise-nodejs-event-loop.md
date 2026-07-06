# Callback vs Promise in Node.js

## Goal

This note explains the difference between **Callback** and **Promise** in Node.js and how they are connected with the **Call Stack**, **Microtask Queue**, and **Macrotask Queue**.

By the end, you should be able to answer interview questions like:

- What is a callback?
- What is a Promise?
- Why does `Promise.then()` run before `setTimeout()`?
- What is the difference between Microtask Queue and Macrotask Queue?
- Where do callbacks and promises wait before execution?

---

# 1. The Big Picture

JavaScript runs code using one main execution path called the **Call Stack**.

But Node.js also handles asynchronous work such as:

- timers
- file reading
- network requests
- database calls
- promises
- async/await

When asynchronous work finishes, its callback does **not** execute immediately. It waits in a queue. The **Event Loop** checks when the Call Stack is empty and then moves waiting callbacks into the Call Stack.

Simple flow:

```text
Synchronous Code
      ↓
Call Stack
      ↓
Async work is registered
      ↓
Callback waits in a Queue
      ↓
Event Loop checks Call Stack
      ↓
Callback is pushed back to Call Stack
      ↓
Callback executes
```

---

# 2. What is a Callback?

A **callback** is a function passed into another function so that it can be called later.

## Simple Callback Example

```js
function greet(name, callback) {
  console.log("Hello " + name);
  callback();
}

function sayBye() {
  console.log("Goodbye");
}

greet("Arif", sayBye);
```

Output:

```text
Hello Arif
Goodbye
```

Here, `sayBye` is a callback function.

---

# 3. Types of Callbacks

Callbacks can be divided into different types based on how and when they run.

---

## 3.1 Synchronous Callback

A synchronous callback runs immediately during the current execution.

```js
const numbers = [1, 2, 3];

numbers.forEach((num) => {
  console.log(num);
});

console.log("Done");
```

Output:

```text
1
2
3
Done
```

The callback inside `forEach()` runs immediately. It does not go to the Event Loop.

### Queue Used

```text
No async queue is used.
Runs directly in the Call Stack.
```

---

## 3.2 Asynchronous Callback

An asynchronous callback runs later, after some async operation finishes.

```js
setTimeout(() => {
  console.log("Timer finished");
}, 1000);

console.log("End");
```

Output:

```text
End
Timer finished
```

The timer callback runs later.

### Queue Used

```text
Macrotask Queue / Timer Queue
```

---

## 3.3 Error-First Callback

This is very common in Node.js callback-style APIs.

Pattern:

```js
callback(error, result)
```

Example:

```js
const fs = require("fs");

fs.readFile("data.txt", "utf8", (err, data) => {
  if (err) {
    console.log("Error:", err.message);
    return;
  }

  console.log(data);
});
```

Here:

- `err` contains the error if something fails
- `data` contains the result if successful

### Queue Used

```text
Macrotask Queue / I/O Queue
```

---

## 3.4 Timer Callback

Timer callbacks come from:

```js
setTimeout()
setInterval()
```

Example:

```js
setTimeout(() => {
  console.log("Runs later");
}, 0);
```

Even with `0ms`, it does not run immediately. It waits until synchronous code and microtasks are done.

### Queue Used

```text
Macrotask Queue / Timer Queue
```

---

## 3.5 Event Listener Callback

Event listener callbacks run when an event happens.

Example:

```js
const EventEmitter = require("events");

const emitter = new EventEmitter();

emitter.on("orderPlaced", () => {
  console.log("Order event handled");
});

emitter.emit("orderPlaced");
```

### Queue Used

It depends on the event source.

```text
Synchronous event emit → Call Stack directly
Async event source → Event Loop queue
```

---

# 4. Problems with Callbacks

Callbacks are useful, but deeply nested callbacks can become hard to read.

This is called **Callback Hell**.

```js
loginUser("arif", (err, user) => {
  if (err) return console.log(err);

  getProfile(user.id, (err, profile) => {
    if (err) return console.log(err);

    getOrders(profile.id, (err, orders) => {
      if (err) return console.log(err);

      console.log(orders);
    });
  });
});
```

Problems:

- Hard to read
- Hard to maintain
- Error handling repeated again and again
- Difficult to compose multiple async tasks

This is one reason Promises became popular.

---

# 5. What is a Promise?

A **Promise** is an object that represents a future result of an asynchronous operation.

A Promise can be in one of three states:

```text
Pending   → still working
Fulfilled → completed successfully
Rejected  → failed
```

---

# 6. Promise Example

```js
const promise = new Promise((resolve, reject) => {
  const success = true;

  if (success) {
    resolve("Data received");
  } else {
    reject("Something went wrong");
  }
});

promise
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log(error);
  });
```

---

# 7. Types / Forms of Promise Usage

---

## 7.1 `.then()` Promise

Used to handle successful Promise result.

```js
fetchData()
  .then((data) => {
    console.log(data);
  });
```

### Queue Used

```text
Microtask Queue
```

---

## 7.2 `.catch()` Promise

Used to handle error/rejection.

```js
fetchData()
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log(error);
  });
```

### Queue Used

```text
Microtask Queue
```

---

## 7.3 `.finally()` Promise

Runs after success or failure.

```js
fetchData()
  .then((data) => console.log(data))
  .catch((err) => console.log(err))
  .finally(() => console.log("Finished"));
```

### Queue Used

```text
Microtask Queue
```

---

## 7.4 Promise Chaining

Promises can be chained to avoid callback hell.

```js
loginUser("arif")
  .then((user) => getProfile(user.id))
  .then((profile) => getOrders(profile.id))
  .then((orders) => console.log(orders))
  .catch((error) => console.log(error));
```

This is cleaner than nested callbacks.

---

## 7.5 `async/await`

`async/await` is a cleaner syntax over Promises.

```js
async function showOrders() {
  try {
    const user = await loginUser("arif");
    const profile = await getProfile(user.id);
    const orders = await getOrders(profile.id);

    console.log(orders);
  } catch (error) {
    console.log(error);
  }
}

showOrders();
```

Important:

```text
async/await still uses Promises internally.
```

### Queue Used

```text
Microtask Queue
```

---

## 7.6 Promise Combinators

Promise combinators are used to handle multiple Promises together.

### `Promise.all()`

Waits for all Promises to succeed. If one fails, the whole result fails.

```js
Promise.all([getUser(), getOrders(), getPayments()])
  .then((results) => console.log(results))
  .catch((error) => console.log(error));
```

Use when all results are required.

---

### `Promise.allSettled()`

Waits for all Promises to finish, whether they succeed or fail.

```js
Promise.allSettled([getUser(), getOrders(), getPayments()])
  .then((results) => console.log(results));
```

Use when you want the result of every task.

---

### `Promise.race()`

Returns the result of the first Promise that finishes, success or failure.

```js
Promise.race([fastServer(), slowServer()])
  .then((result) => console.log(result))
  .catch((error) => console.log(error));
```

Use for timeout or fastest-response scenarios.

---

### `Promise.any()`

Returns the first successful Promise. It ignores failed Promises unless all fail.

```js
Promise.any([server1(), server2(), server3()])
  .then((result) => console.log(result))
  .catch((error) => console.log(error));
```

Use when any one successful result is enough.

---

# 8. Callback vs Promise

| Topic | Callback | Promise |
|---|---|---|
| Basic idea | Function passed to run later | Object representing future result |
| Readability | Can become nested | Easier to chain |
| Error handling | Usually error-first callback | `.catch()` / `try...catch` with async-await |
| Queue | Usually Macrotask for async callbacks | Microtask Queue |
| Composition | Harder for multiple async tasks | Easier using chaining and combinators |
| Modern usage | Still used in many Node APIs and events | Preferred for modern async code |

---

# 9. Microtask Queue vs Macrotask Queue

## Microtask Queue

The Microtask Queue has higher priority.

Common examples:

```js
Promise.then()
Promise.catch()
Promise.finally()
async/await continuation
queueMicrotask()
```

In Node.js, there is also:

```js
process.nextTick()
```

`process.nextTick()` has even higher priority than normal Promise microtasks.

---

## Macrotask Queue

The Macrotask Queue has lower priority than the Microtask Queue.

Common examples:

```js
setTimeout()
setInterval()
setImmediate()
I/O callbacks
network callbacks
file system callbacks
```

---

# 10. Execution Priority

In simple form:

```text
1. Synchronous code runs first
2. process.nextTick queue runs
3. Promise Microtask Queue runs
4. Macrotask Queue runs
5. Event Loop repeats
```

For browser JavaScript, you can think:

```text
1. Synchronous code
2. Microtasks
3. Macrotasks
```

For Node.js, remember:

```text
process.nextTick() has special priority before Promise microtasks.
```

---

# 11. Example: Callback and Promise Together

```js
console.log("A");

setTimeout(() => {
  console.log("B - setTimeout callback");
}, 0);

Promise.resolve().then(() => {
  console.log("C - Promise callback");
});

console.log("D");
```

Output:

```text
A
D
C - Promise callback
B - setTimeout callback
```

## Step-by-Step Execution

```text
1. console.log("A") enters Call Stack and runs
2. setTimeout callback is registered and waits in Timer/Macrotask Queue
3. Promise.then callback waits in Microtask Queue
4. console.log("D") enters Call Stack and runs
5. Call Stack becomes empty
6. Event Loop checks Microtask Queue first
7. Promise callback runs → C
8. Then Macrotask Queue runs
9. setTimeout callback runs → B
```

---

# 12. Node.js Example with process.nextTick

```js
console.log("A");

setTimeout(() => {
  console.log("setTimeout");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise");
});

process.nextTick(() => {
  console.log("nextTick");
});

console.log("B");
```

Output in Node.js:

```text
A
B
nextTick
Promise
setTimeout
```

## Why?

```text
1. A runs synchronously
2. setTimeout goes to Macrotask Queue
3. Promise goes to Microtask Queue
4. process.nextTick goes to nextTick Queue
5. B runs synchronously
6. nextTick Queue runs first
7. Promise Microtask Queue runs next
8. Macrotask Queue runs after that
```

---

# 13. Where Each Thing Goes

| Code | Type | Queue / Place |
|---|---|---|
| `console.log()` | Synchronous | Call Stack |
| `Array.forEach(callback)` | Synchronous callback | Call Stack |
| `setTimeout(callback)` | Timer callback | Macrotask Queue / Timer Queue |
| `setInterval(callback)` | Timer callback | Macrotask Queue / Timer Queue |
| `fs.readFile(callback)` | I/O callback | Macrotask Queue / I/O Queue |
| `setImmediate(callback)` | Check callback | Macrotask Queue / Check Queue |
| `Promise.then(callback)` | Promise callback | Microtask Queue |
| `Promise.catch(callback)` | Promise callback | Microtask Queue |
| `Promise.finally(callback)` | Promise callback | Microtask Queue |
| `async/await` continuation | Promise-based continuation | Microtask Queue |
| `queueMicrotask(callback)` | Microtask callback | Microtask Queue |
| `process.nextTick(callback)` | Node special callback | nextTick Queue |

---

# 14. Callback Hell vs Promise Chain vs Async/Await

## Callback Hell

```js
step1((err, result1) => {
  if (err) return handleError(err);

  step2(result1, (err, result2) => {
    if (err) return handleError(err);

    step3(result2, (err, result3) => {
      if (err) return handleError(err);

      console.log(result3);
    });
  });
});
```

---

## Promise Chain

```js
step1()
  .then((result1) => step2(result1))
  .then((result2) => step3(result2))
  .then((result3) => console.log(result3))
  .catch((error) => handleError(error));
```

---

## Async/Await

```js
async function runSteps() {
  try {
    const result1 = await step1();
    const result2 = await step2(result1);
    const result3 = await step3(result2);

    console.log(result3);
  } catch (error) {
    handleError(error);
  }
}

runSteps();
```

---

# 15. Interview Summary

## What is a callback?

A callback is a function passed into another function and executed later. It can be synchronous or asynchronous.

## What is a Promise?

A Promise is an object that represents the future result of an asynchronous operation. It can be pending, fulfilled, or rejected.

## What is the main difference between callback and Promise?

A callback is a function-based approach, while a Promise is an object-based approach for handling asynchronous results. Promises are easier to chain, compose, and handle errors with.

## Which queue does Promise use?

Promise callbacks use the **Microtask Queue**.

## Which queue does setTimeout use?

`setTimeout()` uses the **Macrotask Queue**, specifically the Timer Queue.

## Why does Promise run before setTimeout?

Because the Event Loop gives priority to the Microtask Queue before running Macrotask callbacks.

## Is async/await different from Promise?

`async/await` is not a different mechanism. It is cleaner syntax built on top of Promises.

---

# 16. Final Mental Model

```text
Call Stack = where code executes
Callback = function to run now or later
Promise = future value container
Microtask Queue = high-priority async queue
Macrotask Queue = lower-priority async queue
Event Loop = manager that moves queued callbacks to Call Stack
```

Most important rule:

```text
Synchronous code first → Microtasks second → Macrotasks third
```

For Node.js:

```text
Synchronous code → process.nextTick → Promise microtasks → Macrotasks
```

---

# 17. Recommended Visual Learning Links

- Node.js Event Loop official guide: https://nodejs.org/learn/asynchronous-work/event-loop-timers-and-nexttick
- Node.js callbacks official guide: https://nodejs.org/learn/asynchronous-work/javascript-asynchronous-programming-and-callbacks
- Node.js promises official guide: https://nodejs.org/learn/asynchronous-work/discover-promises-in-nodejs
- Node.js setImmediate guide: https://nodejs.org/learn/asynchronous-work/understanding-setimmediate
- Node.js File System API forms: https://nodejs.org/api/fs.html
- Event Loop visualizer: https://latentflip.com/loupe/

---

# 18. Practice Task

Predict the output:

```js
console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => console.log("3"));

process.nextTick(() => console.log("4"));

console.log("5");
```

Expected output in Node.js:

```text
1
5
4
3
2
```

Explanation:

```text
1 and 5 run synchronously.
4 runs from process.nextTick queue.
3 runs from Promise Microtask Queue.
2 runs from Timer/Macrotask Queue.
```
