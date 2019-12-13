/**
 * config
 */

const path = require('path');

module.exports = {
  path: {
    root: __dirname,
    src: path.join(__dirname, 'src'),
    node_modules: path.join(__dirname, 'node_modules'),
    dist: path.join(__dirname, 'dist'),
    publicPath: '/'
  }
};
