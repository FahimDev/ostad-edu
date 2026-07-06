// This OpenAPI document is the API contract.
// It allows humans and tools to understand routes, request bodies, auth, and responses.
// For this small project, the document is kept in code to avoid extra YAML parser packages.

module.exports = {
  openapi: "3.0.3",
  info: {
    title: "Ostad Edu Backend Sample API",
    version: "1.0.0",
    description:
      "Small Express.js API for teaching registration, login, JWT verification, email/OTP verification, profile update, task CRUD, filtering, and OpenAPI documentation. No database operation is used."
  },
  servers: [
    { url: "http://localhost:5000", description: "Local development" }
  ],
  tags: [
    { name: "System", description: "Health and base routes" },
    { name: "Auth", description: "Registration, login, token, email, OTP, and password reset" },
    { name: "Profile", description: "Logged-in user profile selection and update" },
    { name: "Tasks", description: "Task creation, selection, update, deletion, and filtering" }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      ApiResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Operation successful" }
        }
      },
      RegisterRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "Demo Student" },
          email: { type: "string", format: "email", example: "student@example.com" },
          password: { type: "string", example: "password123" },
          phone: { type: "string", example: "+8801700000000" }
        }
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "student@example.com" },
          password: { type: "string", example: "password123" }
        }
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string", example: "user_101" },
          name: { type: "string", example: "Demo Student" },
          email: { type: "string", example: "student@example.com" },
          phone: { type: "string", example: "+8801700000000" },
          role: { type: "string", example: "student" },
          emailVerified: { type: "boolean", example: true },
          bio: { type: "string", example: "Learning Node.js and Express.js" },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      Task: {
        type: "object",
        properties: {
          id: { type: "string", example: "task_101" },
          title: { type: "string", example: "Read Node.js event loop notes" },
          description: { type: "string", example: "Revise callback queue and microtask queue." },
          status: { type: "string", enum: ["todo", "doing", "done"], example: "todo" },
          priority: { type: "string", enum: ["low", "medium", "high"], example: "high" },
          dueDate: { type: "string", format: "date", example: "2026-07-10" },
          ownerId: { type: "string", example: "user_101" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      CreateTaskRequest: {
        type: "object",
        required: ["title"],
        properties: {
          title: { type: "string", example: "Build OpenAPI Express project" },
          description: { type: "string", example: "Create sample auth and task APIs." },
          status: { type: "string", enum: ["todo", "doing", "done"], example: "todo" },
          priority: { type: "string", enum: ["low", "medium", "high"], example: "medium" },
          dueDate: { type: "string", format: "date", example: "2026-07-12" }
        }
      }
    }
  },
  paths: {
    "/health": {
      get: {
        tags: ["System"],
        summary: "Health check",
        responses: {
          200: {
            description: "Server is running"
          }
        }
      }
    },
    "/api/v1/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "User Registration",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" }
            }
          }
        },
        responses: {
          201: { description: "Registration successful" }
        }
      }
    },
    "/api/v1/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login and generate token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" }
            }
          }
        },
        responses: {
          200: { description: "Login successful and JWT returned" },
          401: { description: "Invalid email or password" }
        }
      }
    },
    "/api/v1/auth/verify-token": {
      get: {
        tags: ["Auth"],
        summary: "Verify login token",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Token is valid" },
          401: { description: "Invalid or missing token" }
        }
      }
    },
    "/api/v1/auth/email/verify": {
      post: {
        tags: ["Auth"],
        summary: "Email Verification",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", example: "student@example.com" },
                  otp: { type: "string", example: "123456" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Email verified" },
          400: { description: "Invalid OTP" }
        }
      }
    },
    "/api/v1/auth/otp/verify": {
      post: {
        tags: ["Auth"],
        summary: "OTP Verification",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  purpose: { type: "string", example: "login" },
                  otp: { type: "string", example: "123456" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "OTP verified" },
          400: { description: "Invalid OTP" }
        }
      }
    },
    "/api/v1/auth/password/reset": {
      post: {
        tags: ["Auth"],
        summary: "Reset User Password",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", example: "student@example.com" },
                  otp: { type: "string", example: "123456" },
                  newPassword: { type: "string", example: "newpassword123" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Password reset successful" }
        }
      }
    },
    "/api/v1/profile/me": {
      get: {
        tags: ["Profile"],
        summary: "Select User Profile",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Profile returned" },
          401: { description: "Unauthorized" }
        }
      },
      patch: {
        tags: ["Profile"],
        summary: "Update User Profile",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Updated Student" },
                  phone: { type: "string", example: "+8801800000000" },
                  bio: { type: "string", example: "I am learning backend API development." }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Profile updated" }
        }
      }
    },
    "/api/v1/tasks": {
      post: {
        tags: ["Tasks"],
        summary: "Creating New Task",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateTaskRequest" }
            }
          }
        },
        responses: {
          201: { description: "Task created" }
        }
      },
      get: {
        tags: ["Tasks"],
        summary: "Selecting and filtering task list",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "status", in: "query", schema: { type: "string", enum: ["todo", "doing", "done"] } },
          { name: "priority", in: "query", schema: { type: "string", enum: ["low", "medium", "high"] } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "fromDate", in: "query", schema: { type: "string", format: "date" } },
          { name: "toDate", in: "query", schema: { type: "string", format: "date" } }
        ],
        responses: {
          200: { description: "Filtered task list returned" }
        }
      }
    },
    "/api/v1/tasks/{id}": {
      get: {
        tags: ["Tasks"],
        summary: "Selecting one task",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Task returned" },
          404: { description: "Task not found" }
        }
      },
      patch: {
        tags: ["Tasks"],
        summary: "Updating task",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateTaskRequest" }
            }
          }
        },
        responses: {
          200: { description: "Task updated" },
          404: { description: "Task not found" }
        }
      },
      delete: {
        tags: ["Tasks"],
        summary: "Removing task",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Task removed" },
          404: { description: "Task not found" }
        }
      }
    }
  }
};
