const path = require('path')

const ROOT_PATH = path.join(__dirname, '../../')
const SRC_PATH = path.join(ROOT_PATH, 'src')
const DIST_PATH = path.join(ROOT_PATH, 'dist')
const ASSETS_PATH = path.join(ROOT_PATH, 'assets')
const ENTRY_PATH = {
  popup: path.join(SRC_PATH, 'entry/popup.js'),
  background: path.join(SRC_PATH, 'entry/background.js'),
}
const MANIFEST_FILE = path.join(SRC_PATH, 'manifest.js')

module.exports = {
  ROOT_PATH,
  SRC_PATH,
  DIST_PATH,
  ASSETS_PATH,
  ENTRY_PATH,
  MANIFEST_FILE,
  PUBLIC_PATH: '/',
  URL_LOADER_LIMIT: 10000,
}
