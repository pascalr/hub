const fs = require('fs');
const path = require('path');

const {error, mimeType} = require('../utils')

module.exports = (req, res, baseDir, relPathUrl) => {

  let filePath = path.join(baseDir, decodeURIComponent(relPathUrl))

  // Prevent directory traversal attacks
  if (!filePath.startsWith(baseDir)) {
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

      res.setHeader('X-Content-Type-Options', 'nosniff');
      //res.setHeader('X-Frame-Options', 'DENY'); I can't do this security, I am using an iframe.
      //res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'"); TODO: Understand this. It breaks if enabled.

      res.writeHead(200, {'Content-Type': mimeType(filePath)});
      res.end(content);
    });
  });
}