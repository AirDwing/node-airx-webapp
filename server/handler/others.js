const SDK = require('@airx/sdk');
const { isEmpty, getTimestamp, randStr } = require('@dwing/common');
const { encode } = require('@airx/authcode');

const { doLogin } = require('../lib/helper');
const { api: apiOptions } = require('../config');

module.exports = async (ctx) => {
  const method = ctx.request.method.toLowerCase();
  const receivedParams = method === 'get' ? ctx.query : ctx.request.body;

  const sdk = new SDK({
    SecretId: apiOptions.ak,
    SecretKey: apiOptions.sk,
    Domain: ctx.api.host,
    Secure: apiOptions.scheme === 'https'
  });

  // 处理请求参数
  const params = ctx.api.paths[ctx.path];
  if (params.indexOf('auth') !== -1) {
    // 处理需要 登录 的接口
    const auth = ctx.session.auth;
    if (isEmpty(auth)) {
      ctx.status = 200;
      ctx.body = { status: 0, code: 401 };
      return;
    }
    const ttl = ~~ctx.session.ttl;
    // 处理登录超时(1小时),提前10分钟重新获取auth
    if (ttl - getTimestamp() < 600) {
      const tmpParams = JSON.parse(ctx.session.params);
      const login = await sdk.post('/user/login', tmpParams);
      const loginResult = doLogin(ctx, login, tmpParams);
      // 密码被修改等无法登录
      if (loginResult === -1) {
        ctx.status = 200;
        ctx.body = { status: 0, code: 401 };
        return;
      }
    }

    receivedParams.auth = auth;
  }

  if (params.indexOf('guid') !== -1) {
    // 处理需要 guid 的接口
    const guid = ctx.session.guid;
    receivedParams.guid = guid;
  }

  if (params.indexOf('device') !== -1) {
    // 处理需要登录设备名称的接口
    receivedParams.device = 'AirX网页版';
  }

  if (params.indexOf('password') !== -1) {
    // 处理需要 authcode加密 的接口
    receivedParams.key = randStr(6);
    receivedParams.passwod = encode(receivedParams.passwod, receivedParams.key);
  }

  const result = await sdk[method](ctx.path, receivedParams);
  // 记录登录信息
  if (ctx.path === '/user/login') {
    doLogin(ctx, result, receivedParams);
  }
  ctx.status = 200;
  ctx.body = result;
};
