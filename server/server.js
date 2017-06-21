const Koa = require('koa');
const send = require('koa-send');
const SDK = require('@airx/sdk');
const { isEmpty } = require('@dwing/common');

const session = require('./lib/session');
const swagger = require('./lib/swagger');
const { keys, api: apiOptions } = require('./config');

const app = new Koa();

app.keys = keys;

app.use(session(app));

app.use(async (ctx) => {
  const api = await swagger();
  const path = api.paths[ctx.path];
  if (path === undefined) {
    // 前后端分离, 处理前端相关静态文件
    await send(ctx, ctx.path, { root: `${__dirname}/../dist` });
    return;
  }
  // 处理后端接口
  const params = path.params;
  const method = ctx.request.method.toLowerCase();
  const receivedParams = method === 'get' ? ctx.query : ctx.request.body;

  const sdk = new SDK({
    SecretId: apiOptions.ak,
    SecretKey: apiOptions.sk,
    Domain: api.host,
    Secure: apiOptions.scheme === 'https'
  });
  if (ctx.path !== '/upload') {
    if (params.indexOf('auth') !== -1) {
      // 处理需要登录的接口
      const auth = ctx.session.auth;
      if (isEmpty(auth)) {
        ctx.status = 200;
        ctx.body = { status: 0, code: 401 };
        return;
      }
      receivedParams.auth = auth;
    }
    const result = await sdk[method](ctx.path, receivedParams);
    if (ctx.path === '/user/login') {
      ctx.session.auth = result.data.auth;
      ctx.session.params = receivedParams;
    }
    // 处理登录超时(1小时重新登录)
    ctx.status = 200;
    ctx.body = result;
  } else {
    // 处理上传
  }
});

module.exports = app;
