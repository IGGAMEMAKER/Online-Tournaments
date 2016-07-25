'use strict';
const LiveReloadPlugin = require('webpack-livereload-plugin');
const webpack = require('webpack');
const MINIFY = process.argv.indexOf('--minify') !== -1;

const currentDir = __dirname;

const JS_DIST_DIR = `${currentDir}/public/`;
const ESLINT_CONFIG_FILE = __dirname + '/.eslintrc';

const pages = 'pages/'; //pages root${
const games = 'pages/Games'; //pages root${

module.exports = [{
  name: 'react',
  entry: {
    // app: './app.src.js',
    app: `./${pages}/index.js`,
    // Teams: `./${pages}/Team.js`,
    // Index: `./${pages}/Index.js`,
    // Packs: `./${pages}/Pack.js`,
    // Profile: `./${pages}/Profile.js`,
    // Tournaments: `./${pages}/Tournaments.js`,
    // payments: `./${pages}/Payment.js`,
    'admin-tournaments': `./${pages}/Admin.js`,
    'admin': `./${pages}/admin.js`,
    // total: `./${pages}/TotalTest.js`,
    Modal: `./${pages}/Modal.js`,
    Football: `./${games}/Football.js`
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
      port: 35739
    }),
    // new webpack.optimize.UglifyJsPlugin({minimize: true})
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
