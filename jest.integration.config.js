const packageJson = require('./package.json');
require('dotenv').config({ path: './.env.test' })
/**
 * @type import('jest').Config
 */
const config = {
  ...packageJson.jest,
  testRegex: '.*\\.integration.ts$',

};

module.exports = config;
