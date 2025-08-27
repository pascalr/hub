const fs = require('fs');
const path = require('path');

const handleMediaTree = require('./media_tree')

const {error} = require('./utils')

const docsDir = path.join(__dirname, '..', 'docs');

module.exports = (req, res) => {
  // Default to index.html if root is requested
  let filePath = path.join(docsDir, req.url === '/' ? 'index.html' : req.url);

  // Extract pathname without query/hash
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // Check if route is exactly /media
  if (pathname === '/media_tree') {
    return handleMediaTree(req, res)
  }

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

      res.setHeader('X-Content-Type-Options', 'nosniff');
      //res.setHeader('X-Frame-Options', 'DENY'); I can't do this security, I am using an iframe.
      //res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'"); TODO: Understand this. It breaks if enabled.

      res.writeHead(200, {'Content-Type': mimeTypes[ext] || 'application/octet-stream'});
      res.end(content);
    });
  });
}