const ENV = process.env.NODE_ENV || 'development';
const options = require(`./_${ENV}`);

module.exports = options;
