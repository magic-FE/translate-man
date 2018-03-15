const webpack = require('webpack')
const merge = require('webpack-merge')
const ChromeReloadPlugin = require('wcer')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const baseWebpack = require('./webpack.base')
const constants = require('./config/constants')

module.exports = merge(baseWebpack, {
  watch: true,

  devtool: '#cheap-module-eval-source-map',

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"',
    }),
    new ChromeReloadPlugin({
      port: 9090,
      manifest: constants.MANIFEST_FILE,
    }),
    new FriendlyErrorsPlugin()
  ],
})
