const { createProxyMiddleware } = require("http-proxy-middleware");

const apiProxy = createProxyMiddleware("/globantdemoservices", {
  target: "http://localhost",
  changeOrigin: true
});

module.exports = {
  port: 9090,
  open: true,
  logLevel: "silent",
  server: {
    middleware: {
      10: apiProxy
    },
    baseDir: "dist",
    routes: {
      "/node_modules": "node_modules"
    }
  }
};
