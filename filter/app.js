const http = require('http');
const httpProxy = require('http-proxy');
const webServer = process.env.APP_URL;
const proxy = httpProxy.createServer();

const { initDB, saveResponse } = require('./collector');

initDB();

http.createServer((req, res) => {
  console.log(`Receiving reverse proxy request for: ${req.url}`);

  res.on('pipe', (proxyRes) => {
    const contentType = proxyRes.headers['content-type'];
    if (contentType === undefined || !(contentType.includes('text/html'))) {
      return;
    }

    let data = Buffer.alloc(0);
    proxyRes.on('data', (chunk) => {
      data = Buffer.concat([data, chunk]);
    });
    proxyRes.on('end', () => {
      const isGzipped = /gzip/.test(proxyRes.headers['content-encoding']);
      if (isGzipped) {
        data = zlib.gunzipSync(data);
      }

      saveResponse(req.method, req.url, data);
    });
  });

  proxy.web(req, res, { target: webServer });
}).listen(8000);
