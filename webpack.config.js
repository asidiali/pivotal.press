const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const options = {
  name: 'client',
  entry: [
    'babel-polyfill',
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './src/_core/index.js',
  ],
  output: {
    path: './',
    filename: 'app.bundle.js',
  },
  target: 'web',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react', 'stage-0'],
          plugins: [
            'transform-decorators-legacy',
            'react-hot-loader/babel'
          ]
        },
        progress: true,
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Pivotal.Press',
      template: './src/_core/index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: { warnings: false }
    // }),
  ],
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};

// options.target = webpackTargetElectronRenderer(options);

module.exports = options;
