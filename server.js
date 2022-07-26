const http = require('http');
const app = require("./app");

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
app.set('port', PORT);
server.listen(PORT);

module.exports = server;
