const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

const port = 10000;

http.createServer(function(req, res) {
    const urlpath = url.parse(req.url, true);
    const pathname = urlpath.pathname; // Gets the path without the query string (?)

    console.log("Method requested: " + req.method + ", with endpoint " + pathname);

    if (req.method === "GET") {
        if (pathname === "/" || pathname === "/home") {
            // Both root and /home now point to index.html
            renderFile(res, "index.html");
        } else if (pathname === "/test") {
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("hello");
        } else if (pathname === "/games/list") {
            renderFile(res, "games/list.html");
        } else if (pathname === "/games/start") {
            renderFile(res, "games/start.html");
        } else if (pathname === "/mobile-app-upgrades") {
            renderFile(res, "other/mobile-app-upgrades.html");
        } else if (pathname === "/status") {
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("i am... good and healthy :D");
        } else {
            // Try to serve assets (CSS/Images) or return 404
            serveStaticAsset(res, pathname);
        }
    }
}).listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// Helper to load HTML files
function renderFile(res, fileName) {
    const filePath = path.join(__dirname, fileName);
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("404: HTML File Not Found");
            return;
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
}

// Helper to load CSS, JS, and Images
function serveStaticAsset(res, pathname) {
    const filePath = path.join(__dirname, pathname);
    const ext = path.extname(filePath);
    
    const mimeTypes = {
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.js': 'application/javascript'
    };

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end("Resource not found");
            return;
        }
        res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
        res.end(data);
    });
}