# Node + Express + MongoDB + Mongoose + JWT Classroom Task API

This is a classroom-ready backend project designed for live teaching.

- MongoDB runs in Docker.
- Mongo Express runs in Docker for database visualization.
- Express runs from your terminal so students can see server logs, Mongoose query logs, errors, and request lifecycle.

## Quick Start

```bash
cp .env.example .env
npm install
npm run db:up
npm run dev
```

Open:

- API: http://localhost:5000
- Health: http://localhost:5000/health
- DB visual route: http://localhost:5000/api/visual/db-state
- Mongo Express: http://localhost:8081
  - username: teacher
  - password: teacher123

## Seed Demo Data

```bash
npm run seed
```

Demo users:

```text
teacher@example.com / password123
student@example.com / password123
```

## Stop Docker Containers

```bash
npm run db:down
```

## Reset MongoDB Completely

```bash
npm run db:reset
```

This deletes the Docker volume and all local MongoDB data for this project.
