const fs = require('fs');
const path = require('path');

const handleMediaTree = require('./route/media_tree')
const handleMediaList = require('./route/media_list')
const handleThumbnail = require('./route/thumb')

const {error, mimeType} = require('./utils')
const config = require('./config');

const FILES_DIR = config.directory_files

const docsDir = path.join(__dirname, '..', 'docs');

module.exports = async (req, res) => {
  try {
    // Extract pathname without query/hash
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    if (pathname === '/media_tree') {
      return handleMediaTree(req, res)
    }
    if (pathname === '/media_list') {
      return await handleMediaList(req, res)
    }
    if (pathname === '/thumb') {
      return await handleThumbnail(req, res)
    }

    let baseDir = ''
    let filePath = ''
    if (pathname.startsWith('/files')) {
      baseDir = FILES_DIR
      filePath = path.join(baseDir, pathname.slice(6));
    } else {
      baseDir = docsDir
      // Default to index.html if root is requested
      filePath = path.join(baseDir, req.url === '/' ? 'index.html' : req.url);
    }

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
  } catch (err) {
    return error(res, 500, 'Server Error', err)
  }
}