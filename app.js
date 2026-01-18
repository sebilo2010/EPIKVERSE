const url = require("url");
const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 10000;

http.createServer(function(req, res) {
    const urlpath = url.parse(req.url, true);
    const pathname = urlpath.pathname;

    console.log(`Request: ${req.method} ${pathname}`);

    if (req.method === "GET") {
        // Route Mapping
        if (pathname === "/") {
            sendf(res, "index.html");
        } 
        else if (pathname === "/games/list") {
            sendf(res, "games/list.html");
        } 
        else if (pathname === "/games/start") {
            sendf(res, "games/start.html");
        } 
        else if (pathname === "/home") {
            sendf(res, "2015/home.html");
        } 
        else if (pathname === "/mobile-app-upgrades") {
            sendf(res, "other/mobile-app-upgrades.html");
        }
        else if (pathname === "/status") {
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("i am... good and healthy :D");
        }
        // Asset Handling (CSS/Images)
        else if (pathname.includes("/assets/") || pathname.endsWith(".css") || pathname.endsWith(".png") || pathname.endsWith(".jpg")) {
            serveAsset(res, pathname);
        } 
        else {
            res.writeHead(404);
            res.end("404: File Not Found");
        }
    }
}).listen(port, () => {
    console.log(`Server started! View your site at http://localhost:${port}`);
});

// Helper to send HTML files
function sendf(res, fileName) {
    const filePath = path.join(__dirname, fileName);
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(`Error loading ${fileName}:`, err);
            res.writeHead(404);
            res.end("HTML file not found");
            return;
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
}

// Helper to serve CSS and Images
function serveAsset(res, pathname) {
    // Map URL path to your local folder structure
    let localPath = path.join(__dirname, pathname);
    
    // Fix for your specific style.css location if it's inside /assets/
    if (pathname === "/style.css" || pathname === "/games/style.css") {
        localPath = path.join(__dirname, "assets/style.css");
    }

    const ext = path.extname(localPath);
    const mimeTypes = {
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg'
    };

    fs.readFile(localPath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end();
            return;
        }
        res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
        res.end(data);
    });
}