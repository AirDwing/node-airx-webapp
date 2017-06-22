const { getTimestamp } = require('@dwing/common');

exports.doLogin = (ctx, result, params) => {
  if (result.status === 1) {
    ctx.session.auth = result.data.auth;
    ctx.session.params = JSON.stringify(params);
    ctx.session.ttl = getTimestamp() + 3600;
    return 1;
  }
  return -1;
};

