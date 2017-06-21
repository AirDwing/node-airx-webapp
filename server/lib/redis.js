const redis = require('@dwing/redis');
const { redis: redisOptions } = require('../config');

const client = redis(redisOptions);
const db = client.select(redisOptions.db);

exports.redis = db;

exports.set = (key, val) => db.setex(`airx:${key}`, redisOptions.ttl, JSON.stringify(val));
exports.get = async (key) => {
  const result = await db.get(`airx:${key}`);
  return JSON.parse(result || '{}');
};
