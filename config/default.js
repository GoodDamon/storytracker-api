const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'qa';
const config = require(`./${env === 'test' ? 'qa' : env}.json`);
module.exports = config;
