const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpack = require('./webpack.base')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyjsES6Plugin = require('uglifyjs-webpack-plugin')
const constants = require('./config/constants')

process.env.NODE_ENV = 'production'

module.exports = merge(baseWebpack, {
  plugins: [
    new CleanWebpackPlugin([constants.DIST_PATH], {
      root: constants.ROOT_PATH,
      exclude: ['manifest.json'],
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true,
      },
    }),
    new UglifyjsES6Plugin({
      sourceMap: false,
    }),
    new webpack.HashedModuleIdsPlugin(),
  ]
})
