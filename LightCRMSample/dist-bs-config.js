const { createProxyMiddleware } = require("http-proxy-middleware");

const apiProxy = createProxyMiddleware( "/LightCRM.NetEnviroment", {
  "target": "http://10.122.172.114:8082/LightCRM.NetEnviroment/",
  "secure": false,
  "changeOrigin": true,
  "logLevel": "debug",
  "pathRewrite": {
    "^/LightCRM.NetEnviroment": ""
   }
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
