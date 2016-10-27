'use strict';

var webpack = require('webpack');

module.exports = {
  entry: {
    buttongroup: './index.js'
  },

  output: {
    path: __dirname,
    filename: 'bundle.js',
    library: 'light',
    libraryTarget: 'umd'
  },

  plugins: [
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   }
    // })
  ]
};
