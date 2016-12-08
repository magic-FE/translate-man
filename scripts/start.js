// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'development';

// Load environment variables from .env file. Surpress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.
// https://github.com/motdotla/dotenv
require('dotenv').config({silent: true});

var chalk = require('chalk');
var fs = require('fs-extra');
var path = require('path');
var gzipSize = require('gzip-size').sync;
var rimrafSync = require('rimraf').sync;
var webpack = require('webpack');
var config = require('../config/webpack.config');
var paths = require('../config/paths');
var checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
var recursive = require('recursive-readdir');
var stripAnsi = require('strip-ansi');

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  console.log('can not find appHtml and appIndexJs file, make sure you have write this files.');
  process.exit(1);
}

// Input: /User/dan/app/build/static/js/main.82be8.js
// Output: /static/js/main.js
function removeFileNameHash(fileName) {
  return fileName
    .replace(paths.appBuild, '')
    .replace(/\/?(.*)(\.\w+)(\.js|\.css)/, (match, p1, p2, p3) => p1 + p3);
}

// First, read the current file sizes in build directory.
// This lets us display how much they changed later.
recursive(paths.appBuild, (err, fileNames) => {
  var previousSizeMap = (fileNames || [])
    .filter(fileName => /\.(js|css)$/.test(fileName))
    .reduce((memo, fileName) => {
      var contents = fs.readFileSync(fileName);
      var key = removeFileNameHash(fileName);
      memo[key] = gzipSize(contents);
      return memo;
    }, {});

  // Remove all build static but keep the directory so that
  // if you're in it, you don't end up in Trash
  rimrafSync(paths.appBuild + '/static/*');

  // Start the webpack build
  build(previousSizeMap);

});

// Create the production build and print the deployment instructions.
function build(previousSizeMap) {
  var first = true;
  console.log('Creating an development build...\n');
  webpack(config).watch(200, (err, stats) => {
    if (err) {
      console.error('Failed to create a development build. Reason:');
      console.error(err.message || err);
    }
    if(first) {
      
      first = false;

      console.log(chalk.green('Compiled successfully.\n'));

      console.log('Waiting for change...');
    }
  });
}
