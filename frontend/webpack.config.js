'use strict';
const LiveReloadPlugin = require('webpack-livereload-plugin');
const webpack = require('webpack');
const MINIFY = process.argv.indexOf('--minify') !== -1;

const currentDir = __dirname;

const JS_DIST_DIR = `${currentDir}/public/`;
const STYLES_SRC_DIR = `${currentDir}/styles/`;
const STYLES_DIST_DIR = `${currentDir}/public/css/new/`;
const ESLINT_CONFIG_FILE = __dirname + '/.eslintrc';
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const pages = 'pages/'; //pages root${
const games = 'pages/Games'; //pages root${

module.exports = [{
  name: 'styles',
  cache: true,
  entry: {
    // Add more entry point styles
    index: `${STYLES_SRC_DIR}/index.styl`
  },
  output: {
    path: STYLES_DIST_DIR,
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!stylus-loader')
      }
    ]
  },
  // postcss: () => ({
  //   defaults: [
  //     lost,
  //     assets,
  //     customMedia,
  //     fontMagician({
  //       hosted: `${__dirname}/src/fonts`
  //     }),
  //     autoprefixer
  //   ]
  // }),
  plugins: [
    new ExtractTextPlugin('[name].css'),
    new LiveReloadPlugin({
      port: 35739
    })
    // Add more instances of HtmlWebpackPlugin for configuration of more html pages
    // new HtmlWebpackPlugin({
    //   filename: `${HTML_DIST_DIR}/index.html`,
    //   template: `${HTML_SRC_DIR}/index.html`,
    //   inject: false
    // })
  ]
}, {
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
    admin: `./${pages}/admin.js`,
    // total: `./${pages}/TotalTest.js`,

    // Modal: `./${pages}/Modal.js`,
    // Football: `./${games}/Football.js`
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
