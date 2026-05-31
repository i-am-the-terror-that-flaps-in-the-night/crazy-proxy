const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  secure: true,
  ws: true,                    // Important for CrazyGames
  timeout: 60000,
  proxyTimeout: 60000
});

http.createServer((req, res) => {
  if (req.url === '/' || req.url === '') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <h1>CrazyGames Proxy</h1>
      <p>Use: <code>https://your-app.onrender.com/https://www.crazygames.com</code></p>
      <p>Example: <a href="/https://www.crazygames.com">Open CrazyGames</a></p>
    `);
    return;
  }

  let target = req.url.slice(1); // remove leading /
  if (!target.startsWith('http')) {
    target = 'https://' + target;
  }

  proxy.web(req, res, { target: target }, (err) => {
    console.error(err);
    res.writeHead(500);
    res.end('Proxy error');
  });
}).listen(process.env.PORT || 3000);

console.log('Proxy running');