# Lecture Sheet: V8 Engine & Execution in Node.js

## Class Topic

**V8 Engine & Execution: How Node.js Runs Your JavaScript Code**

This lecture continues after the students already understand the basic overview of Node.js, the event loop, and non-blocking I/O.  
Today the focus is the **JavaScript execution engine** inside Node.js: **V8**.

---

## 0. Verified References

Use these links during class. They are real, official or highly reliable references.

1. Node.js Introduction  
   https://nodejs.org/en/learn/getting-started/introduction-to-nodejs

2. Node.js About Page  
   https://nodejs.org/en/about

3. V8 Official Documentation  
   https://v8.dev/docs

4. V8 Ignition Interpreter Documentation  
   https://v8.dev/docs/ignition

5. V8: Launching Ignition and TurboFan  
   https://v8.dev/blog/launching-ignition-and-turbofan

6. V8: Background Compilation  
   https://v8.dev/blog/background-compilation

7. V8: Sparkplug Compiler  
   https://v8.dev/blog/sparkplug

8. V8: Maglev Optimizing JIT Compiler  
   https://v8.dev/blog/maglev

9. V8: Trash Talk — Orinoco Garbage Collector  
   https://v8.dev/blog/trash-talk

10. V8: Young Generation Garbage Collection  
    https://v8.dev/blog/orinoco-parallel-scavenger

11. V8: Concurrent Marking  
    https://v8.dev/blog/concurrent-marking

---

## 1. Class Objective

By the end of this class, students should be able to explain:

- Where V8 fits inside Node.js
- How JavaScript source code becomes executable instructions
- What parsing means
- What an AST is
- What Ignition does
- What bytecode is
- What a compiler does
- Why V8 uses multiple execution tiers
- What machine code is
- Why some JavaScript becomes faster after running multiple times
- What garbage collection is
- Why memory leaks still happen even with garbage collection

---

## 2. Big Picture First

### Instructor Explanation

Node.js is not the JavaScript language itself.  
Node.js is a runtime environment.

Inside Node.js, there are multiple major parts:

```text
JavaScript Code
      |
      v
Node.js Runtime
      |
      +--> V8 Engine
      |      - Parses JavaScript
      |      - Compiles JavaScript
      |      - Executes JavaScript
      |      - Manages memory
      |      - Runs garbage collection
      |
      +--> libuv
      |      - Event loop
      |      - Async I/O
      |      - Timers
      |      - Thread pool
      |
      +--> C++ Bindings
             - Connect JavaScript APIs to operating system features
```

### Important Teaching Point

V8 is responsible for **executing JavaScript**.  
libuv is responsible for **asynchronous runtime behavior** such as timers, file system I/O, networking support, and event loop coordination.

So:

```text
V8 = Executes JS
libuv = Handles async runtime support
Node.js = Combines V8 + libuv + Node APIs
```

Official Node.js documentation describes Node.js as a cross-platform JavaScript runtime that lets developers build servers, apps, command-line tools, and scripts.

Reference:  
https://nodejs.org/en/learn/getting-started/introduction-to-nodejs

---

## 3. Where V8 Sits in Node.js

### Classroom Diagram

```text
┌────────────────────────────────────────────┐
│                Node.js Runtime             │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │              V8 Engine               │  │
│  │                                      │  │
│  │  Source Code                         │  │
│  │      ↓                               │  │
│  │  Parser                              │  │
│  │      ↓                               │  │
│  │  AST                                 │  │
│  │      ↓                               │  │
│  │  Ignition Interpreter                │  │
│  │      ↓                               │  │
│  │  Bytecode                            │  │
│  │      ↓                               │  │
│  │  Optimizing Compilers                │  │
│  │      ↓                               │  │
│  │  Machine Code                        │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │                libuv                 │  │
│  │  Event loop, timers, I/O, threadpool │  │
│  └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
```

### Real-life Backend Example

When an Express API route executes this code:

```js
app.get("/price", (req, res) => {
  const price = 100;
  const tax = price * 0.15;
  res.json({ total: price + tax });
});
```

V8 is responsible for executing the JavaScript logic:

```js
const price = 100;
const tax = price * 0.15;
```

Node/libuv helps with the HTTP request and response lifecycle, but the actual JavaScript execution is handled by V8.

---

## 4. Step-by-Step: How a Program Is Executed

Use this flow throughout the class:

```text
1. JavaScript Source Code
2. Parser reads the code
3. AST is created
4. Ignition converts AST to bytecode
5. Bytecode is executed
6. Runtime feedback is collected
7. Hot code is optimized by compiler tiers
8. Machine code executes faster
9. Garbage collector cleans unused memory
```

---

## 5. Step 1 — JavaScript Source Code

### Demo File

Create:

```bash
mkdir v8-class
cd v8-class
touch demo.js
```

Add:

```js
function add(a, b) {
  return a + b;
}

console.log(add(2, 3));
```

Run:

```bash
node demo.js
```

Expected output:

```text
5
```

### Instructor Explanation

This is human-readable JavaScript source code.  
The CPU cannot directly understand this high-level code.

Before the CPU can execute it, V8 must process it.

---

## 6. Step 2 — Parsing

### What is Parsing?

Parsing means reading source code and checking whether it follows the grammar rules of JavaScript.

Example:

```js
const name = "Aisha";
```

This is valid JavaScript.

But:

```js
const = name "Aisha";
```

This is invalid JavaScript.

V8’s parser catches syntax problems before execution.

### Instructor Analogy

Parsing is like a grammar checker.

Before understanding the meaning of a sentence, the reader first checks if the sentence is structurally valid.

For JavaScript:

```text
Parser asks:
- Is the syntax valid?
- Are brackets balanced?
- Are keywords used correctly?
- Can this code be converted into a structured representation?
```

---

## 7. Step 3 — AST: Abstract Syntax Tree

### What is AST?

AST means **Abstract Syntax Tree**.

It is a tree-like structure created from source code.

Example code:

```js
const result = 2 + 3;
```

Simplified AST idea:

```text
VariableDeclaration
  └── const result
        └── BinaryExpression
              ├── 2
              ├── +
              └── 3
```

### Why AST Matters

The engine does not work with raw text forever.  
It first converts text into a structured tree that is easier to analyze and compile.

### Instructor Explanation

When V8 sees:

```js
function add(a, b) {
  return a + b;
}
```

It does not just see text.  
It builds a structure like:

```text
FunctionDeclaration
  ├── name: add
  ├── parameters: a, b
  └── body
       └── ReturnStatement
            └── BinaryExpression: a + b
```

V8’s background compilation article explains that the Ignition bytecode compiler takes the AST produced by the parser and produces bytecode.

Reference:  
https://v8.dev/blog/background-compilation

---

## 8. Step 4 — Ignition Interpreter

### What is Ignition?

Ignition is V8’s interpreter.

It executes JavaScript by working with bytecode.

Official V8 documentation says Ignition is V8’s interpreter.

Reference:  
https://v8.dev/docs/ignition

### What is an Interpreter?

An interpreter executes code step by step.

Mental model:

```text
Source / Bytecode instruction 1 -> execute
Source / Bytecode instruction 2 -> execute
Source / Bytecode instruction 3 -> execute
```

### Why Use an Interpreter?

Because it can start fast.

For backend APIs, startup time matters.  
When the server starts, V8 does not want to fully optimize every function immediately. That would waste time.

Instead:

```text
Start quickly with interpreter
Observe runtime behavior
Optimize only important hot code
```

---

## 9. Step 5 — Bytecode

### What is Bytecode?

Bytecode is an intermediate form.

It is not human-friendly like JavaScript.  
It is not pure CPU machine code either.

It sits between source code and machine code.

```text
JavaScript Source Code
        ↓
Bytecode
        ↓
Machine Code
```

### Why Bytecode Exists

Bytecode allows V8 to:

- Start execution quickly
- Use less memory than compiling everything immediately
- Collect runtime feedback
- Later optimize hot functions

V8’s Ignition and TurboFan article explains that Ignition’s bytecode can be used to generate optimized machine code with TurboFan.

Reference:  
https://v8.dev/blog/launching-ignition-and-turbofan

---

## 10. Classroom Demo: Print V8 Version

Run:

```bash
node -p "process.versions.v8"
```

### Explain

This shows which V8 version your installed Node.js is using.

Example output may look like:

```text
12.x.x
```

The exact number depends on your Node.js version.

---

## 11. Classroom Demo: Check Available V8 Flags

Run:

```bash
node --v8-options | grep -E "print-bytecode|trace-opt|trace-deopt|trace-gc"
```

### Explain

Node.js exposes many V8 debugging and diagnostic flags.

Some flags are useful for teaching:

```text
--print-bytecode
--trace-opt
--trace-deopt
--trace-gc
```

Availability can vary by Node.js/V8 version.

---

## 12. Classroom Demo: Print Bytecode

Create:

```bash
touch bytecode-demo.js
```

Add:

```js
function add(a, b) {
  return a + b;
}

add(2, 3);
```

Run:

```bash
node --print-bytecode bytecode-demo.js
```

### Warning for Students

The output will be very large.

Tell students:

```text
Do not try to understand every bytecode instruction today.
The goal is to see that V8 does create internal bytecode before execution.
```

### Instructor Explanation

Students should understand:

```text
Your clean JavaScript is not what the engine executes directly.
V8 converts it into lower-level internal instructions.
```

---

## 13. Step 6 — Runtime Feedback

### What is Runtime Feedback?

JavaScript is dynamic.

The same function can receive different types:

```js
function add(a, b) {
  return a + b;
}

add(2, 3);       // number + number
add("A", "B");   // string + string
```

V8 watches how functions behave at runtime.

It observes:

```text
- What types are commonly passed?
- What object shapes are used?
- Which functions run frequently?
- Which code paths are hot?
```

### Why This Matters

If V8 sees that a function is called many times with stable types, it may optimize it.

Example:

```js
function calculateTax(price) {
  return price * 0.15;
}

for (let i = 0; i < 100000; i++) {
  calculateTax(100);
}
```

This function is likely to become hot because it runs many times.

---

## 14. Step 7 — Compiler

### What is a Compiler?

A compiler converts code into another form before execution or during execution.

In V8, compiler tiers can turn bytecode or internal representations into machine code.

### Interpreter vs Compiler

| Topic | Interpreter | Compiler |
|---|---|---|
| Execution style | Runs step by step | Converts into optimized code |
| Startup | Fast startup | May need more preparation |
| Long-running performance | Usually slower | Usually faster |
| V8 example | Ignition | Sparkplug, Maglev, TurboFan |

### Teaching Line

```text
Interpreter helps JavaScript start quickly.
Compiler helps hot JavaScript run faster.
```

---

## 15. Modern V8 Execution Tiers

A simplified modern V8 pipeline:

```text
Source Code
   ↓
Parser
   ↓
AST
   ↓
Ignition Bytecode
   ↓
Ignition Interpreter
   ↓
Sparkplug / Maglev / TurboFan
   ↓
Optimized Machine Code
```

### Important Note

Older explanations often mention only:

```text
Ignition + TurboFan
```

That is still useful for teaching fundamentals.

Modern V8 also includes more tiers, such as Sparkplug and Maglev, to balance startup speed and optimized performance.

References:

Sparkplug:  
https://v8.dev/blog/sparkplug

Maglev:  
https://v8.dev/blog/maglev

TurboFan and Ignition:  
https://v8.dev/blog/launching-ignition-and-turbofan

---

## 16. Step 8 — Machine Code

### What is Machine Code?

Machine code is low-level CPU-specific instruction.

Your CPU does not understand JavaScript directly.

It understands machine instructions.

Simplified flow:

```text
JavaScript:
return a + b;

Bytecode:
Load a
Load b
Add
Return

Machine code:
CPU-specific binary instructions
```

### Instructor Explanation

Machine code is the final optimized form that the CPU can execute efficiently.

V8’s optimizing compilers generate machine code based on assumptions from runtime feedback.

Example assumption:

```text
This function usually receives numbers.
```

If the assumption stays true, the optimized code is fast.

If the assumption becomes false, V8 may deoptimize.

---

## 17. Optimization and Deoptimization

### Optimization

Optimization means V8 creates a faster version of code.

Example:

```js
function sum(a, b) {
  return a + b;
}

for (let i = 0; i < 100000; i++) {
  sum(1, 2);
}
```

V8 may optimize `sum` because:

```text
- It is called many times
- The input types are stable
- The behavior is predictable
```

### Deoptimization

Deoptimization means V8 gives up on optimized code and falls back to a safer execution path.

Example:

```js
function sum(a, b) {
  return a + b;
}

for (let i = 0; i < 100000; i++) {
  sum(1, 2);
}

sum("hello", "world");
```

V8 may have optimized `sum` for numbers.  
Then suddenly strings arrive.

The earlier assumption is broken.

So V8 may deoptimize.

### Teaching Point

JavaScript flexibility is powerful, but unstable types can hurt performance.

---

## 18. Classroom Demo: Trace Optimization

Create:

```bash
touch optimization-demo.js
```

Add:

```js
function multiply(a, b) {
  return a * b;
}

for (let i = 0; i < 100000; i++) {
  multiply(10, 20);
}

console.log("Done");
```

Run:

```bash
node --trace-opt optimization-demo.js
```

### Explain

This may show optimization logs depending on your Node/V8 version.

If it produces too much output, tell students:

```text
The important idea is not the exact log.
The important idea is that V8 observes hot code and may optimize it.
```

---

## 19. Classroom Demo: Trace Deoptimization

Create:

```bash
touch deopt-demo.js
```

Add:

```js
function flexibleAdd(a, b) {
  return a + b;
}

for (let i = 0; i < 100000; i++) {
  flexibleAdd(1, 2);
}

console.log(flexibleAdd("Hello ", "World"));
```

Run:

```bash
node --trace-opt --trace-deopt deopt-demo.js
```

### Instructor Explanation

This demo helps show that V8 makes assumptions.

When the function receives numbers for a long time, V8 may optimize it.  
When it later receives strings, the assumption may break.

---

## 20. Hidden Classes and Object Shapes

### Instructor Explanation

V8 tries to optimize objects based on their shape.

Object shape means:

```text
- What properties does the object have?
- In what order were they added?
- Are objects created consistently?
```

Example:

```js
const user1 = {
  name: "Aisha",
  age: 22
};

const user2 = {
  name: "Rahim",
  age: 25
};
```

These two objects have the same shape.

But:

```js
const user3 = {};
user3.age = 30;
user3.name = "Karim";
```

This object may have a different shape because properties were added in a different order.

### Real-life Backend Example

Good pattern:

```js
function createUser(name, email, role) {
  return {
    name,
    email,
    role
  };
}
```

Less stable pattern:

```js
function createUser(data) {
  const user = {};
  if (data.name) user.name = data.name;
  if (data.email) user.email = data.email;
  if (data.role) user.role = data.role;
  return user;
}
```

### Teaching Point

For typical backend apps, do not over-optimize early.  
But understand that predictable object structures can help engines optimize better.

---

## 21. Garbage Collection

### What is Garbage Collection?

Garbage collection is automatic memory management.

When JavaScript creates objects, they are stored in memory.

When those objects are no longer reachable, V8 can clean them.

Official V8 documentation explains that V8 handles memory allocation for objects and garbage collects objects it no longer needs.

Reference:  
https://v8.dev/docs

### Simple Example

```js
function createData() {
  const user = {
    name: "Aisha",
    email: "aisha@example.com"
  };

  return user;
}

const result = createData();
console.log(result);
```

Here, the object is still reachable through `result`.

But:

```js
function createTempData() {
  const temp = {
    value: "temporary"
  };
}

createTempData();
```

After the function finishes, `temp` is no longer reachable.  
V8 can eventually clean it.

---

## 22. Reachability

Garbage collectors usually think in terms of reachability.

If an object can still be reached from active program roots, it is alive.

Roots include things like:

```text
- Global variables
- Current function stack
- Closures still referenced
- Active timers
- Active event listeners
```

If an object cannot be reached anymore, it can be collected.

V8’s concurrent marking article explains marking as a graph traversal that starts from roots and follows pointers to discover live objects.

Reference:  
https://v8.dev/blog/concurrent-marking

---

## 23. Generational Garbage Collection

### Instructor Explanation

Most objects in JavaScript are short-lived.

Example:

```js
app.get("/invoice", (req, res) => {
  const invoice = {
    id: Date.now(),
    total: 500
  };

  res.json(invoice);
});
```

The `invoice` object may only be needed during one request.

Because many objects die young, V8 uses generational garbage collection.

Simplified memory areas:

```text
Young Generation
  - New objects start here
  - Collected frequently

Old Generation
  - Long-lived objects move here
  - Collected less frequently
```

V8’s young generation garbage collection article explains that V8 partitions its managed heap into generations and initially allocates objects in the young generation.

Reference:  
https://v8.dev/blog/orinoco-parallel-scavenger

---

## 24. Garbage Collection Flow

Simplified flow:

```text
1. Object is created
2. Object is stored in heap memory
3. V8 checks whether object is still reachable
4. If reachable, keep it
5. If unreachable, mark it as garbage
6. Reclaim memory
7. Sometimes compact memory to reduce fragmentation
```

V8’s Orinoco article explains that essential GC tasks include identifying live/dead objects, recycling memory occupied by dead objects, and optionally compacting/defragmenting memory.

Reference:  
https://v8.dev/blog/trash-talk

---

## 25. Classroom Demo: Trace Garbage Collection

Create:

```bash
touch gc-demo.js
```

Add:

```js
const data = [];

for (let i = 0; i < 1000000; i++) {
  data.push({
    id: i,
    name: `User-${i}`,
    email: `user${i}@example.com`
  });
}

console.log("Created many objects");
```

Run:

```bash
node --trace-gc gc-demo.js
```

### Instructor Explanation

The logs show that V8 is managing memory automatically.

Do not ask students to memorize every GC log term.  
Focus on this:

```text
JavaScript creates many objects.
V8 allocates memory.
V8 later cleans memory that is not needed.
```

---

## 26. Memory Leak Even with Garbage Collection

### Important Question

If JavaScript has garbage collection, why do memory leaks happen?

Answer:

Because garbage collection only removes unreachable objects.

If your code keeps references, the garbage collector thinks the data is still needed.

### Example: Accidental Global Cache

```js
const cache = [];

app.get("/users", async (req, res) => {
  const users = await getUsersFromDB();

  // Bad idea: keeps growing forever
  cache.push(users);

  res.json(users);
});
```

The cache keeps references forever.  
V8 cannot collect those objects.

### Real-life Backend Memory Leak Sources

```text
- Never-ending arrays
- Unbounded caches
- Event listeners not removed
- Large objects stored in global variables
- Timers that keep references alive
- Closures holding old request data
```

---

## 27. Practical Backend Advice

For Express/Node.js developers:

1. Do not block the main thread.
2. Keep object structures consistent when possible.
3. Avoid unbounded in-memory caches.
4. Use streams for large files.
5. Do not store large request data globally.
6. Remove unused event listeners.
7. Monitor memory in production.
8. Use `--trace-gc` only for learning or diagnostics, not normal production logs.

---

## 28. Full Execution Story

Use this summary in class:

```text
When you run node app.js:

1. Node.js starts the runtime.
2. Node loads your JavaScript file.
3. V8 receives the JavaScript source code.
4. V8 parses the code.
5. V8 creates an AST.
6. Ignition generates bytecode.
7. Ignition executes bytecode.
8. V8 collects feedback while the program runs.
9. Hot functions may be compiled into optimized machine code.
10. CPU executes the machine code.
11. V8 manages memory allocation.
12. Garbage collector cleans unreachable objects.
13. Node.js and libuv handle async runtime tasks around this execution.
```

---

## 29. Interview Questions and Answers

### Q1. What is V8?

V8 is Google’s open-source JavaScript engine used by Node.js and Chrome. It compiles and executes JavaScript, manages memory allocation, and performs garbage collection.

Reference:  
https://v8.dev/docs

---

### Q2. What is the role of V8 inside Node.js?

V8 executes JavaScript code. Node.js combines V8 with libuv and Node APIs so JavaScript can run outside the browser and interact with files, network, timers, and operating system features.

Reference:  
https://nodejs.org/en/learn/getting-started/introduction-to-nodejs

---

### Q3. What is Ignition?

Ignition is V8’s interpreter. It works with bytecode and allows JavaScript to start executing quickly.

Reference:  
https://v8.dev/docs/ignition

---

### Q4. What is bytecode?

Bytecode is an intermediate instruction format between JavaScript source code and machine code. V8’s Ignition uses bytecode for execution, and optimized machine code can later be generated from it.

Reference:  
https://v8.dev/blog/launching-ignition-and-turbofan

---

### Q5. What is TurboFan?

TurboFan is V8’s optimizing compiler. It can generate optimized machine code for hot JavaScript functions based on runtime feedback.

Reference:  
https://v8.dev/blog/launching-ignition-and-turbofan

---

### Q6. Why does V8 not optimize all code immediately?

Because not all code is worth optimizing. Some code runs only once. V8 starts quickly using the interpreter and optimizes hot code later based on runtime behavior.

---

### Q7. What is deoptimization?

Deoptimization happens when optimized code assumptions become invalid. V8 then falls back to a safer execution path.

Example:

```js
add(1, 2);              // optimized for numbers
add("hello", "world");  // assumption changes
```

---

### Q8. What is garbage collection?

Garbage collection is automatic memory cleanup. V8 finds objects that are no longer reachable and reclaims their memory.

Reference:  
https://v8.dev/blog/trash-talk

---

### Q9. Can memory leaks happen in Node.js even with garbage collection?

Yes. If code keeps references to objects, the garbage collector will not remove them because they still appear reachable.

---

### Q10. What is the difference between V8 and libuv?

V8 executes JavaScript.  
libuv provides the event loop, async I/O, timers, and thread pool support.

---

## 30. Suggested Class Flow

### Total Duration: 2.5 to 3 hours

| Time | Section |
|---|---|
| 0–10 min | Recap Node.js runtime |
| 10–25 min | Where V8 sits |
| 25–45 min | Source code, parser, AST |
| 45–65 min | Ignition and bytecode |
| 65–85 min | Interpreter vs compiler |
| 85–105 min | Optimization and deoptimization |
| 105–130 min | Garbage collection |
| 130–150 min | Demos with V8 flags |
| 150–180 min | Interview Q&A and recap |

---

## 31. Final Board Summary

Write this at the end:

```text
Node.js runs JavaScript using V8.

V8 flow:
Source Code
 → Parser
 → AST
 → Ignition
 → Bytecode
 → Runtime Feedback
 → Optimizing Compiler
 → Machine Code
 → Garbage Collection

Interpreter = fast startup
Compiler = faster repeated execution
Garbage Collector = automatic memory cleanup
```

---

## 32. Homework

Ask students to prepare a short explanation of:

1. What happens when `node app.js` runs?
2. What is the difference between bytecode and machine code?
3. Why does V8 optimize hot functions?
4. What causes deoptimization?
5. Why can memory leaks still happen in JavaScript?
6. What is the difference between V8 and libuv?

Optional practical homework:

```bash
node --print-bytecode bytecode-demo.js
node --trace-opt optimization-demo.js
node --trace-opt --trace-deopt deopt-demo.js
node --trace-gc gc-demo.js
```

Students should not memorize logs.  
They should observe that V8 has visible internal execution stages.

---

## 33. Instructor Closing Line

> Node.js feels simple because we write JavaScript, but under the hood V8 is parsing, interpreting, compiling, optimizing, deoptimizing, allocating memory, and cleaning memory continuously while our application runs.
