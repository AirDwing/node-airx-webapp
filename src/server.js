const Koa = require('koa');

const app = new Koa();

app.use(async (ctx) => {
  ctx.body = { status: 1 };
});

module.exports = app;
