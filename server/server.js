const Koa = require('koa');
const send = require('koa-send');

const session = require('./lib/session');
const swagger = require('./lib/swagger');
const { upload, others } = require('./handler');
const { keys } = require('./config');

const app = new Koa();
const ENV = process.env.NODE_ENV || 'development';

app.keys = keys;

app.use(session(app));

app.use(async (ctx, next) => {
  ctx.api = await swagger();
  const path = ctx.api.paths[ctx.path];
  // ! 仅供开发测试, 允许跨域操作很危险
  if (ENV === 'development') {
    ctx.set('Access-Control-Allow-Origin', '*');
  }
  if (path === undefined) {
    // 提供 注销接口
    if (ctx.path === '/logout') {
      ctx.session = null;
      ctx.status = 200;
      ctx.body = { status: 1 };
      return;
    }
    // 前后端分离, 处理前端相关静态文件
    try {
      await send(ctx, ctx.path, { root: `${__dirname}/../dist` });
    } catch (err) {
      ctx.status = 404;
      // 注意要添加 404.html 到 dist 目录
      // await send(ctx, '/404.html', { root: `${__dirname}/../dist` });
    }
    return;
  }
  await next();
});

app.use(async (ctx) => {
  // 处理后端接口
  // 封装sdk请求
  if (ctx.path === '/upload') {
    // 处理上传
    await upload(ctx);
  } else {
    // 处理其他接口
    await others(ctx);
  }
});

module.exports = app;
