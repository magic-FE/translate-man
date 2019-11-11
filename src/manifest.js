const pkg = require('../package.json')

module.exports = {
  'manifest_version': 2,
  'minimum_chrome_version': '42',
  'name': '__MSG_app_name__',
  'version': pkg.version,
  'author': pkg.author,
  'description': '__MSG_app_description__',
  'default_locale': 'en',
  'icons': {
    '16': 'icons/icons16.png',
    '19': 'icons/icons19.png',
    '38': 'icons/icons38.png',
    '48': 'icons/icons48.png',
    '96': 'icons/icons96.png',
    '128': 'icons/icons128.png',
    '192': 'icons/icons192.png',
  },
  'browser_action': {
    'default_icon': {
      '16': 'icons/icons16.png',
      '19': 'icons/icons19.png',
      '38': 'icons/icons38.png',
      '48': 'icons/icons48.png',
      '96': 'icons/icons96.png',
      '128': 'icons/icons128.png',
      '192': 'icons/icons192.png',
    },
    'default_title': '__MSG_app_name__',
    'default_popup': 'popup.html',
  },
  'commands': {
    '_execute_browser_action': {
      'suggested_key': {
        'default': 'Ctrl+Q',
        'mac': 'MacCtrl+Q',
      },
      'description': 'Opens popup.html',
    }
  },
  'content_scripts': [{
    'matches': ['<all_urls>'],
    'css': ['css/style.css'],
    'js': ['js/popup.js'],
    'all_frames': true
  }],
  'background': {
    'scripts': ['js/background.js'],
    'persistent': false,
  },
  'permissions': [
    'storage',
    'https://translate.google.com/',
    'https://translate.google.cn/',
  ],
  'content_security_policy': "script-src 'self' 'unsafe-eval'; object-src 'self'",
  'web_accessible_resources': [
    'static/*.*',
  ]
}
