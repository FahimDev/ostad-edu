# Cookies in Express.js (Detailed Guide)

This guide explains cookies in a beginner-friendly way using this project’s student API.

## What is a Cookie?

A cookie is a small piece of data stored in the browser by a website.
The browser automatically sends that cookie back to the server in future requests (for the same domain/path).

Common uses:

- Remember login/session
- Save user preferences (language, theme)
- Track recent activity (like "last viewed student")

## Cookie Flow (Simple)

1. Client sends request to server.
2. Server sends response with `Set-Cookie` header.
3. Browser stores the cookie.
4. On next request, browser sends `Cookie` header automatically.
5. Server reads cookie from request.

## Why We Use `cookie-parser`

In Express, raw cookies come in request headers.
`cookie-parser` converts them into an easy object:

- `req.cookies`

So you can read cookies directly in routes.

## Cookie Routes in This Project

### 1) Set Cookie

Route:

- `GET /students/id/:id/remember`

Use case:

- When user views a student profile, store that student id in cookie.
- Later you can show "last viewed student".

Example:

```bash
curl -c cookies.txt http://localhost:3000/students/id/1/remember
```

### 2) Read Cookie

Route:

- `GET /students/read-cookie`

Use case:

- Check what cookie values are coming from client.

Example:

```bash
curl -b cookies.txt http://localhost:3000/students/read-cookie
```

### 3) Clear Cookie

Route:

- `GET /students/clear-cookie`

Use case:

- Remove saved "last viewed student" information.

Example:

```bash
curl -b cookies.txt -c cookies.txt http://localhost:3000/students/clear-cookie
```

## Cookie Options Explained

In this project:

- `maxAge: 5 * 60 * 1000`
  - Cookie expires after 5 minutes.
- `httpOnly: true`
  - JavaScript in browser cannot access this cookie.
  - Helps reduce XSS risks.

Other useful options (production):

- `secure: true`
  - Cookie sent only over HTTPS.
- `sameSite: "lax" | "strict" | "none"`
  - Helps protect against CSRF attacks.
- `path`
  - Restrict cookie to specific route path.
- `domain`
  - Restrict cookie to specific domain/subdomain.

## Cookie Types (High Level)

- Session cookie:
  - Removed when browser closes (unless expiry set).
- Persistent cookie:
  - Has expiration (`maxAge` or `expires`).
- First-party cookie:
  - Set by the same site user is visiting.
- Third-party cookie:
  - Set by other domains (often ad/tracking scripts).

## Real-World Use Cases

- Authentication session id
- Shopping cart in e-commerce
- Last visited page
- A/B testing variant
- User locale and timezone

## Security Best Practices

- Never store sensitive data (password, full personal data) in plain cookies.
- Prefer storing a token/session id, not raw secrets.
- Use `httpOnly`, `secure`, and proper `sameSite`.
- Use short expiration for sensitive workflows.
- Validate all cookie values on server before trusting them.

## Classroom Demo Plan

1. Call `GET /students/id/1/remember` to set cookie.
2. Call `GET /students/read-cookie` to show cookie is returned.
3. Call `GET /students/clear-cookie` to remove cookie.
4. Call `GET /students/read-cookie` again to show it is cleared.

This sequence helps students clearly understand cookie lifecycle.
