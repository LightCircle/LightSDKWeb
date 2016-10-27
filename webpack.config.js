'use strict';

module.exports = {
  entry: {
    buttongroup: './index.js'
  },

  output: {
    path: __dirname,
    filename: 'bundle.js',
    library: 'light',
    libraryTarget: 'umd'
  }
};