const path = require('path');
const fs = require('fs');
const proxy = require('./lib/cors-anywhere');

let config = {};

if (fs.existsSync(path.resolve(__dirname, './config.js'))) {
  config = require('./config');
}

const host = config.host || '0.0.0.0';
const port = config.port || 8080;

const proxyConfig = {
  originBlacklist: config.originBlacklist || [],
  originWhiteList: config.originWhiteList || [],
  requireHeader: config.requireHeader || ['origin', 'x-requested-with'],
  removeHeaders: config.removeHeaders || [],
  redirectSameOrigin: config.redirectSameOrigin || true,
  httpProxyOptions: {
    xfwd: config.xfwd || true,
  },
};

let rateLimit = {};

if (config.checkRateLimit && config.rateLimit) {
  rateLimit = require('./lib/rate-limit')(config.rateLimit);
}

proxy.createServer({
  ...proxyConfig,
  ...rateLimit,
}).listen(port, host, () => {
  console.log(`cors-anywhere is running on ${host}:${port}`);
});
