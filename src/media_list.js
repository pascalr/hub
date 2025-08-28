const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { exec } = require('child_process');

const {error} = require('./utils')

const SUN_DIR = path.join(os.homedir(), 'Sun'); // TODO: Fetch this from a config file instead.
const MEDIA_DIR = path.join(SUN_DIR, 'Media');
const CACHE_DIR = path.join(SUN_DIR, 'Cache');

/**
 * Generate a unique name for cache file based on original path and size.
 */
function getCacheFileName(filePath, size = '200x200') {
  const hash = crypto.createHash('md5').update(filePath).digest('hex');
  const ext = path.extname(filePath);
  return `${hash}_${size}${ext}`;
}

/**
 * Get thumbnail path from cache or create it.
 * @param {string} filePath - Original file path
 * @param {string} size - Thumbnail size (e.g. "200x200")
 * @returns {Promise<string>} Path to cached thumbnail
 */
async function getThumbnail(filePath, size = '200x200') {
  return new Promise((resolve, reject) => {

    const filename = getCacheFileName(filePath, size);
    const cacheFile = path.join(CACHE_DIR, filename);

    // Check if cached version exists
    if (fs.existsSync(cacheFile)) {
      return resolve(filename);
    }

    // If not, create a copy and resize it
    const cmd = `convert "${filePath}" -auto-orient -thumbnail ${size} "${cacheFile}"`;

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        return reject(new Error(`Failed to create thumbnail: ${stderr || error.message}`));
      }
      resolve(filename);
    });
  });
}

async function getFilesList(dirPath, basePath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  let files = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.relative(basePath, fullPath);

    if (entry.isDirectory()) {
      // Recursively get files from subdirectory
      files = files.concat(getFilesList(fullPath, basePath));
    } else {
      files.push({
        name: entry.name,
        path: relativePath,
        thumb: await getThumbnail(fullPath),
        // parent: path.dirname(relativePath)
        // size: stats.size, // in bytes
        // createdAt: stats.birthtime, // creation time
        // modifiedAt: stats.mtime, // last modified
        // isSymbolicLink: entry.isSymbolicLink(),
        // mode: stats.mode // file permissions
      });
    }
  }

  return files;
}

module.exports = async (req, res) => {
  try {

    if (!fs.existsSync(MEDIA_DIR)) {
      return error(res, 500, "Internal server config error. Missing Media directory.", MEDIA_DIR)
    }

    const files = await getFilesList(MEDIA_DIR, MEDIA_DIR);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(files, null, 2));

  } catch (err) {
    return error(res, 500, err.message)
  }
}