const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

const port = 10000;

http.createServer(function(req, res) {
    const urlpath = url.parse(req.url, true);
    const pathname = urlpath.pathname;

    console.log("Method requested: " + req.method + ", with endpoint " + pathname);

    if (req.method === "GET") {
        if (pathname === "/") {
            // This loads your index.html file
            renderFile(res, "index.html");
        } else if (pathname === "/test") {
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("hello");
        } else if (pathname === "/games/list") {
            renderFile(res, "games/list.html");
        } else if (pathname === "/home") {
            renderFile(res, "2015/home.html");
        } else {
            // Fallback: try to see if the pathname matches a file directly
            // e.g., /about.html or /contact.html
            renderFile(res, pathname.startsWith('/') ? pathname.substring(1) : pathname);
        }
    }
}).listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// Function to safely read and send HTML files
function renderFile(res, fileName) {
    // Make sure we are looking for an .html file
    let filePath = path.join(__dirname, fileName);
    
    // If the user didn't type .html, add it (optional, but helpful)
    if (!filePath.endsWith('.html') && !filePath.includes('.')) {
        filePath += '.html';
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("404 Not Found: Could not find " + fileName);
            return;
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
}