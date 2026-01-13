# Multer File Upload API

A simple Express.js server with Multer for handling file uploads. This project demonstrates how to upload image files (JPG/PNG) with proper validation and storage.

## Features

- File upload with Multer middleware
- Image type validation (JPG/PNG only)
- File size limit (1MB)
- Automatic file naming with timestamp and random number
- Health check endpoint
- Error handling middleware

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Copy `.env` file (already included)
   - Update `PORT` if needed (default: 3000)

3. **Run the server:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Health Check
```
GET /health
```
Returns server status.

**Response:**
```json
{
  "status": "ok"
}
```

### File Upload
```
POST /upload
Content-Type: multipart/form-data
```

**Request:**
- Form field name: `avatar`
- Allowed file types: JPG, PNG
- Maximum file size: 1MB

**Example using curl:**
```bash
curl -X POST http://localhost:3000/upload \
  -F "avatar=@/path/to/your/image.jpg"
```

**Success Response:**
```json
{
  "message": "File Uploaded Successfully",
  "filename": "1234567890-123456789.jpg",
  "mimetype": "image/jpeg",
  "size": 123456
}
```

**Error Response:**
```json
{
  "error": "Only JPG/PNG allowed"
}
```

## Project Structure

```
multer-file-upload/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── .env              # Environment variables
├── uploads/          # Uploaded files directory (auto-created)
└── README.md         # This file
```

## Environment Variables

- `PORT`: Server port number (default: 3000)

## File Storage

Uploaded files are stored in the `uploads/` directory with the naming format:
```
{timestamp}-{randomNumber}.{extension}
```

Example: `1705123456789-987654321.jpg`

## Error Handling

The server includes error handling middleware that catches:
- Invalid file types
- File size limit exceeded
- Other upload errors

All errors return a 400 status code with an error message.

## Development

- Uses `nodemon` for automatic server restart during development
- ES6 modules (import/export syntax)
- Express.js v5.2.1
- Multer v2.0.2

## Notes

- The `uploads/` directory is automatically created if it doesn't exist
- Only single file uploads are supported (one file per request)
- Files are stored on disk using Multer's disk storage engine

---

## 12 Factor App Methodology

The **12 Factor App** is a methodology for building modern, scalable, and maintainable software-as-a-service applications. It was introduced by engineers at Heroku and provides best practices for application development. Here are the 12 factors:

### 1. **Codebase**
One codebase tracked in revision control, many deploys. Each app has a single codebase, but multiple deployments (staging, production, etc.).

### 2. **Dependencies**
Explicitly declare and isolate dependencies. Never rely on implicit system-wide packages. Use dependency managers like npm, pip, etc.

### 3. **Config**
Store config in the environment. Configuration that varies between deploys (database URLs, API keys, ports) should be stored in environment variables, not in code.

### 4. **Backing Services**
Treat backing services as attached resources. Databases, message queues, and APIs should be treated as attached resources, easily swappable.

### 5. **Build, Release, Run**
Strictly separate build and run stages. The build stage transforms code into an executable bundle, while the run stage executes the app.

### 6. **Processes**
Execute the app as one or more stateless processes. Apps should not store state in memory or on disk between requests.

### 7. **Port Binding**
Export services via port binding. Apps should be self-contained and export HTTP as a service by binding to a port.

### 8. **Concurrency**
Scale out via the process model. Use the Unix process model for running service daemons and scale horizontally.

### 9. **Disposability**
Maximize robustness with fast startup and graceful shutdown. Processes should start quickly and shut down gracefully.

### 10. **Dev/Prod Parity**
Keep development, staging, and production as similar as possible. Avoid gaps between environments.

### 11. **Logs**
Treat logs as event streams. Apps should write logs to stdout/stderr and let the execution environment handle aggregation.

### 12. **Admin Processes**
Run admin/management tasks as one-off processes. Database migrations, console sessions, and one-time scripts should run as separate processes.

### How This Project Follows 12 Factor Principles

- **Factor 3 (Config)**: Uses `.env` file for environment variables like `PORT`
- **Factor 2 (Dependencies)**: Explicit dependencies in `package.json`
- **Factor 7 (Port Binding)**: Server binds to a port and exports HTTP service
- **Factor 11 (Logs)**: Uses `console.log` for logging (can be redirected to stdout)
- **Factor 4 (Backing Services)**: File storage can be swapped (currently disk, could be S3, etc.)

