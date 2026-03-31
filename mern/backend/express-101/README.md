# Your First Express Application (API Only)

This project is a beginner-friendly, use-case-oriented Express.js API.

Main use case: **Student Management System**

- We use an in-memory array of objects to mimic a NoSQL collection.
- Then we build CRUD operations around student details.
- We also demonstrate response methods and request handling in practical endpoints.

## Topics Covered

- Express.js Routing
- Understanding Responses
- Simple String Response
- Response Status Code
- JSON Response
- Response Download
- Response Redirect
- Response Header
- Response Set Cookies
- Clear Cookies
- Working with Request (`params`, `query`, `body`, `headers`, `cookies`)
- CRUD Operations on student details

## Project Setup

### 1) Clone or open the project folder

```bash
cd /path/to/your/project
```

### 2) Install dependencies

```bash
npm install
```

## Run Instructions

### Run in normal mode

```bash
npm start
```

### Run in development mode with nodemon

```bash
npm run dev
```

Server URL:

```text
http://localhost:3000
```

## Project Structure

- `app.js` -> Main Express server with all routes and comments
- `README.md` -> Setup + usage guide

## Route List (Student Use Case)

### Basic

- `GET /` -> Simple string response (health/welcome)

### CRUD: Students

- `POST /students` -> Create student
- `GET /students` -> Get all students
- `GET /students?course=Express.js` -> Filter students by course (query example)
- `GET /students/id/:id` -> Get one student by id (params example)
- `PUT /students/id/:id` -> Update student
- `DELETE /students/id/:id` -> Delete student

### Response Utilities (use-case friendly)

- `GET /students-redirect` -> Redirect to `/students`
- `GET /students/download` -> Download all students as text file
- `GET /students/id/:id/remember` -> Set cookie (`lastViewedStudentId`)
- `GET /students/read-cookie` -> Read cookies from request
- `GET /students/clear-cookie` -> Clear cookie

## Suggested Tools for Testing

- Postman
- Insomnia
- Browser (for GET routes)
- cURL

## Example cURL Commands

### Create a student (POST body example)

```bash
curl -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -d '{"name":"Jannat","email":"jannat@example.com","course":"Express.js"}'
```

### Get all students

```bash
curl http://localhost:3000/students
```

### Filter students by course (query example)

```bash
curl "http://localhost:3000/students?course=Express.js"
```

### Get a single student by id (params example)

```bash
curl http://localhost:3000/students/id/1
```

### Update a student

```bash
curl -X PUT http://localhost:3000/students/id/1 \
  -H "Content-Type: application/json" \
  -d '{"course":"Advanced Express.js"}'
```

### Delete a student

```bash
curl -X DELETE http://localhost:3000/students/id/1
```

### Download students as file

```bash
curl -OJ http://localhost:3000/students/download
```

### Set cookie on a student

```bash
curl -c cookies.txt http://localhost:3000/students/id/1/remember
```

### Read cookies

```bash
curl -b cookies.txt http://localhost:3000/students/read-cookie
```

### Clear cookies

```bash
curl -b cookies.txt -c cookies.txt http://localhost:3000/students/clear-cookie
```

## Teaching Notes

- `app.js` is heavily commented to help beginners follow each concept.
- The `students` array behaves like a fake NoSQL collection for classroom practice.
- In real production apps, replace in-memory data with a real database (MongoDB, PostgreSQL, etc.).
- For production projects, also add advanced validation, layered architecture, and stronger security settings.

## API Status

All endpoints have been tested and verified:

- ✓ Root endpoint (`GET /`)
- ✓ List all students (`GET /students`)
- ✓ Create student (`POST /students`)
- ✓ Get single student (`GET /students/id/:id`)
- ✓ Update student (`PUT /students/id/:id`)
- ✓ Delete student (`DELETE /students/id/:id`)
- ✓ Query filter (`GET /students?course=...`)
- ✓ Redirect (`GET /students-redirect`)
- ✓ Download (`GET /students/download`)
- ✓ Set cookie (`GET /students/id/:id/remember`)
- ✓ Read cookie (`GET /students/read-cookie`)
- ✓ Clear cookie (`GET /students/clear-cookie`)
- ✓ 404 handler (for invalid routes)
