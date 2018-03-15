const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpack = require('./webpack.base')
const ChromeReloadPlugin = require('wcer')
const constants = require('./config/constants')


module.exports = merge(baseWebpack, {
  plugins: [
    new ChromeReloadPlugin({
      port: 9090,
      manifest: constants.MANIFEST_FILE,
    }),
  ],
})
