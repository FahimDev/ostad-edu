const path = require("path");
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3000;
const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "admin";

// Parse form submissions (application/x-www-form-urlencoded) and JSON bodies.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// cookie-parser reads incoming Cookie headers and exposes them as req.cookies.
// In this lab, express-session can work without it, but keeping it helps students
// inspect/understand normal cookies vs session cookies in Express apps.
app.use(cookieParser());

// express-session stores session data on the server.
// The browser only gets a session ID cookie (connect.sid), not the actual data.
app.use(
  session({
    secret: "lab-secret-key-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      // HttpOnly: JavaScript in the browser cannot read this cookie.
      httpOnly: false,
      // secure=false for local HTTP development (set true behind HTTPS in production | cookie is sent safely over TLS.).
      secure: false,
      // Cookie expires after 60 seconds to demonstrate session expiration quickly.
      maxAge: 60 * 1000,
      // SameSite Lax helps reduce CSRF risk for most cross-site requests.
      sameSite: "lax",
      // Missing secure/sameSite/httpOnly can make session hijacking easier via
      // network sniffing (without HTTPS), CSRF, or XSS-based cookie theft.
    },
  })
);

function shortSessionId(sessionId) {
  if (!sessionId) return "none";
  return `${sessionId.slice(0, 8)}...`;
}

// Teaching logger: shows how the same browser keeps sending a session cookie,
// which lets the server map requests to the same session/user.
app.use((req, res, next) => {
  const hasSessionCookie = Boolean(req.cookies["connect.sid"]);
  // eslint-disable-next-line no-console
  console.log(
    `[REQ] ${req.method} ${req.path} | sessionID=${shortSessionId(
      req.sessionID
    )} | hasCookie=${hasSessionCookie} | isLoggedIn=${Boolean(
      req.session?.isLoggedIn
    )} | user=${req.session?.username || "guest"}`
  );
  next();
});

// Serve static frontend files (login.html, vault.html, etc.).
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/vault");
  }
  return res.redirect("/login");
});

app.get("/login", (req, res) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/vault");
  }
  return res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  // Simple classroom credential check (not for production).
  if (username !== DEFAULT_USERNAME || password !== DEFAULT_PASSWORD) {
    // eslint-disable-next-line no-console
    console.log(
      `[LOGIN] failed for username="${username || "empty"}" from sessionID=${shortSessionId(
        req.sessionID
      )}`
    );
    return res.redirect("/login?error=invalid_credentials");
  }

  // Mark this user as authenticated inside the server-side session object.
  req.session.isLoggedIn = true;
  req.session.username = username;
  // eslint-disable-next-line no-console
  console.log(
    `[LOGIN] success user="${username}" mapped to sessionID=${shortSessionId(
      req.sessionID
    )}`
  );
  return res.redirect("/vault");
});

// Simple alternative cookie example (like an e-commerce cart).
// This is a plain cookie, not a server session.
app.get("/cart/add", (req, res) => {
  // Read item from URL query: /cart/add?item=pen&qty=2
  // If item is missing, default to "book".
  const item = req.query.item || "book";
  // Read qty from query and convert it to Number.
  // If qty is missing, default to 1.
  const qty = Number(req.query.qty || 1);

  // Start with an empty cart. We'll replace this if cookie already exists.
  let cart = [];
  // If browser already sent a cart cookie, try to load previous cart items.
  if (req.cookies.cart) {
    try {
      // Cookie value is stored as JSON text, so parse it back to an array.
      cart = JSON.parse(req.cookies.cart);
    } catch {
      // If cookie is corrupted/not valid JSON, reset safely to empty cart.
      cart = [];
    }
  }

  // Add the new item to the in-memory cart array.
  cart.push({ item, qty });

  // Save updated cart back into cookie as JSON text.
  res.cookie("cart", JSON.stringify(cart), {
    // Deliberately false for classroom demo: JS can read this cookie.
    // In production, sensitive cookies should usually be HttpOnly.
    httpOnly: false, // demo purpose: frontend JS can read this cookie
    // Lax helps reduce CSRF risk in many cross-site scenarios.
    sameSite: "lax",
    // Keep cart cookie for 5 minutes.
    maxAge: 5 * 60 * 1000,
  });

  // Return response so students can immediately see current cart content.
  return res.send({ message: "Item added to cart cookie", cart });
});

app.get("/cart/view", (req, res) => {
  // Default to empty cart if cookie is not present.
  let cart = [];
  // If cart cookie exists, parse it so we can show current items.
  if (req.cookies.cart) {
    try {
      cart = JSON.parse(req.cookies.cart);
    } catch {
      // Invalid cookie value -> treat as empty cart.
      cart = [];
    }
  }
  // Send parsed cart data back to browser.
  return res.send({ cart });
});

app.get("/cart/clear", (req, res) => {
  // Instruct browser to remove the "cart" cookie.
  res.clearCookie("cart");
  // Confirm action in response.
  return res.send({ message: "Cart cookie cleared" });
});

app.get("/vault", (req, res) => {
  // Protected route: only accessible if the session indicates logged-in state.
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  return res.sendFile(path.join(__dirname, "public", "vault.html"));
});

app.post("/logout", (req, res) => {
  // Destroy session on server and remove login state.
  const username = req.session.username || "unknown";
  const sessionId = req.sessionID;
  // eslint-disable-next-line no-console
  console.log(
    `[LOGOUT] user="${username}" destroying sessionID=${shortSessionId(sessionId)}`
  );
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at http://localhost:${PORT}`);
});
