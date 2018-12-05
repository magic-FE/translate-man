const $fetch = option => {
  if (!(option && option.url)) {
    console.log('option need object type or object.url key not pass')
  }
  return new Promise((resolve, reject) => {
    browser.runtime.sendMessage(option, response => {
      if (response && response.error) {
        reject(response.error)
      } else {
        resolve(response)
      }
    })
  }).then(response => {
    if (option.type === 'arrayBuffer') {
      return new Uint8Array(JSON.parse(response)).buffer
    }
    return response
  })
}

// 获取文字真实渲染宽高
const getRect = node => {
  const char = '&#8203;'
  const pre = document.createElement('mark')
  const post = document.createElement('mark')
  pre.style.visibility = 'hidden'
  post.style.visibility = 'hiden'
  pre.innerHTML = char
  post.innerHTML = char
  node.appendChild(post)
  node.insertBefore(pre, node.firstChild)
  const prePos = pre.getBoundingClientRect()
  const postPos = post.getBoundingClientRect()
  pre.remove()
  post.remove()
  if (prePos.y === postPos.y) {
    // 单行
    return {
      width: postPos.x - prePos.x,
      height: postPos.height,
      x: prePos.x,
      y: prePos.y
    }
  }
  return node.getBoundingClientRect()
}

const saveAndSendMessage = value => {
  browser.storage.local.set(value)
  browser.tabs.query({}, tabs => {
    tabs.forEach(tab => {
      browser.tabs.sendMessage(tab.id, { type: 'reload' })
    })
  })
}

const POPENV = !!browser.windows

/**
 * Array undefined like [,,] will be parsed error
 * Add null value to undefined array
 */
const fixArrayError = responseText => {
  let text = responseText.replace(/\[,/g, '[null,')
  text = text.replace(/,\]/g, ',null]')
  text = text.replace(/,{2,}/g, result => result.split('').join('null'))
  return JSON.parse(text)
}

const getUILanguage = () => {
  let language = browser.i18n.getUILanguage() || 'en'
  if (language.slice(0, 2) === 'en') {
    language = 'en'
  }
  language = language.replace(/_/g, '-')
  return language
}

const getRangeFromPoint = (clientX, clientY) => {
  let range
  let node
  let offsetRange
  try {
    // ref:https://developer.mozilla.org/en-US/docs/Web/API/Document/caretPositionFromPoint
    if (document.caretPositionFromPoint) {
      range = document.caretPositionFromPoint(clientX, clientY)
      node = range.offsetNode
      offsetRange = range.offset
    } else if (document.caretRangeFromPoint) {
      range = document.caretRangeFromPoint(clientX, clientY)
      node = range.startContainer
      offsetRange = range.startOffset
    } else {
      return ''
    }
  } catch (e) {
    return ''
  }

  return {
    node,
    offset: offsetRange,
  }
}

/**
* getWordFromPoint
* get a word depend on the point, if the pointer has no word or space will return empty string
* @param  {int} clientX [x pointer]
* @param  {int} clientY [y pointer]
* @return {string} the pointer string
*/
const getWordFromPoint = (clientX, clientY, exceptEle) => {
  // refefer: http://stackoverflow.com/questions/2444430/how-to-get-a-word-under-cursor-using-javascript
  let range = null
  let textNode = null
  let begin = null
  let end = null
  // 分割符号
  // eslint-disable-next-line no-control-regex
  const breakWord = /((?=[\x00-\x7e]+)[^A-Za-z-'])/
  const hasParents = (dom, parent) => {
    let parentNode = parent
    let domNode = dom
    if (!parentNode) {
      return false
    }

    if (typeof domNode === 'string') {
      domNode = document.querySelector(domNode)
    }

    if (typeof parentNode === 'string') {
      parentNode = document.querySelector(parentNode)
    }

    const a = [domNode]
    let i = 1
    while ((a[0] = a[0]['parentNode']) && a[0].nodeType !== 9) {
      if (parentNode === a[0]) {
        a[i] = a[0]
        i++
      }
    }
    return i === 2
  }

  range = getRangeFromPoint(clientX, clientY)

  textNode = range.node
  let { offset } = range

  // only TEXT_NODEs
  if (!textNode || textNode.nodeType !== Node.TEXT_NODE) {
    return ''
  }

  // 去除父元素
  if (hasParents(textNode, exceptEle)) {
    return ''
  }

  // 去除不在元素内的对象
  let rect
  const containerNode = textNode.parentNode
  if (containerNode) {
    rect = getRect(containerNode)
    if (clientX < rect.x || clientX > rect.x + rect.width || clientY < rect.y || clientY > rect.y + rect.height) {
      return ''
    }
  }

  const { data } = textNode

  // Sometimes the offset can be at the 'length' of the data.
  // It might be a bug with this 'experimental' feature
  // Compensate for this below
  if (offset >= data.length) {
    offset = data.length - 1
  }

  // ignore break word, there are not word
  if (data[offset].match(breakWord)) {
    return ''
  }

  // get begin
  for (let i = offset; i > -1; i--) {
    if (i === 0 || data[i - 1].match(breakWord)) {
      begin = i
      break
    }
  }

  for (let j = offset; j < data.length + 1; j++) {
    if (j === data.length || data[j].match(breakWord)) {
      end = j
      break
    }
  }

  return data.substring(begin, end)
}

const xss = word => {
  let s = word
  s = s.replace(/&/g, '&amp;')
  s = s.replace(/</g, '&lt;')
  s = s.replace(/>/g, '&gt;')

  return s
}

export {
  $fetch,
  saveAndSendMessage,
  POPENV,
  fixArrayError,
  getUILanguage,
  getRangeFromPoint,
  getWordFromPoint,
  xss,
}
