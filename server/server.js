require('dotenv').config();

var https = require('https');
var http = require('http');
var fs = require('fs');

const app = require('./src/app');
const port = process.env.SERVER_PORT || 3000;
const address = process.env.SERVER_ADDRESS || 'localhost';

try {
  var options = {
    key: fs.readFileSync(process.env.HTTPS_KEY),
    cert: fs.readFileSync(process.env.HTTPS_CERT)
  };

  let httpsServer = https.createServer(options, app);
  httpsServer.listen(port, address, () => console.log(`HTTPS server at ${address}:${port}`));
} catch (error) {
  console.log('Key or Certificate not found. Instancing non secure server');

  let httpServer = http.createServer(app);
  httpServer.listen(port, address, () => console.log(`HTTP server at ${address}:${port}`));
}
