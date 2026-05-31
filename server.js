const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  secure: true,
  ws: true,
  timeout: 60000,
  proxyTimeout: 60000
});

http.createServer((req, res) => {
  if (req.url === '/' || req.url === '') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(`<h1>CrazyGames Proxy</h1><p>Use: https://your-app.onrender.com/https://www.crazygames.com</p>`);
    return;
  }

  let target = req.url.slice(1);
  if (!target.startsWith('http')) target = 'https://' + target;

  proxy.web(req, res, { target: target }, (err) => {
    res.writeHead(502, {'Content-Type': 'text/plain'});
    res.end('Proxy Error');
  });
}).listen(10000);

console.log('Proxy running on port 10000');
