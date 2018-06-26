const constants = require('./constants')

module.exports = {
  plugins: [
    require('postcss-import')({
      path: constants.ROOT_PATH,
    }),
    require('postcss-nested'),
    require('postcss-cssnext')({
      browsers: [
        'last 2 versions',
        'iOS >= 7',
        'Android >= 4.0',
      ],
    }),
  ],
}
