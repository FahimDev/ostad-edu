const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello from raw Node.js HTTP server");
});

server.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});