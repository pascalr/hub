const fs = require('fs');
const path = require('path');
const os = require('os');

const {error} = require('../utils')
const config = require('../config');

const MEDIA_DIR = config.directory_media

function getDirectoryTree(dirPath) {
  const stats = fs.statSync(dirPath);

  if (stats.isDirectory()) {
    return {
      n: path.basename(dirPath), // name
      t: 'd', // type
      c: fs.readdirSync(dirPath).map(file => // children
        getDirectoryTree(path.join(dirPath, file))
      )
    };
  } else {
    return {
      n: path.basename(dirPath), // name
      t: 'f' // type
    };
  }
}

module.exports = (req, res) => {
  try {
    if (!fs.existsSync(MEDIA_DIR)) {
      return error(res, 500, "Internal server config error. Missing Media directory.", MEDIA_DIR)
    }

    const tree = getDirectoryTree(MEDIA_DIR);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(tree, null, 2));

  } catch (error) {
    return error(res, 500, error.message)
  }
}