const https = require('https');
const http = require('http');
const app = require("./app");
const fs = require("fs");
const path = require('path');

const privateKey = fs.readFileSync(path.resolve(__dirname, './.ssl/server.key'));
const certificate = fs.readFileSync(path.resolve(__dirname, './.ssl/server.cert'));

//const server = https.createServer({key:  privateKey, cert: certificate}, app);
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
app.set('port', PORT);
server.listen(PORT);

module.exports = server;
