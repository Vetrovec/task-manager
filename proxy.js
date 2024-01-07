const http = require("http"),
  httpProxy = require("http-proxy");

const proxy = httpProxy.createProxyServer({});

function getTarget(req) {
  if (req.url.startsWith("/api")) {
    return "http://localhost:3001";
  }
  return "http://localhost:3002";
}

function handler(req, res) {
  proxy.web(
    req,
    res,
    {
      target: getTarget(req),
    },
    () => {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "proxy_error" }));
    },
  );
}

const server = http.createServer(handler);

server.on("upgrade", function (req, socket, head) {
  proxy.ws(req, socket, head, {
    target: getTarget(req),
  });
});

server.listen(3000, () => {
  console.log("Proxy listening on port 3000");
});
