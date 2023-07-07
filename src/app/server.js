const https = require("https");
const fs = require("fs");
const app = require("./index");

const { APP_PORT } = require("../config/config.default");

const options = {
  key: fs.readFileSync("././private_key.pem"), // 私钥文件路径
  cert: fs.readFileSync("././ca-cert.pem"), // 证书文件路径
};

https.createServer(options, app.callback()).listen(APP_PORT, () => {
  console.log("Server running on port:" + APP_PORT);
});
