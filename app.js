const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

const port = 10000;

http.createServer(function(req, res) {
  const urlpath = url.parse(req.url, true);
  const route = urlpath.pathname;

  console.log(`Method: ${req.method} | Path: ${route}`);

  if (route === "/" || route === "/index.html") {
    // Read and serve your index.html file
    fs.readFile(path.join(__dirname, "index.html"), (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end("Error loading index.html");
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } 
  else if (route === "/test") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("hello");
  } 
  else if (route.startsWith("/assets/")) {
    // Simple logic to serve files from your assets folder
    const filePath = path.join(__dirname, route);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("Asset not found");
      } else {
        res.end(data);
      }
    });
  }
  else {
    res.writeHead(404);
    res.end("404 Not Found");
  }
}).listen(port, () => {
  console.log(`Server live at http://localhost:${port}`);
});