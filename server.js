const http = require('http');
const handleRequest = require('./src/router');

const port = 9000;

http.createServer(handleRequest).listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
