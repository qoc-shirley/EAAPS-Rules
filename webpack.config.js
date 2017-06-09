// webpack.config.js
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack');

const config = {
  context: '/Users/shirley.xiao/projects/EAAPS-Rules/src/Components/App',
  entry: './App.jsx',
  output: {
    path: '/Users/shirley.xiao/projects/EAAPS-Rules',
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.jsx$/,
      include: '/Users/shirley.xiao/projects/EAAPS-Rules',
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            ['es2015', { modules: false }]
          ]
        }
      }]
    },
    { 
      test: /\.scss$/, 
      loader: ExtractTextPlugin.extract("style", "css!sass") 
    }]
  },
};

module.exports = config;