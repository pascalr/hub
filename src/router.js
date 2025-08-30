const path = require('path');

const handleMediaTree = require('./route/media_tree')
const handleFindFiles = require('./route/find_files')
const handleThumbnail = require('./route/thumb')
const handleFile = require('./route/file')

const {error} = require('./utils')
const config = require('./config');

const FILES_DIR = config.directory_files
const MUSICS_DIR = config.directory_musics
const MEDIA_DIR = config.directory_media

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
      return await handleFindFiles(req, res, MEDIA_DIR, "/media/")
    }
    if (pathname === '/music_list') {
      return await handleFindFiles(req, res, MUSICS_DIR, "/musics/")
    }
    if (pathname === '/thumb') {
      return await handleThumbnail(req, res)
    }

    if (pathname.startsWith('/files')) {
      return handleFile(req, res, FILES_DIR, pathname.slice(6))
    } else if (pathname.startsWith('/musics')) {
      return handleFile(req, res, MUSICS_DIR, pathname.slice(7))
    } else if (pathname.startsWith('/media')) {
      return handleFile(req, res, MEDIA_DIR, pathname.slice(6))
    } else {
      // Default to index.html if root is requested
      return handleFile(req, res, docsDir, req.url === '/' ? 'index.html' : req.url)
    }

    return error(res, 404, 'Not found', req.url)
  } catch (err) {
    return error(res, 500, 'Server Error', err)
  }
}