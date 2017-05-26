// webpack.config.js
const webpack = require('webpack');

const config = {
  context: '/Users/shirley.xiao/projects/EAAPS-Rules'/*path.resolve(__dirname, 'src')*/,
  entry: './eaaps_rules.js',
  output: {
    path: '/Users/shirley.xiao/projects/EAAPS-Rules'/*path.resolve(__dirname, 'dist')*/,
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      include: '/Users/shirley.xiao/projects/EAAPS-Rules'/*path.resolve(__dirname, 'src')*/,
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
  /*js-Beautify: {
    "indent_size": 2,
    "indent_char": "  ",
    "space_after_anon_function": true
  },
  module: {
    preLoaders: [
      {
        test: /\.(js|html)$/,
        exclude: /node_modules/,
        loader: 'jsbeautify-loader'
      }
    ]
  }*/
};

module.exports = config;