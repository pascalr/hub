const path = require('path');

const handleMediaTree = require('./route/media_tree')
const handleMediaList = require('./route/media_list')
const handleThumbnail = require('./route/thumb')
const handleFile = require('./route/file')

const {error} = require('./utils')
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

    if (pathname.startsWith('/files')) {
      return handleFile(req, res, FILES_DIR, pathname.slice(6))
    } else {
      // Default to index.html if root is requested
      return handleFile(req, res, docsDir, path.join(docsDir, req.url === '/' ? 'index.html' : req.url))
    }

    return error(res, 404, 'Not found', req.url)
  } catch (err) {
    return error(res, 500, 'Server Error', err)
  }
}