const session = require('koa-session');
const { redis } = require('./redis');

module.exports = app => session({
  store: {
    maxAge: 86400000,
    get: async (key) => {
      const result = await redis.get(`airx:sess:${key}`);
      return JSON.parse(result || '{}');
    },
    set: async (key, sess, maxAge = 86400) => {
      const result = await redis.setex(`airx:sess:${key}`, maxAge, JSON.stringify(sess));
      return result;
    },
    destroy: async (key) => {
      const result = await redis.del(`airx:sess:${key}`);
      return result;
    }
  }
}, app);
