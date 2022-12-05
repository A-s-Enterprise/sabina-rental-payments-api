const package = require('./package.json');

require('dotenv').config({ path: './.env.test' })
/**
 * @type {import('ts-jest/dist/types').InitialOptionsTsJest} 
 */
module.exports = {
  ...package.jest,
  setupFiles: ['dotenv/config'],
  testRegex: '.*\\.integration.ts$',
}