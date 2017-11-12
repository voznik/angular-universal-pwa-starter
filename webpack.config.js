const path = require('path');
const webpack = require('webpack');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: './server/server.ts',
  output: {
    path: path.resolve(__dirname, '../angular-universal-pwa-starter-deploy'),
    filename: 'server.js'
  },
  resolve: {
  	extensions: ['.ts', '.js']
  },
  module: {
  	loaders: [
  	  { test: /\.ts$/, loader: 'awesome-typescript-loader' }
  	]
  },
  target: 'node',
  plugins: [
    new webpack.ContextReplacementPlugin(
      // fixes WARNING Critical dependency: the request of a dependency is an expression
      /(.+)?angular(\\|\/)core(.+)?/,
      path.join(__dirname, 'server'), // location of your src
      {} // a map of your routes
    ),
    new webpack.ContextReplacementPlugin(
      /(.+)?express(\\|\/)(.+)?/,
      path.join(__dirname, 'server'),
      {}
    ), 
    new webpack.ContextReplacementPlugin(
      /(.+)?typeorm(\\|\/)(.+)?/,
      path.join(__dirname, 'server'),
      {}
    ),
    new FilterWarningsPlugin({
    	exclude: [/mongodb/, /mssql/, /mysql/, /mysql2/, /oracledb/, /redis/, /sqlite3/]
    }),
    new UglifyJSPlugin({
      exclude: [/typeorm/, /pg/, /pg-native/, /pg-query-stream/],
      uglifyOptions: {
        ecma: 8,
        mangle: false
      },
      parallel: true
    })
  ]
};
