// server.js
const http = require('http');
const os = require('os');
const fs = require('fs');
const path = require('path');

// ✅ เก็บ log นอก wwwroot (โฟลเดอร์มาตรฐานของ App Service)
const LOG_DIR = process.env.LOG_DIR || path.join('/home', 'LogFiles', 'application');
fs.mkdirSync(LOG_DIR, { recursive: true });
const logFilePath = path.join(LOG_DIR, 'log.txt');
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

function log(msg) {
  const timestamp = new Date().toISOString();
  const fullMsg = `[${timestamp}] ${msg}`;
  console.log(fullMsg);
  logStream.write(fullMsg + '\n');
}

const server = http.createServer((req, res) => {
  const { method, url, headers } = req;
  log(`${method} ${url} from ${headers['user-agent']}`);

  try {
    if (url === '/healthz' && method === 'GET') {
      const response = {
        status: 'ok',
        uptime: process.uptime(),
        hostname: os.hostname(),
        memory: process.memoryUsage(),
        version: process.version
      };
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      return res.end(JSON.stringify(response));
    }

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('✅ Discord Bot is up and running');

  } catch (err) {
    log(`❌ HTTP Server error: ${err.message}`);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'error', message: err.message }));
  }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  log(`🌐 HTTP Server running on port ${PORT}`);
});

try {
  require('./index'); // server นี้จะ require index.js ตามเดิม 
  log('🤖 Discord bot started successfully');
} catch (err) {
  log(`❌ Discord bot failed to start: ${err.message}`);
}

process.on('uncaughtException', (err) => log(`🧨 Uncaught Exception: ${err.stack}`));
process.on('unhandledRejection', (reason, promise) => log(`🧨 Unhandled Rejection at: ${promise} reason: ${reason}`));
