const parse = require('await-busboy');
const SDK = require('@airx/sdk');
const { doLogin } = require('../lib/helper');
const { isEmpty, getTimestamp } = require('@dwing/common');

const { api: apiOptions } = require('../config');

module.exports = async (ctx) => {
  const parts = parse(ctx, {
    autoFields: true
  });
  let part;
  const file = {};
  /* eslint no-cond-assign:0, no-await-in-loop:0 */
  while (part = await parts) {
    if (part.filename) {
      file.value = part.read();
      file.options = {
        filename: part.filename,
        contentType: part.mimeType
      };
    } else {
      part.resume();
    }
  }
  // 处理需要 登录 的接口
  const auth = ctx.session.auth;
  if (isEmpty(auth)) {
    ctx.status = 200;
    ctx.body = { status: 0, code: 401 };
    return;
  }

  const sdk = new SDK({
    SecretId: apiOptions.ak,
    SecretKey: apiOptions.sk,
    Domain: ctx.api.host,
    Secure: apiOptions.scheme === 'https'
  });

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
  const result = await sdk.upload({
    auth,
    type: parts.field.type,
    file
  }, ctx.path);
  ctx.status = 200;
  ctx.body = result;
};
