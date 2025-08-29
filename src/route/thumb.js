// Provide a thumbnail for a given media

const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

const {error, getCacheFileName, mimeType, getQueryPath} = require('../utils')

const SUN_DIR = path.join(os.homedir(), 'Sun'); // TODO: Fetch this from a config file instead.
const MEDIA_DIR = path.join(SUN_DIR, 'Media');
const CACHE_DIR = path.join(SUN_DIR, 'Cache');

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
      return resolve(cacheFile);
    }

    // If not, create a copy and resize it
    const cmd = `convert "${filePath}" -auto-orient -thumbnail ${size} "${cacheFile}"`;

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        return reject(new Error(`Failed to create thumbnail: ${stderr || error.message}`));
      }
      resolve(cacheFile);
    });
  });
}

module.exports = async (req, res) => {
  try {

    if (!fs.existsSync(MEDIA_DIR)) {
      return error(res, 500, "Internal server config error. Missing Media directory.", MEDIA_DIR)
    }

    const {fullPath} = getQueryPath(req, 'media', MEDIA_DIR)

    if (!fs.existsSync(fullPath)) {
      return error(res, 404, "File not found", fullPath);
    }

    // Generate or retrieve thumbnail
    try {
      const thumbnailPath = await getThumbnail(fullPath);

      // Check if thumbnail exists
      if (!fs.existsSync(thumbnailPath)) {
        return error(res, 500, "Thumbnail generation failed", thumbnailPath);
      }

      res.setHeader('Content-Type', mimeType(thumbnailPath));

      // Stream the thumbnail
      fs.createReadStream(thumbnailPath).pipe(res);

    } catch (thumbErr) {
      return error(res, 500, "Error generating thumbnail", thumbErr.message);
    }

  } catch (err) {
    return error(res, 500, err.message)
  }
}