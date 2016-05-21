'use strict';

const webpack = require('webpack');
const MINIFY = process.argv.indexOf('--minify') !== -1;

const currentDir = __dirname;

const JS_DIST_DIR = `${currentDir}/public/`;

module.exports = [{
  name: 'react',
  entry: {
    app: './app.src.js',
    Teams: './app/Team/Team.js'
  },
  output: {
    // filename: 'app.js',
    // path: __dirname
    filename: '[name].js',
    path: `${JS_DIST_DIR}/output`
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
    }),
    new LiveReloadPlugin({
      port: 35729
    })
  ] : []
}];