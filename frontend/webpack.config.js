'use strict';

const webpack = require('webpack');
const MINIFY = process.argv.indexOf('--minify') !== -1;

module.exports = {
  entry: {
    app: './app.src.js'
  },
  output: {
    filename: 'app.js',
    path: __dirname
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-0'],
          plugins: [
            ['transform-react-jsx', {
              pragma: 'h'
            }],
            // ['typecheck', {
            //   disable: {
            //     production: true
            //   }
            // }],
            'syntax-flow',
            'transform-flow-strip-types',
            'transform-runtime'
          ],
          cacheDirectory: true
        },
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.css/,
        loader: 'style!css?minimize'
      }
    ]
  },
  plugins: MINIFY ? [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ] : []
};