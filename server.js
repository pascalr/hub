const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 9000;
const docsDir = path.join(__dirname, 'docs');

function textPlain(res, code, msg) {
  res.writeHead(code, {'Content-Type': 'text/plain'});
  res.end(msg);
}

http.createServer((req, res) => {
  // Default to index.html if root is requested
  let filePath = path.join(docsDir, req.url === '/' ? 'index.html' : req.url);

  // Prevent directory traversal attacks
  if (!filePath.startsWith(docsDir)) {
    return textPlain(res, 403, 'Access denied')
  }

  fs.stat(filePath, (err, stats) => {
    if (err) {
      return textPlain(res, 404, 'File not found')
    }

    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    fs.readFile(filePath, (err, content) => {
      if (err) {
        return textPlain(res, 500, 'Server error')
      }

      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif'
      };

      res.writeHead(200, {'Content-Type': mimeTypes[ext] || 'application/octet-stream'});
      res.end(content);
    });
  });
}).listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
