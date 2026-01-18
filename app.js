const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

const port = 10000;

// Mapping extensions to Content-Types so CSS and Images load correctly
const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".json": "application/json"
};

http.createServer(function(req, res) {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // 1. Default route
  if (pathname === "/") pathname = "/index.html";

  // 2. Define possible locations for files based on your screenshots
  // We check the root, /app, /assets, and /games
  const searchPaths = [
    path.join(__dirname, pathname),
    path.join(__dirname, "app", pathname),
    path.join(__dirname, "assets", pathname),
    path.join(__dirname, "games", pathname),
    path.join(__dirname, "games/assets", pathname) // for EPIKVERSE.png
  ];

  // Helper function to try reading files from different folders
  function tryServeFile(index) {
    if (index >= searchPaths.length) {
      res.writeHead(404);
      res.end("404: File Not Found");
      return;
    }

    const targetFile = searchPaths[index];

    fs.access(targetFile, fs.constants.F_OK, (err) => {
      if (!err) {
        // File exists!
        const ext = path.extname(targetFile).toLowerCase();
        const contentType = mimeTypes[ext] || "application/octet-stream";
        
        fs.readFile(targetFile, (readErr, data) => {
          if (readErr) {
            res.writeHead(500);
            res.end("Server Error");
          } else {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(data);
          }
        });
      } else {
        // Try the next possible directory
        tryServeFile(index + 1);
      }
    });
  }

  tryServeFile(0);

}).listen(port, () => {
  console.log(`Server started! View it at http://localhost:${port}`);
});