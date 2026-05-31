const http = require('http');
const https = require('https');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  secure: true,
  ws: true,
  xfwd: true,
  timeout: 120000,
  proxyTimeout: 120000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'
  }
});

http.createServer((req, res) => {
  if (req.url === '/' || req.url === '') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <h1>CrazyGames Proxy</h1>
      <p><strong>Use format:</strong> /https://www.crazygames.com</p>
      <p><a href="/https://www.crazygames.com">→ Open CrazyGames</a></p>
    `);
    return;
  }

  let target = req.url.slice(1);
  if (!target.startsWith('http')) {
    target = 'https://' + target;
  }

  proxy.web(req, res, { 
    target: target,
    headers: {
      'Referer': target,
      'Origin': new URL(target).origin,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  }, (err) => {
    console.error(err);
    res.writeHead(502, {'Content-Type': 'text/html'});
    res.end('<h2>Proxy Error</h2><p>CrazyGames blocked the request or the game is not compatible.</p>');
  });
}).listen(10000);

console.log('✅ Proxy ready');
