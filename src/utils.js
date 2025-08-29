const path = require('path');
const crypto = require('crypto');
const { URL } = require('url');

function error(res, code, msg, debugMsg) {
  if (debugMsg) {
    console.error("Error code", code, ": ", msg, ', (', debugMsg, ')')
  } else {
    console.error("Error code", code, ": ", msg)
  }
  res.writeHead(code, {'Content-Type': 'text/plain'});
  res.end(msg);
}

/**
 * Generate a unique name for cache file based on original path and size.
 */
function getCacheFileName(filePath, size = '200x200') {
  const hash = crypto.createHash('md5').update(filePath).digest('hex');
  const ext = path.extname(filePath);
  return `${hash}_${size}${ext}`;
}

function mimeType(filePath) {
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

  return mimeTypes[ext] || 'application/octet-stream'
}

function getQueryPath(req, paramName, basePath) {

  let relPath = '';

  // 1) If Express, req.query will exist and be easiest to use
  if (req.query && typeof req.query[paramName] === 'string') {
    relPath = req.query[paramName];
  } else {
    // 2) Fallback for raw Node http server: parse from req.url
    const base = `http://${req.headers.host || 'localhost'}`;
    const parsed = new URL(req.url, base);
    relPath = parsed.searchParams.get(paramName) || '';
  }

  if (!relPath) {
    throw new Error("Missing 'media' parameter")
  }

  // remove leading slashes
  relPath = relPath.replace(/^\/+/, '');

  // Normalize + prevent directory traversal
  const fullPath = path.resolve(basePath, relPath);

  // Prevent directory traversal attacks
  if (!fullPath.startsWith(basePath)) {
    throw new Error("Access denied")
  }

  return {fullPath, relPath}
}

module.exports = {error, getCacheFileName, mimeType, getQueryPath}