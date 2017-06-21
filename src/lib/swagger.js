const r = require('request');
const { getDefer, isEmpty } = require('@dwing/common');

const { api: apiOptions } = require('../../config');
const { get, set } = require('./redis');

const redis = { set, get };

const request = (options) => {
  const deferred = getDefer();
  r(options, (err, res) => {
    if (err) {
      deferred.reject(err);
    } else {
      try {
        deferred.resolve(JSON.parse(res.body));
      } catch (e) {
        deferred.reject(err);
      }
    }
  });
  return deferred.promise;
};

const getSwagger = async () => {
  const result = await request({
    method: 'GET',
    url: apiOptions.doc,
    timeout: 5000
  });
  const paths = result.paths;
  const app = {
    host: result.host,
    paths: Object.keys(paths).reduce((p, x) => {
      /* eslint no-param-reassign:0 */
      const method = Object.keys(paths[x])[0];
      p[x] = paths[x][method].parameters.map(t => t.name);
      return p;
    }, {})
  };
  return app;
};

module.exports = async () => {
  let app = await redis.get('app');
  if (isEmpty(app)) {
    app = await getSwagger();
    await redis.set('app', app);
  }
  return app;
};
