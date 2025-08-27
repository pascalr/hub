const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');

function error(res, code, msg, debugMsg) {
  console.error("Error code", code, ": ", msg, ', (', debugMsg, ')')
  res.writeHead(code, {'Content-Type': 'text/plain'});
  res.end(msg);
}

module.exports = (req, res) => {
  // Default to index.html if root is requested
  let filePath = path.join(docsDir, req.url === '/' ? 'index.html' : req.url);

  // Prevent directory traversal attacks
  if (!filePath.startsWith(docsDir)) {
    return error(res, 403, 'Access denied', filePath)
  }

  fs.stat(filePath, (err, stats) => {
    if (err) {
      return error(res, 404, 'File not found', filePath)
    }

    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    fs.readFile(filePath, (err, content) => {
      if (err) {
        console.error("Server error", filePath)
        return error(res, 500, 'Server error', filePath)
      }

      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml'
      };

      res.writeHead(200, {'Content-Type': mimeTypes[ext] || 'application/octet-stream'});
      res.end(content);
    });
  });
}