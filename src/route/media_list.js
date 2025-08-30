const fs = require('fs');
const path = require('path');

const {error} = require('../utils')
const config = require('../config');

const MEDIA_DIR = config.directory_media

function getFilesList(dirPath, basePath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  let files = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.relative(basePath, fullPath);

    console.log('fullPath', fullPath)

    if (entry.isDirectory()) {
      // Recursively get files from subdirectory
      files = files.concat(getFilesList(fullPath, basePath));
    } else {
      files.push({
        name: entry.name,
        path: relativePath,
        // parent: path.dirname(relativePath)
        // size: stats.size, // in bytes
        // createdAt: stats.birthtime, // creation time
        // modifiedAt: stats.mtime, // last modified
        // isSymbolicLink: entry.isSymbolicLink(),
        // mode: stats.mode // file permissions
      });
    }
  }

  console.log('files', files)

  return files;
}

module.exports = async (req, res) => {
  try {

    if (!fs.existsSync(MEDIA_DIR)) {
      return error(res, 500, "Internal server config error. Missing Media directory.", MEDIA_DIR)
    }

    const files = getFilesList(MEDIA_DIR, MEDIA_DIR);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(files, null, 2));

  } catch (err) {
    return error(res, 500, err.message)
  }
}