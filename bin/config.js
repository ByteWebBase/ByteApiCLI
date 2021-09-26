export function createConfig(answer) {
  // 适配器
  const haveMiddleware = (name) => {
    return answer.middleware.indexOf(name) !== -1;
  };
  const haveDatabase = (name) => {
    return answer.database === name;
  };
  const inputConfig = {
    packageName: answer.packageName,
    port: answer.port,
    // middleware: {
    //   static: haveMiddleware("koaStatic"),
    //   views: haveMiddleware("koaViews"),
    //   router: haveMiddleware("koaRouter"),
    //   body: haveMiddleware("koaBody"),
    // },
    database: {
      MongoDB: haveDatabase("MongoDB"),
      database_url: answer.database_url,
    },
  };

  return inputConfig;
}
