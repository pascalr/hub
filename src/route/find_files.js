const fs = require('fs');
const path = require('path');

const {error} = require('../utils')

function getFilesList(dirPath, basePath, baseURL) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  let files = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.relative(basePath, fullPath);

    console.log('fullPath', fullPath)

    if (entry.isDirectory()) {
      // Recursively get files from subdirectory
      files = files.concat(getFilesList(fullPath, basePath, baseURL));
    } else {
      let e = {
        name: entry.name,
        path: relativePath,
        // parent: path.dirname(relativePath)
        // size: stats.size, // in bytes
        // createdAt: stats.birthtime, // creation time
        // modifiedAt: stats.mtime, // last modified
        // isSymbolicLink: entry.isSymbolicLink(),
        // mode: stats.mode // file permissions
      }
      if (baseURL) {
        e.url = baseURL + encodeURIComponent(relativePath)
      }
      files.push(e);
    }
  }

  console.log('files', files)

  return files;
}

module.exports = async (req, res, directory, baseURL) => {
  try {

    if (!fs.existsSync(directory)) {
      return error(res, 500, "Internal server config error. Missing Media directory.", directory)
    }

    const files = getFilesList(directory, directory, baseURL);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(files, null, 2));

  } catch (err) {
    return error(res, 500, err.message)
  }
}