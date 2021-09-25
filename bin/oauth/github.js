const Koa = require("koa");
const router = require("koa-router")();
const static = require("koa-static");
const app = new Koa();
const axios = require("axios-https-proxy-fix");
// const axios = require('axios-https-proxy-fix')
const querystring = require("querystring");
const open = require("open");

app.use(static(__dirname + "/"));
const config = {
  client_id: "0cd81b35aceac0e8db2a",
  client_secret: "7850b66333944341012ba7e3dfae4c788cbd548d",
};

router.get("/auth/github/login", async (ctx) => {
  var dataStr = new Date().valueOf();
  //重定向到认证接口,并配置参数
  var path = "https://github.com/login/oauth/authorize";
  path += "?client_id=" + config.client_id;

  //转发到授权服务器
  ctx.redirect(path);
});
router.get("/auth/github/callback", async (ctx) => {
  console.log("callback..", ctx.url);
  const code = ctx.query.code;
  const params = {
    client_id: config.client_id,
    client_secret: config.client_secret,
    code: code,
  };

  // let res = await axios.post({
  //     url: 'https://github.com/login/oauth/access_token',
  //     proxy: true,
  //     data: params
  // })
  console.log(process.env.NODE_ENV);

  let res = await axios.post(
    "https://github.com/login/oauth/access_token",
    params,
    {
      proxy: {
        host: "127.0.0.1",
        port: "7890",
      },
    }
  );

  console.log("login", res.data);
  const access_token = querystring.parse(res.data).access_token;

  // ctx.body = `登陆成功`

  console.log("access_token", access_token);
  res = await axios.get("https://api.github.com/user", {
    headers: {
      accept: "application/json",
      Authorization: `token ${access_token}`,
    },
    proxy: {
      host: "127.0.0.1",
      port: "7890",
    },
  });

  console.log("userAccess:", res.data);
  ctx.body = `
        <div align="center">
        <h1>Hello ${res.data.login}, login success</h1>
        <img src="${res.data.avatar_url}" alt=""/>
        </div>
    `;

  setTimeout(() => {
    console.log("login success");
    process.exit(0);
  }, 3000);
});

app.use(router.routes()); /*启动路由*/
app.use(router.allowedMethods());
app.listen(20219);

const openBrowser = async () => {
  await open("http://localhost:20219/auth/github/login");
};

openBrowser();
