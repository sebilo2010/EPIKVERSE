const url = require("url");
const http = require("http");
const fs = require("fs");
const path = require("path"); // Better for handling file paths

const port = 10000;

// Placeholder for the missing data/function in your original snippet
const WBtest = {}; 
function GetUserData(data) {
    return { status: "success", message: "Logged in", data: data };
}

http.createServer(function(req, res) {
    const urlpath = url.parse(req.url, true);
    const pathname = urlpath.pathname; // Simplified path getting

    console.log(`Method: ${req.method} | Endpoint: ${pathname}`);

    if (req.method === "GET") {
        if (pathname === "/") {
            sendf(res, "index.html");
        } else if (pathname === "/status") {
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("i am... good and healthy :D");
        } else if (pathname === "/games/list") {
            sendf(res, "games/list.html");
        } else if (pathname === "/assets/logo.png") {
            sendf(res, "assets/logo.png", "image/png");
        } else if (pathname === "/style.css" || pathname === "/games/style.css") {
            sendf(res, "assets/style.css", "text/css");
        } else if (pathname === "/games/thumbnail1.jpg") {
            sendf(res, "assets/thumbnail1.jpg", "image/jpeg");
        } else if (pathname === "/games/start") {
            sendf(res, "games/start.html");
        } else if (pathname === "/home") {
            sendf(res, "2015/home.html");
        } else if (pathname === "/other/bc.png") {
            sendf(res, "assets/bc.png", "image/png");
        } else if (pathname === "/mobile-app-upgrades") {
            sendf(res, "other/mobile-app-upgrades.html");
        } else {
            // 404 Not Found handler
            res.writeHead(404);
            res.end("Page not found");
        }
    }

    if (req.method === "POST") {
        if (pathname === "/mobileapi/login") {
            let userData = GetUserData(WBtest);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(userData));
        }
    }
}).listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Improved helper function
function sendf(res, filePath, contentType = "text/html") {
    const fullPath = path.join(__dirname, filePath);
    
    fs.readFile(fullPath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end("File not found");
            return;
        }
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
    });
}