function error(res, code, msg, debugMsg) {
  if (debugMsg) {
    console.error("Error code", code, ": ", msg, ', (', debugMsg, ')')
  } else {
    console.error("Error code", code, ": ", msg)
  }
  res.writeHead(code, {'Content-Type': 'text/plain'});
  res.end(msg);
}

module.exports = {error}