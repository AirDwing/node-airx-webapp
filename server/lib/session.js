const session = require('koa-session');
const { redis } = require('./redis');

module.exports = app => session({
  store: {
    get: async (key) => {
      const result = await redis.get(`aix:sess:${key}`);
      return JSON.parse(result || '{}');
    },
    set: async (key, sess, maxAge = 86400) => {
      const result = await redis.setex(`aix:sess:${key}`, maxAge, JSON.stringify(sess));
      return result;
    },
    destroy: async (key) => {
      const result = await redis.del(`aix:sess:${key}`);
      return result;
    }
  }
}, app);
