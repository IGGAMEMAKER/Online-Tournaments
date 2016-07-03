'use strict';
const LiveReloadPlugin = require('webpack-livereload-plugin');
const webpack = require('webpack');
const MINIFY = process.argv.indexOf('--minify') !== -1;

const currentDir = __dirname;

const JS_DIST_DIR = `${currentDir}/public/`;
const ESLINT_CONFIG_FILE = __dirname + '/.eslintrc';

const app = 'pages/'; //pages root${
const games = 'pages/Games'; //pages root${

module.exports = [{
  name: 'react',
  entry: {
    app: './app.src.js',
    Teams: `./${app}/Team.js`,
    Index: `./${app}/Index.js`,
    Packs: `./${app}/Pack.js`,
    Tournaments: `./${app}/Tournaments.js`,
    payments: `./${app}/Payment.js`,
    'admin-tournaments': `./${app}/Admin.js`,
    // total: `./${app}/TotalTest.js`,
    Modal: `./${app}/Modal.js`,
    Football: `./${games}/Football.js`,
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
  plugins: [
    new LiveReloadPlugin({
      port: 35729
    })
  ],
  // eslint: {
  //   configFile: ESLINT_CONFIG_FILE
  // },

  // plugins: MINIFY ? [
  //   new webpack.optimize.UglifyJsPlugin({
  //     compress: {
  //       warnings: false
  //     }
  //   }),
  //   new LiveReloadPlugin({
  //     port: 35729
  //   })
  // ] : []
}];
