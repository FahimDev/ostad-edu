# Ostad Edu Backend Small OpenAPI Project

Small Express.js project for teaching an API flow without database operations.
It follows a clean OpenAPI-first style and returns sample/in-memory responses.

## Covered Topics

- User Registration
- Login
- Login Token Generation
- Login Token Verification
- Email Verification
- OTP Verification
- Reset User Password
- Select User Profile
- Update User Profile
- Create New Task
- Select Task List
- Select Single Task
- Update Task
- Remove Task
- Filter Task List
- Filter by Date
- OpenAPI / Swagger Documentation

## Why this project is intentionally small

This project does **not** use MongoDB or SQL yet.
It uses an in-memory JavaScript array from `src/data/memoryStore.js`.

That means:

- Data resets when server restarts.
- Passwords are stored as plain text only for demo.
- OTP is hardcoded as `123456` for classroom practice.
- JWT is real, but user persistence is fake.

This keeps the focus on API structure, route design, middleware, JWT flow, and OpenAPI docs.

---

## Project Structure

```txt
ostad-open-api-small/
├── .github/workflows/deploy.yml
├── .env.example
├── .gitignore
├── package.json
├── README.md
├── requests.http
├── server.js
└── src/
    ├── app.js
    ├── data/
    │   └── memoryStore.js
    ├── docs/
    │   └── openapi.js
    ├── middleware/
    │   └── auth.js
    └── routes/
        ├── auth.routes.js
        ├── profile.routes.js
        └── task.routes.js
```

---

## Install and Run Locally

```bash
cp .env.example .env
npm install
npm run dev
```

Production-style start:

```bash
npm start
```

Health check:

```bash
curl http://localhost:5000/health
```

Swagger/OpenAPI docs:

```txt
http://localhost:5000/api-docs
```

Raw OpenAPI JSON:

```txt
http://localhost:5000/openapi.json
```

---

## Demo Login

Use this existing sample user:

```json
{
  "email": "student@example.com",
  "password": "password123"
}
```

Login endpoint:

```http
POST /api/v1/auth/login
```

The response returns a JWT token. Use it like this:

```http
Authorization: Bearer <accessToken>
```

---

## API Endpoints

### System

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Base API info |
| GET | `/health` | Server health |
| GET | `/api-docs` | Swagger UI documentation |
| GET | `/openapi.json` | Raw OpenAPI document |

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Register user |
| POST | `/api/v1/auth/login` | Login and generate token |
| GET | `/api/v1/auth/verify-token` | Verify login token |
| POST | `/api/v1/auth/email/verify` | Verify email using OTP |
| POST | `/api/v1/auth/otp/verify` | Verify OTP |
| POST | `/api/v1/auth/password/reset` | Reset user password |

### Profile

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/profile/me` | Required | Select profile |
| PATCH | `/api/v1/profile/me` | Required | Update profile |

### Tasks

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/tasks` | Required | Create new task |
| GET | `/api/v1/tasks` | Required | Select and filter tasks |
| GET | `/api/v1/tasks/:id` | Required | Select one task |
| PATCH | `/api/v1/tasks/:id` | Required | Update task |
| DELETE | `/api/v1/tasks/:id` | Required | Remove task |

---

## Task Filtering Examples

Filter by status:

```http
GET /api/v1/tasks?status=todo
```

Filter by priority:

```http
GET /api/v1/tasks?priority=high
```

Search by title/description:

```http
GET /api/v1/tasks?search=node
```

Filter by date range:

```http
GET /api/v1/tasks?fromDate=2026-07-01&toDate=2026-07-31
```

Combined filtering:

```http
GET /api/v1/tasks?status=todo&priority=high&fromDate=2026-07-01&toDate=2026-07-31
```

---

## Classroom Development Order

Teach/develop this project in this order:

1. `package.json` and scripts
2. `server.js`
3. `src/app.js`
4. Health route
5. OpenAPI route `/api-docs`
6. `memoryStore.js`
7. Registration route
8. Login route
9. JWT middleware
10. Verify-token route
11. Profile select/update routes
12. Task CRUD routes
13. Task filtering routes
14. Deployment with PM2/GitHub Actions

---

## PM2 Command Matching Your Workflow

Your workflow uses:

```bash
pm2 restart ostad-open-api || pm2 start npm --name ostad-open-api -- start
pm2 save
```

This project supports that because `package.json` contains:

```json
"start": "node server.js"
```

So PM2 will run:

```bash
npm start
```

---

## Important Production Improvements Later

When you move from sample API to real API, add:

- MongoDB/PostgreSQL database
- bcrypt password hashing
- Real email service
- Real OTP storage with expiry
- Input validation using Joi/Zod/express-validator
- Refresh token flow
- Rate limiting
- Request logging
- Central response/error utilities
- Automated tests
- Dockerfile
- CI/CD environment secret management

