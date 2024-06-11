const http = require("node:http");

// creating server 
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end("Hello World! Welcome to NodeJS");
});

// listening server at port 8000 
server.listen(8000, () => {
  console.log(`Server running at http://localhost:8000`);
});

