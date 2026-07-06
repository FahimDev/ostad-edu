const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middleware to parse JSON request bodies (for POST/PUT/PATCH requests).
app.use(express.json());

// Middleware to parse URL-encoded form data.
app.use(express.urlencoded({ extended: true }));

// Middleware to read cookies from incoming requests.
app.use(cookieParser());

// Root route: quick intro message for students.
app.get("/", (req, res) => {
  res.send("Welcome! Student Management API is running.");
});

// In-memory array of objects to mimic a NoSQL collection.
// Each object/document represents one student record.
const students = [
  { id: 1, name: "Arafat", email: "arafat@example.com", course: "Node.js" },
  { id: 2, name: "Rahim", email: "rahim@example.com", course: "Express.js" },
  { id: 3, name: "Karim", email: "karim@example.com", course: "MongoDB" },
];

// Small helper to generate next id.
function getNextStudentId() {
  if (students.length === 0) return 1;
  return Math.max(...students.map((student) => student.id)) + 1;
}

// ------------------------------
// CRUD: Student details
// ------------------------------

// CREATE student
// Request body example:
// { "name": "Jannat", "email": "jannat@example.com", "course": "Express.js" }
app.post("/students", (req, res) => {
  const { name, email, course } = req.body;

  // Basic validation for beginner understanding.
  if (!name || !email || !course) {
    return res.status(400).json({
      success: false,
      message: "name, email, and course are required.",
    });
  }

  const newStudent = {
    id: getNextStudentId(),
    name,
    email,
    course,
  };

  students.push(newStudent);

  // 201 = created
  res.status(201).json({
    success: true,
    message: "Student created successfully.",
    student: newStudent,
  });
});

// READ all students
// Use query to filter by course:
// /students?course=Express.js
app.get("/students", (req, res) => {
  const { course } = req.query;
  const result = course
    ? students.filter(
        (student) => student.course.toLowerCase() === String(course).toLowerCase()
      )
    : students;

  // Example custom response header.
  res.set("X-Total-Students", String(result.length));

  res.json({
    success: true,
    count: result.length,
    students: result,
  });
});

// Download student list as text file.
app.get("/students/download", (req, res) => {
  const lines = students.map(
    (student) =>
      `id=${student.id}, name=${student.name}, email=${student.email}, course=${student.course}`
  );
  const content = lines.join("\n");

  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Content-Disposition", 'attachment; filename="students.txt"');
  res.send(content);
});

// Read cookies from request.
app.get("/students/read-cookie", (req, res) => {
  res.json({
    success: true,
    cookies: req.cookies,
  });
});

// Clear last viewed cookie.
app.get("/students/clear-cookie", (req, res) => {
  res.clearCookie("lastViewedStudentId");
  res.json({
    success: true,
    message: "Cookie cleared successfully.",
  });
});

// READ single student by id
app.get("/students/id/:id", (req, res) => {
  const studentId = Number(req.params.id);
  if (Number.isNaN(studentId)) {
    return res.status(404).json({ success: false, message: "Student not found." });
  }
  const student = students.find((item) => item.id === studentId);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student not found.",
    });
  }

  res.json({
    success: true,
    student,
  });
});

// UPDATE student by id
// Only update fields provided by user.
app.put("/students/id/:id", (req, res) => {
  const studentId = Number(req.params.id);
  if (Number.isNaN(studentId)) {
    return res.status(404).json({ success: false, message: "Student not found." });
  }
  const studentIndex = students.findIndex((item) => item.id === studentId);

  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Student not found.",
    });
  }

  const { name, email, course } = req.body;
  const existingStudent = students[studentIndex];

  students[studentIndex] = {
    ...existingStudent,
    ...(name ? { name } : {}),
    ...(email ? { email } : {}),
    ...(course ? { course } : {}),
  };

  res.json({
    success: true,
    message: "Student updated successfully.",
    student: students[studentIndex],
  });
});

// DELETE student by id
app.delete("/students/id/:id", (req, res) => {
  const studentId = Number(req.params.id);
  if (Number.isNaN(studentId)) {
    return res.status(404).json({ success: false, message: "Student not found." });
  }
  const studentIndex = students.findIndex((item) => item.id === studentId);

  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Student not found.",
    });
  }

  const removedStudent = students.splice(studentIndex, 1)[0];

  res.json({
    success: true,
    message: "Student deleted successfully.",
    student: removedStudent,
  });
});

// ------------------------------
// Additional response features in real use-case
// ------------------------------

// Redirect to all students list.
app.get("/students-redirect", (req, res) => {
  res.redirect("/students");
});

// Set cookie to remember last viewed student id.
app.get("/students/id/:id/remember", (req, res) => {
  const studentId = Number(req.params.id);
  if (Number.isNaN(studentId)) {
    return res.status(404).json({ success: false, message: "Student not found." });
  }
  const student = students.find((item) => item.id === studentId);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student not found.",
    });
  }

  res.cookie("lastViewedStudentId", String(studentId), {
    maxAge: 5 * 60 * 1000,
    httpOnly: true,
  });

  res.json({
    success: true,
    message: "Cookie set successfully.",
  });
});


// Basic 404 handler to guide students when route is wrong.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found. Please check your endpoint.",
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
