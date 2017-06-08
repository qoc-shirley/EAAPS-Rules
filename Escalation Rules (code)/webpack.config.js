// webpack.config.js
const webpack = require('webpack');

const config = {
  context: '/Users/shirley.xiao/projects/EAAPS-Rules',
  entry: './eaaps_rules.js',
  output: {
    path: '/Users/shirley.xiao/projects/EAAPS-Rules',
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      include: '/Users/shirley.xiao/projects/EAAPS-Rules',
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            ['es2015', { modules: false }]
          ]
        }
      }]
    }]
  },
};

module.exports = config;