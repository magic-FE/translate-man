const webpack = require('webpack')
const merge = require('webpack-merge')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const baseWebpack = require('./webpack.base')

module.exports = merge(baseWebpack, {
  watch: true,

  devtool: '#cheap-module-eval-source-map',

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"',
    }),
    new FriendlyErrorsPlugin()
  ],
})
